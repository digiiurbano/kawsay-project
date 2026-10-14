// ============================================================
//  KAWSAY — Rutas de autenticación compartidas
//  (Servidor local backend/ y función serverless api/ en Vercel)
//
//  - POST /api/auth/forgot-password  → envía código OTP por correo
//  - POST /api/auth/reset-password   → valida código y cambia la clave
//  - POST /api/auth/google           → login / registro con Google
//  - GET  /api/config/public         → config pública (Google Client ID)
// ============================================================
const https = require('https');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail, getTransporter } = require('./mailer');

const GOOGLE_CLIENT_ID = () => process.env.GOOGLE_CLIENT_ID || '';
const RESET_CODE_TTL_MIN = 15;

// --- Helpers -------------------------------------------------
function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
}
function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, (err) => (err ? reject(err) : resolve())));
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          if (res.statusCode >= 400) return reject(new Error(json.error_description || json.error || `HTTP ${res.statusCode}`));
          resolve(json);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000)); // 6 dígitos criptográficamente seguros
}

/**
 * Verifica un token de Google (access_token del botón personalizado o
 * credential/id_token de Google Identity Services) y devuelve el perfil.
 */
async function verifyGoogleToken({ access_token, credential }) {
  const clientId = GOOGLE_CLIENT_ID();
  if (!clientId) throw new Error('Login con Google no configurado (falta GOOGLE_CLIENT_ID).');

  if (credential) {
    const info = await httpsGetJson(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (info.aud !== clientId) throw new Error('Token de Google no emitido para esta aplicación.');
    if (String(info.email_verified) !== 'true') throw new Error('El correo de Google no está verificado.');
    return { email: info.email, name: info.name || info.email.split('@')[0], picture: info.picture };
  }

  if (access_token) {
    const info = await httpsGetJson(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(access_token)}`);
    if (info.aud !== clientId && info.azp !== clientId) throw new Error('Token de Google no emitido para esta aplicación.');
    const profile = await httpsGetJson(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(access_token)}`);
    if (!profile.email || profile.email_verified === false) throw new Error('El correo de Google no está verificado.');
    return { email: profile.email, name: profile.name || profile.email.split('@')[0], picture: profile.picture };
  }

  throw new Error('Token de Google requerido.');
}

// --- Registro de rutas ---------------------------------------
function registerAuthRoutes(app, db) {
  // Configuración pública para el frontend
  app.get('/api/config/public', (req, res) => {
    res.json({
      googleClientId: GOOGLE_CLIENT_ID() || null,
      emailEnabled: !!getTransporter()
    });
  });

  // 1. Solicitar código de recuperación
  app.post('/api/auth/forgot-password', async (req, res) => {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'El correo es obligatorio.' });

    // Respuesta genérica para no revelar qué correos están registrados
    const genericMsg = 'Si el correo está registrado, recibirás un código de 6 dígitos en unos segundos.';
    try {
      const user = await dbGet(db, `SELECT id, name, email FROM users WHERE LOWER(email) = ?`, [email]);
      if (!user) return res.json({ message: genericMsg });

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MIN * 60 * 1000).toISOString();
      // Invalida códigos anteriores y guarda el nuevo
      await dbRun(db, `UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0`, [email]);
      await dbRun(db, `INSERT INTO password_resets (id, email, code, expires_at, used) VALUES (?, ?, ?, ?, 0)`,
        ['rst-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'), email, code, expiresAt]);

      const result = await sendPasswordResetEmail({ to: user.email, name: user.name, code });
      if (!result.success) return res.status(502).json({ error: 'No pudimos enviar el correo. Intenta de nuevo en unos minutos.' });

      const payload = { message: genericMsg };
      // En desarrollo sin SMTP configurado devolvemos el código para poder probar el flujo
      if (result.simulated && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) payload.devCode = code;
      res.json(payload);
    } catch (err) {
      console.error('forgot-password:', err);
      res.status(500).json({ error: 'Error interno al generar el código.' });
    }
  });

  // 2. Validar código y establecer nueva contraseña
  app.post('/api/auth/reset-password', async (req, res) => {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const code = String(body.code || '').trim();
    const newPassword = String(body.password || '');
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'Correo, código y nueva contraseña son obligatorios.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });

    try {
      const row = await dbGet(db,
        `SELECT id, expires_at FROM password_resets WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1`,
        [email, code]);
      if (!row) return res.status(400).json({ error: 'Código inválido o ya utilizado.' });
      if (new Date(row.expires_at).getTime() < Date.now()) {
        await dbRun(db, `UPDATE password_resets SET used = 1 WHERE id = ?`, [row.id]);
        return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' });
      }

      await dbRun(db, `UPDATE users SET password = ? WHERE LOWER(email) = ?`, [newPassword, email]);
      await dbRun(db, `UPDATE password_resets SET used = 1 WHERE email = ?`, [email]);
      res.json({ message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
    } catch (err) {
      console.error('reset-password:', err);
      res.status(500).json({ error: 'Error interno al restablecer la contraseña.' });
    }
  });

  // 3. Login / Registro con Google
  app.post('/api/auth/google', async (req, res) => {
    let profile;
    try {
      profile = await verifyGoogleToken(req.body || {});
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }

    const email = profile.email.trim().toLowerCase();
    try {
      let user = await dbGet(db, `SELECT id, name, email, role, avatar, bio, preferences FROM users WHERE LOWER(email) = ?`, [email]);
      let isNew = false;

      if (!user) {
        isNew = true;
        const id = 'usr-' + Date.now();
        const avatar = profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
        const bio = 'Perfil de espectador en KAWSAY';
        // Contraseña aleatoria no adivinable: la cuenta solo entra con Google
        // (o tras usar "Olvidé mi contraseña" para definir una propia).
        const randomPass = crypto.randomBytes(24).toString('hex');
        await dbRun(db, `INSERT INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, profile.name, email, randomPass, 'espectador', avatar, bio]);
        user = { id, name: profile.name, email, role: 'espectador', avatar, bio, preferences: null };
        await sendWelcomeEmail({ to: email, name: profile.name, role: 'espectador' }).catch(() => {});
      }

      if (user.preferences && typeof user.preferences === 'string') {
        try { user.preferences = JSON.parse(user.preferences); } catch (e) {}
      }
      res.json({ message: isNew ? 'Cuenta creada con Google' : 'Inicio de sesión con Google exitoso', user, isNew });
    } catch (err) {
      console.error('google auth:', err);
      res.status(500).json({ error: 'Error interno al iniciar sesión con Google.' });
    }
  });
}

module.exports = { registerAuthRoutes, sendWelcomeEmail };

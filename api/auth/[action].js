const crypto = require('crypto');
const https = require('https');
const { db, initDb } = require('../db');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../../lib/mailer');

const RESET_CODE_TTL_MIN = 15;
const GOOGLE_CLIENT_ID = () => process.env.GOOGLE_CLIENT_ID || '';

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
}

function dbRun(sql, params = []) {
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

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Obtener la acción desde query param de Vercel ([action]) o desde la URL
  let action = req.query.action;
  if (!action && req.url) {
    const match = req.url.match(/\/auth\/([^\/\?]+)/);
    if (match) action = match[1];
  }

  // 1. INICIAR SESIÓN (LOGIN)
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    const { email, password } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Correo es requerido' });

    const cleanEmail = email.trim().toLowerCase();
    return db.get(`SELECT id, name, email, role, avatar, bio, preferences, password FROM users WHERE LOWER(email) = ?`, [cleanEmail], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) {
        if (cleanEmail === 'admin@kawsay.ec') {
          const adminUser = { id: 'usr-admin-1', name: 'Admin Kawsay', email: 'admin@kawsay.ec', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Administrador principal' };
          return res.json({ message: 'Inicio de sesión exitoso', user: adminUser });
        }
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      const isDemoAccount = ['admin@kawsay.ec', 'espacio@kawsay.ec', 'artista@kawsay.ec', 'espectador@kawsay.ec'].includes(cleanEmail);
      if (!isDemoAccount && (!password || !row.password || row.password !== password)) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      if (row.preferences && typeof row.preferences === 'string') {
        try { row.preferences = JSON.parse(row.preferences); } catch (e) {}
      }
      delete row.password;
      res.json({ message: 'Inicio de sesión exitoso', user: row });
    });
  }

  // 2. REGISTRO DE USUARIO (REGISTER)
  if (action === 'register') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    const { name, email, password, role, preferences } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    const validRole = ['espectador', 'artista', 'espacio', 'admin', 'gestor'].includes(role) ? role : 'espectador';
    const id = 'usr-' + Date.now();
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    const prefStr = preferences ? (typeof preferences === 'string' ? preferences : JSON.stringify(preferences)) : null;

    const sql = `INSERT INTO users (id, name, email, password, role, avatar, bio, preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return db.run(sql, [id, name.trim(), email.trim().toLowerCase(), password, validRole, avatar, `Perfil de ${validRole} en KAWSAY`, prefStr], async function(err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
        }
        return res.status(500).json({ error: err.message });
      }
      const newUser = { id, name, email: email.toLowerCase(), role: validRole, avatar, bio: `Perfil de ${validRole} en KAWSAY`, preferences: preferences || null };
      await sendWelcomeEmail({ to: newUser.email, name: name.trim(), role: validRole }).catch(() => {});
      res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    });
  }

  // 3. RECUPERACIÓN DE CONTRASEÑA - SOLICITAR CÓDIGO (FORGOT-PASSWORD)
  if (action === 'forgot-password') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'El correo es obligatorio.' });

    const genericMsg = 'Si el correo está registrado, recibirás un código de 6 dígitos en unos segundos.';
    try {
      const user = await dbGet(`SELECT id, name, email FROM users WHERE LOWER(email) = ?`, [email]);
      if (!user) return res.json({ message: genericMsg });

      const code = String(crypto.randomInt(100000, 1000000));
      const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MIN * 60 * 1000).toISOString();

      await dbRun(`UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0`, [email]);
      await dbRun(`INSERT INTO password_resets (id, email, code, expires_at, used) VALUES (?, ?, ?, ?, 0)`,
        ['rst-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'), email, code, expiresAt]);

      const result = await sendPasswordResetEmail({ to: user.email, name: user.name, code });
      if (!result.success) {
        return res.status(502).json({ error: 'No pudimos enviar el correo. Intenta de nuevo en unos minutos.' });
      }

      return res.json({ message: genericMsg });
    } catch (err) {
      console.error('forgot-password serverless error:', err);
      return res.status(500).json({ error: 'Error interno al generar el código.' });
    }
  }

  // 4. RECUPERACIÓN DE CONTRASEÑA - VALIDAR CÓDIGO Y CAMBIAR (RESET-PASSWORD)
  if (action === 'reset-password') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    const { email, code, newPassword } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCode = String(code || '').trim();

    if (!cleanEmail || !cleanCode || !newPassword) {
      return res.status(400).json({ error: 'Correo, código y nueva contraseña son obligatorios.' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    try {
      const reset = await dbGet(
        `SELECT id, expires_at, used FROM password_resets WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1`,
        [cleanEmail, cleanCode]
      );

      if (!reset) {
        return res.status(400).json({ error: 'Código inválido o ya utilizado. Solicita uno nuevo.' });
      }

      if (new Date(reset.expires_at).getTime() < Date.now()) {
        await dbRun(`UPDATE password_resets SET used = 1 WHERE id = ?`, [reset.id]);
        return res.status(400).json({ error: 'El código ha expirado (15 minutos). Solicita uno nuevo.' });
      }

      await dbRun(`UPDATE users SET password = ? WHERE LOWER(email) = ?`, [newPassword, cleanEmail]);
      await dbRun(`UPDATE password_resets SET used = 1 WHERE id = ?`, [reset.id]);

      const updatedUser = await dbGet(`SELECT id, name, email, role, avatar, bio, preferences FROM users WHERE LOWER(email) = ?`, [cleanEmail]);
      if (updatedUser && updatedUser.preferences && typeof updatedUser.preferences === 'string') {
        try { updatedUser.preferences = JSON.parse(updatedUser.preferences); } catch (e) {}
      }

      return res.json({
        message: 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.',
        user: updatedUser
      });
    } catch (err) {
      console.error('reset-password serverless error:', err);
      return res.status(500).json({ error: 'Error interno al restablecer la contraseña.' });
    }
  }

  // 5. LOGIN CON GOOGLE
  if (action === 'google') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    let profile;
    try {
      profile = await verifyGoogleToken(req.body || {});
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }

    const email = profile.email.trim().toLowerCase();
    try {
      let user = await dbGet(`SELECT id, name, email, role, avatar, bio, preferences FROM users WHERE LOWER(email) = ?`, [email]);
      let isNew = false;

      if (!user) {
        isNew = true;
        const id = 'usr-' + Date.now();
        const avatar = profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
        const bio = 'Perfil de espectador en KAWSAY';
        const randomPass = crypto.randomBytes(24).toString('hex');
        await dbRun(`INSERT INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, profile.name, email, randomPass, 'espectador', avatar, bio]);
        user = { id, name: profile.name, email, role: 'espectador', avatar, bio, preferences: null };
        await sendWelcomeEmail({ to: email, name: profile.name, role: 'espectador' }).catch(() => {});
      }

      if (user.preferences && typeof user.preferences === 'string') {
        try { user.preferences = JSON.parse(user.preferences); } catch (e) {}
      }
      return res.json({ message: isNew ? 'Cuenta creada con Google' : 'Inicio de sesión con Google exitoso', user, isNew });
    } catch (err) {
      console.error('google auth serverless error:', err);
      return res.status(500).json({ error: 'Error interno al iniciar sesión con Google.' });
    }
  }

  return res.status(404).json({ error: `Ruta de autenticación desconocida: ${action}` });
};

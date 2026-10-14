const https = require('https');
const crypto = require('crypto');
const { db, initDb } = require('../db');
const { sendWelcomeEmail } = require('../../lib/mailer');

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

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
};

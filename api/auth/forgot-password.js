const crypto = require('crypto');
const { db, initDb } = require('../db');
const { sendPasswordResetEmail } = require('../../lib/mailer');

const RESET_CODE_TTL_MIN = 15;

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, (err) => (err ? reject(err) : resolve())));
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

    const payload = { message: genericMsg };
    if (result.simulated && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      payload.devCode = code;
    }
    return res.json(payload);
  } catch (err) {
    console.error('forgot-password serverless error:', err);
    return res.status(500).json({ error: 'Error interno al generar el código.' });
  }
};

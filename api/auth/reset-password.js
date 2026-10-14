const { db, initDb } = require('../db');

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

  const body = req.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const code = String(body.code || '').trim();
  const newPassword = String(body.password || '');

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Correo, código y nueva contraseña son obligatorios.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const row = await dbGet(
      `SELECT id, expires_at FROM password_resets WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1`,
      [email, code]
    );
    if (!row) {
      return res.status(400).json({ error: 'Código inválido o ya utilizado.' });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await dbRun(`UPDATE password_resets SET used = 1 WHERE id = ?`, [row.id]);
      return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' });
    }

    await dbRun(`UPDATE users SET password = ? WHERE LOWER(email) = ?`, [newPassword, email]);
    await dbRun(`UPDATE password_resets SET used = 1 WHERE email = ?`, [email]);

    return res.json({ message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error('reset-password serverless error:', err);
    return res.status(500).json({ error: 'Error interno al restablecer la contraseña.' });
  }
};

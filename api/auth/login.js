const { db, initDb } = require('../db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    return db.get(`SELECT id, name, email, role, avatar, bio FROM users WHERE LOWER(email) = LOWER(?) AND (password = ? OR password IS NULL)`, [email.trim(), password], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Credenciales inválidas.' });
      res.json({ message: 'Inicio de sesión exitoso', user: row });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

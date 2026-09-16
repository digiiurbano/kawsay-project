const { db, initDb } = require('../db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    const validRole = ['espectador', 'artista', 'espacio', 'admin', 'gestor'].includes(role) ? role : 'espectador';
    const id = 'usr-' + Date.now();
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    const sql = `INSERT INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return db.run(sql, [id, name.trim(), email.trim().toLowerCase(), password, validRole, avatar, `Perfil de ${validRole} en KAWSAY`], function(err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
        }
        return res.status(500).json({ error: err.message });
      }
      const newUser = { id, name, email: email.toLowerCase(), role: validRole, avatar, bio: `Perfil de ${validRole} en KAWSAY` };
      res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

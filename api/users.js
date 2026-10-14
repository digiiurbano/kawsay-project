const { db, initDb } = require('./db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query || {};

  if (id) {
    return db.get(`SELECT id, name, email, role, avatar, bio FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(row);
    });
  }

  if (req.method === 'PUT') {
    const { name, avatar, bio, city, tags } = req.body || {};
    const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : tags;
    return db.run(
      `UPDATE users SET name = COALESCE(?, name), avatar = COALESCE(?, avatar), bio = COALESCE(?, bio), city = COALESCE(?, city), tags = COALESCE(?, tags) WHERE id = ?`,
      [name, avatar, bio, city, tagsStr, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario actualizado exitosamente' });
      }
    );
  }

  db.all(`SELECT id, name, email, role, avatar, bio FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

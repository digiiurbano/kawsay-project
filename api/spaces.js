const { db, initDb } = require('./db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return db.all(`SELECT * FROM spaces`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  if (req.method === 'POST') {
    const { name, type, image, owner_id } = req.body || {};
    if (!name || !type) return res.status(400).json({ error: 'Nombre y tipo son obligatorios' });
    const id = 'sp-' + Date.now();
    const img = image || 'images/space_nave01.jpg';
    const owner = owner_id || 'usr-gestor-1';

    return db.run(`INSERT INTO spaces (id, name, type, image, owner_id) VALUES (?, ?, ?, ?, ?)`, [id, name, type, img, owner], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Espacio cultural creado', id });
    });
  }

  if (req.method === 'PUT') {
    const spaceId = req.query.id;
    const { name, type, image, sector, address, hours, categories, description, capacity } = req.body || {};
    const catStr = Array.isArray(categories) ? JSON.stringify(categories) : (categories || '');
    const sql = `UPDATE spaces SET name = ?, type = ?, image = ?, sector = ?, address = ?, hours = ?, categories = ?, description = ?, capacity = ? WHERE id = ?`;
    return db.run(sql, [name, type, image || 'images/space_nave01.jpg', sector || 'Quito', address || 'Quito', hours || 'Lun-Sáb', catStr, description || '', capacity || 200, spaceId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Espacio actualizado' });
    });
  }

  if (req.method === 'DELETE') {
    const spaceId = req.query.id;
    return db.run(`DELETE FROM spaces WHERE id = ?`, [spaceId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Espacio eliminado' });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

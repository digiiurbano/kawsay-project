const { db, initDb } = require('./db');

module.exports = async (req, res) => {
  try {
    await initDb();
  } catch (err) {
    return res.status(500).json({ error: "Database initialization failed" });
  }

  // Permites CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/events
  if (req.method === 'GET') {
    const { status, category, search, organizerId, id } = req.query;

    if (id) {
      return db.get(`SELECT * FROM events WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(row);
      });
    }

    let sql = `SELECT * FROM events WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      sql += ` AND status = ?`;
      params.push(status);
    } else if (!status) {
      sql += ` AND status = 'approved'`;
    }

    if (category && category !== 'TODOS') {
      sql += ` AND UPPER(category) = UPPER(?)`;
      params.push(category);
    }

    if (organizerId) {
      sql += ` AND organizer_id = ?`;
      params.push(organizerId);
    }

    if (search) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR venue LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY date ASC`;

    return db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // POST /api/events
  if (req.method === 'POST') {
    const {
      title, full_title, badge, description, category,
      date, time, price, venue, full_venue, image, organizer_id, role, rating
    } = req.body || {};

    // Si es calificar un evento
    if (rating && req.query.id) {
      const score = parseInt(rating);
      if (isNaN(score) || score < 1 || score > 5) {
        return res.status(400).json({ error: 'La calificación debe ser un entero entre 1 y 5' });
      }

      const sql = `UPDATE events SET rating_sum = COALESCE(rating_sum, 0) + ?, rating_count = COALESCE(rating_count, 0) + 1 WHERE id = ?`;
      return db.run(sql, [score, req.query.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT rating_sum, rating_count FROM events WHERE id = ?`, [req.query.id], (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          const avg = row && row.rating_count > 0 ? (row.rating_sum / row.rating_count).toFixed(1) : '5.0';
          res.json({ message: 'Calificación registrada', average: avg, total: row ? row.rating_count : 1 });
        });
      });
    }

    if (!title || !category || !date || !time || !venue) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (título, categoría, fecha, hora, lugar).' });
    }

    const id = 'ev-' + Date.now();
    const initialStatus = (role === 'admin') ? 'approved' : 'pending';
    const defaultImage = image || 'images/hero_banner.jpg';
    const orgId = organizer_id || 'usr-gestor-1';

    const sql = `
      INSERT INTO events (id, title, full_title, badge, description, category, date, time, price, venue, full_venue, image, status, organizer_id, sold_out)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    const params = [
      id, title, full_title || title, badge || category.toUpperCase(),
      description || '', category, date, time, price || 'Gratis',
      venue, full_venue || venue, defaultImage, initialStatus, orgId
    ];

    return db.run(sql, params, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Evento creado exitosamente.', id, status: initialStatus });
    });
  }

  // PUT /api/events
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { status, title, category, date, time, price, venue, full_title, badge, description, full_venue, image } = req.body || {};

    if (!id) return res.status(400).json({ error: 'ID de evento requerido' });

    if (status) {
      return db.run(`UPDATE events SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Estado de evento actualizado a ${status}` });
      });
    }

    const sql = `
      UPDATE events
      SET title = ?, full_title = ?, badge = ?, description = ?, category = ?,
          date = ?, time = ?, price = ?, venue = ?, full_venue = ?, image = ?
      WHERE id = ?
    `;

    const params = [
      title, full_title || title, badge || category.toUpperCase(),
      description || '', category, date, time, price || 'Gratis',
      venue, full_venue || venue, image || 'images/hero_banner.jpg', id
    ];

    return db.run(sql, params, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Evento modificado exitosamente.' });
    });
  }

  // DELETE /api/events
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID de evento requerido' });

    return db.run(`DELETE FROM events WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Evento eliminado correctamente' });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

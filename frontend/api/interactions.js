const { db, initDb } = require('./db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const userId = req.query.userId || req.query.id;
    if (!userId) return res.status(400).json({ error: 'userId requerido' });

    return db.all(`SELECT event_id, is_favorite, has_rsvp FROM user_interactions WHERE user_id = ?`, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  if (req.method === 'POST') {
    const { user_id, event_id, action } = req.body || {};
    if (!user_id || !event_id || !action) {
      return res.status(400).json({ error: 'user_id, event_id y action son requeridos' });
    }

    return db.get(`SELECT * FROM user_interactions WHERE user_id = ? AND event_id = ?`, [user_id, event_id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      let isFav = row ? row.is_favorite : 0;
      let hasRsvp = row ? row.has_rsvp : 0;

      if (action === 'toggle_favorite') isFav = isFav ? 0 : 1;
      if (action === 'toggle_rsvp') hasRsvp = hasRsvp ? 0 : 1;

      const sql = `
        INSERT INTO user_interactions (user_id, event_id, is_favorite, has_rsvp)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, event_id) DO UPDATE SET
          is_favorite = excluded.is_favorite,
          has_rsvp = excluded.has_rsvp
      `;

      db.run(sql, [user_id, event_id, isFav, hasRsvp], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Interacción actualizada', is_favorite: isFav, has_rsvp: hasRsvp });
      });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

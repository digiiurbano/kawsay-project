const { db, initDb } = require('./db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const queries = {
    totalEvents: "SELECT COUNT(*) as count FROM events WHERE status = 'approved'",
    pendingEvents: "SELECT COUNT(*) as count FROM events WHERE status = 'pending'",
    totalSpaces: "SELECT COUNT(*) as count FROM spaces",
    totalUsers: "SELECT COUNT(*) as count FROM users"
  };

  db.get(queries.totalEvents, [], (err, row1) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get(queries.pendingEvents, [], (err, row2) => {
      if (err) return res.status(500).json({ error: err.message });
      db.get(queries.totalSpaces, [], (err, row3) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(queries.totalUsers, [], (err, row4) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            approvedEvents: row1.count,
            pendingEvents: row2.count,
            totalSpaces: row3.count,
            totalUsers: row4.count
          });
        });
      });
    });
  });
};

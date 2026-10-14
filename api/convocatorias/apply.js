const { db, initDb } = require('../db');

module.exports = async (req, res) => {
  try { await initDb(); } catch (err) { return res.status(500).json({ error: "DB Error" }); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { convocatoria_id, user_id, project_title, applicant_name, email, category, summary, requested_amount, dossier_url } = req.body || {};
    if (!convocatoria_id || !project_title || !applicant_name || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para la postulación.' });
    }

    const id = 'app-' + Date.now();
    const folio = 'FOLIO-' + new Date().getFullYear() + '-FONDO-' + Math.floor(1000 + Math.random() * 9000);

    const sql = `
      INSERT INTO applications (id, convocatoria_id, user_id, project_title, applicant_name, email, category, summary, requested_amount, dossier_url, folio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return db.run(sql, [id, convocatoria_id, user_id || 'usr-anon', project_title, applicant_name, email, category || 'Artes', summary || '', requested_amount || 0, dossier_url || '', folio], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Postulación registrada exitosamente', id, folio });
    });
  }

  res.status(405).json({ error: 'Método no permitido' });
};

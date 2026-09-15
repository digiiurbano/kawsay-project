const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (index.html, styles.css, app.js, images, etc.)
app.use(express.static(path.resolve(__dirname, '../frontend')));

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Estadísticas Globales (para Dashboard Admin / Gestor)
app.get('/api/stats', (req, res) => {
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
});

// 2. Usuarios / Autenticación Real
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  db.get(`SELECT id, name, email, role, avatar, bio FROM users WHERE LOWER(email) = LOWER(?) AND (password = ? OR password IS NULL)`, [email.trim(), password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }
    res.json({ message: 'Inicio de sesión exitoso', user: row });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  }

  const validRole = ['espectador', 'artista', 'espacio', 'admin', 'gestor'].includes(role) ? role : 'espectador';
  const id = 'usr-' + Date.now();
  const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const sql = `INSERT INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [id, name.trim(), email.trim().toLowerCase(), password, validRole, avatar, `Perfil de ${validRole} en KAWSAY`], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
      }
      return res.status(500).json({ error: err.message });
    }
    const newUser = { id, name, email: email.toLowerCase(), role: validRole, avatar, bio: `Perfil de ${validRole} en KAWSAY` };
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  });
});

app.get('/api/users', (req, res) => {
  db.all(`SELECT id, name, email, role, avatar, bio FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get(`SELECT id, name, email, role, avatar, bio FROM users WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
});

// 3. Eventos
app.get('/api/events', (req, res) => {
  const { status, category, search, organizerId } = req.query;
  let sql = `SELECT * FROM events WHERE 1=1`;
  const params = [];

  if (status && status !== 'all') {
    sql += ` AND status = ?`;
    params.push(status);
  } else if (!status) {
    // Por defecto solo muestra los aprobados al público
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

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/events/:id', (req, res) => {
  db.get(`SELECT * FROM events WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(row);
  });
});

// Crear Nuevo Evento (Gestor o Admin)
app.post('/api/events', (req, res) => {
  const {
    title, full_title, badge, description, category,
    date, time, price, venue, full_venue, image, organizer_id, role
  } = req.body;

  if (!title || !category || !date || !time || !venue) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (título, categoría, fecha, hora, lugar).' });
  }

  const id = 'ev-' + Date.now();
  // Si lo crea un Admin se aprueba automáticamente; si lo crea un Gestor queda 'pending'
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

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: 'Evento creado exitosamente.',
      id,
      status: initialStatus
    });
  });
});

// Cambiar estado de evento (Aprobar/Rechazar) - Acción de Admin
app.put('/api/events/:id/status', (req, res) => {
  const { status } = req.body; // 'approved' o 'rejected'
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  db.run(`UPDATE events SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ message: `Estado de evento actualizado a ${status}` });
  });
});

// Modificar/Editar Evento (Artista, Espacio o Admin)
app.put('/api/events/:id', (req, res) => {
  const {
    title, full_title, badge, description, category,
    date, time, price, venue, full_venue, image
  } = req.body;

  if (!title || !category || !date || !time || !venue) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para actualizar el evento.' });
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
    venue, full_venue || venue, image || 'images/hero_banner.jpg',
    req.params.id
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ message: 'Evento modificado exitosamente.' });
  });
});

// Eliminar Evento (Gestor/Admin)
app.delete('/api/events/:id', (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ message: 'Evento eliminado correctamente' });
  });
});

// 4. Espacios Culturales
app.get('/api/spaces', (req, res) => {
  db.all(`SELECT * FROM spaces`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/spaces', (req, res) => {
  const { name, type, image, owner_id } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Nombre y tipo de espacio son obligatorios' });
  }
  const id = 'sp-' + Date.now();
  const img = image || 'images/space_nave01.jpg';
  const owner = owner_id || 'usr-gestor-1';

  db.run(`INSERT INTO spaces (id, name, type, image, owner_id) VALUES (?, ?, ?, ?, ?)`, [id, name, type, img, owner], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Espacio cultural creado', id });
  });
});

// 5. Interacciones (Favoritos / RSVP) - Espectador
app.get('/api/interactions/:userId', (req, res) => {
  db.all(`SELECT event_id, is_favorite, has_rsvp FROM user_interactions WHERE user_id = ?`, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/interactions', (req, res) => {
  const { user_id, event_id, action } = req.body; // action: 'toggle_favorite' o 'toggle_rsvp'
  if (!user_id || !event_id || !action) {
    return res.status(400).json({ error: 'user_id, event_id y action son requeridos' });
  }

  db.get(`SELECT * FROM user_interactions WHERE user_id = ? AND event_id = ?`, [user_id, event_id], (err, row) => {
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
});

// Inicializar DB y Servidor
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor KAWSAY corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Falló la inicialización de la base de datos:", err);
});

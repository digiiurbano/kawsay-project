const express = require('express');
const cors = require('cors');
const { db, initDb } = require('../lib/db');
const { registerAuthRoutes, sendWelcomeEmail } = require('../lib/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para asegurar que la base de datos esté lista en cada invocación serverless
app.use(async (req, res, next) => {
  try {
    await initDb();
    next();
  } catch (err) {
    console.error("Error al inicializar DB en Serverless:", err);
    res.status(500).json({ error: "Error interno de base de datos" });
  }
});

// Reconstruir y normalizar rutas en Vercel Serverless
app.use((req, res, next) => {
  // 1. Si Vercel pasó el subpath en req.query._path (rewrite /api/:path* -> /api/index.js?_path=:path*)
  if (req.query && req.query._path) {
    const raw = req.query._path;
    const subpath = Array.isArray(raw) ? raw.join('/') : String(raw);
    delete req.query._path;
    const queryString = new URLSearchParams(req.query).toString();
    req.url = '/api/' + subpath.replace(/^\/+/, '') + (queryString ? '?' + queryString : '');
  } else {
    // 2. Si Vercel envió encabezados de rewrite
    const matched = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'];
    if (matched && matched.startsWith('/api') && (req.url === '/api/index.js' || req.url === '/api' || req.url === '/')) {
      req.url = matched;
    }
  }

  // 3. Asegurar prefijo /api
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Endpoint base para verificar salud de la API
app.get(['/api', '/api/'], (req, res) => {
  res.json({ status: 'ok', message: 'KAWSAY API en funcionamiento' });
});

// ==========================================
// API ENDPOINTS SERVERLESS
// ==========================================

// Recuperación de contraseña, Login con Google y config pública
registerAuthRoutes(app, db);

// 1. Estadísticas Globales
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', version: '0.9.4-beta', coords: '0.2291° S, 78.5243° W' });
});

// 2. Autenticación
app.post('/api/auth/login', (req, res) => {
  const { email, identifier, password } = req.body || {};
  const rawInput = identifier || email;
  if (!rawInput) {
    return res.status(400).json({ error: 'Identificador o correo es requerido' });
  }

  const cleanInput = rawInput.trim().toLowerCase();

  // Cuentas de Acceso Anticipado y Roles KAWSAY
  const demoUsers = {
    'user_name_00': { id: 'usr-explorador-1', name: 'Explorador Kawsay', email: 'explorador@kawsay.ec', username: 'USER_NAME_00', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', bio: 'Explorador beta de KAWSAY', pass: 'asoma2026' },
    'explorador@kawsay.ec': { id: 'usr-explorador-1', name: 'Explorador Kawsay', email: 'explorador@kawsay.ec', username: 'USER_NAME_00', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', bio: 'Explorador beta de KAWSAY', pass: 'asoma2026' },
    'explorador': { id: 'usr-explorador-1', name: 'Explorador Kawsay', email: 'explorador@kawsay.ec', username: 'USER_NAME_00', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', bio: 'Explorador beta de KAWSAY', pass: 'asoma2026' },
    'admin@kawsay.ec': { id: 'usr-admin-1', name: 'Admin Kawsay', email: 'admin@kawsay.ec', username: 'USER_ADMIN_01', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Administrador principal', pass: 'admin123' },
    'admin': { id: 'usr-admin-1', name: 'Admin Kawsay', email: 'admin@kawsay.ec', username: 'USER_ADMIN_01', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Administrador principal', pass: 'admin123' },
    'user_admin_01': { id: 'usr-admin-1', name: 'Admin Kawsay', email: 'admin@kawsay.ec', username: 'USER_ADMIN_01', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Administrador principal', pass: 'admin123' },
    'artista@kawsay.ec': { id: 'usr-artista-1', name: 'Mateo & La Banda', email: 'artista@kawsay.ec', username: 'ARTISTA_QUITO', role: 'artista', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', bio: 'Colectivo musical y teatral', pass: 'artista123' },
    'artista': { id: 'usr-artista-1', name: 'Mateo & La Banda', email: 'artista@kawsay.ec', username: 'ARTISTA_QUITO', role: 'artista', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', bio: 'Colectivo musical y teatral', pass: 'artista123' },
    'espacio@kawsay.ec': { id: 'usr-espacio-1', name: 'Teatro Nacional Quito', email: 'espacio@kawsay.ec', username: 'ESPACIO_TEATRO', role: 'espacio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bio: 'Recinto cultural principal', pass: 'espacio123' },
    'espacio': { id: 'usr-espacio-1', name: 'Teatro Nacional Quito', email: 'espacio@kawsay.ec', username: 'ESPACIO_TEATRO', role: 'espacio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bio: 'Recinto cultural principal', pass: 'espacio123' },
    'espectador@kawsay.ec': { id: 'usr-espectador-1', name: 'María Fernanda', email: 'espectador@kawsay.ec', username: 'MATEO_88', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Amante del arte y espectadora en Quito', pass: 'espectador123' },
    'mateo_88': { id: 'usr-espectador-1', name: 'Mateo Sandoval', email: 'espectador@kawsay.ec', username: 'MATEO_88', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', bio: 'Amante del arte y espectador en Quito', pass: 'espectador123' }
  };

  if (demoUsers[cleanInput]) {
    const matched = demoUsers[cleanInput];
    // Permitir acceso con su clave asignada o claves de prueba comunes
    if (password && password !== matched.pass && password !== 'asoma2026' && password !== '123456') {
      return res.status(401).json({ error: 'Código de acceso incorrecto. Verifica tus credenciales.' });
    }
    const { pass, ...safeUser } = matched;
    return res.json({ message: 'Inicio de sesión exitoso', user: safeUser });
  }

  db.get(`SELECT id, name, email, role, avatar, bio, preferences, password FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?`, [cleanInput, cleanInput], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!row) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu identificador y código de acceso.' });
    }

    if (password && row.password && row.password !== password) {
      return res.status(401).json({ error: 'Código de acceso incorrecto.' });
    }

    if (row.preferences && typeof row.preferences === 'string') {
      try { row.preferences = JSON.parse(row.preferences); } catch (e) {}
    }
    delete row.password;
    res.json({ message: 'Inicio de sesión exitoso', user: row });
  });
});

// Endpoint: Solicitud de Acceso Anticipado para Creativos
app.post('/api/early-access', (req, res) => {
  const { name, email, role_type, portfolio_url, note } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es requerido.' });
  }

  const id = 'req-' + Date.now();
  const sql = `INSERT INTO early_access_requests (id, name, email, role_type, portfolio_url, note) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [id, (name || '').trim(), email.trim().toLowerCase(), role_type || 'creativo', portfolio_url || '', note || ''], function(err) {
    if (err) {
      console.warn("Aviso en registro de acceso anticipado:", err.message);
    }
    res.status(201).json({
      success: true,
      message: '¡Solicitud recibida! Te enviaremos tu código de acceso a la brevedad.'
    });
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
  db.run(sql, [id, name.trim(), email.trim().toLowerCase(), password, validRole, avatar, `Perfil de ${validRole} en KAWSAY`], async function(err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
      }
      return res.status(500).json({ error: err.message });
    }
    const newUser = { id, name, email: email.toLowerCase(), role: validRole, avatar, bio: `Perfil de ${validRole} en KAWSAY` };
    // En serverless hay que esperar el envío antes de responder
    await sendWelcomeEmail({ to: newUser.email, name: name.trim(), role: validRole }).catch(() => {});
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  });
});

app.get('/api/users', (req, res) => {
  db.all(`SELECT id, name, email, role, avatar, bio, city, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, password, role, bio, avatar, city } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const validRole = ['espectador', 'artista', 'espacio', 'admin', 'gestor'].includes(role) ? role : 'espectador';
  const id = 'usr-' + Date.now();
  const userPass = password && String(password).trim().length >= 6 ? String(password).trim() : 'kawsay2026';
  const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const userBio = bio || `Perfil de ${validRole} en KAWSAY`;
  const userCity = city || 'Quito';

  const sql = `INSERT INTO users (id, name, email, password, role, avatar, bio, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [id, name.trim(), cleanEmail, userPass, validRole, userAvatar, userBio, userCity], function(err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
      }
      return res.status(500).json({ error: err.message });
    }
    const newUser = { id, name: name.trim(), email: cleanEmail, role: validRole, avatar: userAvatar, bio: userBio, city: userCity };
    res.status(201).json({ message: 'Usuario y contraseña creados exitosamente', user: newUser });
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get(`SELECT id, name, email, role, avatar, bio, city FROM users WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
});

app.put('/api/users/:id/password', (req, res) => {
  const { password } = req.body || {};
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }
  db.run(`UPDATE users SET password = ? WHERE id = ?`, [String(password), req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Contraseña actualizada exitosamente' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  if (userId === 'usr-admin-1') {
    return res.status(403).json({ error: 'No se puede eliminar la cuenta principal de Administrador' });
  }
  db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, role, avatar, bio, city, tags, password } = req.body;
  const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : tags;
  db.run(
    `UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role), avatar = COALESCE(?, avatar), bio = COALESCE(?, bio), city = COALESCE(?, city), tags = COALESCE(?, tags), password = COALESCE(?, password) WHERE id = ?`,
    [name, role, avatar, bio, city, tagsStr, password || null, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT id, name, email, role, avatar, bio, city, tags FROM users WHERE id = ?`, [req.params.id], (err2, user) => {
        if (err2 || !user) return res.json({ message: 'Usuario actualizado', id: req.params.id });
        if (user.tags && typeof user.tags === 'string') {
          try { user.tags = JSON.parse(user.tags); } catch(e) {}
        }
        res.json({ message: 'Perfil actualizado exitosamente', user });
      });
    }
  );
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

app.post('/api/events', (req, res) => {
  const {
    title, full_title, badge, description, category,
    date, time, price, venue, full_venue, image, organizer_id, role
  } = req.body;

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

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: 'Evento creado exitosamente.',
      id,
      status: initialStatus
    });
  });
});

app.post('/api/events/:id/rate', (req, res) => {
  const { rating } = req.body;
  const score = parseInt(rating);
  if (isNaN(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'La calificación debe ser un entero entre 1 y 5' });
  }

  const sql = `UPDATE events SET rating_sum = COALESCE(rating_sum, 0) + ?, rating_count = COALESCE(rating_count, 0) + 1 WHERE id = ?`;
  db.run(sql, [score, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    db.get(`SELECT rating_sum, rating_count FROM events WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      const avg = row.rating_count > 0 ? (row.rating_sum / row.rating_count).toFixed(1) : '5.0';
      res.json({ message: 'Calificación registrada', average: avg, total: row.rating_count });
    });
  });
});

app.post('/api/convocatorias/apply', (req, res) => {
  const { convocatoria_id, user_id, project_title, applicant_name, email, category, summary, requested_amount, dossier_url } = req.body;
  if (!convocatoria_id || !project_title || !applicant_name || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para la postulación.' });
  }

  const id = 'app-' + Date.now();
  const folio = 'FOLIO-' + new Date().getFullYear() + '-FONDO-' + Math.floor(1000 + Math.random() * 9000);

  const sql = `
    INSERT INTO applications (id, convocatoria_id, user_id, project_title, applicant_name, email, category, summary, requested_amount, dossier_url, folio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [id, convocatoria_id, user_id || 'usr-anon', project_title, applicant_name, email, category || 'Artes', summary || '', requested_amount || 0, dossier_url || '', folio], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Postulación registrada exitosamente', id, folio });
  });
});

app.get('/api/convocatorias/applications', (req, res) => {
  db.all(`SELECT * FROM applications ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/events/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  db.run(`UPDATE events SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ message: `Estado de evento actualizado a ${status}` });
  });
});

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

app.delete('/api/events/:id', (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ message: 'Evento eliminado correctamente' });
  });
});

app.get('/api/spaces', (req, res) => {
  db.all(`SELECT * FROM spaces`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/spaces', (req, res) => {
  const { name, type, image, owner_id, sector, address, hours, categories, description, capacity } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Nombre y tipo de espacio son obligatorios' });
  }
  const id = 'sp-' + Date.now();
  const img = image || 'images/space_nave01.jpg';
  const owner = owner_id || 'usr-espacio-1';
  const catStr = Array.isArray(categories) ? JSON.stringify(categories) : (categories || '');

  const sql = `
    INSERT INTO spaces (id, name, type, image, owner_id, sector, address, hours, categories, description, capacity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    id, name, type, img, owner,
    sector || 'Quito', address || 'Quito, Ecuador',
    hours || 'Lun-Sáb: 09:00 - 20:00', catStr,
    description || `Espacio cultural ${name} en Quito.`,
    capacity || 200
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Espacio cultural creado exitosamente', id });
  });
});

app.put('/api/spaces/:id', (req, res) => {
  const { name, type, image, sector, address, hours, categories, description, capacity } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Nombre y tipo de espacio son obligatorios' });
  }
  const catStr = Array.isArray(categories) ? JSON.stringify(categories) : (categories || '');

  const sql = `
    UPDATE spaces
    SET name = ?, type = ?, image = ?, sector = ?, address = ?, hours = ?, categories = ?, description = ?, capacity = ?
    WHERE id = ?
  `;
  const params = [
    name, type, image || 'images/space_nave01.jpg',
    sector || 'Quito', address || 'Quito, Ecuador',
    hours || 'Lun-Sáb: 09:00 - 20:00', catStr,
    description || '', capacity || 200,
    req.params.id
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Espacio cultural actualizado exitosamente' });
  });
});

app.delete('/api/spaces/:id', (req, res) => {
  db.run(`DELETE FROM spaces WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Espacio eliminado correctamente' });
  });
});

app.get(['/api/interactions', '/api/interactions/:userId'], (req, res) => {
  const userId = req.params.userId || req.query.userId;
  if (!userId) return res.json([]);
  db.all(`SELECT event_id, is_favorite, has_rsvp FROM user_interactions WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

app.post('/api/interactions', (req, res) => {
  const { user_id, event_id, action } = req.body;
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

module.exports = app;

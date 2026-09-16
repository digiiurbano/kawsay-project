const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const defaultDbUrl = 'postgresql://postgres:CqdX95RBv%2BY%3Ffh%25@db.secjavdxoirrucbrllwu.supabase.co:5432/postgres';
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || defaultDbUrl;

let pgPool = null;
if (dbUrl) {
  pgPool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  console.log("⚡ Conectado a la base de datos en la nube (Supabase / PostgreSQL)");
}

const targetDbDir = isVercel ? '/tmp' : path.join(__dirname, '../backend');
const dbPath = process.env.DB_PATH || path.join(targetDbDir, 'kawsay.db');
const sourceDbPath = path.join(__dirname, '../backend/kawsay.db');

if (isVercel && !fs.existsSync(dbPath) && fs.existsSync(sourceDbPath)) {
  try {
    fs.copyFileSync(sourceDbPath, dbPath);
    console.log("✅ Base de datos sembrada copiada a /tmp/kawsay.db");
  } catch (err) {
    console.warn("⚠️ No se pudo copiar la DB inicial a /tmp:", err.message);
  }
}

const sqliteDb = new sqlite3.Database(dbPath);

let dbInitialized = false;
let initPromise = null;

// Adaptador unificado db (sombra del cliente SQLite3)
const db = {
  get: (sql, params = [], callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    if (pgPool) {
      let pgSql = convertSqlToPg(sql);
      pgPool.query(pgSql, params)
        .then(res => callback(null, res.rows[0]))
        .catch(err => callback(err, null));
    } else {
      sqliteDb.get(sql, params, callback);
    }
  },

  all: (sql, params = [], callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    if (pgPool) {
      let pgSql = convertSqlToPg(sql);
      pgPool.query(pgSql, params)
        .then(res => callback(null, res.rows))
        .catch(err => callback(err, null));
    } else {
      sqliteDb.all(sql, params, callback);
    }
  },

  run: function(sql, params = [], callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    if (pgPool) {
      let pgSql = convertSqlToPg(sql);
      pgPool.query(pgSql, params)
        .then(res => {
          if (callback) callback.call({ changes: res.rowCount }, null);
        })
        .catch(err => {
          if (callback) callback(err);
        });
    } else {
      sqliteDb.run(sql, params, callback);
    }
  }
};

function convertSqlToPg(sql) {
  let paramIdx = 1;
  // Reemplazar ? con $1, $2, $3 para PostgreSQL
  let converted = sql.replace(/\?/g, () => `$${paramIdx++}`);
  // Ajustes de compatibilidad de tipos
  converted = converted.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  converted = converted.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
  converted = converted.replace(/COALESCE/gi, 'COALESCE');
  return converted;
}

function initDb() {
  if (dbInitialized) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    if (pgPool) {
      // Inicializar tablas en Supabase / PostgreSQL
      pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          role TEXT,
          avatar TEXT,
          bio TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS spaces (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          image TEXT,
          owner_id TEXT
        );
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          full_title TEXT,
          badge TEXT,
          description TEXT,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          price TEXT NOT NULL,
          venue TEXT NOT NULL,
          full_venue TEXT,
          image TEXT,
          status TEXT DEFAULT 'pending',
          organizer_id TEXT,
          sold_out INT DEFAULT 0,
          rating_sum REAL DEFAULT 0,
          rating_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS user_interactions (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          event_id TEXT NOT NULL,
          is_favorite INT DEFAULT 0,
          has_rsvp INT DEFAULT 0,
          UNIQUE(user_id, event_id)
        );
        CREATE TABLE IF NOT EXISTS applications (
          id TEXT PRIMARY KEY,
          convocatoria_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          project_title TEXT NOT NULL,
          applicant_name TEXT NOT NULL,
          email TEXT NOT NULL,
          category TEXT,
          summary TEXT,
          requested_amount REAL,
          dossier_url TEXT,
          folio TEXT NOT NULL,
          status TEXT DEFAULT 'submitted',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `).then(() => seedData()).then(() => {
        dbInitialized = true;
        resolve();
      }).catch(err => {
        console.error("Error al inicializar Supabase DB:", err);
        resolve(); // Continuar con fallback
      });
    } else {
      sqliteDb.serialize(() => {
        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            role TEXT CHECK(role IN ('espectador', 'artista', 'espacio', 'admin', 'gestor', 'invitado')),
            avatar TEXT,
            bio TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        sqliteDb.run(`ALTER TABLE users ADD COLUMN password TEXT`, () => {});

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS spaces (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            image TEXT,
            owner_id TEXT
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            full_title TEXT,
            badge TEXT,
            description TEXT,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            price TEXT NOT NULL,
            venue TEXT NOT NULL,
            full_venue TEXT,
            image TEXT,
            status TEXT CHECK(status IN ('approved', 'pending', 'rejected')) DEFAULT 'pending',
            organizer_id TEXT,
            sold_out INTEGER DEFAULT 0,
            rating_sum REAL DEFAULT 0,
            rating_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS user_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            event_id TEXT NOT NULL,
            is_favorite INTEGER DEFAULT 0,
            has_rsvp INTEGER DEFAULT 0,
            UNIQUE(user_id, event_id)
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            convocatoria_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            project_title TEXT NOT NULL,
            applicant_name TEXT NOT NULL,
            email TEXT NOT NULL,
            category TEXT,
            summary TEXT,
            requested_amount REAL,
            dossier_url TEXT,
            folio TEXT NOT NULL,
            status TEXT DEFAULT 'submitted',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) return reject(err);
          seedData().then(() => {
            dbInitialized = true;
            resolve();
          }).catch(reject);
        });
      });
    }
  });

  return initPromise;
}

function seedData() {
  return new Promise((resolve) => {
    if (pgPool) {
      // Sembrar datos iniciales en Supabase si la tabla de usuarios está vacía
      pgPool.query(`SELECT COUNT(*) as count FROM events`).then(async res => {
        if (parseInt(res.rows[0].count) === 0) {
          await pgPool.query(`
            INSERT INTO users (id, name, email, password, role, avatar, bio) VALUES
            ('usr-espectador-1', 'María Fernanda', 'espectador@kawsay.ec', 'espectador123', 'espectador', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Amante del arte y espectadora en Quito.'),
            ('usr-artista-1', 'Mateo & La Banda', 'artista@kawsay.ec', 'artista123', 'artista', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', 'Colectivo musical y teatral independiente.'),
            ('usr-espacio-1', 'Teatro Nacional Quito', 'espacio@kawsay.ec', 'espacio123', 'espacio', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Recinto cultural principal del centro de Quito.'),
            ('usr-admin-1', 'Admin Kawsay', 'admin@kawsay.ec', 'admin123', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Administrador principal de la plataforma cultural.')
            ON CONFLICT DO NOTHING;

            INSERT INTO spaces (id, name, type, image, owner_id) VALUES
            ('sp-001', 'NAVE 01', 'ESPACIO CULTURAL', 'images/space_nave01.jpg', 'usr-espacio-1'),
            ('sp-002', 'EL BÚNKER', 'CLUB DE VINILOS', 'images/space_bunker.jpg', 'usr-espacio-1'),
            ('sp-003', 'ESPACIO RADAR', 'GALERÍA & COWORK', 'images/space_radar.jpg', 'usr-espacio-1'),
            ('sp-004', 'TEATRO CENTRAL', 'ARTES ESCÉNICAS', 'images/space_teatro.jpg', 'usr-espacio-1'),
            ('sp-005', 'MUSEO URBANO', 'HISTORIA & ARTE', 'images/space_museo.jpg', 'usr-espacio-1'),
            ('sp-006', 'RADIO KAWSAY', 'MEDIA PARTNER', 'images/space_radio.jpg', 'usr-espacio-1')
            ON CONFLICT DO NOTHING;

            INSERT INTO events (id, title, full_title, badge, description, category, date, time, price, venue, full_venue, image, status, organizer_id, sold_out) VALUES
            ('fe-001', 'MOVIMIENTO URBANO: EL RITO', 'Movimiento Urbano: El Rito', 'DESTACADO', 'Exploración visceral de la identidad a través de la danza contemporánea y percusión en vivo.', 'Danza', '2026-10-26', '20:00', '$15', 'Teatro Nacional', 'Teatro Nacional Quito', 'images/hero_banner.jpg', 'approved', 'usr-gestor-1', 1),
            ('ev-001', 'JAZZ EXPERIMENTAL', 'Jazz Experimental Quito', 'MÚSICA VIVO', 'Sesión nocturna de jazz e improvisación electrónica.', 'Música', '2026-10-26', '21:00', '$12', 'Club Subterráneo', 'Club Subterráneo Centro Histórico', 'images/event_jazz.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-002', 'VOCES DEL BARRIO', 'Voces del Barrio', 'ENTRADA LIBRE', 'Obra teatral comunitaria basada en leyendas urbanas de Quito.', 'Teatro', '2026-10-28', '19:30', 'Gratis', 'Centro La Paz', 'Centro Cultural La Paz', 'images/event_voices.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-003', 'CARNAVAL SONORO', 'Carnaval Sonoro', 'FESTIVAL', 'Encuentro de ritmos andinos y fusión tropical.', 'Música', '2026-10-30', '18:00', '$8', 'Plaza Artes', 'Plaza de las Artes', 'images/event_carnival.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-004', 'NEO-MURALISMO URBANO', 'Neo-Muralismo Urbano', 'EXPOSICIÓN', 'Muestra visual de arte urbano contemporáneo de Quito.', 'Artes', '2026-11-02', '16:00', 'Gratis', 'Galería Sur', 'Galería Sur', 'images/event_mural.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-005', 'RAÍCES — CICLO DE CINE', 'Raíces — Ciclo de Cine Independiente', 'CINE', 'Muestra itinerante de cortometrajes ecuatorianos.', 'Cine', '2026-11-05', '20:30', '$5', 'Sala K', 'Sala K • MUCAO', 'images/event_cinema.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-006', 'TALLER DE CERÁMICA PRECOLOMBINA', 'Taller de Cerámica y Modelado Ancestral', 'TALLER PRO', 'Aprende técnicas ancestrales de moldeado e iconografía cañari y tumbaco.', 'Artes', '2026-11-20', '10:00', '$20', 'Museo Urbano', 'Museo Urbano de Arte Andino', 'images/event_mural.jpg', 'approved', 'usr-gestor-1', 0),
            ('ev-007', 'FESTIVAL DE POESÍA URBANA', 'Festival de Poesía y Micrófono Abierto', 'REVISIÓN', 'Recital libre para poetas emergentes del centro histórico.', 'Teatro', '2026-11-12', '17:00', 'Gratis', 'Espacio Radar', 'Espacio Radar • La Ronda', 'images/event_portraits.jpg', 'pending', 'usr-gestor-1', 0)
            ON CONFLICT DO NOTHING;
          `);
        }
      }).then(() => resolve()).catch(() => resolve());
    } else {
      sqliteDb.serialize(() => {
        const usersStmt = sqliteDb.prepare(`INSERT OR REPLACE INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        usersStmt.run('usr-espectador-1', 'María Fernanda', 'espectador@kawsay.ec', 'espectador123', 'espectador', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Amante del arte y espectadora en Quito.');
        usersStmt.run('usr-artista-1', 'Mateo & La Banda', 'artista@kawsay.ec', 'artista123', 'artista', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', 'Colectivo musical y teatral independiente.');
        usersStmt.run('usr-espacio-1', 'Teatro Nacional Quito', 'espacio@kawsay.ec', 'espacio123', 'espacio', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Recinto cultural principal del centro de Quito.');
        usersStmt.run('usr-admin-1', 'Admin Kawsay', 'admin@kawsay.ec', 'admin123', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Administrador principal de la plataforma cultural.');
        usersStmt.finalize(() => resolve());
      });
    }
  });
}

module.exports = {
  db,
  initDb
};

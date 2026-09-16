const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// En Vercel Serverless el directorio de tareas es de solo lectura, por lo que usamos /tmp
const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const targetDbDir = isVercel ? '/tmp' : path.join(__dirname, '../../backend');
const dbPath = path.join(targetDbDir, 'kawsay.db');

// Si se despliega en Vercel y existe la DB sembrada localmente, copiarla a /tmp si no existe
const sourceDbPath = path.join(__dirname, '../../backend/kawsay.db');

if (isVercel && !fs.existsSync(dbPath) && fs.existsSync(sourceDbPath)) {
  try {
    fs.copyFileSync(sourceDbPath, dbPath);
    console.log("✅ Base de datos sembrada copiada exitosamente a /tmp/kawsay.db");
  } catch (err) {
    console.warn("⚠️ No se pudo copiar la DB inicial a /tmp, se inicializará desde cero:", err.message);
  }
}

const db = new sqlite3.Database(dbPath);

let dbInitialized = false;
let initPromise = null;

function initDb() {
  if (dbInitialized) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Tabla de Usuarios
      db.run(`
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
      db.run(`ALTER TABLE users ADD COLUMN password TEXT`, () => {});

      // 2. Tabla de Espacios Culturales
      db.run(`
        CREATE TABLE IF NOT EXISTS spaces (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          image TEXT,
          owner_id TEXT,
          FOREIGN KEY (owner_id) REFERENCES users(id)
        )
      `);

      // 3. Tabla de Eventos en Cartelera
      db.run(`
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
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organizer_id) REFERENCES users(id)
        )
      `);
      db.run(`ALTER TABLE events ADD COLUMN rating_sum REAL DEFAULT 0`, () => {});
      db.run(`ALTER TABLE events ADD COLUMN rating_count INTEGER DEFAULT 0`, () => {});

      // 4. Tabla de Interacciones (Favoritos y RSVP)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_interactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          event_id TEXT NOT NULL,
          is_favorite INTEGER DEFAULT 0,
          has_rsvp INTEGER DEFAULT 0,
          UNIQUE(user_id, event_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (event_id) REFERENCES events(id)
        )
      `);

      // 5. Tabla de Postulaciones a Convocatorias
      db.run(`
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
        if (err) {
          console.error("Error al crear tablas:", err);
          return reject(err);
        }
        seedData().then(() => {
          dbInitialized = true;
          resolve();
        }).catch(reject);
      });
    });
  });

  return initPromise;
}

function seedData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Sembrar Usuarios con los Perfiles Requeridos
      const usersStmt = db.prepare(`INSERT OR REPLACE INTO users (id, name, email, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`);
      usersStmt.run('usr-espectador-1', 'María Fernanda', 'espectador@kawsay.ec', 'espectador123', 'espectador', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Amante del arte y espectadora en Quito.');
      usersStmt.run('usr-artista-1', 'Mateo & La Banda', 'artista@kawsay.ec', 'artista123', 'artista', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', 'Colectivo musical y teatral independiente.');
      usersStmt.run('usr-espacio-1', 'Teatro Nacional Quito', 'espacio@kawsay.ec', 'espacio123', 'espacio', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Recinto cultural principal del centro de Quito.');
      usersStmt.run('usr-admin-1', 'Admin Kawsay', 'admin@kawsay.ec', 'admin123', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Administrador principal de la plataforma cultural.');
      usersStmt.finalize();

      // Sembrar Espacios
      const spacesStmt = db.prepare(`INSERT OR REPLACE INTO spaces (id, name, type, image, owner_id) VALUES (?, ?, ?, ?, ?)`);
      const initialSpaces = [
        { id: 'sp-001', name: 'NAVE 01', type: 'ESPACIO CULTURAL', image: 'images/space_nave01.jpg', owner_id: 'usr-espacio-1' },
        { id: 'sp-002', name: 'EL BÚNKER', type: 'CLUB DE VINILOS', image: 'images/space_bunker.jpg', owner_id: 'usr-espacio-1' },
        { id: 'sp-003', name: 'ESPACIO RADAR', type: 'GALERÍA & COWORK', image: 'images/space_radar.jpg', owner_id: 'usr-espacio-1' },
        { id: 'sp-004', name: 'TEATRO CENTRAL', type: 'ARTES ESCÉNICAS', image: 'images/space_teatro.jpg', owner_id: 'usr-espacio-1' },
        { id: 'sp-005', name: 'MUSEO URBANO', type: 'HISTORIA & ARTE', image: 'images/space_museo.jpg', owner_id: 'usr-espacio-1' },
        { id: 'sp-006', name: 'RADIO KAWSAY', type: 'MEDIA PARTNER', image: 'images/space_radio.jpg', owner_id: 'usr-espacio-1' }
      ];
      initialSpaces.forEach(s => spacesStmt.run(s.id, s.name, s.type, s.image, s.owner_id));
      spacesStmt.finalize();

      // Sembrar Eventos
      const eventsStmt = db.prepare(`
        INSERT OR REPLACE INTO events (id, title, full_title, badge, description, category, date, time, price, venue, full_venue, image, status, organizer_id, sold_out)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const initialEvents = [
        {
          id: 'fe-001',
          title: 'MOVIMIENTO URBANO: EL RITO',
          full_title: 'Movimiento Urbano: El Rito',
          badge: 'DESTACADO',
          description: 'Exploración visceral de la identidad a través de la danza contemporánea y percusión en vivo.',
          category: 'Danza',
          date: '2026-10-26',
          time: '20:00',
          price: '$15',
          venue: 'Teatro Nacional',
          full_venue: 'Teatro Nacional Quito',
          image: 'images/hero_banner.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 1
        },
        {
          id: 'ev-001',
          title: 'JAZZ EXPERIMENTAL',
          full_title: 'Jazz Experimental Quito',
          badge: 'MÚSICA VIVO',
          description: 'Sesión nocturna de jazz e improvisación electrónica.',
          category: 'Música',
          date: '2026-10-26',
          time: '21:00',
          price: '$12',
          venue: 'Club Subterráneo',
          full_venue: 'Club Subterráneo Centro Histórico',
          image: 'images/event_jazz.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-002',
          title: 'VOCES DEL BARRIO',
          full_title: 'Voces del Barrio',
          badge: 'ENTRADA LIBRE',
          description: 'Obra teatral comunitaria basada en leyendas urbanas de Quito.',
          category: 'Teatro',
          date: '2026-10-28',
          time: '19:30',
          price: 'Gratis',
          venue: 'Centro La Paz',
          full_venue: 'Centro Cultural La Paz',
          image: 'images/event_voices.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-003',
          title: 'CARNAVAL SONORO',
          full_title: 'Carnaval Sonoro',
          badge: 'FESTIVAL',
          description: 'Encuentro de ritmos andinos y fusión tropical.',
          category: 'Música',
          date: '2026-10-30',
          time: '18:00',
          price: '$8',
          venue: 'Plaza Artes',
          full_venue: 'Plaza de las Artes',
          image: 'images/event_carnival.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-004',
          title: 'NEO-MURALISMO URBANO',
          full_title: 'Neo-Muralismo Urbano',
          badge: 'EXPOSICIÓN',
          description: 'Muestra visual de arte urbano contemporáneo de Quito.',
          category: 'Artes',
          date: '2026-11-02',
          time: '16:00',
          price: 'Gratis',
          venue: 'Galería Sur',
          full_venue: 'Galería Sur',
          image: 'images/event_mural.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-005',
          title: 'RAÍCES — CICLO DE CINE',
          full_title: 'Raíces — Ciclo de Cine Independiente',
          badge: 'CINE',
          description: 'Muestra itinerante de cortometrajes ecuatorianos.',
          category: 'Cine',
          date: '2026-11-05',
          time: '20:30',
          price: '$5',
          venue: 'Sala K',
          full_venue: 'Sala K • MUCAO',
          image: 'images/event_cinema.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-006',
          title: 'TALLER DE CERÁMICA PRECOLOMBINA',
          full_title: 'Taller de Cerámica y Modelado Ancestral',
          badge: 'TALLER PRO',
          description: 'Aprende técnicas ancestrales de moldeado e iconografía cañari y tumbaco.',
          category: 'Artes',
          date: '2026-11-20',
          time: '10:00',
          price: '$20',
          venue: 'Museo Urbano',
          full_venue: 'Museo Urbano de Arte Andino',
          image: 'images/event_workshop.jpg',
          status: 'approved',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        },
        {
          id: 'ev-007',
          title: 'FESTIVAL DE POESÍA URBANA',
          full_title: 'Festival de Poesía y Micrófono Abierto',
          badge: 'REVISIÓN',
          description: 'Recital libre para poetas emergentes del centro histórico.',
          category: 'Teatro',
          date: '2026-11-12',
          time: '17:00',
          price: 'Gratis',
          venue: 'Espacio Radar',
          full_venue: 'Espacio Radar • La Ronda',
          image: 'images/event_portraits.jpg',
          status: 'pending',
          organizer_id: 'usr-gestor-1',
          sold_out: 0
        }
      ];

      initialEvents.forEach(e => {
        eventsStmt.run(
          e.id, e.title, e.full_title, e.badge, e.description,
          e.category, e.date, e.time, e.price, e.venue, e.full_venue,
          e.image, e.status, e.organizer_id, e.sold_out
        );
      });

      eventsStmt.finalize((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

module.exports = {
  db,
  initDb
};

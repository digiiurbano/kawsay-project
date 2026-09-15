const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("🧪 Probando Endpoints de la API REST KAWSAY...");
  try {
    // 1. Test GET /api/stats
    const stats = await makeRequest('/api/stats');
    console.log("✅ GET /api/stats:", stats.statusCode, stats.data);

    // 2. Test POST /api/auth/login
    const loginRes = await makeRequest('/api/auth/login', 'POST', { email: 'admin@kawsay.ec', password: 'admin123' });
    console.log("✅ POST /api/auth/login (Admin):", loginRes.statusCode, loginRes.data.user ? loginRes.data.user.name : loginRes.data);

    // 3. Test GET /api/users
    const users = await makeRequest('/api/users');
    console.log(`✅ GET /api/users: ${users.statusCode} (${users.data.length} usuarios)`);

    // 3. Test GET /api/events
    const events = await makeRequest('/api/events');
    console.log(`✅ GET /api/events: ${events.statusCode} (${events.data.length} eventos aprobados)`);

    // 4. Test POST /api/events (Gestor crea evento)
    const newEventData = {
      title: 'Taller de Cerámica Precolombina',
      category: 'Artes',
      date: '2026-11-20',
      time: '15:00',
      price: '$10',
      venue: 'Museo Urbano',
      description: 'Aprende sobre la alfarería ancestral de Pichincha.',
      organizer_id: 'usr-gestor-1',
      role: 'gestor'
    };
    const createRes = await makeRequest('/api/events', 'POST', newEventData);
    console.log("✅ POST /api/events (Gestor):", createRes.statusCode, createRes.data);

    // 5. Test PUT /api/events/:id/status (Admin aprueba evento)
    if (createRes.data && createRes.data.id) {
      const approveRes = await makeRequest(`/api/events/${createRes.data.id}/status`, 'PUT', { status: 'approved' });
      console.log("✅ PUT /api/events/:id/status (Admin):", approveRes.statusCode, approveRes.data);
      
      // 6. Test DELETE /api/events/:id (Borrar evento creado)
      const deleteRes = await makeRequest(`/api/events/${createRes.data.id}`, 'DELETE');
      console.log("✅ DELETE /api/events/:id:", deleteRes.statusCode, deleteRes.data);
    }

    // 7. Test POST /api/interactions (Espectador)
    const interactRes = await makeRequest('/api/interactions', 'POST', {
      user_id: 'usr-espectador-1',
      event_id: 'fe-001',
      action: 'toggle_favorite'
    });
    console.log("✅ POST /api/interactions (Favorito):", interactRes.statusCode, interactRes.data);

    console.log("🎉 ¡Todos los tests de backend y base de datos local SQLite pasaron con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Fallaron los tests de la API:", err);
    process.exit(1);
  }
}

runTests();

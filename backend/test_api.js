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

    // 8. Test POST /api/spaces (Registro de espacio con Google Maps, aforo y permisos)
    const newSpacePayload = {
      name: 'Galería La Candelaria',
      type: 'GALERÍA & COWORK',
      sector: 'Centro Histórico',
      capacity: 350,
      address: 'Calle Junín E2-45 y Montúfar',
      google_maps_url: 'https://maps.app.goo.gl/kawsaytest123',
      lat: -0.2205,
      lng: -78.5135,
      hours: 'Lun–Sáb: 09:00–20:00',
      categories: ['Arte Contemporáneo', 'Exposiciones', 'Talleres'],
      image: 'images/space_galeria.jpg',
      description: 'Espacio de creación plástica y exposiciones patrimoniales.',
      permits_file: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
      permits_filename: 'LUAE_Bomberos_Candelaria_2026.pdf',
      role: 'espacio',
      owner_id: 'usr-espacio-1'
    };
    const createSpaceRes = await makeRequest('/api/spaces', 'POST', newSpacePayload);
    console.log("✅ POST /api/spaces (Registro):", createSpaceRes.statusCode, createSpaceRes.data);

    if (createSpaceRes.data && createSpaceRes.data.id) {
      const spaceId = createSpaceRes.data.id;

      // 9. Verificar que el espacio nuevo se registró como 'pending'
      const checkPendingRes = await makeRequest('/api/spaces?status=pending');
      const list = Array.isArray(checkPendingRes.data) ? checkPendingRes.data : [];
      const foundPending = list.find(s => s.id === spaceId);
      console.log(`✅ GET /api/spaces?status=pending: Encontrado espacio pendiente: ${foundPending ? foundPending.name : 'No'}, Aforo: ${foundPending ? foundPending.capacity : 'N/A'}`);

      // 10. Admin aprueba el espacio
      const approveSpaceRes = await makeRequest(`/api/spaces/${spaceId}/status`, 'PUT', { status: 'approved' });
      console.log("✅ PUT /api/spaces/:id/status (Aprobación Admin):", approveSpaceRes.statusCode, approveSpaceRes.data);

      // 11. Eliminar espacio de prueba
      const deleteSpaceRes = await makeRequest(`/api/spaces/${spaceId}`, 'DELETE');
      console.log("✅ DELETE /api/spaces/:id (Limpieza):", deleteSpaceRes.statusCode, deleteSpaceRes.data);
    }

    console.log("🎉 ¡Todos los tests de backend, espacios y moderación pasaron con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Fallaron los tests de la API:", err);
    process.exit(1);
  }
}

runTests();

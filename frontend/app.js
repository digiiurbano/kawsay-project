// ============================================================
// KAWSAY — App Logic (PANEL DE CONTROL & ANALÍTICAS DE ADMINISTRACIÓN)
// ============================================================

const App = (() => {

  const API_BASE = '/api';

  // ---- SVG ICON DICTIONARY ----
  const ICONS = {
    home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    heart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    heartFill: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    landmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="18" y1="18" y2="18"/><path d="M4 18V11"/><path d="M8 18V11"/><path d="M12 18V11"/><path d="M16 18V11"/><path d="M20 18V11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>`,
    star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    pin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    ticket: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg>`,
    check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    artist: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2.5 6.5 6 6.5 1 0 1.5-.5 1.5-1 0-.5-.2-1-.2-1.5 0-1 1-1.5 1.5-1.5H13c4.5 0 8.5-3.5 8.5-8C21.5 6.5 17 2 12 2Z"/><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/></svg>`,
    music: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    edit: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y1="12"/></svg>`,
    lock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    key: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
    logOut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
  };

  // ---- Dynamic State ----
  let currentView = 'home';

  const guestUser = { id: 'usr-guest', name: 'Visitante (Sin Iniciar Sesión)', role: 'invitado', avatar: '' };

  let usersList = [
    guestUser,
    { id: 'usr-espectador-1', name: 'María Fernanda', role: 'espectador', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'usr-artista-1', name: 'Mateo & La Banda', role: 'artista', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150' },
    { id: 'usr-espacio-1', name: 'Teatro Nacional Quito', role: 'espacio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'usr-admin-1', name: 'Admin Kawsay', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  let currentUser = guestUser;
  let currentLocation = 'TODOS';

  let pendingAuthAction = null;
  let tempRegData = null;

  let cartItems = [];
  let apiEvents = [];
  let apiSpaces = [];
  let userInteractions = {};
  let platformStats = { approvedEvents: 0, pendingEvents: 0, totalSpaces: 0, totalUsers: 0 };
  let isPlayingDemoTrack = false;
  let activeDetailEvent = null;
  let editingEventId = null;

  // ---- Calendar State (Dynamic real date calculation) ----
  const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const todayDateObj = new Date();
  const realCalYear = todayDateObj.getFullYear();
  const realCalMonth = todayDateObj.getMonth();
  const realCalDay = todayDateObj.getDate();

  let calendarYear = realCalYear;
  let calendarMonth = realCalMonth;
  let selectedCalendarDate = `${realCalYear}-${String(realCalMonth + 1).padStart(2, '0')}-${String(realCalDay).padStart(2, '0')}`;
  let weekStartOffset = 0;

  function normalizeDateStr(dateStr) {
    if (!dateStr) return '';
    const str = String(dateStr).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    if (str.includes('T')) return str.split('T')[0];

    const monthMap = {
      'ENE': '01', 'FEB': '02', 'MAR': '03', 'ABR': '04',
      'MAY': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
      'SEP': '09', 'OCT': '10', 'NOV': '11', 'DIC': '12'
    };

    const parts = str.split(' ');
    if (parts.length === 2) {
      const day = parts[0].padStart(2, '0');
      const monthKey = parts[1].substring(0, 3).toUpperCase();
      const month = monthMap[monthKey] || '10';
      return `2026-${month}-${day}`;
    }

    return str;
  }

  const convocatoriasList = [
    {
      id: 'conv-001',
      title: 'FONDO DE FOMENTO A LAS ARTES QUITO 2026',
      category: 'Convocatorias',
      badge: 'FONDO PÚBLICO',
      date: '2026-12-01',
      time: 'Hasta las 23:59',
      price: 'Premio: $10,000',
      venue: 'Secretaría de Cultura Quito',
      description: 'Convocatoria abierta para proyectos independientes de artes escénicas, música, artes visuales y gestión comunitaria en la provincia de Pichincha. Fondo no reembolsable de producción.',
      image: 'images/event_mural.jpg',
      rating_count: 14,
      rating_sum: 70
    },
    {
      id: 'conv-002',
      title: 'RESIDENCIA ARTÍSTICA Y EXPOSICIÓN NAVE 01',
      category: 'Convocatorias',
      badge: 'RESIDENCIA',
      date: '2026-11-15',
      time: 'Hasta las 18:00',
      price: 'Beca Completa + Taller',
      venue: 'NAVE 01 Centro Histórico',
      description: 'Beca de residencia para artistas plásticos y visuales emergentes. Incluye estudio de trabajo equipado durante 3 meses, materiales de creación y exposición final individual.',
      image: 'images/event_portraits.jpg',
      rating_count: 9,
      rating_sum: 45
    }
  ];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async function init() {
    const savedUser = localStorage.getItem('kawsay_user');
    if (savedUser) {
      try { currentUser = JSON.parse(savedUser); } catch(e) { currentUser = guestUser; }
    } else {
      currentUser = guestUser;
    }

    // 1. Inicializar inmediatamente apiEvents y apiSpaces con datos locales KAWSAY
    apiEvents = [...KAWSAY_DATA.weekEvents.map(e => ({ ...e, status: e.status || 'approved' })), ...convocatoriasList];
    apiSpaces = KAWSAY_DATA.spaces;

    // 2. Renderizar interfaz e instalar delegación global de eventos de inmediato (0ms de latencia)
    renderSidebar();
    renderTopbar();
    renderHomeView();
    renderWeekView();
    renderMonthView();
    renderJoinView();
    renderModals();
    bindGlobalEvents();

    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'gestor')) {
      navigate('admin');
    } else if (currentUser && currentUser.role === 'artista') {
      navigate('artist');
    } else if (currentUser && currentUser.role === 'espacio') {
      navigate('space');
    } else {
      navigate('home');
    }

    // 3. Intentar sincronizar con la API en segundo plano sin congelar la interfaz
    loadInitialData().then(() => {
      if (currentView === 'admin') {
        const viewEl = document.getElementById('view-admin');
        if (viewEl) renderAdminDashboardView(viewEl);
      } else if (currentView === 'artist') {
        const viewEl = document.getElementById('view-artist');
        if (viewEl) renderArtistStudioView(viewEl);
      } else if (currentView === 'space') {
        const viewEl = document.getElementById('view-space');
        if (viewEl) renderSpaceStudioView(viewEl);
      } else if (currentView === 'home') {
        renderHomeView();
      } else if (currentView === 'calendar-month') {
        renderMonthView();
      } else if (currentView === 'calendar-week') {
        renderWeekView();
      }
      renderSidebar();
      renderTopbar();
    }).catch(err => {
      console.warn("📌 Sincronización en segundo plano: usando base local KAWSAY.");
    });
  }

  // ============================================================
  // DATA FETCHING (CON TIMEOUT NO BLOQUEANTE DE 5 SEGUNDOS)
  // ============================================================
  async function loadInitialData() {
    try {
      const [uRes, eRes, sRes, stRes] = await Promise.allSettled([
        fetchWithTimeout(`${API_BASE}/users`),
        fetchWithTimeout(`${API_BASE}/events?status=all`),
        fetchWithTimeout(`${API_BASE}/spaces`),
        fetchWithTimeout(`${API_BASE}/stats`)
      ]);

      if (uRes.status === 'fulfilled' && uRes.value.ok) {
        const fetchedUsers = await uRes.value.json();
        usersList = [guestUser, ...fetchedUsers];
      }

      if (eRes.status === 'fulfilled' && eRes.value.ok) {
        const fetchedEvents = await eRes.value.json();
        if (fetchedEvents && fetchedEvents.length > 0) {
          apiEvents = fetchedEvents;
        }
      }

      // Fusionar convocatorias en el array global de eventos si no están presentes
      convocatoriasList.forEach(conv => {
        if (!apiEvents.some(e => e.id === conv.id)) {
          apiEvents.push(conv);
        }
      });

      if (sRes.status === 'fulfilled' && sRes.value.ok) {
        const fetchedSpaces = await sRes.value.json();
        if (fetchedSpaces && fetchedSpaces.length > 0) apiSpaces = fetchedSpaces;
      }

      if (stRes.status === 'fulfilled' && stRes.value.ok) {
        platformStats = await stRes.value.json();
      }

      if (currentUser.role !== 'invitado') {
        await loadUserInteractions();
      } else {
        userInteractions = {};
      }
    } catch (err) {
      console.warn("⚠️ Error al sincronizar con la API Serverless, usando base local:", err);
      if (!apiEvents || apiEvents.length === 0) {
        apiEvents = [...KAWSAY_DATA.weekEvents.map(e => ({ ...e, status: e.status || 'approved' })), ...convocatoriasList];
      }
      if (!apiSpaces || apiSpaces.length === 0) apiSpaces = KAWSAY_DATA.spaces;
    }
  }

  async function loadUserInteractions() {
    if (currentUser.role === 'invitado') return;
    try {
      const res = await fetchWithTimeout(`${API_BASE}/interactions?userId=${currentUser.id}`);
      if (res.ok) {
        const rows = await res.json();
        userInteractions = {};
        rows.forEach(r => {
          userInteractions[r.event_id] = { is_favorite: r.is_favorite, has_rsvp: r.has_rsvp };
        });
      }
    } catch (e) {
      console.warn("Error de interacciones (usando estado local):", e);
    }
  }

  // ============================================================
  // SIDEBAR
  // ============================================================
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');

    let actionBtnText = '';
    if (currentUser.role === 'invitado') actionBtnText = '🔐 INICIAR SESIÓN / ELEGIR PERFIL';
    else if (currentUser.role === 'artista') actionBtnText = '+ PUBLICAR PROYECTO PRO';
    else if (currentUser.role === 'espacio') actionBtnText = '+ PROGRAMAR EVENTO RECINTO';
    else if (currentUser.role === 'admin') actionBtnText = '+ NUEVO EVENTO ADMIN';

    sidebar.innerHTML = `
      <div class="sidebar-logo" id="sidebar-logo" style="font-size:24px; font-weight:900; display:flex; align-items:center; gap:8px;">
        KAWSAY <span style="color:var(--accent); font-size:12px; font-weight:700;">QUITO</span>
      </div>

      <!-- Estado de Autenticación en Sidebar -->
      <div style="margin: 12px 18px 4px; padding: 10px 12px; background: ${currentUser.role === 'invitado' ? '#222' : 'var(--surface3)'}; border: 1px solid ${currentUser.role === 'invitado' ? 'var(--accent)' : 'var(--border)'}; border-radius: 8px; font-family: var(--font-mono); font-size: 11px; color: ${currentUser.role === 'invitado' ? '#fff' : 'var(--accent)'}; font-weight: 800;">
        ${currentUser.role === 'invitado' ? '🌐 VISITANTE (SIN INICIAR SESIÓN)' : `PERFIL: ${currentUser.role.toUpperCase()} (${currentUser.name})`}
      </div>

      <nav class="sidebar-nav">
        <div class="nav-item ${currentView === 'home' ? 'active' : ''}" data-view="home" id="nav-inicio" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap home-icon">${ICONS.home}</div>
          <span>CARTELERA PÚBLICA</span>
        </div>

        ${currentUser.role === 'admin' || currentUser.role === 'gestor' ? `
          <div class="nav-item ${currentView === 'admin' ? 'active' : ''}" data-view="admin" id="nav-admin" style="font-size:14px; padding:12px 18px;">
            <div class="nav-icon-wrap" style="color:#ef4444;">🛡️</div>
            <span>PANEL ADMIN & ANALÍTICAS</span>
          </div>
        ` : ''}

        ${currentUser.role === 'artista' ? `
          <div class="nav-item ${currentView === 'artist' ? 'active' : ''}" data-view="artist" id="nav-artist" style="font-size:14px; padding:12px 18px;">
            <div class="nav-icon-wrap" style="color:var(--accent);">🎨</div>
            <span>MI ESTUDIO ARTISTA</span>
          </div>
        ` : ''}

        ${currentUser.role === 'espacio' ? `
          <div class="nav-item ${currentView === 'space' ? 'active' : ''}" data-view="space" id="nav-space" style="font-size:14px; padding:12px 18px;">
            <div class="nav-icon-wrap" style="color:var(--gold);">🏛️</div>
            <span>MI ESPACIO CULTURAL</span>
          </div>
        ` : ''}

        <div class="nav-item ${currentView === 'calendar-month' ? 'active' : ''}" data-view="calendar-month" id="nav-calendario" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap">${ICONS.calendar}</div>
          <span>CALENDARIO MES</span>
        </div>
        <div class="nav-item ${currentView === 'convocatorias' ? 'active' : ''}" data-view="convocatorias" id="nav-convocatorias" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap" style="color:#eab308;">📢</div>
          <span>CONVOCATORIAS & FONDOS</span>
        </div>
      </nav>

      <div class="sidebar-library">
        <div class="library-header" style="font-size:12px;">
          <span>TU BIBLIOTECA</span>
          <div class="library-add-btn" id="lib-add-btn" title="Añadir">${ICONS.plus}</div>
        </div>

        <div class="library-item" data-view="calendar-month" id="lib-calendar">
          <div class="lib-icon cal">${ICONS.calendar}</div>
          <div class="lib-text">
            <div class="lib-text-title" style="font-size:13px; font-weight:700;">TU CALENDARIO</div>
            <div class="lib-text-sub">${apiEvents.filter(e => e.status === 'approved').length} EVENTOS</div>
          </div>
        </div>

        <div class="library-item" id="lib-saved">
          <div class="lib-icon save">${ICONS.heartFill}</div>
          <div class="lib-text">
            <div class="lib-text-title" style="font-size:13px; font-weight:700;">MIS FAVORITOS</div>
            <div class="lib-text-sub">${Object.values(userInteractions).filter(i => i.is_favorite).length} ITEMS</div>
          </div>
        </div>

        <div class="library-item" id="lib-spaces">
          <div class="lib-icon fol">${ICONS.landmark}</div>
          <div class="lib-text">
            <div class="lib-text-title" style="font-size:13px; font-weight:700;">ESPACIOS CULTURALES</div>
            <div class="lib-text-sub">${apiSpaces.length} LUGARES</div>
          </div>
        </div>
      </div>

      <!-- KAWSAY PREMIUM RESALTADO -->
      <div class="sidebar-premium-highlight">
        <div class="premium-badge-gold" style="display:inline-flex; align-items:center; gap:6px;">
          ${ICONS.star} KAWSAY PREMIUM
        </div>
        <div class="sidebar-premium-title">Acceso Prioritario VIP</div>
        <div class="sidebar-premium-desc">Preventas exclusivas y descuentos en recintos de Quito.</div>
        <button class="btn-premium-gold" id="btn-sidebar-premium">ÚNETE AHORA</button>
      </div>

      ${actionBtnText ? `
        <button class="create-event-btn" id="create-event-btn" style="font-size:12px; padding:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
          ${ICONS.plus} ${actionBtnText}
        </button>
      ` : ''}
    `;

    sidebar.addEventListener('click', (e) => {
      const item = e.target.closest('[data-view]');
      if (item) navigate(item.dataset.view);
    });

    const createBtn = $('#create-event-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (currentUser.role === 'invitado') openAuthModal();
        else openCreateModal();
      });
    }

    $('#sidebar-logo').addEventListener('click', () => navigate('home'));
    $('#lib-saved').addEventListener('click', () => {
      if (currentUser.role === 'invitado') openAuthModal();
      else filterFavorites();
    });
    $('#btn-sidebar-premium').addEventListener('click', () => {
      if (currentUser.role === 'invitado') openAuthModal();
      else showToast('Bienvenido a KAWSAY PREMIUM VIP');
    });
  }

  // ============================================================
  // TOPBAR
  // ============================================================
  function renderTopbar() {
    const topbar = document.getElementById('topbar');
    const pendingCount = platformStats.pendingEvents || 0;
    const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    topbar.innerHTML = `
      <!-- Barra de Búsqueda Destacada -->
      <div class="search-wrap-lg">
        <span class="search-icon-lg">${ICONS.search}</span>
        <input class="search-input-lg" type="text" placeholder="¿Qué quieres vivir hoy en Quito?" id="search-input" autocomplete="off">
      </div>

      <!-- Ubicación Selector -->
      <div class="location-wrap" title="Seleccionar Sector de Quito">
        <span style="display:flex; align-items:center;">${ICONS.pin}</span>
        <select class="location-select" id="location-select">
          <option value="TODOS">Quito - Todos los sectores</option>
          <option value="Centro Histórico">Centro Histórico</option>
          <option value="La Floresta">La Floresta</option>
          <option value="Cumbayá">Cumbayá</option>
          <option value="Guápulo">Guápulo</option>
          <option value="La Mariscal">La Mariscal</option>
        </select>
      </div>

      <div class="topbar-actions" style="display:flex; align-items:center; gap:10px;">

        <!-- Botón de Carrito -->
        <button class="btn-cart" id="btn-cart">
          <span style="display:flex; align-items:center; gap:6px;">${ICONS.cart} CARRITO</span>
          ${totalCartItems > 0 ? `<span class="cart-badge">${totalCartItems}</span>` : ''}
        </button>

        <!-- Admin Moderation Button -->
        ${currentUser.role === 'admin' ? `
          <button class="btn-admin-mod" id="btn-admin-mod">
            <span style="display:flex; align-items:center; gap:6px;">${ICONS.shield} MODERACIÓN</span>
            ${pendingCount > 0 ? `<span class="badge-pending-count">${pendingCount}</span>` : ''}
          </button>
        ` : ''}

        <!-- Área de Autenticación / Perfil Real -->
        ${currentUser.role === 'invitado' ? `
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn-secondary" id="btn-topbar-login" style="padding:7px 12px; font-size:12px; font-family:var(--font-mono); font-weight:700; color:#cbd5e1; border:1px solid #334155; border-radius:6px; cursor:pointer; background:rgba(30,41,59,0.7); display:flex; align-items:center; gap:6px;">
              ${ICONS.key} Iniciar Sesión
            </button>
            <button class="btn-primary" id="btn-topbar-register" style="padding:7px 14px; font-size:12px; font-family:var(--font-mono); font-weight:900; background:var(--accent); color:#000; border-radius:6px; cursor:pointer; border:none; display:flex; align-items:center; gap:6px; box-shadow:0 0 12px rgba(198,241,53,0.3);">
              ✨ Crear Cuenta <span style="font-size:9px; background:#000; color:var(--accent); padding:1px 5px; border-radius:10px; font-weight:900;">1 MIN</span>
            </button>
          </div>
        ` : `
          <div id="topbar-user-badge" style="display:flex; align-items:center; gap:10px; background:var(--surface2); padding:4px 10px 4px 6px; border-radius:20px; border:1px solid var(--border); cursor:pointer;" title="Abrir mi Panel / Dashboard">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:12px; font-weight:800; color:#fff; max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentUser.name}</span>
              <span style="font-size:9px; font-weight:900; color:var(--primary); text-transform:uppercase;">${currentUser.role}</span>
            </div>
            <button id="btn-logout" title="Cerrar Sesión" style="background:transparent; border:none; color:var(--grey1); font-size:14px; cursor:pointer; padding:4px; margin-left:4px; display:flex; align-items:center;">
              ${ICONS.logOut}
            </button>
          </div>
        `}
      </div>
    `;

    $('#btn-cart').addEventListener('click', openCartModal);

    const loginBtn = $('#btn-topbar-login');
    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));

    const regBtn = $('#btn-topbar-register');
    if (regBtn) regBtn.addEventListener('click', () => openAuthModal('register'));

    const userBadge = $('#topbar-user-badge');
    if (userBadge) {
      userBadge.addEventListener('click', (e) => {
        if (e.target.closest('#btn-logout')) return;
        if (currentUser.role === 'admin' || currentUser.role === 'gestor') navigate('admin');
        else if (currentUser.role === 'artista') navigate('artist');
        else if (currentUser.role === 'espacio') navigate('space');
        else navigate('join');
      });
    }

    const logoutBtn = $('#btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        localStorage.removeItem('kawsay_user');
        currentUser = guestUser;
        await loadUserInteractions();
        showToast('Sesión cerrada correctamente');
        renderSidebar();
        renderTopbar();
        navigate('home');
      });
    }

    $('#location-select').addEventListener('change', (e) => {
      currentLocation = e.target.value;
      filterEventsByLocation(currentLocation);
      showToast(`Filtrando en: ${currentLocation}`);
    });

    const adminModBtn = $('#btn-admin-mod');
    if (adminModBtn) adminModBtn.addEventListener('click', openAdminModal);

    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterEventsBySearch(e.target.value.toLowerCase());
      });
    }
  }

  // ============================================================
  // HOME VIEW
  // ============================================================
  function renderHomeView() {
    const view = document.getElementById('view-home');

    const displayEvents = (currentUser.role === 'invitado' || currentUser.role === 'espectador')
      ? apiEvents.filter(e => e.status === 'approved')
      : apiEvents;

    const featured = apiEvents.find(e => e.id === 'fe-001') || apiEvents[0] || KAWSAY_DATA.featuredEvent;

    view.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero-banner" id="hero-banner">
        <img class="hero-img" src="${featured.image}" alt="${featured.title}">
        <div class="hero-content">
          <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center; flex-wrap:wrap;">
            <span class="hero-badge">${featured.badge || 'DESTACADO'}</span>
            <span class="premium-badge-gold" style="display:inline-flex; align-items:center; gap:4px;">
              ${ICONS.star} EXCLUSIVO PREMIUM
            </span>
          </div>
          <h1 class="hero-title">${featured.title}</h1>
          <p class="hero-desc">${featured.description || featured.subtitle || 'Una experiencia inmersiva de arte, música viva y patrimonio cultural en Quito.'}</p>
          <div class="hero-btns">
            <button class="btn-primary" id="btn-conseguir-entradas" style="display:inline-flex; align-items:center; gap:8px;">
              ${ICONS.ticket} CONSEGUIR ENTRADAS Y AGREGAR AL CARRITO
            </button>
            <button class="btn-secondary" id="btn-mas-info">
              VER DETALLES DEL EVENTO 🔍
            </button>
          </div>
        </div>
      </section>

      <!-- Spotify-Style Quick Grid (Accesos Rápidos en Móvil) -->
      <div class="spotify-quick-grid">
        <div class="quick-grid-card" id="qg-favs">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #450af5, #c41065);">
            <span style="font-size: 16px; color: #fff;">💖</span>
          </div>
          <span class="quick-grid-title">Mis Favoritos</span>
        </div>

        <div class="quick-grid-card" id="qg-calendar">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #059669, #10b981);">
            <span style="font-size: 16px; color: #fff;">📅</span>
          </div>
          <span class="quick-grid-title">Tu Calendario</span>
        </div>

        <div class="quick-grid-card" id="qg-convocatorias">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #d97706, #f59e0b);">
            <span style="font-size: 16px; color: #fff;">📢</span>
          </div>
          <span class="quick-grid-title">Convocatorias</span>
        </div>

        <div class="quick-grid-card" id="qg-spaces">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #2563eb, #60a5fa);">
            <span style="font-size: 16px; color: #fff;">🏛️</span>
          </div>
          <span class="quick-grid-title">Espacios Quito</span>
        </div>

        <div class="quick-grid-card" id="qg-featured">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #84cc16, #c6f135); color:#000;">
            <span style="font-size: 16px;">🌟</span>
          </div>
          <span class="quick-grid-title">Destacado Semanal</span>
        </div>

        <div class="quick-grid-card" id="qg-role">
          <div class="quick-grid-icon-wrap" style="background: linear-gradient(135deg, #dc2626, #f43f5e);">
            <span style="font-size: 16px; color: #fff;">${currentUser.role === 'admin' ? '🛡️' : currentUser.role === 'artista' ? '🎨' : currentUser.role === 'espacio' ? '🏛️' : '🔐'}</span>
          </div>
          <span class="quick-grid-title">${currentUser.role === 'admin' ? 'Panel Admin' : currentUser.role === 'artista' ? 'Estudio Artista' : currentUser.role === 'espacio' ? 'Espacio Cultural' : 'Iniciar Sesión'}</span>
        </div>
      </div>

      <!-- Banner de Recomendaciones Personalizadas según Algoritmo de Gustos -->
      ${currentUser && currentUser.preferences && ((currentUser.preferences.categories && currentUser.preferences.categories.length > 0) || (currentUser.preferences.zones && currentUser.preferences.zones.length > 0)) ? `
        <div class="personalized-recom-banner">
          <div class="personalized-recom-header">
            <div class="personalized-recom-title">
              <span>✨ RECOMENDADOS PARA TI SEGÚN TUS INTERESES CULTURALES</span>
            </div>
            <button class="btn-secondary" id="btn-edit-preferences" style="padding:5px 12px; font-size:11px; font-family:var(--font-mono); border-radius:6px; border:1px solid rgba(255,255,255,0.2); cursor:pointer; color:#fff; background:rgba(255,255,255,0.06); font-weight:700;">
              ⚙️ Ajustar Intereses
            </button>
          </div>
          <div class="personalized-recom-badges">
            ${(currentUser.preferences.categories || []).map(cat => `<span class="personalized-chip">🎭 ${cat}</span>`).join('')}
            ${(currentUser.preferences.zones || []).map(z => `<span class="personalized-chip" style="color:#38bdf8; border-color:rgba(56,189,248,0.3); background:rgba(56,189,248,0.15);">📍 ${z}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Filter Bar -->
      <div class="filter-bar" role="toolbar">
        <button class="filter-pill active" data-cat="TODOS">TODOS</button>
        <button class="filter-pill" data-cat="Música">MÚSICA</button>
        <button class="filter-pill" data-cat="Teatro">TEATRO</button>
        <button class="filter-pill" data-cat="Danza">DANZA</button>
        <button class="filter-pill" data-cat="Artes">ARTES</button>
        <button class="filter-pill" data-cat="Cine">CINE</button>
      </div>

      <!-- Events Grid -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">CARTELERA CULTURAL EN VIVO</h2>
          <span class="section-link" id="eventos-ver-todo">VER TODO</span>
        </div>
        <div class="events-grid stagger" id="events-grid">
          ${displayEvents.map(ev => renderEventCard(ev)).join('')}
        </div>
      </section>

      <!-- Espacios Culturales -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">ESPACIOS CULTURALES Y ARTISTAS REGISTRADOS</h2>
        </div>
        <div class="spaces-grid stagger" id="spaces-grid">
          ${apiSpaces.map(sp => `
            <div class="space-card" data-id="${sp.id}" tabindex="0" role="button">
              <div class="space-avatar-wrap">
                <img class="space-avatar" src="${sp.image}" alt="${sp.name}">
              </div>
              <div class="space-name">${sp.name}</div>
              <div class="space-type">${sp.type}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Explorar por Interés -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">EXPLORAR POR INTERÉS</h2>
        </div>
        <div class="interests-grid stagger" id="interests-grid">
          ${KAWSAY_DATA.interests.map(int => `
            <div class="interest-card" 
                 style="background: ${int.color}; color: ${int.dark ? '#000000' : '#ffffff'}; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);"
                 data-id="${int.id}" data-name="${int.name}" tabindex="0" role="button">
              <span class="interest-label" style="font-weight:900; font-size:15px; letter-spacing:0.5px; text-shadow:${int.dark ? 'none' : '0 2px 4px rgba(0,0,0,0.5)'};">${int.name}</span>
              <span class="interest-icon" style="display:flex; align-items:center;">${ICONS[int.icon] || ICONS.music}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    bindCardInteractions();

    // Space card clicks → full-page space detail
    $$('.space-card').forEach(card => {
      card.addEventListener('click', () => {
        const spaceId = card.dataset.id;
        if (spaceId) navigateSpaceDetail(spaceId);
      });
    });

    // Quick Grid Clicks
    const qgFavs = $('#qg-favs');
    if (qgFavs) qgFavs.addEventListener('click', () => navigate('calendar-month'));
    const qgCal = $('#qg-calendar');
    if (qgCal) qgCal.addEventListener('click', () => navigate('calendar-month'));
    const qgConv = $('#qg-convocatorias');
    if (qgConv) qgConv.addEventListener('click', () => navigate('convocatorias'));
    const qgSpaces = $('#qg-spaces');
    if (qgSpaces) qgSpaces.addEventListener('click', () => {
      const grid = document.getElementById('spaces-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
    const qgFeat = $('#qg-featured');
    if (qgFeat) qgFeat.addEventListener('click', () => openEventDetailModal(featured.id));
    const qgRole = $('#qg-role');
    if (qgRole) qgRole.addEventListener('click', () => {
      if (currentUser.role === 'invitado') openAuthModal('login');
      else navigate(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'artista' ? 'artist' : currentUser.role === 'espacio' ? 'space' : 'join');
    });

    const editPrefBtn = $('#btn-edit-preferences');
    if (editPrefBtn) editPrefBtn.addEventListener('click', () => openOnboardingModal(true));

    $$('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterEventsByCategory(pill.dataset.cat);
      });
    });

    $$('.interest-card').forEach(card => {
      card.addEventListener('click', () => {
        const catName = card.dataset.name;
        filterEventsByCategory(catName);
        const grid = document.getElementById('events-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      });
    });

    $('#btn-conseguir-entradas').addEventListener('click', () => {
      if (currentUser.role === 'invitado') {
        pendingAuthAction = { type: 'cart', title: featured.title, price: 15 };
        openAuthModal('register');
        return;
      }
      addToCart(featured.title, 15);
    });
    $('#btn-mas-info').addEventListener('click', () => {
      openEventDetailModal(featured.id);
    });
  }

  // ============================================================
  // PANEL DE CONTROL EXECUTIVE & ANALÍTICAS DE ADMINISTRACIÓN
  // ============================================================
  function renderAdminDashboardView(view) {
    const pendingEvents = apiEvents.filter(e => e.status === 'pending');

    view.innerHTML = `
      <!-- Banner Ejecutivo de Administración -->
      <div class="admin-dashboard-banner">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <h1 style="font-size:32px; font-weight:900;">🛡️ PANEL DE CONTROL ADMINISTRADOR</h1>
              <span style="background:#ef4444; color:#fff; font-family:var(--font-mono); font-weight:900; font-size:11px; padding:4px 10px; border-radius:12px;">
                SUPER-USUARIO KAWSAY
              </span>
            </div>
            <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono);">
              Monitoreo global de sesiones, número de artistas, ventas de entradas y base de datos en la nube.
            </p>
          </div>
          <div style="display:flex; gap:12px;">
            <button class="btn-primary" id="btn-admin-create-event" style="padding:12px 20px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--accent); color:#000;">
              + NUEVA CARTELERA ADMIN
            </button>
            <button class="btn-secondary" id="btn-admin-export-report" style="padding:12px 20px; font-size:13px; font-family:var(--font-mono); font-weight:800; border:1px solid var(--border); color:#fff;">
              📊 EXPORTAR INFORME DE VENTAS
            </button>
          </div>
        </div>

        <!-- TARJETAS DE MÉTRICAS CLAVE (KPIs EXECUTIVOS - INTERACTIVAS) -->
        <div class="admin-kpi-grid">
          <div class="admin-kpi-card" data-kpi="sessions" title="Haz clic para abrir el desglose de sesiones y usuarios">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🌐 SESIONES / USUARIOS ACTIVOS</div>
              <span style="font-size:10px; background:rgba(198,241,53,0.15); color:var(--accent); border:1px solid var(--accent); padding:2px 8px; border-radius:10px; font-family:var(--font-mono); font-weight:800;">Ver desglose ↗</span>
            </div>
            <div class="admin-kpi-val" style="color:var(--accent);">1,450</div>
            <div class="admin-kpi-sub">4 Perfiles Registrados en la Nube</div>
          </div>
          <div class="admin-kpi-card" data-kpi="artists" title="Haz clic para abrir el directorio y categorías de artistas">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🎨 CANTIDAD DE ARTISTAS</div>
              <span style="font-size:10px; background:rgba(234,179,8,0.15); color:var(--gold); border:1px solid var(--gold); padding:2px 8px; border-radius:10px; font-family:var(--font-mono); font-weight:800;">Ver desglose ↗</span>
            </div>
            <div class="admin-kpi-val" style="color:var(--gold);">142</div>
            <div class="admin-kpi-sub">Colectivos & Bandas Verificados</div>
          </div>
          <div class="admin-kpi-card" data-kpi="spaces" title="Haz clic para abrir el catastro de recintos y aforos">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🏛️ ESPACIOS & RECINTOS</div>
              <span style="font-size:10px; background:rgba(96,165,250,0.15); color:#60a5fa; border:1px solid #60a5fa; padding:2px 8px; border-radius:10px; font-family:var(--font-mono); font-weight:800;">Ver desglose ↗</span>
            </div>
            <div class="admin-kpi-val" style="color:#60a5fa;">24</div>
            <div class="admin-kpi-sub">Centros Culturales en Quito</div>
          </div>
          <div class="admin-kpi-card" data-kpi="tickets" title="Haz clic para abrir el monitoreo de boletaje y QR">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🎟️ BOLETOS VENDIDOS</div>
              <span style="font-size:10px; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid #f43f5e; padding:2px 8px; border-radius:10px; font-family:var(--font-mono); font-weight:800;">Ver desglose ↗</span>
            </div>
            <div class="admin-kpi-val" style="color:#f43f5e;">3,850</div>
            <div class="admin-kpi-sub">Entradas Digitales Procesadas</div>
          </div>
          <div class="admin-kpi-card" data-kpi="revenue" title="Haz clic para abrir el reporte contable y comisiones">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">💰 RECAUDACIÓN TOTAL</div>
              <span style="font-size:10px; background:rgba(16,185,129,0.15); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:10px; font-family:var(--font-mono); font-weight:800;">Ver desglose ↗</span>
            </div>
            <div class="admin-kpi-val" style="color:#10b981;">$48,250</div>
            <div class="admin-kpi-sub">Ingresos Totales por Taquilla</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: MODERACIÓN PENDIENTE -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900; color:#ef4444; display:flex; align-items:center; gap:8px;">
            ${ICONS.shield} REVISIÓN Y MODERACIÓN DE CARTELERAS (${pendingEvents.length} PENDIENTES)
          </h2>
        </div>
        <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;">
          ${pendingEvents.length === 0 ? `
            <div style="text-align:center; padding:20px; color:var(--accent); font-family:var(--font-mono);">
              ✅ No hay carteleras pendientes de aprobación. Todos los espectáculos están al día.
            </div>
          ` : `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ESPECTÁCULO</th>
                  <th>CATEGORÍA</th>
                  <th>RECINTO / LUGAR</th>
                  <th>FECHA & HORA</th>
                  <th>ACCIONES DE MODERACIÓN</th>
                </tr>
              </thead>
              <tbody>
                ${pendingEvents.map(ev => `
                  <tr class="admin-pending-row" data-id="${ev.id}" style="cursor:pointer;" title="Haz clic en el evento para abrir y revisar todos los detalles">
                    <td>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--accent); font-size:13px;">🔍</span>
                        <strong class="admin-pending-title" style="color:#fff; text-decoration:underline; text-underline-offset:3px; font-size:14px;">${ev.title}</strong>
                        <span style="font-size:10px; background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444; padding:2px 6px; border-radius:8px; font-weight:800;">PENDIENTE</span>
                      </div>
                    </td>
                    <td><span style="color:var(--accent); font-weight:800;">${ev.category}</span></td>
                    <td>${ev.venue}</td>
                    <td>${ev.date} · ${ev.time}</td>
                    <td>
                      <div style="display:flex; gap:6px; align-items:center;">
                        <button class="btn-action-preview" data-id="${ev.id}" style="background:var(--surface3); color:#fff; font-weight:800; padding:6px 10px; border-radius:6px; border:1px solid var(--border); cursor:pointer; font-size:11px;" title="Ver ficha técnica y detalles completos">👁️ REVISAR</button>
                        <button class="btn-action-approve" data-id="${ev.id}" style="background:var(--accent); color:#000; font-weight:900; padding:6px 12px; border-radius:6px; border:none; cursor:pointer; font-size:11px;">APROBAR ✅</button>
                        <button class="btn-action-reject" data-id="${ev.id}" style="background:#ef4444; color:#fff; font-weight:800; padding:6px 12px; border-radius:6px; border:none; cursor:pointer; font-size:11px;">RECHAZAR ❌</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </section>

      <!-- SECCIÓN: GESTIÓN DE USUARIOS Y ROLES (SQLITE) -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">DIRECTORIO DE USUARIOS & ROLES REGISTRADOS EN QUITO</h2>
        </div>
        <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>EMAIL</th>
                <th>ROL EN PLATAFORMA</th>
                <th>DESCRIPCIÓN / PERFIL</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              ${usersList.filter(u => u.role !== 'invitado').map(u => `
                <tr>
                  <td style="display:flex; align-items:center; gap:10px;">
                    <img src="${u.avatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid var(--accent);">
                    <strong>${u.name}</strong>
                  </td>
                  <td style="font-family:var(--font-mono); color:var(--grey1);">${u.email}</td>
                  <td>
                    <span style="font-family:var(--font-mono); font-weight:900; font-size:11px; padding:4px 10px; border-radius:12px; background:${u.role === 'admin' ? '#ef4444' : u.role === 'artista' ? 'var(--accent)' : u.role === 'espacio' ? 'var(--gold)' : 'var(--surface3)'}; color:${u.role === 'artista' ? '#000' : '#fff'};">
                      ${u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style="font-size:12px; color:var(--grey1);">${u.bio}</td>
                  <td><span style="color:var(--accent); font-weight:800;">ACTIVO ✅</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECCIÓN: CARTELERA GLOBAL DE EVENTOS EN QUITO -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">TODOS LOS EVENTOS EN CARTELERA</h2>
        </div>
        <div class="events-grid stagger">
          ${apiEvents.map(ev => renderEventCard(ev)).join('')}
        </div>
      </section>
    `;

    bindCardInteractions();

    view.querySelectorAll('.admin-kpi-card').forEach(card => {
      card.addEventListener('click', () => {
        const kpiKey = card.dataset.kpi;
        if (kpiKey) openKpiDetailModal(kpiKey);
      });
    });

    $('#btn-admin-create-event').addEventListener('click', openCreateModal);
    $('#btn-admin-export-report').addEventListener('click', () => {
      showToast('📊 Reporte Ejecutivo de Ventas exportado a CSV.');
    });

    view.querySelectorAll('.admin-pending-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.btn-action-approve, .btn-action-reject')) return;
        const id = row.dataset.id;
        if (id) openEventDetailModal(id);
      });
    });

    view.querySelectorAll('.admin-pending-title').forEach(titleEl => {
      titleEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = titleEl.closest('tr');
        const id = titleEl.dataset.id || (row ? row.dataset.id : null);
        if (id) openEventDetailModal(id);
      });
    });

    view.querySelectorAll('.btn-action-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetailModal(btn.dataset.id);
      });
    });

    view.querySelectorAll('.btn-action-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await setEventStatus(btn.dataset.id, 'approved');
      });
    });

    view.querySelectorAll('.btn-action-reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await setEventStatus(btn.dataset.id, 'rejected');
      });
    });
  }

  // ============================================================
  // DISEÑO DEDICADO PARA ESPACIO CULTURAL (GESTIÓN DE RECINTO)
  // ============================================================
  function renderSpaceStudioView(view) {
    const userOwnedSpaces = apiSpaces.filter(sp => sp.owner_id === currentUser.id);
    const visibleSpaces = (currentUser.role === 'admin' || currentUser.role === 'gestor') 
      ? (apiSpaces.length > 0 ? apiSpaces : [{ id: 'sp-004', name: 'Teatro Nacional Quito', type: 'ARTES ESCÉNICAS', sector: 'Centro Histórico', address: 'Av. 10 de Agosto y Briceño', capacity: 500, image: 'images/space_teatro.jpg', owner_id: currentUser.id }])
      : (userOwnedSpaces.length > 0 ? userOwnedSpaces : apiSpaces.filter(sp => sp.owner_id === currentUser.id || sp.id === 'sp-004'));
    
    const activeSpace = visibleSpaces[0] || apiSpaces[0] || { id: 'sp-004', name: 'Teatro Nacional Quito', type: 'ARTES ESCÉNICAS', sector: 'Centro Histórico', address: 'Av. 10 de Agosto y Briceño', capacity: 500, image: 'images/space_teatro.jpg' };

    view.innerHTML = `
      <!-- Banner del Espacio Cultural -->
      <div class="space-dashboard-banner">
        <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
          <img src="${activeSpace.image || 'images/space_nave01.jpg'}" style="width:100px; height:100px; border-radius:14px; object-fit:cover; border:3px solid var(--gold);" alt="${activeSpace.name}">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <h1 style="font-size:32px; font-weight:900;">${activeSpace.name}</h1>
              <span class="space-verified-tag">🏛️ RECINTO CULTURAL VERIFICADO</span>
            </div>
            <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono); margin-bottom:12px;">
              ${activeSpace.sector || 'Quito'} · ${activeSpace.address || 'Quito, Ecuador'} · Capacidad: ${activeSpace.capacity || 200} Espectadores
            </p>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
              <button class="btn-primary" id="btn-space-edit-my-profile" data-id="${activeSpace.id}" style="padding:14px 24px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:#3b82f6; color:#fff; border:none; border-radius:6px; display:inline-flex; align-items:center; gap:8px;">
                ✏️ EDITAR PERFIL DE MI RECINTO
              </button>
              <button class="btn-primary" id="btn-space-create-event" style="padding:14px 28px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--gold); color:#000; display:inline-flex; align-items:center; gap:8px;">
                ${ICONS.plus} + CREAR & PUBLICAR EVENTO EN MI RECINTO
              </button>
              <button class="btn-primary" id="btn-space-register-new" style="padding:14px 24px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--accent); color:#000; display:inline-flex; align-items:center; gap:8px;">
                🏛️ + REGISTRAR NUEVO ESPACIO CULTURAL
              </button>
            </div>
          </div>
        </div>

        <!-- Métricas del Recinto -->
        <div class="artist-stats-grid" style="margin-top:24px;">
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">${activeSpace.capacity || 200}</div>
            <div class="artist-stat-label">AFORO MÁXIMO</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">${visibleSpaces.length}</div>
            <div class="artist-stat-label">MIS RECINTOS</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">${apiEvents.filter(e => e.venue === activeSpace.name || e.full_venue === activeSpace.name).length || apiEvents.length}</div>
            <div class="artist-stat-label">FUNCIONES EN VIVO</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">$3,200</div>
            <div class="artist-stat-label">TAQUILLA ESTIMADA</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: DIRECTORIO & GESTIÓN DE MIS ESPACIOS CULTURALES -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">🏛️ MIS ESPACIOS CULTURALES REGISTRADOS (${visibleSpaces.length})</h2>
          <span class="section-link" id="btn-space-new-space-top">+ REGISTRAR OTRO ESPACIO</span>
        </div>
        <div class="spaces-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
          ${visibleSpaces.map(sp => `
            <div class="space-card" data-id="${sp.id}" style="background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; cursor:pointer; transition:transform 0.2s, border-color 0.2s;">
              <img src="${sp.image || 'images/space_nave01.jpg'}" style="width:100%; height:140px; object-fit:cover;">
              <div style="padding:16px;">
                <span style="font-size:10px; font-family:var(--font-mono); font-weight:900; color:var(--gold); text-transform:uppercase;">${sp.type || 'ESPACIO CULTURAL'}</span>
                <h3 style="font-size:16px; font-weight:900; margin:4px 0 6px;">${sp.name}</h3>
                <p style="font-size:12px; color:var(--grey1); margin-bottom:10px; display:flex; align-items:center; gap:4px;">
                  📍 ${sp.sector || 'Quito'} · Capacidad ${sp.capacity || 200} pers.
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px; gap:8px;">
                  <button class="btn-secondary btn-edit-space-card" data-id="${sp.id}" style="padding:6px 12px; font-size:11px; font-weight:800; background:#3b82f6; color:#fff; border:none; border-radius:6px;">✏️ EDITAR</button>
                  <button class="btn-secondary btn-open-space-profile" data-id="${sp.id}" style="padding:6px 12px; font-size:11px; font-weight:800;">VER PERFIL ➔</button>
                  <button class="btn-action-delete-space" data-id="${sp.id}" style="background:none; border:none; color:#ef4444; font-size:12px; cursor:pointer;" title="Eliminar espacio">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SECCIÓN: CARTELERA DE EVENTOS AGENDADOS EN EL ESPACIO -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">EVENTOS AGENDADOS EN NUESTRAS SALAS</h2>
          <span class="section-link" id="btn-space-new-event-top">+ CREAR EVENTO</span>
        </div>
        <div class="events-grid stagger">
          ${apiEvents.map(ev => renderEventCard(ev)).join('')}
        </div>
      </section>
    `;

    bindCardInteractions();
    $('#btn-space-create-event').addEventListener('click', openCreateModal);
    $('#btn-space-new-event-top').addEventListener('click', openCreateModal);
    if ($('#btn-space-register-new')) $('#btn-space-register-new').addEventListener('click', openSpaceCreateModal);
    if ($('#btn-space-new-space-top')) $('#btn-space-new-space-top').addEventListener('click', openSpaceCreateModal);
    if ($('#btn-space-edit-my-profile')) {
      $('#btn-space-edit-my-profile').addEventListener('click', (e) => {
        openEditSpaceModal(e.currentTarget.dataset.id);
      });
    }

    view.querySelectorAll('.btn-edit-space-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditSpaceModal(btn.dataset.id);
      });
    });

    view.querySelectorAll('.btn-open-space-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpaceDetailModal(btn.dataset.id);
      });
    });

    view.querySelectorAll('.btn-action-delete-space').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await deleteSpace(btn.dataset.id);
      });
    });

    view.querySelectorAll('.space-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-action-delete-space') || e.target.closest('.btn-edit-space-card')) return;
        const id = card.dataset.id;
        if (id) openSpaceDetailModal(id);
      });
    });
  }

  // ============================================================
  // DISEÑO DEDICADO DE ESTUDIO DE ARTISTA & GENERADOR DE CARTELERA PRO
  // ============================================================
  function renderArtistStudioView(view) {
    const artistEvents = apiEvents;

    view.innerHTML = `
      <div class="artist-dashboard-banner">
        <div class="artist-profile-header">
          <img class="artist-avatar-lg" src="${currentUser.avatar}" alt="${currentUser.name}">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <h1 style="font-size:32px; font-weight:900;">${currentUser.name}</h1>
              <span class="artist-verified-tag">🎨 ARTISTA VERIFICADO KAWSAY</span>
            </div>
            <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono); margin-bottom:12px;">
              Colectivo Musical Independiente · Quito, Ecuador · Jazz Fusión, Folk & Rock
            </p>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
              <button class="btn-primary" id="btn-artist-create-event" style="padding:14px 28px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--accent); color:#000; display:inline-flex; align-items:center; gap:8px;">
                ${ICONS.plus} 📜 CREAR EVENTO CON CARTELERA PROFESIONAL
              </button>
              <button class="btn-secondary" id="btn-artist-promote-music" style="padding:12px 20px; font-size:13px; font-family:var(--font-mono); font-weight:800; border:1px solid var(--gold); color:var(--gold); display:inline-flex; align-items:center; gap:8px;">
                ${ICONS.music} PROMOVER MÚSICA & ÁLBUM
              </button>
            </div>
          </div>
        </div>

        <div class="artist-stats-grid">
          <div class="artist-stat-card">
            <div class="artist-stat-num">14.8k</div>
            <div class="artist-stat-label">REPRODUCCIONES</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num">4,820</div>
            <div class="artist-stat-label">FANS EN QUITO</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num">${artistEvents.length}</div>
            <div class="artist-stat-label">CARTELERAS ACTIVAS</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num">$1,450</div>
            <div class="artist-stat-label">RECAUDACIÓN ENTRADAS</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: MIS CARTELERAS Y ESPECTÁCULOS -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">MIS CARTELERAS Y EVENTOS EN CARTELERA</h2>
          <span class="section-link" id="btn-artist-new-event-top">+ GENERAR CARTELERA PRO</span>
        </div>
        <div class="events-grid stagger" id="artist-events-grid">
          ${artistEvents.map(ev => renderEventCard(ev)).join('')}
        </div>
      </section>

      <!-- SECCIÓN: PROMOCIÓN DE MÚSICA -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900; color:var(--gold); display:flex; align-items:center; gap:8px;">
            ${ICONS.music} PROMOCIONAR MI MÚSICA Y LANZAMIENTO
          </h2>
          <span class="section-link" id="btn-add-new-track">+ SUBIR NUEVA CANCIÓN</span>
        </div>

        <div class="music-promotion-card">
          <div style="display:flex; align-items:center; gap:16px;">
            <button class="music-player-btn" id="btn-toggle-demo-play" title="Reproducir Muestra">
              ${isPlayingDemoTrack ? '⏸' : '▶'}
            </button>
            <img class="music-track-cover" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" alt="Quito Nocturno Single">
            <div>
              <div style="font-size:16px; font-weight:900;">Quito Nocturno (Single 2026)</div>
              <div style="font-size:12px; color:var(--grey1); font-family:var(--font-mono);">Sencillo Destacado · Mateo & La Banda</div>
              <div style="display:flex; gap:8px; margin-top:8px;">
                <span style="background:var(--surface3); font-size:10px; font-family:var(--font-mono); padding:3px 8px; border-radius:4px; color:var(--accent);">SPOTIFY</span>
                <span style="background:var(--surface3); font-size:10px; font-family:var(--font-mono); padding:3px 8px; border-radius:4px; color:var(--gold);">APPLE MUSIC</span>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            <button class="btn-primary" id="btn-boost-track" style="padding:10px 20px; font-size:12px; font-family:var(--font-mono); font-weight:900; background:var(--gold); color:#000;">
              DESTACAR EN CARTELERA (+2.5k alcance)
            </button>
          </div>
        </div>
      </section>
    `;

    bindCardInteractions();

    $('#btn-artist-create-event').addEventListener('click', openCreateModal);
    $('#btn-artist-new-event-top').addEventListener('click', openCreateModal);
    $('#btn-artist-promote-music').addEventListener('click', () => {
      showToast('🎵 Lanzando campaña de promoción para "Quito Nocturno (Single)"');
    });
    $('#btn-add-new-track').addEventListener('click', () => {
      const trackName = prompt("Nombre de la nueva canción / álbum:");
      if (trackName) showToast(`Canción "${trackName}" subida a tu catálogo de Artista.`);
    });
    $('#btn-boost-track').addEventListener('click', () => {
      showToast('⚡ Campaña "Quito Nocturno" promocionada en la portada principal');
    });

    const playBtn = $('#btn-toggle-demo-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlayingDemoTrack = !isPlayingDemoTrack;
        playBtn.textContent = isPlayingDemoTrack ? '⏸' : '▶';
        showToast(isPlayingDemoTrack ? '▶ Reproduciendo sencillo "Quito Nocturno"' : '⏸ Reproducción pausada');
      });
    }
  }

  function getCategoryClass(category) {
    if (!category) return 'cat-artes';
    const c = category.toLowerCase();
    if (c.includes('músic') || c.includes('music')) return 'cat-musica';
    if (c.includes('teatr')) return 'cat-teatro';
    if (c.includes('danz')) return 'cat-danza';
    if (c.includes('cine') || c.includes('películ') || c.includes('film')) return 'cat-cine';
    if (c.includes('foto') || c.includes('fotograf')) return 'cat-foto';
    if (c.includes('festival') || c.includes('feria')) return 'cat-festivales';
    if (c.includes('convocatori') || c.includes('fondo') || c.includes('beca')) return 'cat-convocatorias';
    return 'cat-artes';
  }

  function canEditEvent(ev) {
    if (!currentUser || currentUser.role === 'invitado' || currentUser.role === 'espectador') {
      return false;
    }
    if (currentUser.role === 'admin') {
      return true;
    }
    if (currentUser.role === 'artista' || currentUser.role === 'espacio') {
      return ev.organizer_id === currentUser.id || !ev.organizer_id;
    }
    return false;
  }

  function renderEventCard(ev) {
    const inter = userInteractions[ev.id] || { is_favorite: 0, has_rsvp: 0 };
    const isPending = ev.status === 'pending';
    const catClass = getCategoryClass(ev.category);
    const ratingAvg = ev.rating_count > 0 ? (ev.rating_sum / ev.rating_count).toFixed(1) : '5.0';
    const showEdit = canEditEvent(ev);

    let isRecommended = false;
    if (currentUser && currentUser.preferences) {
      const cats = currentUser.preferences.categories || [];
      const zones = currentUser.preferences.zones || [];
      const matchCat = cats.some(c => (ev.category && ev.category.toLowerCase().includes(c.toLowerCase())) || (ev.title && ev.title.toLowerCase().includes(c.toLowerCase())));
      const matchZone = zones.some(z => (ev.venue && ev.venue.toLowerCase().includes(z.toLowerCase())) || (ev.description && ev.description.toLowerCase().includes(z.toLowerCase())));
      if (matchCat || matchZone) isRecommended = true;
    }

    return `
      <div class="event-card" data-id="${ev.id}" tabindex="0" role="button" style="border-radius:12px; overflow:hidden;">
        <div class="event-card-img-wrap" style="position:relative; height:170px;">
          <img class="event-card-img" src="${ev.image}" alt="${ev.title}">
          <span class="card-badge-cat ${catClass}" style="font-size:11px; font-weight:800; text-transform:uppercase; padding:4px 8px; border-radius:4px;">${ev.category || ev.badge || 'CULTURA'}</span>
          <span class="card-badge-price" style="font-size:12px; font-weight:800;">${ev.price || 'Gratis'}</span>
          ${isRecommended ? `<span class="event-recommended-badge">✨ Para ti</span>` : ''}
          ${isPending ? `<span class="status-badge pending" style="position:absolute; top:36px; right:8px;">PENDIENTE</span>` : ''}
        </div>
        <div class="event-card-title" style="font-size:17px; font-weight:800; line-height:1.3; margin-top:8px;">${ev.title}</div>
        <div class="event-card-meta" style="font-size:12px; color:var(--grey1); margin:4px 0 6px;">
          ${ev.date} · <span class="venue-clickable" data-venue="${ev.venue}" style="color:var(--accent); font-weight:800; cursor:pointer;" title="Ver perfil del espacio">🏛️ ${ev.venue}</span>
        </div>
        
        <!-- Valoración por Estrellas -->
        <div style="font-size:12px; font-weight:800; color:#eab308; margin-bottom:8px; display:flex; align-items:center; gap:4px;">
          ⭐ <span>${ratingAvg}</span> <span style="color:var(--grey1); font-weight:500;">(${ev.rating_count || 0} calificaciones)</span>
        </div>

        <div class="event-card-actions">
          ${showEdit ? `
            <button class="btn-card-action" data-action="edit" data-id="${ev.id}" title="Modificar Evento" style="color:var(--gold); font-weight:900; display:inline-flex; align-items:center; gap:4px;">
              ${ICONS.edit} Editar
            </button>
          ` : ''}
          <button class="btn-card-action ${inter.is_favorite ? 'fav-active' : ''}" data-action="fav" data-id="${ev.id}" style="display:inline-flex; align-items:center; gap:4px;">
            ${inter.is_favorite ? ICONS.heartFill : ICONS.heart} ${inter.is_favorite ? 'Guardado' : 'Favorito'}
          </button>
          <button class="btn-card-action ${inter.has_rsvp ? 'active' : ''}" data-action="rsvp" data-id="${ev.id}" style="display:inline-flex; align-items:center; gap:4px;">
            ${inter.has_rsvp ? ICONS.check : ICONS.user} ${inter.has_rsvp ? 'Asistiré' : 'Asistir'}
          </button>
          <button class="btn-card-action" data-action="add-cart" data-title="${ev.title}" data-price="${ev.price}" title="Agregar al Carrito" style="display:inline-flex; align-items:center;">
            ${ICONS.cart}
          </button>
        </div>
      </div>
    `;
  }

  function bindCardInteractions() {
    $$('.venue-clickable').forEach(vBtn => {
      vBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const venueName = vBtn.dataset.venue;
        let matchedSpace = apiSpaces.find(s =>
          (s.name && venueName && s.name.toLowerCase().includes(venueName.toLowerCase().split(' ')[0])) ||
          (s.name && venueName && venueName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
        );
        if (!matchedSpace && KAWSAY_DATA && KAWSAY_DATA.spaces) {
          matchedSpace = KAWSAY_DATA.spaces.find(s =>
            (s.name && venueName && s.name.toLowerCase().includes(venueName.toLowerCase().split(' ')[0])) ||
            (s.name && venueName && venueName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
          );
        }
        const targetSpaceId = matchedSpace ? matchedSpace.id : (apiSpaces[0] ? apiSpaces[0].id : 'sp-001');
        openSpaceDetailModal(targetSpaceId);
      });
    });

    $$('.btn-card-action').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const act = btn.dataset.action;
        const eventId = btn.dataset.id;

        if (act === 'edit') {
          openEditEventModal(eventId);
          return;
        }

        if (currentUser.role === 'invitado' && (act === 'fav' || act === 'rsvp')) {
          pendingAuthAction = { type: act, eventId };
          openAuthModal('register');
          return;
        }

        if (act === 'add-cart') {
          const title = btn.dataset.title;
          const price = parseInt(btn.dataset.price.replace('$', '')) || 12;
          if (currentUser.role === 'invitado') {
            pendingAuthAction = { type: 'cart', title, price };
            openAuthModal('register');
            return;
          }
          addToCart(title, price);
          return;
        }

        const apiAction = act === 'fav' ? 'toggle_favorite' : 'toggle_rsvp';

        try {
          const res = await fetch(`${API_BASE}/interactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: currentUser.id,
              event_id: eventId,
              action: apiAction
            })
          });
          const data = await res.json();
          if (res.ok) {
            userInteractions[eventId] = {
              is_favorite: data.is_favorite,
              has_rsvp: data.has_rsvp
            };
            showToast(apiAction === 'toggle_favorite'
              ? (data.is_favorite ? 'Añadido a Favoritos' : 'Eliminado de Favoritos')
              : (data.has_rsvp ? '¡Asistencia registrada!' : 'Asistencia cancelada')
            );
            renderSidebar();
            renderHomeView();
          }
        } catch (err) {
          showToast('Error de conexión');
        }
      });
    });
  }

  // ============================================================
  //  MODAL FLOTANTE: DETALLE DE ESPACIO CULTURAL
  //  Mismo layout split que el modal de eventos
  // ============================================================
  function openSpaceDetailModal(spaceId) {
    let sp = apiSpaces.find(s => String(s.id) === String(spaceId));
    if (!sp && KAWSAY_DATA && KAWSAY_DATA.spaces) {
      sp = KAWSAY_DATA.spaces.find(s => String(s.id) === String(spaceId));
    }
    if (!sp) sp = apiSpaces[0];
    if (!sp) return;

    // Enrich defaults
    sp = { ...sp };
    if (!sp.image) sp.image = 'images/hero_banner.jpg';
    if (!sp.description) sp.description = 'Espacio cultural referente de Quito para la experimentación artística.';
    if (!sp.sector) sp.sector = 'Quito';
    if (!sp.address) sp.address = 'Quito, Ecuador';
    if (!sp.hours) sp.hours = 'Lun–Vie: 09:00–19:00 · Sáb: 10:00–18:00';
    if (!sp.categories) sp.categories = ['Arte', 'Cultura', 'Comunidad'];
    if (!sp.eventsCount) sp.eventsCount = 47;
    if (!sp.collectionsCount) sp.collectionsCount = 12;
    if (!sp.rating) sp.rating = 4.8;
    if (!sp.ratingCount) sp.ratingCount = 18;
    if (!sp.nextEvent) sp.nextEvent = '2 DÍAS';
    if (!sp.capacity) sp.capacity = 150;

    // Related events
    const spaceEvents = apiEvents.filter(e =>
      e.status === 'approved'
    ).slice(0, 4);

    const galleryImages = sp.gallery || [sp.image, sp.image, sp.image, sp.image];

    let detailBox = $('#modal-event-detail-box');
    let modalDetail = $('#modal-event-detail');
    if (!detailBox || !modalDetail) {
      renderModals();
      detailBox = $('#modal-event-detail-box');
      modalDetail = $('#modal-event-detail');
    }
    if (!detailBox || !modalDetail) return;

    // Expand floating modal box size for large space layout
    detailBox.className = 'offcanvas-panel offcanvas-space-large';
    detailBox.style.cssText = 'width: min(96vw, 1280px); height: min(94vh, 880px); max-height: 94vh; overflow-y: auto; display: block; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; box-shadow: 0 40px 120px rgba(0,0,0,0.95); position: relative;';

    detailBox.innerHTML = `
      <div class="space-detail-page" style="background:#0a0a0a; padding-bottom:40px; position:relative;">

        <!-- ── STICKY TOP BAR OF FLOATING MODAL ── -->
        <div style="position:sticky; top:0; z-index:100; background:rgba(10,10,10,0.92); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.08); padding:14px 28px; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:10px;">
            <button id="modal-space-back" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; border-radius:8px; padding:6px 14px; font-family:var(--font-mono); font-size:11px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:6px; transition:background 0.15s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              ESPACIOS
            </button>
            <span style="color:rgba(255,255,255,0.3); font-size:11px; font-family:var(--font-mono);">/</span>
            <span style="color:var(--accent); font-size:11px; font-family:var(--font-mono); font-weight:700;">${sp.name}</span>
          </div>
          <button id="modal-space-close" aria-label="Cerrar" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
        </div>

        <!-- ── HEADER HERO ── -->
        <div style="position:relative; background:#000; padding: 24px 0 0;">

          <!-- Badges -->
          <div style="padding:0 32px 14px; display:flex; gap:8px; flex-wrap:wrap;">
            <span style="background:var(--accent,#d4ff00); color:#000; font-family:var(--font-mono); font-size:10px; font-weight:900; padding:5px 12px; border-radius:6px;">${sp.badge || 'ESPACIO'}</span>
            <span style="background:rgba(255,255,255,0.1); color:#fff; font-family:var(--font-mono); font-size:10px; font-weight:800; padding:5px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.15);">${sp.sector.toUpperCase()}</span>
            <span style="background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); font-family:var(--font-mono); font-size:10px; font-weight:700; padding:5px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">${sp.type}</span>
          </div>

          <!-- GIANT TITLE -->
          <div style="padding:0 32px 20px;">
            <h1 style="font-size:clamp(32px, 5vw, 64px); font-weight:900; color:#fff; line-height:0.95; letter-spacing:-2px; text-transform:uppercase; margin:0; max-width:850px;">
              ${sp.name}
            </h1>
          </div>

          <!-- Action buttons row -->
          <div style="padding:0 32px 24px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button id="btn-spd-follow" style="display:flex; align-items:center; gap:8px; padding:10px 20px; background:var(--accent); color:#000; border:none; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:900; cursor:pointer; transition:filter 0.15s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              SEGUIR ESPACIO
            </button>
            <button id="btn-spd-share" style="width:38px; height:38px; border-radius:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button id="btn-spd-save" style="width:38px; height:38px; border-radius:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>

          <!-- Stats bar -->
          <div style="border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:0; overflow-x:auto;">
            ${[
              { label: 'EVENTOS CON AFORO', value: sp.eventsCount || 47 },
              { label: 'COLECCIONES', value: sp.collectionsCount || 12 },
              { label: 'VALORACIÓN', value: `★ ${sp.rating}` },
              { label: 'PRÓXIMO EN', value: sp.nextEvent || '2 DÍAS' },
            ].map((stat, i) => `
              <div style="flex:1; min-width:140px; padding:16px 24px; border-right:1px solid rgba(255,255,255,0.07); display:flex; flex-direction:column; gap:3px;">
                <span style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:0.8px;">${stat.label}</span>
                <span style="font-family:var(--font-mono); font-size:18px; font-weight:900; color:${i === 2 ? '#eab308' : '#fff'};">${stat.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── BODY: 2-column layout ── -->
        <div style="display:grid; grid-template-columns:1fr 340px; gap:28px; padding:28px 32px; align-items:start;">

          <!-- ── LEFT COLUMN ── -->
          <div style="display:flex; flex-direction:column; gap:28px;">

            <!-- Acerca del Espacio -->
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                <span style="width:18px; height:2px; background:var(--accent);"></span>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">ACERCA DEL ESPACIO</span>
              </div>
              <p style="color:rgba(255,255,255,0.78); line-height:1.7; font-size:14px; max-width:680px; margin:0 0 16px;">
                ${sp.description}
              </p>
            </div>

            <!-- Galería fotográfica -->
            <div>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                ${galleryImages.slice(0, 4).map((img) => `
                  <div style="aspect-ratio:1; border-radius:10px; overflow:hidden; background:#1a1a1a;">
                    <img src="${img}" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.75); transition:filter 0.2s; cursor:pointer;" onmouseover="this.style.filter='brightness(1)'" onmouseout="this.style.filter='brightness(0.75)'">
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Próximos Eventos en este espacio -->
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="width:18px; height:2px; background:var(--accent);"></span>
                  <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">PRÓXIMOS EVENTOS</span>
                </div>
                <span style="font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.3);">AÑO · ${spaceEvents.length} EVENTOS</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${spaceEvents.map(ev => `
                  <div class="space-detail-ev-card" data-ev-id="${ev.id}" style="background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:12px; overflow:hidden; cursor:pointer; transition:border-color 0.15s, transform 0.15s;" onmouseover="this.style.borderColor='rgba(212,255,0,0.3)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)';this.style.transform='none'">
                    <div style="position:relative;">
                      <img src="${ev.image}" style="width:100%; height:130px; object-fit:cover;">
                      <div style="position:absolute; top:8px; left:8px; display:flex; gap:5px;">
                        <span style="background:var(--accent); color:#000; font-family:var(--font-mono); font-size:9px; font-weight:900; padding:3px 8px; border-radius:5px;">${ev.category || 'EVENTO'}</span>
                        ${ev.badge ? `<span style="background:rgba(0,0,0,0.7); color:#fff; font-family:var(--font-mono); font-size:9px; font-weight:800; padding:3px 8px; border-radius:5px; border:1px solid rgba(255,255,255,0.2);">${ev.badge}</span>` : ''}
                      </div>
                    </div>
                    <div style="padding:12px 14px;">
                      <div style="font-size:10px; font-family:var(--font-mono); color:rgba(255,255,255,0.4); margin-bottom:5px;">${ev.date} · ${ev.time} <span style="color:var(--accent); font-weight:900;">${ev.price}</span></div>
                      <div style="font-weight:900; font-size:13px; color:#fff; line-height:1.2; margin-bottom:5px;">${ev.title}</div>
                      <div style="font-size:11px; color:rgba(255,255,255,0.45); display:flex; align-items:center; gap:4px;">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${ev.venue || sp.name}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div><!-- /LEFT -->

          <!-- ── RIGHT SIDEBAR ── -->
          <div style="display:flex; flex-direction:column; gap:16px; position:sticky; top:80px;">

            <!-- Disponibilidad card -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden;">
              <div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; gap:8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">DISPONIBILIDAD</span>
              </div>
              <div style="padding:16px 18px; display:flex; flex-direction:column; gap:14px;">
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" style="flex-shrink:0;margin-top:2px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <div>
                    <div style="font-size:14px; font-weight:800; color:#fff;">${sp.sector}</div>
                  </div>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">DIRECCIÓN</div>
                  <div style="font-size:13px; color:rgba(255,255,255,0.75);">${sp.address}</div>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">HORARIO</div>
                  <div style="font-size:12px; color:rgba(255,255,255,0.65); line-height:1.5;">${sp.hours}</div>
                </div>
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">SOBRE DOMICILIO</div>
                  <div style="font-size:12px; color:rgba(255,255,255,0.65);">Capacidad: ${sp.capacity} personas</div>
                </div>
                <div id="btn-spd-map-card" style="background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:10px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; cursor:pointer; transition:border-color 0.15s;" onmouseover="this.style.borderColor='rgba(212,255,0,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style="font-family:var(--font-mono); font-size:9px; font-weight:800; color:rgba(255,255,255,0.3); letter-spacing:0.5px;">VER MAPA</span>
                </div>
              </div>
            </div>

            <!-- En este espacio (categorías + stats) -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden;">
              <div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; gap:8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">EN ESTE ESPACIO</span>
              </div>
              <div style="padding:10px 6px;">
                ${sp.categories.map((cat, i) => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-radius:8px; cursor:pointer; transition:background 0.12s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.3)'}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>
                      <span style="font-size:13px; color:${i === 0 ? '#fff' : 'rgba(255,255,255,0.6)'}; font-weight:${i === 0 ? '700' : '500'};">${cat}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:rgba(255,255,255,0.35);">AÑO</span>
                      <span style="font-family:var(--font-mono); font-size:11px; font-weight:900; color:var(--accent); min-width:24px; text-align:right;">${i === 0 ? 155 : i === 1 ? 47 : 23}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Social icons -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px 18px;">
              <div style="display:flex; gap:10px; justify-content:center;">
                ${['IG', 'FB', 'YT', 'WEB'].map((net) => `
                  <button style="width:42px; height:42px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.6); font-family:var(--font-mono); font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.12)';this.style.color='#fff'" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.6)'">${net}</button>
                `).join('')}
              </div>
            </div>

          </div><!-- /RIGHT SIDEBAR -->

        </div><!-- /body grid -->

      </div>
    `;

    // Listeners
    $('#modal-space-back').addEventListener('click', closeEventDetailModal);
    $('#modal-space-close').addEventListener('click', closeEventDetailModal);

    $('#btn-spd-follow').addEventListener('click', function() {
      showToast(`¡Ahora sigues a ${sp.name}!`);
      this.style.background = 'rgba(212,255,0,0.15)';
      this.style.color = 'var(--accent)';
      this.style.border = '1.5px solid var(--accent)';
      this.innerHTML = '✓ SIGUIENDO';
    });
    $('#btn-spd-share').addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(window.location.href);
      showToast('¡Enlace copiado!');
    });
    const mapCard = $('#btn-spd-map-card');
    if (mapCard) {
      mapCard.addEventListener('click', () => {
        window.open(`https://maps.google.com?q=${encodeURIComponent(sp.address + ', Quito')}`, '_blank');
      });
    }

    detailBox.querySelectorAll('.space-detail-ev-card').forEach(el => {
      el.addEventListener('click', () => {
        closeEventDetailModal();
        setTimeout(() => openEventDetailModal(el.dataset.evId), 200);
      });
    });

    showModal('#modal-event-detail');
  }

  function openEventDetailModal(eventId) {
    if (!eventId) eventId = 'fe-001';
    let ev = apiEvents.find(e => String(e.id) === String(eventId));
    if (!ev) ev = convocatoriasList.find(c => String(c.id) === String(eventId));
    if (!ev && KAWSAY_DATA && KAWSAY_DATA.weekEvents) {
      ev = KAWSAY_DATA.weekEvents.find(e => String(e.id) === String(eventId));
    }
    if (!ev && KAWSAY_DATA && KAWSAY_DATA.featuredEvent && (String(eventId) === 'fe-001' || String(eventId) === 'fe-001')) {
      ev = KAWSAY_DATA.featuredEvent;
    }
    if (!ev && String(eventId).startsWith('conv-')) ev = convocatoriasList[0];
    if (!ev) ev = apiEvents[0] || (KAWSAY_DATA && KAWSAY_DATA.featuredEvent);
    if (!ev) return;

    ev = { ...ev };
    if (ev.title) ev.title = String(ev.title).replace(/\n/g, ' ');
    if (!ev.full_title) ev.full_title = ev.fullTitle || ev.title;
    if (!ev.price) ev.price = '$15';
    if (!ev.venue) ev.venue = 'Teatro Nacional Quito';
    if (!ev.image) ev.image = 'images/hero_banner.jpg';
    if (!ev.category) ev.category = 'Danza';

    activeDetailEvent = ev;
    const inter = userInteractions[ev.id] || { is_favorite: 0, has_rsvp: 0 };
    let detailBox = $('#modal-event-detail-box');
    let modalDetail = $('#modal-event-detail');

    if (!detailBox || !modalDetail) {
      renderModals();
      detailBox = $('#modal-event-detail-box');
      modalDetail = $('#modal-event-detail');
    }
    if (!detailBox || !modalDetail) return;

    detailBox.className = 'offcanvas-panel';
    detailBox.style.cssText = '';

    const isConvocatoria = (ev.category === 'Convocatorias' || (ev.id && ev.id.startsWith('conv-')));

    if (isConvocatoria) {
      detailBox.innerHTML = `
        <!-- LEFT: Scrollable info column -->
        <div class="offcanvas-left">

          <!-- Title/Header block -->
          <div class="offcanvas-left-header">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
              <span class="cat-convocatorias" style="font-size:10px; font-weight:900; padding:3px 10px; border-radius:8px; text-transform:uppercase;">
                📢 CONVOCATORIA CULTURAL
              </span>
              <span style="background:rgba(0,0,0,0.8); font-family:var(--font-mono); font-size:10px; font-weight:800; padding:3px 10px; border-radius:8px; border:1px solid var(--gold); color:var(--gold);">
                💰 ${ev.price || 'Fondo: $10,000'}
              </span>
            </div>
            <h2 style="font-size:clamp(20px,2.5vw,28px); font-weight:900; color:#fff; line-height:1.1; margin:0 0 8px;">${ev.title}</h2>
            <p style="color:var(--grey1); font-size:12px; font-weight:700;">🏛️ Organiza: ${ev.venue}</p>
            <div class="hero-rating-row" style="margin-top:8px;">
              <div class="rating-stars" id="detail-rating-stars">
                <span class="star-icon" data-star="1">★</span>
                <span class="star-icon" data-star="2">★</span>
                <span class="star-icon" data-star="3">★</span>
                <span class="star-icon" data-star="4">★</span>
                <span class="star-icon" data-star="5">★</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:#eab308;">⭐ ${ev.rating_count > 0 ? (ev.rating_sum / ev.rating_count).toFixed(1) : '5.0'}</span>
            </div>
          </div>

          <div class="offcanvas-body">
            <div>
              <h3 style="font-size:13px; font-weight:900; color:var(--accent); font-family:var(--font-mono); margin-bottom:8px; text-transform:uppercase;">
                📖 DESCRIPCIÓN DEL FONDO / BECA
              </h3>
              <p style="color:#e2e8f0; line-height:1.6; font-size:13px;">
                ${ev.description}
              </p>
            </div>

            <!-- Ficha Técnica Píldoras -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px;">
                <div style="font-size:10px; font-family:var(--font-mono); color:var(--grey1);">CIERRE DE RECEPCIÓN</div>
                <div style="font-size:13px; font-weight:900; color:#fff;">📅 ${ev.date} · ${ev.time}</div>
              </div>
              <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px;">
                <div style="font-size:10px; font-family:var(--font-mono); color:var(--grey1);">INCENTIVO / MONTO</div>
                <div style="font-size:14px; font-weight:900; color:var(--accent);">💰 ${ev.price}</div>
              </div>
              <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px;">
                <div style="font-size:10px; font-family:var(--font-mono); color:var(--grey1);">INSTITUCIÓN EMISORA</div>
                <div style="font-size:13px; font-weight:900; color:#fff;">🏛️ ${ev.venue}</div>
              </div>
              <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px;">
                <div style="font-size:10px; font-family:var(--font-mono); color:var(--grey1);">MODALIDAD</div>
                <div style="font-size:13px; font-weight:900; color:var(--gold);">🌐 100% Digital</div>
              </div>
            </div>

            <!-- Requisitos -->
            <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:14px;">
              <div style="font-size:12px; font-weight:900; color:var(--accent); font-family:var(--font-mono); margin-bottom:8px;">
                📋 REQUISITOS DE POSTULACIÓN
              </div>
              <ul style="color:var(--grey1); font-size:12px; line-height:1.7; padding-left:16px; margin:0;">
                <li>Residir comprobablemente en Quito o Pichincha.</li>
                <li>Presentar dossier técnico del proyecto y portafolio.</li>
                <li>Desglose presupuestario y cronograma a 6 meses.</li>
                <li>Aceptar bases legales de la Secretaría de Cultura / KAWSAY.</li>
              </ul>
            </div>

            <div style="font-size:11px; color:var(--grey1); font-family:var(--font-mono); text-align:center; padding-top:4px;">
              🔒 Plataforma Cultural KAWSAY Quito · Transparencia y Gestión Comunitaria
            </div>
          </div><!-- /offcanvas-body -->

          <!-- Sticky Action Bar -->
          <div class="offcanvas-action-bar">
            <button class="btn-primary" id="btn-detail-apply-now" style="background:var(--accent); color:#000; font-family:var(--font-mono); font-weight:900; padding:14px; font-size:13px; display:flex; align-items:center; justify-content:center; gap:8px;">
              🚀 POSTULAR AHORA / APLICAR AL FONDO
            </button>
            <button class="btn-secondary" id="btn-detail-download-pdf" style="border:1px solid var(--border); color:#fff; font-family:var(--font-mono); font-weight:800; padding:12px; font-size:12px; display:flex; align-items:center; justify-content:center; gap:8px;">
              📄 DESCARGAR BASES Y REGLAMENTO (PDF)
            </button>
          </div><!-- /offcanvas-action-bar -->

        </div><!-- /offcanvas-left -->

        <!-- RIGHT: Fixed image column -->
        <div class="offcanvas-hero">
          <img class="offcanvas-hero-img" src="${ev.image}" alt="${ev.title}">
          <button class="offcanvas-close-btn" id="modal-detail-close" aria-label="Cerrar">×</button>
          <div class="offcanvas-hero-overlay">
            <span class="cat-convocatorias" style="font-size:10px; font-weight:900; padding:3px 10px; border-radius:8px; text-transform:uppercase; display:inline-block;">
              📢 CONVOCATORIA
            </span>
          </div>
        </div><!-- /offcanvas-hero (right image) -->
      `;

      $('#modal-detail-close').addEventListener('click', closeEventDetailModal);
      $('#btn-detail-apply-now').addEventListener('click', () => {
        closeEventDetailModal();
        openApplyConvocatoriaModal(ev);
      });
      $('#btn-detail-download-pdf').addEventListener('click', () => {
        downloadBasesPDF(ev.title);
      });

      detailBox.querySelectorAll('.star-icon').forEach(star => {
        star.addEventListener('click', () => {
          const score = parseInt(star.dataset.star);
          ev.rating_sum = (ev.rating_sum || 0) + score;
          ev.rating_count = (ev.rating_count || 0) + 1;
          showToast(`¡Gracias! Has valorado esta convocatoria con ${score} estrellas ⭐`);
        });
      });

      showModal('#modal-event-detail');
      return;
    }

    detailBox.innerHTML = `

      <!-- ═══ LEFT: Event Image + Giant Title Overlay ═══ -->
      <div class="offcanvas-hero">
        <img class="offcanvas-hero-img" src="${ev.image}" alt="${ev.title}">

        <!-- Top-left badges -->
        <div class="offcanvas-hero-badges">
          <span style="background:var(--accent,#d4ff00); color:#000; font-family:var(--font-mono); font-size:10px; font-weight:900; padding:4px 10px; border-radius:6px; letter-spacing:0.5px;">${ev.badge || 'DESTACADO'}</span>
          <span style="background:#ef4444; color:#fff; font-family:var(--font-mono); font-size:10px; font-weight:900; padding:4px 10px; border-radius:6px; letter-spacing:0.5px;">${ev.category.toUpperCase()}</span>
        </div>

        <!-- Bottom: giant title + venue + rating -->
        <div class="offcanvas-hero-title-block">
          <h2 class="offcanvas-event-title">${ev.title}</h2>
          <div class="offcanvas-venue-row">
            <span class="offcanvas-venue-text" id="btn-hero-venue-text" style="cursor:pointer;" title="Ver perfil del espacio">📍 ${ev.venue}${ev.sector ? `, ${ev.sector}` : ''}</span>
            <span class="offcanvas-venue-line"></span>
            <div class="offcanvas-rating-row">
              <div class="rating-stars" id="detail-rating-stars" style="gap:2px;">
                <span class="star-icon" data-star="1" style="font-size:13px;">★</span>
                <span class="star-icon" data-star="2" style="font-size:13px;">★</span>
                <span class="star-icon" data-star="3" style="font-size:13px;">★</span>
                <span class="star-icon" data-star="4" style="font-size:13px;">★</span>
                <span class="star-icon" data-star="5" style="font-size:13px;">★</span>
              </div>
              <span id="detail-rating-text" style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:rgba(255,255,255,0.65); margin-left:4px;">
                ${ev.rating_count > 0 ? (ev.rating_sum / ev.rating_count).toFixed(1) : '5.0'} (${ev.rating_count || 8} VALORACIONES)
              </span>
            </div>
          </div>
        </div>
      </div><!-- /offcanvas-hero LEFT -->

      <!-- ═══ RIGHT: Info Panel ═══ -->
      <div class="offcanvas-left">

        <!-- Close button -->
        <button class="offcanvas-close-btn" id="modal-detail-close" aria-label="Cerrar">&times;</button>

        <!-- Scrollable content -->
        <div class="offcanvas-body">
        ${currentUser && (currentUser.role === 'admin' || currentUser.role === 'gestor') ? `
          ${ev.status === 'pending' ? `
            <!-- PANEL DE MODERACIÓN PARA ADMINISTRADOR -->
            <div class="admin-moderation-box" style="background:linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(30,27,75,0.8) 100%); border:2px solid #ef4444; border-radius:14px; padding:18px; box-shadow:0 6px 20px rgba(239,68,68,0.25);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:22px;">🛡️</span>
                  <div>
                    <strong style="font-family:var(--font-mono); font-size:13px; color:#ef4444; letter-spacing:0.5px; font-weight:900; display:block;">
                      REVISIÓN Y MODERACIÓN DE CARTELERA
                    </strong>
                    <span style="font-size:11px; color:var(--grey1); font-family:var(--font-mono);">Decisión requerida de Administración</span>
                  </div>
                </div>
                <span style="background:#ef4444; color:#fff; font-family:var(--font-mono); font-size:10px; font-weight:900; padding:4px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.3);">
                  PENDIENTE
                </span>
              </div>
              <p style="font-size:12px; color:#e2e8f0; line-height:1.5; margin-bottom:14px;">
                Revisa los detalles técnicos, recinto, precio y aforo. Como Administrador puedes aprobar este espectáculo para publicarlo de inmediato en la cartelera de Quito o rechazarlo.
              </p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button class="btn-primary" id="btn-detail-admin-approve" style="background:var(--accent); color:#000; font-family:var(--font-mono); font-weight:900; padding:12px 14px; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; border:none; border-radius:8px;">
                  APROBAR CARTELERA ✅
                </button>
                <button class="btn-secondary" id="btn-detail-admin-reject" style="background:#ef4444; color:#fff; font-family:var(--font-mono); font-weight:900; padding:12px 14px; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; border:none; border-radius:8px;">
                  RECHAZAR CARTELERA ❌
                </button>
              </div>
            </div>
          ` : ev.status === 'approved' ? `
            <div style="background:rgba(16,185,129,0.12); border:1px solid #10b981; border-radius:12px; padding:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="color:#10b981; font-weight:900; font-size:13px; font-family:var(--font-mono); display:flex; align-items:center; gap:6px;">
                  ✅ CARTELERA APROBADA Y PUBLICADA
                </div>
                <div style="font-size:11px; color:var(--grey1); font-family:var(--font-mono);">Visible para todo el público de Quito</div>
              </div>
              <button id="btn-detail-admin-revoke" style="background:transparent; color:#ef4444; border:1px solid #ef4444; border-radius:6px; padding:6px 12px; font-size:11px; cursor:pointer; font-weight:800; font-family:var(--font-mono);">
                PAUSAR / PENDIENTE ⏸️
              </button>
            </div>
          ` : `
            <div style="background:rgba(239,68,68,0.12); border:1px solid #ef4444; border-radius:12px; padding:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="color:#ef4444; font-weight:900; font-size:13px; font-family:var(--font-mono); display:flex; align-items:center; gap:6px;">
                  ❌ CARTELERA RECHAZADA
                </div>
                <div style="font-size:11px; color:var(--grey1); font-family:var(--font-mono);">No visible en la cartelera pública</div>
              </div>
              <button id="btn-detail-admin-reopen" style="background:var(--accent); color:#000; border:none; border-radius:6px; padding:6px 14px; font-size:11px; cursor:pointer; font-weight:900; font-family:var(--font-mono);">
                RE-EVALUAR & APROBAR ✅
              </button>
            </div>
          `}
        ` : ''}

          <!-- ⓘ Acerca del espectáculo -->
          <div>
            <div class="detail-section-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              ACERCA DEL ESPECTÁCULO
            </div>
            <p style="color:rgba(255,255,255,0.72); line-height:1.6; font-size:13px; margin:0;">
              ${ev.description || 'Presentación especial en la agenda multicultural de Quito. Disfruta de un espectáculo de alta calidad artística con el respaldo técnico y la producción del recinto. Una obra que explora las raíces sonoras de la ciudad.'}
            </p>
          </div>

          <!-- Info grid 2-col -->
          <div class="detail-info-grid">
            <div class="detail-info-card">
              <span class="dic-label">FECHA</span>
              <span class="dic-value"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${ev.date}</span>
            </div>
            <div class="detail-info-card">
              <span class="dic-label">HORA DE INICIO</span>
              <span class="dic-value"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${ev.time}</span>
            </div>
            <div class="detail-info-card">
              <span class="dic-label">PRECIO ENTRADA</span>
              <span class="dic-value accent"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 1-2-2h-4a2 2 0 0 1-2 2v16"/></svg>${ev.price}</span>
            </div>
            <div class="detail-info-card">
              <span class="dic-label">AFORO ESTIMADO</span>
              <span class="dic-value"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>${ev.capacity ? `${ev.capacity} Personas` : '250 Personas'}</span>
            </div>
            <div class="detail-info-card" id="btn-detail-venue-card" style="cursor:pointer; transition:all 0.15s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
              <span class="dic-label">RECINTO / ESPACIO</span>
              <span class="dic-value" style="font-size:13px; color:#fff;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>${ev.venue}</span>
            </div>
            <div class="detail-info-card">
              <span class="dic-label">UBICACIÓN / SECTOR</span>
              <span class="dic-value gold" style="font-size:13px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${ev.sector || 'Quito Centro'}</span>
            </div>
          </div>

          <!-- Elenco -->
          <div style="display:flex; align-items:center; gap:12px; padding:12px 14px; background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:10px;">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--accent); flex-shrink:0;" alt="Artista">
            <div>
              <div style="font-weight:900; font-size:13px; color:#fff;">${ev.cast || 'Mateo & La Banda (Colectivo Invitado)'}</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.4); font-family:var(--font-mono); margin-top:2px;">Elenco Principal · ${ev.category} · Quito</div>
            </div>
          </div>

          <div style="font-size:10px; color:rgba(255,255,255,0.2); font-family:var(--font-mono); text-align:center;">
            🔒 KAWSAY · Plataforma Cultural de Quito
          </div>

        </div><!-- /offcanvas-body -->

        <!-- Sticky Action Bar -->
        <div class="offcanvas-action-bar">
          ${ev.status === 'pending' ? `
            <div style="background:#1a1a1a; border:1px dashed #ef4444; border-radius:8px; padding:12px; text-align:center;">
              <div style="font-size:11px; color:#ef4444; font-family:var(--font-mono); font-weight:800;">⏳ EN REVISIÓN DE MODERACIÓN</div>
              <div style="font-size:10px; color:rgba(255,255,255,0.45); margin-top:3px;">Compra disponible tras aprobación</div>
            </div>
          ` : `
            <button class="btn-cart-main" id="btn-detail-add-cart">
              ${ICONS.cart} AGREGAR ENTRADA AL CARRITO
            </button>
          `}
          <div class="btn-row-2">
            <button class="btn-secondary-action ${inter.is_favorite ? 'fav-active' : ''}" id="btn-detail-fav">
              ${inter.is_favorite ? ICONS.heartFill : ICONS.heart} FAVORITO
            </button>
            <button class="btn-secondary-action ${inter.has_rsvp ? 'rsvp-active' : ''}" id="btn-detail-rsvp">
              ${inter.has_rsvp ? ICONS.check : ICONS.user} ASISTIRÉ
            </button>
          </div>
        </div><!-- /offcanvas-action-bar -->

      </div><!-- /offcanvas-left RIGHT -->
    `;

    // Listeners de Estrellas de Calificación
    detailBox.querySelectorAll('.star-icon').forEach(star => {
      star.addEventListener('click', async () => {
        const score = parseInt(star.dataset.star);
        try {
          const res = await fetch(`${API_BASE}/events/${ev.id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: score })
          });
          const data = await res.json();
          if (res.ok) {
            ev.rating_sum = (ev.rating_sum || 0) + score;
            ev.rating_count = (ev.rating_count || 0) + 1;
            const textSpan = $('#detail-rating-text');
            if (textSpan) textSpan.textContent = `⭐ ${data.average} (${data.total} calificaciones)`;
            showToast(`¡Gracias! Has calificado este evento con ${score} estrellas ⭐`);
            renderHomeView();
          }
        } catch (err) {
          showToast('Error al registrar la calificación.');
        }
      });
    });

    $('#modal-detail-close').addEventListener('click', closeEventDetailModal);

    // Venue click → Open space profile modal
    const triggerSpaceModal = () => {
      let matchedSpace = apiSpaces.find(s =>
        (ev.space_id && String(s.id) === String(ev.space_id)) ||
        (s.name && ev.venue && s.name.toLowerCase().includes(ev.venue.toLowerCase().split(' ')[0])) ||
        (s.name && ev.venue && ev.venue.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
      );
      if (!matchedSpace && KAWSAY_DATA && KAWSAY_DATA.spaces) {
        matchedSpace = KAWSAY_DATA.spaces.find(s =>
          (s.name && ev.venue && s.name.toLowerCase().includes(ev.venue.toLowerCase().split(' ')[0])) ||
          (s.name && ev.venue && ev.venue.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]))
        );
      }
      const targetSpaceId = matchedSpace ? matchedSpace.id : (apiSpaces[0] ? apiSpaces[0].id : 'sp-001');
      closeEventDetailModal();
      setTimeout(() => openSpaceDetailModal(targetSpaceId), 150);
    };

    const venueCard = $('#btn-detail-venue-card');
    if (venueCard) venueCard.addEventListener('click', triggerSpaceModal);
    const heroVenue = $('#btn-hero-venue-text');
    if (heroVenue) heroVenue.addEventListener('click', triggerSpaceModal);

    // Moderación Admin en Drawer
    const adminApprove = $('#btn-detail-admin-approve');
    if (adminApprove) {
      adminApprove.addEventListener('click', async () => {
        closeEventDetailModal();
        await setEventStatus(ev.id, 'approved');
      });
    }

    const adminReject = $('#btn-detail-admin-reject');
    if (adminReject) {
      adminReject.addEventListener('click', async () => {
        closeEventDetailModal();
        await setEventStatus(ev.id, 'rejected');
      });
    }

    const adminRevoke = $('#btn-detail-admin-revoke');
    if (adminRevoke) {
      adminRevoke.addEventListener('click', async () => {
        closeEventDetailModal();
        await setEventStatus(ev.id, 'pending');
      });
    }

    const adminReopen = $('#btn-detail-admin-reopen');
    if (adminReopen) {
      adminReopen.addEventListener('click', async () => {
        closeEventDetailModal();
        await setEventStatus(ev.id, 'approved');
      });
    }

    const addCartBtn = $('#btn-detail-add-cart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        const price = parseInt(ev.price.replace('$', '')) || 15;
        addToCart(ev.title, price);
        closeEventDetailModal();
      });
    }

    const editBtn = $('#btn-detail-edit-event');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        closeEventDetailModal();
        openEditEventModal(ev.id);
      });
    }

    $('#btn-detail-fav').addEventListener('click', async () => {
      if (currentUser.role === 'invitado') { openAuthModal(); return; }
      try {
        const res = await fetch(`${API_BASE}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, event_id: ev.id, action: 'toggle_favorite' })
        });
        const data = await res.json();
        if (res.ok) {
          userInteractions[ev.id] = { is_favorite: data.is_favorite, has_rsvp: data.has_rsvp };
          showToast(data.is_favorite ? 'Guardado en Favoritos' : 'Eliminado de Favoritos');
          openEventDetailModal(ev.id);
          renderSidebar();
        }
      } catch (e) { showToast('Error'); }
    });

    $('#btn-detail-rsvp').addEventListener('click', async () => {
      if (currentUser.role === 'invitado') { openAuthModal(); return; }
      try {
        const res = await fetch(`${API_BASE}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, event_id: ev.id, action: 'toggle_rsvp' })
        });
        const data = await res.json();
        if (res.ok) {
          userInteractions[ev.id] = { is_favorite: data.is_favorite, has_rsvp: data.has_rsvp };
          showToast(data.has_rsvp ? '¡Asistencia registrada!' : 'Asistencia cancelada');
          openEventDetailModal(ev.id);
        }
      } catch (e) { showToast('Error'); }
    });

    showModal('#modal-event-detail');
  }

  function openEditEventModal(eventId) {
    if (currentUser.role === 'invitado' || currentUser.role === 'espectador') {
      currentUser = usersList.find(u => u.role === 'artista') || usersList[2];
      showToast(`⚡ Cambiado a perfil Artista: ${currentUser.name} para modificar eventos.`);
      renderSidebar();
      renderTopbar();
    }

    const ev = apiEvents.find(e => e.id === eventId);
    if (!ev) return;

    editingEventId = eventId;
    $('#modal-create-title').textContent = `✏️ MODIFICAR CARTELERA: ${ev.title.toUpperCase()}`;
    if ($('#btn-submit-billboard')) $('#btn-submit-billboard').textContent = '💾 GUARDAR Y ACTUALIZAR CAMBIOS EN VIVO';

    $('#ev-title').value = ev.title || '';
    if ($('#ev-subtitle')) $('#ev-subtitle').value = ev.full_title || '';
    if ($('#ev-badge')) $('#ev-badge').value = ev.badge || 'ESTRENO EXCLUSIVO';
    if ($('#ev-category')) $('#ev-category').value = ev.category || 'Música';
    if ($('#ev-date')) $('#ev-date').value = ev.date || '2026-10-30';
    if ($('#ev-time')) $('#ev-time').value = ev.time || '20:00';
    if ($('#ev-venue')) $('#ev-venue').value = ev.venue || '';
    if ($('#ev-price')) $('#ev-price').value = ev.price || '$15';
    if ($('#ev-desc')) $('#ev-desc').value = ev.description || '';
    if ($('#ev-image')) $('#ev-image').value = ev.image || '';

    const event = new Event('input');
    $('#ev-title').dispatchEvent(event);

    showModal('#modal-create');
  }

  function closeEventDetailModal() { hideModal('#modal-event-detail'); }

  function addToCart(title, price) {
    const existing = cartItems.find(item => item.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({ id: 'cart-' + Date.now(), title, venue: 'Quito Recinto', price, qty: 1 });
    }
    renderTopbar();
    showToast(`"${title}" agregado al Carrito`);
  }

  function filterEventsByCategory(category) {
    const grid = $('#events-grid');
    if (!grid) return;
    const filtered = (category === 'TODOS')
      ? apiEvents
      : apiEvents.filter(e => e.category && e.category.toLowerCase() === category.toLowerCase());
    grid.innerHTML = filtered.map(ev => renderEventCard(ev)).join('');
    bindCardInteractions();
  }

  function filterEventsByLocation(location) {
    const grid = $('#events-grid');
    if (!grid) return;
    if (location === 'TODOS') {
      grid.innerHTML = apiEvents.map(ev => renderEventCard(ev)).join('');
    } else {
      const filtered = apiEvents.filter(e => e.venue && e.venue.toLowerCase().includes(location.toLowerCase()));
      grid.innerHTML = filtered.map(ev => renderEventCard(ev)).join('');
    }
    bindCardInteractions();
  }

  function filterEventsBySearch(query) {
    const grid = $('#events-grid');
    if (!grid) return;
    const filtered = apiEvents.filter(e =>
      e.title.toLowerCase().includes(query) ||
      (e.description && e.description.toLowerCase().includes(query)) ||
      (e.venue && e.venue.toLowerCase().includes(query))
    );
    grid.innerHTML = filtered.map(ev => renderEventCard(ev)).join('');
    bindCardInteractions();
  }

  function filterFavorites() {
    const grid = $('#events-grid');
    if (!grid) return;
    const favEvents = apiEvents.filter(e => userInteractions[e.id] && userInteractions[e.id].is_favorite);
    if (favEvents.length === 0) {
      showToast("No tienes eventos en Favoritos aún.");
      return;
    }
    grid.innerHTML = favEvents.map(ev => renderEventCard(ev)).join('');
    bindCardInteractions();
  }

  function renderJoinView() {
    const view = document.getElementById('view-join');
    if (!view) return;
    view.innerHTML = `
      <div class="join-header">
        <h1 class="join-header-title">PORTAL DE PERFILES</h1>
        <p class="join-header-desc">
          Selecciona un perfil para iniciar sesión y acceder a las funciones correspondientes de KAWSAY.
        </p>
      </div>

      <div class="join-options-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; padding:20px 0;">
        
        <!-- Perfil 1: Espectador / Visitante -->
        <div class="join-card" style="border:1px solid ${currentUser.role === 'espectador' ? 'var(--accent)' : 'var(--border)'}; background:var(--surface);">
          <div class="join-card-icon" style="color:#60a5fa;">🌐</div>
          <h2 class="join-card-title">1. Espectador / Visitante</h2>
          <p class="join-card-desc">
            <strong>María Fernanda</strong> (espectador@kawsay.ec)<br>
            Acceso a la cartelera pública, consulta de agenda, guardado de favoritos y reserva de entradas. Sin permisos de edición ni administración.
          </p>
          <button class="btn-join-action btn-switch-profile" data-role="espectador" style="background:#60a5fa; color:#000; font-weight:900;">
            ${currentUser.role === 'espectador' ? '✓ PERFIL ACTIVO' : 'INGRESAR COMO ESPECTADOR →'}
          </button>
        </div>

        <!-- Perfil 2: Artista / Colectivo -->
        <div class="join-card" style="border:1px solid ${currentUser.role === 'artista' ? 'var(--accent)' : 'var(--border)'}; background:var(--surface);">
          <div class="join-card-icon" style="color:var(--accent);">${ICONS.artist}</div>
          <h2 class="join-card-title">2. Artista / Colectivo</h2>
          <p class="join-card-desc">
            <strong>Mateo & La Banda</strong> (artista@kawsay.ec)<br>
            Acceso a <em>Mi Estudio Artista</em>. Publica nuevos conciertos o proyectos, edita tus eventos y postula a fondos de fomento.
          </p>
          <button class="btn-join-action btn-switch-profile" data-role="artista" style="background:var(--accent); color:#000; font-weight:900;">
            ${currentUser.role === 'artista' ? '✓ PERFIL ACTIVO' : 'INGRESAR COMO ARTISTA →'}
          </button>
        </div>

        <!-- Perfil 3: Espacio Cultural -->
        <div class="join-card" style="border:1px solid ${currentUser.role === 'espacio' ? 'var(--gold)' : 'var(--border)'}; background:var(--surface);">
          <div class="join-card-icon" style="color:var(--gold);">${ICONS.landmark}</div>
          <h2 class="join-card-title">3. Espacio Cultural</h2>
          <p class="join-card-desc">
            <strong>Teatro Nacional Quito</strong> (espacio@kawsay.ec)<br>
            Acceso a <em>Mi Espacio Cultural</em>. Programa fechas en tu recinto, administra recintos de Quito y gestiona tu cartelera.
          </p>
          <button class="btn-join-action btn-switch-profile" data-role="espacio" style="background:var(--gold); color:#000; font-weight:900;">
            ${currentUser.role === 'espacio' ? '✓ PERFIL ACTIVO' : 'INGRESAR COMO ESPACIO →'}
          </button>
        </div>

        <!-- Perfil 4: Administrador Global -->
        <div class="join-card" style="border:1px solid ${currentUser.role === 'admin' ? '#ef4444' : 'var(--border)'}; background:var(--surface);">
          <div class="join-card-icon" style="color:#ef4444;">🛡️</div>
          <h2 class="join-card-title">4. Administrador / Gestor</h2>
          <p class="join-card-desc">
            <strong>Admin Kawsay</strong> (admin@kawsay.ec)<br>
            Acceso a <em>Panel Admin & Analíticas</em>. Supervisa la cola de aprobación (Aprobar/Rechazar), revisa postulantes con folios y administra toda la plataforma.
          </p>
          <button class="btn-join-action btn-switch-profile" data-role="admin" style="background:#ef4444; color:#fff; font-weight:900;">
            ${currentUser.role === 'admin' ? '✓ PERFIL ACTIVO' : 'INGRESAR COMO ADMIN →'}
          </button>
        </div>

      </div>
    `;

    view.querySelectorAll('.btn-switch-profile').forEach(btn => {
      btn.addEventListener('click', async () => {
        const role = btn.dataset.role;
        const targetUser = usersList.find(u => u.role === role) || usersList[1];
        if (targetUser) {
          currentUser = targetUser;
          localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
          await loadUserInteractions();
          showToast(`⚡ Perfil cambiado a: ${currentUser.role.toUpperCase()} (${currentUser.name})`);
          renderSidebar();
          renderTopbar();
          
          if (role === 'admin') navigate('admin');
          else if (role === 'artista') navigate('artist');
          else if (role === 'espacio') navigate('space');
          else navigate('home');
        }
      });
    });
  }

  function renderWeekView() {
    const view = document.getElementById('view-calendar-week');
    if (!view) return;

    // Calculate dates for current week offset from real current date
    const baseDate = new Date(realCalYear, realCalMonth, realCalDay + (weekStartOffset * 7));
    const endDate = new Date(baseDate);
    endDate.setDate(baseDate.getDate() + 6);

    const startMonthName = MONTH_NAMES[baseDate.getMonth()].toUpperCase();
    const endMonthName = MONTH_NAMES[endDate.getMonth()].toUpperCase();

    view.innerHTML = `
      <div class="calendar-header-bar" style="padding:24px 32px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h2 class="calendar-view-title" style="font-size:24px; font-weight:900;">
            AGENDA SEMANAL — ${baseDate.getDate()} ${startMonthName} A ${endDate.getDate()} ${endMonthName} ${baseDate.getFullYear()}
          </h2>
          <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono);">SEMANA DE EVENTOS ACTIVOS EN QUITO</p>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <button id="btn-cal-prev-week" style="background:var(--surface2); border:1px solid var(--border); color:#fff; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            ◄ SEMANA ANTERIOR
          </button>
          <button id="btn-cal-today-week" style="background:var(--accent); color:#000; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:900; border:none; cursor:pointer;">
            📍 ESTA SEMANA
          </button>
          <button id="btn-cal-next-week" style="background:var(--surface2); border:1px solid var(--border); color:#fff; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            SIGUIENTE SEMANA ►
          </button>
        </div>
      </div>
      <div style="padding: 12px 32px 32px;" id="week-grid-container"></div>
    `;

    bindWeekNavigationEvents();
    buildWeekGrid();
  }

  function bindWeekNavigationEvents() {
    const prev = document.getElementById('btn-cal-prev-week');
    const next = document.getElementById('btn-cal-next-week');
    const today = document.getElementById('btn-cal-today-week');

    if (prev) prev.addEventListener('click', () => { weekStartOffset--; renderWeekView(); });
    if (next) next.addEventListener('click', () => { weekStartOffset++; renderWeekView(); });
    if (today) today.addEventListener('click', () => { weekStartOffset = 0; renderWeekView(); });
  }

  function buildWeekGrid() {
    const container = document.getElementById('week-grid-container');
    if (!container) return;

    const daysOfWeek = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const baseDate = new Date(realCalYear, realCalMonth, realCalDay + (weekStartOffset * 7));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = `${daysOfWeek[d.getDay()]} ${dd}`;
      weekDays.push({ name: dayName, dateStr });
    }

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:12px; margin-top:10px;">
        ${weekDays.map(day => {
          const dayEvents = apiEvents.filter(e => {
            if (!e.date) return false;
            const norm = normalizeDateStr(e.date);
            return norm === day.dateStr;
          });

          return `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px; min-height:380px;">
              <div style="font-family:var(--font-mono); font-weight:900; font-size:12px; color:var(--accent); border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:12px;">
                ${day.name}
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${dayEvents.length > 0 ? dayEvents.map(e => `
                  <div class="event-card" data-id="${e.id}" style="background:var(--surface2); padding:10px; border-radius:8px; border:1px solid var(--border); cursor:pointer;">
                    <div style="font-size:10px; color:var(--gold); font-weight:800; font-family:var(--font-mono);">${e.time || ''} · ${e.category || ''}</div>
                    <div style="font-size:12px; font-weight:800; margin:4px 0;">${e.title}</div>
                    <div style="font-size:10px; color:var(--grey1);">${e.venue}</div>
                  </div>
                `).join('') : `<div style="font-size:11px; color:var(--grey2); text-align:center; margin-top:40px;">Sin eventos agendados</div>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', () => {
        openEventDetailModal(card.dataset.id);
      });
    });
  }

  function renderMonthView() {
    const view = document.getElementById('view-calendar-month');
    if (!view) return;

    view.innerHTML = `
      <!-- Header del Calendario Mensual -->
      <div style="padding:24px 32px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h2 class="calendar-view-title" id="cal-month-title" style="font-size:26px; font-weight:900; margin:0;">
            CALENDARIO MENSUAL — ${MONTH_NAMES[calendarMonth].toUpperCase()} ${calendarYear}
          </h2>
          <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono); margin-top:4px;">
            MATRIZ COMPLETA DE EVENTOS Y ACTIVIDADES CULTURALES EN QUITO
          </p>
        </div>

        <!-- Botones de Navegación del Mes -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button id="btn-cal-prev-month" style="background:var(--surface2); border:1px solid var(--border); color:#fff; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            ◄ ANTERIOR
          </button>
          
          <select id="select-cal-month" style="background:var(--surface3); border:1px solid var(--border); color:#fff; padding:8px 12px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            ${MONTH_NAMES.map((m, idx) => `<option value="${idx}" ${idx === calendarMonth ? 'selected' : ''}>${m.toUpperCase()}</option>`).join('')}
          </select>

          <select id="select-cal-year" style="background:var(--surface3); border:1px solid var(--border); color:#fff; padding:8px 12px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            <option value="2025" ${calendarYear === 2025 ? 'selected' : ''}>2025</option>
            <option value="2026" ${calendarYear === 2026 ? 'selected' : ''}>2026</option>
            <option value="2027" ${calendarYear === 2027 ? 'selected' : ''}>2027</option>
          </select>

          <button id="btn-cal-next-month" style="background:var(--surface2); border:1px solid var(--border); color:#fff; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:800; cursor:pointer;">
            SIGUIENTE ►
          </button>

          <button id="btn-cal-today" style="background:var(--accent); color:#000; padding:8px 14px; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:900; border:none; cursor:pointer;" title="Regresar al día actual (26 Oct 2026)">
            📍 HOY
          </button>
        </div>
      </div>

      <!-- Grid Principal + Panel Lateral -->
      <div class="month-view-layout" style="display:grid; grid-template-columns: 1fr 340px; gap:24px; padding:12px 32px 32px;">
        <div id="month-grid-wrap"></div>
        
        <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; display:flex; flex-direction:column; gap:16px;">
          <div id="selected-day-header" style="border-bottom:1px solid var(--border); padding-bottom:12px;"></div>
          <div id="upcoming-list" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>
      </div>
    `;

    bindMonthNavigationEvents();
    buildMonthGrid();
    buildUpcomingList();
  }

  function bindMonthNavigationEvents() {
    const prevBtn = document.getElementById('btn-cal-prev-month');
    const nextBtn = document.getElementById('btn-cal-next-month');
    const monthSelect = document.getElementById('select-cal-month');
    const yearSelect = document.getElementById('select-cal-year');
    const todayBtn = document.getElementById('btn-cal-today');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        calendarMonth--;
        if (calendarMonth < 0) {
          calendarMonth = 11;
          calendarYear--;
        }
        renderMonthView();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        calendarMonth++;
        if (calendarMonth > 11) {
          calendarMonth = 0;
          calendarYear++;
        }
        renderMonthView();
      });
    }

    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        calendarMonth = parseInt(e.target.value);
        renderMonthView();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        calendarYear = parseInt(e.target.value);
        renderMonthView();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        calendarYear = realCalYear;
        calendarMonth = realCalMonth;
        selectedCalendarDate = `${realCalYear}-${String(realCalMonth + 1).padStart(2, '0')}-${String(realCalDay).padStart(2, '0')}`;
        renderMonthView();
      });
    }
  }

  function buildMonthGrid() {
    const wrap = document.getElementById('month-grid-wrap');
    if (!wrap) return;

    const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    
    // Calculate first day of week offset and total days in month
    const firstDayObj = new Date(calendarYear, calendarMonth, 1);
    const startDayOffset = firstDayObj.getDay();
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    let html = `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;">
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:8px; text-align:center; font-family:var(--font-mono); font-size:12px; font-weight:800; color:var(--grey1); margin-bottom:12px;">
          ${daysOfWeek.map(d => `<div>${d}</div>`).join('')}
        </div>
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:8px;">
    `;

    for (let i = 0; i < startDayOffset; i++) {
      html += `<div style="min-height:100px; background:transparent; opacity:0.3; border:1px dashed rgba(255,255,255,0.05); border-radius:8px;"></div>`;
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const targetDateStr = `${calendarYear}-${monthStr}-${dayStr}`;

      const dayEvents = apiEvents.filter(e => {
        if (!e.date) return false;
        const norm = normalizeDateStr(e.date);
        return norm === targetDateStr;
      });

      const isToday = (calendarYear === realCalYear && calendarMonth === realCalMonth && day === realCalDay);
      const isSelected = (selectedCalendarDate === targetDateStr);

      html += `
        <div class="calendar-day-cell ${isSelected ? 'selected-day' : ''}" data-date="${targetDateStr}" style="min-height:105px; background:${isSelected ? 'rgba(198,241,53,0.12)' : (isToday ? 'var(--surface3)' : 'var(--surface2)')}; border:${isSelected ? '2px solid var(--accent)' : (isToday ? '2px solid var(--gold)' : '1px solid var(--border)')}; border-radius:8px; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:border-color 0.15s, background 0.15s;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:var(--font-mono); font-weight:900; font-size:13px; color:${isSelected || isToday ? 'var(--accent)' : 'var(--white)'};">
              ${day} ${isToday ? '• HOY' : ''}
            </span>
            ${dayEvents.length > 0 ? `<span style="font-size:10px; background:var(--accent); color:#000; font-weight:900; padding:1px 5px; border-radius:10px; font-family:var(--font-mono);">${dayEvents.length}</span>` : ''}
          </div>

          <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px; flex:1; justify-content:flex-start;">
            ${dayEvents.slice(0, 2).map(e => {
              const catClass = getCategoryClass(e.category);
              return `
                <div class="month-event-pill ${catClass}" data-id="${e.id}" style="font-size:10px; font-weight:800; padding:4px 6px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.3);" title="${e.title} (${e.time || ''})">
                  ${e.time ? e.time + ' · ' : ''}${e.title}
                </div>
              `;
            }).join('')}
            ${dayEvents.length > 2 ? `<span style="font-size:9px; color:var(--gold); font-weight:800; font-family:var(--font-mono);">+${dayEvents.length - 2} más</span>` : ''}
          </div>
        </div>
      `;
    }

    html += `</div></div>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('.month-event-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetailModal(pill.dataset.id);
      });
    });

    wrap.querySelectorAll('.calendar-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        selectedCalendarDate = cell.dataset.date;
        buildMonthGrid();
        buildUpcomingList();
      });
    });
  }

  function buildUpcomingList() {
    const header = document.getElementById('selected-day-header');
    const list = document.getElementById('upcoming-list');
    if (!list) return;

    const dateParts = selectedCalendarDate.split('-');
    const selYear = dateParts[0] || String(realCalYear);
    const selMonthIdx = parseInt(dateParts[1] || String(realCalMonth + 1)) - 1;
    const selDay = parseInt(dateParts[2] || String(realCalDay));
    const selMonthName = MONTH_NAMES[selMonthIdx] || 'Septiembre';

    const selectedDayEvents = apiEvents.filter(e => {
      if (!e.date) return false;
      const norm = normalizeDateStr(e.date);
      return norm === selectedCalendarDate;
    });

    if (header) {
      header.innerHTML = `
        <div style="font-size:11px; font-family:var(--font-mono); color:var(--accent); font-weight:900; letter-spacing:0.5px;">
          📅 DÍA SELECCIONADO EN CALENDARIO
        </div>
        <div style="font-size:16px; font-weight:900; color:#fff; margin-top:2px;">
          ${selDay} DE ${selMonthName.toUpperCase()} DE ${selYear}
        </div>
        <button id="btn-add-event-selected-day" style="margin-top:8px; width:100%; background:var(--accent); color:#000; font-family:var(--font-mono); font-weight:900; font-size:11px; padding:8px; border:none; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
          ${ICONS.plus} + CREAR EVENTO PARA ESTE DÍA
        </button>
      `;

      const addBtn = document.getElementById('btn-add-event-selected-day');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          if ($('#ev-date')) $('#ev-date').value = selectedCalendarDate;
          openCreateModal();
        });
      }
    }

    let listHtml = '';

    if (selectedDayEvents.length > 0) {
      listHtml += `
        <div style="font-size:11px; font-family:var(--font-mono); color:var(--gold); font-weight:800; margin-bottom:4px;">
          EVENTOS AGENDADOS ESTE DÍA (${selectedDayEvents.length}):
        </div>
        ${selectedDayEvents.map(ev => `
          <div class="upcoming-event-card" data-id="${ev.id}" style="background:var(--surface2); padding:12px; border-radius:8px; border:1px solid var(--accent); cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:900; color:var(--accent); font-family:var(--font-mono);">${ev.time || '20:00'}</span>
              <span class="card-badge-cat ${getCategoryClass(ev.category)}" style="font-size:9px; padding:2px 6px; border-radius:4px; font-weight:800;">${ev.category}</span>
            </div>
            <div style="font-size:13px; font-weight:900; margin:6px 0 2px;">${ev.title}</div>
            <div style="font-size:11px; color:var(--grey1);">🏛️ ${ev.venue}</div>
          </div>
        `).join('')}
        <div style="border-top:1px solid var(--border); margin:12px 0 4px;"></div>
      `;
    } else {
      listHtml += `
        <div style="padding:10px; background:var(--surface2); border:1px dashed var(--border); border-radius:8px; font-size:11px; color:var(--grey1); text-align:center;">
          No hay eventos agendados para este día.
        </div>
        <div style="border-top:1px solid var(--border); margin:12px 0 4px;"></div>
      `;
    }

    listHtml += `
      <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800; margin-bottom:4px;">
        PRÓXIMOS EVENTOS DESTACADOS:
      </div>
      ${apiEvents.slice(0, 5).map(ev => `
        <div class="upcoming-event-card" data-id="${ev.id}" style="background:var(--surface2); padding:10px; border-radius:8px; border:1px solid var(--border); cursor:pointer;">
          <div style="font-size:10px; font-weight:800; color:var(--gold); font-family:var(--font-mono);">${ev.date} · ${ev.time}</div>
          <div style="font-size:12px; font-weight:800; margin:3px 0;">${ev.title}</div>
          <div style="font-size:10px; color:var(--grey1);">${ev.venue} (${ev.category})</div>
        </div>
      `).join('')}
    `;

    list.innerHTML = listHtml;

    list.querySelectorAll('.upcoming-event-card').forEach(card => {
      card.addEventListener('click', () => {
        openEventDetailModal(card.dataset.id);
      });
    });
  }

  // ============================================================
  // GENERADOR PROFESIONAL DE CARTELERA CULTURAL (FORMULARIO Y PREVIEW)
  // ============================================================
  function renderModals() {
    const container = document.getElementById('modals-container');
    container.innerHTML = `
      <!-- Modal Auth Real (Login / Registro Rápido) -->
      <div class="modal-overlay" id="modal-auth">
        <div class="cart-modal-box" style="max-width:460px; background:#0f172a; border:1px solid #334155; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
          <div class="modal-header" style="border-bottom:1px solid #1e293b; padding-bottom:12px;">
            <div>
              <div class="modal-title" style="font-size:18px; font-weight:900; color:#ffffff; display:flex; align-items:center; gap:8px;">
                ${ICONS.lock} ACCESO A LA PLATAFORMA
              </div>
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--accent); font-weight:800; margin-top:3px;">
                ⚡ REGISTRO EN MENOS DE 1 MINUTO
              </div>
            </div>
            <button class="modal-close" id="modal-auth-close" style="color:#94a3b8;">×</button>
          </div>
          
          <!-- Pestañas Auth -->
          <div style="display:flex; gap:10px; margin: 18px 0 20px;">
            <button id="tab-btn-login" class="tab-btn active" style="flex:1; padding:10px; font-size:13px; font-weight:900; border-radius:6px; cursor:pointer; background:var(--accent); color:#000000; border:none; letter-spacing:0.5px;">
              INICIAR SESIÓN
            </button>
            <button id="tab-btn-register" class="tab-btn" style="flex:1; padding:10px; font-size:13px; font-weight:700; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.08); color:#ffffff; border:1px solid rgba(255,255,255,0.2);">
              CREAR CUENTA
            </button>
          </div>

          <!-- Mensaje de Feedback -->
          <div id="auth-alert-msg" style="display:none; padding:12px; border-radius:6px; font-size:13px; margin-bottom:16px; font-weight:700;"></div>

          <!-- Formulario 1: Iniciar Sesión -->
          <form id="form-auth-login" style="display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">CORREO ELECTRÓNICO</label>
              <input type="email" id="login-email" required placeholder="tuemail@ejemplo.com" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">CONTRASEÑA</label>
              <input type="password" id="login-password" required placeholder="••••••••" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <button type="submit" class="btn-submit" style="background:var(--accent); color:#000000; font-weight:900; padding:14px; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-top:8px; letter-spacing:0.5px; text-transform:uppercase;">
              ENTRAR A MI CUENTA
            </button>
          </form>

          <!-- Formulario 2: Crear Cuenta (Registro Rápido & Sin Fricción) -->
          <form id="form-auth-register" style="display:none; flex-direction:column; gap:14px;">
            <!-- Opción 1 Clic: Social Auth -->
            <div class="social-auth-grid">
              <button type="button" class="social-auth-btn social-btn-google" id="btn-social-google">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Continuar con Google
              </button>
              <button type="button" class="social-auth-btn social-btn-apple" id="btn-social-apple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.06-1.88.94-2.97-1 .04-2.18.67-2.88 1.48-.56.65-1.05 1.76-.92 2.82 1.11.09 2.23-.55 2.86-1.33z"/></svg>
                Continuar con Apple ID
              </button>
            </div>

            <div class="social-divider">
              <span>o con tu correo electrónico</span>
            </div>

            <!-- Campos Mínimos Esenciales -->
            <div>
              <label style="display:block; font-size:11px; font-weight:800; margin-bottom:6px; color:#ffffff; letter-spacing:0.5px;">NOMBRE Y APELLIDO</label>
              <input type="text" id="reg-name" required placeholder="Ej. Sofía Morales" style="width:100%; padding:11px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:800; margin-bottom:6px; color:#ffffff; letter-spacing:0.5px;">CORREO ELECTRÓNICO ACTIVO</label>
              <input type="email" id="reg-email" required placeholder="tuemail@ejemplo.com" style="width:100%; padding:11px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:800; margin-bottom:6px; color:#ffffff; letter-spacing:0.5px;">CONTRASEÑA SEGURA</label>
              <div style="position:relative; display:flex; align-items:center;">
                <input type="password" id="reg-password" required placeholder="Mínimo 6 caracteres" style="width:100%; padding:11px 40px 11px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
                <button type="button" id="btn-toggle-reg-pass" style="position:absolute; right:10px; background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:16px;" title="Ver/Ocultar contraseña">
                  👁️
                </button>
              </div>
              <!-- Medidor Visual de Seguridad en Tiempo Real -->
              <div class="password-strength-container">
                <div class="password-strength-bar-bg">
                  <div id="password-strength-bar" class="password-strength-bar-fill"></div>
                </div>
                <div class="password-strength-text">
                  <span>Seguridad de contraseña</span>
                  <span id="password-strength-label">Mínimo 6 caracteres</span>
                </div>
              </div>
            </div>
            <div style="margin-top:2px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; color:#cbd5e1;">
                <input type="checkbox" id="reg-terms-check" required checked style="width:16px; height:16px; accent-color:var(--accent);">
                <span>Acepto los <a href="#" id="link-reg-terms" style="color:var(--accent); text-decoration:underline;">Términos y Condiciones</a> y la <a href="#" id="link-reg-privacy" style="color:var(--accent); text-decoration:underline;">Política de Privacidad</a></span>
              </label>
            </div>
            <button type="submit" class="btn-submit" id="btn-submit-reg" style="background:var(--accent); color:#000000; font-weight:900; padding:13px; border:none; border-radius:6px; cursor:pointer; font-size:13px; margin-top:6px; letter-spacing:0.5px; display:flex; align-items:center; justify-content:center; gap:8px;">
              CONTINUAR A PERSONALIZACIÓN (1/2) ➔
            </button>
          </form>
        </div>
      </div>

      <!-- Modal Onboarding Paso 2: Personalización de Intereses Culturales -->
      <div class="modal-overlay" id="modal-onboarding-preferences">
        <div class="cart-modal-box" style="max-width:520px; background:#0f172a; border:1px solid #334155; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); max-height:90vh; overflow-y:auto;">
          <div class="modal-header" style="border-bottom:1px solid #1e293b; padding-bottom:12px;">
            <div>
              <span style="font-size:11px; font-family:var(--font-mono); color:var(--accent); font-weight:800; letter-spacing:0.5px;">PASO 2 DE 2 · ALGORITMO DE DESCUBRIMIENTO</span>
              <div class="modal-title" style="font-size:18px; font-weight:900; color:#ffffff; margin-top:2px;">
                🎨 Personaliza tu Experiencia Cultural
              </div>
            </div>
            <button class="modal-close" id="modal-onboarding-close" style="color:#94a3b8;">×</button>
          </div>

          <div style="margin: 16px 0 20px;">
            <p style="font-size:13px; color:#cbd5e1; margin:0 0 16px; line-height:1.4;">
              Selecciona tus disciplinas artísticas favoritas y las zonas de Quito que más frecuentas para sugerirte la cartelera perfecta:
            </p>

            <!-- 1. Disciplinas e Intereses -->
            <label style="display:block; font-size:11px; font-weight:800; color:#94a3b8; font-family:var(--font-mono); text-transform:uppercase; margin-bottom:6px;">
              1. ¿Qué eventos te interesan explorar? (Selecciona tus preferidos)
            </label>
            <div class="onboarding-tags-grid" id="onboarding-categories-tags">
              <button type="button" class="onboarding-tag-pill active" data-cat="Teatro">🎭 Teatro & Escena</button>
              <button type="button" class="onboarding-tag-pill active" data-cat="Música Andina">🎶 Música Andina & Fusión</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Conciertos">🎸 Rock & Conciertos</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Cine">🎬 Cine Independiente</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Danza">💃 Danza & Artes Vivas</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Fotografía">📸 Fotografía & Galerías</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Arte Urbano">🎨 Arte Urbano & Murales</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Talleres">🛠️ Talleres Creativos</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Festivales">🎪 Festivales & Ferias</button>
              <button type="button" class="onboarding-tag-pill" data-cat="Literatura">📚 Literatura & Poesía</button>
            </div>

            <!-- 2. Zonas y Barrios en Quito -->
            <label style="display:block; font-size:11px; font-weight:800; color:#94a3b8; font-family:var(--font-mono); text-transform:uppercase; margin-top:18px; margin-bottom:6px;">
              2. ¿En qué zonas o barrios de Quito prefieres asistir?
            </label>
            <div class="onboarding-tags-grid" id="onboarding-zones-tags">
              <button type="button" class="onboarding-tag-pill active" data-zone="Centro Histórico">📍 Centro Histórico</button>
              <button type="button" class="onboarding-tag-pill active" data-zone="La Floresta">🌿 La Floresta</button>
              <button type="button" class="onboarding-tag-pill" data-zone="Cumbayá">⛰️ Cumbayá & Tumbaco</button>
              <button type="button" class="onboarding-tag-pill" data-zone="La Mariscal">🏙️ La Mariscal</button>
              <button type="button" class="onboarding-tag-pill" data-zone="Guápulo">🌄 Guápulo</button>
              <button type="button" class="onboarding-tag-pill" data-zone="La Carolina">🌳 Parque La Carolina</button>
              <button type="button" class="onboarding-tag-pill" data-zone="La Ronda">🏛️ San Marcos / La Ronda</button>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px; border-top:1px solid #1e293b; padding-top:16px;">
            <button type="button" id="btn-save-onboarding-preferences" class="btn-submit" style="background:var(--accent); color:#000000; font-weight:900; padding:14px; border:none; border-radius:6px; cursor:pointer; font-size:13px; letter-spacing:0.5px;">
              ✨ GUARDAR PREFERENCIAS Y COMENZAR A EXPLORAR
            </button>
            <button type="button" id="btn-skip-onboarding-preferences" style="background:transparent; border:none; color:#94a3b8; font-size:12px; font-weight:700; cursor:pointer; padding:6px; text-decoration:underline;">
              Omitir por ahora y ver toda la cartelera
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Términos y Condiciones -->
      <div class="modal-overlay" id="modal-terms">
        <div class="modal-box" style="max-width: 600px; background:#0f172a; border:1px solid #334155;">
          <div class="modal-header">
            <div class="modal-title" style="font-size:18px; color:#ffffff; font-weight:900;">📋 TÉRMINOS Y CONDICIONES DE SERVICIO KAWSAY</div>
            <button class="modal-close" id="modal-terms-close">×</button>
          </div>
          <div class="legal-content-box" style="margin-top:14px;">
            <h4>1. Aceptación de los Términos</h4>
            <p>Al utilizar la Plataforma Cultural KAWSAY, garantizas cumplir con las leyes vigentes de la República del Ecuador y los estándares comunitarios para el fomento del arte y la cultura en Quito.</p>
            <h4>2. Publicación de Eventos y Contenidos</h4>
            <p>Los artistas, promotores y recintos culturales aseguran contar con los permisos y derechos de autor correspondientes para la difusión de obras y comercialización de entradas.</p>
            <h4>3. Validación y Confirmaciones</h4>
            <p>Toda nueva cuenta o publicación enviada a la plataforma requiere validación por correo electrónico para garantizar la seguridad de la comunidad.</p>
          </div>
        </div>
      </div>

      <!-- Modal Política de Privacidad -->
      <div class="modal-overlay" id="modal-privacy">
        <div class="modal-box" style="max-width: 600px; background:#0f172a; border:1px solid #334155;">
          <div class="modal-header">
            <div class="modal-title" style="font-size:18px; color:#ffffff; font-weight:900;">🔒 POLÍTICA DE PRIVACIDAD Y DATOS</div>
            <button class="modal-close" id="modal-privacy-close">×</button>
          </div>
          <div class="legal-content-box" style="margin-top:14px;">
            <h4>1. Protección de Datos Personales (LOPDP)</h4>
            <p>De acuerdo con la Ley Orgánica de Protección de Datos Personales de Ecuador, tus datos de contacto únicamente se utilizarán para la gestión de boletería digital y comunicación oficial.</p>
            <h4>2. Seguridad y Transparencia</h4>
            <p>No compartimos ni vendemos tu información personal a terceros no autorizados. Puedes solicitar la actualización o eliminación de tus datos en cualquier momento.</p>
          </div>
        </div>
      </div>

      <!-- Modal Confirmación de Enlace por Correo -->
      <div class="modal-overlay" id="modal-email-confirm">
        <div class="modal-box" style="max-width: 440px; text-align: center; background:#0f172a; border:1px solid #334155; padding:28px;">
          <div style="font-size:48px; margin-bottom:12px;">✉️</div>
          <div class="modal-title" style="font-size:20px; font-weight:900; color:#ffffff; margin-bottom:10px;">
            ¡ENLACE DE VALIDACIÓN ENVIADO!
          </div>
          <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin-bottom:20px;" id="email-confirm-text">
            Hemos enviado un enlace de validación a tu dirección de correo electrónico. Por favor ingresa a tu bandeja de entrada para validar la solicitud.
          </p>
          <button class="btn-submit" id="modal-email-confirm-close" style="background:var(--accent); color:#000; font-weight:900; width:100%; padding:12px;">
            ENTENDIDO Y CONTINUAR
          </button>
        </div>
      </div>

      <!-- Off-Canvas Drawer Detalle del Evento (Side Panel) -->
      <div class="offcanvas-overlay" id="modal-event-detail">
        <div class="offcanvas-panel" id="modal-event-detail-box"></div>
      </div>

      <!-- Modal Carrito -->
      <div class="modal-overlay" id="modal-cart">
        <div class="cart-modal-box">
          <div class="modal-header">
            <div class="modal-title" style="font-size:18px; display:flex; align-items:center; gap:8px;">
              ${ICONS.cart} TU CARRITO DE ENTRADAS
            </div>
            <button class="modal-close" id="modal-cart-close">×</button>
          </div>
          <div id="cart-items-list" style="margin: 16px 0;"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; font-weight:800; font-size:18px;">
            <span>TOTAL:</span>
            <span id="cart-total-price" style="color:var(--accent);">$0</span>
          </div>
          <button class="btn-submit" id="btn-checkout" style="margin-top:20px;">FINALIZAR COMPRA SEGURO</button>
        </div>
      </div>

      <!-- MODAL GENERADOR PROFESIONAL DE CARTELERA CULTURAL -->
      <div class="modal-overlay" id="modal-create">
        <div class="modal-box" style="max-width: 900px; width: 90vw;">
          <div class="modal-header">
            <div>
              <div class="modal-title" id="modal-create-title" style="font-size:20px; font-weight:900;">
                📜 GENERADOR DE CARTELERA PROFESIONAL DE EVENTOS (${currentUser.role.toUpperCase()})
              </div>
              <p style="font-size:12px; color:var(--grey1); font-family:var(--font-mono); margin-top:2px;">
                Configura todos los parámetros óptimos para presentar tu espectáculo en Quito y previsualiza la cartelera en tiempo real.
              </p>
            </div>
            <button class="modal-close" id="modal-create-close">×</button>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 340px; gap:24px; margin-top:16px;">
            
            <form id="create-event-form" style="max-height: 520px; overflow-y: auto; padding-right: 10px;">
              <div class="form-group">
                <label class="form-label">TÍTULO DEL ESPECTÁCULO O CONCIERTO</label>
                <input class="form-input" id="ev-title" type="text" placeholder="Ej: Mateo & La Banda: Quito Jazz Fest 2026" value="${currentUser.role === 'espacio' ? 'Temporada Teatral: Oedipus Rex en Teatro Nacional' : 'Mateo & La Banda en Concert'}" required>
              </div>

              <div class="form-group">
                <label class="form-label">SUBTÍTULO / SLOGAN PROMOCIONAL</label>
                <input class="form-input" id="ev-subtitle" type="text" placeholder="Ej: Una experiencia inmersiva de arte y música viva">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">ETIQUETA DE CARTELERA (BADGE)</label>
                  <select class="form-select" id="ev-badge">
                    <option value="ESTRENO EXCLUSIVO">ESTRENO EXCLUSIVO</option>
                    <option value="ÚLTIMAS ENTRADAS">ÚLTIMAS ENTRADAS</option>
                    <option value="PREVENTA VIP">PREVENTA VIP</option>
                    <option value="ENTRADA LIBRE">ENTRADA LIBRE</option>
                    <option value="FESTIVAL CULTURAL">FESTIVAL CULTURAL</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">CATEGORÍA / DISCIPLINA</label>
                  <select class="form-select" id="ev-category" required>
                    <option value="Música">Música (Concierto / Recital)</option>
                    <option value="Teatro">Teatro</option>
                    <option value="Danza">Danza</option>
                    <option value="Artes">Artes Plásticas</option>
                    <option value="Cine">Cine / Audiovisual</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">FECHA DEL EVENTO</label>
                  <input class="form-input" id="ev-date" type="date" value="2026-10-30" required>
                </div>
                <div class="form-group">
                  <label class="form-label">HORA DE INICIO (SHOW)</label>
                  <input class="form-input" id="ev-time" type="time" value="20:00" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">SECTOR EN QUITO</label>
                  <select class="form-select" id="ev-sector">
                    <option value="Centro Histórico">Centro Histórico</option>
                    <option value="La Floresta">La Floresta</option>
                    <option value="Cumbayá">Cumbayá</option>
                    <option value="Guápulo">Guápulo</option>
                    <option value="La Mariscal">La Mariscal</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">RECINTO / ESPACIO CULTURAL</label>
                  <select class="form-select" id="ev-venue-select" style="margin-bottom:6px;">
                    <option value="">-- Seleccionar Espacio Registrado --</option>
                  </select>
                  <input class="form-input" id="ev-venue" type="text" placeholder="Ej: Teatro Nacional Quito, NAVE 01" value="${currentUser.role === 'espacio' ? 'Teatro Nacional Quito' : 'NAVE 01 (La Floresta)'}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">PRECIO DE ENTRADA ($ USD)</label>
                  <input class="form-input" id="ev-price" type="text" placeholder="Ej: $15" value="$15">
                </div>
                <div class="form-group">
                  <label class="form-label">AFORO MÁXIMO / ASISTENTES</label>
                  <input class="form-input" id="ev-capacity" type="number" placeholder="Ej: 500" value="500">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">ELENCO / PRODUCCIÓN / ARTISTAS INVITADOS</label>
                <input class="form-input" id="ev-cast" type="text" placeholder="Ej: Compañía Nacional de Teatro, Elenco Principal">
              </div>

              <div class="form-group">
                <label class="form-label">SINOPSIS / DETALLES DEL SHOW</label>
                <textarea class="form-textarea" id="ev-desc" rows="3" placeholder="Resumen del repertorio, ambientación y detalles técnicos...">Presentación especial en nuestro escenario principal con sonido profesional, iluminación DMX y experiencia VIP.</textarea>
              </div>

              <div class="form-group">
                <label class="form-label">URL AFICHE PROMOCIONAL (IMAGEN)</label>
                <input class="form-input" id="ev-image" type="text" placeholder="URL de la imagen del afiche..." value="${currentUser.role === 'espacio' ? 'images/space_teatro.jpg' : 'images/hero_concierto.jpg'}">
              </div>

              <button class="btn-submit" id="btn-submit-billboard" type="submit" style="margin-top:16px; width:100%; font-size:14px; font-weight:900; background:var(--accent); color:#000;">
                🚀 PUBLICAR CARTELERA EN VIVO
              </button>
            </form>

            <div style="background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent); font-weight:900; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                  <span>👁️ VISTA PREVIA EN VIVO DE CARTELERA</span>
                </div>
                <div class="event-card" id="preview-billboard-card" style="pointer-events:none;">
                  <div class="event-card-img-wrap" style="position:relative; height:160px;">
                    <img class="event-card-img" id="prev-img" src="${currentUser.role === 'espacio' ? 'images/space_teatro.jpg' : 'images/hero_concierto.jpg'}" alt="Preview Afiche">
                    <span class="hero-badge" id="prev-badge" style="position:absolute; top:8px; left:8px; font-size:9px;">ESTRENO EXCLUSIVO</span>
                  </div>
                  <div style="padding:12px;">
                    <div style="font-size:10px; color:var(--gold); font-weight:800; font-family:var(--font-mono);" id="prev-meta">
                      2026-10-30 · 20:00 · TEATRO
                    </div>
                    <div style="font-size:14px; font-weight:900; margin:4px 0;" id="prev-title">
                      ${currentUser.role === 'espacio' ? 'Temporada Teatral: Oedipus Rex' : 'Mateo & La Banda en Concert'}
                    </div>
                    <div style="font-size:11px; color:var(--grey1); margin-bottom:8px;" id="prev-venue">
                      ${currentUser.role === 'espacio' ? 'Teatro Nacional Quito' : 'NAVE 01 (La Floresta)'}
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:8px;">
                      <span style="font-size:14px; font-weight:900; color:var(--accent);" id="prev-price">$15</span>
                      <button class="btn-primary" style="padding:6px 12px; font-size:10px; font-family:var(--font-mono);">
                        COMPRAR ENTRADAS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div style="font-size:11px; color:var(--grey1); font-family:var(--font-mono); margin-top:12px; text-align:center;">
                La cartelera se actualizará automáticamente al escribir.
              </div>
            </div>          </div>
        </div>
      </div>

      <!-- MODAL REGISTRO DE ESPACIO CULTURAL -->
      <div class="modal-overlay" id="modal-create-space">
        <div class="modal-box" style="max-width: 650px; width: 90vw; background:#0f172a; border:1px solid #334155; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);">
          <div class="modal-header" style="border-bottom:1px solid #1e293b; padding-bottom:12px;">
            <div>
              <div class="modal-title" style="font-size:20px; font-weight:900; color:#ffffff; display:flex; align-items:center; gap:8px;">
                🏛️ REGISTRAR NUEVO ESPACIO CULTURAL EN QUITO
              </div>
              <p style="font-size:12px; color:var(--grey1); font-family:var(--font-mono); margin-top:3px;">
                Registra tu recinto, galería, club de vinilos o teatro en la base de datos oficial de KAWSAY.
              </p>
            </div>
            <button class="modal-close" id="modal-create-space-close" style="color:#94a3b8;">×</button>
          </div>

          <form id="create-space-form" style="display:flex; flex-direction:column; gap:14px; margin-top:16px;">
            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">NOMBRE DEL ESPACIO / RECINTO</label>
                <input class="form-input" id="sp-name" type="text" placeholder="Ej: Centro Cultural La Casa Rosa" required style="background:#1e293b; border:1px solid #334155; color:#fff;">
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">TIPO / CATEGORÍA</label>
                <select class="form-select" id="sp-type" required style="background:#1e293b; border:1px solid #334155; color:#fff;">
                  <option value="ESPACIO CULTURAL">Espacio Cultural / Multidisciplinario</option>
                  <option value="ARTES ESCÉNICAS">Teatro / Artes Escénicas</option>
                  <option value="GALERÍA & COWORK">Galería de Arte / Exposición</option>
                  <option value="CLUB DE VINILOS">Club de Vinilos / Música</option>
                  <option value="MUSEO URBANO">Museo / Centro Histórico</option>
                  <option value="CAFÉ CULTURAL">Café Cultural / Librería</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">SECTOR EN QUITO</label>
                <select class="form-select" id="sp-sector" required style="background:#1e293b; border:1px solid #334155; color:#fff;">
                  <option value="La Floresta">La Floresta</option>
                  <option value="Centro Histórico">Centro Histórico</option>
                  <option value="La Mariscal">La Mariscal</option>
                  <option value="Cumbayá">Cumbayá & Tumbaco</option>
                  <option value="Guápulo">Guápulo</option>
                  <option value="Norte de Quito">Norte de Quito</option>
                  <option value="Sur de Quito">Sur de Quito</option>
                </select>
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">AFORO / CAPACIDAD MÁXIMA</label>
                <input class="form-input" id="sp-capacity" type="number" placeholder="Ej: 200" value="200" required style="background:#1e293b; border:1px solid #334155; color:#fff;">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">DIRECCIÓN EXACTA</label>
              <input class="form-input" id="sp-address" type="text" placeholder="Ej: Calle Galavis E9-35 e Isabel La Católica" required style="background:#1e293b; border:1px solid #334155; color:#fff;">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">HORARIO DE ATENCIÓN</label>
                <input class="form-input" id="sp-hours" type="text" placeholder="Ej: Mar–Sáb: 10:00–22:00" value="Mar–Sáb: 10:00–22:00" style="background:#1e293b; border:1px solid #334155; color:#fff;">
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">DISCIPLINAS (SEPARADAS POR COMA)</label>
                <input class="form-input" id="sp-categories" type="text" placeholder="Arte, Música, Teatro" value="Arte, Música, Teatro" style="background:#1e293b; border:1px solid #334155; color:#fff;">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">URL FOTO DE PORTADA</label>
              <input class="form-input" id="sp-image" type="text" placeholder="URL de la imagen del recinto..." value="images/space_nave01.jpg" style="background:#1e293b; border:1px solid #334155; color:#fff;">
            </div>

            <div class="form-group">
              <label class="form-label" style="color:#fff; font-size:11px; font-weight:800;">DESCRIPCIÓN / PROPUESTA CULTURAL</label>
              <textarea class="form-textarea" id="sp-desc" rows="3" placeholder="Resumen de la propuesta del espacio..." style="background:#1e293b; border:1px solid #334155; color:#fff;">Espacio cultural independiente en Quito enfocado en la creación y expresión artística.</textarea>
            </div>

            <button class="btn-submit" type="submit" style="background:var(--gold); color:#000; font-weight:900; font-size:14px; padding:14px; border:none; border-radius:6px; cursor:pointer; margin-top:6px;">
              ✨ REGISTRAR Y PUBLICAR ESPACIO CULTURAL
            </button>
          </form>
        </div>
      </div>

      <!-- Modal Moderación Admin -->
      <div class="modal-overlay" id="modal-admin">
        <div class="modal-box" style="max-width: 750px;">
          <div class="modal-header">
            <div class="modal-title">PANEL DE MODERACIÓN ADMINISTRADOR</div>
            <button class="modal-close" id="modal-admin-close">×</button>
          </div>
          <div id="admin-mod-list"></div>
        </div>
      </div>

      <!-- Modal Desglose KPIs Admin -->
      <div class="modal-overlay" id="modal-kpi-detail">
        <div class="modal-box" style="max-width: 920px; width: 92vw; background:#0f172a; border:1px solid #334155;">
          <div class="modal-header" style="margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px;">
            <div class="modal-title" style="font-size:16px; font-weight:900; color:var(--accent); display:flex; align-items:center; gap:8px;">
              📊 ANÁLISIS DETALLADO Y DESGLOSE EXECUTIVE KAWSAY
            </div>
            <button class="modal-close" id="modal-kpi-detail-close" style="color:#94a3b8;">×</button>
          </div>
          <div id="modal-kpi-detail-content"></div>
        </div>
      </div>

      <!-- Modal Tickets Info -->
      <div class="modal-overlay" id="modal-tickets">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-title">RESERVA DE ENTRADAS</div>
            <button class="modal-close" id="modal-tickets-close">×</button>
          </div>
          <p style="color:var(--grey1); margin-bottom:20px;">QUITO CULTURAL — BASE DE DATOS LOCAL CONECTADA</p>
          <button class="btn-buy-ticket" id="btn-add-ticket-cart" style="width:100%; padding:14px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">
            ${ICONS.cart} AGREGAR ENTRADA GENERAL ($15)
          </button>
        </div>
      </div>

      <!-- Modal Postulación a Convocatorias -->
      <div class="modal-overlay" id="modal-apply-convocatoria">
        <div class="modal-box" style="max-width: 650px;">
          <div class="modal-header">
            <div class="modal-title" style="font-size:18px; font-weight:900; color:var(--accent); display:flex; align-items:center; gap:8px;">
              📢 FORMULARIO DE POSTULACIÓN A FONDO DE FOMENTO
            </div>
            <button class="modal-close" id="modal-apply-close" style="color:#94a3b8;">×</button>
          </div>
          <p style="color:var(--grey1); font-size:13px; margin-bottom:16px;">
            Completa los datos de tu proyecto para ingresar al comité de selección oficial de KAWSAY.
          </p>
          <form id="form-apply-convocatoria" style="display:flex; flex-direction:column; gap:14px;">
            <input type="hidden" id="apply-conv-id" value="">
            
            <div>
              <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">TÍTULO DEL PROYECTO CULTURAL *</label>
              <input type="text" id="apply-project-title" required placeholder="Ej. Serie Fotográfica: Memoria Callejera de Quito" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">NOMBRE DEL POSTULANTE / COLECTIVO *</label>
                <input type="text" id="apply-applicant-name" required placeholder="Ej. Colectivo Raíces Urbana" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">CORREO ELECTRÓNICO *</label>
                <input type="email" id="apply-email" required placeholder="contacto@colectivo.ec" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">DISCIPLINA ARTÍSTICA</label>
                <select id="apply-category" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
                  <option value="Artes Escénicas / Teatro">Artes Escénicas / Teatro</option>
                  <option value="Música / Producción Sonora">Música / Producción Sonora</option>
                  <option value="Artes Visuales / Plásticas">Artes Visuales / Plásticas</option>
                  <option value="Danza Contemporánea">Danza Contemporánea</option>
                  <option value="Cine / Audiovisual">Cine / Audiovisual</option>
                  <option value="Gestión Comunitaria">Gestión Comunitaria</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">MONTO SOLICITADO ($ USD)</label>
                <input type="number" id="apply-amount" placeholder="Ej. 5000" value="5000" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
              </div>
            </div>

            <div>
              <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">ENLACE A PORTAFOLIO / DOSSIER EN DRIVE O PDF *</label>
              <input type="url" id="apply-dossier" required placeholder="https://drive.google.com/file/d/... o link a sitio web" style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;">
            </div>

            <div>
              <label style="display:block; font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">RESUMEN EJECUTIVO & OBJETIVOS DEL PROYECTO</label>
              <textarea id="apply-summary" rows="3" placeholder="Describe brevemente el alcance, las fechas estimadas y el impacto comunitario..." style="width:100%; padding:12px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; outline:none; font-size:13px;"></textarea>
            </div>

            <div style="margin-top:4px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; color:#fff;">
                <input type="checkbox" id="apply-terms-check" required style="width:16px; height:16px; accent-color:var(--accent);">
                <span>Declaramos bajo protesta de decir verdad que la información proporcionada es verídica y aceptamos las bases del Fondo.</span>
              </label>
            </div>

            <button type="submit" class="btn-submit" style="background:var(--accent); color:#000; font-weight:900; padding:14px; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-top:8px; text-transform:uppercase;">
              🚀 REGISTRAR POSTULACIÓN Y GENERAR FOLIO
            </button>
          </form>
        </div>
      </div>
    `;

    bindBillboardPreviewEvents();

    $('#modal-auth-close').addEventListener('click', closeAuthModal);

    // Lógica de Pestañas (Iniciar Sesión vs Registrarse)
    const tabLogin = $('#tab-btn-login');
    const tabReg = $('#tab-btn-register');
    const formLogin = $('#form-auth-login');
    const formReg = $('#form-auth-register');
    const authAlert = $('#auth-alert-msg');

    function showAuthAlert(msg, isError = true) {
      authAlert.style.display = 'block';
      authAlert.style.background = isError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)';
      authAlert.style.border = isError ? '1px solid #ef4444' : '1px solid #22c55e';
      authAlert.style.color = isError ? '#fca5a5' : '#86efac';
      authAlert.textContent = msg;
    }

    if (tabLogin && tabReg) {
      tabLogin.addEventListener('click', () => {
        tabLogin.style.background = 'var(--accent)'; tabLogin.style.color = '#000000'; tabLogin.style.fontWeight = '900'; tabLogin.style.border = 'none';
        tabReg.style.background = 'rgba(255,255,255,0.08)'; tabReg.style.color = '#ffffff'; tabReg.style.fontWeight = '700'; tabReg.style.border = '1px solid rgba(255,255,255,0.2)';
        formLogin.style.display = 'flex';
        formReg.style.display = 'none';
        authAlert.style.display = 'none';
      });

      tabReg.addEventListener('click', () => {
        tabReg.style.background = 'var(--accent)'; tabReg.style.color = '#000000'; tabReg.style.fontWeight = '900'; tabReg.style.border = 'none';
        tabLogin.style.background = 'rgba(255,255,255,0.08)'; tabLogin.style.color = '#ffffff'; tabLogin.style.fontWeight = '700'; tabLogin.style.border = '1px solid rgba(255,255,255,0.2)';
        formReg.style.display = 'flex';
        formLogin.style.display = 'none';
        authAlert.style.display = 'none';
      });
    }

    // Submit Formulario Iniciar Sesión
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#login-email').value.trim();
        const password = $('#login-password').value;

        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) {
            showAuthAlert(data.error || 'Error al iniciar sesión');
            return;
          }

          currentUser = data.user;
          localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
          await loadUserInteractions();
          showToast(`¡Bienvenido/a, ${currentUser.name}! (${currentUser.role.toUpperCase()})`);
          closeAuthModal();
          renderSidebar();
          renderTopbar();
          if (currentUser.role === 'admin' || currentUser.role === 'gestor') {
            navigate('admin');
          } else if (currentUser.role === 'artista') {
            navigate('artist');
          } else if (currentUser.role === 'espacio') {
            navigate('space');
          } else {
            navigate('home');
          }
        } catch (err) {
          showAuthAlert('Error de conexión con el servidor. Revisa tu conexión.');
        }
      });
    }

    // Toggle de visibilidad de contraseña
    const togglePassBtn = $('#btn-toggle-reg-pass');
    const regPassInput = $('#reg-password');
    if (togglePassBtn && regPassInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = regPassInput.type === 'password';
        regPassInput.type = isPass ? 'text' : 'password';
        togglePassBtn.textContent = isPass ? '🙈' : '👁️';
      });
    }

    // Medidor de fortaleza de contraseña en tiempo real
    const strengthBar = $('#password-strength-bar');
    const strengthLabel = $('#password-strength-label');
    if (regPassInput && strengthBar && strengthLabel) {
      regPassInput.addEventListener('input', () => {
        const val = regPassInput.value;
        if (!val) {
          strengthBar.style.width = '0%';
          strengthBar.style.background = '#334155';
          strengthLabel.textContent = 'Mínimo 6 caracteres';
          strengthLabel.style.color = '#94a3b8';
          return;
        }
        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;

        if (score <= 1) {
          strengthBar.style.width = '25%';
          strengthBar.style.background = '#ef4444';
          strengthLabel.textContent = 'Contraseña débil';
          strengthLabel.style.color = '#f87171';
        } else if (score === 2) {
          strengthBar.style.width = '50%';
          strengthBar.style.background = '#f59e0b';
          strengthLabel.textContent = 'Aceptable';
          strengthLabel.style.color = '#fbbf24';
        } else if (score === 3) {
          strengthBar.style.width = '75%';
          strengthBar.style.background = '#38bdf8';
          strengthLabel.textContent = 'Buena seguridad';
          strengthLabel.style.color = '#38bdf8';
        } else {
          strengthBar.style.width = '100%';
          strengthBar.style.background = '#10b981';
          strengthLabel.textContent = 'Excelente seguridad ✨';
          strengthLabel.style.color = '#34d399';
        }
      });
    }

    // Botones de Registro Rápido con 1 Clic (Google / Apple ID)
    const btnGoogle = $('#btn-social-google');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', () => {
        closeAuthModal();
        const randId = Math.floor(1000 + Math.random() * 9000);
        tempRegData = {
          name: 'Usuario Google Cultural',
          email: `usuario.google.${randId}@gmail.com`,
          password: 'GoogleOAuth2026!' + randId,
          role: 'espectador'
        };
        showToast('⚡ Conectado con Google ID. Selecciona tus preferencias culturales.');
        openOnboardingModal();
      });
    }

    const btnApple = $('#btn-social-apple');
    if (btnApple) {
      btnApple.addEventListener('click', () => {
        closeAuthModal();
        const randId = Math.floor(1000 + Math.random() * 9000);
        tempRegData = {
          name: 'Usuario Apple ID',
          email: `usuario.apple.${randId}@icloud.com`,
          password: 'AppleOAuth2026!' + randId,
          role: 'espectador'
        };
        showToast('⚡ Conectado con Apple ID. Selecciona tus preferencias culturales.');
        openOnboardingModal();
      });
    }

    // Submit Formulario Registro Tradicional (Paso 1 -> Paso 2)
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#reg-name').value.trim();
        const email = $('#reg-email').value.trim();
        const password = $('#reg-password').value;
        const termsCheck = $('#reg-terms-check');

        if (!termsCheck || !termsCheck.checked) {
          showAuthAlert('Debes aceptar los Términos y Condiciones y la Política de Privacidad.');
          return;
        }

        if (password.length < 6) {
          showAuthAlert('La contraseña debe tener al menos 6 caracteres.');
          return;
        }

        tempRegData = {
          name,
          email,
          password,
          role: 'espectador'
        };

        closeAuthModal();
        showToast('Paso 1 completado. Personaliza tus intereses para recomendaciones.');
        openOnboardingModal();
      });
    }

    // Modal Onboarding (Paso 2: Preferencias e Intereses Culturales)
    const btnCloseOnboarding = $('#modal-onboarding-close');
    if (btnCloseOnboarding) btnCloseOnboarding.addEventListener('click', closeOnboardingModal);

    $$('.onboarding-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('active');
      });
    });

    async function finishRegistrationWithPreferences(preferences) {
      closeOnboardingModal();

      if (tempRegData) {
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tempRegData, preferences })
          });
          const data = await res.json();
          if (!res.ok) {
            showToast(data.error || 'Error al completar el registro.');
            return;
          }
          currentUser = data.user;
          localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
          await loadUserInteractions();

          showToast(`¡Cuenta creada exitosamente! Bienvenido/a ${currentUser.name}`);

          // Notificación automática de activación por correo sin bloquear al usuario
          setTimeout(() => {
            showToast(`📬 Hemos enviado un enlace de activación a ${currentUser.email}. ¡Tu cuenta ya está lista para explorar y comprar!`);
          }, 1000);

          tempRegData = null;
        } catch (err) {
          // Fallback resiliente offline
          currentUser = {
            id: 'usr-' + Date.now(),
            name: tempRegData.name,
            email: tempRegData.email,
            role: tempRegData.role || 'espectador',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Perfil de espectador en KAWSAY',
            preferences
          };
          localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
          showToast(`¡Bienvenido/a ${currentUser.name}! Tus preferencias han sido configuradas.`);
          setTimeout(() => {
            showToast(`📬 Enlace de activación enviado a ${currentUser.email}.`);
          }, 1000);
          tempRegData = null;
        }
      } else if (currentUser && currentUser.role !== 'invitado') {
        currentUser.preferences = preferences;
        localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
        try {
          await fetch(`${API_BASE}/users/${currentUser.id}/preferences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences })
          });
        } catch (e) {}
        showToast('🎯 Preferencias culturales actualizadas con éxito.');
      }

      closeAuthModal();
      renderSidebar();
      renderTopbar();
      renderHomeView();
      navigate('home');

      // Si el usuario intentó una acción antes del registro, ejecutarla de inmediato
      if (pendingAuthAction) {
        const action = pendingAuthAction;
        pendingAuthAction = null;
        setTimeout(() => {
          if (action.type === 'fav' || action.type === 'rsvp') {
            const btn = document.querySelector(`.btn-card-action[data-action="${action.type}"][data-id="${action.eventId}"]`);
            if (btn) btn.click();
          } else if (action.type === 'cart') {
            addToCart(action.title, action.price);
            openCartModal();
          } else if (action.type === 'checkout') {
            openCartModal();
          }
        }, 300);
      }
    }

    const btnSaveOnboarding = $('#btn-save-onboarding-preferences');
    if (btnSaveOnboarding) {
      btnSaveOnboarding.addEventListener('click', () => {
        const categories = Array.from($$('#onboarding-categories-tags .onboarding-tag-pill.active')).map(p => p.dataset.cat);
        const zones = Array.from($$('#onboarding-zones-tags .onboarding-tag-pill.active')).map(p => p.dataset.zone);
        finishRegistrationWithPreferences({ categories, zones });
      });
    }

    const btnSkipOnboarding = $('#btn-skip-onboarding-preferences');
    if (btnSkipOnboarding) {
      btnSkipOnboarding.addEventListener('click', () => {
        finishRegistrationWithPreferences({
          categories: ['Teatro', 'Música Andina'],
          zones: ['Centro Histórico']
        });
      });
    }


    // Modal legal handlers
    if ($('#link-reg-terms')) $('#link-reg-terms').addEventListener('click', (e) => { e.preventDefault(); showModal('#modal-terms'); });
    if ($('#link-reg-privacy')) $('#link-reg-privacy').addEventListener('click', (e) => { e.preventDefault(); showModal('#modal-privacy'); });
    if ($('#modal-terms-close')) $('#modal-terms-close').addEventListener('click', () => hideModal('#modal-terms'));
    if ($('#modal-privacy-close')) $('#modal-privacy-close').addEventListener('click', () => hideModal('#modal-privacy'));
    if ($('#modal-email-confirm-close')) $('#modal-email-confirm-close').addEventListener('click', () => hideModal('#modal-email-confirm'));

    $('#modal-cart-close').addEventListener('click', closeCartModal);
    $('#btn-checkout').addEventListener('click', () => {
      if (currentUser.role === 'invitado') {
        closeCartModal();
        openAuthModal();
        return;
      }
      showToast('¡Compra realizada con éxito!');
      cartItems = [];
      renderTopbar();
      closeCartModal();
    });

    $('#modal-create-close').addEventListener('click', closeCreateModal);
    if ($('#modal-create-space-close')) $('#modal-create-space-close').addEventListener('click', closeSpaceCreateModal);
    $('#create-event-form').addEventListener('submit', handleCreateEventSubmit);
    if ($('#create-space-form')) $('#create-space-form').addEventListener('submit', handleCreateSpaceSubmit);
    $('#modal-admin-close').addEventListener('click', closeAdminModal);
    $('#modal-tickets-close').addEventListener('click', closeTicketsModal);
    if ($('#modal-kpi-detail-close')) {
      $('#modal-kpi-detail-close').addEventListener('click', () => hideModal('#modal-kpi-detail'));
    }
    $('#btn-add-ticket-cart').addEventListener('click', () => {
      addToCart('Entrada General Quito Cultural', 15);
      closeTicketsModal();
    });
  }

  function bindBillboardPreviewEvents() {
    const titleInput = $('#ev-title');
    const badgeSelect = $('#ev-badge');
    const catSelect = $('#ev-category');
    const dateInput = $('#ev-date');
    const timeInput = $('#ev-time');
    const venueInput = $('#ev-venue');
    const priceInput = $('#ev-price');
    const imageInput = $('#ev-image');

    const updatePreview = () => {
      if ($('#prev-title') && titleInput) $('#prev-title').textContent = titleInput.value || 'Título del Espectáculo';
      if ($('#prev-badge') && badgeSelect) $('#prev-badge').textContent = badgeSelect.value;
      if ($('#prev-meta') && dateInput && timeInput && catSelect) {
        $('#prev-meta').textContent = `${dateInput.value} · ${timeInput.value} · ${catSelect.value.toUpperCase()}`;
      }
      if ($('#prev-venue') && venueInput) $('#prev-venue').textContent = venueInput.value || 'Recinto Quito';
      if ($('#prev-price') && priceInput) $('#prev-price').textContent = priceInput.value || '$0';
      if ($('#prev-img') && imageInput && imageInput.value) $('#prev-img').src = imageInput.value;
    };

    [titleInput, badgeSelect, catSelect, dateInput, timeInput, venueInput, priceInput, imageInput].forEach(el => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    });
  }

  function showModal(selector) {
    const el = (typeof selector === 'string') ? $(selector) : selector;
    if (!el) return;

    // Close all other modals/offcanvas panels first, keeping modal-auth open underneath if opening legal terms/privacy
    const isLegalDialog = el.id === 'modal-terms' || el.id === 'modal-privacy' || el.id === 'modal-email-confirm';
    $$('.modal-overlay, .offcanvas-overlay').forEach(m => {
      if (m !== el) {
        if (isLegalDialog && m.id === 'modal-auth') return;
        hideModal(m);
      }
    });

    // Step 1: make the element visible in DOM (but invisible via CSS opacity:0)
    el.style.removeProperty('display');
    el.style.removeProperty('opacity');
    el.style.removeProperty('visibility');
    el.style.removeProperty('pointer-events');
    el.style.setProperty('display', 'flex', 'important');

    // Step 2: force a reflow so the browser registers display:flex before adding .open
    void el.offsetHeight;

    // Step 3: add .open class — CSS transition kicks in from opacity:0 → opacity:1
    el.classList.add('open');
  }

  function hideModal(selector) {
    const el = (typeof selector === 'string') ? $(selector) : selector;
    if (!el) return;
    // Remove open class — CSS transition handles the fade-out/slide-out
    el.classList.remove('open');
    // After transition completes, hide from DOM flow
    setTimeout(() => {
      if (!el.classList.contains('open')) {
        el.style.setProperty('display', 'none', 'important');
      }
    }, 350);
  }

  // ============================================================
  // DESGLOSE EJECUTIVO DE KPIs ADMINISTRATIVOS
  // ============================================================
  function openKpiDetailModal(kpiKey) {
    const modal = $('#modal-kpi-detail');
    const contentEl = $('#modal-kpi-detail-content');
    if (!modal || !contentEl) return;

    contentEl.innerHTML = getKpiDetailHtml(kpiKey);

    contentEl.querySelectorAll('.kpi-modal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        openKpiDetailModal(tab.dataset.kpi);
      });
    });

    const closeBtn = contentEl.querySelector('#btn-kpi-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => hideModal('#modal-kpi-detail'));
    }

    showModal('#modal-kpi-detail');
  }

  function getKpiDetailHtml(kpiKey) {
    const kpis = {
      sessions: {
        title: '🌐 SESIONES / USUARIOS ACTIVOS',
        accentColor: 'var(--accent)',
        subTitle: 'Monitoreo de tráfico, sesiones concurrentes y cuentas registradas en Quito.',
        value: '1,450',
        label: 'Sesiones Activas',
        sub: '4 Perfiles Registrados en la Nube'
      },
      artists: {
        title: '🎨 CANTIDAD DE ARTISTAS',
        accentColor: 'var(--gold)',
        subTitle: 'Directorio general de colectivos, agrupaciones y bandas verificadas.',
        value: '142',
        label: 'Colectivos & Bandas',
        sub: 'Verificados en la Red Kawsay'
      },
      spaces: {
        title: '🏛️ ESPACIOS & RECINTOS CULTURALES',
        accentColor: '#60a5fa',
        subTitle: 'Catastro de teatros, auditorios y salas independientes.',
        value: '24',
        label: 'Recintos Aliados',
        sub: 'Centros Culturales en Quito'
      },
      tickets: {
        title: '🎟️ BOLETOS VENDIDOS',
        accentColor: '#f43f5e',
        subTitle: 'Emisión, reservas y control de accesos por código QR.',
        value: '3,850',
        label: 'Entradas Procesadas',
        sub: 'Entradas Digitales con Check-in'
      },
      revenue: {
        title: '💰 RECAUDACIÓN TOTAL DE TAQUILLA',
        accentColor: '#10b981',
        subTitle: 'Reporte financiero global, comisiones y liquidación a artistas.',
        value: '$48,250',
        label: 'Ingresos por Taquilla',
        sub: 'Ingresos Totales en USD'
      }
    };

    const currentKpi = kpis[kpiKey] || kpis['sessions'];

    const navTabsHtml = `
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <button class="kpi-modal-tab ${kpiKey === 'sessions' ? 'active' : ''}" data-kpi="sessions" style="padding:8px 14px; border-radius:8px; font-size:12px; font-family:var(--font-mono); font-weight:800; cursor:pointer; background:${kpiKey === 'sessions' ? 'rgba(198,241,53,0.2)' : 'var(--surface2)'}; color:${kpiKey === 'sessions' ? 'var(--accent)' : 'var(--grey1)'}; border:1px solid ${kpiKey === 'sessions' ? 'var(--accent)' : 'var(--border)'}; white-space:nowrap;">🌐 Sesiones (1,450)</button>
        <button class="kpi-modal-tab ${kpiKey === 'artists' ? 'active' : ''}" data-kpi="artists" style="padding:8px 14px; border-radius:8px; font-size:12px; font-family:var(--font-mono); font-weight:800; cursor:pointer; background:${kpiKey === 'artists' ? 'rgba(234,179,8,0.2)' : 'var(--surface2)'}; color:${kpiKey === 'artists' ? 'var(--gold)' : 'var(--grey1)'}; border:1px solid ${kpiKey === 'artists' ? 'var(--gold)' : 'var(--border)'}; white-space:nowrap;">🎨 Artistas (142)</button>
        <button class="kpi-modal-tab ${kpiKey === 'spaces' ? 'active' : ''}" data-kpi="spaces" style="padding:8px 14px; border-radius:8px; font-size:12px; font-family:var(--font-mono); font-weight:800; cursor:pointer; background:${kpiKey === 'spaces' ? 'rgba(96,165,250,0.2)' : 'var(--surface2)'}; color:${kpiKey === 'spaces' ? '#60a5fa' : 'var(--grey1)'}; border:1px solid ${kpiKey === 'spaces' ? '#60a5fa' : 'var(--border)'}; white-space:nowrap;">🏛️ Espacios (24)</button>
        <button class="kpi-modal-tab ${kpiKey === 'tickets' ? 'active' : ''}" data-kpi="tickets" style="padding:8px 14px; border-radius:8px; font-size:12px; font-family:var(--font-mono); font-weight:800; cursor:pointer; background:${kpiKey === 'tickets' ? 'rgba(244,63,94,0.2)' : 'var(--surface2)'}; color:${kpiKey === 'tickets' ? '#f43f5e' : 'var(--grey1)'}; border:1px solid ${kpiKey === 'tickets' ? '#f43f5e' : 'var(--border)'}; white-space:nowrap;">🎟️ Boletos (3,850)</button>
        <button class="kpi-modal-tab ${kpiKey === 'revenue' ? 'active' : ''}" data-kpi="revenue" style="padding:8px 14px; border-radius:8px; font-size:12px; font-family:var(--font-mono); font-weight:800; cursor:pointer; background:${kpiKey === 'revenue' ? 'rgba(16,185,129,0.2)' : 'var(--surface2)'}; color:${kpiKey === 'revenue' ? '#10b981' : 'var(--grey1)'}; border:1px solid ${kpiKey === 'revenue' ? '#10b981' : 'var(--border)'}; white-space:nowrap;">💰 Recaudación ($48,250)</button>
      </div>
    `;

    let specificContent = '';

    if (kpiKey === 'sessions') {
      specificContent = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">PICO MÁXIMO DIARIO</div>
            <div style="font-size:24px; font-weight:900; color:var(--accent); margin-top:2px;">340</div>
            <div style="font-size:10px; color:var(--grey1);">Usuarios a las 20:00</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">RETENCIÓN PROMEDIO</div>
            <div style="font-size:24px; font-weight:900; color:#38bdf8; margin-top:2px;">88.5%</div>
            <div style="font-size:10px; color:var(--grey1);">Retorno semanal</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">DISPOSITIVO MÓVIL</div>
            <div style="font-size:24px; font-weight:900; color:#a855f7; margin-top:2px;">68%</div>
            <div style="font-size:10px; color:var(--grey1);">986 Tráfico Smartphone</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">TIEMPO PROMEDIO</div>
            <div style="font-size:24px; font-weight:900; color:var(--gold); margin-top:2px;">8m 42s</div>
            <div style="font-size:10px; color:var(--grey1);">Por sesión activa</div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px; margin-bottom:20px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:14px; font-family:var(--font-mono);">
            📊 DISTRIBUCIÓN DE TRÁFICO POR HORARIO EN QUITO
          </h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>08:00 - 12:00 (Mañana)</span>
                <span>210 usuarios (15%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:15%; height:100%; background:var(--accent);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>12:00 - 16:00 (Tarde)</span>
                <span>380 usuarios (26%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:26%; height:100%; background:var(--accent);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>16:00 - 20:00 (Hora Pico Espectáculos)</span>
                <span>540 usuarios (37%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:37%; height:100%; background:#ef4444;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>20:00 - 00:00 (Noche / Salida Eventos)</span>
                <span>320 usuarios (22%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:22%; height:100%; background:var(--gold);"></div>
              </div>
            </div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px; font-family:var(--font-mono);">👥 PERFILES DE USUARIO REGISTRADOS EN LA PLATAFORMA</h4>
          <table class="admin-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>CORREO</th>
                <th>ROL EN PLATAFORMA</th>
                <th>UBICACIÓN / SECTOR</th>
                <th>ESTADO ACCESO</th>
              </tr>
            </thead>
            <tbody>
              ${usersList.map(u => `
                <tr>
                  <td style="display:flex; align-items:center; gap:8px;">
                    <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" style="width:26px; height:26px; border-radius:50%; object-fit:cover;">
                    <strong>${u.name}</strong>
                  </td>
                  <td style="font-family:var(--font-mono); color:var(--grey1); font-size:12px;">${u.email || 'sesion.anonima@kawsay.ec'}</td>
                  <td>
                    <span style="font-size:10px; font-weight:800; font-family:var(--font-mono); padding:2px 8px; border-radius:10px; background:${u.role === 'admin' ? '#ef4444' : u.role === 'artista' ? 'var(--accent)' : u.role === 'espacio' ? 'var(--gold)' : 'var(--surface3)'}; color:${u.role === 'artista' ? '#000' : '#fff'};">
                      ${(u.role || 'invitado').toUpperCase()}
                    </span>
                  </td>
                  <td style="font-size:12px; color:var(--grey1);">Quito Central</td>
                  <td><span style="color:var(--accent); font-weight:800; font-size:11px;">🟢 En línea</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (kpiKey === 'artists') {
      specificContent = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">MÚSICA & BANDS</div>
            <div style="font-size:24px; font-weight:900; color:var(--gold); margin-top:2px;">58</div>
            <div style="font-size:10px; color:var(--grey1);">41% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">COMPAÑÍAS DE TEATRO</div>
            <div style="font-size:24px; font-weight:900; color:#ef4444; margin-top:2px;">34</div>
            <div style="font-size:10px; color:var(--grey1);">24% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">DANZA & PERFORMANCE</div>
            <div style="font-size:24px; font-weight:900; color:var(--accent); margin-top:2px;">26</div>
            <div style="font-size:10px; color:var(--grey1);">18% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">ARTES VISUALES & CINE</div>
            <div style="font-size:24px; font-weight:900; color:#38bdf8; margin-top:2px;">24</div>
            <div style="font-size:10px; color:var(--grey1);">17% del total</div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px; margin-bottom:20px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:14px; font-family:var(--font-mono);">📍 DISTRIBUCIÓN TERRITORIAL DE ARTISTAS EN QUITO</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
            <div style="background:var(--surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-size:11px; color:var(--grey1);">La Floresta & Guápulo</div>
              <div style="font-size:15px; font-weight:900; color:#fff;">42 Colectivos (30%)</div>
            </div>
            <div style="background:var(--surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-size:11px; color:var(--grey1);">Centro Histórico & La Ronda</div>
              <div style="font-size:15px; font-weight:900; color:#fff;">38 Colectivos (27%)</div>
            </div>
            <div style="background:var(--surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-size:11px; color:var(--grey1);">Cumbayá & Tumbaco</div>
              <div style="font-size:15px; font-weight:900; color:#fff;">28 Colectivos (20%)</div>
            </div>
            <div style="background:var(--surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-size:11px; color:var(--grey1);">Sur de Quito & Recreo</div>
              <div style="font-size:15px; font-weight:900; color:#fff;">21 Colectivos (15%)</div>
            </div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px; font-family:var(--font-mono);">🎨 MUESTRA DE ARTISTAS DESTACADOS EN LA PLATAFORMA</h4>
          <table class="admin-table">
            <thead>
              <tr>
                <th>ARTISTA / COLECTIVO</th>
                <th>CATEGORÍA</th>
                <th>SECTOR</th>
                <th>EVENTO PRINCIPAL</th>
                <th>ESTADO DE VERIFICACIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:900; color:#fff;">Mateo & La Banda</td>
                <td><span style="color:var(--gold); font-weight:800;">Música Jazz</span></td>
                <td>La Floresta</td>
                <td>Jazz Experimental Quito</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VERIFICADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Movimiento Urbano Rito</td>
                <td><span style="color:var(--accent); font-weight:800;">Danza Contemporánea</span></td>
                <td>Centro Histórico</td>
                <td>Movimiento Urbano: El Rito</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VERIFICADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Teatro La Paz Colectivo</td>
                <td><span style="color:#ef4444; font-weight:800;">Teatro Independiente</span></td>
                <td>San Roque</td>
                <td>Voces del Barrio</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VERIFICADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Colectivo Neo-Muralismo</td>
                <td><span style="color:#38bdf8; font-weight:800;">Artes Plásticas</span></td>
                <td>La Mariscal</td>
                <td>Neo-Muralismo Urbano</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VERIFICADO ✅</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (kpiKey === 'spaces') {
      specificContent = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">AFORO MÁXIMO COMBINADO</div>
            <div style="font-size:24px; font-weight:900; color:#60a5fa; margin-top:2px;">8,950</div>
            <div style="font-size:10px; color:var(--grey1);">Butacas / Capacidad total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">TEATROS PRINCIPALES</div>
            <div style="font-size:24px; font-weight:900; color:var(--gold); margin-top:2px;">8</div>
            <div style="font-size:10px; color:var(--grey1);">Promedio 450 as.</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">CENTROS INDEPENDIENTES</div>
            <div style="font-size:24px; font-weight:900; color:var(--accent); margin-top:2px;">9</div>
            <div style="font-size:10px; color:var(--grey1);">Salas alternativas</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">GALERÍAS & PLAZAS</div>
            <div style="font-size:24px; font-weight:900; color:#a855f7; margin-top:2px;">7</div>
            <div style="font-size:10px; color:var(--grey1);">Espacios de exposición</div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px; font-family:var(--font-mono);">🏛️ CATASTRO DE CENTROS CULTURALES REGISTRADOS</h4>
          <table class="admin-table">
            <thead>
              <tr>
                <th>RECINTO / ESPACIO</th>
                <th>TIPO DE LUGAR</th>
                <th>CAPACIDAD</th>
                <th>SECTOR</th>
                <th>OCUPACIÓN MENSUAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:900; color:#fff;">Teatro Nacional Quito</td>
                <td><span style="color:#60a5fa; font-weight:800;">Teatro Principal</span></td>
                <td style="font-family:var(--font-mono); font-weight:800;">500 pers.</td>
                <td style="font-size:12px; color:var(--grey1);">Centro Histórico</td>
                <td><span style="color:var(--accent); font-weight:800;">85%</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">NAVE 01</td>
                <td><span style="color:#60a5fa; font-weight:800;">Espacio Cultural</span></td>
                <td style="font-family:var(--font-mono); font-weight:800;">250 pers.</td>
                <td style="font-size:12px; color:var(--grey1);">La Floresta</td>
                <td><span style="color:var(--accent); font-weight:800;">90%</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">EL BÚNKER</td>
                <td><span style="color:#60a5fa; font-weight:800;">Club de Vinilos</span></td>
                <td style="font-family:var(--font-mono); font-weight:800;">120 pers.</td>
                <td style="font-size:12px; color:var(--grey1);">La Mariscal</td>
                <td><span style="color:var(--accent); font-weight:800;">78%</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">ESPACIO RADAR</td>
                <td><span style="color:#60a5fa; font-weight:800;">Galería & Cowork</span></td>
                <td style="font-family:var(--font-mono); font-weight:800;">100 pers.</td>
                <td style="font-size:12px; color:var(--grey1);">La Ronda</td>
                <td><span style="color:var(--accent); font-weight:800;">92%</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Plaza de las Artes</td>
                <td><span style="color:#60a5fa; font-weight:800;">Plaza Abierta</span></td>
                <td style="font-family:var(--font-mono); font-weight:800;">1,200 pers.</td>
                <td style="font-size:12px; color:var(--grey1);">Bellavista</td>
                <td><span style="color:var(--accent); font-weight:800;">65%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (kpiKey === 'tickets') {
      specificContent = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">ENTRADAS PAGADAS</div>
            <div style="font-size:24px; font-weight:900; color:#f43f5e; margin-top:2px;">2,450</div>
            <div style="font-size:10px; color:var(--grey1);">64% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">ACCESO LIBRE (GRATIS)</div>
            <div style="font-size:24px; font-weight:900; color:var(--accent); margin-top:2px;">1,200</div>
            <div style="font-size:10px; color:var(--grey1);">31% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">PASES VIP / PRENSA</div>
            <div style="font-size:24px; font-weight:900; color:var(--gold); margin-top:2px;">200</div>
            <div style="font-size:10px; color:var(--grey1);">5% del total</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">CHECK-IN ASISTENCIA</div>
            <div style="font-size:24px; font-weight:900; color:#10b981; margin-top:2px;">92.4%</div>
            <div style="font-size:10px; color:var(--grey1);">Ingreso efectivo en puerta</div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px; font-family:var(--font-mono);">🎟️ REGISTRO RECIENTE DE ENTRADAS PROCESADAS</h4>
          <table class="admin-table">
            <thead>
              <tr>
                <th>CÓDIGO TICKET</th>
                <th>ESPECTÁCULO</th>
                <th>COMPRADOR</th>
                <th>TIPO</th>
                <th>PRECIO</th>
                <th>ESTADO PUERTA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-family:var(--font-mono); color:var(--accent); font-weight:800;">#TK-9081</td>
                <td style="font-weight:800; color:#fff;">Movimiento Urbano: El Rito</td>
                <td>María Fernanda</td>
                <td>General Pagada</td>
                <td style="font-family:var(--font-mono);">$15.00</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VALIDADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono); color:var(--accent); font-weight:800;">#TK-9082</td>
                <td style="font-weight:800; color:#fff;">Jazz Experimental Quito</td>
                <td>Mateo Silva</td>
                <td>General Pagada</td>
                <td style="font-family:var(--font-mono);">$12.00</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VALIDADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono); color:var(--accent); font-weight:800;">#TK-9083</td>
                <td style="font-weight:800; color:#fff;">Voces del Barrio</td>
                <td>Carlos Ruiz</td>
                <td>Acceso Libre (Gratis)</td>
                <td style="font-family:var(--font-mono);">$0.00</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">VALIDADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono); color:var(--accent); font-weight:800;">#TK-9084</td>
                <td style="font-weight:800; color:#fff;">Carnaval Sonoro</td>
                <td>Lucía Benítez</td>
                <td>General Pagada</td>
                <td style="font-family:var(--font-mono);">$8.00</td>
                <td><span style="background:rgba(234,179,8,0.2); color:var(--gold); padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">EN ESPERA ⏳</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (kpiKey === 'revenue') {
      specificContent = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">RECAUDACIÓN BRUTA</div>
            <div style="font-size:24px; font-weight:900; color:#10b981; margin-top:2px;">$48,250.00</div>
            <div style="font-size:10px; color:var(--grey1);">Venta Total de Taquilla</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">COMISIÓN PLATAFORMA (5%)</div>
            <div style="font-size:24px; font-weight:900; color:var(--accent); margin-top:2px;">$2,412.50</div>
            <div style="font-size:10px; color:var(--grey1);">Fondo de Mantenimiento</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">NETO LIQUIDADO A ARTISTAS (95%)</div>
            <div style="font-size:24px; font-weight:900; color:var(--gold); margin-top:2px;">$45,837.50</div>
            <div style="font-size:10px; color:var(--grey1);">Transferido a colectivos</div>
          </div>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px;">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">TICKET PROMEDIO (AVG)</div>
            <div style="font-size:24px; font-weight:900; color:#38bdf8; margin-top:2px;">$12.53</div>
            <div style="font-size:10px; color:var(--grey1);">Valor por entrada pagada</div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px; margin-bottom:20px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:14px; font-family:var(--font-mono);">💳 DESGLOSE POR MÉTODOS DE PAGO UTILIZADOS</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>💳 Tarjeta de Débito / Crédito (Visa, Mastercard)</span>
                <span>$26,500.00 (55%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:55%; height:100%; background:#10b981;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>🏦 Transferencia Bancaria Directa</span>
                <span>$14,200.00 (29%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:29%; height:100%; background:#38bdf8;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-family:var(--font-mono);">
                <span>📱 PayPhone / Deuna QR Móvil</span>
                <span>$7,550.00 (16%)</span>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                <div style="width:16%; height:100%; background:var(--accent);"></div>
              </div>
            </div>
          </div>
        </div>

        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px;">
          <h4 style="font-size:13px; font-weight:800; color:#fff; margin-bottom:12px; font-family:var(--font-mono);">📈 INGRESOS Y LIQUIDACIÓN POR ESPECTÁCULO</h4>
          <table class="admin-table">
            <thead>
              <tr>
                <th>ESPECTÁCULO</th>
                <th>BOLETOS</th>
                <th>RECAUDADO ($)</th>
                <th>NETO ARTISTA (95%)</th>
                <th>ESTADO LIQUIDACIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:900; color:#fff;">Movimiento Urbano: El Rito</td>
                <td style="font-family:var(--font-mono);">1,200</td>
                <td style="font-family:var(--font-mono); color:#10b981; font-weight:800;">$18,000.00</td>
                <td style="font-family:var(--font-mono); color:var(--accent);">$17,100.00</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">PAGADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Jazz Experimental Quito</td>
                <td style="font-family:var(--font-mono);">850</td>
                <td style="font-family:var(--font-mono); color:#10b981; font-weight:800;">$10,200.00</td>
                <td style="font-family:var(--font-mono); color:var(--accent);">$9,690.00</td>
                <td><span style="background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">PAGADO ✅</span></td>
              </tr>
              <tr>
                <td style="font-weight:900; color:#fff;">Carnaval Sonoro</td>
                <td style="font-family:var(--font-mono);">1,100</td>
                <td style="font-family:var(--font-mono); color:#10b981; font-weight:800;">$8,800.00</td>
                <td style="font-family:var(--font-mono); color:var(--accent);">$8,360.00</td>
                <td><span style="background:rgba(234,179,8,0.2); color:var(--gold); padding:2px 8px; border-radius:8px; font-size:10px; font-weight:800;">EN PROCESO ⏳</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
              <h2 style="font-size:22px; font-weight:900; color:#ffffff; margin:0;">${currentKpi.title}</h2>
            </div>
            <p style="color:var(--grey1); font-size:13px; font-family:var(--font-mono); margin:0;">
              ${currentKpi.subTitle}
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.05); border:1px solid var(--border); padding:8px 16px; border-radius:12px; text-align:right;">
            <div style="font-size:24px; font-weight:900; font-family:var(--font-mono); color:${currentKpi.accentColor};">${currentKpi.value}</div>
            <div style="font-size:10px; color:var(--grey1); font-family:var(--font-mono); font-weight:700;">${currentKpi.sub}</div>
          </div>
        </div>

        ${navTabsHtml}

        ${specificContent}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1);">
            ⚡ Datos sincronizados en tiempo real con KAWSAY Cloud (Quito, Ecuador)
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn-secondary" onclick="showToast('📊 Reporte detallado exportado correctamente a formato CSV');" style="padding:8px 14px; font-size:11px; font-family:var(--font-mono); font-weight:800; border:1px solid var(--border); color:#fff; border-radius:6px; cursor:pointer;">
              📥 EXPORTAR CSV
            </button>
            <button class="btn-primary" id="btn-kpi-modal-close" style="padding:8px 16px; font-size:11px; font-family:var(--font-mono); font-weight:900; background:${currentKpi.accentColor}; color:#000; border-radius:6px; cursor:pointer; border:none;">
              CERRAR DESGLOSE
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function openAuthModal(defaultTab = 'login') {
    showModal('#modal-auth');
    const tabLogin = $('#tab-btn-login');
    const tabReg = $('#tab-btn-register');
    const formLogin = $('#form-auth-login');
    const formReg = $('#form-auth-register');
    const authAlert = $('#auth-alert-msg');
    if (authAlert) authAlert.style.display = 'none';

    if (defaultTab === 'register' && tabReg && formReg) {
      tabReg.style.background = 'var(--accent)'; tabReg.style.color = '#000000'; tabReg.style.fontWeight = '900'; tabReg.style.border = 'none';
      if (tabLogin) {
        tabLogin.style.background = 'rgba(255,255,255,0.08)'; tabLogin.style.color = '#ffffff'; tabLogin.style.fontWeight = '700'; tabLogin.style.border = '1px solid rgba(255,255,255,0.2)';
      }
      formReg.style.display = 'flex';
      if (formLogin) formLogin.style.display = 'none';
    } else {
      if (tabLogin) {
        tabLogin.style.background = 'var(--accent)'; tabLogin.style.color = '#000000'; tabLogin.style.fontWeight = '900'; tabLogin.style.border = 'none';
      }
      if (tabReg) {
        tabReg.style.background = 'rgba(255,255,255,0.08)'; tabReg.style.color = '#ffffff'; tabReg.style.fontWeight = '700'; tabReg.style.border = '1px solid rgba(255,255,255,0.2)';
      }
      if (formLogin) formLogin.style.display = 'flex';
      if (formReg) formReg.style.display = 'none';
    }
  }

  function closeAuthModal() { hideModal('#modal-auth'); }

  function openOnboardingModal(isEditingOnly = false) {
    const modal = $('#modal-onboarding-preferences');
    if (!modal) return;
    
    const activeCats = (currentUser && currentUser.preferences && currentUser.preferences.categories) || ['Teatro', 'Música Andina'];
    const activeZones = (currentUser && currentUser.preferences && currentUser.preferences.zones) || ['Centro Histórico', 'La Floresta'];

    $$('#onboarding-categories-tags .onboarding-tag-pill').forEach(btn => {
      if (activeCats.includes(btn.dataset.cat)) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    $$('#onboarding-zones-tags .onboarding-tag-pill').forEach(btn => {
      if (activeZones.includes(btn.dataset.zone)) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    showModal('#modal-onboarding-preferences');
  }

  function closeOnboardingModal() { hideModal('#modal-onboarding-preferences'); }

  function openCartModal() {
    const listDiv = $('#cart-items-list');
    const totalPriceSpan = $('#cart-total-price');

    if (cartItems.length === 0) {
      listDiv.innerHTML = `<p style="text-align:center; color:var(--grey1);">Tu carrito está vacío.</p>`;
      totalPriceSpan.textContent = '$0';
    } else {
      let total = 0;
      listDiv.innerHTML = cartItems.map(item => {
        total += item.price * item.qty;
        return `
          <div class="cart-item-row">
            <div>
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-sub">$${item.price} c/u</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <button class="cart-qty-btn" data-action="minus" data-id="${item.id}">-</button>
              <span style="font-weight:800;">${item.qty}</span>
              <button class="cart-qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
        `;
      }).join('');

      totalPriceSpan.textContent = `$${total}`;

      listDiv.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = cartItems.find(i => i.id === btn.dataset.id);
          if (item) {
            if (btn.dataset.action === 'plus') item.qty += 1;
            else if (btn.dataset.action === 'minus') {
              item.qty -= 1;
              if (item.qty <= 0) cartItems = cartItems.filter(i => i.id !== item.id);
            }
          }
          renderTopbar();
          openCartModal();
        });
      });
    }

    showModal('#modal-cart');
  }

  function closeCartModal() { hideModal('#modal-cart'); }

  function openApplyConvocatoriaModal(conv) {
    if (currentUser.role === 'invitado') {
      openAuthModal();
      return;
    }

    const modal = $('#modal-apply-convocatoria');
    if (!modal) return;

    $('#apply-conv-id').value = conv ? conv.id : 'conv-001';
    $('#apply-project-title').value = '';
    $('#apply-applicant-name').value = currentUser.name || '';
    $('#apply-email').value = currentUser.email || '';
    $('#apply-dossier').value = '';
    $('#apply-summary').value = '';

    showModal(modal);

    // Bind event handlers once
    const closeBtn = $('#modal-apply-close');
    if (closeBtn) closeBtn.onclick = closeApplyConvocatoriaModal;

    const form = $('#form-apply-convocatoria');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const convId = $('#apply-conv-id').value;
        const projectTitle = $('#apply-project-title').value;
        const applicantName = $('#apply-applicant-name').value;
        const email = $('#apply-email').value;
        const category = $('#apply-category').value;
        const amount = $('#apply-amount').value;
        const dossierUrl = $('#apply-dossier').value;
        const summary = $('#apply-summary').value;

        try {
          const res = await fetch(`${API_BASE}/convocatorias/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              convocatoria_id: convId,
              user_id: currentUser.id,
              project_title: projectTitle,
              applicant_name: applicantName,
              email: email,
              category: category,
              requested_amount: parseFloat(amount) || 0,
              dossier_url: dossierUrl,
              summary: summary
            })
          });
          const data = await res.json();
          if (res.ok) {
            closeApplyConvocatoriaModal();
            alert(`🎉 ¡POSTULACIÓN REGISTRADA EXITOSAMENTE!\n\nFolio Oficial de Seguimiento: ${data.folio}\nProyecto: "${projectTitle}"\n\nSe ha registrado tu propuesta en el sistema de selección KAWSAY.`);
            showToast(`✅ Postulación registrada. Folio: ${data.folio}`);
          } else {
            showToast(data.error || 'Error al enviar la postulación');
          }
        } catch (err) {
          const mockFolio = 'FOLIO-' + new Date().getFullYear() + '-FONDO-' + Math.floor(1000 + Math.random() * 9000);
          closeApplyConvocatoriaModal();
          alert(`🎉 ¡POSTULACIÓN REGISTRADA CON ÉXITO!\n\nFolio Oficial: ${mockFolio}\nProyecto: "${projectTitle}"\n\nTu postulación ha sido guardada en la base de datos.`);
          showToast(`✅ Postulación registrada. Folio: ${mockFolio}`);
        }
      };
    }
  }

  function closeApplyConvocatoriaModal() {
    const modal = $('#modal-apply-convocatoria');
    if (modal) modal.classList.remove('open');
  }

  function downloadBasesPDF(convTitle) {
    const textContent = `
===================================================================
BASES REGULATORIAS Y TÉRMINOS OFICIALES DE CONVOCATORIA CULTURAL 2026
===================================================================

PROYECTO: ${convTitle || 'FONDO DE FOMENTO A LAS ARTES QUITO 2026'}
ENTIDAD EMISORA: Secretaría de Cultura del Municipio de Quito & NAVE 01
FECHA DE PUBLICACIÓN: Octubre 2026
JURISDICCIÓN: Distrito Metropolitano de Quito — Ecuador

1. OBJETIVO DEL FONDO
El presente incentivo económico y fondo de fomento no reembolsable tiene por objetivo impulsar proyectos culturales independientes en artes escénicas, música, artes plásticas y gestión comunitaria.

2. REQUISITOS DE POSTULACIÓN
- Persona natural o colectivos con residencia de al menos 2 años en la provincia de Pichincha.
- Cumplimiento de formulario digital en KAWSAY (https://kawsay-project.vercel.app).
- Presentación de Dossier de Proyecto en formato PDF o enlace a Drive/Sitio Web.
- Desglose presupuestario en dólares estadounidenses ($ USD).

3. PROCESO DE EVALUACIÓN Y SELECCIÓN
- Jurado compuesto por 3 evaluadores externos independientes.
- Criterios: Calidad Artística (40%), Viabilidad Presupuestaria (30%), Impacto Social y Comunitario (30%).

4. ENTREGA DE RECURSOS Y SEGUIMIENTO
- Transferencia por transferencia bancaria directa al postulante seleccionado.
- Informe final de ejecución de actividades.

Atentamente,
Secretaría de Cultura Quito & Consejo Editorial KAWSAY
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bases_Convocatoria_${(convTitle || 'Quito_2026').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📄 Descargando bases oficiales de la convocatoria en formato documento.');
  }

  function openArtistFormModal() {
    if (currentUser.role === 'invitado') { openAuthModal(); return; }
    const name = prompt("Nombre de tu Artista / Colectivo:");
    if (name) showToast(`Perfil de Artista "${name}" registrado exitosamente.`);
  }

  let editingSpaceId = null;

  function openSpaceCreateModal() {
    if (currentUser.role === 'invitado') { openAuthModal(); return; }
    editingSpaceId = null;
    const titleEl = document.getElementById('modal-create-space-title');
    if (titleEl) titleEl.textContent = '🏛️ REGISTRAR NUEVO ESPACIO CULTURAL EN QUITO';
    const form = document.getElementById('create-space-form');
    if (form) form.reset();
    if ($('#sp-name')) $('#sp-name').value = '';
    if ($('#sp-type')) $('#sp-type').value = 'ESPACIO CULTURAL';
    if ($('#sp-sector')) $('#sp-sector').value = 'La Floresta';
    if ($('#sp-capacity')) $('#sp-capacity').value = 200;
    if ($('#sp-address')) $('#sp-address').value = 'Calle Galavis E9-35 e Isabel La Católica';
    if ($('#sp-hours')) $('#sp-hours').value = 'Mar–Sáb: 10:00–22:00';
    if ($('#sp-categories')) $('#sp-categories').value = 'Arte Contemporáneo, Exposiciones, Música';
    if ($('#sp-image')) $('#sp-image').value = 'images/space_nave01.jpg';
    if ($('#sp-desc')) $('#sp-desc').value = 'Laboratorio de creación y espacio cultural independiente en Quito.';
    showModal('#modal-create-space');
  }

  function openEditSpaceModal(spaceId) {
    if (currentUser.role === 'invitado') { openAuthModal(); return; }
    const sp = apiSpaces.find(s => s.id === spaceId);
    if (!sp) return;
    editingSpaceId = spaceId;
    const titleEl = document.getElementById('modal-create-space-title');
    if (titleEl) titleEl.textContent = `✏️ EDITAR PERFIL DE MI ESPACIO: ${sp.name}`;
    if ($('#sp-name')) $('#sp-name').value = sp.name || '';
    if ($('#sp-type')) $('#sp-type').value = sp.type || 'ESPACIO CULTURAL';
    if ($('#sp-sector')) $('#sp-sector').value = sp.sector || 'La Floresta';
    if ($('#sp-capacity')) $('#sp-capacity').value = sp.capacity || 200;
    if ($('#sp-address')) $('#sp-address').value = sp.address || '';
    if ($('#sp-hours')) $('#sp-hours').value = sp.hours || 'Mar–Sáb: 10:00–22:00';
    let catText = sp.categories;
    if (Array.isArray(catText)) catText = catText.join(', ');
    try { if (typeof catText === 'string' && catText.startsWith('[')) catText = JSON.parse(catText).join(', '); } catch(e){}
    if ($('#sp-categories')) $('#sp-categories').value = catText || 'Arte, Música, Teatro';
    if ($('#sp-image')) $('#sp-image').value = sp.image || 'images/space_nave01.jpg';
    if ($('#sp-desc')) $('#sp-desc').value = sp.description || '';
    showModal('#modal-create-space');
  }

  function closeSpaceCreateModal() {
    editingSpaceId = null;
    hideModal('#modal-create-space');
  }

  async function openSpaceFormModal() {
    openSpaceCreateModal();
  }

  async function handleCreateSpaceSubmit(e) {
    e.preventDefault();
    const catsInput = $('#sp-categories') ? $('#sp-categories').value : '';
    const catArray = catsInput.split(',').map(c => c.trim()).filter(Boolean);

    const spaceData = {
      name: $('#sp-name').value,
      type: $('#sp-type').value,
      sector: $('#sp-sector').value,
      capacity: parseInt($('#sp-capacity').value) || 200,
      address: $('#sp-address').value,
      hours: $('#sp-hours').value,
      categories: catArray.length ? catArray : ['Arte', 'Cultura'],
      image: $('#sp-image').value || 'images/space_nave01.jpg',
      description: $('#sp-desc').value,
      owner_id: currentUser.id
    };

    try {
      const url = editingSpaceId ? `${API_BASE}/spaces/${editingSpaceId}` : `${API_BASE}/spaces`;
      const method = editingSpaceId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaceData)
      });
      if (res.ok) {
        const toastMsg = editingSpaceId ? `✏️ Espacio "${spaceData.name}" actualizado con éxito.` : `🏛️ Espacio "${spaceData.name}" registrado con éxito.`;
        showToast(toastMsg);
        closeSpaceCreateModal();
        editingSpaceId = null;
        e.target.reset();
        await loadInitialData();
        renderSidebar();
        renderTopbar();
        if (currentView === 'home') renderHomeView();
        else if (currentView === 'space') {
          const viewEl = document.getElementById('view-space');
          if (viewEl) renderSpaceStudioView(viewEl);
        } else if (currentView === 'admin') {
          const viewEl = document.getElementById('view-admin');
          if (viewEl) renderAdminDashboardView(viewEl);
        }
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Error al guardar espacio');
      }
    } catch (err) {
      showToast('Error de conexión con el servidor.');
    }
  }

  async function deleteSpace(spaceId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este espacio cultural?')) return;
    try {
      const res = await fetch(`${API_BASE}/spaces/${spaceId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ Espacio cultural eliminado.');
        await loadInitialData();
        if (currentView === 'space') {
          const viewEl = document.getElementById('view-space');
          if (viewEl) renderSpaceStudioView(viewEl);
        } else if (currentView === 'admin') {
          const viewEl = document.getElementById('view-admin');
          if (viewEl) renderAdminDashboardView(viewEl);
        } else {
          renderHomeView();
        }
      }
    } catch (e) {
      showToast('Error al eliminar el espacio.');
    }
  }

  async function deleteEvent(eventId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento de la cartelera?')) return;
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ Evento eliminado de la base de datos.');
        await loadInitialData();
        if (currentView === 'admin') {
          const viewEl = document.getElementById('view-admin');
          if (viewEl) renderAdminDashboardView(viewEl);
        } else if (currentView === 'artist') {
          const viewEl = document.getElementById('view-artist');
          if (viewEl) renderArtistStudioView(viewEl);
        } else if (currentView === 'space') {
          const viewEl = document.getElementById('view-space');
          if (viewEl) renderSpaceStudioView(viewEl);
        } else {
          renderHomeView();
        }
      }
    } catch (e) {
      showToast('Error al eliminar el evento.');
    }
  }

  async function handleCreateEventSubmit(e) {
    e.preventDefault();

    const sectorVal = $('#ev-sector') ? $('#ev-sector').value : 'Centro Histórico';
    const capacityVal = $('#ev-capacity') ? parseInt($('#ev-capacity').value) : 200;
    const castVal = $('#ev-cast') ? $('#ev-cast').value : '';

    const eventData = {
      title: $('#ev-title').value,
      full_title: $('#ev-subtitle') ? $('#ev-subtitle').value : $('#ev-title').value,
      description: $('#ev-desc').value,
      badge: $('#ev-badge') ? $('#ev-badge').value : 'ESTRENO',
      date: $('#ev-date').value,
      time: $('#ev-time').value,
      category: $('#ev-category').value,
      price: $('#ev-price').value || 'Gratis',
      venue: $('#ev-venue').value,
      full_venue: $('#ev-venue').value,
      sector: sectorVal,
      capacity: capacityVal,
      cast: castVal,
      image: $('#ev-image') ? $('#ev-image').value : 'images/hero_concierto.jpg',
      organizer_id: currentUser.id,
      role: currentUser.role
    };

    const isEditing = Boolean(editingEventId);
    const url = isEditing ? `${API_BASE}/events/${editingEventId}` : `${API_BASE}/events`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (res.ok) {
        showToast(isEditing
          ? `Cartelera "${eventData.title}" modificada con éxito.`
          : (currentUser.role === 'admin' || currentUser.role === 'espacio' || currentUser.role === 'artista'
            ? `🎉 Cartelera "${eventData.title}" publicada en vivo.`
            : `Cartelera "${eventData.title}" enviada. En revisión admin.`)
        );
        closeCreateModal();
        e.target.reset();
        editingEventId = null;
        await loadInitialData();
        renderTopbar();
        if (currentView === 'home') renderHomeView();
        else if (currentView === 'calendar-week') renderWeekView();
        else if (currentView === 'calendar-month') renderMonthView();
        else if (currentView === 'admin') {
          const viewEl = document.getElementById('view-admin');
          if (viewEl) renderAdminDashboardView(viewEl);
        } else if (currentView === 'artist') {
          const viewEl = document.getElementById('view-artist');
          if (viewEl) renderArtistStudioView(viewEl);
        } else if (currentView === 'space') {
          const viewEl = document.getElementById('view-space');
          if (viewEl) renderSpaceStudioView(viewEl);
        }
      }
    } catch (err) {
      showToast("Error de comunicación con el backend.");
    }
  }

  function openAdminModal() {
    const listDiv = $('#admin-mod-list');
    const pendingEvents = apiEvents.filter(e => e.status === 'pending');

    if (pendingEvents.length === 0) {
      listDiv.innerHTML = `<div style="padding:20px; text-align:center; color:var(--accent);">No hay eventos pendientes de aprobación.</div>`;
    } else {
      listDiv.innerHTML = `
        <table class="mod-table">
          <thead>
            <tr><th>EVENTO</th><th>CATEGORÍA</th><th>FECHA</th><th>ACCIONES</th></tr>
          </thead>
          <tbody>
            ${pendingEvents.map(ev => `
              <tr>
                <td><strong>${ev.title}</strong></td>
                <td>${ev.category}</td>
                <td>${ev.date}</td>
                <td>
                  <button class="btn-action-approve" data-id="${ev.id}">APROBAR ✅</button>
                  <button class="btn-action-reject" data-id="${ev.id}">RECHAZAR ❌</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      listDiv.querySelectorAll('.btn-action-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
          await setEventStatus(btn.dataset.id, 'approved');
          openAdminModal();
        });
      });
      listDiv.querySelectorAll('.btn-action-reject').forEach(btn => {
        btn.addEventListener('click', async () => {
          await setEventStatus(btn.dataset.id, 'rejected');
          openAdminModal();
        });
      });
    }
    showModal('#modal-admin');
  }

  async function setEventStatus(eventId, status) {
    try {
      const target = apiEvents.find(e => String(e.id) === String(eventId));
      if (target) target.status = status;

      const res = await fetch(`${API_BASE}/events/${eventId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(status === 'approved' ? '✅ Cartelera APROBADA y publicada en vivo.' : (status === 'pending' ? '⏸️ Cartelera pausada y puesta en pendiente.' : '❌ Cartelera RECHAZADA.'));
      } else {
        showToast(status === 'approved' ? '✅ Cartelera APROBADA.' : (status === 'pending' ? '⏸️ Cartelera puesta en pendiente.' : '❌ Cartelera RECHAZADA.'));
      }
    } catch (e) {
      const target = apiEvents.find(e => String(e.id) === String(eventId));
      if (target) target.status = status;
      showToast(status === 'approved' ? '✅ Cartelera APROBADA.' : (status === 'pending' ? '⏸️ Cartelera puesta en pendiente.' : '❌ Cartelera RECHAZADA.'));
    }
    await loadInitialData();
    renderTopbar();
    renderHomeView();
    if (currentView === 'admin') {
      const viewEl = document.getElementById('view-admin');
      if (viewEl) renderAdminDashboardView(viewEl);
    }
  }

  function closeAdminModal() { hideModal('#modal-admin'); }
  function openCreateModal() {
    editingEventId = null;
    $('#modal-create-title').textContent = `📜 GENERADOR DE CARTELERA PROFESIONAL (${currentUser.role.toUpperCase()})`;
    if ($('#btn-submit-billboard')) $('#btn-submit-billboard').textContent = '🚀 PUBLICAR CARTELERA EN VIVO';

    const venueSelect = $('#ev-venue-select');
    if (venueSelect) {
      venueSelect.innerHTML = `<option value="">-- Seleccionar Espacio Registrado --</option>` +
        apiSpaces.map(sp => `<option value="${sp.name}">${sp.name} (${sp.sector || 'Quito'})</option>`).join('') +
        `<option value="__custom__">➕ Escribir otro recinto manualmente</option>`;

      venueSelect.onchange = () => {
        if (venueSelect.value && venueSelect.value !== '__custom__') {
          $('#ev-venue').value = venueSelect.value;
          const matchedSp = apiSpaces.find(s => s.name === venueSelect.value);
          if (matchedSp && matchedSp.sector && $('#ev-sector')) {
            $('#ev-sector').value = matchedSp.sector;
          }
        }
      };
    }
    showModal('#modal-create');
  }
  function closeCreateModal() {
    editingEventId = null;
    hideModal('#modal-create');
  }
  function openTicketsModal() { showModal('#modal-tickets'); }
  function closeTicketsModal() { hideModal('#modal-tickets'); }

  function renderConvocatoriasView() {
    const view = document.getElementById('view-convocatorias');
    if (!view) return;

    const convocatoriasList = [
      {
        id: 'conv-001',
        title: 'FONDO DE FOMENTO A LAS ARTES QUITO 2026',
        category: 'Convocatorias',
        badge: 'FONDO PÚBLICO',
        date: '2026-12-01',
        time: 'Hasta las 23:59',
        price: 'Premio: $10,000',
        venue: 'Secretaría de Cultura Quito',
        description: 'Convocatoria abierta para proyectos independientes de artes escénicas, música y gestión comunitaria en la provincia de Pichincha.',
        image: 'images/event_mural.jpg',
        rating_count: 14,
        rating_sum: 70
      },
      {
        id: 'conv-002',
        title: 'RESIDENCIA ARTÍSTICA Y EXPOSICIÓN NAVE 01',
        category: 'Convocatorias',
        badge: 'RESIDENCIA',
        date: '2026-11-15',
        time: 'Hasta las 18:00',
        price: 'Beca Completa + Taller',
        venue: 'NAVE 01 Centro Histórico',
        description: 'Beca de residencia para artistas plásticos y visuales emergentes. Incluye estudio de trabajo, materiales y exposición final.',
        image: 'images/event_portraits.jpg',
        rating_count: 9,
        rating_sum: 45
      }
    ];

    view.innerHTML = `
      <div style="padding: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px;">
          <div>
            <span class="cat-convocatorias" style="font-family:var(--font-mono); font-size:12px; font-weight:900; padding:6px 12px; border-radius:6px; text-transform:uppercase;">
              📢 OPORTUNIDADES & BECAS
            </span>
            <h1 style="font-size:32px; font-weight:900; margin-top:10px;">CONVOCATORIAS CULTURALES 2026</h1>
            <p style="color:var(--grey1); font-size:15px;">Fondos de fomento, becas de creación y residencias artísticas abiertas en Quito.</p>
          </div>
        </div>

        <div class="events-grid stagger">
          ${convocatoriasList.map(ev => renderEventCard(ev)).join('')}
        </div>
      </div>
    `;

    bindCardInteractions();
  }

  // ============================================================
  //  ESPACIO CULTURAL — VISTA DE PÁGINA COMPLETA
  //  Basada en el screenshot de referencia del usuario
  // ============================================================
  function navigateSpaceDetail(spaceId) {
    openSpaceDetailModal(spaceId);
  }

  function renderSpaceDetailPage(view, sp) {
    // Enrich defaults
    if (!sp.image) sp.image = 'images/hero_banner.jpg';
    if (!sp.description) sp.description = 'Espacio cultural referente de Quito para la experimentación artística.';
    if (!sp.sector) sp.sector = 'Quito';
    if (!sp.address) sp.address = 'Quito, Ecuador';
    if (!sp.hours) sp.hours = 'Lun–Vie: 09:00–19:00 · Sáb: 10:00–18:00';
    if (!sp.categories) sp.categories = ['Arte', 'Cultura', 'Comunidad'];
    if (!sp.eventsCount) sp.eventsCount = 0;
    if (!sp.collectionsCount) sp.collectionsCount = 0;
    if (!sp.rating) sp.rating = 4.8;
    if (!sp.ratingCount) sp.ratingCount = 0;
    if (!sp.nextEvent) sp.nextEvent = '—';
    if (!sp.capacity) sp.capacity = 0;

    // Related events (any event in this space)
    const spaceEvents = apiEvents.filter(e =>
      e.status === 'approved'
    ).slice(0, 4);

    const galleryImages = sp.gallery || [sp.image, sp.image, sp.image, sp.image];

    view.innerHTML = `
      <div class="space-detail-page" style="min-height:100vh; background:#0a0a0a; padding-bottom:80px;">

        <!-- ── HEADER HERO ── -->
        <div style="position:relative; background:#000; padding: 28px 0 0;">
          <!-- Back button + breadcrumb -->
          <div style="padding:0 32px 16px; display:flex; align-items:center; gap:10px;">
            <button id="btn-space-detail-back" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; border-radius:8px; padding:7px 14px; font-family:var(--font-mono); font-size:11px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:6px; transition:background 0.15s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              ESPACIOS
            </button>
            <span style="color:rgba(255,255,255,0.3); font-size:11px; font-family:var(--font-mono);">/</span>
            <span style="color:rgba(255,255,255,0.5); font-size:11px; font-family:var(--font-mono); font-weight:700;">${sp.name}</span>
          </div>

          <!-- Badges -->
          <div style="padding:0 32px 14px; display:flex; gap:8px; flex-wrap:wrap;">
            <span style="background:var(--accent,#d4ff00); color:#000; font-family:var(--font-mono); font-size:10px; font-weight:900; padding:5px 12px; border-radius:6px;">${sp.badge || 'ESPACIO'}</span>
            <span style="background:rgba(255,255,255,0.1); color:#fff; font-family:var(--font-mono); font-size:10px; font-weight:800; padding:5px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.15);">${sp.sector.toUpperCase()}</span>
            <span style="background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); font-family:var(--font-mono); font-size:10px; font-weight:700; padding:5px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">${sp.type}</span>
          </div>

          <!-- GIANT TITLE -->
          <div style="padding:0 32px 20px;">
            <h1 style="font-size:clamp(36px, 5.5vw, 72px); font-weight:900; color:#fff; line-height:0.92; letter-spacing:-2px; text-transform:uppercase; margin:0; max-width:800px;">
              ${sp.name}
            </h1>
          </div>

          <!-- Action buttons row -->
          <div style="padding:0 32px 24px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button id="btn-spd-follow" style="display:flex; align-items:center; gap:8px; padding:10px 20px; background:var(--accent); color:#000; border:none; border-radius:8px; font-family:var(--font-mono); font-size:12px; font-weight:900; cursor:pointer; transition:filter 0.15s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              SEGUIR ESPACIO
            </button>
            <button id="btn-spd-share" style="width:38px; height:38px; border-radius:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button id="btn-spd-save" style="width:38px; height:38px; border-radius:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>

          <!-- Stats bar -->
          <div style="border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:0; overflow-x:auto;">
            ${[
              { label: 'EVENTOS CON AFORO', value: sp.eventsCount || 0 },
              { label: 'COLECCIONES', value: sp.collectionsCount || 0 },
              { label: 'VALORACIÓN', value: `★ ${sp.rating}` },
              { label: 'PRÓXIMO EN', value: sp.nextEvent || '—' },
            ].map((stat, i) => `
              <div style="flex:1; min-width:140px; padding:16px 24px; border-right:1px solid rgba(255,255,255,0.07); display:flex; flex-direction:column; gap:3px;">
                <span style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:0.8px;">${stat.label}</span>
                <span style="font-family:var(--font-mono); font-size:18px; font-weight:900; color:${i === 2 ? '#eab308' : '#fff'};">${stat.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── BODY: 2-column layout ── -->
        <div style="display:grid; grid-template-columns:1fr 340px; gap:28px; padding:28px 32px; align-items:start;">

          <!-- ── LEFT COLUMN ── -->
          <div style="display:flex; flex-direction:column; gap:28px;">

            <!-- Acerca del Espacio -->
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                <span style="width:18px; height:2px; background:var(--accent);"></span>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">ACERCA DEL ESPACIO</span>
              </div>
              <p style="color:rgba(255,255,255,0.78); line-height:1.7; font-size:14px; max-width:680px; margin:0 0 16px;">
                ${sp.description}
              </p>
              ${sp.description.length > 200 ? `
                <div style="display:flex; align-items:center; gap:8px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06);">
                  <span style="width:18px; height:2px; background:rgba(255,255,255,0.3);"></span>
                  <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">AGOTADOS DE ESTE ESPACIO</span>
                </div>
              ` : ''}
            </div>

            <!-- Galería fotográfica -->
            <div>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                ${galleryImages.slice(0, 4).map((img, i) => `
                  <div style="aspect-ratio:1; border-radius:10px; overflow:hidden; background:#1a1a1a;">
                    <img src="${img}" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.75); transition:filter 0.2s; cursor:pointer;" onmouseover="this.style.filter='brightness(1)'" onmouseout="this.style.filter='brightness(0.75)'">
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Próximos Eventos en este espacio -->
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="width:18px; height:2px; background:var(--accent);"></span>
                  <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">PRÓXIMOS EVENTOS</span>
                </div>
                <span style="font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.3);">AÑO · ${spaceEvents.length} EVENTOS</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${spaceEvents.map(ev => `
                  <div class="space-detail-ev-card" data-ev-id="${ev.id}" style="background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:12px; overflow:hidden; cursor:pointer; transition:border-color 0.15s, transform 0.15s;" onmouseover="this.style.borderColor='rgba(212,255,0,0.3)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)';this.style.transform='none'">
                    <div style="position:relative;">
                      <img src="${ev.image}" style="width:100%; height:130px; object-fit:cover;">
                      <div style="position:absolute; top:8px; left:8px; display:flex; gap:5px;">
                        <span style="background:var(--accent); color:#000; font-family:var(--font-mono); font-size:9px; font-weight:900; padding:3px 8px; border-radius:5px;">${ev.category || 'EVENTO'}</span>
                        ${ev.badge ? `<span style="background:rgba(0,0,0,0.7); color:#fff; font-family:var(--font-mono); font-size:9px; font-weight:800; padding:3px 8px; border-radius:5px; border:1px solid rgba(255,255,255,0.2);">${ev.badge}</span>` : ''}
                      </div>
                    </div>
                    <div style="padding:12px 14px;">
                      <div style="font-size:10px; font-family:var(--font-mono); color:rgba(255,255,255,0.4); margin-bottom:5px;">${ev.date} · ${ev.time} <span style="color:var(--accent); font-weight:900;">${ev.price}</span></div>
                      <div style="font-weight:900; font-size:13px; color:#fff; line-height:1.2; margin-bottom:5px;">${ev.title}</div>
                      <div style="font-size:11px; color:rgba(255,255,255,0.45); display:flex; align-items:center; gap:4px;">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${ev.venue || sp.name}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div><!-- /LEFT -->

          <!-- ── RIGHT SIDEBAR ── -->
          <div style="display:flex; flex-direction:column; gap:16px; position:sticky; top:20px;">

            <!-- Disponibilidad card -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden;">
              <div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; gap:8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">DISPONIBILIDAD</span>
              </div>
              <div style="padding:16px 18px; display:flex; flex-direction:column; gap:14px;">
                <!-- Sector -->
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" style="flex-shrink:0;margin-top:2px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <div>
                    <div style="font-size:14px; font-weight:800; color:#fff;">${sp.sector}</div>
                  </div>
                </div>
                <!-- Dirección -->
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">DIRECCIÓN</div>
                  <div style="font-size:13px; color:rgba(255,255,255,0.75);">${sp.address}</div>
                </div>
                <!-- Horario -->
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">HORARIO</div>
                  <div style="font-size:12px; color:rgba(255,255,255,0.65); line-height:1.5;">${sp.hours}</div>
                </div>
                <!-- Capacidad -->
                <div>
                  <div style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:0.8px; margin-bottom:4px;">SOBRE DOMICILIO</div>
                  <div style="font-size:12px; color:rgba(255,255,255,0.65);">Capacidad: ${sp.capacity} personas</div>
                </div>
                <!-- Map placeholder -->
                <div id="btn-spd-map-card" style="background:#1a1a1a; border:1px solid rgba(255,255,255,0.07); border-radius:10px; height:110px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; cursor:pointer; transition:border-color 0.15s;" onmouseover="this.style.borderColor='rgba(212,255,0,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style="font-family:var(--font-mono); font-size:9px; font-weight:800; color:rgba(255,255,255,0.3); letter-spacing:0.5px;">VER MAPA</span>
                </div>
              </div>
            </div>

            <!-- En este espacio (categorías + stats) -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden;">
              <div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; gap:8px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span style="font-family:var(--font-mono); font-size:10px; font-weight:900; color:rgba(255,255,255,0.4); letter-spacing:1px;">EN ESTE ESPACIO</span>
              </div>
              <div style="padding:10px 6px;">
                ${sp.categories.map((cat, i) => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-radius:8px; cursor:pointer; transition:background 0.12s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.3)'}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>
                      <span style="font-size:13px; color:${i === 0 ? '#fff' : 'rgba(255,255,255,0.6)'}; font-weight:${i === 0 ? '700' : '500'};">${cat}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:rgba(255,255,255,0.35);">${Math.floor(100 + Math.random() * 200)} AÑO</span>
                      <span style="font-family:var(--font-mono); font-size:11px; font-weight:900; color:var(--accent); min-width:24px; text-align:right;">${Math.floor(20 + Math.random() * 100)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Social icons -->
            <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px 18px;">
              <div style="display:flex; gap:10px; justify-content:center;">
                ${[
                  { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07...', label: 'IG', color: '#e1306c' },
                ].map(() => '').join('')}
                ${['IG', 'FB', 'YT', 'WEB'].map((net, i) => `
                  <button style="width:42px; height:42px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.6); font-family:var(--font-mono); font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.12)';this.style.color='#fff'" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.6)'">${net}</button>
                `).join('')}
              </div>
            </div>

          </div><!-- /RIGHT SIDEBAR -->

        </div><!-- /body grid -->

        <!-- Footer strip -->
        <div style="margin:0 32px; padding:20px 0; border-top:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <span style="font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.2);">© 2026 KAWSAY · Plataforma Cultural de Quito · Todos los derechos reservados</span>
          <span style="font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.2);">ADMIN · ARTISTAS</span>
        </div>

      </div>
    `;

    // Listeners
    $('#btn-space-detail-back').addEventListener('click', () => navigate('home'));
    $('#btn-spd-follow').addEventListener('click', function() {
      showToast(`¡Ahora sigues a ${sp.name}!`);
      this.style.background = 'rgba(212,255,0,0.15)';
      this.style.color = 'var(--accent)';
      this.style.border = '1.5px solid var(--accent)';
      this.innerHTML = '✓ SIGUIENDO';
    });
    $('#btn-spd-share').addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(window.location.href);
      showToast('¡Enlace copiado!');
    });
    $('#btn-spd-map-card').addEventListener('click', () => {
      window.open(`https://maps.google.com?q=${encodeURIComponent(sp.address + ', Quito')}`, '_blank');
    });

    view.querySelectorAll('.space-detail-ev-card').forEach(el => {
      el.addEventListener('click', () => openEventDetailModal(el.dataset.evId));
    });
  }

  function navigate(view) {
    // 🛡️ CONTROL DE ACCESO BASADO EN ROLES (RBAC)
    if (view === 'admin' && currentUser.role !== 'admin' && currentUser.role !== 'gestor') {
      showToast('⛔ Acceso restringido: Esta pantalla requiere perfil Administrador');
      view = 'home';
    }
    if (view === 'artist' && currentUser.role === 'invitado') {
      openAuthModal();
      return;
    }
    if (view === 'space' && currentUser.role === 'invitado') {
      openAuthModal();
      return;
    }

    currentView = view;
    $$('.view').forEach(v => v.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));

    const viewEl = document.getElementById(`view-${view}`);
    if (viewEl) viewEl.classList.add('active');

    const navEl = $(`[data-view="${view}"]`);
    if (navEl) navEl.classList.add('active');

    if (view === 'home') renderHomeView();
    if (view === 'calendar-week') buildWeekGrid();
    if (view === 'calendar-month') { buildMonthGrid(); buildUpcomingList(); }
    if (view === 'join') renderJoinView();
    if (view === 'convocatorias') renderConvocatoriasView();
    if (view === 'admin' && viewEl) renderAdminDashboardView(viewEl);
    if (view === 'artist' && viewEl) renderArtistStudioView(viewEl);
    if (view === 'space' && viewEl) renderSpaceStudioView(viewEl);
    // Space detail is rendered on demand via navigateSpaceDetail()

    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;

    renderMobileBottomNav();
  }

  function bindGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCreateModal();
        closeAdminModal();
        closeCartModal();
        closeTicketsModal();
        closeAuthModal();
        closeEventDetailModal();
        closeApplyConvocatoriaModal();
      }
    });

    document.addEventListener('click', (e) => {
      // 1. Clic en el fondo oscuro de cualquier modal o offcanvas para cerrarlo
      if (e.target && e.target.classList &&
          (e.target.classList.contains('modal-overlay') || e.target.classList.contains('offcanvas-overlay'))) {
        if (e.target.id === 'modal-terms') { hideModal('#modal-terms'); return; }
        if (e.target.id === 'modal-privacy') { hideModal('#modal-privacy'); return; }
        if (e.target.id === 'modal-email-confirm') { hideModal('#modal-email-confirm'); return; }
        hideModal(e.target);
        return;
      }

      // 2. Delegación para botones de creación de eventos
      const createBtn = e.target.closest('#create-event-btn, .create-event-btn, #btn-admin-create-event, #btn-artist-create-event, #btn-artist-new-event-top, #btn-space-create-event, #btn-space-new-event-top');
      if (createBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (currentUser.role === 'invitado') {
          openAuthModal();
        } else {
          openCreateModal();
        }
        return;
      }

      // 3. Si el clic es dentro de un botón de acción de tarjeta, dejar que su propio manejador lo procese
      if (e.target.closest('.btn-card-action')) {
        return;
      }

      // 4. Delegación global única: Capturar clic en cualquier tarjeta de evento, hero button, tarjeta de calendario o convocatoria
      const card = e.target.closest('.event-card, .month-event-pill, .upcoming-event-card, #btn-mas-info');
      if (card) {
        if (card.id === 'preview-billboard-card' || card.closest('#modal-create')) return;
        const id = card.dataset.id || card.getAttribute('data-id') || (card.id === 'btn-mas-info' ? 'fe-001' : null);
        if (id) {
          openEventDetailModal(id);
        }
      }
    });
  }

  function showToast(msg) {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
      background: var(--accent); color: #000;
      font-family: var(--font-mono); font-size: 13px; font-weight: 800;
      padding: 12px 24px; border-radius: 24px;
      z-index: 350; white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);

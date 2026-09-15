// ============================================================
// KAWSAY — App Logic (PANEL DE CONTROL & ANALÍTICAS DE ADMINISTRACIÓN)
// ============================================================

const App = (() => {

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3005/api'
    : (window.location.origin.includes('onrender.com')
        ? '/api'
        : 'https://kawsay-project.onrender.com/api');

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

  let cartItems = [];
  let apiEvents = [];
  let apiSpaces = [];
  let userInteractions = {};
  let platformStats = { approvedEvents: 0, pendingEvents: 0, totalSpaces: 0, totalUsers: 0 };
  let isPlayingDemoTrack = false;
  let activeDetailEvent = null;
  let editingEventId = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  async function init() {
    const savedUser = localStorage.getItem('kawsay_user');
    if (savedUser) {
      try { currentUser = JSON.parse(savedUser); } catch(e) { currentUser = guestUser; }
    } else {
      currentUser = guestUser;
    }
    await loadInitialData();
    renderSidebar();
    renderTopbar();
    renderHomeView();
    renderWeekView();
    renderMonthView();
    renderJoinView();
    renderModals();
    bindGlobalEvents();
    navigate('home');
  }

  // ============================================================
  // DATA FETCHING
  // ============================================================
  async function loadInitialData() {
    try {
      const uRes = await fetch(`${API_BASE}/users`);
      if (uRes.ok) {
        const fetchedUsers = await uRes.json();
        usersList = [guestUser, ...fetchedUsers];
      }

      const eRes = await fetch(`${API_BASE}/events?status=all`);
      if (eRes.ok) apiEvents = await eRes.json();

      const sRes = await fetch(`${API_BASE}/spaces`);
      if (sRes.ok) apiSpaces = await sRes.json();

      const stRes = await fetch(`${API_BASE}/stats`);
      if (stRes.ok) platformStats = await stRes.json();

      if (currentUser.role !== 'invitado') {
        await loadUserInteractions();
      } else {
        userInteractions = {};
      }
    } catch (err) {
      console.warn("⚠️ API local no disponible, usando datos base:", err);
      apiEvents = KAWSAY_DATA.weekEvents.map(e => ({ ...e, status: 'approved' }));
      apiSpaces = KAWSAY_DATA.spaces;
    }
  }

  async function loadUserInteractions() {
    if (currentUser.role === 'invitado') return;
    try {
      const res = await fetch(`${API_BASE}/interactions/${currentUser.id}`);
      if (res.ok) {
        const rows = await res.json();
        userInteractions = {};
        rows.forEach(r => {
          userInteractions[r.event_id] = { is_favorite: r.is_favorite, has_rsvp: r.has_rsvp };
        });
      }
    } catch (e) {
      console.warn("Error de interacciones:", e);
    }
  }

  // ============================================================
  // SIDEBAR
  // ============================================================
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');

    let actionBtnText = '';
    if (currentUser.role === 'invitado') actionBtnText = 'INGRESAR / REGISTRARSE';
    else if (currentUser.role === 'artista') actionBtnText = '+ GENERAR CARTELERA PRO';
    else if (currentUser.role === 'espacio') actionBtnText = '+ CREAR EVENTO DE MI ESPACIO';
    else if (currentUser.role === 'admin') actionBtnText = 'NUEVO EVENTO ADMIN';

    sidebar.innerHTML = `
      <div class="sidebar-logo" id="sidebar-logo" style="font-size:24px; font-weight:900; display:flex; align-items:center; gap:8px;">
        KAWSAY <span style="color:var(--accent); font-size:12px; font-weight:700;">QUITO</span>
      </div>

      <!-- Estado de Autenticación en Sidebar -->
      <div style="margin: 12px 18px 4px; padding: 8px 12px; background: ${currentUser.role === 'invitado' ? '#222' : 'var(--surface3)'}; border: 1px solid ${currentUser.role === 'invitado' ? 'var(--accent)' : 'var(--border)'}; border-radius: 8px; font-family: var(--font-mono); font-size: 11px; color: ${currentUser.role === 'invitado' ? '#fff' : 'var(--accent)'}; font-weight: 800;">
        ${currentUser.role === 'invitado' ? '🌐 SIN INICIAR SESIÓN (VISITANTE)' : `ROL: ${currentUser.role.toUpperCase()} (${currentUser.name})`}
      </div>

      <nav class="sidebar-nav">
        <div class="nav-item active" data-view="home" id="nav-inicio" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap home-icon">${ICONS.home}</div>
          <span>${currentUser.role === 'artista' ? 'ESTUDIO ARTISTA' : currentUser.role === 'espacio' ? 'MI ESPACIO CULTURAL' : currentUser.role === 'admin' ? 'PANEL ADMIN ANALÍTICAS' : 'INICIO'}</span>
        </div>
        <div class="nav-item" data-view="calendar-week" id="nav-explorar" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap">${ICONS.search}</div>
          <span>EXPLORAR</span>
        </div>
        <div class="nav-item" data-view="calendar-month" id="nav-calendario" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap">${ICONS.calendar}</div>
          <span>CALENDARIO MES</span>
        </div>
        <div class="nav-item" data-view="join" id="nav-join" style="font-size:14px; padding:12px 18px;">
          <div class="nav-icon-wrap">${ICONS.artist}</div>
          <span>ARTISTA & ESPACIO</span>
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
      <div class="topbar-nav">
        <button class="topbar-nav-btn" id="btn-back" title="Atrás">&#8592;</button>
        <button class="topbar-nav-btn" id="btn-forward" title="Adelante">&#8594;</button>
      </div>

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
          <button class="btn-primary" id="btn-topbar-login" style="padding:8px 18px; font-size:12px; font-family:var(--font-mono); font-weight:900; background:var(--accent); color:#000; cursor:pointer; border:none; border-radius:6px; display:flex; align-items:center; gap:6px;">
            ${ICONS.key} INICIAR SESIÓN / REGISTRO
          </button>
        ` : `
          <div style="display:flex; align-items:center; gap:10px; background:var(--surface2); padding:4px 10px 4px 6px; border-radius:20px; border:1px solid var(--border);">
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

    $('#btn-back').addEventListener('click', () => history.back());
    $('#btn-forward').addEventListener('click', () => history.forward());
    $('#btn-cart').addEventListener('click', openCartModal);

    const loginBtn = $('#btn-topbar-login');
    if (loginBtn) loginBtn.addEventListener('click', openAuthModal);

    const logoutBtn = $('#btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        localStorage.removeItem('kawsay_user');
        currentUser = guestUser;
        await loadUserInteractions();
        showToast('Sesión cerrada correctamente');
        renderSidebar();
        renderTopbar();
        renderHomeView();
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

    if (currentUser.role === 'admin') {
      renderAdminDashboardView(view);
      return;
    }

    if (currentUser.role === 'artista') {
      renderArtistStudioView(view);
      return;
    }

    if (currentUser.role === 'espacio') {
      renderSpaceStudioView(view);
      return;
    }

    const displayEvents = (currentUser.role === 'invitado' || currentUser.role === 'espectador')
      ? apiEvents.filter(e => e.status === 'approved')
      : apiEvents;

    const featured = apiEvents.find(e => e.id === 'fe-001') || apiEvents[0] || KAWSAY_DATA.featuredEvent;

    view.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero-banner" id="hero-banner" style="height:360px;">
        <img class="hero-img" src="${featured.image}" alt="${featured.title}">
        <div class="hero-content">
          <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
            <span class="hero-badge">${featured.badge || 'DESTACADO'}</span>
            <span class="premium-badge-gold" style="display:inline-flex; align-items:center; gap:4px;">
              ${ICONS.star} EXCLUSIVO PREMIUM
            </span>
          </div>
          <h1 class="hero-title" style="font-size:48px;">${featured.title}</h1>
          <p class="hero-desc" style="font-size:16px;">${featured.description}</p>
          <div class="hero-btns" style="margin-top:16px;">
            <button class="btn-primary" id="btn-conseguir-entradas" style="padding:14px 28px; font-size:14px; display:inline-flex; align-items:center; gap:8px;">
              ${ICONS.ticket} CONSEGUIR ENTRADAS Y AGREGAR AL CARRITO
            </button>
            <button class="btn-secondary" id="btn-mas-info" style="padding:14px 24px; font-size:14px;">
              VER DETALLES DEL EVENTO 🔍
            </button>
          </div>
        </div>
      </section>

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
          <h2 class="section-title" style="font-size:22px; font-weight:900;">CARTELERA CULTURAL EN VIVO (SQLITE DB)</h2>
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
                 style="background: ${int.color}; color: ${int.dark ? '#000' : '#fff'};"
                 data-id="${int.id}" tabindex="0" role="button">
              <span class="interest-label" style="font-weight:900;">${int.name}</span>
              <span class="interest-icon" style="display:flex; align-items:center;">${ICONS[int.icon] || ICONS.music}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    bindCardInteractions();

    $$('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterEventsByCategory(pill.dataset.cat);
      });
    });

    $('#btn-conseguir-entradas').addEventListener('click', () => {
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
              Monitoreo global de sesiones, número de artistas, ventas de entradas y base de datos local SQLite.
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

        <!-- TARJETAS DE MÉTRICAS CLAVE (KPIs EXECUTIVOS) -->
        <div class="admin-kpi-grid">
          <div class="admin-kpi-card">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🌐 SESIONES / USUARIOS ACTIVOS</div>
            <div class="admin-kpi-val" style="color:var(--accent);">1,450</div>
            <div class="admin-kpi-sub">4 Perfiles Registrados en SQLite</div>
          </div>
          <div class="admin-kpi-card">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🎨 CANTIDAD DE ARTISTAS</div>
            <div class="admin-kpi-val" style="color:var(--gold);">142</div>
            <div class="admin-kpi-sub">Colectivos & Bandas Verificados</div>
          </div>
          <div class="admin-kpi-card">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🏛️ ESPACIOS & RECINTOS</div>
            <div class="admin-kpi-val" style="color:#60a5fa;">24</div>
            <div class="admin-kpi-sub">Centros Culturales en Quito</div>
          </div>
          <div class="admin-kpi-card">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">🎟️ BOLETOS VENDIDOS</div>
            <div class="admin-kpi-val" style="color:#f43f5e;">3,850</div>
            <div class="admin-kpi-sub">Entradas Digitales Procesadas</div>
          </div>
          <div class="admin-kpi-card">
            <div style="font-size:11px; font-family:var(--font-mono); color:var(--grey1); font-weight:800;">💰 RECAUDACIÓN TOTAL</div>
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
                  <tr>
                    <td><strong>${ev.title}</strong></td>
                    <td><span style="color:var(--accent); font-weight:800;">${ev.category}</span></td>
                    <td>${ev.venue}</td>
                    <td>${ev.date} · ${ev.time}</td>
                    <td>
                      <button class="btn-action-approve" data-id="${ev.id}" style="background:var(--accent); color:#000; font-weight:900; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;">APROBAR ✅</button>
                      <button class="btn-action-reject" data-id="${ev.id}" style="background:#ef4444; color:#fff; font-weight:800; padding:6px 12px; border-radius:6px; border:none; cursor:pointer; margin-left:6px;">RECHAZAR ❌</button>
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

    $('#btn-admin-create-event').addEventListener('click', openCreateModal);
    $('#btn-admin-export-report').addEventListener('click', () => {
      showToast('📊 Reporte Ejecutivo de Ventas exportado a CSV.');
    });

    view.querySelectorAll('.btn-action-approve').forEach(btn => {
      btn.addEventListener('click', async () => {
        await setEventStatus(btn.dataset.id, 'approved');
      });
    });

    view.querySelectorAll('.btn-action-reject').forEach(btn => {
      btn.addEventListener('click', async () => {
        await setEventStatus(btn.dataset.id, 'rejected');
      });
    });
  }

  // ============================================================
  // DISEÑO DEDICADO PARA ESPACIO CULTURAL (GESTIÓN DE RECINTO)
  // ============================================================
  function renderSpaceStudioView(view) {
    view.innerHTML = `
      <!-- Banner del Espacio Cultural -->
      <div class="space-dashboard-banner">
        <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
          <img src="images/space_teatro.jpg" style="width:100px; height:100px; border-radius:14px; object-fit:cover; border:3px solid var(--gold);" alt="Teatro Nacional">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <h1 style="font-size:32px; font-weight:900;">Teatro Nacional Quito</h1>
              <span class="space-verified-tag">🏛️ RECINTO CULTURAL VERIFICADO</span>
            </div>
            <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono); margin-bottom:12px;">
              Centro Histórico, Quito · Av. 10 de Agosto y Briceño · Capacidad: 500 Espectadores
            </p>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
              <button class="btn-primary" id="btn-space-create-event" style="padding:14px 28px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--gold); color:#000; display:inline-flex; align-items:center; gap:8px;">
                ${ICONS.plus} + CREAR & PUBLICAR EVENTO EN MI RECINTO
              </button>
              <button class="btn-secondary" id="btn-space-promote-venue" style="padding:12px 20px; font-size:13px; font-family:var(--font-mono); font-weight:800; border:1px solid var(--border); color:#fff; display:inline-flex; align-items:center; gap:8px;">
                📢 PROMOVER MI ESPACIO / ALQUILER
              </button>
            </div>
          </div>
        </div>

        <!-- Métricas del Recinto -->
        <div class="artist-stats-grid" style="margin-top:24px;">
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">500</div>
            <div class="artist-stat-label">AFORO MÁXIMO</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">85%</div>
            <div class="artist-stat-label">OCUPACIÓN MENSUAL</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">${apiEvents.length}</div>
            <div class="artist-stat-label">FUNCIONES EN VIVO</div>
          </div>
          <div class="artist-stat-card">
            <div class="artist-stat-num" style="color:var(--gold);">$3,200</div>
            <div class="artist-stat-label">TAQUILLA ESTIMADA</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: SALAS & EQUIPAMIENTO DEL RECINTO -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:22px; font-weight:900;">INSTALACIONES & SALAS DISPONIBLES EN EL TEATRO</h2>
        </div>
        <div class="space-specs-grid">
          <div class="space-spec-card">
            <div style="font-size:16px; font-weight:900; color:var(--gold); margin-bottom:4px;">SALA PRINCIPAL TEATRAL</div>
            <div style="font-size:12px; color:var(--grey1); font-family:var(--font-mono);">Capacidad: 500 personas · Escenario 12x8m · Sonido DMX</div>
          </div>
          <div class="space-spec-card">
            <div style="font-size:16px; font-weight:900; color:var(--gold); margin-bottom:4px;">GALERÍA Y SALÓN SUBTERRÁNEO</div>
            <div style="font-size:12px; color:var(--grey1); font-family:var(--font-mono);">Capacidad: 150 personas · Exposición de Arte y Vinilos</div>
          </div>
          <div class="space-spec-card">
            <div style="font-size:16px; font-weight:900; color:var(--gold); margin-bottom:4px;">TERRAZA & CAFETÍN CULTURAL</div>
            <div style="font-size:12px; color:var(--grey1); font-family:var(--font-mono);">Vista al Centro Histórico · Catering & Acústica</div>
          </div>
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
    $('#btn-space-promote-venue').addEventListener('click', () => {
      showToast('📢 Campaña de alquiler del Teatro Nacional enviada a colectivos.');
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

  function renderEventCard(ev) {
    const inter = userInteractions[ev.id] || { is_favorite: 0, has_rsvp: 0 };
    const isPending = ev.status === 'pending';

    return `
      <div class="event-card" data-id="${ev.id}" tabindex="0" role="button">
        <div class="event-card-img-wrap" style="position:relative; height:150px;">
          <img class="event-card-img" src="${ev.image}" alt="${ev.title}">
          <span class="card-badge-cat">${ev.category || ev.badge || 'CULTURA'}</span>
          <span class="card-badge-price">${ev.price || 'Gratis'}</span>
          ${isPending ? `<span class="status-badge pending" style="position:absolute; top:36px; right:8px;">PENDIENTE</span>` : ''}
        </div>
        <div class="event-card-title" style="font-size:13px; font-weight:800;">${ev.title}</div>
        <div class="event-card-meta" style="font-size:11px;">${ev.date} · ${ev.venue}</div>

        <div class="event-card-actions">
          <button class="btn-card-action" data-action="edit" data-id="${ev.id}" title="Modificar Evento" style="color:var(--gold); font-weight:900; display:inline-flex; align-items:center; gap:4px;">
            ${ICONS.edit} Editar
          </button>
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
          openAuthModal();
          return;
        }

        if (act === 'add-cart') {
          const title = btn.dataset.title;
          const price = parseInt(btn.dataset.price.replace('$', '')) || 12;
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
          showToast('Error al conectar con SQLite');
        }
      });
    });

    $$('.event-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-card-action')) {
          const eventId = card.dataset.id;
          openEventDetailModal(eventId);
        }
      });
    });
  }

  function openEventDetailModal(eventId) {
    const ev = apiEvents.find(e => e.id === eventId) || apiEvents[0];
    if (!ev) return;

    activeDetailEvent = ev;
    const inter = userInteractions[ev.id] || { is_favorite: 0, has_rsvp: 0 };
    const detailBox = $('#modal-event-detail-box');
    if (!detailBox) return;

    detailBox.innerHTML = `
      <!-- Banner Hero del Evento -->
      <div class="event-detail-hero">
        <img class="event-detail-hero-img" src="${ev.image}" alt="${ev.title}">
        <div class="event-detail-hero-overlay">
          <div style="display:flex; gap:10px; align-items:center;">
            <span class="hero-badge" style="font-size:11px; background:var(--accent); color:#000;">${ev.badge || 'ESTRENO EXCLUSIVO'}</span>
            <span style="background:rgba(0,0,0,0.7); font-family:var(--font-mono); font-size:11px; font-weight:800; padding:4px 10px; border-radius:12px; border:1px solid var(--gold); color:var(--gold);">
              ${ev.category.toUpperCase()}
            </span>
          </div>
          <h1 style="font-size:36px; font-weight:900; text-shadow:0 4px 12px rgba(0,0,0,0.8);">${ev.title}</h1>
          <p style="color:var(--grey1); font-size:15px; max-width:650px;">${ev.full_title || ev.description}</p>
        </div>
        <button class="modal-close" id="modal-detail-close" style="position:absolute; top:16px; right:16px; background:rgba(0,0,0,0.6); width:36px; height:36px; border-radius:50%; border:1px solid var(--border); color:#fff; display:flex; align-items:center; justify-content:center;">×</button>
      </div>

      <!-- Ficha Técnica & Contenido -->
      <div class="event-detail-grid">
        <div>
          <h2 style="font-size:20px; font-weight:900; margin-bottom:12px;">ACERCA DEL ESPECTÁCULO</h2>
          <p style="color:#ddd; line-height:1.7; font-size:14px; margin-bottom:20px;">
            ${ev.description || 'Presentación especial en la agenda multicultural de Quito. Disfruta de un espectáculo de alta calidad artística con el respaldo técnico y la producción del recinto.'}
          </p>

          <div class="event-meta-row">
            <div class="event-meta-pill">
              📅 <span>FECHA: <strong>${ev.date}</strong></span>
            </div>
            <div class="event-meta-pill">
              ⏰ <span>INICIO: <strong>${ev.time} (Puertas 19:30)</strong></span>
            </div>
            <div class="event-meta-pill">
              📍 <span>LUGAR: <strong>${ev.venue}</strong></span>
            </div>
            <div class="event-meta-pill">
              👥 <span>AFORO: <strong>250 Personas</strong></span>
            </div>
          </div>

          <h3 style="font-size:16px; font-weight:900; margin:24px 0 12px; color:var(--accent); font-family:var(--font-mono);">
            ELENCO & ARTISTAS DESTACADOS
          </h3>
          <div style="background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; align-items:center; gap:16px;">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--accent);" alt="Artista">
            <div>
              <div style="font-weight:900; font-size:14px;">Mateo & La Banda (Colectivo Invitado)</div>
              <div style="font-size:12px; color:var(--grey1); font-family:var(--font-mono);">Elenco Principal · Jazz & Artes Escénicas</div>
            </div>
          </div>
        </div>

        <!-- Panel de Compra & Boletería -->
        <div style="background:var(--surface2); border:1px solid var(--border); border-radius:16px; padding:24px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--gold); font-weight:800; margin-bottom:8px;">
              BOLETERÍA EN VIVO EN QUITO
            </div>
            <div style="font-size:32px; font-weight:900; color:var(--accent); font-family:var(--font-mono); margin-bottom:16px;">
              ${ev.price}
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              <button class="btn-primary" id="btn-detail-edit-event" style="padding:14px; font-size:13px; font-family:var(--font-mono); font-weight:900; background:var(--gold); color:#000; display:flex; align-items:center; justify-content:center; gap:8px;">
                ${ICONS.edit} ✏️ MODIFICAR / EDITAR ESTE EVENTO
              </button>

              <button class="btn-primary" id="btn-detail-add-cart" style="padding:14px; font-size:13px; font-weight:900; font-family:var(--font-mono); width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:var(--surface3); color:#fff; border:1px solid var(--border);">
                ${ICONS.cart} AGREGAR ENTRADA AL CARRITO
              </button>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <button class="btn-secondary ${inter.is_favorite ? 'fav-active' : ''}" id="btn-detail-fav" style="padding:10px; font-size:11px; font-family:var(--font-mono); font-weight:800; display:flex; align-items:center; justify-content:center; gap:6px;">
                  ${inter.is_favorite ? ICONS.heartFill : ICONS.heart} FAVORITO
                </button>
                <button class="btn-secondary ${inter.has_rsvp ? 'active' : ''}" id="btn-detail-rsvp" style="padding:10px; font-size:11px; font-family:var(--font-mono); font-weight:800; display:flex; align-items:center; justify-content:center; gap:6px;">
                  ${inter.has_rsvp ? ICONS.check : ICONS.user} ASISTIRÉ
                </button>
              </div>
            </div>
          </div>

          <div style="border-top:1px solid var(--border); padding-top:16px; font-size:11px; color:var(--grey1); font-family:var(--font-mono);">
            🔒 Compra protegida por KAWSAY Quito Cultural. Entradas digitales en Tu Biblioteca.
          </div>
        </div>
      </div>
    `;

    $('#modal-detail-close').addEventListener('click', closeEventDetailModal);
    $('#btn-detail-add-cart').addEventListener('click', () => {
      const price = parseInt(ev.price.replace('$', '')) || 15;
      addToCart(ev.title, price);
      closeEventDetailModal();
    });

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

    $('#modal-event-detail').classList.add('open');
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

    $('#modal-create').classList.add('open');
  }

  function closeEventDetailModal() { $('#modal-event-detail').classList.remove('open'); }

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
    view.innerHTML = `
      <div class="join-header">
        <h1 class="join-header-title">Plataforma Cultural KAWSAY</h1>
        <p class="join-header-desc">
          Explora la versión pública antes de iniciar sesión o ingresa con los perfiles clave de la ciudad.
        </p>
      </div>

      <div class="join-options-grid">
        <div class="join-card" id="card-join-artist">
          <div class="join-card-icon" style="color:var(--accent);">${ICONS.artist}</div>
          <h2 class="join-card-title">Perfil Artista / Colectivo</h2>
          <p class="join-card-desc">
            Regístrate como creador. Publica tus conciertos, obras de teatro o exposiciones y solicita fechas en los espacios culturales de Quito.
          </p>
          <button class="btn-join-action" id="btn-open-join-artist">REGISTRAR MI PERFIL DE ARTISTA →</button>
        </div>

        <div class="join-card" id="card-join-space">
          <div class="join-card-icon" style="color:var(--gold);">${ICONS.landmark}</div>
          <h2 class="join-card-title">Perfil Espacio Cultural</h2>
          <p class="join-card-desc">
            Registra tu galería, teatro, club de música o centro cultural. Alquila tus instalaciones y gestiona tu cartelera en SQLite.
          </p>
          <button class="btn-join-action" id="btn-open-join-space">REGISTRAR MI ESPACIO CULTURAL →</button>
        </div>
      </div>
    `;

    $('#btn-open-join-artist').addEventListener('click', () => {
      if (currentUser.role === 'invitado') openAuthModal();
      else openArtistFormModal();
    });
    $('#btn-open-join-space').addEventListener('click', () => {
      if (currentUser.role === 'invitado') openAuthModal();
      else openSpaceFormModal();
    });
  }

  function renderWeekView() {
    const view = document.getElementById('view-calendar-week');
    view.innerHTML = `
      <div class="calendar-header-bar" style="padding:24px 32px 12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 class="calendar-view-title" style="font-size:26px; font-weight:900;">OCTUBRE 2026 — AGENDA SEMANAL</h2>
          <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono);">SEMANA DE EVENTOS ACTIVOS EN QUITO</p>
        </div>
      </div>
      <div style="padding: 12px 32px 32px;" id="week-grid-container"></div>
    `;
    buildWeekGrid();
  }

  function buildWeekGrid() {
    const container = document.getElementById('week-grid-container');
    if (!container) return;

    const days = [
      { name: 'LUNES 26', date: '2026-10-26' },
      { name: 'MARTES 27', date: '2026-10-27' },
      { name: 'MIÉRCOLES 28', date: '2026-10-28' },
      { name: 'JUEVES 29', date: '2026-10-29' },
      { name: 'VIERNES 30', date: '2026-10-30' },
      { name: 'SÁBADO 31', date: '2026-10-31' },
      { name: 'DOMINGO 01', date: '2026-11-01' }
    ];

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:12px; margin-top:10px;">
        ${days.map(day => {
          const dayEvents = apiEvents.filter(e => e.date && e.date.includes(day.date.substring(5)));
          return `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px; min-height:350px;">
              <div style="font-family:var(--font-mono); font-weight:900; font-size:13px; color:var(--accent); border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:12px;">
                ${day.name}
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${dayEvents.length > 0 ? dayEvents.map(e => `
                  <div class="event-card" data-id="${e.id}" style="background:var(--surface2); padding:10px; border-radius:8px; border:1px solid var(--border); cursor:pointer;">
                    <div style="font-size:10px; color:var(--gold); font-weight:800; font-family:var(--font-mono);">${e.time} · ${e.category}</div>
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
    view.innerHTML = `
      <div style="padding:24px 32px 12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 class="calendar-view-title" style="font-size:26px; font-weight:900;">CALENDARIO MENSUAL — OCTUBRE 2026</h2>
          <p style="color:var(--grey1); font-size:14px; font-family:var(--font-mono);">MATRIZ COMPLETA DE EVENTOS CULTURALES EN SQLITE</p>
        </div>
      </div>
      <div class="month-view-layout" style="display:grid; grid-template-columns: 1fr 340px; gap:24px; padding:12px 32px 32px;">
        <div id="month-grid-wrap"></div>
        <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;">
          <h3 style="font-size:16px; font-weight:900; margin-bottom:16px; font-family:var(--font-mono); color:var(--accent); display:flex; align-items:center; gap:8px;">
            ${ICONS.calendar} PRÓXIMOS EVENTOS
          </h3>
          <div id="upcoming-list" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>
      </div>
    `;
    buildMonthGrid();
    buildUpcomingList();
  }

  function buildMonthGrid() {
    const wrap = document.getElementById('month-grid-wrap');
    if (!wrap) return;

    const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const totalDays = 31;
    const startDayOffset = 4;

    let html = `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;">
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:8px; text-align:center; font-family:var(--font-mono); font-size:12px; font-weight:800; color:var(--grey1); margin-bottom:12px;">
          ${daysOfWeek.map(d => `<div>${d}</div>`).join('')}
        </div>
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:8px;">
    `;

    for (let i = 0; i < startDayOffset; i++) {
      html += `<div style="min-height:90px; background:transparent;"></div>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = apiEvents.filter(e => e.date && e.date.includes(`10-${day < 10 ? '0' + day : day}`));
      const isToday = (day === 26);

      html += `
        <div style="min-height:95px; background:${isToday ? 'var(--surface3)' : 'var(--surface2)'}; border:${isToday ? '2px solid var(--accent)' : '1px solid var(--border)'}; border-radius:8px; padding:8px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:var(--font-mono); font-weight:900; font-size:13px; color:${isToday ? 'var(--accent)' : 'var(--white)'};">
            ${day} ${isToday ? '• HOY' : ''}
          </div>
          <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
            ${dayEvents.slice(0, 2).map(e => `
              <div class="month-event-pill" data-id="${e.id}" style="background:var(--bg); color:var(--accent); font-size:10px; font-weight:800; padding:3px 6px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer;">
                ${e.title}
              </div>
            `).join('')}
            ${dayEvents.length > 2 ? `<span style="font-size:9px; color:var(--gold); font-weight:800;">+${dayEvents.length - 2} más</span>` : ''}
          </div>
        </div>
      `;
    }

    html += `</div></div>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('.month-event-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        openEventDetailModal(pill.dataset.id);
      });
    });
  }

  function buildUpcomingList() {
    const list = document.getElementById('upcoming-list');
    if (!list) return;

    list.innerHTML = apiEvents.slice(0, 6).map(ev => `
      <div class="upcoming-event-card" data-id="${ev.id}" style="background:var(--surface2); padding:12px; border-radius:8px; border:1px solid var(--border); cursor:pointer;">
        <div style="font-size:11px; font-weight:800; color:var(--accent); font-family:var(--font-mono);">${ev.date} · ${ev.time}</div>
        <div style="font-size:13px; font-weight:900; margin:4px 0;">${ev.title}</div>
        <div style="font-size:11px; color:var(--grey1);">${ev.venue} (${ev.category})</div>
      </div>
    `).join('');

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
      <!-- Modal Auth Real (Login / Registro) -->
      <div class="modal-overlay" id="modal-auth">
        <div class="cart-modal-box" style="max-width:440px; background:#0f172a; border:1px solid #334155; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
          <div class="modal-header" style="border-bottom:1px solid #1e293b; padding-bottom:12px;">
            <div class="modal-title" style="font-size:18px; font-weight:900; color:#ffffff; display:flex; align-items:center; gap:8px;">
              ${ICONS.lock} ACCESO A LA PLATAFORMA
            </div>
            <button class="modal-close" id="modal-auth-close" style="color:#94a3b8;">×</button>
          </div>
          
          <!-- Pestañas Auth -->
          <div style="display:flex; gap:10px; margin: 18px 0 22px;">
            <button id="tab-btn-login" class="tab-btn active" style="flex:1; padding:10px; font-size:13px; font-weight:900; border-radius:6px; cursor:pointer; background:#ffffff; color:#000000; border:none; letter-spacing:0.5px;">
              INICIAR SESIÓN
            </button>
            <button id="tab-btn-register" class="tab-btn" style="flex:1; padding:10px; font-size:13px; font-weight:700; border-radius:6px; cursor:pointer; background:rgba(255,255,255,0.08); color:#cbd5e1; border:1px solid rgba(255,255,255,0.15);">
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
            <button type="submit" class="btn-submit" style="background:var(--primary); color:#000000; font-weight:900; padding:14px; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-top:8px; letter-spacing:0.5px; text-transform:uppercase;">
              ENTRAR A MI CUENTA
            </button>
          </form>

          <!-- Formulario 2: Crear Cuenta -->
          <form id="form-auth-register" style="display:none; flex-direction:column; gap:16px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">NOMBRE COMPLETO / ORGANIZACIÓN</label>
              <input type="text" id="reg-name" required placeholder="Ej. Carlos Andrade" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">CORREO ELECTRÓNICO</label>
              <input type="email" id="reg-email" required placeholder="tuemail@ejemplo.com" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">CONTRASEÑA</label>
              <input type="password" id="reg-password" required placeholder="••••••••" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:800; margin-bottom:8px; color:#ffffff; letter-spacing:0.5px;">TIPO DE PERFIL EN KAWSAY</label>
              <select id="reg-role" style="width:100%; padding:12px 14px; background:#1e293b; border:1px solid #334155; color:#ffffff; border-radius:6px; font-size:14px; font-weight:500; outline:none;">
                <option value="espectador">Espectador / Cliente (Comprar entradas, favoritos)</option>
                <option value="artista">Artista / Colectivo (Publicar propuestas artísticas)</option>
                <option value="espacio">Espacio Cultural / Gestor (Gestión de cartelera y salas)</option>
                <option value="admin">Administrador (Gestión total de la plataforma)</option>
              </select>
            </div>
            <button type="submit" class="btn-submit" style="background:var(--primary); color:#000000; font-weight:900; padding:14px; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-top:8px; letter-spacing:0.5px; text-transform:uppercase;">
              REGISTRAR MI PERFIL
            </button>
          </form>
        </div>
      </div>

      <!-- Modal Detalle Completo del Evento (Showcase) -->
      <div class="modal-overlay" id="modal-event-detail">
        <div class="event-detail-modal-box" id="modal-event-detail-box"></div>
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
                🚀 PUBLICAR CARTELERA EN VIVO EN SQLITE DB
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
            </div>

          </div>
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
        tabLogin.style.background = '#ffffff'; tabLogin.style.color = '#000000'; tabLogin.style.fontWeight = '900'; tabLogin.style.border = 'none';
        tabReg.style.background = 'rgba(255,255,255,0.08)'; tabReg.style.color = '#cbd5e1'; tabReg.style.fontWeight = '700'; tabReg.style.border = '1px solid rgba(255,255,255,0.15)';
        formLogin.style.display = 'flex';
        formReg.style.display = 'none';
        authAlert.style.display = 'none';
      });

      tabReg.addEventListener('click', () => {
        tabReg.style.background = '#ffffff'; tabReg.style.color = '#000000'; tabReg.style.fontWeight = '900'; tabReg.style.border = 'none';
        tabLogin.style.background = 'rgba(255,255,255,0.08)'; tabLogin.style.color = '#cbd5e1'; tabLogin.style.fontWeight = '700'; tabLogin.style.border = '1px solid rgba(255,255,255,0.15)';
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
          renderHomeView();
        } catch (err) {
          showAuthAlert('Error de conexión con el servidor. Revisa tu conexión.');
        }
      });
    }

    // Submit Formulario Registro
    if (formReg) {
      formReg.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = $('#reg-name').value.trim();
        const email = $('#reg-email').value.trim();
        const password = $('#reg-password').value;
        const role = $('#reg-role').value;

        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
          });
          const data = await res.json();
          if (!res.ok) {
            showAuthAlert(data.error || 'Error al registrar usuario');
            return;
          }

          currentUser = data.user;
          localStorage.setItem('kawsay_user', JSON.stringify(currentUser));
          await loadUserInteractions();
          showToast(`¡Cuenta creada exitosamente! Bienvenido/a ${currentUser.name}`);
          closeAuthModal();
          renderSidebar();
          renderTopbar();
          renderHomeView();
        } catch (err) {
          showAuthAlert('Error al conectar con el servidor.');
        }
      });
    }

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
    $('#create-event-form').addEventListener('submit', handleCreateEventSubmit);
    $('#modal-admin-close').addEventListener('click', closeAdminModal);
    $('#modal-tickets-close').addEventListener('click', closeTicketsModal);
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

  function openAuthModal() { $('#modal-auth').classList.add('open'); }
  function closeAuthModal() { $('#modal-auth').classList.remove('open'); }

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

    $('#modal-cart').classList.add('open');
  }

  function closeCartModal() { $('#modal-cart').classList.remove('open'); }

  function openArtistFormModal() {
    if (currentUser.role === 'invitado') { openAuthModal(); return; }
    const name = prompt("Nombre de tu Artista / Colectivo:");
    if (name) showToast(`Perfil de Artista "${name}" registrado exitosamente.`);
  }

  async function openSpaceFormModal() {
    if (currentUser.role === 'invitado') { openAuthModal(); return; }
    const spaceName = prompt("Nombre de tu Espacio Cultural en Quito:");
    const spaceType = prompt("Tipo (ej: Galería, Teatro, Club de Vinilos):") || "Espacio Cultural";
    if (spaceName) {
      try {
        const res = await fetch(`${API_BASE}/spaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: spaceName, type: spaceType, owner_id: currentUser.id })
        });
        if (res.ok) {
          showToast(`Espacio "${spaceName}" guardado en SQLite.`);
          await loadInitialData();
          renderSidebar();
          renderHomeView();
        }
      } catch (err) {
        showToast("Error al guardar el espacio.");
      }
    }
  }

  async function handleCreateEventSubmit(e) {
    e.preventDefault();

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
          ? `Cartelera "${eventData.title}" MODIFICADA con éxito en SQLite.`
          : (currentUser.role === 'admin'
            ? `Cartelera "${eventData.title}" publicada en vivo.`
            : `Cartelera "${eventData.title}" enviada. En revisión admin.`)
        );
        closeCreateModal();
        e.target.reset();
        editingEventId = null;
        await loadInitialData();
        renderTopbar();
        renderHomeView();
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
    $('#modal-admin').classList.add('open');
  }

  async function setEventStatus(eventId, status) {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(status === 'approved' ? 'Evento APROBADO en SQLite.' : 'Evento RECHAZADO.');
        await loadInitialData();
        renderTopbar();
        renderHomeView();
      }
    } catch (e) {
      showToast('Error al actualizar estado');
    }
  }

  function closeAdminModal() { $('#modal-admin').classList.remove('open'); }
  function openCreateModal() {
    editingEventId = null;
    $('#modal-create-title').textContent = `📜 GENERADOR DE CARTELERA PROFESIONAL (${currentUser.role.toUpperCase()})`;
    if ($('#btn-submit-billboard')) $('#btn-submit-billboard').textContent = '🚀 PUBLICAR CARTELERA EN VIVO EN SQLITE DB';
    $('#modal-create').classList.add('open');
  }
  function closeCreateModal() {
    editingEventId = null;
    $('#modal-create').classList.remove('open');
  }
  function openTicketsModal() { $('#modal-tickets').classList.add('open'); }
  function closeTicketsModal() { $('#modal-tickets').classList.remove('open'); }

  function navigate(view) {
    currentView = view;
    $$('.view').forEach(v => v.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));

    const viewEl = document.getElementById(`view-${view}`);
    if (viewEl) viewEl.classList.add('active');

    const navEl = $(`[data-view="${view}"]`);
    if (navEl) navEl.classList.add('active');

    if (view === 'calendar-week') buildWeekGrid();
    if (view === 'calendar-month') { buildMonthGrid(); buildUpcomingList(); }
    if (view === 'join') renderJoinView();

    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;
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

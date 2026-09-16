// ============================================================
// KAWSAY — Mock Data
// ============================================================

const KAWSAY_DATA = {

  featuredEvent: {
    id: 'fe-001',
    title: 'MOVIMIENTO\nURBANO: EL RITO',
    badge: 'DESTACADO DE LA SEMANA',
    description: 'Exploración visceral de la identidad a través de la danza contemporánea y percusión en vivo.',
    image: 'images/hero_banner.jpg',
    date: '2026-10-26',
    time: '20:00',
    venue: 'Teatro Nacional',
    category: 'Danza',
    soldOut: true,
    ticketUrl: '#'
  },

  weekEvents: [
    {
      id: 'ev-001',
      title: 'JAZZ EXPERI...',
      fullTitle: 'Jazz Experimental Quito',
      date: '26 OCT',
      venue: 'Club Subterr...',
      fullVenue: 'Club Subterráneo',
      image: 'images/event_jazz.jpg',
      category: 'Música',
      time: '21:00',
      price: '$12',
      soldOut: false
    },
    {
      id: 'ev-002',
      title: 'VOCES DEL BA...',
      fullTitle: 'Voces del Barrio',
      date: '28 OCT',
      venue: 'Centro La Paz',
      fullVenue: 'Centro Cultural La Paz',
      image: 'images/event_voices.jpg',
      category: 'Teatro',
      time: '19:30',
      price: 'Gratis',
      soldOut: false
    },
    {
      id: 'ev-003',
      title: 'CARNAVAL SO...',
      fullTitle: 'Carnaval Sonoro',
      date: '30 OCT',
      venue: 'Plaza Artes',
      fullVenue: 'Plaza de las Artes',
      image: 'images/event_carnival.jpg',
      category: 'Música',
      time: '18:00',
      price: '$8',
      soldOut: false
    },
    {
      id: 'ev-004',
      title: 'NEO-MURALIS...',
      fullTitle: 'Neo-Muralismo Urbano',
      date: '02 NOV',
      venue: 'Galería Sur',
      fullVenue: 'Galería Sur',
      image: 'images/event_mural.jpg',
      category: 'Artes',
      time: '16:00',
      price: 'Gratis',
      soldOut: false
    },
    {
      id: 'ev-005',
      title: 'RAÍCES CINE',
      fullTitle: 'Raíces — Ciclo de Cine',
      date: '05 NOV',
      venue: 'Sala K',
      fullVenue: 'Sala K • MUCAO',
      image: 'images/event_cinema.jpg',
      category: 'Cine',
      time: '20:30',
      price: '$5',
      soldOut: false
    },
    {
      id: 'ev-006',
      title: 'RETRATOS CA...',
      fullTitle: 'Retratos Callejeros',
      date: '10 NOV',
      venue: 'Bib. Nacional',
      fullVenue: 'Biblioteca Nacional',
      image: 'images/event_portraits.jpg',
      category: 'Foto',
      time: '11:00',
      price: 'Gratis',
      soldOut: false
    },
    {
      id: 'ev-007',
      title: 'FESTIVAL DE POESÍA URBANA',
      fullTitle: 'Festival de Poesía y Micrófono Abierto',
      date: '12 NOV',
      venue: 'Espacio Radar',
      fullVenue: 'Espacio Radar • La Ronda',
      image: 'images/event_portraits.jpg',
      category: 'Teatro',
      time: '17:00',
      price: 'Gratis',
      sector: 'Centro Histórico • La Ronda',
      capacity: 120,
      cast: 'Poetas Emergentes de Quito & Invitados',
      description: 'Recital libre para poetas emergentes del centro histórico de Quito. Espacio de micrófono abierto, lectura dramatizada y música acústica.',
      status: 'pending',
      soldOut: false
    }
  ],

  spaces: [
    {
      id: 'sp-001',
      name: 'NAVE 01',
      type: 'ESPACIO CULTURAL',
      image: 'images/space_nave01.jpg'
    },
    {
      id: 'sp-002',
      name: 'EL BÚNKER',
      type: 'CLUB DE VINILOS',
      image: 'images/space_bunker.jpg'
    },
    {
      id: 'sp-003',
      name: 'ESPACIO RADAR',
      type: 'GALERÍA & COWORK',
      image: 'images/space_radar.jpg'
    },
    {
      id: 'sp-004',
      name: 'TEATRO CENTRAL',
      type: 'ARTES ESCÉNICAS',
      image: 'images/space_teatro.jpg'
    },
    {
      id: 'sp-005',
      name: 'MUSEO URBANO',
      type: 'HISTORIA & ARTE',
      image: 'images/space_museo.jpg'
    },
    {
      id: 'sp-006',
      name: 'RADIO KAWSAY',
      type: 'MEDIA PARTNER',
      image: 'images/space_radio.jpg'
    }
  ],

  interests: [
    { id: 'int-001', name: 'MÚSICA', color: '#e5383b', icon: 'music', dark: false },
    { id: 'int-002', name: 'TEATRO', color: '#c6f135', icon: 'artist', dark: true },
    { id: 'int-003', name: 'DANZA', color: '#ffffff', icon: 'user', dark: true },
    { id: 'int-004', name: 'ARTES', color: '#f97316', icon: 'artist', dark: false },
    { id: 'int-005', name: 'CINE', color: '#06b6d4', icon: 'ticket', dark: false },
    { id: 'int-006', name: 'FOTO', color: '#a855f7', icon: 'star', dark: false }
  ],

  // ---- Calendar Week View Data ----
  weekCalendar: {
    month: 'OCTUBRE 2026',
    days: [
      { label: 'LUN', date: 21 },
      { label: 'MAR', date: 22 },
      { label: 'MIÉ', date: 23 },
      { label: 'JUE', date: 24 },
      { label: 'VIE', date: 25 },
      { label: 'SÁB', date: 26 },
      { label: 'DOM', date: 27 }
    ],
    hours: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'],
    events: [
      {
        id: 'wev-001',
        title: 'MOVIMIENTO URBANO',
        subtitle: 'Teatro Nacional',
        day: 5, // SAB = index 5
        startHour: 20,
        startMin: 0,
        endHour: 22,
        endMin: 0,
        type: 'soldout', // white card
        soldOut: true
      },
      {
        id: 'wev-002',
        title: 'JAZZ EXPERIMENTAL',
        subtitle: 'Club Subterráneo',
        day: 1, // MAR = index 1
        startHour: 21,
        startMin: 0,
        endHour: 23,
        endMin: 0,
        type: 'standard' // dark card
      },
      {
        id: 'wev-003',
        title: 'TALLER DE MURALISMO',
        subtitle: 'Espacio Radar',
        day: 3, // JUE = index 3
        startHour: 18,
        startMin: 0,
        endHour: 20,
        endMin: 0,
        type: 'accent' // lime card
      },
      {
        id: 'wev-004',
        title: 'VOCES DEL BARRIO',
        subtitle: 'Centro La Paz',
        day: 2, // MIÉ
        startHour: 19,
        startMin: 30,
        endHour: 21,
        endMin: 0,
        type: 'standard'
      }
    ]
  },

  // ---- Calendar Month View Data ----
  monthCalendar: {
    month: 'OCTUBRE 2026',
    year: 2026,
    monthIndex: 9, // 0-based October
    events: [
      { day: 7, label: 'JAZZ EXPERIMENTAL', type: 'label' },
      { day: 12, label: '2 EVENTOS', type: 'badge-red' },
      { day: 15, label: 'MOVIMIENTO URBANO', type: 'label', hasPhoto: true, photo: 'images/event_portraits.jpg' },
      { day: 19, label: 'CARNAVAL SONORO', type: 'label' },
      { day: 22, label: '3 EVENTOS', type: 'badge-red' },
      { day: 26, label: 'VOCES DEL BARRIO', type: 'label' },
      { day: 30, label: 'RAÍCES CINE', type: 'label' }
    ],
    upcomingEvents: [
      {
        id: 'ue-001',
        date: 'SAB 26',
        time: '20:00',
        title: 'Movimiento Urbano: El Rito',
        venue: 'Teatro Nacional',
        category: 'DANZA',
        accent: '#c6f135'
      },
      {
        id: 'ue-002',
        date: 'DOM 27',
        time: '19:00',
        title: 'Jazz Experimental Quito',
        venue: 'Club Subterráneo',
        category: 'MÚSICA',
        accent: '#e53935'
      },
      {
        id: 'ue-003',
        date: 'MIÉ 30',
        time: '18:00',
        title: 'Carnaval Sonoro',
        venue: 'Plaza de las Artes',
        category: 'MÚSICA',
        accent: '#e53935'
      },
      {
        id: 'ue-004',
        date: 'VIE 01 NOV',
        time: '16:00',
        title: 'Neo-Muralismo Urbano',
        venue: 'Galería Sur',
        category: 'ARTES',
        accent: '#888888'
      },
      {
        id: 'ue-005',
        date: 'MAR 05 NOV',
        time: '20:30',
        title: 'Raíces — Ciclo de Cine',
        venue: 'Sala K • MUCAO',
        category: 'CINE',
        accent: '#c6f135'
      }
    ]
  }
};

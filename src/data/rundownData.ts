// =====================================================================================
// DATA RUNDOWN RESMI: THE STATE OF CLAMOR
// Berdasarkan Desain Referensi Katedral Gothic Multi-Stage
// Tipografi: Cormorant Garamond (Serif Klasik) + Inter (Sans-Serif Data)
// 3 Panggung Paralel:
// 1. Tetra — Stage 1 (Amber / Emas Katedral · Lantai 1)
// 2. Tetra — Stage 2 (Crimson / Merah Bawah Tanah · Lantai 1)
// 3. Mizu — Stage (Cyan / Biru Mezanin · Lantai 2)
// =====================================================================================

export interface MasterTimelineNode {
  sessionNum: string;
  name: string;
  timeRange: string;
  isHeadliner?: boolean;
}

export interface StageCardAct {
  sessionNum: string;
  isHeadliner?: boolean;
  timeRange: string;
  title: string;
  subtitle: string;
  thumbUrl: string;
  status: 'LIVE' | 'TBA';
}

export interface StageColumnData {
  id: 'tetra-1' | 'tetra-2' | 'mizu';
  name: string;
  floorLabel: string;
  accentColor: string;
  bannerImg: string;
  acts: StageCardAct[];
}

export interface StageSidebarItem {
  id: 'tetra-1' | 'tetra-2' | 'mizu';
  name: string;
  floorLabel: string;
  dotColor: string;
  thumbUrl: string;
}

export const MASTER_TIMELINE_NODES: MasterTimelineNode[] = [
  {
    sessionNum: '01',
    name: 'REGISTRASI',
    timeRange: '20:00 — 21:30'
  },
  {
    sessionNum: '02',
    name: 'WARM-UP',
    timeRange: '21:30 — 22:30'
  },
  {
    sessionNum: '03',
    name: 'SECRET HEADLINER',
    timeRange: '22:30 — 00:30',
    isHeadliner: true
  },
  {
    sessionNum: '04',
    name: 'CLOSING',
    timeRange: '00:30 — 02:30'
  }
];

export const SIDEBAR_STAGES: StageSidebarItem[] = [
  {
    id: 'tetra-1',
    name: 'TETRA — STAGE 1',
    floorLabel: 'Tetra',
    dotColor: '#d4af37',
    thumbUrl: '/assets/day1_billboard_assembly.jpg'
  },
  {
    id: 'tetra-2',
    name: 'TETRA — STAGE 2',
    floorLabel: 'Tetra',
    dotColor: '#e63946',
    thumbUrl: '/assets/crimson_gothic_cathedral_hall.png'
  },
  {
    id: 'mizu',
    name: 'MIZU — STAGE',
    floorLabel: 'Mizu Commonroom',
    dotColor: '#38bdf8',
    thumbUrl: '/assets/gothic_cathedral_ritual_concert.png'
  }
];

export const GOTHIC_RUNDOWN_DATA: Record<'day-1' | 'day-2', StageColumnData[]> = {
  'day-1': [
    // --- TETRA — STAGE 1 (TETRA) ---
    {
      id: 'tetra-1',
      name: 'TETRA — STAGE 1',
      floorLabel: 'Tetra',
      accentColor: '#d4af37',
      bannerImg: '/assets/day1_billboard_assembly.jpg',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/doors_portal_open.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 22:30',
          title: 'WARM-UP',
          subtitle: 'Resident Live Brass',
          thumbUrl: '/assets/day1_billboard_assembly.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '22:30 — 00:30',
          title: 'SECRET HEADLINER',
          subtitle: '360° Main Concert',
          thumbUrl: '/assets/gothic_cathedral_ritual_concert.png',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '00:30 — 02:30',
          title: 'CLOSING',
          subtitle: 'Nocturnal Resonance',
          thumbUrl: '/assets/cathedral_passage_desktop.webp',
          status: 'TBA'
        }
      ]
    },

    // --- TETRA — STAGE 2 (TETRA) ---
    {
      id: 'tetra-2',
      name: 'TETRA — STAGE 2',
      floorLabel: 'Tetra',
      accentColor: '#e63946',
      bannerImg: '/assets/crimson_gothic_cathedral_hall.png',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/crimson_gothic_cathedral_hall.png',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 22:30',
          title: 'WARM-UP',
          subtitle: 'Rhythmic Sound Primer',
          thumbUrl: '/assets/dj_techno.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '22:30 — 00:30',
          title: 'SECRET HEADLINER',
          subtitle: 'Special Guest Performance',
          thumbUrl: '/assets/hero_monument.jpg',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '00:30 — 02:30',
          title: 'CLOSING',
          subtitle: 'Late Beats Closing',
          thumbUrl: '/assets/day2_billboard_vault.jpg',
          status: 'TBA'
        }
      ]
    },

    // --- MIZU — STAGE (MIZU COMMONROOM) ---
    {
      id: 'mizu',
      name: 'MIZU — STAGE',
      floorLabel: 'Mizu Commonroom',
      accentColor: '#38bdf8',
      bannerImg: '/assets/gothic_cathedral_ritual_concert.png',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/cathedral_passage_desktop.webp',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 22:30',
          title: 'WARM-UP',
          subtitle: 'Mezzanine Lounge Selector',
          thumbUrl: '/assets/guests_storytelling.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '22:30 — 00:30',
          title: 'SECRET HEADLINER',
          subtitle: 'Mizu Special Curator',
          thumbUrl: '/assets/hero_scroll_poster.jpg',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '00:30 — 02:30',
          title: 'CLOSING',
          subtitle: 'Late Lounge Wind Down',
          thumbUrl: '/assets/gothic_cathedral_ritual_concert.png',
          status: 'TBA'
        }
      ]
    }
  ],

  'day-2': [
    // --- TETRA — STAGE 1 (TETRA) ---
    {
      id: 'tetra-1',
      name: 'TETRA — STAGE 1',
      floorLabel: 'Tetra',
      accentColor: '#d4af37',
      bannerImg: '/assets/day2_billboard_vault.jpg',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/day2_billboard_vault.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 23:00',
          title: 'WARM-UP',
          subtitle: 'Continental Brass Live',
          thumbUrl: '/assets/day1_billboard_assembly.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '23:00 — 01:30',
          title: 'SECRET HEADLINER',
          subtitle: 'Cathedral Grand Takeover',
          thumbUrl: '/assets/gothic_cathedral_ritual_concert.png',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '01:30 — 03:00',
          title: 'CLOSING',
          subtitle: 'Monolithic Final Ceremony',
          thumbUrl: '/assets/cathedral_passage_desktop.webp',
          status: 'TBA'
        }
      ]
    },

    // --- TETRA — STAGE 2 (TETRA) ---
    {
      id: 'tetra-2',
      name: 'TETRA — STAGE 2',
      floorLabel: 'Tetra',
      accentColor: '#e63946',
      bannerImg: '/assets/crimson_gothic_cathedral_hall.png',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/crimson_gothic_cathedral_hall.png',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 23:00',
          title: 'WARM-UP',
          subtitle: 'Modular Sound Primer',
          thumbUrl: '/assets/dj_techno.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '23:00 — 01:30',
          title: 'SECRET HEADLINER',
          subtitle: 'Vault Industrial Takeover',
          thumbUrl: '/assets/hero_monument.jpg',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '01:30 — 03:00',
          title: 'CLOSING',
          subtitle: 'Subterranean Overdrive',
          thumbUrl: '/assets/day2_billboard_vault.jpg',
          status: 'TBA'
        }
      ]
    },

    // --- MIZU — STAGE (MIZU COMMONROOM) ---
    {
      id: 'mizu',
      name: 'MIZU — STAGE',
      floorLabel: 'Mizu Commonroom',
      accentColor: '#38bdf8',
      bannerImg: '/assets/gothic_cathedral_ritual_concert.png',
      acts: [
        {
          sessionNum: '01',
          timeRange: '20:00 — 21:30',
          title: 'REGISTRASI',
          subtitle: 'All Stages',
          thumbUrl: '/assets/cathedral_passage_desktop.webp',
          status: 'LIVE'
        },
        {
          sessionNum: '02',
          timeRange: '21:30 — 23:00',
          title: 'WARM-UP',
          subtitle: 'Commonroom Velvet Warm-Up',
          thumbUrl: '/assets/guests_storytelling.jpg',
          status: 'LIVE'
        },
        {
          sessionNum: '03',
          isHeadliner: true,
          timeRange: '23:00 — 01:30',
          title: 'SECRET HEADLINER',
          subtitle: 'Acoustic & Vocal Duo',
          thumbUrl: '/assets/hero_scroll_poster.jpg',
          status: 'TBA'
        },
        {
          sessionNum: '04',
          timeRange: '01:30 — 03:00',
          title: 'CLOSING',
          subtitle: 'Midnight Curfew & Farewell',
          thumbUrl: '/assets/gothic_cathedral_ritual_concert.png',
          status: 'TBA'
        }
      ]
    }
  ]
};

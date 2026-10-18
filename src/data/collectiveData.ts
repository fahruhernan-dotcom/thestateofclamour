export interface Collective {
  id: string;
  name: string;
  subtitle: string;
  logoUrl: string;
  role: string;
}

export const collectives: Collective[] = [
  {
    id: 'col-how',
    name: 'House of Witnesses',
    subtitle: 'Host & Lead Collective',
    logoUrl: '/assets/collectives/how.png',
    role: 'Lead Collective',
  },
  {
    id: 'col-superflame',
    name: 'Superflame',
    subtitle: 'Sound & Rave Collective',
    logoUrl: '/assets/collectives/superflame.png',
    role: 'Event Collective',
  },
  {
    id: 'col-headroom',
    name: 'Headroom',
    subtitle: 'Nocturnal Music Collective',
    logoUrl: '/assets/collectives/headroom.png',
    role: 'Event Collective',
  },
  {
    id: 'col-syncsation',
    name: 'Syncsation',
    subtitle: 'Electronic Music Syndicate',
    logoUrl: '/assets/collectives/syncsation.png',
    role: 'Event Collective',
  },
  {
    id: 'col-tension',
    name: 'Tension',
    subtitle: 'Underground Sound Movement',
    logoUrl: '/assets/collectives/tension.png',
    role: 'Event Collective',
  },
];

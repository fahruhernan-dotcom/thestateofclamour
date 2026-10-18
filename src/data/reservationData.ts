// Configuration and Data for Party Reservations & Floor Plan
// The State of Clamor: Swear in Continental (30–31 October 2026)

export interface ReservationPackage {
  id: string;
  name: string;
  tagline: string;
  capacityText: string;
  minSpendDay1: number;
  minSpendDay2: number;
  formattedMinSpendDay1: string;
  formattedMinSpendDay2: string;
  inclusions: string[];
  zoneCode: string;
  zoneName: string;
  badgeLabel?: string;
  isPopular?: boolean;
}

export interface VenueZone {
  id: string;
  code: string;
  name: string;
  category: 'stage' | 'vip' | 'general' | 'bar' | 'facility';
  capacity: string;
  soundProfile: string;
  description: string;
  facilities: string[];
  associatedPackageId?: string;
}

// ---------------------------------------------------------------------------
// DUAL WHATSAPP ADMIN CONFIGURATION
// Ganti nomor di bawah ini dengan nomor WhatsApp resmi masing-masing admin (format 628...)
// ---------------------------------------------------------------------------
export const ADMIN_DAY1 = {
  phone: '62881080020231', // Admin Day 1 (Jumat, 30 Okt 2026)
  name: 'ADMIN RSVP DAY 1',
  displayPhone: '+62 881-0800-20231',
  dateLabel: 'Jumat, 30 Oktober 2026',
  headliner: 'Secret Headliner (TBA)'
};

export const ADMIN_DAY2 = {
  phone: '62881080020332', // Admin Day 2 (Sabtu, 31 Okt 2026)
  name: 'ADMIN RSVP DAY 2',
  displayPhone: '+62 881-0800-20332',
  dateLabel: 'Sabtu, 31 Oktober 2026',
  headliner: 'Secret Headliner (TBA)'
};

// ---------------------------------------------------------------------------
// RESERVATION PACKAGES
// ---------------------------------------------------------------------------
export const reservationPackages: ReservationPackage[] = [
  {
    id: 'pkg-vvip-royal',
    name: 'VVIP ROYAL CENTER SOFA',
    tagline: 'Singgasana termewah tepat di garis tengah panggung utama',
    capacityText: '8 – 10 Hadirin',
    minSpendDay1: 5000000,
    minSpendDay2: 6000000,
    formattedMinSpendDay1: 'Rp 5.000.000',
    formattedMinSpendDay2: 'Rp 6.000.000',
    inclusions: [
      'Kapasitas Meja: 8 PAX',
      '4 Tiket Masuk Komplimen (Gelang Resmi)',
      'Booking Fee Meja: Rp 500.000',
      'Minimum Charge F&B Diselesaikan di Venue'
    ],
    zoneCode: 'ZONE A',
    zoneName: 'Center Pit Depan Panggung',
    badgeLabel: 'VVIP PIT',
    isPopular: true
  },
  {
    id: 'pkg-vip-mezzanine',
    name: 'VIP MEZZANINE BALCONY SOFA',
    tagline: 'Kenyamanan sofa balkon elevasi atas',
    capacityText: '6 Hadirin',
    minSpendDay1: 5500000,
    minSpendDay2: 5500000,
    formattedMinSpendDay1: 'Rp 5.500.000',
    formattedMinSpendDay2: 'Rp 5.500.000',
    inclusions: [
      'Kapasitas Meja: 6 PAX',
      '3 Tiket Masuk Komplimen (Gelang Resmi)',
      'Booking Fee Meja: Rp 500.000',
      'Minimum Charge F&B Diselesaikan di Venue'
    ],
    zoneCode: 'ZONE B',
    zoneName: 'Mezzanine Balcony Atas',
    badgeLabel: 'MEZZANINE'
  },
  {
    id: 'pkg-vip-side',
    name: 'VIP TABLE SOFA (MIZU & TETRA)',
    tagline: 'Sofa VIP eksklusif area panggung & lounge',
    capacityText: '6 Hadirin',
    minSpendDay1: 4000000,
    minSpendDay2: 4000000,
    formattedMinSpendDay1: 'Rp 4.000.000',
    formattedMinSpendDay2: 'Rp 4.000.000',
    inclusions: [
      'Kapasitas Meja: 4 – 6 PAX',
      '2 – 3 Tiket Masuk Komplimen (Gelang Resmi)',
      'Booking Fee Meja: Rp 300.000 – Rp 400.000',
      'Minimum Charge F&B Diselesaikan di Venue'
    ],
    zoneCode: 'ZONE C',
    zoneName: 'Area Sofa VIP',
    badgeLabel: 'TABLE SOFA'
  },
  {
    id: 'pkg-high-cocktail',
    name: 'TABLE / SMALL TABLE',
    tagline: 'Meja santai festival 4 pax',
    capacityText: '4 Hadirin',
    minSpendDay1: 2000000,
    minSpendDay2: 2500000,
    formattedMinSpendDay1: 'Rp 2.000.000 – Rp 2.500.000',
    formattedMinSpendDay2: 'Rp 2.000.000 – Rp 2.500.000',
    inclusions: [
      'Kapasitas Meja: 4 PAX',
      '2 Tiket Masuk Komplimen (Gelang Resmi)',
      'Booking Fee Meja: Rp 200.000 – Rp 250.000',
      'Minimum Charge F&B Diselesaikan di Venue'
    ],
    zoneCode: 'ZONE D',
    zoneName: 'Assembly Table',
    badgeLabel: 'TABLE 4 PAX'
  },
  {
    id: 'pkg-bar-standing',
    name: 'SMALL TABLE (TETRA)',
    tagline: 'Meja festival intim 4 pax area Tetra',
    capacityText: '4 Hadirin',
    minSpendDay1: 1500000,
    minSpendDay2: 1500000,
    formattedMinSpendDay1: 'Rp 1.500.000',
    formattedMinSpendDay2: 'Rp 1.500.000',
    inclusions: [
      'Kapasitas Meja: 4 PAX',
      '2 Tiket Masuk Komplimen (Gelang Resmi)',
      'Booking Fee Meja: Rp 200.000',
      'Minimum Charge F&B Diselesaikan di Venue'
    ],
    zoneCode: 'ZONE E',
    zoneName: 'Tetra Small Table',
    badgeLabel: 'COCKTAIL LOVER'
  }
];

// ---------------------------------------------------------------------------
// VENUE ZONES SPECIFICATIONS (DENAH MIZU COMMONROOM)
// ---------------------------------------------------------------------------
export const venueZones: VenueZone[] = [
  {
    id: 'zone-stage',
    code: 'STAGE 01',
    name: 'THE MAIN STAGE & DJ SANCTUM',
    category: 'stage',
    capacity: 'Area Utama Pertunjukan',
    soundProfile: 'Line-Array 360° · Sub-bass High Resonance',
    description: 'Pusat monumen pertunjukan dengan instalasi portal merah, pencahayaan arsitektural sinematik, dan panggung penampilan utama Secret Headliner (TBA).',
    facilities: [
      'Sistem tata suara kustom berkekuatan tinggi',
      'Instalasi visual LED monolitik & lighting portal',
      'Jalur direct access ke backstage & ruang kendali FOH'
    ]
  },
  {
    id: 'zone-vvip',
    code: 'ZONE A',
    name: 'VVIP ROYAL CENTER PIT',
    category: 'vip',
    capacity: '4 Unit Sofa (Maks 40 Hadirin)',
    soundProfile: 'Optimal Acoustic Center Field',
    description: 'Sofa utama di area tengah yang menghadap langsung ke panggung.',
    facilities: [
      'Sofa nyaman dengan meja luas',
      'Pendampingan staf venue ke area meja',
      'Paket minuman sesuai ketentuan reservasi'
    ],
    associatedPackageId: 'pkg-vvip-royal'
  },
  {
    id: 'zone-mezzanine',
    code: 'ZONE B',
    name: 'VIP MEZZANINE BALCONY',
    category: 'vip',
    capacity: '6 Unit Sofa (Maks 48 Hadirin)',
    soundProfile: 'Elevated High-Definition Audio',
    description: 'Balkon bertingkat 4 meter di atas lantai dansa dengan sudut pandang mata burung ke panggung dan seluruh keriuhan aula.',
    facilities: [
      'Sudut pandang panorama luas dari ketinggian',
      'Bar khusus Mezzanine tanpa antrean',
      'Koneksi tangga langsung ke area dansa utama'
    ],
    associatedPackageId: 'pkg-vip-mezzanine'
  },
  {
    id: 'zone-side-lounge',
    code: 'ZONE C',
    name: 'VIP SIDE STAGE LOUNGE',
    category: 'vip',
    capacity: '4 Unit Sofa (Maks 32 Hadirin)',
    soundProfile: 'Intense Proximity Energy',
    description: 'Sayap panggung kiri dan kanan yang menyuguhkan kedekatan maksimal dengan aksi panggung para penampil.',
    facilities: [
      'Akses cepat ke lorong panggung',
      'Layanan botol eksklusif & es segar terus-menerus',
      'Suasana privat namun tetap berdenyut kencang'
    ],
    associatedPackageId: 'pkg-vip-side'
  },
  {
    id: 'zone-cocktail',
    code: 'ZONE D',
    name: 'COCKTAIL HIGH TABLES',
    category: 'vip',
    capacity: '12 Meja Tinggi (Maks 48 Hadirin)',
    soundProfile: 'Dynamic Dance Floor Surround',
    description: 'Area meja berdiri di sekeliling lantai dansa untuk hadirin yang ingin menikmati minuman sambil berbaur dan berdansa.',
    facilities: [
      'Meja bulat tinggi tahan tumpahan',
      'Ember es & gelas kristal siap pakai',
      'Akses fleksibel keluar-masuk lantai dansa'
    ],
    associatedPackageId: 'pkg-high-cocktail'
  },
  {
    id: 'zone-dancefloor',
    code: 'GA ZONE',
    name: 'GENERAL DANCEFLOOR / THE VOID',
    category: 'general',
    capacity: '1.500+ Hadirin',
    soundProfile: 'Maximum Body Vibration & Mosh Resonance',
    description: 'Lantai dansa terbuka tanpa sekat untuk para pemegang tiket festival. Rasakan gelombang frekuensi bass langsung ke seluruh tubuh.',
    facilities: [
      'Lantai antiselip bertaraf konser profesional',
      'Sirkulasi pendingin udara 20°C terdistribusi merata',
      'Akses mudah ke titik hidrasi air minum gratis'
    ]
  },
  {
    id: 'zone-bar',
    code: 'BAR 01',
    name: 'CENTRAL MIXOLOGY BAR & BEER TAPS',
    category: 'bar',
    capacity: 'Layanan Cepat 360°',
    soundProfile: 'Ambient Acoustic Dip',
    description: 'Stasiun bar utama yang menyajikan racikan koktail khas malam Clamor, deretan draught beer dingin, dan minuman segar.',
    facilities: [
      'Sistem pembayaran cashless cepat (QRIS, Kartu)',
      'Bartender profesional berlisensi mixology',
      'Kursi bar santai untuk reservasi bar stool'
    ],
    associatedPackageId: 'pkg-bar-standing'
  },
  {
    id: 'zone-cloister',
    code: 'OUTDOOR',
    name: 'THE CLOISTER & SMOKING YARD',
    category: 'facility',
    capacity: 'Area Terbuka Luas',
    soundProfile: 'Natural Air & Low Ambience Sound',
    description: 'Pelataran terbuka beratap langit malam di luar aula konser. Tempat sempurna untuk rehat telinga, merokok/vaping, dan menikmati makanan.',
    facilities: [
      'Sirkulasi udara terbuka bebas dengan pencahayaan hangat',
      'Stan artisan coffee & tenant kuliner malam pilihan',
      'Bangku taman monolitik untuk bersantai'
    ]
  },
  {
    id: 'zone-medical',
    code: 'HEALTH',
    name: 'POS MEDIS & CALM SANCTUARY',
    category: 'facility',
    capacity: 'Tim Medis Siaga 24 Jam',
    soundProfile: 'Peredam Akustik Hening',
    description: 'Ruang perawatan medis darurat bersertifikat lengkap dengan peredam suara, oksigen, obat-obatan, dan earplugs gratis.',
    facilities: [
      'Dokter & paramedis bersertifikasi siaga penuh',
      'Earplugs gratis untuk perlindungan pendengaran',
      'Akses jalur evakuasi langsung ke ambulans siaga'
    ]
  },
  {
    id: 'zone-entrance',
    code: 'GATES',
    name: 'ENTRANCE GATE & WRISTBAND EXCHANGE',
    category: 'facility',
    capacity: '6 Jalur Pemeriksaan',
    soundProfile: 'Entrance Transit Hub',
    description: 'Pintu gerbang monumen utama tempat penukaran e-voucher tiket resmi Artatix menjadi gelang fisik resmi dan verifikasi identitas 18+.',
    facilities: [
      'Pemindai barcode kecepatan tinggi Artatix',
      'Jalur khusus VIP / Reservasi tanpa antre',
      'Loker penitipan barang berharga (Cloakroom)'
    ]
  }
];

// ---------------------------------------------------------------------------
// WHATSAPP URL & PREFILLED MESSAGE GENERATOR
// Membedakan Admin Day 1 vs Admin Day 2 secara mutlak
// ---------------------------------------------------------------------------
export interface BuildReservationWaParams {
  day: 'day-1' | 'day-2';
  packageId?: string;
  guestName?: string;
  guestCount?: number;
  customMessage?: string;
}

export function buildWhatsAppReservationUrl({
  day,
  packageId,
  guestName,
  guestCount,
  customMessage
}: BuildReservationWaParams): { url: string; adminName: string; adminPhone: string; message: string } {
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
  const pkg = packageId ? reservationPackages.find(p => p.id === packageId) : undefined;
  
  const minSpend = pkg 
    ? (day === 'day-1' ? pkg.formattedMinSpendDay1 : pkg.formattedMinSpendDay2)
    : '-';

  const dayLabel = day === 'day-1' ? 'DAY 1 (Jumat, 30 Okt 2026 - Swear in Continental)' : 'DAY 2 (Sabtu, 31 Okt 2026 - Swear in Continental)';
  const eventTheme = 'SWEAR IN CONTINENTAL';

  let message = `Halo ${admin.name},\n`;
  message += `Saya tertarik untuk melakukan reservasi meja/sofa di acara *THE STATE OF CLAMOR: ${eventTheme}*.\n\n`;
  message += `*DETAIL PERMINTAAN RESERVASI:*\n`;
  message += `- *Jadwal Acara:* ${dayLabel}\n`;
  
  if (pkg) {
    message += `- *Pilihan Paket:* ${pkg.name} (${pkg.zoneCode})\n`;
    message += `- *Minimum Spend:* ${minSpend}\n`;
    message += `- *Kapasitas Paket:* ${pkg.capacityText}\n`;
  } else {
    message += `- *Pilihan Paket:* Informasi Umum Meja/Sofa\n`;
  }

  if (guestName && guestName.trim().length > 0) {
    message += `- *Nama Pemesan:* ${guestName.trim()}\n`;
  }

  if (guestCount && guestCount > 0) {
    message += `- *Perkiraan Hadirin:* ${guestCount} Orang\n`;
  }

  if (customMessage && customMessage.trim().length > 0) {
    message += `- *Catatan Khusus:* ${customMessage.trim()}\n`;
  }

  message += `\nMohon info ketersediaan nomor meja dan tata cara reservasinya. Terima kasih!`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${admin.phone}?text=${encoded}`;

  return {
    url,
    adminName: admin.name,
    adminPhone: admin.displayPhone,
    message
  };
}

export function buildAdminGeneralInquiryUrl(day: 'day-1' | 'day-2') {
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
  const eventTheme = 'Swear in Continental';
  const message = `Halo ${admin.name}, saya ingin konsultasi mengenai tiket & reservasi meja untuk acara The State of Clamor: ${eventTheme} (${admin.dateLabel}). Mohon informasinya. Terima kasih!`;
  const url = `https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`;
  return {
    url,
    admin,
    message
  };
}


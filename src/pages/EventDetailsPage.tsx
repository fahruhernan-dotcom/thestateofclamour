import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, MapPin, Clock, Calendar, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { Artist, TicketTier } from '../types';

interface Props {
  artists: Artist[];
  tickets: TicketTier[];
  initialTab?: 'protocols' | 'architecture' | 'timetable' | 'guide';
  onBack: () => void;
  onGetTickets: () => void;
}

export const EventDetailsPage: React.FC<Props> = ({
  artists,
  tickets,
  initialTab = 'timetable',
  onBack,
  onGetTickets,
}) => {
  const [activeTab, setActiveTab] = useState<'protocols' | 'architecture' | 'timetable' | 'guide'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  return (
    <main className="event-dossier-page">
      {/* Event Detail Top Navigation */}
      <nav className="dossier-top-bar" aria-label="Navigasi detail event">
        <button
          type="button"
          onClick={onBack}
          className="dossier-back-btn btn-press"
        >
          <ArrowLeft size={16} />
          <span>KEMBALI KE BERANDA</span>
        </button>

        <div className="dossier-doc-stamp">
          <span>DOKUMEN RESMI // DETAIL EVENT</span>
        </div>

        <button
          type="button"
          onClick={onGetTickets}
          className="dossier-ticket-quick-btn btn-press"
        >
          <span>BELI TIKET</span>
          <ChevronRight size={15} />
        </button>
      </nav>

      {/* Monumental Event Detail Header */}
      <header className="dossier-hero-header">
        <div className="section-eyebrow">
          <span>DETAIL RESMI ACARA // 30 — 31 OKTOBER 2026</span>
        </div>
        <h1 className="dossier-main-headline text-gold-metallic">
          THE STATE OF CLAMOUR
        </h1>
        <p className="dossier-subheadline">
          SWEAR IN CONTINENTAL — Panduan resmi acara, susunan rundown panggung jam demi jam, arsitektur venue, dan tata tertib kehadiran.
        </p>

        {/* Technical Ledger Key Specs */}
        <div className="dossier-specs-strip">
          <div className="spec-metric-block">
            <span className="spec-metric-label">TANGGAL ACARA</span>
            <span className="spec-metric-val">30 — 31 OKT 2026</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">BINTANG UTAMA</span>
            <span className="spec-metric-val">{artists.map(a => a.name).join(' & ')}</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">BATAS USIA</span>
            <span className="spec-metric-val">18+ TERBATAS</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">STATUS TIKET</span>
            <span className="spec-metric-val">{tickets.filter(t => t.status === 'active').length} KATEGORI DIBUKA</span>
          </div>
        </div>
      </header>

      {/* Event Details Section Tabs */}
      <nav className="dossier-nav-tabs" aria-label="Tab bagian panduan acara">
        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className={`dossier-tab-item ${activeTab === 'timetable' ? 'is-active' : ''}`}
        >
          <Clock size={15} />
          <span>01 // RUNDOWN & JADWAL</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`dossier-tab-item ${activeTab === 'architecture' ? 'is-active' : ''}`}
        >
          <MapPin size={15} />
          <span>02 // VENUE & RUANGAN</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('protocols')}
          className={`dossier-tab-item ${activeTab === 'protocols' ? 'is-active' : ''}`}
        >
          <Shield size={15} />
          <span>03 // PROTOKOL MASUK</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`dossier-tab-item ${activeTab === 'guide' ? 'is-active' : ''}`}
        >
          <FileText size={15} />
          <span>04 // PANDUAN & FAQ</span>
        </button>
      </nav>

      {/* TAB CONTENT: 01 // PROTOKOL MASUK */}
      {activeTab === 'protocols' && (
        <section className="dossier-tab-panel">
          <div className="dossier-panel-intro">
            <h2 className="dossier-section-title">PROTOKOL MASUK & ARAHAN KEAMANAN</h2>
            <p className="dossier-section-desc">
              Seluruh pengunjung terikat oleh kebijakan wajib ini saat memasuki gerbang monumen. Pos pemeriksaan keamanan beroperasi melalui koordinasi langsung dengan pihak berwenang berizin.
            </p>
          </div>

          <div className="dossier-editorial-ledger">
            <article className="dossier-protocol-entry">
              <div className="protocol-entry-num">01</div>
              <div className="protocol-entry-content">
                <h3 className="protocol-entry-title">BATAS USIA & VERIFIKASI IDENTITAS WAJIB</h3>
                <p className="protocol-entry-text">
                  The State of Clamour adalah acara khusus <strong>18+</strong>. Tidak ada pengecualian yang diberikan dalam kondisi apa pun.
                </p>
                <div className="protocol-entry-specs">
                  <div className="spec-check-item">
                    <CheckCircle2 size={15} className="spec-check-icon" />
                    <span><strong>Identitas Diterima:</strong> KTP, Paspor, atau SIM fisik asli yang masih berlaku.</span>
                  </div>
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Identitas Tidak Berlaku:</strong> Fotokopi digital, foto/tangkapan layar di ponsel, kartu identitas kedaluwarsa, atau kartu pelajar/mahasiswa.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="dossier-protocol-entry">
              <div className="protocol-entry-num">02</div>
              <div className="protocol-entry-content">
                <h3 className="protocol-entry-title">KODE BUSANA & ETIKA SUASANA</h3>
                <p className="protocol-entry-text">
                  Acara kami berlangsung dalam suasana malam yang sinematik dan beretika. Kami mengajak para pengunjung mengenakan busana elegan bernuansa gelap, setelan malam rapi, atau gaya avant-garde ekspresif.
                </p>
                <div className="protocol-entry-specs">
                  <div className="spec-check-item">
                    <CheckCircle2 size={15} className="spec-check-icon" />
                    <span><strong>Disarankan:</strong> Pakaian serba hitam, monokrom gelap, sepatu bot/sneakers tertutup, pakaian berbahan kulit atau bertekstur.</span>
                  </div>
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Dilarang Keras di Area Lantai Dansa:</strong> Alas kaki terbuka (sandal jepit, selop) dan jersey olahraga demi alasan keamanan fisik & kenyamanan bersama.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="dossier-protocol-entry">
              <div className="protocol-entry-num">03</div>
              <div className="protocol-entry-content">
                <h3 className="protocol-entry-title">PEMERIKSAAN KEAMANAN & BARANG TERLARANG</h3>
                <p className="protocol-entry-text">
                  Setiap pengunjung wajib melalui pemeriksaan tas menyeluruh dan alat pendeteksi elektronik di gerbang utama.
                </p>
                <div className="protocol-entry-specs">
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Narkotika & Obat Terlarang:</strong> Kebijakan tanpa toleransi untuk zat ilegal apa pun. Pelanggar akan langsung diserahkan kepada pihak kepolisian.</span>
                  </div>
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Barang Dilarang:</strong> Segala bentuk senjata, benda tajam, cairan luar, kamera profesional berlensa lepas-pasang (tanpa ID pers resmi), dan perangkat laser.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="dossier-protocol-entry">
              <div className="protocol-entry-num">04</div>
              <div className="protocol-entry-content">
                <h3 className="protocol-entry-title">JENDELA WAKTU MASUK, BATAS CUTOFF & MASUK KEMBALI</h3>
                <p className="protocol-entry-text">
                  Gerbang dibuka pukul 21:00 WIB setiap malam. Untuk menjaga kenyamanan aliran penonton dan kapasitas ruangan, batas waktu ketat diberlakukan.
                </p>
                <div className="protocol-entry-specs">
                  <div className="spec-check-item">
                    <CheckCircle2 size={15} className="spec-check-icon" />
                    <span><strong>Protokol Masuk Kembali (Re-Entry):</strong> Diizinkan bagi pemegang gelang RFID terverifikasi hingga pukul 23:30 WIB.</span>
                  </div>
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Batas Akhir Keluar:</strong> Keluar dari venue setelah pukul 23:30 WIB dianggap mengakhiri sesi malam Anda; izin masuk kembali tidak akan diberikan.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="dossier-protocol-entry">
              <div className="protocol-entry-num">05</div>
              <div className="protocol-entry-content">
                <h3 className="protocol-entry-title">INTEGRITAS GELANG RFID & KEASLIAN TIKET</h3>
                <p className="protocol-entry-text">
                  Artatix adalah satu-satunya mitra tiket resmi kami. Barcode tiket yang dibeli melalui calo atau pihak ketiga tidak terverifikasi tidak akan berlaku dan tidak ada pengembalian dana.
                </p>
                <div className="protocol-entry-specs">
                  <div className="spec-check-item">
                    <AlertTriangle size={15} className="spec-warn-icon" />
                    <span><strong>Aturan Gelang:</strong> Gelang tangan RFID yang tampak robek, terpotong, direkatkan kembali, atau dialihkan ke orang lain akan langsung dibatalkan hak aksesnya di tempat.</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* TAB CONTENT: 02 // VENUE & RUANGAN */}
      {activeTab === 'architecture' && (
        <section className="dossier-tab-panel">
          <div className="dossier-panel-intro">
            <h2 className="dossier-section-title">ARSITEKTUR VENUE & RUANGAN PERTUNJUKAN</h2>
            <p className="dossier-section-desc">
              Area monumen dibagi menjadi dua aula akustik utama, pelataran istirahat terbuka, serta fasilitas penunjang kenyamanan pengunjung.
            </p>
          </div>

          <div className="dossier-sanctuary-grid">
            <div className="dossier-sanctuary-card">
              <div className="sanctuary-card-badge">AULA 01</div>
              <h3 className="sanctuary-card-title">THE MAIN ASSEMBLY HALL</h3>
              <p className="sanctuary-card-meta">PROFIL SUARA: SUB-BASS RESONANCE // KAPASITAS: 2.500</p>
              <p className="sanctuary-card-desc">
                Aula utama bersejarah dengan pilar-pilar monolitik megah, sistem tata suara line-array 360 derajat, dan panggung pertunjukan konser live penuh energi yang dipimpin oleh Basboi.
              </p>
              <ul className="sanctuary-facilities-list">
                <li>Sistem tata suara kustom dengan penguatan frekuensi sub-bass bertenaga tinggi</li>
                <li>Tata cahaya arsitektural sinematik dengan instalasi portal merah</li>
                <li>Akses langsung ke pintu keluar darurat dan titik isi ulang air minum</li>
              </ul>
            </div>

            <div className="dossier-sanctuary-card">
              <div className="sanctuary-card-badge">AULA 02</div>
              <h3 className="sanctuary-card-title">THE UNDER-VAULT</h3>
              <p className="sanctuary-card-meta">PROFIL SUARA: INDUSTRIAL TECHNO // KAPASITAS: 1.200</p>
              <p className="sanctuary-card-desc">
                Ruang beton bawah tanah yang didedikasikan untuk ketukan perkusi cepat, modular synth hipnotik, dan kurasi musik elektronik gelap oleh Elena Vex dan DJ residen underground.
              </p>
              <ul className="sanctuary-facilities-list">
                <li>Langit-langit beton dengan peredaman khusus untuk dentuman bass yang menggetarkan tubuh</li>
                <li>Pencahayaan monokromatik dan kabut sirkulasi panggung</li>
                <li>Posisi DJ booth 360 derajat yang intim dan dekat dengan lantai dansa</li>
              </ul>
            </div>

            <div className="dossier-sanctuary-card">
              <div className="sanctuary-card-badge">ZONA 03</div>
              <h3 className="sanctuary-card-title">THE CLOISTER & PELATARAN TERBUKA</h3>
              <p className="sanctuary-card-meta">SUASANA: PEMULIHAN UDARA TERBUKA // KAPASITAS: LUAS</p>
              <p className="sanctuary-card-desc">
                Area terbuka di antara dua aula pertunjukan. Dirancang untuk rehat pendengaran, alunan suara ambient yang menenangkan, hidrasi, pilihan makanan & minuman, serta interaksi santai di bawah langit malam.
              </p>
              <ul className="sanctuary-facilities-list">
                <li>Area khusus merokok dan vape dengan sirkulasi udara bebas</li>
                <li>Bar minuman terkurasi, stan kopi artisan, dan tenant kuliner terpilih</li>
                <li>Titik hidrasi air minum gratis yang dikelola oleh tim kepedulian acara</li>
              </ul>
            </div>

            <div className="dossier-sanctuary-card">
              <div className="sanctuary-card-badge">ZONA 04</div>
              <h3 className="sanctuary-card-title">POS MEDIS & RUANG NYAMAN</h3>
              <p className="sanctuary-card-meta">OPERASIONAL: SEPANJANG ACARA // 21:00 — SELESAI</p>
              <p className="sanctuary-card-desc">
                Area perawatan khusus yang dijaga oleh tenaga medis profesional berlisensi dan tim tanggap cepat. Ruang hening dengan stimulasi rendah bagi siapa pun yang membutuhkan istirahat atau bantuan medis.
              </p>
              <ul className="sanctuary-facilities-list">
                <li>Penyumbat telinga pelindung pendengaran (earplugs) tersedia gratis</li>
                <li>Pos P3K dengan akses jalur evakuasi ambulans siaga cepat</li>
                <li>Tempat istirahat nyaman dan penanganan tanpa penghakiman</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT: 03 // KRONOLOGI & RUNDOWN */}
      {activeTab === 'timetable' && (
        <section className="dossier-tab-panel">
          <div className="dossier-panel-intro">
            <h2 className="dossier-section-title">KRONOLOGI SUSUNAN ACARA & RUNDOWN</h2>
            <p className="dossier-section-desc">
              Seluruh waktu menggunakan Waktu Indonesia Barat (WIB). Perpindahan antarruangan telah disinkronkan agar transisi suara berjalan mulus.
            </p>
          </div>

          <div className="dossier-timetable-block">
            <div className="dossier-timetable-day-header">
              <Calendar size={16} />
              <span>MALAM I // JUMAT, 30 OKTOBER 2026</span>
            </div>
            <div className="dossier-timetable-list">
              <div className="dossier-tt-row">
                <span className="tt-col-time">21:00 — 22:30</span>
                <span className="tt-col-artist">GERBANG DIBUKA & INTRODUKSI AMBIENT DRONE</span>
                <span className="tt-col-stage">THE CLOISTER</span>
              </div>
              <div className="dossier-tt-row highlight">
                <span className="tt-col-time">22:30 — 00:00</span>
                <span className="tt-col-artist">BASBOI [LIVE HEADLINE CONCERT]</span>
                <span className="tt-col-stage">MAIN ASSEMBLY HALL</span>
              </div>
              <div className="dossier-tt-row">
                <span className="tt-col-time">00:00 — 02:00</span>
                <span className="tt-col-artist">RESIDENT SELECTORS // RITUAL PERCUSSION</span>
                <span className="tt-col-stage">THE UNDER-VAULT</span>
              </div>
              <div className="dossier-tt-row">
                <span className="tt-col-time">02:00 — 04:00</span>
                <span className="tt-col-artist">MIDNIGHT CLOSING CEREMONY & CURFEW</span>
                <span className="tt-col-stage">MAIN ASSEMBLY HALL</span>
              </div>
            </div>

            <div className="dossier-timetable-day-header" style={{ marginTop: '2.5rem' }}>
              <Calendar size={16} />
              <span>MALAM II // SABTU, 31 OKTOBER 2026</span>
            </div>
            <div className="dossier-timetable-list">
              <div className="dossier-tt-row">
                <span className="tt-col-time">21:00 — 22:30</span>
                <span className="tt-col-artist">PINTU DIBUKA & SUB-BASS WARMUP</span>
                <span className="tt-col-stage">MAIN ASSEMBLY HALL</span>
              </div>
              <div className="dossier-tt-row highlight">
                <span className="tt-col-time">22:30 — 00:30</span>
                <span className="tt-col-artist">ELENA VEX [EXTENDED LIVE TECHNO SET]</span>
                <span className="tt-col-stage">THE UNDER-VAULT</span>
              </div>
              <div className="dossier-tt-row">
                <span className="tt-col-time">00:30 — 02:30</span>
                <span className="tt-col-artist">SPECIAL GUEST CURATORS</span>
                <span className="tt-col-stage">MAIN ASSEMBLY HALL</span>
              </div>
              <div className="dossier-tt-row">
                <span className="tt-col-time">02:30 — 04:00</span>
                <span className="tt-col-artist">THE STATE OF CLAMOUR FINAL CONVERGENCE</span>
                <span className="tt-col-stage">DUAL TRANSMISSION</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT: 04 // PANDUAN & FAQ */}
      {activeTab === 'guide' && (
        <section className="dossier-tab-panel">
          <div className="dossier-panel-intro">
            <h2 className="dossier-section-title">PANDUAN PRAKTIS PENGUNJUNG & PERTANYAAN UMUM (FAQ)</h2>
            <p className="dossier-section-desc">
              Informasi logistik, sistem pembayaran, fasilitas penitipan loker, dan rekomendasi transportasi untuk kelancaran malam Anda.
            </p>
          </div>

          <div className="dossier-faq-ledger">
            <div className="dossier-faq-card">
              <h3 className="dossier-faq-q">Bagaimana cara penukaran gelang RFID?</h3>
              <p className="dossier-faq-a">
                Tunjukkan e-tiket barcode resmi dari Artatix bersama KTP/SIM/Paspor fisik asli Anda di loket penukaran gerbang. Anda akan menerima gelang RFID terenkripsi yang berfungsi sebagai tiket akses masuk sekaligus dompet pembayaran nontunai. Loket penukaran dibuka mulai pukul 19:30 WIB (90 menit sebelum pintu dibuka).
              </p>
            </div>

            <div className="dossier-faq-card">
              <h3 className="dossier-faq-q">Apakah uang tunai diterima di dalam venue?</h3>
              <p className="dossier-faq-a">
                Tidak. The State of Clamour adalah acara 100% nontunai (cashless). Semua transaksi pembelian makanan, minuman, dan merchandise menggunakan gelang RFID atau seluruh saluran pembayaran QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay, Dana).
              </p>
            </div>

            <div className="dossier-faq-card">
              <h3 className="dossier-faq-q">Apakah tersedia loker dan tempat penitipan barang?</h3>
              <p className="dossier-faq-a">
                Ya. Loker elektronik berpengaman tersedia di dekat gerbang masuk portico. Tas ransel besar dan jaket tebal diwajibkan untuk dititipkan di cloakroom sebelum memasuki aula pertunjukan demi kelancaran dan keselamatan area lantai dansa.
              </p>
            </div>

            <div className="dossier-faq-card">
              <h3 className="dossier-faq-q">Apa rekomendasi transportasi dan parkir kendaraan?</h3>
              <p className="dossier-faq-a">
                Kami sangat menyarankan pengunjung menggunakan transportasi online (Grab / Gojek). Titik penjemputan dan penurunan khusus telah disiapkan bersama petugas lalu lintas di area gerbang utara. Lahan parkir kendaraan pribadi sangat terbatas.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Dossier Bottom Action Footer */}
      <footer className="dossier-bottom-cta">
        <div className="dossier-cta-inner">
          <div>
            <span className="section-eyebrow" style={{ marginBottom: '0.4rem', display: 'block' }}>THE STATE OF CLAMOUR</span>
            <h3 className="dossier-cta-title">SIAP MEMASUKI ACARA?</h3>
            <p className="dossier-cta-desc">Tiket terjual cepat. Amankan kategori tiket pilihan Anda sebelum kuota penuh.</p>
          </div>
          <div className="dossier-cta-btns">
            <button
              type="button"
              onClick={onGetTickets}
              className="dossier-primary-btn btn-press"
            >
              <span>AMBIL TIKET SEKARANG →</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="dossier-secondary-btn btn-press"
            >
              <span>KEMBALI KE BERANDA</span>
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
};


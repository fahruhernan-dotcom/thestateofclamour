import React, { useState } from 'react';
import { Shield, Sparkles, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onOpenDossier: () => void;
  onToast?: (msg: string) => void;
}

interface ProtocolItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  spec: string;
  icon: React.ReactNode;
}

const protocols: ProtocolItem[] = [
  {
    id: 'p1',
    badge: 'ARAHAN // 01',
    title: '18+ WAJIB IDENTITAS FISIK RESMI',
    desc: 'Wajib membawa kartu identitas fisik resmi yang masih berlaku (KTP / Paspor / SIM) untuk penukaran gelang RFID di loket gerbang. Foto atau tangkapan layar HP tidak berlaku.',
    spec: 'Verifikasi Fisik Ketat di Loket',
    icon: <Shield size={16} style={{ color: 'var(--color-gold-antique)' }} />,
  },
  {
    id: 'p2',
    badge: 'ARAHAN // 02',
    title: 'TATA BUSANA SERBA HITAM & ELEGAN',
    desc: 'Dianjurkan mengenakan pakaian serba hitam, setelan gelap elegan, atau estetika avant-garde malam. Demi keselamatan lantai dansa, alas kaki terbuka (sandal jepit/selop) dan jersey olahraga dilarang.',
    spec: 'Dianjurkan Busana Elegan Gelap',
    icon: <Sparkles size={16} style={{ color: 'var(--color-gold-antique)' }} />,
  },
  {
    id: 'p3',
    badge: 'ARAHAN // 03',
    title: 'AKSES GELANG RFID & TRANSAKSI NON-TUNAI',
    desc: 'Transaksi 100% nontunai menggunakan gelang RFID resmi atau QRIS di seluruh bar & stand. Tanpa toleransi untuk obat-obatan terlarang, senjata tajam, cairan dari luar, atau calo tiket liar.',
    spec: 'Hanya Tiket Resmi Artatix',
    icon: <FileText size={16} style={{ color: 'var(--color-gold-antique)' }} />,
  },
];

export const RulesFAQMobile: React.FC<Props> = ({ onOpenDossier, onToast }) => {
  const [expandedId, setExpandedId] = useState<string | null>('p1');
  const [isAccepted, setIsAccepted] = useState(false);

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleAcceptProtocols = () => {
    setIsAccepted(true);
    if (onToast) {
      onToast('Protokol resmi telah disetujui. Selamat datang di The State of Clamour.');
    }
  };

  return (
    <section id="before-you-enter" className="rules-mobile-section" aria-label="Panduan Masuk The State of Clamour">
      <div className="rules-mobile-header">
        <span className="rules-mobile-eyebrow">PANDUAN SEBELUM MASUK</span>
        <h2 className="rules-mobile-headline">SAFETY PROTOCOLS</h2>
        <p className="rules-mobile-subtext">
          Arahan penting acara, protokol keamanan, dan tata tertib pengunjung.
        </p>
      </div>

      <div className="rules-mobile-accordion-list">
        {protocols.map((item) => {
          const isOpen = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rules-mobile-item ${isOpen ? 'is-expanded' : ''}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className="rules-mobile-trigger"
                aria-expanded={isOpen}
              >
                <div className="rules-mobile-trigger-content">
                  <span className="rules-mobile-badge">{item.badge}</span>
                  <h3 className="rules-mobile-item-title">{item.title}</h3>
                </div>
                <span className={`rules-mobile-icon ${isOpen ? 'is-rotated' : ''}`} aria-hidden="true">
                  +
                </span>
              </button>

              <div className={`rules-mobile-content-grid ${isOpen ? 'is-expanded' : ''}`}>
                <div className="rules-mobile-content-inner">
                  <p className="rules-mobile-body-text">{item.desc}</p>
                  <div className="rules-mobile-spec-tag">
                    {item.icon}
                    <span>{item.spec}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Acknowledgment Button */}
      <button
        type="button"
        onClick={handleAcceptProtocols}
        className={`rules-mobile-acknowledge-btn ${isAccepted ? 'is-accepted' : ''}`}
      >
        <CheckCircle2 size={16} />
        <span>{isAccepted ? 'PROTOKOL TELAH DISETUJUI' : 'SAYA MENGERTI & SETUJUI PROTOKOL'}</span>
      </button>

      {/* Quick Dossier Explorer */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <button
          type="button"
          onClick={onOpenDossier}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gold-antique)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <span>LIHAT DETAIL EVENT LENGKAP</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </section>
  );
};

export default RulesFAQMobile;

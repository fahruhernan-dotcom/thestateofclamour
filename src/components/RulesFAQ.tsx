import React from 'react';
import { Shield, Sparkles, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  onOpenDossier: () => void;
  onToast?: (msg: string) => void;
}

export const RulesFAQ: React.FC<Props> = ({ onOpenDossier }) => {
  return (
    <section id="before-you-enter" className="cinematic-section">
      <div className="section-eyebrow">
        <span>05 // PROTOKOL MASUK</span>
      </div>

      <h2 className="section-headline">
        PANDUAN SEBELUM MASUK
      </h2>

      <p className="section-subheadline">
        Arahan penting acara, protokol keamanan, dan tata tertib pengunjung.
      </p>

      <p className="section-body-text">
        The State of Clamour adalah pagelaran malam yang beretika dan teratur. Pelajari poin utama di bawah atau buka dosir lengkap panduan acara.
      </p>

      {/* Sleek 3-Pillar Minimalist Directives */}
      <div className="dossier-pillars-grid">
        <article className="dossier-pillar-card">
          <div className="pillar-index-tag">ARAHAN // 01</div>
          <div className="pillar-icon-wrap">
            <Shield size={20} style={{ color: 'var(--color-gold-antique)' }} />
          </div>
          <h3 className="pillar-title">18+ WAJIB IDENTITAS FISIK</h3>
          <p className="pillar-desc">
            Wajib membawa kartu identitas fisik resmi yang masih berlaku (KTP / Paspor / SIM) untuk penukaran gelang RFID di loket. Tangkapan layar HP atau kartu pelajar tidak berlaku.
          </p>
          <div className="pillar-footer-spec">
            <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
            <span>Verifikasi Fisik Ketat di Loket</span>
          </div>
        </article>

        <article className="dossier-pillar-card">
          <div className="pillar-index-tag">ARAHAN // 02</div>
          <div className="pillar-icon-wrap">
            <Sparkles size={20} style={{ color: 'var(--color-gold-antique)' }} />
          </div>
          <h3 className="pillar-title">TATA BUSANA SERBA HITAM</h3>
          <p className="pillar-desc">
            Disarankan mengenakan pakaian serba hitam, setelan gelap elegan, atau estetika avant-garde malam. Demi keselamatan lantai dansa, alas kaki terbuka (sandal jepit/selop) dan jersey olahraga dilarang.
          </p>
          <div className="pillar-footer-spec">
            <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
            <span>Dianjurkan Busana Elegan Gelap</span>
          </div>
        </article>

        <article className="dossier-pillar-card">
          <div className="pillar-index-tag">ARAHAN // 03</div>
          <div className="pillar-icon-wrap">
            <FileText size={20} style={{ color: 'var(--color-gold-antique)' }} />
          </div>
          <h3 className="pillar-title">AKSES RFID & TANPA TOLERANSI</h3>
          <p className="pillar-desc">
            Transaksi 100% nontunai menggunakan gelang RFID atau QRIS resmi. Tanpa toleransi untuk obat-obatan terlarang, benda tajam, cairan dari luar, atau calo tiket liar.
          </p>
          <div className="pillar-footer-spec">
            <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
            <span>Hanya Tiket Resmi Artatix</span>
          </div>
        </article>
      </div>

      {/* Monumental Event Gateway Banner */}
      <div className="dossier-gateway-banner">
        <div className="dossier-gateway-left">
          <div className="dossier-seal-icon">
            <FileText size={24} style={{ color: 'var(--color-gold-antique)' }} />
          </div>
          <div className="dossier-gateway-text">
            <span className="dossier-doc-kicker">INFORMASI RESMI EVENT // THE STATE OF CLAMOUR</span>
            <h4 className="dossier-gateway-heading">PANDUAN LENGKAP ACARA & RUNDOWN RESMI</h4>
            <p className="dossier-gateway-sub">
              Pelajari denah lengkap ruangan venue, profil akustik panggung, jadwal rundown menyeluruh, panduan transportasi, dan pos medis darurat.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDossier}
          className="dossier-explore-btn btn-press"
        >
          <span>LIHAT DETAIL EVENT</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

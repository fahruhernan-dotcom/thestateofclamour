import React, { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onTicketClick: () => void;
}

export const FinalCTA: React.FC<Props> = ({ onTicketClick }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = `translate(0px, 0px)`;
  };

  return (
    <section className="final-gateway-section">
      {/* Volumetric Red Portal Light Beam */}
      <div className="final-volumetric-beam-glow" aria-hidden="true" />
      <div className="final-volumetric-beam-core" aria-hidden="true" />

      <div className="final-gateway-panel">
        <p className="section-eyebrow">
          <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
          <span>30 — 31 OCTOBER 2026</span>
        </p>

        <h2 className="section-headline" style={{ marginBottom: '1.25rem' }}>
          THE DOORS ARE OPENING
        </h2>

        <p className="section-subheadline" style={{ marginBottom: '2.5rem' }}>
          Two nights of sound, movement, and monumental assembly.
        </p>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            ref={btnRef}
            type="button"
            onClick={onTicketClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="btn-enter-state btn-press"
          >
            <span>ENTER THE STATE</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
};

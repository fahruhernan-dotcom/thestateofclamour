import React, { useState } from 'react';
import { venueZones } from '../../data/reservationData';
import { Compass, Volume2, Users } from 'lucide-react';
import '../../styles/denah.css';

interface Props {
  defaultZoneId?: string;
  onSelectZoneForReservation?: (packageId?: string) => void;
  dayBadge?: string;
}

export const EventVenueMapSection: React.FC<Props> = ({
  defaultZoneId = 'zone-vvip',
  onSelectZoneForReservation,
  dayBadge = 'MIZU COMMONROOM'
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(defaultZoneId);
  const [activeCategory, setActiveCategory] = useState<'all' | 'vip' | 'stage' | 'bar' | 'facility'>('all');

  const selectedZone = venueZones.find(z => z.id === selectedZoneId) || venueZones[0];

  const filteredZones = activeCategory === 'all'
    ? venueZones
    : venueZones.filter(z => z.category === activeCategory);

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
  };

  return (
    <section id="denah" className="denah-embedded-section" style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
      {/* Header Cluster */}
      <div className="dossier-sub-header">
        <div className="section-eyebrow">
          <span>DENAH VENUE &amp; TATA RUANG // {dayBadge}</span>
        </div>
        <h2 className="dossier-sub-title text-gold-metallic">
          TATA LETAK SANCTUARY &amp; PETA ZONA
        </h2>
        <p className="dossier-sub-desc" style={{ maxWidth: '640px', color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
          Navigasi menyeluruh aula perakitan malam The State of Clamor. Pelajari penempatan panggung, area sofa eksklusif, zona dansa, dan pos keselamatan.
        </p>
      </div>

      {/* Blueprint Interactive Canvas Frame */}
      <div className="denah-blueprint-frame" aria-label="Interactive Architectural Floor Plan">
        <div className="denah-blueprint-topbar">
          <div className="blueprint-meta-info">
            <span className="blueprint-compass">
              <Compass size={14} /> NORTH ▲ STAGE
            </span>
            <span>SCALE: 1:100 ARCHITECTURAL</span>
            <span>VEN: MIZU COMMONROOM</span>
          </div>

          {/* Filter Pills */}
          <div className="denah-filter-pills" role="tablist">
            <button
              type="button"
              className={`denah-filter-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Semua Zona
            </button>
            <button
              type="button"
              className={`denah-filter-btn ${activeCategory === 'vip' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('vip')}
            >
              Sofa &amp; VIP Table
            </button>
            <button
              type="button"
              className={`denah-filter-btn ${activeCategory === 'stage' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('stage')}
            >
              Panggung &amp; Dancefloor
            </button>
            <button
              type="button"
              className={`denah-filter-btn ${activeCategory === 'bar' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('bar')}
            >
              Bar &amp; Lounge
            </button>
            <button
              type="button"
              className={`denah-filter-btn ${activeCategory === 'facility' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('facility')}
            >
              Fasilitas &amp; Pintu
            </button>
          </div>
        </div>

        {/* Mobile Swipe Hint — visible only on small screens via CSS */}
        <div className="denah-mobile-scroll-hint">
          <span>← GESER PETA UNTUK LIHAT SELURUH VENUE →</span>
        </div>

        {/* Interactive SVG Floor Plan */}
        <div className="denah-svg-wrapper">
          <svg
            className="denah-interactive-svg"
            viewBox="0 0 900 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Peta Denah Panggung dan Sofa Mizu Commonroom"
          >
            {/* Architectural Grid Lines */}
            <defs>
              <pattern id="gridPatternEmbed" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(197, 168, 105, 0.05)" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="stageGlowEmbed" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="rgba(143, 29, 36, 0.45)" />
                <stop offset="100%" stopColor="rgba(143, 29, 36, 0.02)" />
              </radialGradient>
            </defs>

            <rect width="900" height="600" fill="url(#gridPatternEmbed)" />

            {/* Perimeter Wall */}
            <rect
              x="20"
              y="20"
              width="860"
              height="560"
              rx="16"
              fill="rgba(10, 13, 18, 0.85)"
              stroke="rgba(197, 168, 105, 0.35)"
              strokeWidth="2"
            />

            {/* --- ZONE 1: THE MAIN STAGE --- */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-stage' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-stage')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="220"
                y="35"
                width="460"
                height="80"
                rx="8"
                fill="rgba(143, 29, 36, 0.35)"
                stroke="rgba(224, 49, 62, 0.7)"
                strokeWidth="1.5"
              />
              <rect x="220" y="35" width="460" height="80" fill="url(#stageGlowEmbed)" />
              <text x="450" y="70" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="13" fontWeight="700" letterSpacing="3">
                THE MAIN STAGE &amp; DJ SANCTUM
              </text>
              <text x="450" y="92" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="1.5">
                STAGE 01 // SECRET HEADLINER (TBA) · LIVE CONCERT
              </text>
            </g>

            {/* Stage Left Wing (VIP Side Lounge) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-side-lounge' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-side-lounge')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="50"
                y="55"
                width="140"
                height="100"
                rx="6"
                fill="rgba(197, 168, 105, 0.12)"
                stroke="rgba(197, 168, 105, 0.4)"
                strokeWidth="1.2"
              />
              <text x="120" y="100" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="10" fontWeight="700">
                VIP SIDE LOUNGE (WEST)
              </text>
              <text x="120" y="120" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8">
                ZONE C // 2 SOFA
              </text>
            </g>

            {/* Stage Right Wing (VIP Side Lounge) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-side-lounge' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-side-lounge')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="710"
                y="55"
                width="140"
                height="100"
                rx="6"
                fill="rgba(197, 168, 105, 0.12)"
                stroke="rgba(197, 168, 105, 0.4)"
                strokeWidth="1.2"
              />
              <text x="780" y="100" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="10" fontWeight="700">
                VIP SIDE LOUNGE (EAST)
              </text>
              <text x="780" y="120" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8">
                ZONE C // 2 SOFA
              </text>
            </g>

            {/* --- ZONE A: VVIP ROYAL CENTER PIT --- */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-vvip' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-vvip')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="260"
                y="145"
                width="380"
                height="80"
                rx="8"
                fill="rgba(197, 168, 105, 0.22)"
                stroke="rgba(197, 168, 105, 0.85)"
                strokeWidth="1.8"
              />
              <circle cx="310" cy="185" r="14" fill="rgba(197, 168, 105, 0.3)" stroke="#c5a869" strokeWidth="1" />
              <circle cx="400" cy="185" r="14" fill="rgba(197, 168, 105, 0.3)" stroke="#c5a869" strokeWidth="1" />
              <circle cx="500" cy="185" r="14" fill="rgba(197, 168, 105, 0.3)" stroke="#c5a869" strokeWidth="1" />
              <circle cx="590" cy="185" r="14" fill="rgba(197, 168, 105, 0.3)" stroke="#c5a869" strokeWidth="1" />
              <text x="450" y="170" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="11" fontWeight="700" letterSpacing="1.5">
                ★ VVIP ROYAL CENTER PIT (ZONE A) ★
              </text>
              <text x="450" y="210" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="600">
                4 SOFA VIP · POSISI DEPAN PANGGUNG
              </text>
            </g>

            {/* --- GA: GENERAL DANCEFLOOR / THE VOID --- */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-dancefloor' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-dancefloor')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="200"
                y="245"
                width="500"
                height="150"
                rx="10"
                fill="rgba(255, 255, 255, 0.03)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <text x="450" y="315" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="14" fontWeight="700" letterSpacing="2">
                GENERAL DANCEFLOOR / THE VOID
              </text>
              <text x="450" y="340" textAnchor="middle" fill="#9e9ea0" fontFamily="Inter, sans-serif" fontSize="9">
                FESTIVAL TICKET GENERAL ADMISSION · MOSH &amp; RESONANCE AREA
              </text>
            </g>

            {/* Cocktail Tables Flanking GA Floor */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-cocktail' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-cocktail')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="50"
                y="180"
                width="130"
                height="190"
                rx="6"
                fill="rgba(197, 168, 105, 0.08)"
                stroke="rgba(197, 168, 105, 0.35)"
                strokeWidth="1"
              />
              <circle cx="90" cy="225" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="140" cy="225" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="90" cy="285" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="140" cy="285" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <text x="115" y="335" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="9" fontWeight="700">
                COCKTAIL TABLES (WEST)
              </text>
              <text x="115" y="352" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="7.5">
                ZONE D // 6 TABLES
              </text>
            </g>

            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-cocktail' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-cocktail')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="720"
                y="180"
                width="130"
                height="190"
                rx="6"
                fill="rgba(197, 168, 105, 0.08)"
                stroke="rgba(197, 168, 105, 0.35)"
                strokeWidth="1"
              />
              <circle cx="760" cy="225" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="810" cy="225" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="760" cy="285" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <circle cx="810" cy="285" r="10" fill="rgba(197, 168, 105, 0.2)" stroke="#c5a869" />
              <text x="785" y="335" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="9" fontWeight="700">
                COCKTAIL TABLES (EAST)
              </text>
              <text x="785" y="352" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="7.5">
                ZONE D // 6 TABLES
              </text>
            </g>

            {/* --- ZONE B: VIP MEZZANINE BALCONY --- */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-mezzanine' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-mezzanine')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="200"
                y="415"
                width="500"
                height="65"
                rx="6"
                fill="rgba(197, 168, 105, 0.15)"
                stroke="rgba(197, 168, 105, 0.6)"
                strokeWidth="1.5"
              />
              <text x="450" y="445" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="11" fontWeight="700" letterSpacing="1.5">
                VIP MEZZANINE BALCONY (ZONE B)
              </text>
              <text x="450" y="465" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8.5">
                ELEVATED 4 METERS OVERLOOKING DANCEFLOOR · 6 BALCONY SOFAS · PRIVATE BAR
              </text>
            </g>

            {/* Central Mixology Bar (South West) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-bar' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-bar')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="50"
                y="390"
                width="130"
                height="90"
                rx="6"
                fill="rgba(143, 29, 36, 0.15)"
                stroke="rgba(197, 168, 105, 0.4)"
                strokeWidth="1.2"
              />
              <text x="115" y="430" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="9.5" fontWeight="700">
                CENTRAL BAR
              </text>
              <text x="115" y="450" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8">
                MIXOLOGY &amp; BEER
              </text>
            </g>

            {/* Outdoor Cloister / Smoking Yard (South East) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-cloister' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-cloister')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="720"
                y="390"
                width="130"
                height="90"
                rx="6"
                fill="rgba(50, 150, 100, 0.1)"
                stroke="rgba(50, 150, 100, 0.4)"
                strokeWidth="1.2"
              />
              <text x="785" y="430" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="9.5" fontWeight="700">
                THE CLOISTER
              </text>
              <text x="785" y="450" textAnchor="middle" fill="#8bc34a" fontFamily="Inter, sans-serif" fontSize="8">
                OUTDOOR &amp; SMOKING
              </text>
            </g>

            {/* Entrance Gate & Wristband Exchange (Bottom Center) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-entrance' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-entrance')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="280"
                y="500"
                width="340"
                height="60"
                rx="6"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="rgba(197, 168, 105, 0.4)"
                strokeWidth="1.2"
              />
              <text x="450" y="530" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="10" fontWeight="700">
                MAIN ENTRANCE GATES &amp; WRISTBAND EXCHANGE
              </text>
              <text x="450" y="548" textAnchor="middle" fill="#c5a869" fontFamily="Inter, sans-serif" fontSize="8">
                TICKETING CHECK-IN · FAST TRACK VIP ENTRY · 18+ ID VERIFICATION
              </text>
            </g>

            {/* Medical Post (Bottom West) */}
            <g
              className={`svg-zone-hotspot ${selectedZoneId === 'zone-medical' ? 'is-selected' : ''}`}
              onClick={() => handleSelectZone('zone-medical')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="50"
                y="500"
                width="210"
                height="60"
                rx="6"
                fill="rgba(224, 49, 62, 0.1)"
                stroke="rgba(224, 49, 62, 0.4)"
                strokeWidth="1.2"
              />
              <text x="155" y="530" textAnchor="middle" fill="#f5eedc" fontFamily="Cinzel, serif" fontSize="9.5" fontWeight="700">
                POS MEDIS &amp; FIRST AID
              </text>
              <text x="155" y="548" textAnchor="middle" fill="#e0313e" fontFamily="Inter, sans-serif" fontSize="8">
                CALM SANCTUARY &amp; AMBULANCE
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Zone Highlight Callout */}
        <div className="denah-active-inspector">
          <div className="inspector-info-group">
            <span className="inspector-zone-badge">{selectedZone.code} // TERPILIH DI PETA</span>
            <span className="inspector-zone-name">{selectedZone.name}</span>
            <span className="inspector-zone-meta">
              Kapasitas: {selectedZone.capacity} · Audio: {selectedZone.soundProfile}
            </span>
          </div>

          {onSelectZoneForReservation && (
            selectedZone.associatedPackageId ? (
              <button
                type="button"
                className="inspector-action-btn btn-press"
                onClick={() => onSelectZoneForReservation(selectedZone.associatedPackageId)}
              >
                PESAN MEJA DI ZONA INI ↓
              </button>
            ) : (
              <button
                type="button"
                className="inspector-action-btn btn-press"
                onClick={() => onSelectZoneForReservation()}
              >
                LIHAT PAKET RESERVASI ↓
              </button>
            )
          )}
        </div>
      </div>

      {/* Zone Detail Ledger Cards Grid */}
      <div className="denah-zones-grid">
        {filteredZones.map(zone => {
          const isSelected = zone.id === selectedZoneId;
          return (
            <article
              key={zone.id}
              className={`denah-zone-card ${isSelected ? 'is-active' : ''}`}
              onClick={() => setSelectedZoneId(zone.id)}
            >
              <div className="zone-card-header">
                <span className="zone-code-tag">{zone.code}</span>
                <span className="zone-category-tag">{zone.category}</span>
              </div>

              <h3 className="zone-card-title">{zone.name}</h3>
              <div className="zone-sound-profile">
                <Volume2 size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                {zone.soundProfile}
              </div>

              <p className="zone-card-desc">{zone.description}</p>

              <ul className="zone-facilities-list">
                {zone.facilities.map((fac, idx) => (
                  <li key={idx}>{fac}</li>
                ))}
              </ul>

              <div className="zone-card-footer">
                {zone.associatedPackageId && onSelectZoneForReservation ? (
                  <button
                    type="button"
                    className="zone-reserve-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectZoneForReservation(zone.associatedPackageId);
                    }}
                  >
                    RESERVASI DI ZONA INI ↓
                  </button>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-dim)', textAlign: 'center', padding: '0.4rem 0' }}>
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {zone.capacity}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

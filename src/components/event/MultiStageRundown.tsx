import React from 'react';
import {
  MASTER_TIMELINE_NODES,
  GOTHIC_RUNDOWN_DATA,
  StageColumnData
} from '../../data/rundownData';
import { IS_RUNDOWN_RELEASED } from '../../data/eventData';
import { Sun, Moon, Lock, Sparkles, Clock, Volume2 } from 'lucide-react';
import '../../styles/gothic-rundown.css';

interface Props {
  day: 'day-1' | 'day-2';
}

export const MultiStageRundown: React.FC<Props> = ({ day }) => {
  const stageColumns: StageColumnData[] = GOTHIC_RUNDOWN_DATA[day] || GOTHIC_RUNDOWN_DATA['day-1'];

  return (
    <div className="gothic-rundown-section">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO HEADER CLUSTER (CATHEDRAL BANNER)                          */}
      {/* ------------------------------------------------------------------ */}
      <header className="gothic-hero-header">
        <img
          src="/assets/gothic_cathedral_ritual_concert.png"
          alt="Atmospheric Cathedral Hall"
          className="gothic-hero-bg-art"
          loading="eager"
        />
        <div className="gothic-hero-scrim" />

        <div className="gothic-hero-content-left">
          <span className="gothic-hero-eyebrow">THE EVENT</span>
          <h2 className="gothic-hero-title">RUNDOWN</h2>
          <p className="gothic-hero-quote">
            Three stages. One journey.<br />
            {IS_RUNDOWN_RELEASED
              ? 'From golden hour to the first light, let the night guide you.'
              : 'Susunan penampil multi-stage jam demi jam segera diumumkan.'}
          </p>
        </div>

        <div className="gothic-hero-meta-right">
          <span className="gothic-meta-day-label">
            · {day === 'day-1' ? 'JUM — SAB' : 'SAB — MIN'}
          </span>
          <span className="gothic-meta-date-main">
            {day === 'day-1' ? '30 OKT — 31 OKT' : '31 OKT — 01 NOV'}
          </span>
          <span className="gothic-meta-venue-line">TETRA SOLO (L1)</span>
          <span className="gothic-meta-venue-line">MIZU COMMONROOM (L2)</span>
        </div>
      </header>

      {!IS_RUNDOWN_RELEASED ? (
        /* ------------------------------------------------------------------ */
        /* 2. ATMOSPHERIC COMING SOON STATE (TEASER MULTI-STAGE)             */
        /* ------------------------------------------------------------------ */
        <div className="gothic-comingsoon-card">
          <div className="gothic-comingsoon-badge">
            <Sparkles size={12} />
            <span>SUSUNAN ACARA DALAM PROSES KURASI</span>
          </div>

          <div className="gothic-comingsoon-lock-circle">
            <Lock size={28} />
          </div>

          <h3 className="gothic-comingsoon-title">LINEUP &amp; TIMETABLE COMING SOON</h3>

          {/* 3 Spaces Teaser Cards Grid */}
          <div className="gothic-comingsoon-spaces-grid">
            <div className="gothic-comingsoon-space-item is-tetra-1">
              <div className="space-header-row">
                <span className="space-dot" style={{ background: '#d4af37' }} />
                <span className="space-status-badge">TBA</span>
              </div>
              <div className="space-info">
                <strong className="space-name">TETRA — STAGE 1</strong>
                <span className="space-desc">Panggung Utama 360° · Lantai 1</span>
              </div>
            </div>

            <div className="gothic-comingsoon-space-item is-tetra-2">
              <div className="space-header-row">
                <span className="space-dot" style={{ background: '#e63946' }} />
                <span className="space-status-badge">TBA</span>
              </div>
              <div className="space-info">
                <strong className="space-name">TETRA — STAGE 2</strong>
                <span className="space-desc">Panggung Bawah Tanah · Lantai 1</span>
              </div>
            </div>

            <div className="gothic-comingsoon-space-item is-mizu">
              <div className="space-header-row">
                <span className="space-dot" style={{ background: '#38bdf8' }} />
                <span className="space-status-badge">TBA</span>
              </div>
              <div className="space-info">
                <strong className="space-name">MIZU — STAGE</strong>
                <span className="space-desc">Commonroom Lounge · Lantai 2</span>
              </div>
            </div>
          </div>

          <div className="gothic-comingsoon-meta-pills">
            <div className="gothic-comingsoon-pill">
              <Clock size={13} style={{ color: '#d4af37' }} />
              <span>GATES OPEN 20:00 WIB</span>
            </div>
            <div className="gothic-comingsoon-pill">
              <Volume2 size={13} style={{ color: '#d4af37' }} />
              <span>3 PANGGUNG SIMULTAN</span>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------ */
        /* 3. RELEASED: MASTER TIMELINE + 3 PARALLEL STAGE COLUMNS           */
        /* ------------------------------------------------------------------ */
        <>
          <div className="gothic-master-timeline" role="region" aria-label="Poros Waktu Master">
            <div className="gothic-timeline-sun-anchor">
              <Sun size={14} style={{ color: '#d4af37' }} />
              <span>SORE</span>
            </div>

            <div className="gothic-timeline-nodes-track">
              <div className="gothic-timeline-line-connector" />

              {MASTER_TIMELINE_NODES.map((node) => (
                <div
                  key={node.sessionNum}
                  className={`gothic-timeline-node-item ${node.isHeadliner ? 'is-headliner' : ''}`}
                >
                  <div className="gothic-timeline-node-header">
                    <span className="gothic-timeline-num-badge">
                      {node.isHeadliner ? '★ ' : ''}{node.sessionNum}
                    </span>
                    <span className="gothic-timeline-node-name">{node.name}</span>
                  </div>
                  <span className="gothic-timeline-node-time">{node.timeRange}</span>
                </div>
              ))}
            </div>

            <div className="gothic-timeline-moon-anchor">
              <Moon size={13} style={{ color: 'rgba(245, 242, 235, 0.7)' }} />
              <span>PAGI</span>
            </div>
          </div>

          <div className="gothic-stages-columns-board">
            {stageColumns.map((col) => {
              const colThemeClass = col.id === 'tetra-1'
                ? 'is-tetra-1'
                : col.id === 'tetra-2'
                ? 'is-tetra-2'
                : 'is-mizu';

              return (
                <section
                  key={col.id}
                  id={`gothic-stage-${col.id}`}
                  className={`gothic-stage-col ${colThemeClass}`}
                >
                  {/* Column Banner Header */}
                  <header className="gothic-stage-banner-header">
                    <img
                      src={col.bannerImg}
                      alt={col.name}
                      className="gothic-stage-banner-img"
                      loading="lazy"
                    />
                    <div className="gothic-stage-banner-scrim" />
                    <div className="gothic-stage-banner-text">
                      <h3 className="gothic-stage-banner-title">{col.name}</h3>
                      <span className="gothic-stage-banner-floor">{col.floorLabel}</span>
                    </div>
                  </header>

                  {/* Acts List */}
                  <div className="gothic-acts-list">
                    {col.acts.map((act) => {
                      const timeParts = act.timeRange.split(' — ');
                      const startTime = timeParts[0] || act.timeRange;
                      const endTime = timeParts[1] ? `— ${timeParts[1]}` : '';

                      return (
                        <article
                          key={act.sessionNum}
                          className={`gothic-act-card ${act.isHeadliner ? 'is-headliner' : ''}`}
                        >
                          {/* Left Time Column */}
                          <div className="gothic-act-time-col">
                            <span>{startTime}</span>
                            <span style={{ opacity: 0.8 }}>{endTime}</span>
                          </div>

                          {/* Center Details */}
                          <div className="gothic-act-details">
                            <div className="gothic-act-title-row">
                              <span className="gothic-act-circle-num">
                                {act.isHeadliner ? '★ ' : ''}({act.sessionNum})
                              </span>
                              <h4 className="gothic-act-name">{act.title}</h4>
                            </div>
                            <p className="gothic-act-subtext">{act.subtitle}</p>
                          </div>

                          {/* Right Media & Status */}
                          <div className="gothic-act-media-col">
                            <img
                              src={act.thumbUrl}
                              alt={act.title}
                              className="gothic-act-thumb-img"
                              loading="lazy"
                            />
                            <span
                              className={`gothic-act-status-pill ${act.status === 'LIVE' ? 'live' : 'tba'}`}
                            >
                              {act.status}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MultiStageRundown;

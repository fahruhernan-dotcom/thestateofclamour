import React from 'react';
import { collectives } from '../data/collectiveData';
import '../styles/collectives.css';

export const CollectivesSection: React.FC = () => {
  return (
    <section id="alliance" className="collectives-section" aria-label="The Alliance of Collectives">
      <div className="collectives-inner">
        <div className="collectives-divider" aria-hidden="true" />

        <div className="collectives-eyebrow-badge">
          FOUNDING COLLECTIVES // THE ALLIANCE
        </div>

        <h2 className="collectives-headline">
          THE ALLIANCE
        </h2>

        <p className="collectives-subheadline">
          Five nocturnal forces united under one continental assembly.
        </p>

        <div className="collectives-grid">
          {collectives.map((item) => (
            <div key={item.id} className="collective-card" title={`${item.name} — ${item.subtitle}`}>
              <div className="collective-logo-wrap">
                <img
                  src={item.logoUrl}
                  alt={`${item.name} logo`}
                  className="collective-logo-img"
                  loading="lazy"
                />
              </div>
              <div className="collective-meta">
                <h3 className="collective-name">{item.name}</h3>
                <span className="collective-role">{item.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="collectives-footnote">
          <span>HOUSE OF WITNESSES</span>
          <span>×</span>
          <span>SUPERFLAME</span>
          <span>×</span>
          <span>HEADROOM</span>
          <span>×</span>
          <span>SYNCSATION</span>
          <span>×</span>
          <span>TENSION</span>
        </div>
      </div>
    </section>
  );
};

export default CollectivesSection;

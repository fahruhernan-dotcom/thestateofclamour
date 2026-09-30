import React from 'react';
import { Instagram, Music2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="cinematic-footer">
      <p className="footer-brand-title">
        THE STATE OF CLAMOUR
      </p>

      <p className="footer-credits-note">
        © 2026 THE STATE OF CLAMOUR. SWEAR IN CONTINENTAL. ALL RIGHTS RESERVED.
      </p>

      <div className="footer-social-cluster">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-social-item"
          aria-label="Instagram"
        >
          <Instagram size={17} />
        </a>

        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-social-item"
          aria-label="TikTok"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </a>

        <a
          href="https://spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-social-item"
          aria-label="Official Sound Playlist"
        >
          <Music2 size={17} />
        </a>
      </div>
    </footer>
  );
};

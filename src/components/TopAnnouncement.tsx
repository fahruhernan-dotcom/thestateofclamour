import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Announcement } from '../types';

interface Props {
  announcement: Announcement;
}

export const TopAnnouncement: React.FC<Props> = ({ announcement }) => {
  if (!announcement.isEnabled) return null;

  return (
    <div className="announcement-ticker-wrap" role="region" aria-label="Live Emergency Announcement">
      <div className="ticker-track">
        <span style={{ margin: '0 2rem', display: 'inline-flex', alignItems: 'center' }}>
          <span className="ticker-badge-alert">
            <AlertCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />
            {announcement.badgeText}
          </span>
          {announcement.message}
        </span>
        <span style={{ margin: '0 2rem', display: 'inline-flex', alignItems: 'center' }}>
          <span className="ticker-badge-alert">
            <AlertCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />
            {announcement.badgeText}
          </span>
          {announcement.message}
        </span>
        <span style={{ margin: '0 2rem', display: 'inline-flex', alignItems: 'center' }}>
          <span className="ticker-badge-alert">
            <AlertCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />
            {announcement.badgeText}
          </span>
          {announcement.message}
        </span>
      </div>
    </div>
  );
};

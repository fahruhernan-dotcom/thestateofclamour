import React, { useEffect, useState, useRef } from 'react';
import { startPreload, subscribePreloader } from '../utils/mediaPreloader';

interface CrypticPreloaderProps {
  onComplete?: () => void;
}

export const CrypticPreloader: React.FC<CrypticPreloaderProps> = ({ onComplete }) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const realPercentRef = useRef<number>(0);
  const displayPercentRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const minTimePassedRef = useRef<boolean>(false);

  // Status ritual label selector
  const getRitualStatus = (val: number): string => {
    if (val < 30) return 'NOCTURNAL COMMENCEMENT';
    if (val < 65) return 'UNSEALING ARCHIVES';
    if (val < 95) return 'BREAKING THE SILENCE';
    return 'SANCTUARY UNLOCKED';
  };

  useEffect(() => {
    // 1. Lock document scrolling during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Smooth fade-in entrance on mount
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 40);

    // 3. Minimum display time: 1.4s so animation feels deliberate and smooth
    const minTimer = setTimeout(() => {
      minTimePassedRef.current = true;
    }, 1400);

    // 4. Maximum failsafe timeout: 5s
    const safetyTimer = setTimeout(() => {
      realPercentRef.current = 100;
      minTimePassedRef.current = true;
    }, 5000);

    // 5. Start media preloader pipeline
    startPreload();
    const unsubscribe = subscribePreloader((s) => {
      realPercentRef.current = s.percent;
    });

    // 6. Smooth asymptotic interpolation loop
    const updateInterpolation = () => {
      const target = realPercentRef.current;
      const current = displayPercentRef.current;

      const effectiveTarget = !minTimePassedRef.current && target > 88 ? 88 : target;

      if (current < effectiveTarget) {
        const step = Math.max(0.5, (effectiveTarget - current) * 0.1);
        const next = Math.min(effectiveTarget, current + step);
        displayPercentRef.current = next;
        setDisplayPercent(Math.floor(next));
      }

      // Trigger smooth fade-out dissolve when complete
      if (displayPercentRef.current >= 99.5 && minTimePassedRef.current) {
        displayPercentRef.current = 100;
        setDisplayPercent(100);

        // Brief hold at 100% so user sees completion before the dissolve begins
        setTimeout(() => {
          setIsFadingOut(true);
          document.body.style.overflow = originalOverflow;
          onComplete?.();

          // Unmount after smooth CSS fade-out finishes (1.1s)
          setTimeout(() => {
            setIsDismissed(true);
          }, 1150);
        }, 280);

        return;
      }

      animFrameRef.current = requestAnimationFrame(updateInterpolation);
    };

    animFrameRef.current = requestAnimationFrame(updateInterpolation);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(enterTimer);
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
      unsubscribe();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  if (isDismissed) return null;

  const formattedPercent = displayPercent < 10 ? `0${displayPercent}` : `${displayPercent}`;

  return (
    <div
      className={`cryptic-preloader-root ${isVisible ? 'is-visible' : ''} ${isFadingOut ? 'is-fading-out' : ''}`}
      role="progressbar"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading The State of Clamour"
    >
      {/* 35mm Analog Film Grain Texture */}
      <div className="preloader-grain" aria-hidden="true" />

      {/* Central Ceremonial Core */}
      <div className="preloader-core">
        {/* Volumetric Crimson Light Aura */}
        <div className="preloader-aura" aria-hidden="true" />

        {/* 3D Chrome TSOC Emblem (100% Transparent PNG, No Bounding Box) */}
        <div className="preloader-emblem-wrap">
          <img
            src="/assets/tsoc_logo_transparent.png"
            alt="The State of Clamor"
            className="preloader-logo-img"
            width={720}
            height={720}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Minimalist Luxury Progress Cluster */}
        <div className="preloader-meta-cluster">
          <div className="preloader-counter-row">
            <span className="preloader-counter-value">{formattedPercent}</span>
            <span className="preloader-counter-unit">%</span>
          </div>

          <div className="preloader-progress-track">
            <div
              className="preloader-progress-bar"
              style={{ width: `${displayPercent}%` }}
            />
          </div>

          <span className="preloader-status-text">
            {getRitualStatus(displayPercent)}
          </span>
        </div>
      </div>
    </div>
  );
};

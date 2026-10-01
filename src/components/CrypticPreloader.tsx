import React, { useEffect, useState, useRef } from 'react';
import { startPreload, subscribePreloader } from '../utils/mediaPreloader';

interface CrypticPreloaderProps {
  onComplete?: () => void;
}

export const CrypticPreloader: React.FC<CrypticPreloaderProps> = ({ onComplete }) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [isUnsealing, setIsUnsealing] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);


  const realPercentRef = useRef<number>(0);
  const displayPercentRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const minTimePassedRef = useRef<boolean>(false);

  // Status ritual label selector
  const getRitualStatus = (val: number): string => {
    if (val < 28) return 'CALIBRATING NOCTURNAL FREQUENCIES';
    if (val < 62) return 'UNSEALING MONUMENTAL ARCHIVES';
    if (val < 88) return 'SUMMONING GOTHIC SANCTUARY';
    if (val < 100) return 'BREAKING THE SILENCE';
    return 'SANCTUARY UNLOCKED';
  };

  useEffect(() => {
    // 1. Lock document scrolling during the ceremonial initiation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Guarantee a minimum ceremonial presence of 1.4s so it feels intentional
    const minTimer = setTimeout(() => {
      minTimePassedRef.current = true;
    }, 1400);

    // 3. Maximum fallback timeout: guarantee unseal in 5s even on throttled 2G networks
    const safetyTimer = setTimeout(() => {
      realPercentRef.current = 100;
      minTimePassedRef.current = true;
    }, 5200);

    // 4. Start media preloader pipeline
    startPreload();
    const unsubscribe = subscribePreloader((s) => {
      realPercentRef.current = s.percent;
    });


    // 5. Smooth exponential easing loop for counter and progress bar
    const updateInterpolation = () => {
      const target = realPercentRef.current;
      const current = displayPercentRef.current;

      // Only allow advancing past 85% once the minimum ceremonial time has elapsed
      const effectiveTarget = !minTimePassedRef.current && target > 85 ? 85 : target;

      if (current < effectiveTarget) {
        // Smooth asymptotic increment
        const step = Math.max(0.6, (effectiveTarget - current) * 0.12);
        const next = Math.min(effectiveTarget, current + step);
        displayPercentRef.current = next;
        setDisplayPercent(Math.floor(next));
      }

      // Check for completion
      if (displayPercentRef.current >= 99.5 && minTimePassedRef.current) {
        displayPercentRef.current = 100;
        setDisplayPercent(100);

        // Initiate unsealing split
        setTimeout(() => {
          setIsUnsealing(true);
          document.body.style.overflow = originalOverflow;
          onComplete?.();

          // Unmount after shutter animation finishes
          setTimeout(() => {
            setIsDismissed(true);
          }, 900);
        }, 180);

        return;
      }

      animFrameRef.current = requestAnimationFrame(updateInterpolation);
    };

    animFrameRef.current = requestAnimationFrame(updateInterpolation);

    return () => {
      document.body.style.overflow = originalOverflow;
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
      className={`cryptic-preloader-root ${isUnsealing ? 'is-unsealing' : ''}`}
      role="progressbar"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading ceremonial assets"
    >
      {/* Dual Heavy Iron Vault Shutters */}
      <div className="preloader-shutter preloader-shutter-top" aria-hidden="true" />
      <div className="preloader-shutter preloader-shutter-bottom" aria-hidden="true" />

      {/* Analog Grain Filter */}
      <div className="preloader-grain" aria-hidden="true" />

      {/* Volumetric Crimson Aura & Central Sigil */}
      <div className="preloader-core">
        <div className="preloader-aura" aria-hidden="true" />

        <div className="preloader-sigil-wrap">
          <svg
            className="preloader-svg"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Cardinal Ring with Gothic Hashmarks */}
            <g className="sigil-outer-ring">
              <circle
                cx="100"
                cy="100"
                r="92"
                stroke="rgba(197, 168, 105, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="4 6 12 6"
              />
              <circle
                cx="100"
                cy="100"
                r="86"
                stroke="rgba(220, 20, 40, 0.3)"
                strokeWidth="0.75"
              />
              {/* Cardinal Accents */}
              <line x1="100" y1="4" x2="100" y2="12" stroke="#C5A869" strokeWidth="2" />
              <line x1="100" y1="188" x2="100" y2="196" stroke="#C5A869" strokeWidth="2" />
              <line x1="4" y1="100" x2="12" y2="100" stroke="#C5A869" strokeWidth="2" />
              <line x1="188" y1="100" x2="196" y2="100" stroke="#C5A869" strokeWidth="2" />
              
              {/* Corner Diamond Markers */}
              <polygon points="100,6 103,10 100,14 97,10" fill="#C5A869" />
              <polygon points="100,186 103,190 100,194 97,190" fill="#C5A869" />
              <polygon points="6,100 10,103 14,100 10,97" fill="#C5A869" />
              <polygon points="186,100 190,103 194,100 190,97" fill="#C5A869" />
            </g>

            {/* Sacred Dual Squares (Octagram) */}
            <g className="sigil-middle-star">
              <rect
                x="44"
                y="44"
                width="112"
                height="112"
                stroke="rgba(197, 168, 105, 0.65)"
                strokeWidth="1.2"
                fill="none"
              />
              <rect
                x="44"
                y="44"
                width="112"
                height="112"
                stroke="rgba(220, 20, 40, 0.55)"
                strokeWidth="1"
                fill="none"
                transform="rotate(45 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="56"
                stroke="rgba(233, 228, 218, 0.25)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            </g>

            {/* Inner Sanctuary Monogram: Cathedral Arch & Crown */}
            <g className="sigil-inner-monogram">
              <circle
                cx="100"
                cy="100"
                r="38"
                fill="#0A0B0E"
                stroke="rgba(197, 168, 105, 0.85)"
                strokeWidth="1.5"
              />
              {/* Gothic Cathedral Spire / Chevron Iconography */}
              <path
                d="M100 74 L114 96 L108 96 L100 84 L92 96 L86 96 Z"
                fill="url(#goldGrad)"
              />
              <path
                d="M100 88 L110 104 L105 104 L100 96 L95 104 L90 104 Z"
                fill="rgba(220, 20, 40, 0.8)"
              />
              {/* Alchemical Pedestal Line */}
              <line x1="88" y1="116" x2="112" y2="116" stroke="#C5A869" strokeWidth="1.5" />
              <line x1="93" y1="120" x2="107" y2="120" stroke="#8A151B" strokeWidth="1" />
              <circle cx="100" cy="110" r="2.5" fill="#E9E4DA" />
            </g>

            <defs>
              <linearGradient id="goldGrad" x1="86" y1="74" x2="114" y2="96" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF2D1" />
                <stop offset="0.5" stopColor="#C5A869" />
                <stop offset="1" stopColor="#8A6B2D" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ceremonial Text & Real-Time Progress */}
        <div className="preloader-meta-cluster">
          <span className="preloader-kicker">THE STATE OF CLAMOUR</span>
          
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

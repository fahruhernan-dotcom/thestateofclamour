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

        {/* Official 3D Chrome TSOC Emblem with Orbiting Celestial Rings */}
        <div className="preloader-emblem-wrap">
          {/* Orbiting Sacred Geometry Ring around Logo */}
          <svg
            className="preloader-halo-svg"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Cardinal Ring with Gothic Dash Marks */}
            <g className="sigil-outer-ring">
              <circle
                cx="100"
                cy="100"
                r="95"
                stroke="rgba(197, 168, 105, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="4 6 12 6"
              />
              <circle
                cx="100"
                cy="100"
                r="89"
                stroke="rgba(220, 20, 40, 0.35)"
                strokeWidth="0.8"
              />
              <line x1="100" y1="2" x2="100" y2="10" stroke="#C5A869" strokeWidth="2" />
              <line x1="100" y1="190" x2="100" y2="198" stroke="#C5A869" strokeWidth="2" />
              <line x1="2" y1="100" x2="10" y2="100" stroke="#C5A869" strokeWidth="2" />
              <line x1="190" y1="100" x2="198" y2="100" stroke="#C5A869" strokeWidth="2" />

              <polygon points="100,3 103,7 100,11 97,7" fill="#C5A869" />
              <polygon points="100,189 103,193 100,197 97,193" fill="#C5A869" />
              <polygon points="3,100 7,103 11,100 7,97" fill="#C5A869" />
              <polygon points="189,100 193,103 197,100 193,97" fill="#C5A869" />
            </g>

            {/* Sacred Octagram Dual Squares */}
            <g className="sigil-middle-star">
              <rect
                x="32"
                y="32"
                width="136"
                height="136"
                stroke="rgba(197, 168, 105, 0.28)"
                strokeWidth="1"
                fill="none"
              />
              <rect
                x="32"
                y="32"
                width="136"
                height="136"
                stroke="rgba(220, 20, 40, 0.28)"
                strokeWidth="0.9"
                fill="none"
                transform="rotate(45 100 100)"
              />
            </g>
          </svg>

          {/* Official 3D Chrome TSOC Emblem */}
          <div className="preloader-logo-container">
            <img
              src="/assets/tsoc_logo_web.jpg"
              alt="The State of Clamor"
              className="preloader-logo-img"
              width={210}
              height={210}
              loading="eager"
            />
            {/* Chrome Specular Sheen Sweep */}
            <div className="preloader-sheen-sweep" aria-hidden="true" />
          </div>
        </div>

        {/* Ceremonial Text & Real-Time Progress */}
        <div className="preloader-meta-cluster">
          <span className="preloader-kicker">CEREMONIAL ACCESS GATES</span>

          
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

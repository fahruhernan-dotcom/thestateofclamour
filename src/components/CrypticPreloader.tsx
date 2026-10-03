import React, { useEffect, useState, useRef } from 'react';
import { startPreload, subscribePreloader, startBackgroundPreloadRemaining, unlockScrollManually } from '../utils/mediaPreloader';

interface CrypticPreloaderProps {
  onComplete?: () => void;
}

export const CrypticPreloader: React.FC<CrypticPreloaderProps> = ({ onComplete }) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showBypassButton, setShowBypassButton] = useState<boolean>(false);

  const realPercentRef = useRef<number>(0);
  const displayPercentRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const minTimePassedRef = useRef<boolean>(false);
  const completedRef = useRef<boolean>(false);

  // Status ritual label selector tied to genuine loading milestones
  const getRitualStatus = (val: number): string => {
    if (val < 25) return 'INITIALIZING SANCTUARY ARCHIVES';
    if (val < 55) return 'SYNCING NOCTURNAL FRAMES';
    if (val < 85) return 'BUFFERING CEREMONIAL FOOTAGE';
    if (val < 100) return 'ALIGNING AUDIO-VISUAL VEIL';
    return 'SANCTUARY UNLOCKED';
  };

  const handleManualBypass = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    displayPercentRef.current = 100;
    setDisplayPercent(100);

    setIsFadingOut(true);
    document.body.style.overflow = '';
    unlockScrollManually();
    startBackgroundPreloadRemaining();
    onComplete?.();

    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  };

  useEffect(() => {
    // 1. Lock document scrolling during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Smooth fade-in entrance on mount
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 30);

    // 3. Minimum display time: 750ms so preloader sequence is visible and elegant
    const minTimer = setTimeout(() => {
      minTimePassedRef.current = true;
    }, 750);

    // 4. Graceful bypass button reveal if network is very slow (after 7s)
    const bypassTimer = setTimeout(() => {
      if (!completedRef.current) {
        setShowBypassButton(true);
      }
    }, 7000);

    // 5. Ultimate safety failsafe timeout: 12s (for emergency/offline situations)
    const safetyTimer = setTimeout(() => {
      if (!completedRef.current) {
        realPercentRef.current = 100;
        minTimePassedRef.current = true;
      }
    }, 12000);

    // 6. Start genuine media preloader pipeline (monitors real frames & video buffer)
    startPreload();
    const unsubscribe = subscribePreloader((s) => {
      realPercentRef.current = s.percent;
      if (s.isComplete) {
        realPercentRef.current = 100;
      }
    });

    // 7. Smooth asymptotic interpolation loop (fluid & responsive to actual load)
    const updateInterpolation = () => {
      const target = realPercentRef.current;
      const current = displayPercentRef.current;

      const effectiveTarget = !minTimePassedRef.current && target > 85 ? 85 : target;

      if (current < effectiveTarget) {
        const step = Math.max(0.7, (effectiveTarget - current) * 0.14);
        const next = Math.min(effectiveTarget, current + step);
        displayPercentRef.current = next;
        setDisplayPercent(Math.floor(next));
      }

      // Trigger smooth fade-out dissolve when real progress reaches completion
      if (displayPercentRef.current >= 99.2 && minTimePassedRef.current && !completedRef.current) {
        completedRef.current = true;
        displayPercentRef.current = 100;
        setDisplayPercent(100);

        // Crisp 150ms hold at 100% so user registers unlock without sluggishness
        setTimeout(() => {
          setIsFadingOut(true);
          document.body.style.overflow = originalOverflow;
          startBackgroundPreloadRemaining();
          onComplete?.();

          // Unmount after smooth CSS fade-out finishes (0.7s)
          setTimeout(() => {
            setIsDismissed(true);
          }, 700);
        }, 150);

        return;
      }

      animFrameRef.current = requestAnimationFrame(updateInterpolation);
    };

    animFrameRef.current = requestAnimationFrame(updateInterpolation);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(enterTimer);
      clearTimeout(minTimer);
      clearTimeout(bypassTimer);
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

          {/* Graceful Slow Connection Bypass */}
          {showBypassButton && !completedRef.current && (
            <button
              type="button"
              onClick={handleManualBypass}
              className="preloader-bypass-btn"
            >
              ENTER SANCTUARY &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


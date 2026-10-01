/**
 * Empirical Cinematic Timeline & Scroll Choreography Mapping
 * Source of truth: public/assets/hero_scroll_cinematic.mp4 (15.02s @ 24fps)
 */

export const HERO_VIDEO_CONFIG = {
  duration: 5.08,
  fps: 24,
  totalFrames: 122,
  src: '/assets/hero_scroll_cinematic.mp4',
  poster: '/assets/hero_scroll_poster.jpg',
  trackHeightVhDesktop: 165,
  trackHeightVhMobile: 145,
};

export const HERO_CINEMATIC_BEATS = {
  // Exact video timestamps (seconds)
  timestamps: {
    establishingStart: 0.0,
    approachStart: 2.0,
    doorOpenStart: 4.08, // Image 1 (Frame 98: Doors unlock, red light glow)
    doorBurstEnd: 5.08,  // Image 2 (Frame 122: Red smoke explosion & 100% blackout)
  },

  // Non-linear scroll choreography [startProgress, endProgress] (0.0 to 1.0)
  scrollMap: {
    establishing: [0.00, 0.20],    // Distant Continental view, full headline readability
    typographyFade: [0.04, 0.22],  // Headline dissolves and drifts upward
    approachDoor: [0.20, 0.75],    // Camera pushes in down boulevard to the gates (Frame 1 -> 95)
    smokeFadeBlack: [0.75, 1.00],  // Image 1 -> Image 2: Smoke explosion, smooth fade to black -> Section 1
  },
};

/**
 * Maps normalized scroll progress (0.0 to 1.0) to non-linear target video time (seconds).
 * Enables non-linear pacing so key moments (like door explosion) receive intentional cinematic weight.
 */
export function mapScrollProgressToVideoTime(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  const { timestamps, scrollMap } = HERO_CINEMATIC_BEATS;

  // 1. Establishing beat (0.00 -> 0.20) maps to 0.0s -> 2.0s
  if (p <= scrollMap.establishing[1]) {
    const ratio = p / scrollMap.establishing[1];
    return timestamps.establishingStart + ratio * (timestamps.approachStart - timestamps.establishingStart);
  }

  // 2. Approach door beat (0.20 -> 0.75) maps to 2.0s -> 4.08s (Image 1)
  if (p <= scrollMap.approachDoor[1]) {
    const ratio = (p - scrollMap.approachDoor[0]) / (scrollMap.approachDoor[1] - scrollMap.approachDoor[0]);
    return timestamps.approachStart + ratio * (timestamps.doorOpenStart - timestamps.approachStart);
  }

  // 3. Smoke explosion & blackout beat (0.75 -> 1.00) maps to 4.08s -> 5.08s (Image 2)
  const ratio = (p - scrollMap.smokeFadeBlack[0]) / (scrollMap.smokeFadeBlack[1] - scrollMap.smokeFadeBlack[0]);
  return timestamps.doorOpenStart + ratio * (timestamps.doorBurstEnd - timestamps.doorOpenStart);
}

export interface DoorFrameOpening {
  width: number;
  height: number;
  xCenter: number;
  yTop: number;
  yBottom: number;
}

export const DOOR_FRAME_TRACKING_TABLE: Record<number, DoorFrameOpening> = {
  88: { width: 17, height: 269, xCenter: 647.5, yTop: 320, yBottom: 589 },
  89: { width: 19, height: 292, xCenter: 648.5, yTop: 296, yBottom: 588 },
  90: { width: 23, height: 298, xCenter: 648.5, yTop: 290, yBottom: 588 },
  91: { width: 26, height: 304, xCenter: 649.0, yTop: 283, yBottom: 587 },
  92: { width: 31, height: 310, xCenter: 649.5, yTop: 276, yBottom: 586 },
  93: { width: 35, height: 316, xCenter: 649.5, yTop: 270, yBottom: 586 },
  94: { width: 40, height: 321, xCenter: 650.0, yTop: 264, yBottom: 585 },
  95: { width: 44, height: 328, xCenter: 650.0, yTop: 257, yBottom: 585 },
  96: { width: 50, height: 333, xCenter: 650.0, yTop: 251, yBottom: 584 },
  97: { width: 56, height: 314, xCenter: 650.0, yTop: 270, yBottom: 584 },
  98: { width: 63, height: 327, xCenter: 650.5, yTop: 256, yBottom: 583 },
  99: { width: 70, height: 333, xCenter: 651.0, yTop: 250, yBottom: 583 },
  100: { width: 78, height: 328, xCenter: 651.0, yTop: 255, yBottom: 583 },
  101: { width: 87, height: 332, xCenter: 651.5, yTop: 250, yBottom: 582 },
  102: { width: 96, height: 332, xCenter: 652.0, yTop: 250, yBottom: 582 },
  103: { width: 107, height: 280, xCenter: 651.5, yTop: 301, yBottom: 581 },
  104: { width: 117, height: 284, xCenter: 652.5, yTop: 297, yBottom: 581 },
  105: { width: 128, height: 287, xCenter: 653.0, yTop: 293, yBottom: 580 },
  106: { width: 139, height: 291, xCenter: 653.5, yTop: 289, yBottom: 580 },
  107: { width: 151, height: 295, xCenter: 653.5, yTop: 285, yBottom: 580 },
  108: { width: 163, height: 299, xCenter: 653.5, yTop: 281, yBottom: 580 },
  109: { width: 176, height: 301, xCenter: 654.0, yTop: 278, yBottom: 579 },
  110: { width: 190, height: 305, xCenter: 654.0, yTop: 274, yBottom: 579 },
  111: { width: 203, height: 309, xCenter: 654.5, yTop: 270, yBottom: 579 },
  112: { width: 218, height: 312, xCenter: 654.0, yTop: 267, yBottom: 579 },
  113: { width: 228, height: 314, xCenter: 652.0, yTop: 264, yBottom: 578 },
  114: { width: 237, height: 318, xCenter: 649.5, yTop: 260, yBottom: 578 },
  115: { width: 246, height: 330, xCenter: 646.0, yTop: 257, yBottom: 587 },
  116: { width: 255, height: 339, xCenter: 643.5, yTop: 254, yBottom: 593 },
  117: { width: 259, height: 358, xCenter: 642.5, yTop: 251, yBottom: 609 },
  118: { width: 277, height: 360, xCenter: 635.5, yTop: 250, yBottom: 610 },
  119: { width: 274, height: 369, xCenter: 639.0, yTop: 250, yBottom: 619 },
  120: { width: 297, height: 369, xCenter: 628.5, yTop: 250, yBottom: 619 },
  121: { width: 315, height: 369, xCenter: 628.5, yTop: 250, yBottom: 619 },
};

export function getDoorOpeningGeometry(frame: number): DoorFrameOpening {
  if (frame <= 88) {
    return DOOR_FRAME_TRACKING_TABLE[88];
  }
  if (frame >= 121) {
    return DOOR_FRAME_TRACKING_TABLE[121];
  }

  const f0 = Math.floor(frame);
  const f1 = Math.ceil(frame);
  const t = frame - f0;

  const g0 = DOOR_FRAME_TRACKING_TABLE[f0] || DOOR_FRAME_TRACKING_TABLE[88];
  const g1 = DOOR_FRAME_TRACKING_TABLE[f1] || DOOR_FRAME_TRACKING_TABLE[121];

  return {
    width: g0.width + (g1.width - g0.width) * t,
    height: g0.height + (g1.height - g0.height) * t,
    xCenter: g0.xCenter + (g1.xCenter - g0.xCenter) * t,
    yTop: g0.yTop + (g1.yTop - g0.yTop) * t,
    yBottom: g0.yBottom + (g1.yBottom - g0.yBottom) * t,
  };
}

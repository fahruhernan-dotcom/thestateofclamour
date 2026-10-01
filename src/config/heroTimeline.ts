/**
 * Empirical Cinematic Timeline & Scroll Choreography Mapping
 * Source of truth: public/assets/hero_scroll_cinematic.mp4 (15.02s @ 24fps)
 */

export const HERO_VIDEO_CONFIG = {
  duration: 15.02,
  fps: 24,
  src: '/assets/hero_scroll_cinematic.mp4',
  poster: '/assets/hero_scroll_poster.jpg',
  // Initial hypothesis: generous breathing room for cinematic door blast & interior journey
  initialTrackHeightVhDesktop: 260,
  initialTrackHeightVhMobile: 220,
};

export const HERO_CINEMATIC_BEATS = {
  // Exact video timestamps (seconds) — immutable source of truth verified visually via contact sheet
  timestamps: {
    establishingStart: 0.0,
    approachStart: 2.0,
    doorOpenStart: 4.5,
    thresholdCross: 6.5,
    interiorVortex: 9.5,
    fadeToDark: 11.5,
    blackoutStart: 12.5,
    videoEnd: 15.02,
  },

  // Non-linear scroll choreography [startProgress, endProgress] (0.0 to 1.0)
  // Provides deliberate pacing and breathing room for each cinematic beat
  scrollMap: {
    establishing: [0.00, 0.18],    // 0.0s - 2.0s: Distant Continental view, full headline readability
    typographyFade: [0.04, 0.25],  // Headline dissolves and drifts upward as camera pushes into street
    approachDoor: [0.18, 0.38],    // 2.0s - 4.5s: Camera sweeps forward down the rainy boulevard
    doorBurst: [0.38, 0.55],       // 4.5s - 6.5s: Cathedral gates swing open with billowing red cloud
    crossThreshold: [0.55, 0.72],  // 6.5s - 9.5s: Camera glides past gates into the inner sanctum
    vortexFade: [0.72, 0.832],     // 9.5s - 12.5s: Swirling crimson vortex dims and fades out
    blackoutVoid: [0.832, 1.00],   // 12.5s - 15.02s: 100% black screen, flawless match cut into Section 1
  },
};

/**
 * Maps normalized scroll progress (0.0 to 1.0) to non-linear target video time (seconds).
 * Enables non-linear pacing so key moments (like door explosion) receive intentional cinematic weight.
 */
export function mapScrollProgressToVideoTime(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  const { timestamps, scrollMap } = HERO_CINEMATIC_BEATS;

  // 1. Establishing beat (0.00 -> 0.18) maps to 0.0s -> 2.0s
  if (p <= scrollMap.establishing[1]) {
    const ratio = p / scrollMap.establishing[1];
    return timestamps.establishingStart + ratio * (timestamps.approachStart - timestamps.establishingStart);
  }

  // 2. Approach door beat (0.18 -> 0.38) maps to 2.0s -> 4.5s
  if (p <= scrollMap.approachDoor[1]) {
    const ratio = (p - scrollMap.approachDoor[0]) / (scrollMap.approachDoor[1] - scrollMap.approachDoor[0]);
    return timestamps.approachStart + ratio * (timestamps.doorOpenStart - timestamps.approachStart);
  }

  // 3. Door burst beat (0.38 -> 0.55) maps to 4.5s -> 6.5s
  if (p <= scrollMap.doorBurst[1]) {
    const ratio = (p - scrollMap.doorBurst[0]) / (scrollMap.doorBurst[1] - scrollMap.doorBurst[0]);
    return timestamps.doorOpenStart + ratio * (timestamps.thresholdCross - timestamps.doorOpenStart);
  }

  // 4. Cross threshold beat (0.55 -> 0.72) maps to 6.5s -> 9.5s
  if (p <= scrollMap.crossThreshold[1]) {
    const ratio = (p - scrollMap.crossThreshold[0]) / (scrollMap.crossThreshold[1] - scrollMap.crossThreshold[0]);
    return timestamps.thresholdCross + ratio * (timestamps.interiorVortex - timestamps.thresholdCross);
  }

  // 5. Vortex fade beat (0.72 -> 0.832) maps to 9.5s -> 12.5s
  if (p <= scrollMap.vortexFade[1]) {
    const ratio = (p - scrollMap.vortexFade[0]) / (scrollMap.vortexFade[1] - scrollMap.vortexFade[0]);
    return timestamps.interiorVortex + ratio * (timestamps.blackoutStart - timestamps.interiorVortex);
  }

  // 6. Blackout void beat (0.832 -> 1.00) maps to 12.5s -> 15.02s
  const ratio = (p - scrollMap.blackoutVoid[0]) / (scrollMap.blackoutVoid[1] - scrollMap.blackoutVoid[0]);
  return timestamps.blackoutStart + ratio * (timestamps.videoEnd - timestamps.blackoutStart);
}

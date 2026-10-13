// easing.ts — semua kurva dan konfigurasi spring, masing-masing diberi nama.
import {Easing, interpolate} from 'remotion';

export const ease = {
  // Entrance: expo out
  entrance: Easing.bezier(0.16, 1, 0.3, 1),
  // Exit: expo in
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  // Gerak kamera: in-out cubic
  camera: Easing.bezier(0.65, 0, 0.35, 1),
  // Transisi besar: expo in-out
  big: Easing.bezier(0.87, 0, 0.13, 1),
} as const;

export const springs = {
  // UI tanpa overshoot
  ui: {damping: 200},
  // Micro-pop ±3% overshoot
  pop: {damping: 20, stiffness: 180, mass: 1},
} as const;

// Helper: progres 0→1 di antara dua frame dengan kurva tertentu (clamped).
export const progress = (
  frame: number,
  start: number,
  end: number,
  curve: (t: number) => number = ease.entrance,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: curve,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Helper: campur dua nilai.
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

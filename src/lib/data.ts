// Data grafik "Kas masuk" kumulatif (dalam juta rupiah), deterministik.
import {random} from 'remotion';

const N = 16;

// Kenaikan harian acak (pakai random(seed) → hasil render selalu sama),
// lalu diskalakan supaya totalnya pas dengan angka di kartu.
const cumulative = (seed: string, total: number, lumpiness: number) => {
  const steps = new Array(N - 1).fill(0).map((_, i) => {
    const r = random(`${seed}-${i}`);
    return 0.35 + Math.pow(r, lumpiness) * 1.6;
  });
  const sum = steps.reduce((a, b) => a + b, 0);
  const out = [total * 0.04];
  for (const s of steps) out.push(out[out.length - 1] + (s / sum) * total * 0.96);
  return out;
};

export const series = {
  // Sebelum klik: tampilan "7 hari" → total Rp 84,2 jt
  before: cumulative('arus-7', 84.2, 2.2),
  // Sesudah klik "30 hari" → total Rp 128,4 jt
  after: cumulative('arus-30', 128.4, 1.6),
};

export const yMax = 140; // jt
export const yTicks = [0, 40, 80, 120];
export const xLabels = {
  before: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  after: ['1 Okt', '8 Okt', '15 Okt', '22 Okt', '30 Okt'],
};

// theme.ts — satu-satunya sumber warna, font, shadow, radius, dan grid.
// Ubah tampilan video cukup dari file ini.

import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadVariableFont as loadNewsreader} from '@remotion/google-fonts/Newsreader';

// ── Warna ────────────────────────────────────────────────────────────────
// Hanya warna di bawah ini yang boleh dipakai.
export const color = {
  bg: '#FAF9F5', // latar, ivory hangat
  surface: '#F0EEE6', // permukaan
  line: '#E8E6DC', // garis / hairline
  ink: '#141413', // teks
  ink2: '#5E5D59', // teks sekunder
  ink3: '#B0AEA5', // teks tersier (dekoratif saja: kontras < AA)
  accent: '#D97757', // terakota — satu fokus per layar
  positive: '#788C5D', // khusus elemen kecil, mis. pill "+52%"
  dark: '#141413', // scene gelap (bukan hitam murni)
} as const;

// Warna dengan alpha, tetap diturunkan dari palet di atas.
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// ── Font ─────────────────────────────────────────────────────────────────
// loadFont() memanggil delayRender() di balik layar: Remotion tidak akan
// merender satu frame pun sebelum semua file font di bawah selesai dimuat.
const inter = loadInter('normal', {weights: ['500', '600'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['400', '500'], subsets: ['latin']});
// Variable font supaya sumbu optical size (opsz) tersedia untuk headline.
const serif = loadNewsreader('normal', {subsets: ['latin']});
const serifItalic = loadNewsreader('italic', {subsets: ['latin']});

export const font = {
  serif: serif.fontFamily,
  sans: inter.fontFamily,
  mono: mono.fontFamily,
} as const;

export const fontsReady = Promise.all([
  inter.waitUntilDone(),
  mono.waitUntilDone(),
  serif.waitUntilDone(),
  serifItalic.waitUntilDone(),
]);

// Gaya teks yang dipakai berulang.
export const type = {
  // Headline: Newsreader display, 112–144px, tracking -0.02em, lh 1.02.
  headline: (size: number) =>
    ({
      fontFamily: font.serif,
      fontSize: size,
      fontWeight: 400,
      letterSpacing: '-0.02em',
      lineHeight: 1.02,
      fontVariationSettings: "'opsz' 72",
      textWrap: 'balance',
      color: color.ink,
    }) as const,
  // Label teknis: JetBrains Mono uppercase 22px, tracking 0.08em.
  label: {
    fontFamily: font.mono,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  } as const,
  // Semua angka di UI memakai tabular-nums.
  num: {fontVariantNumeric: 'tabular-nums'} as const,
};

// ── Permukaan ──────────────────────────────────────────────────────────────
export const radius = {
  card: 16, // kartu
  inner: 10, // elemen di dalam kartu (konsentris: 16 − padding visual)
  frame: 20, // frame video
  pill: 999,
} as const;

// Shadow berlapis bernuansa hangat (warna dasar = ink #141413).
export const shadow = {
  card: [
    '0 1px 2px rgba(20,20,19,.06)',
    '0 8px 24px rgba(20,20,19,.08)',
    '0 24px 64px rgba(20,20,19,.10)',
  ].join(', '),
  // Versi lembut untuk kartu yang berada DI DALAM kartu lain (kartu metrik),
  // supaya bayangan tidak saling menumpuk. Lapisannya sama, alpha diperkecil.
  inset: [
    '0 1px 2px rgba(20,20,19,.04)',
    '0 8px 24px rgba(20,20,19,.04)',
  ].join(', '),
} as const;

// Shadow kartu yang tampil konsisten di layar walau objeknya diskalakan
// kamera: offset & blur dibagi skala kamera (k).
export const shadowAt = (k: number, strength = 1) =>
  [
    `0 ${1 / k}px ${2 / k}px rgba(20,20,19,${0.06 * strength})`,
    `0 ${8 / k}px ${24 / k}px rgba(20,20,19,${0.08 * strength})`,
    `0 ${24 / k}px ${64 / k}px rgba(20,20,19,${0.1 * strength})`,
  ].join(', ');

// Cahaya kunci dari kiri atas: highlight gradien ±3% di tepi atas kartu.
export const keyLight = (strength = 0.03) =>
  `linear-gradient(170deg, rgba(255,255,255,${strength}) 0%, rgba(255,255,255,0) 30%)`;

// ── Kanvas & grid ──────────────────────────────────────────────────────────
export const W = 1920;
export const H = 1080;
export const FPS = 60;

// Grid 12 kolom, margin 120px, gutter 24px → lebar kolom 118px.
export const grid = {
  margin: 120,
  gutter: 24,
  col: (W - 2 * 120 - 11 * 24) / 12, // 118
};
// Tepi kiri kolom ke-n (1-based).
export const colX = (n: number) => grid.margin + (n - 1) * (grid.col + grid.gutter);
// Rentang kolom a..b → {x, w}.
export const span = (a: number, b: number) => ({
  x: colX(a),
  w: colX(b) + grid.col - colX(a),
});

// Title-safe 90%.
export const titleSafe = {x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9};

// Layout dashboard Arus untuk tiap format video (satuan desain).
// Reflow antar format = interpolasi setiap kotak (shared element), bukan crop.
export type Rect = {x: number; y: number; w: number; h: number};

export type DashLayout = {
  w: number;
  h: number;
  sidebar: number; // 1 = sidebar tampil, 0 = disembunyikan (meluncur ke kiri)
  sidebarW: number;
  brand: {x: number; y: number}; // logo + wordmark
  header: Rect;
  metrics: [Rect, Rect, Rect, Rect];
  chart: Rect;
};

const row4 = (x: number, y: number, w: number, h: number, gap: number) =>
  [0, 1, 2, 3].map((i) => ({x: x + i * (w + gap), y, w, h})) as DashLayout['metrics'];

export const layouts: Record<'wide' | 'tall' | 'square', DashLayout> = {
  // 16:9 — sidebar kiri, 4 kartu metrik sebaris, grafik lebar
  wide: {
    w: 1600,
    h: 900,
    sidebar: 1,
    sidebarW: 264,
    brand: {x: 32, y: 34},
    header: {x: 312, y: 36, w: 1252, h: 64},
    metrics: row4(312, 124, 298, 150, 20),
    chart: {x: 312, y: 294, w: 1252, h: 570},
  },
  // 9:16 — tanpa sidebar, grafik di atas, kartu metrik bertumpuk vertikal
  tall: {
    w: 900,
    h: 1600,
    sidebar: 0,
    sidebarW: 264,
    brand: {x: 40, y: 44},
    header: {x: 40, y: 112, w: 820, h: 64},
    metrics: [0, 1, 2, 3].map((i) => ({x: 40, y: 868 + i * 176, w: 820, h: 160})) as DashLayout['metrics'],
    chart: {x: 40, y: 204, w: 820, h: 640},
  },
  // 1:1 — kartu metrik jadi grid 2×2, grafik di bawah
  square: {
    w: 1200,
    h: 1200,
    sidebar: 0,
    sidebarW: 264,
    brand: {x: 40, y: 40},
    header: {x: 40, y: 104, w: 1120, h: 64},
    metrics: [
      {x: 40, y: 192, w: 550, h: 150},
      {x: 610, y: 192, w: 550, h: 150},
      {x: 40, y: 362, w: 550, h: 150},
      {x: 610, y: 362, w: 550, h: 150},
    ],
    chart: {x: 40, y: 532, w: 1120, h: 628},
  },
};

const l = (a: number, b: number, t: number) => a + (b - a) * t;
const lr = (a: Rect, b: Rect, t: number): Rect => ({
  x: l(a.x, b.x, t),
  y: l(a.y, b.y, t),
  w: l(a.w, b.w, t),
  h: l(a.h, b.h, t),
});

export const lerpLayout = (a: DashLayout, b: DashLayout, t: number): DashLayout => ({
  w: l(a.w, b.w, t),
  h: l(a.h, b.h, t),
  sidebar: l(a.sidebar, b.sidebar, t),
  sidebarW: l(a.sidebarW, b.sidebarW, t),
  brand: {x: l(a.brand.x, b.brand.x, t), y: l(a.brand.y, b.brand.y, t)},
  header: lr(a.header, b.header, t),
  metrics: a.metrics.map((m, i) => lr(m, b.metrics[i], t)) as DashLayout['metrics'],
  chart: lr(a.chart, b.chart, t),
});

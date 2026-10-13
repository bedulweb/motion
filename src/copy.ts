// copy.ts — SEMUA teks yang tampil di video. Ganti teks cukup di sini.
//
// Aturan:
// - Kata yang diapit *bintang* = kata penekanan (Newsreader italic, terakota).
// - Batas kata dicek otomatis saat render. Kalau melebihi batas, render
//   BERHENTI dengan pesan error — teks tidak pernah dipotong diam-diam.
//
// ⚠️ DRAFT: brief masih berisi placeholder ([COPY 1] dst.). Teks di bawah
//    adalah draf sementara untuk style frame, BELUM disetujui. Ganti dengan
//    copy final sebelum render.
export const COPY_IS_DRAFT = true;

export const copy = {
  // COPY 1 — prompt yang diketik di terminal (maks. 5 kata)
  prompt: 'buat video launch untuk Arus',
  // COPY 2 — headline scene build (maks. 5 kata)
  build: 'Dari satu prompt, jadi *produk*.',
  // COPY 3 — headline multi-format (maks. 4 kata)
  formats: 'Satu video, *semua* format.',
  // COPY 4 — kalimat reveal (maks. 5 kata)
  reveal: 'Dibuat sepenuhnya dengan *Claude Code*.',
  // COPY 5 — CTA
  cta: {
    title: 'Motion Graphics dengan Claude Code', // maks. 5 kata
    date: 'Sabtu, 24 Oktober 2026 · 19.00 WIB',
    link: 'contoh.id/daftar',
  },
} as const;

// Teks UI produk fiktif "Arus" (bukan copy kampanye, bebas diubah).
export const ui = {
  workspace: 'PT Sinar Rasa',
  page: 'Ringkasan',
  period: '1–30 Oktober 2026',
  nav: ['Ringkasan', 'Arus kas', 'Transaksi', 'Faktur', 'Rekening', 'Laporan'],
  navBadge: {Faktur: '3'} as Record<string, string>,
  metrics: [
    {label: 'Saldo kas', value: 'Rp 412,6 jt', note: '+8,4%', noteTone: 'neutral'},
    {label: 'Kas keluar', value: 'Rp 61,7 jt', note: '−3,2%', noteTone: 'neutral'},
    {label: 'Piutang', value: 'Rp 27,9 jt', note: '7 faktur', noteTone: 'neutral'},
    {label: 'Runway', value: '18 bulan', note: 'aman', noteTone: 'neutral'},
  ],
  chart: {
    title: 'Kas masuk',
    from: 'Rp 84,2 jt',
    to: 'Rp 128,4 jt',
    delta: '+52%',
    deltaNote: 'vs periode lalu',
    ranges: ['7 hari', '30 hari', '90 hari'],
  },
  toast: {title: 'Pembayaran baru masuk', amount: 'Rp 4,8 jt'},
  formats: ['9:16 · REELS', '16:9 · LINKEDIN', '1:1 · FEED'],
  terminalDir: '~/arus-launch',
  log: [
    '✓ theme.ts',
    '✓ Scene1Hook.tsx',
    '✓ Scene2Build.tsx',
    '✓ Scene3Showcase.tsx',
    '✓ Scene4Formats.tsx',
    '✓ Render selesai · arus-launch.mp4 · 15 dtk',
  ],
};

// ── Penjaga batas kata ─────────────────────────────────────────────────────
export const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean);

const LIMITS: [string, string, number][] = [
  ['COPY 1 (prompt)', copy.prompt, 5],
  ['COPY 2 (build)', copy.build, 5],
  ['COPY 3 (formats)', copy.formats, 4],
  ['COPY 4 (reveal)', copy.reveal, 5],
  ['COPY 5 (judul webinar)', copy.cta.title, 5],
];
for (const [name, text, max] of LIMITS) {
  const n = wordsOf(text).length;
  if (n > max) {
    throw new Error(
      `${name} berisi ${n} kata, batasnya ${max}. Render dihentikan — perbaiki copy di src/copy.ts.`,
    );
  }
}

// Pecah teks menjadi token kata + penanda penekanan (*kata*).
// Tanda baca setelah bintang penutup ("*produk*.") disimpan di `tail` dan
// tampil dengan gaya normal.
export type Word = {text: string; em: boolean; tail: string};
export const parseEmphasis = (s: string): Word[] => {
  const out: Word[] = [];
  let inEm = false;
  for (const raw of wordsOf(s)) {
    let t = raw;
    let tail = '';
    if (t.startsWith('*')) {
      inEm = true;
      t = t.slice(1);
    }
    const em = inEm;
    const closeIdx = t.indexOf('*');
    if (closeIdx !== -1) {
      tail = t.slice(closeIdx + 1);
      t = t.slice(0, closeIdx);
      inEm = false;
    }
    out.push({text: t, em, tail});
  }
  return out;
};

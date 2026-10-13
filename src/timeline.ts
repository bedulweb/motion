// timeline.ts — SEMUA nomor frame dikumpulkan di sini (60 fps).
// Ritme: grid 120 BPM → 1 ketukan = 30 frame. Setiap HIT wajib kelipatan 30.

export const BEAT = 30;
export const DURATION = 900; // 15,0 detik

export const T = {
  s1: {
    start: 0,
    typeEnd: 60, // COPY 1 selesai diketik
    blink: [60, 84] as const, // kursor berkedip sekali (satu-satunya on/off keras)
    enter: 84, // Enter ditekan, baris berkedip terakota 6 frame
    enterFlash: 6,
    push: [0, 120] as const, // kamera push-in pelan 1.00 → 1.05
    expand: [90, 120] as const, // HIT f90: kursor membesar memenuhi layar
  },
  s2: {
    start: 120,
    grid: [120, 144] as const, // garis grid tergambar dari tengah ke luar
    headlineIn: [126, 166] as const, // COPY 2 masuk kata per kata
    build: [140, 240] as const, // dashboard menyusun diri
    chartDraw: [180, 230] as const, // garis grafik tergambar (evolvePath)
    areaLag: 8, // area fill menyusul 8 frame di belakang ujung garis
    pulse: [230, 254] as const, // pulse ring titik terakota
    hold: [166, 286] as const,
    headlineOut: [286, 300] as const,
  },
  s3: {
    start: 300,
    push: [300, 330] as const, // HIT f330: push-in ke kartu grafik (1 → 2.4)
    pointer: [336, 384] as const, // kursor mouse masuk lewat kurva bezier
    hover: 378,
    click: 390, // HIT f390
    morph: [396, 432] as const, // interpolatePath 36 frame
    odometer: [396, 440] as const,
    toast: 420, // HIT f420
    pill: 436,
  },
  s4: {
    start: 450,
    pull: [450, 480] as const, // HIT f480: pull-out cepat (2.4 → 0.55)
    headlineIn: [480, 516] as const,
    clones: [480, 510] as const, // dua klon meluncur, stagger 6
    morph: [510, 540] as const, // HIT f540: 9:16 dan 1:1, reflow
    labels: [540, 560] as const,
    hold: [516, 618] as const,
    headlineOut: [618, 630] as const,
  },
  s5: {
    start: 630,
    pull: [630, 660] as const, // HIT f660: kamera mundur ke desktop
    log: [636, 676] as const, // stagger 4 frame per baris
    progress: [648, 690] as const, // HIT f690: progress bar 100%
    recede: [690, 714] as const,
    revealIn: [696, 736] as const, // COPY 4 kata per kata
    toCard: [774, 798] as const, // HIT f780: COPY 4 jadi header kartu CTA
    ctaIn: [780, 816] as const, // COPY 5, stagger 6
    sheen: [840, 870] as const, // kilau di pill link, sekali
    hold: [816, 900] as const,
    blinkPeriod: 30,
  },
} as const;

// Semua HIT (dipakai checklist & timing-sheet).
export const HITS = [
  {frame: 90, what: 'Kursor blok membesar memenuhi layar', sfx: 'whoosh (riser pendek)'},
  {frame: 330, what: 'Push-in mendarat di kartu grafik', sfx: 'whoosh mendarat / low thud'},
  {frame: 390, what: 'Klik tombol "30 hari"', sfx: 'klik'},
  {frame: 420, what: 'Toast pembayaran masuk', sfx: 'ding lembut'},
  {frame: 480, what: 'Pull-out: dashboard di dalam frame 16:9', sfx: 'whoosh (reverse)'},
  {frame: 540, what: 'Klon morph jadi 9:16 dan 1:1', sfx: 'pop ganda'},
  {frame: 660, what: 'Kamera mundur: desktop + terminal', sfx: 'whoosh lembut'},
  {frame: 690, what: 'Progress render 100%', sfx: 'ding'},
  {frame: 780, what: 'COPY 4 menjadi header kartu CTA', sfx: 'swell / pad masuk'},
] as const;

for (const h of HITS) {
  if (h.frame % BEAT !== 0) throw new Error(`HIT f${h.frame} tidak jatuh di grid ${BEAT} frame`);
}

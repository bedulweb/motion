# Arus Launch — Storyboard Teknis (Fase 1a)

Video 15,0 dtk · 1920×1080 · 60 fps · 900 frame · grid 120 BPM (1 ketukan = 30 frame).
Semua nomor frame di sini juga ada di `src/timeline.ts`. Nama kurva mengacu ke `src/easing.ts`:

| Nama kurva | Definisi |
|---|---|
| `entrance` | cubic-bezier(0.16, 1, 0.3, 1), expo out |
| `exit` | cubic-bezier(0.7, 0, 0.84, 0), expo in |
| `camera` | cubic-bezier(0.65, 0, 0.35, 1), in-out cubic |
| `big` | cubic-bezier(0.87, 0, 0.13, 1), expo in-out |
| `spring.ui` | `{damping: 200}`, tanpa overshoot |
| `spring.pop` | `{damping: 20, stiffness: 180, mass: 1}`, overshoot ±3% |
| `sin4s` | ambient float: sin(2π·f/240) × 4px |
| `hard` | on/off keras (hanya kedipan kursor) |

> **Status copy:** brief masih berisi placeholder (`[COPY 1]`, `[COPY 2]`, …, `[JUDUL WEBINAR]`, `[TANGGAL & JAM]`, `[LINK DAFTAR]`).
> Supaya style frame bisa dinilai dengan panjang teks yang realistis, aku memakai **draf sementara** di `src/copy.ts`
> (ditandai `COPY_IS_DRAFT = true`). Semua draf masih di bawah batas kata. Draf ini **belum** dianggap copy final.
>
> | Slot | Batas | Draf sementara | Jumlah kata |
> |---|---|---|---|
> | COPY 1 | 5 | buat video launch untuk Arus | 5 |
> | COPY 2 | 5 | Dari satu prompt, jadi \*produk\*. | 5 |
> | COPY 3 | 4 | Satu video, \*semua\* format. | 4 |
> | COPY 4 | 5 | Dibuat sepenuhnya dengan \*Claude Code\*. | 5 |
> | Judul webinar | 5 | Motion Graphics dengan Claude Code | 5 |
> | Tanggal & jam | – | Sabtu, 24 Oktober 2026 · 19.00 WIB | – |
> | Link | – | contoh.id/daftar | – |
>
> `copy.ts` menghentikan render dengan pesan error kalau ada copy yang melebihi batas, jadi teks tidak pernah terpotong diam-diam.

---

## Model dunia & kamera (berlaku untuk semua scene)

- **Satu kanvas dunia** dalam satuan piksel. Kamera = `{x, y, scale}` di atas dunia. Grain dan vignette berada di luar kamera, jadi menempel di layar.
- **Parallax**: tiap lapisan punya kedalaman `k`: depan `1.15`, tengah `1.00`, belakang `0.85`. Skala lapisan = `scaleᵏ`, geser = `geser × k`.
- **Frame 16:9 = layar scene 2–3.** Bidang ivory yang kita lihat di scene 2 adalah isi frame video 16:9 berukuran 1920×1080 satuan dunia.
  Pada pull-out scene 4 (2.4 → 0.55), tepi frame (radius 20, shadow berlapis, hairline) memudar masuk, sehingga terungkap bahwa semua yang tadi kita tonton
  adalah sebuah video 16:9. Di luar frame, "meja" dunia berwarna `#F0EEE6`.
- **Dashboard Arus**: dirancang di 1600×900 satuan desain, tampil di dunia dengan skala 0.6 (960×540). Dengan skala ini, kartu grafik pada kamera 2.4
  selebar ±1800px dan semua teks di dalamnya tetap di dalam title-safe.

---

## SCENE 1 — HOOK "Prompt" (f0–120)

| Frame | Elemen | Properti | Nilai awal → akhir | Kurva |
|---|---|---|---|---|
| f0 | Latar | warna | `#141413` + grain 3% (ganti tiap 2 frame) + vignette | — |
| f0 | Teks COPY 1 | karakter tampil | sudah ±6 karakter (pengetikan dimulai sebelum f0, *pre-roll*) | — |
| f0–60 | Teks COPY 1 | ketik per huruf | 1–3 frame/huruf, jeda 4–6 frame setelah spasi/koma, `random(seed)` | mesin tik |
| f0–60 | Kursor blok | opacity | 1 (solid selama mengetik) | — |
| f0–120 | Kamera | scale (jangkar = kursor) | 1.00 → 1.05 | `camera` |
| f0–120 | Kotak prompt | float | ±2px (ambient, sangat halus) | `sin4s` |
| f60–84 | Kursor blok | opacity | on f60–71 → off f72–83 → on f84 | `hard` |
| f84–90 | Baris prompt | tint + ring terakota | 0 → 0.10 → 0 (6 frame) | `entrance`/`exit` |
| f84–90 | Teks "~/arus-launch" + ">" | opacity | 1 → 0.5 (sekunder, +3 frame) | `exit` |
| **f90 [HIT]**–120 | Kursor blok | x, y, w, h | 24×48 di ujung teks → 1920×1080 penuh layar | `big` + motion blur |
| f90–120 | Kursor blok | warna | `#D97757` → `#FAF9F5`, interpolasi OKLCH (`color-mix(in oklch)`) | `big` |
| f96–114 | Teks terminal | opacity, blur | 1 → 0, 0 → 4px (keluar lebih dulu, tertelan kursor) | `exit` |
| f120 | Layar | — | 100% ivory `#FAF9F5` | — |

## SCENE 2 — BUILD "Prompt jadi produk" (f120–300)

| Frame | Elemen | Properti | Nilai awal → akhir | Kurva |
|---|---|---|---|---|
| f120–144 | Garis panduan hairline 1px `#E8E6DC` (di bidang dashboard) | panjang (dari titik tengah garis ke luar), stagger 2 frame dari pusat | 0 → 100% | `entrance` |
| f126–166 | COPY 2 (kolom 1–5, Newsreader 120px) | per kata: y, blur | 110% → 0, 6px → 0, stagger 4, 22 frame/kata | `entrance` |
| f140–158 | Logo + item sidebar | opacity, x | 0 → 1, −16px → 0, stagger 3 | `entrance` |
| f146–188 | 4 kartu metrik (gelombang diagonal dari kiri atas) | y, scale, blur, opacity | +32px → 0, 0.97 → 1, 8px → 0, 0 → 1; stagger 4; 30 frame | `entrance` |
| f158–188 | Kartu grafik | sama dengan kartu metrik | +32px → 0, 0.97 → 1, 8px → 0 | `entrance` |
| f160–180 | Skeleton | kilau menyapu | 20 frame, lalu crossfade 10 frame ke konten | linear (opacity saja) |
| f180–220 | Angka kartu metrik | hitung naik | 0 → nilai akhir | `entrance` |
| f180–230 | Garis grafik | `evolvePath` | 0 → 1 (50 frame) | `camera` (in-out) |
| f188–238 | Area fill | ujung klip menyusul ujung garis | lag 8 frame | `camera` |
| f180–230 | Titik terakota | posisi | menunggangi ujung garis | ikut garis |
| f230–254 | Pulse ring | radius, opacity | 8 → 34px, 0.5 → 0 | `entrance` |
| f190–220 | Garis panduan | opacity bagian di luar kartu | 1 → 0 (tinggal tepi kartu) | `exit` |
| f120–300 | Dashboard 3D | rotateY / rotateX | −12° → −6° / 6° (perspective 2400px) | `camera` |
| f120–300 | Kamera | drift x | 0 → −1.5% (−29px) | `camera` |
| f120–300 | Dashboard | float | ±4px, periode 4 dtk | `sin4s` |
| f166–286 | Hold | — | headline terbaca penuh; UI hanya bergerak ambient | — |
| f286–300 | COPY 2 | y, opacity (per kata, stagger 2) | 0 → −24px, 1 → 0 | `exit` |

## SCENE 3 — SHOWCASE "Fitur dari dekat" (f300–450), tanpa copy

| Frame | Elemen | Properti | Nilai awal → akhir | Kurva |
|---|---|---|---|---|
| f300–**330 [HIT]** | Kamera | scale, pusat | 1 → 2.4, menuju pusat kartu grafik | `camera` + motion blur |
| f300–330 | Dashboard | rotateY / rotateX, posisi | −6° → 0° / 6° → 0°, geser ke tengah frame 16:9 | `camera` |
| f300–330 | Elemen di luar fokus (sidebar, header, kartu metrik) | blur, opacity | 0 → 10px, 1 → 0.6 (rack focus) | `camera` |
| f336–384 | Kursor mouse | posisi di kurva bezier kubik dari kanan bawah | luar layar → tombol "30 hari", overshoot 4px lalu mengendap | `entrance` + spring.ui untuk settle |
| f378–386 | Tombol "30 hari" | tint latar (hover) | 0 → 5% ink | `entrance` |
| **f390 [HIT]** | Kursor mouse | scale | 1 → 0.9 (4 frame) → 1 | `exit` lalu spring.pop |
| f390–408 | Ring klik terakota | diameter, opacity | 0 → 48px, 0.5 → 0 | `entrance` |
| f390–402 | Indikator segmen aktif | x | "7 hari" → "30 hari" | spring.ui |
| f396–432 | Garis grafik | `interpolatePath` data 7 hari → 30 hari | 0 → 1 (36 frame) | `camera` |
| f396–432 | Label sumbu-x | crossfade | Sen…Min → 1 Okt…30 Okt | linear (opacity) |
| f396–440 | Angka utama (odometer) | gulir per kolom digit, stagger 2 dari kanan ke kiri | "Rp 84,2 jt" → "Rp 128,4 jt" | `entrance` |
| **f420 [HIT]** | Toast | x, shadow | +40px → 0, shadow kecil → shadow berlapis penuh | spring.pop |
| f424–436 | Isi toast (baris kedua) | opacity | 0 → 1 (sekunder, +4 frame) | `entrance` |
| f436 | Pill "+52%" | scale | 0 → 1 (overshoot ±3%) | spring.pop |
| f440–452 | Teks "vs periode lalu" | opacity | 0 → 1 | `entrance` |
| f300–450 | Kamera | drift | ±6px | `sin4s` |

## SCENE 4 — MULTI-FORMAT (f450–630)

| Frame | Elemen | Properti | Nilai awal → akhir | Kurva |
|---|---|---|---|---|
| f450–**480 [HIT]** | Kamera | scale | 2.4 → 0.55 | `big` + motion blur |
| f450–480 | Dashboard di dalam frame | skala dunia | 0.6 → 0.85 (memenuhi frame) | `big` |
| f450–480 | Rack focus | blur, opacity | 10px → 0, 0.6 → 1 | `big` |
| f462–480 | Tepi frame 16:9 | radius, shadow, hairline | 0 → 20px, 0 → penuh | `entrance` |
| f480–516 | COPY 3 (atas tengah, Newsreader 120px) | per kata: y, blur | 110% → 0, 6px → 0, stagger 4 | `entrance` |
| f480–510 | Klon kiri | x | posisi frame asli → kiri | `camera` |
| f486–516 | Klon kanan (stagger 6) | x | posisi frame asli → kanan | `camera` |
| f480–540 | Kamera (lanjutan, lihat Interpretasi #2) | scale | 0.55 → 0.44 | `camera` |
| f510–**540 [HIT]** | Klon kiri | bentuk + isi | 16:9 → 9:16, kartu bertumpuk vertikal (shared element) | `big` |
| f514–544 | Klon kanan | bentuk + isi | 16:9 → 1:1, kartu metrik jadi grid 2×2 (shared element) | `big` |
| f540–560 | Label mono uppercase 22px | y, opacity, stagger 4 | +12px → 0, 0 → 1 | `entrance` |
| f480–630 | Tiap frame | pulse titik grafik, offset 10 frame antar frame | loop 60 frame | `entrance` |
| f516–618 | Hold | — | — | — |
| f618–630 | COPY 3 | y, opacity | 0 → −24px, 1 → 0 | `exit` |

## SCENE 5 — REVEAL + CTA (f630–900)

| Frame | Elemen | Properti | Nilai awal → akhir | Kurva |
|---|---|---|---|---|
| f630–**660 [HIT]** | Kamera | scale + pan | 0.44 → 0.25, pan ke kiri: terminal (kolom 1–5) + tiga frame (kolom 6–12) | `camera` + motion blur |
| f636–676 | Log terminal (6 baris) | y, opacity, stagger 4 | +10px → 0, 0 → 1 | `entrance` |
| f648–**690 [HIT]** | Progress bar terakota | lebar | 0 → 100% | `entrance` |
| f648–690 | Kepala progress = kursor blok scene 1 | x | ikut ujung bar | `entrance` |
| f690–714 | Seluruh desktop | scale, blur, opacity | 1 → 0.96, 0 → 6px, 1 → 0.35 | `exit` |
| f696–736 | COPY 4 (tengah, Newsreader 140px) | per kata: y, blur | 110% → 0, 6px → 0, stagger 4 | `entrance` |
| f774–**798 [HIT f780]** | COPY 4 | posisi, ukuran (shared element) | tengah 140px → header kartu CTA 72px | `big` |
| f780–804 | Kartu CTA | opacity, scale, shadow | 0 → 1, 0.97 → 1 | spring.ui |
| f780 / 786 / 792 | Judul webinar / tanggal / pill link | y, blur, opacity (stagger 6) | +24px → 0, 6px → 0, 0 → 1 | `entrance` |
| f840–870 | Kilau di pill link | posisi gradien | −30% → 130%, sekali | `camera` |
| f816–900 | Kursor blok setelah link | opacity | kedip periode 30 frame | `hard` |
| f816–900 | Hold | — | hanya grain + kedipan kursor | — |

---

## Interpretasi yang aku ambil supaya spesifikasi bisa berjalan (bukan perubahan kreatif)

1. **Pengetikan pre-roll.** 28 karakter × 1–3 frame + 4 jeda × 4–6 frame ≈ 70–80 frame, lebih dari 60 frame. Jadi pengetikan "dimulai" sebelum f0 dan ±6 karakter
   sudah tampil di f0. Ini sejalan dengan "di frame 0 teks SUDAH sedang diketik", dan karakter terakhir tetap jatuh sebelum f60.
2. **Pull-out scene 4 berlanjut halus 0.55 → 0.44 (f480–540).** Di skala 0.55, frame 16:9 selebar 1056px. Kalau ditambah 9:16 (334px) dan 1:1 (594px) dengan tinggi
   yang sama, totalnya 1984px, lebih lebar dari layar. Di skala 0.44, ketiganya pas di grid 12 kolom (1680px). Gerakan ini menumpang di slide klon, jadi tidak terasa sebagai gerak kamera baru.
3. **Tilt dashboard jadi 0° saat push-in scene 3**, supaya kartu grafik tajam dan frontal di 2.4×, dan supaya frame 16:9 berisi shot yang rapi saat pull-out.
4. **Urutan frame scene 4:** 9:16 (kiri) · 16:9 (tengah, frame asli) · 1:1 (kanan).
5. **Grafik garis berwarna ink, bukan terakota.** Aturan "satu fokus terakota per layar" sudah dipakai oleh kata penekanan dan titik grafik. Area fill memakai ink 9% → 0%.
6. **Teks link di pill terakota berwarna ink** (kontras 5,90:1). Ivory di atas terakota hanya 2,96:1 dan gagal AA.
7. **Baris log terpanjang dibungkus dua baris** di terminal 28px ("Render selesai ·" / "arus-launch.mp4 · 15 dtk"). Teksnya sama persis, hanya pemenggalan barisnya yang berubah.
8. **Toast tetap menjadi bagian UI** dan ikut masuk ke frame 16:9 serta reflow.

## Usulan (belum diterapkan, menunggu persetujuanmu)

| # | Usulan | Alasan | Style frame |
|---|---|---|---|
| U1 | **Serah-terima aksen di CTA.** Saat COPY 4 menjadi header kartu (f780–798), warna kata penekanan berpindah terakota → ink. Pill link menjadi gelap `#141413` dengan teks ivory, dan kursor blok terakota berkedip *di dalam* pill. | (a) Hanya ada satu fokus terakota di frame terakhir, yaitu kursor. (b) Bookend sempurna dengan scene 1: latar gelap, teks ivory, kursor terakota. (c) Kontras teks link naik dari 5,9:1 menjadi 17,5:1. (d) Kursor terakota tidak menempel janggal di luar pill terakota. | `SF5-CTA-usulan.png` |
| U2 | **Desktop di belakang CTA meredup lebih jauh, 0.35 → 0.16 (f780–816).** | Di 0.35, terminal gelap yang di-blur jadi blok abu-abu keruh di belakang kartu. Thumbnail jadi kurang bersih. | `SF5-CTA-usulan.png` |
| U3 | **Pill "+52%" di f426, bukan f436**, dan toast tetap di f420. | Mata sedang berada di angka (kiri) saat odometer berhenti. Pill yang muncul lebih dekat ke momen itu mengurangi bolak-balik kiri → kanan (toast) → kiri. Catatan: f426 tetap 6 frame setelah toast, jadi tidak melanggar stagger. | — |

## Kontras (WCAG)

| Pasangan | Rasio | AA |
|---|---|---|
| Ink di ivory | 17,50 | ✔ |
| Teks sekunder di ivory / surface | 6,26 / 5,67 | ✔ |
| Ivory di positif (pill "+52%", 20px bold → 29px di layar) | 3,49 | ✔ (teks besar) |
| Ink di terakota (teks link) | 5,90 | ✔ |
| Teks tersier di gelap (label terminal) | 8,29 | ✔ |
| **Terakota di ivory** (kata penekanan) | **2,96** | ✘ selisih 0,04 dari 3:1 untuk teks besar |
| **Terakota di surface** (COPY 3 di scene 4) | **2,69** | ✘ |
| Teks tersier di ivory | 2,11 | ✘ hanya dipakai untuk dekorasi |

Terakota tidak bisa mencapai 3:1 di atas latar palet mana pun yang terang. Kata penekanan selalu ≥112px, serif italic, dan berada dalam kalimat yang konteksnya jelas,
jadi aku mencatatnya sebagai kompromi palet, bukan menggantinya dengan warna di luar palet.

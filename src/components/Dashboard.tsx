// Dashboard — UI produk fiktif "Arus" (dashboard arus kas), DOM + SVG.
// Semua ukuran dalam satuan desain; skala ke dunia dilakukan oleh pemanggil.
// `state` berisi nilai animasi; default = dashboard sudah tersusun penuh.
import React from 'react';
import {ui} from '../copy';
import {DashLayout, Rect} from '../lib/layouts';
import {alpha, color, font, keyLight, radius, shadow, type} from '../theme';
import {Counter} from './Counter';
import {LineChart} from './LineChart';
import {Logo} from './Logo';

export type DashState = {
  navIn: (i: number) => number; // 0→1 per item sidebar
  cardIn: (i: number) => number; // 0..3 = kartu metrik, 4 = kartu grafik
  skeleton: number; // 1 = skeleton shimmer, 0 = konten
  shimmer: number; // posisi kilau skeleton 0→1
  count: number; // 0→1 angka metrik menghitung naik
  chartDraw: number;
  chartArea: number;
  morph: number; // 0 = 7 hari, 1 = 30 hari
  pulse: number | null;
  dotScale: number;
  odometerStart: number | null; // frame mulai odometer; null = tampil statis
  staticValue: 'from' | 'to';
  range: number; // 0 = "7 hari" aktif, 1 = "30 hari" aktif
  hover: number; // tint hover pada tombol "30 hari"
  pillPop: number; // skala pill "+52%" (0 = belum tampil)
  dim: (part: 'sidebar' | 'header' | 'metric' | 'chart') => {blur: number; opacity: number};
};

export const builtState: DashState = {
  navIn: () => 1,
  cardIn: () => 1,
  skeleton: 0,
  shimmer: 0,
  count: 1,
  chartDraw: 1,
  chartArea: 1,
  morph: 1,
  pulse: null,
  dotScale: 1,
  odometerStart: null,
  staticValue: 'to',
  range: 1,
  hover: 0,
  pillPop: 1,
  dim: () => ({blur: 0, opacity: 1}),
};

// Kartu muncul: y +32 → 0, scale 0.97 → 1, blur 8 → 0.
const cardInStyle = (p: number): React.CSSProperties =>
  p >= 1
    ? {}
    : {
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${(1 - p) * 32}px) scale(${0.97 + 0.03 * p})`,
        filter: `blur(${(1 - p) * 8}px)`,
      };

const dimStyle = (d: {blur: number; opacity: number}): React.CSSProperties =>
  d.blur <= 0.01 && d.opacity >= 0.999 ? {} : {filter: `blur(${d.blur}px)`, opacity: d.opacity};

const box = (r: Rect): React.CSSProperties => ({
  position: 'absolute',
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

const cardSurface: React.CSSProperties = {
  background: color.bg,
  backgroundImage: keyLight(),
  border: `1px solid ${color.line}`,
  borderRadius: radius.card,
  boxShadow: shadow.inset,
  overflow: 'hidden',
};

// Skeleton: blok abu hangat dengan kilau yang menyapu.
const Skel: React.FC<{w: number | string; h: number; shimmer: number; style?: React.CSSProperties}> = ({w, h, shimmer, style}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius.inner * 0.6,
      background: `linear-gradient(100deg, ${color.surface} ${shimmer * 160 - 40}%, ${color.line} ${shimmer * 160 - 20}%, ${color.surface} ${shimmer * 160}%)`,
      ...style,
    }}
  />
);

const MetricCard: React.FC<{r: Rect; i: number; s: DashState}> = ({r, i, s}) => {
  const m = ui.metrics[i];
  const content = 1 - s.skeleton;
  // angka menghitung naik: ambil angka di string dan skalakan
  const shown = m.value.replace(/[\d]+([.,]\d+)?/, (num) => {
    const n = Number(num.replace(',', '.'));
    const v = n * s.count;
    const dec = num.includes(',') ? 1 : 0;
    return v.toFixed(dec).replace('.', ',');
  });
  return (
    <div style={{...box(r), ...cardSurface, ...cardInStyle(s.cardIn(i)), ...dimStyle(s.dim('metric'))}}>
      <div style={{position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: content}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontFamily: font.sans, fontWeight: 500, fontSize: 17, color: color.ink2}}>{m.label}</span>
          <span
            style={{
              fontFamily: font.sans,
              fontWeight: 500,
              fontSize: 14,
              color: color.ink2,
              background: color.surface,
              borderRadius: radius.pill,
              padding: '4px 10px',
              ...type.num,
            }}
          >
            {m.note}
          </span>
        </div>
        <div style={{fontFamily: font.sans, fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em', color: color.ink, ...type.num}}>
          {shown}
        </div>
      </div>
      {s.skeleton > 0 && (
        <div style={{position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: s.skeleton}}>
          <Skel w="40%" h={16} shimmer={s.shimmer} />
          <Skel w="62%" h={30} shimmer={s.shimmer} />
        </div>
      )}
    </div>
  );
};

const Segmented: React.FC<{s: DashState}> = ({s}) => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      padding: 5,
      gap: 4,
      background: color.surface,
      borderRadius: radius.inner + 5,
      border: `1px solid ${color.line}`,
    }}
  >
    {/* indikator aktif meluncur dari "7 hari" ke "30 hari" */}
    <div
      style={{
        position: 'absolute',
        top: 5,
        left: 5 + s.range * 108,
        width: 104,
        height: 46,
        background: color.bg,
        borderRadius: radius.inner,
        boxShadow: '0 1px 2px rgba(20,20,19,.08), 0 2px 6px rgba(20,20,19,.05)',
      }}
    />
    {ui.chart.ranges.map((label, k) => {
      const active = k === 0 ? 1 - s.range : k === 1 ? s.range : 0;
      return (
        <div
          key={label}
          data-range={label}
          style={{
            position: 'relative',
            width: 104,
            height: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.inner,
            background: k === 1 && s.hover > 0 ? alpha(color.ink, 0.05 * s.hover * (1 - s.range)) : undefined,
            fontFamily: font.sans,
            fontWeight: active > 0.5 ? 600 : 500,
            fontSize: 21,
            color: active > 0.5 ? color.ink : color.ink2,
          }}
        >
          {label}
        </div>
      );
    })}
  </div>
);

const ChartCard: React.FC<{r: Rect; s: DashState}> = ({r, s}) => {
  const pad = 36;
  const headerH = 152;
  const value =
    s.odometerStart === null ? (
      s.staticValue === 'from' ? ui.chart.from : ui.chart.to
    ) : (
      <Counter from={ui.chart.from} to={ui.chart.to} start={s.odometerStart} />
    );
  return (
    <div style={{...box(r), ...cardSurface, ...cardInStyle(s.cardIn(4)), ...dimStyle(s.dim('chart'))}}>
      {/* Baris 1: judul + filter. Baris 2: angka utama + pill. Tahan reflow. */}
      <div style={{position: 'absolute', left: pad, top: pad - 6, right: pad, display: 'flex', flexDirection: 'column', gap: 4, opacity: 1 - s.skeleton}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 58}}>
          <span style={{fontFamily: font.sans, fontWeight: 500, fontSize: 19, color: color.ink2}}>{ui.chart.title}</span>
          <Segmented s={s} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap'}}>
          <span style={{fontFamily: font.sans, fontWeight: 600, fontSize: 60, letterSpacing: '-0.025em', color: color.ink, lineHeight: 1.15, ...type.num}}>
            {value}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: font.sans,
              fontWeight: 600,
              fontSize: 20,
              color: color.bg,
              background: color.positive,
              borderRadius: radius.pill,
              padding: '6px 14px',
              transform: `scale(${s.pillPop})`,
              opacity: Math.min(1, s.pillPop * 2),
              transformOrigin: 'left center',
              ...type.num,
            }}
          >
            {ui.chart.delta}
          </span>
          <span style={{fontFamily: font.sans, fontWeight: 500, fontSize: 17, color: color.ink2, opacity: Math.min(1, Math.max(0, s.pillPop * 2 - 1))}}>
            {ui.chart.deltaNote}
          </span>
        </div>
      </div>
      {s.skeleton > 0 && (
        <div style={{position: 'absolute', left: pad, top: pad, right: pad, bottom: pad, display: 'flex', flexDirection: 'column', gap: 16, opacity: s.skeleton}}>
          <Skel w={140} h={18} shimmer={s.shimmer} />
          <Skel w={320} h={52} shimmer={s.shimmer} />
          <Skel w="100%" h={r.h - pad * 2 - 120} shimmer={s.shimmer} style={{marginTop: 16}} />
        </div>
      )}
      <div style={{position: 'absolute', left: pad - 8, top: headerH + 24, opacity: 1 - s.skeleton}}>
        <LineChart
          w={r.w - pad * 2 + 8}
          h={r.h - headerH - 24 - pad + 8}
          draw={s.chartDraw}
          area={s.chartArea}
          morph={s.morph}
          pulse={s.pulse}
          dotScale={s.dotScale}
          fontSize={16}
        />
      </div>
    </div>
  );
};

export const Dashboard: React.FC<{layout: DashLayout; state?: Partial<DashState>}> = ({layout: L, state}) => {
  const s: DashState = {...builtState, ...state};
  const sb = L.sidebar;
  const sbDim = s.dim('sidebar');
  return (
    <div
      style={{
        position: 'relative',
        width: L.w,
        height: L.h,
        background: color.surface,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          position: 'absolute',
          left: -(1 - sb) * L.sidebarW * 0.4,
          top: 0,
          width: L.sidebarW,
          height: L.h,
          borderRight: `1px solid ${alpha(color.ink, 0.06 * sb)}`,
          opacity: sb,
          ...dimStyle(sbDim),
        }}
      >
        <div style={{position: 'absolute', left: 24, right: 24, top: 108, display: 'flex', flexDirection: 'column', gap: 4}}>
          {ui.nav.map((item, i) => {
            const p = s.navIn(i);
            const active = i === 0;
            return (
              <div
                key={item}
                style={{
                  height: 48,
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: radius.inner,
                  background: active ? color.bg : undefined,
                  boxShadow: active ? '0 1px 2px rgba(20,20,19,.06)' : undefined,
                  fontFamily: font.sans,
                  fontWeight: active ? 600 : 500,
                  fontSize: 18,
                  color: active ? color.ink : color.ink2,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -16}px)`,
                }}
              >
                <span>{item}</span>
                {ui.navBadge[item] && (
                  <span style={{fontFamily: font.mono, fontSize: 14, color: color.ink2, ...type.num}}>{ui.navBadge[item]}</span>
                )}
              </div>
            );
          })}
        </div>
        {/* Workspace di bawah sidebar */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 28, display: 'flex', alignItems: 'center', gap: 12, opacity: s.navIn(ui.nav.length)}}>
          <div style={{width: 36, height: 36, borderRadius: radius.inner, background: color.line, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 600, fontSize: 15, color: color.ink2}}>
            SR
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontFamily: font.sans, fontWeight: 600, fontSize: 16, color: color.ink}}>{ui.workspace}</span>
            <span style={{fontFamily: font.sans, fontWeight: 500, fontSize: 14, color: color.ink2}}>Paket Bisnis</span>
          </div>
        </div>
      </div>

      {/* Brand: logo + wordmark */}
      <div style={{position: 'absolute', left: L.brand.x, top: L.brand.y, display: 'flex', alignItems: 'center', gap: 12, opacity: s.navIn(-1), ...dimStyle(sbDim)}}>
        <Logo size={40} />
        <span style={{fontFamily: font.sans, fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: color.ink}}>Arus</span>
      </div>

      {/* Header halaman */}
      <div style={{...box(L.header), display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: s.cardIn(-1), ...dimStyle(s.dim('header'))}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <span style={{fontFamily: font.sans, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: color.ink}}>{ui.page}</span>
          <span style={{fontFamily: font.sans, fontWeight: 500, fontSize: 16, color: color.ink2}}>{ui.period}</span>
        </div>
        <div
          style={{
            height: 44,
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: radius.inner,
            border: `1px solid ${color.line}`,
            background: color.bg,
            fontFamily: font.sans,
            fontWeight: 600,
            fontSize: 16,
            color: color.ink,
          }}
        >
          Ekspor laporan
        </div>
      </div>

      {L.metrics.map((r, i) => (
        <MetricCard key={i} r={r} i={i} s={s} />
      ))}
      <ChartCard r={L.chart} s={s} />
    </div>
  );
};

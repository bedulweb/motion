// Style frame — satu still per scene (Fase 1, pra-produksi).
// Memakai komponen yang sama dengan video final, dalam pose "hero".
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {copy, ui} from '../copy';
import {BlockCursor, Pointer} from '../components/Cursor';
import {Dashboard, DashState} from '../components/Dashboard';
import {Grain} from '../components/Grain';
import {MaskText} from '../components/MaskText';
import {PromptBox, TerminalWindow} from '../components/Terminal';
import {Toast} from '../components/Toast';
import {FRAME, VideoFrame} from '../components/VideoFrame';
import {layouts} from '../lib/layouts';
import {alpha, color, font, H, radius, shadowAt, span, type, W} from '../theme';

const DONE = -1000; // start jauh di masa lalu → animasi sudah selesai

// ── SF1: Hook — terminal gelap, prompt diketik ───────────────────────────
export const SF1: React.FC = () => {
  const box = span(1, 8);
  const push = 1.04;
  // kamera push-in berjangkar di kursor
  const anchor = {x: 120 + 36 + 24 * (2 + copy.prompt.length) + 12, y: 540};
  return (
    <AbsoluteFill style={{background: color.dark}}>
      <AbsoluteFill
        style={{
          transform: `scale(${push})`,
          transformOrigin: `${anchor.x}px ${anchor.y}px`,
        }}
      >
        <div style={{position: 'absolute', left: box.x, top: 540 - 56 - 44}}>
          <PromptBox typed={copy.prompt} cursorOn width={box.w} />
        </div>
      </AbsoluteFill>
      <Grain opacity={0.05} vignette={0.25} />
    </AbsoluteFill>
  );
};

// ── SF2: Build — headline kiri, dashboard 3D kanan ───────────────────────
export const DASH_SCENE_SCALE = 0.6; // 1600×900 desain → 960×540 dunia

const Guides: React.FC<{w: number; h: number; ext: number}> = ({w, h, ext}) => {
  // garis panduan di bidang dashboard, memanjang keluar dari tepi kartu
  const L = layouts.wide;
  const xs = [0, L.sidebarW, L.header.x, ...L.metrics.map((m) => m.x + m.w), L.w];
  const ys = [0, L.metrics[0].y, L.metrics[0].y + L.metrics[0].h, L.chart.y, L.chart.y + L.chart.h, L.h];
  const s = w / L.w;
  return (
    <>
      {xs.map((x, i) => (
        <div key={`x${i}`} style={{position: 'absolute', left: x * s, top: -ext, width: 1, height: h + ext * 2, background: color.line}} />
      ))}
      {ys.map((y, i) => (
        <div key={`y${i}`} style={{position: 'absolute', top: y * s, left: -ext, height: 1, width: w + ext * 2, background: color.line}} />
      ))}
    </>
  );
};

export const SF2: React.FC = () => {
  const left = span(1, 5);
  const right = span(6, 12);
  const k = DASH_SCENE_SCALE;
  const ww = layouts.wide.w * k;
  const wh = layouts.wide.h * k;
  return (
    <AbsoluteFill style={{background: color.bg}}>
      <AbsoluteFill style={{transform: 'translateX(-14px)'}}>
        {/* dashboard di ruang 3D */}
        <div
          style={{
            position: 'absolute',
            left: right.x + (right.w - ww) / 2,
            top: (H - wh) / 2,
            width: ww,
            height: wh,
            transform: 'perspective(2400px) rotateY(-8deg) rotateX(6deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <Guides w={ww} h={wh} ext={60} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `scale(${k})`,
              transformOrigin: '0 0',
              width: layouts.wide.w,
              height: layouts.wide.h,
              borderRadius: radius.frame / k,
              overflow: 'hidden',
              boxShadow: shadowAt(k),
              outline: `${1 / k}px solid ${color.line}`,
            }}
          >
            <Dashboard layout={layouts.wide} />
          </div>
        </div>
        {/* headline COPY 2 */}
        <div style={{position: 'absolute', left: left.x, width: left.w, top: 0, height: H, display: 'flex', alignItems: 'center'}}>
          <MaskText text={copy.build} start={DONE} style={type.headline(120)} />
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ── SF3: Showcase — kamera 2.4× di kartu grafik ──────────────────────────
export const SF3: React.FC = () => {
  const cam = 2.4;
  const k = DASH_SCENE_SCALE * cam; // skala efektif dashboard di layar
  const L = layouts.wide;
  const c = {x: L.chart.x + L.chart.w / 2, y: L.chart.y + L.chart.h / 2};
  const target = {x: W / 2, y: 610};
  const ox = target.x - c.x * k;
  const oy = target.y - c.y * k;
  // posisi tombol "30 hari" di layar
  const segRight = L.chart.x + L.chart.w - 36;
  const btn = {x: segRight - 5 - 104 - 4 - 52, y: L.chart.y + 32 + 28};
  const btnScreen = {x: ox + btn.x * k, y: oy + btn.y * k};
  const state: Partial<DashState> = {
    dim: (part) => (part === 'chart' ? {blur: 0, opacity: 1} : {blur: 10, opacity: 0.6}),
    pulse: 0.35,
  };
  return (
    <AbsoluteFill style={{background: color.bg}}>
      <div style={{position: 'absolute', left: ox, top: oy, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        <Dashboard layout={L} state={state} />
      </div>
      {/* ring klik + pointer */}
      <div
        style={{
          position: 'absolute',
          left: btnScreen.x - 24,
          top: btnScreen.y - 24,
          width: 48,
          height: 48,
          borderRadius: 99,
          border: `3px solid ${alpha(color.accent, 0.35)}`,
        }}
      />
      <div style={{position: 'absolute', left: btnScreen.x + 6, top: btnScreen.y + 10}}>
        <Pointer size={44} />
      </div>
      {/* toast — lapisan depan */}
      <div style={{position: 'absolute', right: 120, top: 64}}>
        <Toast scale={1.44} />
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ── SF4: Multi-format — tiga frame reflow ────────────────────────────────
export const SF4_CAM = 0.44;
export const formatRow = (cam: number, totalW: number, left: number, top: number) => {
  const ws = [FRAME.tall.w, FRAME.wide.w, FRAME.square.w].map((w) => w * cam);
  const gap = (totalW - ws.reduce((a, b) => a + b, 0)) / 2;
  const xs = [left, left + ws[0] + gap, left + ws[0] + ws[1] + gap * 2];
  return {ws, xs, gap, h: 1080 * cam, top};
};

const FormatsRow: React.FC<{cam: number; totalW: number; left: number; top: number; labels?: boolean}> = ({cam, totalW, left, top, labels = true}) => {
  const row = formatRow(cam, totalW, left, top);
  const order = [
    {aspect: 'tall' as const, label: ui.formats[0]},
    {aspect: 'wide' as const, label: ui.formats[1]},
    {aspect: 'square' as const, label: ui.formats[2]},
  ];
  return (
    <>
      {order.map((o, i) => (
        <React.Fragment key={o.aspect}>
          <div style={{position: 'absolute', left: row.xs[i], top, transform: `scale(${cam})`, transformOrigin: '0 0'}}>
            <VideoFrame from={o.aspect} to={o.aspect} t={0} cam={cam} />
          </div>
          {labels && (
            <div
              style={{
                position: 'absolute',
                left: row.xs[i],
                width: row.ws[i],
                top: top + row.h + 32,
                textAlign: 'center',
                color: color.ink2,
                whiteSpace: 'nowrap',
                ...type.label,
              }}
            >
              {o.label}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export const SF4: React.FC = () => {
  const all = span(1, 12);
  return (
    <AbsoluteFill style={{background: color.surface}}>
      <div style={{position: 'absolute', left: all.x, width: all.w, top: 148}}>
        <MaskText text={copy.formats} start={DONE} align="center" style={type.headline(120)} />
      </div>
      <FormatsRow cam={SF4_CAM} totalW={all.w} left={all.x} top={356} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── Desktop scene 5: terminal kiri + tiga frame kanan ────────────────────
const Desktop: React.FC<{progress: number}> = ({progress}) => {
  const l = span(1, 5);
  const r = span(6, 12);
  const cam = SF4_CAM * (r.w / span(1, 12).w);
  const termH = 600;
  return (
    <>
      <TerminalWindow w={l.w} h={termH} logIn={() => 1} progress={progress} style={{position: 'absolute', left: l.x, top: (H - termH) / 2}} />
      <FormatsRow cam={cam} totalW={r.w} left={r.x} top={(H - 1080 * cam) / 2} labels={false} />
    </>
  );
};

// ── SF5: Reveal + CTA — frame terakhir / thumbnail ───────────────────────
export const SF5Desktop: React.FC = () => (
  <AbsoluteFill style={{background: color.surface}}>
    <Desktop progress={0.86} />
    <Grain />
  </AbsoluteFill>
);

// Judul tanpa kata yatim: dua kata terakhir dikunci satu baris.
const NoOrphan: React.FC<{text: string}> = ({text}) => {
  const w = text.split(' ');
  return (
    <>
      {w.slice(0, -2).join(' ')} <span style={{whiteSpace: 'nowrap'}}>{w.slice(-2).join(' ')}</span>
    </>
  );
};

export const CtaCard: React.FC<{variant?: 'brief' | 'proposal'}> = ({variant = 'brief'}) => {
  const c = span(2, 11);
  const ink = variant === 'proposal';
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        width: c.w,
        top: '50%',
        transform: 'translateY(-50%)',
        background: color.bg,
        borderRadius: radius.card,
        boxShadow: shadowAt(1),
        outline: `1px solid ${color.line}`,
        padding: '72px 80px 72px',
      }}
    >
      <MaskText
        text={copy.reveal}
        start={DONE}
        emColor={ink ? color.ink : color.accent}
        style={type.headline(72)}
      />
      <div style={{height: 1, background: color.line, margin: '48px 0 44px'}} />
      <div style={{fontFamily: font.serif, fontSize: 56, fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.05, fontVariationSettings: "'opsz' 72", color: color.ink, textWrap: 'balance'}}>
        <NoOrphan text={copy.cta.title} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, marginTop: 36}}>
        <div style={{fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2, ...type.num}}>{copy.cta.date}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 72,
              padding: '0 30px',
              borderRadius: radius.pill,
              background: ink ? color.dark : color.accent,
              color: ink ? color.bg : color.ink,
              fontFamily: font.mono,
              fontWeight: 500,
              fontSize: 28,
              whiteSpace: 'nowrap',
            }}
          >
            {copy.cta.link}
            {ink && <BlockCursor w={28 * 0.6} h={28 * 1.2} />}
          </div>
          {!ink && <BlockCursor w={28 * 0.6} h={28 * 1.2} />}
        </div>
      </div>
    </div>
  );
};

export const SF5: React.FC<{variant?: 'brief' | 'proposal'}> = ({variant = 'brief'}) => (
  <AbsoluteFill style={{background: color.surface}}>
    <AbsoluteFill style={{transform: 'scale(0.96)', filter: 'blur(6px)', opacity: variant === 'brief' ? 0.35 : 0.16}}>
      <Desktop progress={1} />
    </AbsoluteFill>
    <CtaCard variant={variant} />
    <Grain />
  </AbsoluteFill>
);

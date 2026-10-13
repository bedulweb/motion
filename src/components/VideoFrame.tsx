// VideoFrame — frame video (radius 20, shadow berlapis) + isi "shot"-nya:
// dashboard Arus di atas latar ivory dengan garis panduan hairline.
import React from 'react';
import {DashLayout, layouts, lerpLayout} from '../lib/layouts';
import {color, radius, shadow, shadowAt} from '../theme';
import {Dashboard, DashState} from './Dashboard';

export type Aspect = 'wide' | 'tall' | 'square';

// Ukuran frame dalam satuan dunia (16:9 = satu layar penuh).
export const FRAME = {
  wide: {w: 1920, h: 1080},
  tall: {w: 608, h: 1080},
  square: {w: 1080, h: 1080},
} as const;

// Skala dashboard di dalam tiap frame (satuan desain → dunia).
export const SHOT_SCALE = {wide: 0.85, tall: 0.58, square: 0.78} as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Isi frame: latar ivory + garis panduan + dashboard di tengah.
export const Shot: React.FC<{
  w: number;
  h: number;
  layout: DashLayout;
  scale: number;
  state?: Partial<DashState>;
  guides?: number; // opacity garis panduan
}> = ({w, h, layout, scale, state, guides = 1}) => {
  const ww = layout.w * scale;
  const wh = layout.h * scale;
  const x = (w - ww) / 2;
  const y = (h - wh) / 2;
  const g = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', background: color.line, opacity: guides, ...style}} />
  );
  return (
    <div style={{position: 'absolute', inset: 0, width: w, height: h, background: color.bg, overflow: 'hidden'}}>
      {/* garis panduan: perpanjangan tepi jendela sampai tepi frame */}
      {g({left: 0, width: w, top: y, height: 1})}
      {g({left: 0, width: w, top: y + wh, height: 1})}
      {g({top: 0, height: h, left: x, width: 1})}
      {g({top: 0, height: h, left: x + ww, width: 1})}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: layout.w,
          height: layout.h,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          borderRadius: radius.card / scale,
          overflow: 'hidden',
          boxShadow: shadow.card,
        }}
      >
        <Dashboard layout={layout} state={state} />
      </div>
    </div>
  );
};

// Frame video: bentuknya bisa morph (16:9 → 9:16 / 1:1) dan isinya REFLOW.
export const VideoFrame: React.FC<{
  from: Aspect;
  to: Aspect;
  t: number; // 0 = from, 1 = to
  chrome?: number; // 0 = tepi frame tak terlihat (sama dengan layar), 1 = tampil
  cam?: number; // skala kamera saat ini → radius & shadow tetap konsisten di layar
  state?: Partial<DashState>;
  style?: React.CSSProperties;
}> = ({from, to, t, chrome = 1, cam = 1, state, style}) => {
  const w = lerp(FRAME[from].w, FRAME[to].w, t);
  const h = lerp(FRAME[from].h, FRAME[to].h, t);
  const layout = lerpLayout(layouts[from], layouts[to], t);
  const scale = lerp(SHOT_SCALE[from], SHOT_SCALE[to], t);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: (radius.frame / cam) * chrome,
        overflow: 'hidden',
        boxShadow: chrome > 0 ? shadowAt(cam, chrome) : undefined,
        outline: chrome > 0 ? `${1 / cam}px solid ${color.line}` : undefined,
        ...style,
      }}
    >
      <Shot w={w} h={h} layout={layout} scale={scale} state={state} />
    </div>
  );
};

// Terminal — dua wujud terminal minimalis ala Claude Code:
// 1. PromptBox: kotak input scene 1 (">" terakota + kursor blok).
// 2. TerminalWindow: jendela gelap scene 5 berisi log + progress bar render.
import React from 'react';
import {copy, ui} from '../copy';
import {alpha, color, font, keyLight, radius, type} from '../theme';
import {BlockCursor} from './Cursor';

const MONO = 40; // ukuran font terminal scene 1

export const PromptBox: React.FC<{
  typed: string; // teks yang sudah terketik
  cursorOn: boolean;
  flash?: number; // 0→1→0: kilatan terakota saat Enter
  width: number;
  hideCursor?: boolean;
  cursorRef?: (el: HTMLDivElement | null) => void;
}> = ({typed, cursorOn, flash = 0, width, hideCursor}) => (
  <div style={{width}}>
    <div style={{fontFamily: font.mono, fontSize: 24, color: color.ink3, marginBottom: 20, marginLeft: 4}}>
      {ui.terminalDir}
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: 112,
        padding: '0 36px',
        borderRadius: radius.card,
        border: `1.5px solid ${alpha(color.bg, 0.16)}`,
        background: flash > 0 ? alpha(color.accent, 0.1 * flash) : 'transparent',
        boxShadow: flash > 0 ? `inset 0 0 0 1.5px ${alpha(color.accent, 0.7 * flash)}` : undefined,
        fontFamily: font.mono,
        fontSize: MONO,
        color: color.bg,
        whiteSpace: 'pre',
      }}
    >
      <span style={{color: color.accent, marginRight: '0.6em'}}>&gt;</span>
      <span>{typed}</span>
      <BlockCursor
        w={MONO * 0.6}
        h={MONO * 1.2}
        style={{opacity: cursorOn && !hideCursor ? 1 : 0, marginLeft: 2}}
      />
    </div>
  </div>
);

export const CURSOR_SIZE = {w: MONO * 0.6, h: MONO * 1.2};

export const TerminalWindow: React.FC<{
  w: number;
  h: number;
  logIn: (i: number) => number; // 0→1 per baris log
  progress: number; // 0→1
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({w, h, logIn, progress, fontSize = 28, style}) => {
  const lh = fontSize * 1.6;
  const pct = Math.round(progress * 100);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        background: color.dark,
        backgroundImage: keyLight(0.04),
        borderRadius: radius.card,
        boxShadow: [
          '0 1px 2px rgba(20,20,19,.06)',
          '0 8px 24px rgba(20,20,19,.08)',
          '0 24px 64px rgba(20,20,19,.10)',
        ].join(', '),
        overflow: 'hidden',
        fontFamily: font.mono,
        fontSize,
        color: color.bg,
        ...style,
      }}
    >
      {/* bilah judul */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${alpha(color.bg, 0.08)}`,
          fontSize: 20,
          color: color.ink3,
        }}
      >
        {ui.terminalDir}
      </div>
      <div style={{padding: `${fontSize * 1.1}px ${fontSize * 1.3}px`, display: 'flex', flexDirection: 'column'}}>
        <div style={{height: lh, display: 'flex', alignItems: 'center', whiteSpace: 'pre', marginBottom: fontSize * 0.5}}>
          <span style={{color: color.accent}}>&gt; </span>
          <span>{copy.prompt}</span>
        </div>
        {ui.log.map((line, i) => {
          const p = logIn(i);
          const [mark, ...rest] = line.split(' ');
          const last = i === ui.log.length - 1;
          return (
            <div
              key={line}
              style={{
                minHeight: lh,
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: (lh - fontSize * 1.25) / 2,
                lineHeight: 1.25,
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
                color: last ? color.bg : alpha(color.bg, 0.78),
              }}
            >
              <span style={{color: color.positive, whiteSpace: 'pre'}}>{mark} </span>
              <span style={{whiteSpace: 'pre-line'}}>{rest.join(' ').replace(' · ', ' ·\n')}</span>
            </div>
          );
        })}
        {/* progress bar: kepalanya adalah kursor blok yang sama dari scene 1 */}
        <div style={{display: 'flex', alignItems: 'center', gap: fontSize * 0.6, marginTop: fontSize * 0.8, height: lh}}>
          <div style={{position: 'relative', flex: 1, height: fontSize * 0.22, borderRadius: 99, background: alpha(color.bg, 0.12)}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, borderRadius: 99, background: color.accent}} />
            <BlockCursor
              w={fontSize * 0.6}
              h={fontSize * 1.2}
              style={{position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%, -50%)'}}
            />
          </div>
          <span style={{width: '4ch', textAlign: 'right', color: color.bg, ...type.num}}>{pct}%</span>
        </div>
      </div>
    </div>
  );
};

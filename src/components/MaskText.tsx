// MaskText — teks muncul kata per kata dari balik mask:
// posisi y 110% → 0 dan blur 6px → 0, kurva entrance (expo out).
// Kata *penekanan* tampil Newsreader italic terakota.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {parseEmphasis} from '../copy';
import {ease, progress} from '../easing';
import {color} from '../theme';

type Props = {
  text: string;
  start: number; // frame kata pertama mulai masuk
  stagger?: number; // jarak antar kata (frame)
  dur?: number; // durasi masuk per kata
  exit?: {start: number; dur: number; y?: number}; // keluar: naik + fade, expo in
  style?: React.CSSProperties;
  emColor?: string;
  align?: 'left' | 'center';
};

export const MaskText: React.FC<Props> = ({
  text,
  start,
  stagger = 4,
  dur = 22,
  exit,
  style,
  emColor = color.accent,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const words = parseEmphasis(text);
  const out = exit ? progress(frame, exit.start, exit.start + exit.dur, ease.exit) : 0;

  const renderWord = (i: number) => {
    const w = words[i];
    const p = progress(frame, start + i * stagger, start + i * stagger + dur, ease.entrance);
    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          // ruang ekstra agar descender & kemiringan italic tidak terpotong mask
          padding: '0 0.1em 0.14em 0.04em',
          margin: '0 -0.1em -0.14em -0.04em',
          verticalAlign: 'top',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: `translateY(${(1 - p) * 110}%)`,
            filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
          }}
        >
          <span style={w.em ? {fontStyle: 'italic', color: emColor} : undefined}>{w.text}</span>
          {w.tail}
        </span>
      </span>
    );
  };

  // Dua kata terakhir dikunci dalam satu baris → tidak ada kata yatim.
  const n = words.length;
  const head = words.slice(0, Math.max(0, n - 2)).map((_, i) => (
    <React.Fragment key={i}>
      {renderWord(i)}{' '}
    </React.Fragment>
  ));
  const tail = (
    <span style={{whiteSpace: 'nowrap'}}>
      {n >= 2 ? (
        <>
          {renderWord(n - 2)} {renderWord(n - 1)}
        </>
      ) : (
        renderWord(n - 1)
      )}
    </span>
  );

  return (
    <div
      style={{
        textAlign: align,
        textWrap: 'balance',
        transform: out ? `translateY(${-(exit?.y ?? 24) * out}px)` : undefined,
        opacity: 1 - out,
        ...style,
      }}
    >
      {head}
      {tail}
    </div>
  );
};

// Counter — angka bergulir ala odometer.
// Tiap kolom digit menggulung dari digit lama ke digit baru; kolom
// di-stagger 2 frame dari kanan ke kiri.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease, progress} from '../easing';
import {type} from '../theme';

type Props = {
  from: string; // mis. "Rp 84,2 jt"
  to: string; // mis. "Rp 128,4 jt"
  start: number;
  dur?: number; // durasi gulir per kolom
  stagger?: number;
  style?: React.CSSProperties;
};

const split = (s: string) => {
  const m = s.match(/^(\D*?)([\d.,]+)(\D*)$/);
  if (!m) return {pre: s, digits: '', post: ''};
  return {pre: m[1], digits: m[2], post: m[3]};
};

export const Counter: React.FC<Props> = ({from, to, start, dur = 30, stagger = 2, style}) => {
  const frame = useCurrentFrame();
  const a = split(from);
  const b = split(to);
  const n = Math.max(a.digits.length, b.digits.length);
  const da = a.digits.padStart(n, ' ');
  const db = b.digits.padStart(n, ' ');

  return (
    <span style={{display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'pre', ...type.num, ...style}}>
      <span>{b.pre}</span>
      {new Array(n).fill(0).map((_, i) => {
        // kanan → kiri: kolom paling kanan mulai duluan
        const order = n - 1 - i;
        const p = progress(frame, start + order * stagger, start + order * stagger + dur, ease.entrance);
        const ca = da[i];
        const cb = db[i];
        const isDigit = (c: string) => /\d/.test(c);
        // kolom baru (mis. "1" di depan "28,4") tumbuh lebarnya dari 0
        const widthFactor = ca === ' ' ? p : cb === ' ' ? 1 - p : 1;
        if (!isDigit(ca) && !isDigit(cb) && ca === cb) {
          return <span key={i}>{cb}</span>;
        }
        // Strip vertikal: digit lama di atas, lalu digit-digit di antaranya,
        // lalu digit baru. Bergulir ke atas.
        const va = isDigit(ca) ? Number(ca) : 0;
        const vb = isDigit(cb) ? Number(cb) : 0;
        const strip: string[] = [ca === ' ' ? ' ' : ca];
        let v = va;
        while (strip.length < 12 && v !== vb) {
          v = (v + 1) % 10;
          strip.push(String(v));
        }
        if (strip.length === 1 && ca !== cb) strip.push(cb);
        if (cb === ' ') strip[strip.length - 1] = ' ';
        const steps = strip.length - 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              overflow: 'hidden',
              height: '1.15em',
              lineHeight: '1.15em',
              width: `${0.62 * widthFactor}em`,
              verticalAlign: 'bottom',
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${-p * steps * 1.15}em)`,
              }}
            >
              {strip.map((c, k) => (
                <span key={k} style={{height: '1.15em', textAlign: 'right'}}>
                  {c}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      <span>{b.post}</span>
    </span>
  );
};

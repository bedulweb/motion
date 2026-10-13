// Toast — notifikasi "Pembayaran baru masuk · Rp 4,8 jt".
import React from 'react';
import {ui} from '../copy';
import {color, font, keyLight, radius, shadow, type} from '../theme';

export const Toast: React.FC<{scale?: number; shadowLift?: number; style?: React.CSSProperties}> = ({
  scale = 1,
  shadowLift = 1,
  style,
}) => {
  const s = scale;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14 * s,
        padding: `${16 * s}px ${22 * s}px ${16 * s}px ${18 * s}px`,
        background: color.bg,
        backgroundImage: keyLight(),
        border: `1px solid ${color.line}`,
        borderRadius: radius.card * s,
        // shadow membesar saat toast mendarat (shadowLift 0 → 1)
        boxShadow: shadowLift >= 1 ? shadow.card : `0 ${1 + shadowLift}px ${2 + shadowLift * 6}px rgba(20,20,19,.06), 0 ${8 * shadowLift}px ${24 * shadowLift}px rgba(20,20,19,${0.08 * shadowLift}), 0 ${24 * shadowLift}px ${64 * shadowLift}px rgba(20,20,19,${0.1 * shadowLift})`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div
        style={{
          width: 40 * s,
          height: 40 * s,
          borderRadius: radius.inner * s,
          background: color.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{width: 12 * s, height: 12 * s, borderRadius: 99, background: color.positive}} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 3 * s}}>
        <div style={{fontFamily: font.sans, fontWeight: 600, fontSize: 21 * s, color: color.ink, ...type.num}}>
          {ui.toast.title} · {ui.toast.amount}
        </div>
        <div style={{fontFamily: font.sans, fontWeight: 500, fontSize: 16 * s, color: color.ink2}}>
          CV Kopi Pagi · BCA · baru saja
        </div>
      </div>
    </div>
  );
};

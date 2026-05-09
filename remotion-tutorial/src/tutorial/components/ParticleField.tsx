import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, random, interpolate } from 'remotion';
import { colors } from '../theme';

type Props = {
  count?: number;
  seed?: string;
  accent?: string;
  speed?: number;
};

export const ParticleField: React.FC<Props> = ({
  count = 56,
  seed = 'particles',
  accent = colors.violetSoft,
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`${seed}-x-${i}`) * 100,
        y: random(`${seed}-y-${i}`) * 100,
        size: 2 + random(`${seed}-s-${i}`) * 4,
        amp: 6 + random(`${seed}-a-${i}`) * 14,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        twinkle: random(`${seed}-t-${i}`),
        color: random(`${seed}-c-${i}`) > 0.7 ? colors.cyanSoft : accent,
      })),
    [count, seed, accent],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const phaseFrame = frame * 0.04 * speed + p.phase;
        const dx = Math.sin(phaseFrame) * p.amp;
        const dy = Math.cos(phaseFrame * 0.8) * p.amp;
        const opacity = interpolate(
          Math.sin(phaseFrame * 1.6 + p.twinkle * 6),
          [-1, 1],
          [0.18, 0.85],
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${p.x}% + ${dx}px)`,
              top: `calc(${p.y}% + ${dy}px)`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              opacity,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

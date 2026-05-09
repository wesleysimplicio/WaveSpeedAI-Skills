import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { fonts, colors, shadows } from '../theme';

export type CodeLine = {
  text: string;
  color?: string;
  prompt?: string;
  comment?: boolean;
};

type Props = {
  title?: string;
  lines: CodeLine[];
  startFrame?: number;
  lineDuration?: number;
  charsPerFrame?: number;
  width?: number | string;
  showCursor?: boolean;
  topAccent?: string;
};

export const CodeBlock: React.FC<Props> = ({
  title = 'terminal',
  lines,
  startFrame = 0,
  lineDuration = 22,
  charsPerFrame = 1.4,
  width = 760,
  showCursor = true,
  topAccent = colors.violet,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 22, stiffness: 110 },
  });

  return (
    <div
      style={{
        width,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        borderRadius: 18,
        overflow: 'hidden',
        background: 'rgba(8, 9, 22, 0.92)',
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        backdropFilter: 'blur(8px)',
        fontFamily: fonts.mono,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: `linear-gradient(180deg, ${topAccent}22 0%, transparent 100%)`,
        }}
      >
        <Dot color="#ff5f57" />
        <Dot color="#febc2e" />
        <Dot color="#28c840" />
        <span
          style={{
            marginLeft: 14,
            color: colors.textMuted,
            fontSize: 14,
            letterSpacing: 0.4,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: '22px 26px', minHeight: 100 }}>
        {lines.map((line, i) => {
          const enterFrame = i * lineDuration;
          const visible = local >= enterFrame;
          if (!visible) {
            return (
              <div
                key={i}
                style={{ height: 32, opacity: 0 }}
                aria-hidden="true"
              />
            );
          }
          const sinceEnter = local - enterFrame;
          const totalChars = line.text.length;
          const visibleChars = Math.floor(
            Math.min(totalChars, sinceEnter * charsPerFrame),
          );
          const isTyping = visibleChars < totalChars;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 22,
                lineHeight: 1.45,
                color: line.comment
                  ? colors.textMuted
                  : line.color ?? colors.textPrimary,
                fontStyle: line.comment ? 'italic' : 'normal',
                whiteSpace: 'pre',
              }}
            >
              {line.prompt ? (
                <span style={{ color: colors.violetSoft }}>{line.prompt}</span>
              ) : null}
              <span>{line.text.slice(0, visibleChars)}</span>
              {showCursor && isTyping ? (
                <BlinkingCursor frame={frame} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: color,
      display: 'inline-block',
    }}
  />
);

const BlinkingCursor: React.FC<{ frame: number }> = ({ frame }) => {
  const visible = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 12,
        height: 24,
        background: colors.cyan,
        opacity: visible ? 1 : 0,
        marginLeft: 2,
        boxShadow: `0 0 12px ${colors.cyan}`,
      }}
    />
  );
};

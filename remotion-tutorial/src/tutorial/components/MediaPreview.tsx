import React from 'react';
import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  random,
} from 'remotion';
import { fonts, colors } from '../theme';

type Variant = 'image' | 'video' | 'llm';

type Props = {
  variant: Variant;
  startFrame?: number;
  delay?: number;
  label: string;
  modelId: string;
  prompt?: string;
  width?: number;
  height?: number;
};

export const MediaPreview: React.FC<Props> = ({
  variant,
  startFrame = 0,
  delay = 0,
  label,
  modelId,
  prompt,
  width = 380,
  height = 260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame - delay;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 110 },
  });
  const translate = interpolate(enter, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translate}px)`,
        width,
        borderRadius: 22,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 24px 60px -22px rgba(8,8,30,0.85)',
        overflow: 'hidden',
        fontFamily: fonts.sans,
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        style={{
          width: '100%',
          height,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {variant === 'image' && <ImagePreview frame={frame} />}
        {variant === 'video' && <VideoPreview frame={frame} />}
        {variant === 'llm' && <LlmPreview frame={frame} />}
        <Tag variant={variant} />
      </div>
      <div style={{ padding: '18px 22px 20px', display: 'grid', gap: 8 }}>
        <div
          style={{
            fontSize: 14,
            color: colors.textMuted,
            fontFamily: fonts.mono,
            letterSpacing: 0.4,
          }}
        >
          {modelId}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.textPrimary,
            letterSpacing: -0.3,
          }}
        >
          {label}
        </div>
        {prompt ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 15,
              color: colors.textSecondary,
              fontFamily: fonts.mono,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(8, 9, 22, 0.6)',
              border: '1px solid rgba(255,255,255,0.05)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: colors.violetSoft }}>prompt</span> &nbsp;
            <span>{prompt}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Tag: React.FC<{ variant: Variant }> = ({ variant }) => {
  const map: Record<Variant, { label: string; color: string }> = {
    image: { label: 'TEXT  IMAGE', color: colors.violet },
    video: { label: 'IMAGE  VIDEO', color: colors.cyan },
    llm: { label: 'CHAT  LLM', color: colors.amber },
  };
  const tag = map[variant];
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: 14,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'rgba(8, 9, 22, 0.65)',
        border: `1px solid ${tag.color}66`,
        color: tag.color,
        fontFamily: fonts.mono,
        fontSize: 12,
        letterSpacing: 1.2,
        backdropFilter: 'blur(8px)',
      }}
    >
      {tag.label}
    </div>
  );
};

const ImagePreview: React.FC<{ frame: number }> = ({ frame }) => {
  const blobs = Array.from({ length: 6 }, (_, i) => {
    const x = random(`img-x-${i}`) * 100;
    const y = random(`img-y-${i}`) * 100;
    const size = 80 + random(`img-s-${i}`) * 140;
    const dx = Math.sin(frame * 0.02 + i) * 8;
    const palette = [
      '#f472b6',
      '#a78bfa',
      '#22d3ee',
      '#fbbf24',
      '#34d399',
      '#fb7185',
    ];
    return {
      x,
      y,
      size,
      dx,
      color: palette[i % palette.length],
    };
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(135deg, #1a103d 0%, #0c1326 100%)',
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(${b.x}% + ${b.dx}px)`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            filter: 'blur(40px)',
            opacity: 0.55,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 60%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
};

const VideoPreview: React.FC<{ frame: number }> = ({ frame }) => {
  const t = (frame * 0.04) % (Math.PI * 2);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, #082131 0%, #0a1226 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${50 + Math.sin(t) * 10}% ${60 + Math.cos(t) * 6}%, rgba(34,211,238,0.55) 0%, transparent 45%)`,
          filter: 'blur(20px)',
        }}
      />
      {/* horizon line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '62%',
          height: 1,
          background: 'rgba(255,255,255,0.12)',
        }}
      />
      {/* moving objects */}
      {Array.from({ length: 4 }).map((_, i) => {
        const offset = (frame * 0.6 + i * 90) % 460;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${60 + i * 4}%`,
              left: -30 + offset,
              width: 30 + i * 4,
              height: 14 + i * 3,
              background: i % 2 ? colors.cyan : colors.violetSoft,
              opacity: 0.7,
              borderRadius: 4,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 18px ${i % 2 ? colors.cyan : colors.violet}`,
            }}
          />
        );
      })}
      <PlayBadge />
      <Timecode frame={frame} />
    </div>
  );
};

const PlayBadge: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: 18,
      bottom: 18,
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: 'rgba(8, 9, 22, 0.7)',
      border: `1px solid ${colors.cyan}66`,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: 'blur(8px)',
    }}
  >
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: `12px solid ${colors.cyan}`,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        marginLeft: 4,
      }}
    />
  </div>
);

const Timecode: React.FC<{ frame: number }> = ({ frame }) => {
  const seconds = (frame / 30).toFixed(1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 18,
        bottom: 18,
        padding: '4px 10px',
        fontSize: 12,
        fontFamily: fonts.mono,
        color: colors.textSecondary,
        background: 'rgba(8, 9, 22, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
      }}
    >
      {`00:${String(Math.floor(Number(seconds))).padStart(2, '0')}`}
    </div>
  );
};

const LlmPreview: React.FC<{ frame: number }> = ({ frame }) => {
  const messages = [
    { who: 'user', text: 'Resuma o WaveSpeedAI numa frase.' },
    {
      who: 'claude',
      text: 'Plataforma única para imagem, vídeo, áudio e LLM em 700+ modelos.',
    },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(135deg, #1a1006 0%, #1a0c20 100%)',
        padding: '46px 22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {messages.map((m, i) => {
        const delay = i * 30;
        const reveal = Math.max(0, Math.min(1, (frame - delay) / 30));
        const charLimit = Math.floor(m.text.length * reveal);
        return (
          <div
            key={i}
            style={{
              alignSelf: m.who === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '78%',
              padding: '8px 14px',
              borderRadius: 14,
              background:
                m.who === 'user'
                  ? 'rgba(139,92,246,0.28)'
                  : 'rgba(34,211,238,0.16)',
              color: colors.textPrimary,
              border: `1px solid ${
                m.who === 'user' ? colors.violet + '55' : colors.cyan + '55'
              }`,
              fontSize: 13,
              fontFamily: fonts.sans,
              opacity: reveal === 0 ? 0 : 1,
              transform: `translateY(${(1 - reveal) * 8}px)`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: colors.textMuted,
                marginBottom: 4,
                fontFamily: fonts.mono,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {m.who}
            </div>
            <div>{m.text.slice(0, charLimit)}</div>
          </div>
        );
      })}
    </div>
  );
};

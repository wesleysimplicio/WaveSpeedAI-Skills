import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTitle } from '../components/SceneTitle';
import { HostBadge } from '../components/HostBadge';
import { colors } from '../theme';

const HOSTS = [
  { name: 'Claude Code', monogram: 'C', path: '~/.claude/skills/wavespeed/SKILL.md', color: colors.violetSoft },
  { name: 'Codex', monogram: 'CX', path: '~/.codex/skills/wavespeed/SKILL.md', color: colors.amber },
  { name: 'Hermes', monogram: 'H', path: '~/.hermes/skills/creative/wavespeed/SKILL.md', color: colors.rose },
  { name: 'OpenClaw', monogram: 'OC', path: '~/.openclaw/skills/wavespeed/SKILL.md', color: colors.pink },
  { name: 'Cursor', monogram: 'CR', path: '~/.cursor/skills/wavespeed/SKILL.md', color: colors.cyan },
  { name: 'Windsurf', monogram: 'W', path: '~/.windsurf/skills/wavespeed/SKILL.md', color: colors.blue },
  { name: 'Generic', monogram: 'G', path: '~/.config/agent-skills/wavespeed/SKILL.md', color: colors.emerald },
];

export const SceneHosts: React.FC = () => {
  return (
    <SceneFrame accent="amber" particleSeed="hosts" badge="04 · ONDE FUNCIONA">
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 52 }}>
        <SceneTitle
          eyebrow="Mesma skill, todos os agents"
          title="Sete hosts suportados — frontmatter por host"
          subtitle="O instalador escolhe o SKILL.md certo para cada diretório de agent. Você só roda uma vez."
          accent={colors.amber}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            alignContent: 'start',
          }}
        >
          {HOSTS.map((h, i) => (
            <HostBadge
              key={h.name}
              name={h.name}
              monogram={h.monogram}
              path={h.path}
              color={h.color}
              startFrame={20}
              delay={i * 7}
            />
          ))}
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

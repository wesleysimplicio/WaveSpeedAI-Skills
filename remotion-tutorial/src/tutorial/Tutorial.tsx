import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './timing';
import { SceneIntro } from './scenes/SceneIntro';
import { SceneWhatIsSkill } from './scenes/SceneWhatIsSkill';
import { SceneInstall } from './scenes/SceneInstall';
import { SceneHosts } from './scenes/SceneHosts';
import { SceneCli } from './scenes/SceneCli';
import { SceneExamples } from './scenes/SceneExamples';
import { SceneOutro } from './scenes/SceneOutro';
import { colors } from './theme';
import { LocaleContext, type Locale } from './i18n';

const SCENE_COMPONENTS: Record<string, React.FC> = {
  intro: SceneIntro,
  'what-is-skill': SceneWhatIsSkill,
  install: SceneInstall,
  hosts: SceneHosts,
  cli: SceneCli,
  examples: SceneExamples,
  outro: SceneOutro,
};

export type TutorialProps = {
  locale?: Locale;
};

export const Tutorial: React.FC<TutorialProps> = ({ locale = 'pt-BR' }) => {
  let cursor = 0;
  return (
    <LocaleContext.Provider value={locale}>
      <AbsoluteFill style={{ backgroundColor: colors.bgDeep }}>
        {SCENES.map((scene) => {
          const Component = SCENE_COMPONENTS[scene.id];
          const from = cursor;
          cursor += scene.durationInFrames;
          return (
            <Sequence
              key={scene.id}
              from={from}
              durationInFrames={scene.durationInFrames}
              name={scene.id}
            >
              <Component />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </LocaleContext.Provider>
  );
};

export const TUTORIAL_FPS = 30;

export type SceneSpec = {
  id: string;
  durationInFrames: number;
};

export const SCENES = [
  { id: 'intro', durationInFrames: 150 },
  { id: 'what-is-skill', durationInFrames: 270 },
  { id: 'install', durationInFrames: 300 },
  { id: 'hosts', durationInFrames: 240 },
  { id: 'cli', durationInFrames: 360 },
  { id: 'examples', durationInFrames: 300 },
  { id: 'outro', durationInFrames: 180 },
] as const satisfies readonly SceneSpec[];

export const TUTORIAL_DURATION_FRAMES = SCENES.reduce(
  (acc, scene) => acc + scene.durationInFrames,
  0,
);

export const SCENE_OFFSETS: Record<string, number> = (() => {
  const offsets: Record<string, number> = {};
  let acc = 0;
  for (const scene of SCENES) {
    offsets[scene.id] = acc;
    acc += scene.durationInFrames;
  }
  return offsets;
})();

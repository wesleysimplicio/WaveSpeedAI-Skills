/**
 * Font stacks. We rely on the system UI/mono fonts on purpose: the rendered
 * frames look great on every modern OS without paying the network cost (and
 * cert/CDN fragility) of fetching webfonts during headless rendering.
 *
 * To switch to a real webfont (e.g. Inter / JetBrains Mono) install
 * `@remotion/google-fonts` and replace these strings with `loadFont().fontFamily`.
 */
export const fonts = {
  sans: '"Inter", "SF Pro Display", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "SF Mono", "Menlo", "Consolas", "Liberation Mono", monospace',
};

export const colors = {
  bgDeep: '#05060f',
  bg: '#0a0b1e',
  bgSoft: '#13153a',
  surface: 'rgba(24, 27, 64, 0.72)',
  surfaceSolid: '#181b40',
  border: 'rgba(139, 92, 246, 0.28)',
  borderSoft: 'rgba(255,255,255,0.08)',
  textPrimary: '#f7f7ff',
  textSecondary: '#cdd0ee',
  textMuted: '#888ab2',
  violet: '#8b5cf6',
  violetSoft: '#a78bfa',
  violetDeep: '#6d28d9',
  cyan: '#22d3ee',
  cyanSoft: '#67e8f9',
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  pink: '#f472b6',
  blue: '#60a5fa',
};

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.violet} 0%, ${colors.cyan} 100%)`,
  brandSoft: `linear-gradient(135deg, rgba(139,92,246,0.45) 0%, rgba(34,211,238,0.45) 100%)`,
  warm: `linear-gradient(135deg, ${colors.amber} 0%, ${colors.rose} 100%)`,
  panel: `linear-gradient(180deg, rgba(24,27,64,0.85) 0%, rgba(11,12,30,0.92) 100%)`,
};

export const shadows = {
  card: '0 24px 60px -20px rgba(8, 8, 30, 0.85), 0 0 0 1px rgba(139, 92, 246, 0.18)',
  glow: '0 0 60px rgba(139, 92, 246, 0.35)',
};

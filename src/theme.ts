export const colors = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  fg: '#111827',
  fgSubtle: '#6B7280',
  muted: '#9CA3AF',
  border: '#E5E7EB',
  borderFocus: '#1F6FEB',
  accent: '#1F6FEB',
  accentHover: '#1A5FD0',
  accentActive: '#154FAD',
  accentSoft: '#EAF1FE',
  error: '#D92D20',
  errorBg: '#FEF3F2',
  disabledBg: '#D1D5DB',
  disabledFg: '#F9FAFB',
} as const;

export const spacing = {
  space0: 4,
  space1: 8,
  space2: 12,
  space3: 16,
  space4: 24,
  space5: 32,
  space6: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyMono: "'SF Mono', Menlo, Consolas, 'Roboto Mono', monospace",
  headingWeight: '700',
  bodyWeight: '400',
  labelWeight: '600',
  sizeDisplay: 34,
  sizeTitle: 22,
  sizeBody: 16,
  sizeLabel: 14,
  sizeCaption: 12,
  lineHeightBody: 1.4,
} as const;

export const theme = { colors, spacing, radius, typography } as const;

export type Theme = typeof theme;

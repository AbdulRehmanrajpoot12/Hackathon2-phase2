/**
 * Gradient definitions for the premium UI design system
 */

export const gradients = {
  // Primary gradients
  primary: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  primaryReverse: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',

  // Accent gradients
  accent: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  accentReverse: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',

  // Status gradients
  success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  danger: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',

  // Hero/background gradients
  hero: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
  heroLight: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',

  // Subtle gradients
  subtle: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  subtleDark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',

  // Animated gradients
  animated: 'linear-gradient(270deg, #7c3aed, #a855f7, #06b6d4, #22d3ee)',

  // Text gradients
  textPrimary: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  textAccent: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  textRainbow: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #06b6d4 50%, #22d3ee 75%, #10b981 100%)',
} as const;

/**
 * Get gradient CSS value
 */
export function getGradient(name: keyof typeof gradients): string {
  return gradients[name];
}

/**
 * Create a custom gradient
 */
export function createGradient(
  angle: number,
  colors: Array<{ color: string; stop: number }>
): string {
  const stops = colors.map(({ color, stop }) => `${color} ${stop}%`).join(', ');
  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Create a radial gradient
 */
export function createRadialGradient(
  colors: Array<{ color: string; stop: number }>,
  position: string = 'center'
): string {
  const stops = colors.map(({ color, stop }) => `${color} ${stop}%`).join(', ');
  return `radial-gradient(circle at ${position}, ${stops})`;
}

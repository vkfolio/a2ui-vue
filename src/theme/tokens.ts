// ---------------------------------------------------------------------------
// A2UI Theme System -- CSS Custom Properties
// ---------------------------------------------------------------------------
import { inject, type InjectionKey } from 'vue';

// ---- Types ----------------------------------------------------------------

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  bg: string;
  bgSurface: string;
  bgHover: string;
  text: string;
  textSecondary: string;
  textOnPrimary: string;
  border: string;
  borderFocus: string;
  shadow: string;
  inputBg: string;
  divider: string;
  overlay: string;
}

export interface Theme {
  /** Optional primary brand colour from the A2UI surface theme definition. */
  primaryColor?: string;
  colors: ThemeColors;
}

// ---- Helpers --------------------------------------------------------------

/**
 * Attempt to produce a slightly darker (light mode) or lighter (dark mode)
 * variant of a hex colour for the hover state.
 */
function adjustBrightness(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  const num = parseInt(raw, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return (
    '#' +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
  );
}

// ---- Default themes -------------------------------------------------------

const DEFAULT_PRIMARY = '#7c3aed'; // violet-600 (matches original A2UI Composer)

export const defaultLightTheme: Theme = {
  colors: {
    primary: DEFAULT_PRIMARY,
    primaryHover: adjustBrightness(DEFAULT_PRIMARY, -20),
    bg: '#dedee9',               // cool lavender-gray (matches original)
    bgSurface: '#ffffff',        // white cards
    bgHover: '#f3f4f6',          // gray-100
    text: '#111827',             // gray-900
    textSecondary: '#6b7280',    // gray-500
    textOnPrimary: '#ffffff',
    border: '#e5e7eb',           // gray-200 (subtle)
    borderFocus: DEFAULT_PRIMARY,
    shadow: '0 1px 3px rgba(0,0,0,0.1)',
    inputBg: '#ffffff',
    divider: '#e5e7eb',          // gray-200
    overlay: 'rgba(0,0,0,0.4)',
  },
};

export const defaultDarkTheme: Theme = {
  colors: {
    primary: '#a78bfa',          // violet-400 (bright on dark bg)
    primaryHover: adjustBrightness('#a78bfa', 20),
    bg: '#1a1a2e',               // deep navy-purple
    bgSurface: '#252540',        // dark card surface
    bgHover: '#2d2d4a',          // hover state
    text: '#e8e8f0',             // light lavender white
    textSecondary: '#8888a8',    // muted purple-gray
    textOnPrimary: '#ffffff',
    border: '#35355a',           // subtle purple border
    borderFocus: '#a78bfa',
    shadow: '0 1px 3px rgba(0,0,0,0.5)',
    inputBg: '#2a2a48',          // dark input
    divider: '#35355a',          // subtle divider
    overlay: 'rgba(0,0,0,0.7)',
  },
};

// ---- CSS custom-property injection ----------------------------------------

const STYLE_ID = 'a2ui-theme-vars';

/**
 * Creates (or updates) a `<style>` element on `document.head` that sets
 * CSS custom properties on `:root` based on the supplied theme.
 *
 * If `theme.primaryColor` is set (from the A2UI surface JSON), it overrides
 * the primary colour and derives a hover variant automatically.
 */
export function injectThemeStyles(theme: Partial<Theme> | Record<string, any>, isDark: boolean): void {
  const base = isDark ? defaultDarkTheme : defaultLightTheme
  const colors = { ...base.colors, ...(theme.colors || {}) };

  // Allow the surface-level primaryColor to override the theme default.
  if (theme.primaryColor) {
    colors.primary = theme.primaryColor;
    colors.primaryHover = adjustBrightness(
      theme.primaryColor,
      isDark ? 20 : -20,
    );
    colors.borderFocus = theme.primaryColor;
  }

  // Derive extra vars for the app shell
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)';
  const cardBg = isDark ? 'rgba(37, 37, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const sidebarBg = isDark ? 'rgba(30, 30, 52, 0.7)' : 'rgba(255, 255, 255, 0.5)';
  const sidebarBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)';
  const muted = colors.textSecondary;
  const primaryLight = isDark ? 'rgba(167, 139, 250, 0.15)' : 'rgba(124, 58, 237, 0.08)';
  const codeBg = isDark ? '#1e1e3a' : '#1e1e2e';

  const css = `:root {
  --a2ui-primary: ${colors.primary};
  --a2ui-primary-hover: ${colors.primaryHover};
  --a2ui-primary-light: ${primaryLight};
  --a2ui-bg: ${colors.bg};
  --a2ui-bg-surface: ${colors.bgSurface};
  --a2ui-bg-hover: ${colors.bgHover};
  --a2ui-text: ${colors.text};
  --a2ui-text-secondary: ${colors.textSecondary};
  --a2ui-text-on-primary: ${colors.textOnPrimary};
  --a2ui-muted: ${muted};
  --a2ui-border: ${colors.border};
  --a2ui-border-focus: ${colors.borderFocus};
  --a2ui-shadow: ${colors.shadow};
  --a2ui-input-bg: ${colors.inputBg};
  --a2ui-input-border: ${colors.border};
  --a2ui-divider: ${colors.divider};
  --a2ui-overlay: ${colors.overlay};
  --a2ui-card-bg: ${cardBg};
  --a2ui-card-border: ${cardBorder};
  --a2ui-sidebar-bg: ${sidebarBg};
  --a2ui-sidebar-border: ${sidebarBorder};
  --a2ui-code-bg: ${codeBg};
}`;

  if (typeof document === 'undefined') return; // SSR guard

  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

// ---- Vue provide / inject -------------------------------------------------

export interface ThemeContext {
  theme: Theme;
  isDark: boolean;
}

/** Symbol used with Vue provide/inject for the theme context. */
export const themeKey: InjectionKey<ThemeContext> = Symbol('a2ui-theme');

/**
 * Composable that retrieves the current A2UI theme context.
 * Falls back to the default light theme when no ancestor has provided one.
 */
export function useTheme(): ThemeContext {
  return inject(themeKey, {
    theme: defaultLightTheme,
    isDark: false,
  });
}

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textInverse: "#0A192F",
    buttonText: "#0A192F",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#FFD700",
    link: "#FFD700",
    backgroundRoot: "#0A192F",
    backgroundDefault: "#1A2F4F",
    backgroundSecondary: "#243B5C",
    backgroundTertiary: "#2E4A6D",
    gold: "#FFD700",
    goldDim: "#D4AF37",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    border: "#FFD700",
    borderMuted: "rgba(255, 215, 0, 0.3)",
  },
  dark: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textInverse: "#0A192F",
    buttonText: "#0A192F",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#FFD700",
    link: "#FFD700",
    backgroundRoot: "#0A192F",
    backgroundDefault: "#1A2F4F",
    backgroundSecondary: "#243B5C",
    backgroundTertiary: "#2E4A6D",
    gold: "#FFD700",
    goldDim: "#D4AF37",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    border: "#FFD700",
    borderMuted: "rgba(255, 215, 0, 0.3)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 52,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
};

export const Shadows = {
  gold: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  goldSmall: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dark: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Montserrat, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

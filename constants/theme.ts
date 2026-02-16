import { Platform } from "react-native";

// Enhanced Color Palette for Modern Fintech UI
export const Colors = {
  light: {
    // Primary Colors
    deepSpaceBlue: "#0D1B2A",
    royalIndigo: "#1B263B",
    steelBlue: "#415A77",
    skyBlue: "#778DA9",
    cloudGray: "#E0E1DD",
    
    // Accent Colors
    electricGold: "#FFD700",
    amberGold: "#FFA500",
    sunsetOrange: "#FF6B35",
    
    // Semantic Colors
    successGreen: "#00D084",
    successGreenDark: "#00A66D",
    errorRed: "#FF4757",
    errorRedDark: "#EE3344",
    warningAmber: "#FFC107",
    infoBlue: "#2196F3",
    
    // Text Colors
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    textInverse: "#0D1B2A",
    buttonText: "#0D1B2A",
    
    // UI Colors
    tabIconDefault: "#64748B",
    tabIconSelected: "#FFD700",
    link: "#FFD700",
    linkHover: "#FFA500",
    
    // Background Colors
    backgroundRoot: "#0D1B2A",
    backgroundPrimary: "#1B263B",
    backgroundSecondary: "#243B5C",
    backgroundTertiary: "#2E4A6D",
    backgroundElevated: "#334E68",
    
    // Border & Divider Colors
    border: "#FFD700",
    borderMuted: "rgba(255, 215, 0, 0.2)",
    divider: "rgba(255, 255, 255, 0.1)",
    
    // Glassmorphism Colors
    glassBackground: "rgba(27, 38, 59, 0.6)",
    glassBorder: "rgba(255, 215, 0, 0.2)",
    glassHighlight: "rgba(255, 255, 255, 0.1)",
  },
  dark: {
    // Primary Colors
    deepSpaceBlue: "#0D1B2A",
    royalIndigo: "#1B263B",
    steelBlue: "#415A77",
    skyBlue: "#778DA9",
    cloudGray: "#E0E1DD",
    
    // Accent Colors
    electricGold: "#FFD700",
    amberGold: "#FFA500",
    sunsetOrange: "#FF6B35",
    
    // Semantic Colors
    successGreen: "#00D084",
    successGreenDark: "#00A66D",
    errorRed: "#FF4757",
    errorRedDark: "#EE3344",
    warningAmber: "#FFC107",
    infoBlue: "#2196F3",
    
    // Text Colors
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    textInverse: "#0D1B2A",
    buttonText: "#0D1B2A",
    
    // UI Colors
    tabIconDefault: "#64748B",
    tabIconSelected: "#FFD700",
    link: "#FFD700",
    linkHover: "#FFA500",
    
    // Background Colors
    backgroundRoot: "#0D1B2A",
    backgroundPrimary: "#1B263B",
    backgroundSecondary: "#243B5C",
    backgroundTertiary: "#2E4A6D",
    backgroundElevated: "#334E68",
    
    // Border & Divider Colors
    border: "#FFD700",
    borderMuted: "rgba(255, 215, 0, 0.2)",
    divider: "rgba(255, 255, 255, 0.1)",
    
    // Glassmorphism Colors
    glassBackground: "rgba(27, 38, 59, 0.6)",
    glassBorder: "rgba(255, 215, 0, 0.2)",
    glassHighlight: "rgba(255, 255, 255, 0.1)",
  },
};

// Spacing System
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
  "6xl": 64,
  inputHeight: 56,
  buttonHeight: 56,
};

// Border Radius System
export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  full: 9999,
};

// Enhanced Typography System
export const Typography = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
    textDecorationLine: "underline" as const,
  },
};

// Enhanced Shadow System
export const Shadows = {
  gold: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  goldMedium: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  goldSmall: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  goldGlow: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  dark: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  darkMedium: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  darkSmall: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Gradient Definitions
export const Gradients = {
  primary: ["#0D1B2A", "#1B263B", "#415A77"],
  secondary: ["#1B263B", "#243B5C", "#2E4A6D"],
  gold: ["#FFD700", "#FFA500", "#FF6B35"],
  goldSubtle: ["#FFD700", "#D4AF37"],
  success: ["#00D084", "#00A66D"],
  error: ["#FF4757", "#EE3344"],
  purple: ["#667eea", "#764ba2"],
  ocean: ["#11998e", "#38ef7d"],
  sunset: ["#F7971E", "#FFD200"],
  dark: ["#0F0C29", "#302b63", "#24243e"],
};

// Animation Timing Constants
export const AnimationDuration = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Spring Animation Configs
export const SpringConfigs = {
  gentle: {
    damping: 20,
    mass: 0.5,
    stiffness: 120,
    overshootClamping: false,
  },
  snappy: {
    damping: 15,
    mass: 0.3,
    stiffness: 150,
    overshootClamping: true,
  },
  bouncy: {
    damping: 12,
    mass: 0.8,
    stiffness: 100,
    overshootClamping: false,
  },
  stiff: {
    damping: 25,
    mass: 0.2,
    stiffness: 200,
    overshootClamping: true,
  },
};

// Glassmorphism Utility
export const Glassmorphism = {
  light: {
    backgroundColor: "rgba(27, 38, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    backdropFilter: "blur(10px)",
  },
  medium: {
    backgroundColor: "rgba(27, 38, 59, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
    backdropFilter: "blur(16px)",
  },
  strong: {
    backgroundColor: "rgba(27, 38, 59, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.4)",
    backdropFilter: "blur(20px)",
  },
};

// Font Family System
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Montserrat, Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Icon Sizes
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
};

// Opacity Levels
export const Opacity = {
  disabled: 0.4,
  muted: 0.6,
  normal: 0.8,
  bright: 1.0,
};

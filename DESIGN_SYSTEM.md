# Global Wallet Ultimate - Design System Documentation

## Overview

This document outlines the comprehensive UI/UX design system for Global Wallet Ultimate, a premium fintech mobile application built with React Native and Expo.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Border Radius](#border-radius)
5. [Shadows & Effects](#shadows--effects)
6. [Gradients](#gradients)
7. [Glassmorphism](#glassmorphism)
8. [Components](#components)
9. [Animations](#animations)
10. [Icons](#icons)

---

## Color Palette

### Primary Colors

| Name | Value | Usage |
|------|-------|-------|
| Deep Space Blue | `#0D1B2A` | Backgrounds, headers |
| Royal Indigo | `#1B263B` | Cards, surfaces |
| Steel Blue | `#415A77` | Secondary elements |
| Sky Blue | `#778DA9` | Tertiary elements |
| Cloud Gray | `#E0E1DD` | Light text on dark |

### Accent Colors

| Name | Value | Usage |
|------|-------|-------|
| Electric Gold | `#FFD700` | Primary accents, buttons |
| Amber Gold | `#FFA500` | Secondary accents |
| Sunset Orange | `#FF6B35` | Tertiary accents |

### Semantic Colors

| Name | Value | Usage |
|------|-------|-------|
| Success Green | `#00D084` | Success states, positive indicators |
| Success Green Dark | `#00A66D` | Success hover states |
| Error Red | `#FF4757` | Error states, negative indicators |
| Error Red Dark | `#EE3344` | Error hover states |
| Warning Amber | `#FFC107` | Warning states |
| Info Blue | `#2196F3` | Information states |

### Text Colors

| Name | Value | Usage |
|------|-------|-------|
| Text | `#F8FAFC` | Primary text |
| Text Secondary | `#94A3B8` | Secondary text |
| Text Tertiary | `#64748B` | Tertiary text, hints |
| Text Inverse | `#0D1B2A` | Text on gold backgrounds |

### UI Colors

| Name | Value | Usage |
|------|-------|-------|
| Tab Icon Default | `#64748B` | Inactive tab icons |
| Tab Icon Selected | `#FFD700` | Active tab icons |
| Link | `#FFD700` | Hyperlinks |
| Link Hover | `#FFA500` | Link hover state |

### Background Colors

| Name | Value | Usage |
|------|-------|-------|
| Background Root | `#0D1B2A` | Main app background |
| Background Primary | `#1B263B` | Card backgrounds |
| Background Secondary | `#243B5C` | Elevated surfaces |
| Background Tertiary | `#2E4A6D` | Higher elevation |
| Background Elevated | `#334E68` | Highest elevation |

---

## Typography

### Font Families

- **Primary**: Montserrat (Google Fonts)
- **Monospace**: System mono fonts for code/numbers

### Type Scale

| Type | Font Size | Line Height | Weight | Letter Spacing | Usage |
|------|-----------|-------------|--------|----------------|-------|
| Display | 40px | 48px | 800 | -0.5px | Large numbers, hero text |
| H1 | 32px | 40px | 700 | -0.5px | Page titles |
| H2 | 28px | 36px | 700 | -0.3px | Section titles |
| H3 | 24px | 32px | 600 | -0.2px | Card titles |
| H4 | 20px | 28px | 600 | 0px | Subsection titles |
| H5 | 18px | 24px | 600 | 0px | Small titles |
| Body | 16px | 24px | 400 | 0px | Body text |
| Body Medium | 16px | 24px | 500 | 0px | Emphasized body |
| Body Bold | 16px | 24px | 700 | 0px | Strong body |
| Small | 14px | 20px | 400 | 0px | Secondary text |
| Small Medium | 14px | 20px | 500 | 0px | Emphasized small |
| Caption | 12px | 16px | 400 | 0px | Labels, metadata |
| Caption Medium | 12px | 16px | 500 | 0px | Emphasized labels |
| Tiny | 10px | 14px | 500 | 0.5px | Micro text |

---

## Spacing System

### Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Micro spacing |
| sm | 8px | Small spacing |
| md | 12px | Medium spacing |
| lg | 16px | Large spacing |
| xl | 20px | Extra large |
| 2xl | 24px | Double extra large |
| 3xl | 32px | Section padding |
| 4xl | 40px | Large sections |
| 5xl | 48px | Extra large sections |
| 6xl | 64px | Hero sections |

### Special Values

| Name | Value | Usage |
|------|-------|-------|
| Input Height | 56px | Standard input height |
| Button Height | 56px | Standard button height |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| xs | 8px | Small elements |
| sm | 12px | Buttons, badges |
| md | 16px | Cards, inputs |
| lg | 20px | Large cards |
| xl | 24px | Modal containers |
| 2xl | 28px | Extra large cards |
| 3xl | 32px | Hero elements |
| full | 9999px | Pills, circles |

---

## Shadows & Effects

### Gold Shadows

| Name | Usage |
|------|-------|
| Gold | Large gold glow effect |
| Gold Medium | Medium gold glow |
| Gold Small | Subtle gold glow |
| Gold Glow | Intense pulsing glow |

### Dark Shadows

| Name | Usage |
|------|-------|
| Dark | Standard elevation |
| Dark Medium | Medium elevation |
| Dark Small | Subtle elevation |

---

## Gradients

### Predefined Gradients

| Name | Colors | Usage |
|------|--------|-------|
| Primary | `#0D1B2A → #1B263B → #415A77` | Main backgrounds |
| Secondary | `#1B263B → #243B5C → #2E4A6D` | Secondary backgrounds |
| Gold | `#FFD700 → #FFA500 → #FF6B35` | Primary buttons, accents |
| Gold Subtle | `#FFD700 → #D4AF37` | Subtle gold effects |
| Success | `#00D084 → #00A66D` | Success states |
| Error | `#FF4757 → #EE3344` | Error states |
| Purple | `#667eea → #764ba2` | Special accents |
| Ocean | `#11998e → #38ef7d` | Growth indicators |
| Sunset | `#F7971E → #FFD200` | Warm accents |
| Dark | `#0F0C29 → #302b63 → #24243e` | Dark mode backgrounds |

---

## Glassmorphism

### Variants

| Name | Background | Border Opacity | Blur Intensity | Usage |
|------|-----------|---------------|----------------|-------|
| Light | `rgba(27, 38, 59, 0.5)` | 20% | 10px | Subtle glass |
| Medium | `rgba(27, 38, 59, 0.7)` | 30% | 16px | Standard glass |
| Strong | `rgba(27, 38, 59, 0.9)` | 40% | 20px | Strong glass |

---

## Components

### GlassCard

A glassmorphism card component with blur effects.

```tsx
<GlassCard variant="medium" onPress={handlePress}>
  <ThemedText>Content</ThemedText>
</GlassCard>
```

**Props:**
- `variant`: "light" | "medium" | "strong"
- `onPress`: Optional press handler
- `intensity`: Blur intensity (default: 20)

### GoldButton

Primary button with gold gradient and glow effects.

```tsx
<GoldButton onPress={handlePress} icon="check" variant="primary">
  Submit
</GoldButton>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline"
- `icon`: Feather icon name
- `iconPosition`: "left" | "right"
- `loading`: Show loading state
- `disabled`: Disable button

### AnimatedInput

Input field with floating label animation.

```tsx
<AnimatedInput
  label="Mobile Number"
  value={value}
  onChangeText={onChangeText}
  icon="smartphone"
  prefix="+91"
  error={error}
/>
```

**Props:**
- `label`: Floating label text
- `icon`: Feather icon name
- `prefix`: Prefix text (e.g., +91)
- `isPassword`: Password field with toggle
- `error`: Error message
- `success`: Show success state

### StatCard

Statistics display card with optional trend indicator.

```tsx
<StatCard
  title="Total Balance"
  value="₹12,450"
  subtitle="Wallet"
  icon="dollar-sign"
  trend="up"
  trendValue="+12%"
  variant="gradient"
  gradientColors={Gradients.gold}
/>
```

**Props:**
- `title`: Stat title
- `value`: Stat value
- `subtitle`: Optional subtitle
- `icon`: Feather icon name
- `trend`: "up" | "down" | "neutral"
- `trendValue`: Trend percentage
- `variant`: "gradient" | "glass" | "solid"
- `gradientColors`: Custom gradient colors

### TransactionItem

Transaction list item with edit/delete actions.

```tsx
<TransactionItem
  id="123"
  category="food"
  description="Restaurant"
  amount={500}
  date="2024-01-15"
  index={0}
  totalCount={10}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### SkeletonLoader

Loading skeleton with shimmer effect.

```tsx
<SkeletonLoader variant="card" />
<SkeletonLoader variant="text" width={200} />
<SkeletonLoader variant="avatar" />
```

**Props:**
- `variant`: "card" | "text" | "avatar" | "rectangle"
- `width`: Custom width
- `height`: Custom height

### Toast

Toast notification system.

```tsx
<Toast
  message="Operation successful"
  type="success"
  visible={visible}
  onDismiss={handleDismiss}
  actionLabel="Undo"
  onAction={handleUndo}
/>
```

**Types:**
- `success`: Green success notification
- `error`: Red error notification
- `warning`: Amber warning notification
- `info`: Blue info notification

---

## Animations

### Using the Animation Utility

```tsx
import {
  useFadeIn,
  useScaleIn,
  usePressAnimation,
  useShimmerAnimation,
} from "@/animations";

// Fade in effect
const opacity = useFadeIn(delay = 0);

// Scale in effect
const scale = useScaleIn(delay = 0);

// Press animation
const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

// Shimmer effect
const shimmerX = useShimmerAnimation();
```

### Animation Presets

```tsx
import { Presets } from "@/animations";

// Fade in
opacity.value = Presets.fadeIn();

// Scale with bounce
scale.value = Presets.scaleIn(springConfig.bouncy);

// Pulse effect
scale.value = Presets.pulse();

// Shimmer effect
translateX.value = Presets.shimmer();
```

### Staggered Animations

```tsx
import { staggeredAnimation } from "@/animations";

scale.value = staggeredAnimation(index, delay = 100);
```

### List Item Animations

```tsx
import { useListItemAnimation } from "@/animations";

const animatedStyle = useListItemAnimation(index, total);
```

---

## Icons

The app uses Feather icons from `@expo/vector-icons`.

```tsx
import { Feather } from "@expo/vector-icons";

<Feather name="home" size={24} color={Colors.dark.text} />
```

### Icon Sizes

| Name | Value |
|------|-------|
| xs | 16px |
| sm | 20px |
| md | 24px |
| lg | 28px |
| xl | 32px |
| 2xl | 40px |
| 3xl | 48px |

---

## Best Practices

### 1. Color Usage

- **Primary Actions**: Use Electric Gold (#FFD700)
- **Destructive Actions**: Use Error Red (#FF4757)
- **Success States**: Use Success Green (#00D084)
- **Backgrounds**: Use Deep Space Blue (#0D1B2A)

### 2. Typography

- **Headings**: Use H1-H3 with bold weights
- **Body Text**: Use Body with regular weight
- **Labels/Captions**: Use Caption for metadata

### 3. Spacing

- **Components**: Use xl (20px) for component margins
- **Sections**: Use 3xl (32px) for section spacing
- **Elements**: Use md (12px) for element spacing

### 4. Components

- **Cards**: Always use GlassCard for container surfaces
- **Buttons**: Use GoldButton for primary actions
- **Inputs**: Use AnimatedInput for form fields
- **Stats**: Use StatCard for statistics display

### 5. Animations

- **Entries**: Use staggered fade-in for lists
- **Interactions**: Use spring animations for press states
- **Loading**: Use shimmer effects for loading states

### 6. Accessibility

- **Contrast**: Ensure text contrast ratio meets WCAG AA (4.5:1)
- **Touch Targets**: Minimum 44x44pt for interactive elements
- **Screen Readers**: Add accessibility labels to all interactive elements

---

## Theme Reference

All theme constants are exported from `@/constants/theme`:

```tsx
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Gradients,
  Glassmorphism,
  AnimationDuration,
  SpringConfigs,
  IconSizes,
  Opacity,
} from "@/constants/theme";
```

---

## Examples

### Creating a New Screen

```tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GlassCard variant="medium">
            <ThemedText type="h2">New Screen</ThemedText>
            <ThemedText>Content goes here</ThemedText>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
});
```

---

## Contributing

When adding new components or modifying the design system:

1. Follow existing patterns and conventions
2. Use theme constants for all values
3. Implement proper animations with reanimated
4. Add haptic feedback for interactions
5. Ensure accessibility compliance
6. Test on both iOS and Android
7. Document new components in this file

---

## Changelog

### Version 10.0.0
- Complete UI/UX overhaul
- New color palette with Deep Space Blue and Electric Gold
- Glassmorphism design language
- Comprehensive animation system
- Enhanced component library
- Modern typography system
- Improved accessibility

---

## Support

For questions or issues related to the design system:
1. Check this documentation first
2. Review existing components for patterns
3. Consult with the design team
4. Follow established conventions

---

**Last Updated**: January 2025
**Version**: 10.0.0

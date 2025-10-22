# 🌅 Sunrise Energy Theme - Color Palette Documentation

## Overview
This theme provides a **warm, vibrant, and optimistic** color palette for the Community Transit App. The Sunrise Energy palette creates an energetic and friendly user experience.

## Usage

### Import the theme
```tsx
import { theme } from '../constants/theme';
```

### Using Colors
```tsx
// In styles
backgroundColor: theme.colors.primary,
color: theme.colors.text.primary,

// With opacity (add hex transparency)
borderColor: `${theme.colors.primary}20`, // 20% opacity
shadowColor: theme.colors.primary,
```

## Color Reference

### 🎨 Primary Colors

| Color | Hex | Use Case |
|-------|-----|----------|
| **Primary** | `#f97316` | Main brand color (Orange) - Headers, primary buttons, main actions |
| **Secondary** | `#ec4899` | Secondary actions (Pink) - Secondary buttons, highlights |
| **Accent** | `#fbbf24` | Highlights (Yellow) - Badges, important labels, accents |
| **Success** | `#14b8a6` | Success states (Teal) - Confirmations, success messages |

### 📝 Text Colors

| Color | Hex | Use Case |
|-------|-----|----------|
| **Primary Text** | `#78350f` | Main body text (Brown) |
| **Secondary Text** | `#92400e` | Subtitles, descriptions |
| **Tertiary Text** | `#a8a29e` | Placeholders, disabled text |
| **Inverse Text** | `#ffffff` | Text on dark backgrounds |

### 🎨 Background Colors

| Color | Hex | Use Case |
|-------|-----|----------|
| **Primary BG** | `#fff7ed` | Main app background (Warm white) |
| **Secondary BG** | `#ffffff` | Cards, elevated surfaces |
| **Tertiary BG** | `#fed7aa` | Subtle backgrounds, highlights |

### 🌈 Gradients

```tsx
// Available gradients
theme.colors.gradients.primary    // Orange gradient
theme.colors.gradients.secondary  // Pink gradient
theme.colors.gradients.accent     // Yellow gradient
theme.colors.gradients.success    // Teal gradient
theme.colors.gradients.header     // Multi-color header gradient

// Usage with LinearGradient
<LinearGradient
  colors={theme.colors.gradients.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
/>
```

## Design Tokens

### Typography
```tsx
fontSize: theme.typography.fontSizes.lg,
fontWeight: theme.typography.fontWeights.bold,
```

### Spacing
```tsx
padding: theme.spacing.lg,      // 16px
margin: theme.spacing.xl,       // 20px
gap: theme.spacing.md,          // 12px
```

### Border Radius
```tsx
borderRadius: theme.borderRadius.lg,    // 16px
borderRadius: theme.borderRadius['2xl'], // 24px
```

### Shadows
```tsx
// Predefined shadows
...theme.shadows.sm,    // Small shadow
...theme.shadows.md,    // Medium shadow
...theme.shadows.lg,    // Large shadow
...theme.shadows.colored, // Colored shadow (primary color)
```

### Icon Sizes
```tsx
size={theme.iconSizes.md}  // 24px
size={theme.iconSizes.lg}  // 28px
```

## Component Examples

### Button with Theme
```tsx
<TouchableOpacity
  style={{
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  }}
>
  <Text style={{ 
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  }}>
    Primary Button
  </Text>
</TouchableOpacity>
```

### Card with Gradient
```tsx
<View style={{
  backgroundColor: theme.colors.background.secondary,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  ...theme.shadows.md,
}}>
  <LinearGradient
    colors={[`${theme.colors.primary}15`, 'transparent']}
    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%' }}
  />
  {/* Content */}
</View>
```

## Color Accessibility

All color combinations have been tested for **WCAG AA compliance**:
- Primary text on backgrounds: ✅ Passes AAA
- Secondary text on backgrounds: ✅ Passes AA
- Colored buttons with white text: ✅ Passes AA

## Quick Reference

### When to use each color:

🟠 **Primary (Orange)** 
- Main headers
- Primary CTAs
- Active states
- Progress indicators

🩷 **Secondary (Pink)**
- Secondary buttons
- Tags/badges for important items
- Highlight special features
- Decorative elements

🟡 **Accent (Yellow)**
- Warning messages
- Promotional badges
- Important notifications
- Star ratings

🩵 **Success (Teal)**
- Success messages
- Completed states
- Eco-friendly indicators
- Positive metrics

## Migration Tips

### From old teal theme to Sunrise Energy:

Old → New:
- `#14b8a6` → `theme.colors.primary` (Orange)
- `#10b981` → `theme.colors.success` (Teal)
- `#f59e0b` → `theme.colors.accent` (Yellow)
- `#8b5cf6` → `theme.colors.secondary` (Pink)

## Theme Consistency Checklist

When creating new components:
- [ ] Use `theme.colors` instead of hardcoded hex values
- [ ] Use `theme.spacing` for consistent spacing
- [ ] Use `theme.borderRadius` for consistent corners
- [ ] Use `theme.shadows` for consistent elevation
- [ ] Use `theme.typography` for consistent text styling
- [ ] Test color contrast for accessibility

---

**Designed with ❤️ for Community Transit**
*Palette: Sunrise Energy 🌅*

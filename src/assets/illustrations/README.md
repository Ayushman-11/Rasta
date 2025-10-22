# Illustrations Directory

## Required Files

### pattern.png
- **Description**: Teal/turquoise pattern with buses, buildings, clocks, and map pins
- **Usage**: Header background in HomeScreen
- **Size**: Any size (will be repeated)
- **Format**: PNG with transparency recommended
- **Color**: Teal (#14b8a6) theme

## Instructions

1. Save the bus pattern illustration as `pattern.png` in this directory
2. The image will be displayed with 15% opacity as a repeating background
3. The pattern includes: buses, buildings, clocks, location pins, people, and city elements

## Current Implementation

The header uses:
```tsx
<ImageBackground
  source={require('../assets/illustrations/pattern.png')}
  style={styles.patternBackground}
  resizeMode="repeat"
  imageStyle={{ opacity: 0.15 }}
/>
```

- **resizeMode**: "repeat" - tiles the pattern
- **opacity**: 0.15 - subtle background effect
- **position**: absolute - covers entire header

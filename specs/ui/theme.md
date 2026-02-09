# Premium UI Theme Specification

**Related Feature**: @specs/001-premium-ui-design/spec.md
**Created**: 2026-02-07
**Status**: Draft

## Overview

This document defines the complete design system for the premium todo application, including color palettes, typography, spacing, shadows, gradients, animations, and glassmorphism effects. All design tokens are optimized for both light and dark modes with accessibility as a priority.

---

## Color Palette

### Primary Colors (Indigo-Purple Gradient)

**Light Mode**:
- `primary-50`: `#f5f3ff` - Lightest tint for backgrounds
- `primary-100`: `#ede9fe` - Very light backgrounds
- `primary-200`: `#ddd6fe` - Light backgrounds, borders
- `primary-300`: `#c4b5fd` - Subtle accents
- `primary-400`: `#a78bfa` - Secondary buttons, icons
- `primary-500`: `#8b5cf6` - Primary brand color
- `primary-600`: `#7c3aed` - Primary buttons, links
- `primary-700`: `#6d28d9` - Hover states
- `primary-800`: `#5b21b6` - Active states
- `primary-900`: `#4c1d95` - Darkest shade

**Dark Mode**:
- `primary-50`: `#1e1b4b` - Darkest backgrounds
- `primary-100`: `#312e81` - Dark backgrounds
- `primary-200`: `#3730a3` - Medium backgrounds
- `primary-300`: `#4338ca` - Borders, dividers
- `primary-400`: `#6366f1` - Secondary elements
- `primary-500`: `#818cf8` - Primary brand color (lighter in dark mode)
- `primary-600`: `#a5b4fc` - Primary buttons, links
- `primary-700`: `#c7d2fe` - Hover states
- `primary-800`: `#ddd6fe` - Active states
- `primary-900`: `#ede9fe` - Lightest accents

### Accent Colors (Blue-Teal)

**Light Mode**:
- `accent-400`: `#22d3ee` - Cyan accent
- `accent-500`: `#06b6d4` - Primary accent
- `accent-600`: `#0891b2` - Accent hover
- `accent-700`: `#0e7490` - Accent active

**Dark Mode**:
- `accent-400`: `#67e8f9` - Lighter cyan
- `accent-500`: `#22d3ee` - Primary accent
- `accent-600`: `#06b6d4` - Accent hover
- `accent-700`: `#0891b2` - Accent active

### Semantic Colors

**Success (Green)**:
- Light: `#10b981` (green-500), Hover: `#059669` (green-600)
- Dark: `#34d399` (green-400), Hover: `#10b981` (green-500)

**Warning (Amber)**:
- Light: `#f59e0b` (amber-500), Hover: `#d97706` (amber-600)
- Dark: `#fbbf24` (amber-400), Hover: `#f59e0b` (amber-500)

**Danger (Red)**:
- Light: `#ef4444` (red-500), Hover: `#dc2626` (red-600)
- Dark: `#f87171` (red-400), Hover: `#ef4444` (red-500)

**Info (Blue)**:
- Light: `#3b82f6` (blue-500), Hover: `#2563eb` (blue-600)
- Dark: `#60a5fa` (blue-400), Hover: `#3b82f6` (blue-500)

### Neutral Colors

**Light Mode**:
- `gray-50`: `#f9fafb` - Page background
- `gray-100`: `#f3f4f6` - Card backgrounds
- `gray-200`: `#e5e7eb` - Borders, dividers
- `gray-300`: `#d1d5db` - Disabled states
- `gray-400`: `#9ca3af` - Placeholder text
- `gray-500`: `#6b7280` - Secondary text
- `gray-600`: `#4b5563` - Body text
- `gray-700`: `#374151` - Headings
- `gray-800`: `#1f2937` - Dark text
- `gray-900`: `#111827` - Darkest text

**Dark Mode**:
- `gray-50`: `#f9fafb` - Lightest text
- `gray-100`: `#f3f4f6` - Light text
- `gray-200`: `#e5e7eb` - Body text
- `gray-300`: `#d1d5db` - Secondary text
- `gray-400`: `#9ca3af` - Muted text
- `gray-500`: `#6b7280` - Placeholder text
- `gray-600`: `#4b5563` - Disabled text
- `gray-700`: `#374151` - Borders, dividers
- `gray-800`: `#1f2937` - Card backgrounds
- `gray-900`: `#111827` - Page background

### Background Colors

**Light Mode**:
- Page Background: `gray-50` (#f9fafb)
- Card Background: `white` (#ffffff) with subtle shadow
- Elevated Card: `white` with glassmorphism effect
- Modal Overlay: `rgba(0, 0, 0, 0.5)` with backdrop blur

**Dark Mode**:
- Page Background: `gray-900` (#111827)
- Card Background: `gray-800` (#1f2937) with subtle glow
- Elevated Card: `gray-800` with glassmorphism effect
- Modal Overlay: `rgba(0, 0, 0, 0.7)` with backdrop blur

---

## Typography

### Font Families

**Primary Font**: Inter (web font) or system-ui fallback
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Monospace Font**: For code or technical content
```css
font-family: 'Fira Code', 'Courier New', monospace;
```

### Font Weights

- `font-light`: 300 - Subtle text, large headings
- `font-normal`: 400 - Body text, paragraphs
- `font-medium`: 500 - Emphasized text, labels
- `font-semibold`: 600 - Subheadings, buttons
- `font-bold`: 700 - Headings, important text
- `font-extrabold`: 800 - Hero text, display headings

### Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Captions, helper text |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Small body text, labels |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Body text, paragraphs |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Large body text |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Small headings |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | Section headings |
| `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | Page headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Hero headings |
| `text-5xl` | 3rem (48px) | 1 | Display headings |

### Letter Spacing

- `tracking-tight`: -0.025em - Large headings
- `tracking-normal`: 0em - Body text
- `tracking-wide`: 0.025em - Uppercase labels, buttons

---

## Spacing Scale

Based on 4px base unit (0.25rem):

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | No spacing |
| `space-1` | 0.25rem (4px) | Tight spacing |
| `space-2` | 0.5rem (8px) | Small gaps |
| `space-3` | 0.75rem (12px) | Compact spacing |
| `space-4` | 1rem (16px) | Default spacing |
| `space-5` | 1.25rem (20px) | Medium spacing |
| `space-6` | 1.5rem (24px) | Large spacing |
| `space-8` | 2rem (32px) | Section spacing |
| `space-10` | 2.5rem (40px) | Large sections |
| `space-12` | 3rem (48px) | Page sections |
| `space-16` | 4rem (64px) | Hero sections |
| `space-20` | 5rem (80px) | Major sections |
| `space-24` | 6rem (96px) | Page margins |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0 | Sharp corners |
| `rounded-sm` | 0.125rem (2px) | Subtle rounding |
| `rounded` | 0.25rem (4px) | Small elements |
| `rounded-md` | 0.375rem (6px) | Buttons, inputs |
| `rounded-lg` | 0.5rem (8px) | Cards, containers |
| `rounded-xl` | 0.75rem (12px) | Large cards, modals |
| `rounded-2xl` | 1rem (16px) | Hero cards, featured elements |
| `rounded-3xl` | 1.5rem (24px) | Extra large elements |
| `rounded-full` | 9999px | Circles, pills, avatars |

---

## Shadow System

### Soft Shadows (Light Mode)

```css
/* Subtle elevation */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default card shadow */
shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

/* Medium elevation */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* High elevation */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Extra high elevation */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* Maximum elevation */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Soft Shadows (Dark Mode)

```css
/* Subtle glow */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);

/* Default card shadow */
shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4);

/* Medium elevation with glow */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(139, 92, 246, 0.1);

/* High elevation with glow */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(139, 92, 246, 0.15);

/* Extra high elevation with glow */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(139, 92, 246, 0.2);

/* Maximum elevation with strong glow */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.15);
```

### Colored Shadows (Hover States)

```css
/* Primary hover glow */
shadow-primary: 0 10px 15px -3px rgba(139, 92, 246, 0.3), 0 4px 6px -4px rgba(139, 92, 246, 0.2);

/* Accent hover glow */
shadow-accent: 0 10px 15px -3px rgba(6, 182, 212, 0.3), 0 4px 6px -4px rgba(6, 182, 212, 0.2);

/* Success glow */
shadow-success: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -4px rgba(16, 185, 129, 0.2);

/* Danger glow */
shadow-danger: 0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -4px rgba(239, 68, 68, 0.2);
```

---

## Gradient Definitions

### Primary Gradients

**Indigo-Purple Gradient** (Main brand gradient):
```css
/* Light mode */
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500

/* Dark mode */
bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400

/* Subtle background */
bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 (light)
bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 (dark)
```

**Blue-Teal Gradient** (Accent gradient):
```css
/* Light mode */
bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500

/* Dark mode */
bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400
```

### Button Gradients

**Primary Button**:
```css
/* Default */
bg-gradient-to-r from-indigo-600 to-purple-600

/* Hover */
bg-gradient-to-r from-indigo-700 to-purple-700

/* Active */
bg-gradient-to-r from-indigo-800 to-purple-800
```

**Accent Button**:
```css
/* Default */
bg-gradient-to-r from-cyan-500 to-teal-500

/* Hover */
bg-gradient-to-r from-cyan-600 to-teal-600
```

### Background Gradients

**Subtle Page Background** (Light mode):
```css
bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30
```

**Subtle Page Background** (Dark mode):
```css
bg-gradient-to-br from-gray-900 via-indigo-950/50 to-purple-950/50
```

**Hero Section Gradient**:
```css
/* Light */
bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100

/* Dark */
bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50
```

### Text Gradients

**Gradient Text** (for headings and emphasis):
```css
bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent

/* Dark mode */
bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
```

---

## Glassmorphism Effects

### Glass Card (Default)

**Light Mode**:
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
```

**Dark Mode**:
```css
background: rgba(31, 41, 55, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
```

### Glass Card (Elevated)

**Light Mode**:
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.4);
box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
```

**Dark Mode**:
```css
background: rgba(31, 41, 55, 0.8);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.1);
```

### Glass Navbar

**Light Mode**:
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px) saturate(180%);
border-bottom: 1px solid rgba(0, 0, 0, 0.1);
```

**Dark Mode**:
```css
background: rgba(17, 24, 39, 0.8);
backdrop-filter: blur(12px) saturate(180%);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
```

### Glass Modal

**Light Mode**:
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 0 20px 60px 0 rgba(31, 38, 135, 0.25);
```

**Dark Mode**:
```css
background: rgba(31, 41, 55, 0.95);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 20px 60px 0 rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15);
```

### Tailwind CSS Classes

```css
/* Glass card utility */
.glass-card {
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg;
}

/* Glass navbar utility */
.glass-navbar {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-180 border-b border-black/10 dark:border-white/10;
}

/* Glass modal utility */
.glass-modal {
  @apply bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-white/50 dark:border-white/20 shadow-2xl;
}
```

---

## Animation System

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| `duration-75` | 75ms | Instant feedback |
| `duration-100` | 100ms | Quick transitions |
| `duration-150` | 150ms | Default hover states |
| `duration-200` | 200ms | Button interactions |
| `duration-300` | 300ms | Standard transitions |
| `duration-500` | 500ms | Page transitions |
| `duration-700` | 700ms | Complex animations |
| `duration-1000` | 1000ms | Slow animations |

### Easing Functions

```css
/* Default ease */
ease: cubic-bezier(0.4, 0, 0.2, 1);

/* Ease in */
ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Ease out */
ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Ease in-out */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth (custom) */
ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);

/* Bounce (custom) */
ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Transitions

**Hover Scale**:
```css
transition: transform 200ms ease-out;
transform: scale(1.02);
```

**Hover Lift**:
```css
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
transform: translateY(-2px);
box-shadow: [elevated shadow];
```

**Fade In**:
```css
animation: fadeIn 300ms ease-out;

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up**:
```css
animation: slideUp 400ms ease-out;

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Checkmark Animation**:
```css
animation: checkmark 500ms ease-out;

@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

### Contrast Ratios

All color combinations must meet WCAG AA standards:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

### Focus States

**Default Focus Ring**:
```css
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
```

**Button Focus**:
```css
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
```

**Input Focus**:
```css
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
```

### Touch Targets

Minimum touch target size: 44x44px (iOS) / 48x48px (Android)

```css
/* Minimum interactive element size */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## Browser Fallbacks

### Backdrop Filter Fallback

```css
/* For browsers that don't support backdrop-filter */
@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
  }

  .dark .glass-card {
    background: rgba(31, 41, 55, 0.95);
  }
}
```

### Gradient Fallback

```css
/* Solid color fallback for gradients */
.gradient-button {
  background-color: #8b5cf6; /* Fallback */
  background-image: linear-gradient(to right, #8b5cf6, #a855f7);
}
```

---

## Implementation Notes

### Tailwind Configuration

Add custom colors, shadows, and animations to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* custom primary colors */ },
        accent: { /* custom accent colors */ },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'primary': '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
        // ... other custom shadows
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 400ms ease-out',
        'checkmark': 'checkmark 500ms ease-out',
      },
      keyframes: {
        fadeIn: { /* ... */ },
        slideUp: { /* ... */ },
        checkmark: { /* ... */ },
      },
    },
  },
  plugins: [],
}
```

### CSS Custom Properties

Define theme variables for easy switching:

```css
:root {
  --color-primary: 139 92 246; /* RGB values for Tailwind */
  --color-accent: 6 182 212;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.3);
}

.dark {
  --color-primary: 129 140 248;
  --color-accent: 34 211 238;
  --glass-bg: rgba(31, 41, 55, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

---

## Related Specifications

- @specs/001-premium-ui-design/spec.md - Main feature specification
- @specs/ui/layout.md - Layout implementation using this theme
- @specs/ui/pages.md - Page designs using this theme
- @specs/ui/components.md - Component styling using this theme

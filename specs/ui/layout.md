# Premium UI Layout Specification

**Related Feature**: @specs/001-premium-ui-design/spec.md
**Theme Reference**: @specs/ui/theme.md
**Created**: 2026-02-07
**Status**: Draft

## Overview

This document defines the root layout structure, navigation system, dark mode implementation, and page transition patterns for the premium todo application. All layouts use glassmorphism effects, smooth animations, and responsive design principles.

---

## Root Layout Structure

### File: `frontend/app/layout.tsx`

**Purpose**: Provides the foundational HTML structure, global providers, theme management, and consistent layout elements across all pages.

**Architecture**: Server Component with Client Component islands for interactivity

### HTML Structure

```
<!DOCTYPE html>
<html lang="en" class="[light|dark]">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Premium Todo - Modern Task Management</title>
    <!-- Fonts, meta tags, etc. -->
  </head>
  <body class="antialiased">
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <div class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-950/50 dark:to-purple-950/50 transition-colors duration-300">
            {children}
          </div>
          <Toaster />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  </body>
</html>
```

### Key Features

1. **Theme Detection**: Automatically detects system dark mode preference
2. **Theme Persistence**: Stores user's manual theme selection in localStorage
3. **Smooth Transitions**: All theme changes animate smoothly (300ms duration)
4. **Gradient Background**: Subtle gradient background that adapts to theme
5. **Global Providers**: Auth, React Query, and Toast notifications

---

## Navigation Bar (Navbar)

### Component: `<Navbar />`

**Location**: `frontend/components/layout/Navbar.tsx`
**Type**: Client Component ('use client')
**Position**: Sticky top, glassmorphism effect

### Visual Design

**Light Mode**:
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px) saturate(180%);
border-bottom: 1px solid rgba(0, 0, 0, 0.1);
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
```

**Dark Mode**:
```css
background: rgba(17, 24, 39, 0.8);
backdrop-filter: blur(12px) saturate(180%);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
```

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo + Gradient Text]        [Dark Mode]  [User Avatar ▼] │
└─────────────────────────────────────────────────────────────┘
```

**Desktop (≥ 768px)**:
- Full horizontal layout
- Logo and app name on the left
- Dark mode toggle and user menu on the right
- Height: 64px (4rem)
- Padding: px-6 py-3

**Mobile (< 768px)**:
- Compact layout
- Hamburger menu for navigation
- Logo centered or left-aligned
- Height: 56px (3.5rem)
- Padding: px-4 py-2

### Logo and App Name

**Logo**:
- Icon: CheckSquare from lucide-react
- Size: 32px (w-8 h-8)
- Color: Gradient (primary-600 to purple-600)
- Animation: Subtle pulse on hover

**App Name**:
- Text: "TaskFlow" or "Premium Todo"
- Font: font-bold text-xl
- Gradient Text Effect:
  ```css
  background: linear-gradient(to right, #7c3aed, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  ```
- Hover: Slight scale animation (scale-105)

### Dark Mode Toggle

**Component**: `<ThemeToggle />`
**Type**: Client Component with state management

**Visual Design**:
- Button with icon (Sun for light mode, Moon for dark mode)
- Size: 40x40px (touch-friendly)
- Background: Transparent with hover effect
- Border: 1px solid with theme-appropriate color
- Border radius: rounded-lg
- Transition: Smooth 300ms rotation and fade

**States**:

| State | Icon | Background | Border | Transform |
|-------|------|------------|--------|-----------|
| Light Mode | Sun (lucide-react) | transparent | gray-300 | rotate-0 |
| Light Hover | Sun | gray-100 | gray-400 | scale-110 |
| Dark Mode | Moon (lucide-react) | transparent | gray-600 | rotate-0 |
| Dark Hover | Moon | gray-800 | gray-500 | scale-110 |

**Animation**:
```css
/* Icon rotation and fade */
transition: transform 300ms ease-out, opacity 200ms ease-out;

/* On theme change */
.theme-icon-exit {
  animation: rotateOut 300ms ease-out;
}

.theme-icon-enter {
  animation: rotateIn 300ms ease-out;
}

@keyframes rotateOut {
  from { transform: rotate(0deg); opacity: 1; }
  to { transform: rotate(180deg); opacity: 0; }
}

@keyframes rotateIn {
  from { transform: rotate(-180deg); opacity: 0; }
  to { transform: rotate(0deg); opacity: 1; }
}
```

**Functionality**:
1. Detects system preference on initial load
2. Allows manual override via toggle
3. Persists preference to localStorage
4. Updates HTML class (`light` or `dark`)
5. Smooth transition for all theme-dependent elements

### User Avatar and Dropdown

**Component**: `<UserMenu />`
**Type**: Client Component with dropdown state

**Avatar**:
- Display user initials if no profile picture
- Size: 40x40px
- Border radius: rounded-full
- Background: Gradient (primary-500 to purple-500)
- Text: White, font-semibold, text-sm
- Border: 2px solid with theme color
- Hover: Scale animation (scale-110) + shadow

**Dropdown Menu**:
- Position: Absolute, right-aligned below avatar
- Width: 240px (w-60)
- Background: Glassmorphism effect
- Border radius: rounded-xl
- Shadow: shadow-xl with colored glow
- Animation: Fade in + slide down (200ms)

**Menu Items**:
```
┌──────────────────────────┐
│  [Avatar] John Doe       │
│  john@example.com        │
├──────────────────────────┤
│  [User Icon] Profile     │
│  [Settings Icon] Settings│
│  [Help Icon] Help        │
├──────────────────────────┤
│  [Logout Icon] Sign Out  │
└──────────────────────────┘
```

**Item Styling**:
- Padding: px-4 py-2.5
- Hover: Background color change + slight scale
- Icon: 20px, aligned left
- Text: font-medium text-sm
- Transition: 150ms ease-out

---

## Main Content Area

### Container Structure

```tsx
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {children}
</main>
```

**Responsive Padding**:
- Mobile (< 640px): px-4 py-6
- Tablet (640px - 1024px): px-6 py-8
- Desktop (≥ 1024px): px-8 py-10

**Max Width**: 1280px (max-w-7xl) - centered

**Background**: Transparent (inherits from root gradient)

---

## Page Transition System

### Implementation: Framer Motion

**Library**: `framer-motion` for smooth page transitions

### Transition Variants

**Fade Transition** (Default):
```tsx
const fadeVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
};

const fadeTransition = {
  duration: 0.3,
  ease: 'easeOut'
};
```

**Slide Up Transition** (Modals, Cards):
```tsx
const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const slideUpTransition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1]
};
```

**Scale Transition** (Dialogs):
```tsx
const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const scaleTransition = {
  duration: 0.2,
  ease: 'easeOut'
};
```

### Page Wrapper Component

```tsx
// frontend/components/layout/PageTransition.tsx
'use client';

import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={fadeVariants}
      transition={fadeTransition}
    >
      {children}
    </motion.div>
  );
}
```

**Usage in Pages**:
```tsx
export default function TasksPage() {
  return (
    <PageTransition>
      <div>Page content here</div>
    </PageTransition>
  );
}
```

---

## Background Patterns (Optional Enhancement)

### Subtle Gradient Mesh

**Light Mode**:
```css
background:
  radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
  radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
  radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
  linear-gradient(to bottom right, #f9fafb, #f3f4f6);
```

**Dark Mode**:
```css
background:
  radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
  radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
  radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
  linear-gradient(to bottom right, #111827, #1f2937);
```

### Dot Pattern (Alternative)

```css
background-image: radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
background-size: 24px 24px;
```

---

## Responsive Breakpoints

### Tailwind Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Layout Adaptations

**Mobile (< 768px)**:
- Single column layout
- Hamburger menu
- Compact navbar (56px height)
- Reduced padding (px-4)
- Stack elements vertically

**Tablet (768px - 1024px)**:
- Two-column grid for cards
- Expanded navbar
- Medium padding (px-6)
- Side-by-side elements where appropriate

**Desktop (≥ 1024px)**:
- Three-column grid for cards
- Full navbar with all elements visible
- Maximum padding (px-8)
- Optimal spacing and layout

---

## Loading States

### Page Loading

**Component**: `<PageLoader />`

**Visual Design**:
- Full-screen overlay with glassmorphism
- Centered spinner with gradient
- Fade in animation (200ms delay to avoid flash)

```tsx
<div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
  </div>
</div>
```

### Skeleton Loaders

**Component**: `<SkeletonCard />`, `<SkeletonText />`

**Visual Design**:
- Glassmorphism background
- Animated shimmer effect
- Matches actual content dimensions

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## Scroll Behavior

### Smooth Scrolling

```css
html {
  scroll-behavior: smooth;
}

/* Disable for users with reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Scroll-to-Top Button

**Component**: `<ScrollToTop />`
**Visibility**: Appears after scrolling 300px down

**Visual Design**:
- Fixed position: bottom-right (bottom-8 right-8)
- Size: 48x48px
- Background: Gradient with glassmorphism
- Icon: ChevronUp from lucide-react
- Shadow: shadow-lg with colored glow
- Animation: Fade in + slide up

**Behavior**:
- Smooth scroll to top on click
- Fade in when scrolling down
- Fade out when near top
- Hover: Scale + shadow increase

---

## Accessibility Features

### Skip to Content Link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
>
  Skip to main content
</a>
```

### Focus Management

- Visible focus rings on all interactive elements
- Focus trap in modals and dropdowns
- Keyboard navigation support (Tab, Shift+Tab, Escape)
- ARIA labels for icon-only buttons

### Screen Reader Announcements

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {/* Dynamic content announcements */}
</div>
```

---

## Performance Optimizations

### Code Splitting

- Lazy load heavy components (Framer Motion, charts, etc.)
- Dynamic imports for route-specific code
- Separate bundles for light/dark theme assets

### Image Optimization

- Use Next.js Image component
- Lazy loading for below-fold images
- Responsive image sizes
- WebP format with fallbacks

### CSS Optimization

- Purge unused Tailwind classes
- Minimize custom CSS
- Use CSS containment for isolated components
- Optimize backdrop-filter usage (expensive operation)

---

## Browser Support

### Minimum Requirements

- Chrome 76+ (backdrop-filter support)
- Firefox 103+ (backdrop-filter support)
- Safari 9+ (backdrop-filter with -webkit prefix)
- Edge 79+ (Chromium-based)

### Fallbacks

**Backdrop Filter**:
```css
@supports not (backdrop-filter: blur(10px)) {
  .glass-navbar {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

**CSS Grid**:
```css
@supports not (display: grid) {
  .grid-layout {
    display: flex;
    flex-wrap: wrap;
  }
}
```

---

## Implementation Checklist

- [ ] Root layout with theme provider
- [ ] Glassmorphism navbar with sticky positioning
- [ ] Dark mode toggle with smooth animation
- [ ] User avatar with dropdown menu
- [ ] Page transition system with Framer Motion
- [ ] Responsive breakpoints and mobile menu
- [ ] Loading states and skeleton loaders
- [ ] Scroll-to-top button
- [ ] Accessibility features (skip link, focus management)
- [ ] Performance optimizations (code splitting, lazy loading)
- [ ] Browser fallbacks for unsupported features

---

## Related Specifications

- @specs/001-premium-ui-design/spec.md - Main feature specification
- @specs/ui/theme.md - Design system and styling tokens
- @specs/ui/pages.md - Page-specific layouts and designs
- @specs/ui/components.md - Reusable component specifications
- @specs/features/authentication.md - User authentication for navbar

# Premium UI Components Specification

**Related Feature**: @specs/001-premium-ui-design/spec.md
**Theme Reference**: @specs/ui/theme.md
**Layout Reference**: @specs/ui/layout.md
**Created**: 2026-02-07
**Status**: Draft

## Overview

Reusable React components for the Full-Stack Web Todo Application with premium visual design. All components feature glassmorphism effects, gradient accents, smooth animations, and perfect dark mode support. Built with TypeScript, Tailwind CSS, and Lucide React icons.

## Component Design Principles

- **Premium Aesthetics**: Glassmorphism, gradients, soft shadows, smooth animations
- **Reusability**: Components are generic and configurable via props
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA attributes
- **Responsiveness**: Mobile-first design with Tailwind breakpoints
- **Type Safety**: Full TypeScript support with proper prop types
- **Composition**: Small, focused components that compose well
- **Performance**: Optimized rendering with React best practices
- **Dark Mode**: Perfect support for both light and dark themes

---

## Navigation Components

### Navbar

**Purpose**: Premium navigation bar with glassmorphism, gradient logo, dark mode toggle, and user menu.

**Location**: `frontend/components/layout/Navbar.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface NavbarProps {
  user?: {
    name?: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}
```

**Visual Design**:

**Glassmorphism Effect**:
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
```

**Features**:
- Sticky positioning (sticky top-0 z-50)
- Gradient logo with app name
- Dark mode toggle with smooth animation
- User avatar with dropdown menu
- Responsive: full layout on desktop, compact on mobile
- Smooth transitions for all interactions

**Styling** (Tailwind classes):
```tsx
className="sticky top-0 z-50 glass-navbar"
```

**Elements**:

1. **Logo Section**:
   - Icon: CheckSquare from lucide-react (w-8 h-8)
   - Gradient color: `text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600`
   - App name: font-bold text-xl with gradient
   - Hover: scale-105 transition

2. **Dark Mode Toggle**:
   - Component: `<ThemeToggle />`
   - Size: 40x40px (w-10 h-10)
   - Icons: Sun/Moon from lucide-react
   - Smooth rotation animation (300ms)
   - Glassmorphism button background

3. **User Menu**:
   - Component: `<UserMenu />`
   - Avatar: rounded-full with gradient border
   - Dropdown: glassmorphism with backdrop blur
   - Menu items: Profile, Settings, Help, Sign Out

**Animations**:
- Navbar: Slide down on mount (200ms)
- Logo: Pulse on hover
- Theme toggle: Rotate + fade (300ms)
- Dropdown: Fade + slide down (200ms)

**Example Usage**:
```tsx
<Navbar
  user={{ name: "John Doe", email: "john@example.com" }}
  onLogout={handleLogout}
/>
```

---

## Task Display Components

### TaskCard

**Purpose**: Premium task card with glassmorphism, gradient border on hover, and smooth animations.

**Location**: `frontend/components/task/TaskCard.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  };
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}
```

**Visual Design**:

**Card Styling**:
```css
/* Light mode */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
border-radius: 1rem; /* rounded-2xl */

/* Hover state */
transform: translateY(-4px);
box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15);
border: 1px solid rgba(139, 92, 246, 0.3);
```

**Dark Mode**:
```css
background: rgba(31, 41, 55, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

/* Hover state */
box-shadow: 0 12px 24px rgba(139, 92, 246, 0.25), 0 0 20px rgba(139, 92, 246, 0.1);
border: 1px solid rgba(139, 92, 246, 0.4);
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ ☐ Complete project documentation       │
│   [Gradient on hover]                   │
│                                         │
│   Write comprehensive API docs for...   │
│   [Truncated with fade]                 │
│                                         │
│   📅 Created: Feb 7, 2026               │
│                                         │
│   [Edit] [Delete] ← Appear on hover     │
└─────────────────────────────────────────┘
```

**Elements**:

1. **Checkbox**:
   - Custom styled with gradient when checked
   - Size: w-5 h-5
   - Smooth check animation (300ms)
   - Ripple effect on click

2. **Title**:
   - Font: text-lg font-semibold
   - Gradient on hover: `bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent`
   - Completed: line-through with reduced opacity
   - Transition: 200ms ease-out

3. **Description**:
   - Font: text-sm text-gray-600 dark:text-gray-400
   - Truncate: line-clamp-2
   - Fade effect at end
   - Expand on click (optional)

4. **Date Badge**:
   - Icon: Calendar from lucide-react
   - Font: text-xs text-gray-500
   - Glassmorphism background
   - Rounded: rounded-full px-3 py-1

5. **Action Buttons**:
   - Opacity: 0 by default, 100 on card hover
   - Edit: Primary color with pencil icon
   - Delete: Danger color with trash icon
   - Size: 32x32px (w-8 h-8)
   - Hover: Scale + shadow

**Animations**:
```tsx
// Card hover animation
transition: all 200ms ease-out;
hover: translateY(-4px) + shadow increase

// Checkbox animation
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

// Action buttons fade in
transition: opacity 200ms ease-out;
```

**Completed State**:
- Title: line-through + opacity-60
- Card: Subtle green tint on border
- Checkbox: Gradient fill with checkmark animation
- Celebration micro-animation (optional)

**Example Usage**:
```tsx
<TaskCard
  task={task}
  onToggleComplete={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showActions={true}
/>
```

---

### TaskList

**Purpose**: Container for displaying multiple TaskCard components with stagger animation.

**Location**: `frontend/components/task/TaskList.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  layout?: 'grid' | 'list';
  emptyMessage?: string;
}
```

**Features**:
- Responsive grid layout
- Stagger animation for cards (each card delays by 50ms)
- Empty state with illustration
- Loading skeleton support
- Smooth add/remove animations

**Grid Layout**:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**Stagger Animation**:
```tsx
// Each card animates in with delay
cards.map((task, index) => (
  <motion.div
    key={task.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
  >
    <TaskCard task={task} />
  </motion.div>
))
```

---

## Form Components

### TaskForm

**Purpose**: Premium form for creating/editing tasks with glassmorphism and real-time preview.

**Location**: `frontend/components/task/TaskForm.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface TaskFormProps {
  initialValues?: {
    title: string;
    description?: string;
    completed: boolean;
  };
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}
```

**Visual Design**:
- Glassmorphism card background
- Gradient submit button
- Real-time validation with icons
- Character counters
- Preview card (optional)

**Features**:
- Auto-resize textarea
- Real-time validation
- Character counters (title: 255, description: 1000)
- Keyboard shortcuts (Cmd/Ctrl + Enter to submit)
- Loading state with spinner
- Error messages with icons

**Styling**:
```tsx
className="glass-card p-8 rounded-3xl space-y-6"
```

---

### Input

**Purpose**: Premium text input with glassmorphism, icons, and validation.

**Location**: `frontend/components/form/Input.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  autoComplete?: string;
}
```

**Visual Design**:

**Input Styling**:
```css
/* Light mode */
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(8px);
border: 1px solid rgba(0, 0, 0, 0.1);
border-radius: 0.75rem; /* rounded-xl */

/* Focus state */
border: 1px solid rgba(139, 92, 246, 0.5);
box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
```

**Features**:
- Left icon support (from lucide-react)
- Character counter (if maxLength provided)
- Error state with red border and icon
- Success state with green border and checkmark
- Disabled state with reduced opacity
- Focus ring animation

**States**:

| State | Border | Background | Icon |
|-------|--------|------------|------|
| Default | gray-300 | white/60 | gray-400 |
| Focus | primary-500 | white/70 | primary-600 |
| Error | red-500 | red-50/50 | red-500 |
| Success | green-500 | green-50/50 | green-500 |
| Disabled | gray-200 | gray-100/50 | gray-300 |

**Example Usage**:
```tsx
<Input
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  icon={<Mail className="w-5 h-5" />}
  required
  error={emailError}
/>
```

---

### Button

**Purpose**: Premium button with gradient backgrounds, loading states, and animations.

**Location**: `frontend/components/form/Button.tsx`
**Type**: Client Component ('use client')

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
```

**Variants**:

**Primary** (Gradient):
```css
background: linear-gradient(to right, #7c3aed, #a855f7);
color: white;
box-shadow: 0 4px 6px rgba(139, 92, 246, 0.25);

/* Hover */
background: linear-gradient(to right, #6d28d9, #9333ea);
transform: scale(1.02);
box-shadow: 0 8px 12px rgba(139, 92, 246, 0.35);
```

**Secondary** (Glassmorphism):
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(139, 92, 246, 0.3);
color: primary-700;

/* Hover */
background: rgba(255, 255, 255, 0.9);
border: 1px solid rgba(139, 92, 246, 0.5);
```

**Danger** (Red Gradient):
```css
background: linear-gradient(to right, #dc2626, #ef4444);
color: white;

/* Hover */
background: linear-gradient(to right, #b91c1c, #dc2626);
```

**Ghost** (Transparent):
```css
background: transparent;
color: gray-700;

/* Hover */
background: rgba(0, 0, 0, 0.05);
```

**Sizes**:
- Small: `px-4 py-2 text-sm`
- Medium: `px-6 py-3 text-base`
- Large: `px-8 py-4 text-lg`

**Loading State**:
- Spinner replaces icon or appears before text
- Button disabled during loading
- Gradient spinner animation

**Animations**:
```tsx
// Hover animation
transition: all 200ms ease-out;
hover: scale(1.02) + shadow increase

// Click animation
active: scale(0.98)

// Loading spinner
animation: spin 1s linear infinite;
```

**Example Usage**:
```tsx
<Button
  variant="primary"
  size="md"
  onClick={handleSubmit}
  loading={isLoading}
  icon={<Plus className="w-5 h-5" />}
  iconPosition="left"
>
  Create Task
</Button>
```

---

## Feedback Components

### StatusBadge

**Purpose**: Colored badge for task status with gradient and glassmorphism.

**Location**: `frontend/components/feedback/StatusBadge.tsx`

**Props**:
```typescript
interface StatusBadgeProps {
  status: 'completed' | 'incomplete' | 'in-progress';
  size?: 'sm' | 'md';
  showIcon?: boolean;
}
```

**Visual Design**:

**Completed** (Green):
```css
background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
backdrop-filter: blur(8px);
border: 1px solid rgba(16, 185, 129, 0.3);
color: green-700;
```

**Incomplete** (Amber):
```css
background: linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
backdrop-filter: blur(8px);
border: 1px solid rgba(245, 158, 11, 0.3);
color: amber-700;
```

**In Progress** (Blue):
```css
background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
backdrop-filter: blur(8px);
border: 1px solid rgba(59, 130, 246, 0.3);
color: blue-700;
```

**Features**:
- Icon from lucide-react (CheckCircle, Clock, Circle)
- Smooth color transitions
- Pulse animation for in-progress

---

### LoadingSpinner

**Purpose**: Animated loading indicator with gradient.

**Location**: `frontend/components/feedback/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
}
```

**Visual Design**:

**Gradient Spinner**:
```css
border: 3px solid rgba(139, 92, 246, 0.2);
border-top-color: #7c3aed;
border-radius: 50%;
animation: spin 1s linear infinite;
```

**Sizes**:
- Small: 16px (w-4 h-4)
- Medium: 32px (w-8 h-8)
- Large: 48px (w-12 h-12)

**Full Screen Mode**:
```tsx
<div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="flex flex-col items-center gap-4">
    <div className="spinner" />
    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  </div>
</div>
```

---

### EmptyState

**Purpose**: Beautiful empty state with gradient icon and call-to-action.

**Location**: `frontend/components/feedback/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}
```

**Visual Design**:
- Centered layout
- Large gradient icon (w-24 h-24)
- Bold title with gradient text
- Subtle description
- Gradient CTA button
- Fade-in animation

**Example**:
```tsx
<EmptyState
  icon={<CheckCircle className="w-24 h-24" />}
  title="No tasks yet!"
  description="Create your first task to get started."
  action={{
    label: "Create Task",
    onClick: handleCreate,
    icon: <Plus />
  }}
/>
```

---

### Toast

**Purpose**: Temporary notification with glassmorphism and slide animation.

**Location**: `frontend/components/feedback/Toast.tsx`

**Props**:
```typescript
interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}
```

**Visual Design**:

**Success**:
```css
background: rgba(16, 185, 129, 0.95);
backdrop-filter: blur(12px);
border: 1px solid rgba(16, 185, 129, 0.3);
color: white;
box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
```

**Position**: Fixed bottom-right (bottom-4 right-4)

**Animation**:
```tsx
// Slide in from right
initial: { x: 400, opacity: 0 }
animate: { x: 0, opacity: 1 }
exit: { x: 400, opacity: 0 }
transition: { duration: 0.3, ease: 'easeOut' }
```

---

## Dialog Components

### Modal

**Purpose**: Premium modal with glassmorphism and backdrop blur.

**Location**: `frontend/components/dialog/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

**Visual Design**:

**Backdrop**:
```css
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
```

**Modal Card**:
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
border-radius: 1.5rem;
```

**Animations**:
```tsx
// Backdrop fade
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }

// Modal scale
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.95 }
```

**Features**:
- Focus trap
- Escape key to close
- Click outside to close
- Scroll lock on body
- Return focus on close

---

### DeleteConfirmDialog

**Purpose**: Confirmation dialog for destructive actions with danger styling.

**Location**: `frontend/components/dialog/DeleteConfirmDialog.tsx`

**Props**:
```typescript
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}
```

**Visual Design**:
- Warning icon with red gradient
- Danger button with red gradient
- Glassmorphism modal
- Shake animation on open (subtle)

**Example**:
```tsx
<DeleteConfirmDialog
  isOpen={showDialog}
  onClose={handleClose}
  onConfirm={handleDelete}
  title="Delete Task"
  message="Are you sure you want to delete this task? This action cannot be undone."
  confirmLabel="Delete"
  isLoading={isDeleting}
/>
```

---

## Utility Components

### SkeletonLoader

**Purpose**: Loading placeholder with shimmer animation and glassmorphism.

**Location**: `frontend/components/utility/SkeletonLoader.tsx`

**Props**:
```typescript
interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'circle' | 'button';
  count?: number;
  height?: string;
  width?: string;
}
```

**Visual Design**:

**Base Styling**:
```css
background: rgba(255, 255, 255, 0.5);
backdrop-filter: blur(8px);
border: 1px solid rgba(0, 0, 0, 0.05);
```

**Shimmer Animation**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Variants**:
- Text: Multiple lines with varying widths
- Card: Full task card shape
- Circle: Avatar placeholder
- Button: Button-shaped placeholder

---

## Implementation Notes

### Tailwind Configuration

Add custom utilities for glassmorphism:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Custom utilities
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-navbar': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(12px) saturate(180%)',
          'border-bottom': '1px solid rgba(0, 0, 0, 0.1)',
        },
      });
    },
  ],
};
```

### Animation Performance

```tsx
// Use CSS transforms for better performance
transform: translateY(-4px); // Good
top: -4px; // Bad

// Use will-change for animated elements
will-change: transform, opacity;

// Remove will-change after animation
onAnimationEnd={() => {
  element.style.willChange = 'auto';
}}
```

### Reduced Motion Support

```tsx
// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationDuration = prefersReducedMotion ? 0 : 300;
```

---

## Related Specifications

- @specs/001-premium-ui-design/spec.md - Main feature specification
- @specs/ui/theme.md - Design system and styling tokens
- @specs/ui/layout.md - Root layout and navigation
- @specs/ui/pages.md - Page designs using these components
- @specs/features/task-crud.md - Task management functionality

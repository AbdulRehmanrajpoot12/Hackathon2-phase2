# Premium UI Pages Specification

**Related Feature**: @specs/001-premium-ui-design/spec.md
**Theme Reference**: @specs/ui/theme.md
**Layout Reference**: @specs/ui/layout.md
**Created**: 2026-02-07
**Status**: Draft

## Overview

Complete page structure for the Full-Stack Web Todo Application with premium visual design. All pages feature glassmorphism effects, gradient accents, smooth animations, and perfect dark mode support. Built with Next.js 16+ App Router using Server Components by default and Client Components for interactivity.

---

## Page Routing Structure

### Next.js App Router Directory Structure
```
frontend/app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home/landing page (/)
├── (auth)/                    # Auth route group (public)
│   ├── layout.tsx            # Auth layout (centered card)
│   ├── signin/
│   │   └── page.tsx          # Sign in page
│   └── signup/
│       └── page.tsx          # Sign up page
└── (protected)/              # Protected route group (requires auth)
    ├── layout.tsx            # Protected layout (with navbar)
    └── tasks/
        ├── page.tsx          # Task list page
        ├── new/
        │   └── page.tsx      # Create new task page
        └── [id]/
            └── edit/
                └── page.tsx  # Edit task page
```

---

## Public Pages

### 1. Home Page (/)

**Route**: `/`
**File**: `frontend/app/page.tsx`
**Type**: Server Component
**Authentication**: Public (redirects based on auth status)

**Purpose**: Landing page with beautiful welcome screen that redirects authenticated users to tasks, unauthenticated users to signin.

**Visual Design**:

**Background**:
```css
/* Animated gradient background */
background: linear-gradient(135deg,
  rgba(139, 92, 246, 0.1) 0%,
  rgba(168, 85, 247, 0.1) 25%,
  rgba(236, 72, 153, 0.1) 50%,
  rgba(59, 130, 246, 0.1) 75%,
  rgba(139, 92, 246, 0.1) 100%
);
background-size: 400% 400%;
animation: gradientShift 15s ease infinite;
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│         [Gradient Logo Icon]                │
│                                             │
│      ✨ Premium Todo                        │
│      Modern Task Management                 │
│                                             │
│      [Checking authentication...]           │
│      [Animated spinner with gradient]       │
│                                             │
└─────────────────────────────────────────────┘
```

**Elements**:
- Centered content (flex items-center justify-center min-h-screen)
- Large gradient logo icon (w-20 h-20)
- App name with gradient text effect
- Tagline with subtle animation
- Loading spinner with gradient border
- Fade-in animation (500ms)

**Behavior**:
1. Show welcome screen with fade-in animation
2. Check authentication status (100ms delay for smooth UX)
3. If authenticated → fade out and redirect to `/tasks`
4. If not authenticated → fade out and redirect to `/signin`
5. Transition duration: 300ms

---

### 2. Sign In Page (/signin)

**Route**: `/signin`
**File**: `frontend/app/(auth)/signin/page.tsx`
**Type**: Client Component ('use client')
**Authentication**: Public (redirects if already authenticated)

**Purpose**: Premium login experience with glassmorphism card and gradient button.

**Visual Design**:

**Background**: Subtle animated gradient
```css
background: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            linear-gradient(to bottom, #f9fafb, #f3f4f6);
```

**Card Design**:
```css
/* Glassmorphism card */
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.4);
box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15);
border-radius: 1.5rem; /* rounded-3xl */
padding: 3rem; /* p-12 */
max-width: 28rem; /* max-w-md */
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│         [Gradient Logo + App Name]          │
│                                             │
│         Welcome Back                        │
│         Sign in to continue                 │
│                                             │
│  Email                                      │
│  [_____________________________________]    │
│                                             │
│  Password                                   │
│  [_____________________________________]    │
│  [Forgot password?]                         │
│                                             │
│  [Sign In - Gradient Button]                │
│                                             │
│  Don't have an account? [Sign up]           │
│                                             │
│  [Error alert with icon if any]             │
│                                             │
└─────────────────────────────────────────────┘
```

**Elements**:

1. **Logo and App Name**:
   - Centered at top
   - Logo with gradient (w-16 h-16)
   - App name with gradient text
   - Margin bottom: mb-8

2. **Heading**:
   - "Welcome Back" - text-3xl font-bold gradient text
   - "Sign in to continue" - text-gray-600 dark:text-gray-400 text-sm

3. **Email Input**:
   - Label: "Email" - font-medium text-sm
   - Input with glassmorphism effect
   - Icon: Mail from lucide-react (left side)
   - Focus: Ring with primary color
   - Validation: Real-time email format check

4. **Password Input**:
   - Label: "Password" - font-medium text-sm
   - Input with glassmorphism effect
   - Icon: Lock from lucide-react (left side)
   - Toggle visibility icon (Eye/EyeOff)
   - Focus: Ring with primary color

5. **Forgot Password Link**:
   - Right-aligned below password
   - text-sm text-primary-600 hover:text-primary-700
   - Underline on hover

6. **Sign In Button**:
   - Full width (w-full)
   - Gradient background (primary-600 to purple-600)
   - Height: h-12
   - Font: font-semibold
   - Hover: Gradient shift + scale(1.02) + shadow increase
   - Loading state: Spinner inside button
   - Disabled state: Opacity 50%, cursor-not-allowed

7. **Sign Up Link**:
   - Centered below button
   - "Don't have an account?" - text-gray-600
   - "Sign up" - text-primary-600 font-semibold hover:underline

8. **Error Alert**:
   - Appears below form with slide-down animation
   - Red background with icon
   - Dismissible with X button

**Animations**:
- Card: Fade in + slide up (400ms)
- Inputs: Focus ring animation (150ms)
- Button: Hover scale + gradient shift (200ms)
- Error: Slide down + fade in (300ms)

**Dark Mode Adaptations**:
- Card background: rgba(31, 41, 55, 0.8)
- Border: rgba(255, 255, 255, 0.1)
- Shadow: Colored glow effect
- Text colors: Adjusted for contrast

---

### 3. Sign Up Page (/signup)

**Route**: `/signup`
**File**: `frontend/app/(auth)/signup/page.tsx`
**Type**: Client Component ('use client')
**Authentication**: Public (redirects if already authenticated)

**Purpose**: Premium registration experience with enhanced form validation.

**Visual Design**: Similar to Sign In page with additional fields

**Layout**:
```
┌─────────────────────────────────────────────┐
│                                             │
│         [Gradient Logo + App Name]          │
│                                             │
│         Create Account                      │
│         Start organizing your tasks         │
│                                             │
│  Name (optional)                            │
│  [_____________________________________]    │
│                                             │
│  Email                                      │
│  [_____________________________________]    │
│                                             │
│  Password                                   │
│  [_____________________________________]    │
│  [Password strength indicator]              │
│                                             │
│  Confirm Password                           │
│  [_____________________________________]    │
│                                             │
│  [Sign Up - Gradient Button]                │
│                                             │
│  Already have an account? [Sign in]         │
│                                             │
└─────────────────────────────────────────────┘
```

**Additional Elements**:

1. **Name Input** (Optional):
   - Icon: User from lucide-react
   - Placeholder: "John Doe"
   - Optional badge: text-xs text-gray-500

2. **Password Strength Indicator**:
   - Visual bar below password input
   - Colors: Red (weak) → Yellow (medium) → Green (strong)
   - Animated width transition
   - Text label: "Weak", "Medium", "Strong"

3. **Confirm Password**:
   - Real-time match validation
   - Check icon appears when passwords match
   - X icon appears when passwords don't match

**Validation**:
- Name: Optional, max 255 characters
- Email: Required, valid format, real-time check
- Password: Min 8 chars, complexity requirements
- Confirm: Must match password
- All errors shown inline with icons

---

### 4. Task List Page (/tasks)

**Route**: `/tasks`
**File**: `frontend/app/(protected)/tasks/page.tsx`
**Type**: Server Component (data fetching) + Client Components (interactions)
**Authentication**: Required

**Purpose**: Modern dashboard-style task list with premium aesthetics.

**Visual Design**:

**Hero Section**:
```
┌─────────────────────────────────────────────────────────┐
│  My Tasks                              [+ New Task]      │
│  Manage your daily tasks efficiently                     │
│                                                          │
│  [All] [Active] [Completed]    Sort: [Newest ▼]         │
└─────────────────────────────────────────────────────────┘
```

**Hero Styling**:
- Background: Subtle gradient (primary-50 to purple-50 in light mode)
- Padding: py-8 px-6
- Border radius: rounded-2xl
- Margin bottom: mb-8

**Elements**:

1. **Page Header**:
   - "My Tasks" - text-4xl font-bold gradient text
   - Subtitle - text-gray-600 dark:text-gray-400
   - New Task Button:
     - Gradient background (primary-600 to purple-600)
     - Icon: Plus from lucide-react
     - Hover: Scale + shadow + gradient shift
     - Size: px-6 py-3 rounded-xl

2. **Filter Bar**:
   - Button group with glassmorphism
   - Options: All, Active, Completed
   - Active state: Gradient background + white text
   - Inactive: Transparent + hover effect
   - Smooth transition between states (200ms)

3. **Sort Dropdown**:
   - Glassmorphism button
   - Icon: ArrowUpDown from lucide-react
   - Options: Newest, Oldest, A-Z, Z-A
   - Dropdown with glassmorphism effect
   - Checkmark for active sort

**Task Grid**:
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Task Card 1  │  │ Task Card 2  │  │ Task Card 3  │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Task Card 4  │  │ Task Card 5  │  │ Task Card 6  │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Grid Layout**:
- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3 columns (lg:grid-cols-3)
- Gap: gap-6
- Stagger animation: Each card fades in with delay

**Task Card Design** (See @specs/ui/components.md for full details):
- Glassmorphism effect
- Gradient border on hover
- Checkbox with smooth animation
- Title with gradient on hover
- Description (truncated)
- Created date with icon
- Edit/Delete buttons (appear on hover)
- Hover: Lift effect (translateY(-4px)) + shadow increase

**Empty State**:
```
┌─────────────────────────────────────────────┐
│                                             │
│         [Large Icon - CheckCircle]          │
│                                             │
│         No tasks yet!                       │
│         Create your first task to           │
│         get started.                        │
│                                             │
│         [+ Create Task Button]              │
│                                             │
└─────────────────────────────────────────────┘
```

**Empty State Styling**:
- Centered content
- Icon: w-24 h-24 with gradient
- Heading: text-2xl font-bold
- Description: text-gray-600
- Button: Gradient with icon
- Fade-in animation

**Loading State**:
- Skeleton cards with shimmer effect
- Same grid layout as actual cards
- Glassmorphism background
- Animated pulse

---

### 5. Create Task Page (/tasks/new)

**Route**: `/tasks/new`
**File**: `frontend/app/(protected)/tasks/new/page.tsx`
**Type**: Client Component ('use client')
**Authentication**: Required

**Purpose**: Beautiful form for creating new tasks with premium styling.

**Visual Design**:

**Layout**: Modal-style centered card (alternative: full page with sidebar)

**Modal Approach**:
```
┌─────────────────────────────────────────────┐
│  [← Back]  Create New Task                  │
├─────────────────────────────────────────────┤
│                                             │
│  Title *                                    │
│  [_____________________________________]    │
│                                             │
│  Description                                │
│  [_____________________________________]    │
│  [_____________________________________]    │
│  [_____________________________________]    │
│  [_____________________________________]    │
│                                             │
│  Status                                     │
│  ○ To Do    ○ Completed                     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Preview                             │   │
│  │ [Task preview with styling]         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Cancel]  [Create Task - Gradient]         │
│                                             │
└─────────────────────────────────────────────┘
```

**Card Styling**:
- Max width: max-w-3xl
- Glassmorphism effect
- Padding: p-8
- Border radius: rounded-3xl
- Shadow: shadow-2xl with colored glow

**Elements**:

1. **Header**:
   - Back button: Icon button with hover effect
   - Title: text-2xl font-bold gradient text
   - Divider: border-b with gradient

2. **Title Input**:
   - Large input: text-lg
   - Glassmorphism background
   - Character counter: "0/255"
   - Real-time validation
   - Focus: Ring + scale(1.01)

3. **Description Textarea**:
   - Auto-resize (min 4 rows, max 12 rows)
   - Glassmorphism background
   - Character counter: "0/1000"
   - Markdown preview toggle (optional)

4. **Status Radio Group**:
   - Custom styled radio buttons
   - Glassmorphism cards
   - Icon for each option
   - Smooth selection animation

5. **Preview Card**:
   - Shows how task will appear
   - Real-time updates as user types
   - Glassmorphism styling
   - Fade-in when content exists

6. **Action Buttons**:
   - Cancel: Secondary style (ghost)
   - Create: Gradient with icon
   - Loading state: Spinner in button
   - Keyboard shortcut: Cmd/Ctrl + Enter

**Animations**:
- Form: Slide up + fade in (400ms)
- Inputs: Focus ring animation
- Preview: Fade in when content changes
- Submit: Button scale + success animation

---

### 6. Edit Task Page (/tasks/[id]/edit)

**Route**: `/tasks/[id]/edit`
**File**: `frontend/app/(protected)/tasks/[id]/edit/page.tsx`
**Type**: Client Component ('use client')
**Authentication**: Required

**Purpose**: Edit existing task with pre-filled form and delete option.

**Visual Design**: Similar to Create Task page with additions

**Layout**:
```
┌─────────────────────────────────────────────┐
│  [← Back]  Edit Task                        │
├─────────────────────────────────────────────┤
│                                             │
│  Title *                                    │
│  [Complete project documentation________]   │
│                                             │
│  Description                                │
│  [Write comprehensive API docs__________]   │
│  [_____________________________________]    │
│                                             │
│  Status                                     │
│  ● To Do    ○ Completed                     │
│                                             │
│  Created: Feb 7, 2026 at 10:30 AM           │
│  Last updated: Feb 7, 2026 at 11:45 AM      │
│                                             │
│  [Delete Task]  [Cancel]  [Save Changes]    │
│                                             │
└─────────────────────────────────────────────┘
```

**Additional Elements**:

1. **Metadata Display**:
   - Created date with icon
   - Last updated date with icon
   - Subtle styling: text-sm text-gray-500
   - Icons from lucide-react

2. **Delete Button**:
   - Danger styling (red gradient)
   - Icon: Trash2 from lucide-react
   - Confirmation dialog on click
   - Position: Left side of button group

3. **Delete Confirmation Dialog**:
   - Glassmorphism modal
   - Warning icon with red gradient
   - "Are you sure?" heading
   - Description of consequences
   - Cancel + Delete buttons
   - Backdrop blur overlay
   - Escape key to cancel

**Animations**:
- Pre-fill: Smooth value population (200ms)
- Delete dialog: Scale + fade in (200ms)
- Success: Checkmark animation + redirect

---

## Responsive Design

### Mobile Optimizations (< 768px)

**All Pages**:
- Single column layout
- Increased touch targets (min 44x44px)
- Reduced padding (px-4 instead of px-8)
- Stacked buttons (full width)
- Simplified animations (faster, less complex)

**Task List**:
- Single column grid
- Compact task cards
- Bottom sheet for filters (instead of inline)
- Floating action button for new task

**Forms**:
- Full-width inputs
- Larger text (text-base instead of text-sm)
- Simplified preview (collapsible)

### Tablet Optimizations (768px - 1024px)

**Task List**:
- Two-column grid
- Medium-sized cards
- Side-by-side filters and sort

**Forms**:
- Centered with max-width
- Two-column layout for radio groups

### Desktop Optimizations (≥ 1024px)

**Task List**:
- Three-column grid
- Hover effects enabled
- Keyboard shortcuts visible
- Sidebar for filters (optional)

**Forms**:
- Side-by-side preview
- Keyboard shortcuts prominent

---

## Performance Optimizations

### Code Splitting
- Lazy load form components
- Dynamic import for Framer Motion
- Separate bundles for auth and protected routes

### Image Optimization
- Use Next.js Image component
- Lazy load below-fold content
- WebP format with fallbacks

### Animation Performance
- Use CSS transforms (not position changes)
- Use will-change for animated elements
- Disable animations on low-end devices
- Respect prefers-reduced-motion

---

## Accessibility

### Keyboard Navigation
- Tab order follows visual flow
- Escape closes modals/dropdowns
- Enter submits forms
- Arrow keys navigate lists

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for icon buttons
- Live regions for dynamic content
- Status announcements

### Focus Management
- Visible focus indicators
- Focus trap in modals
- Return focus after modal close
- Skip to content link

---

## Related Specifications

- @specs/001-premium-ui-design/spec.md - Main feature specification
- @specs/ui/theme.md - Design system and styling tokens
- @specs/ui/layout.md - Root layout and navigation
- @specs/ui/components.md - Reusable component specifications
- @specs/features/authentication.md - Authentication flow
- @specs/features/task-crud.md - Task management operations
- @specs/api/rest-endpoints.md - API endpoints consumed by pages

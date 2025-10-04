# UI Design System Rules

A comprehensive guide for creating modern, accessible, and delightful user interfaces based on best practices and design patterns.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Layout & Spacing](#layout--spacing)
4. [Components](#components)
5. [Animations & Interactions](#animations--interactions)
6. [Responsive Design](#responsive-design)
7. [Visual Effects](#visual-effects)
8. [Accessibility](#accessibility)

---

## Color System

### 1. Use OKLCH Color Space
- **Rule**: Define colors using OKLCH for better perceptual uniformity and easier color manipulation
- **Implementation**: `oklch(lightness chroma hue)`
- **Benefits**: More predictable color mixing, better accessibility calculations

### 2. Semantic Color Variables
Create a comprehensive set of semantic color tokens:

```css
--background: Primary background color
--foreground: Primary text color
--card: Card/container background
--card-foreground: Text on cards
--primary: Brand/action color
--primary-foreground: Text on primary
--secondary: Supporting actions
--muted: Subtle backgrounds
--muted-foreground: Subtle text
--accent: Highlight color
--destructive: Error/danger states
--border: Border colors
--input: Form input backgrounds
--ring: Focus ring color
```

### 3. Dark Mode Strategy
- **Rule**: Every color must have a light and dark variant
- **Implementation**: Use CSS custom properties with `.dark` class override
- **Contrast Ratios**:
  - Light mode: Dark text on light backgrounds
  - Dark mode: Light text on dark backgrounds with reduced opacity for borders

### 4. Opacity-Based Overlays
- **Rule**: Use opacity for overlays and glass effects
- **Examples**:
  - Borders: `oklch(1 0 0 / 10%)`
  - Overlays: `bg-black/20`
  - Glass effects: `bg-background/80 backdrop-blur-md`

### 5. Gradient Patterns
- **Primary gradients**: `from-primary/5 via-transparent to-primary/10`
- **Mesh gradients**: Layer multiple gradients for depth
- **Animated gradients**: Use `animate-pulse` for subtle movement

---

## Typography

### 1. Font Stack
```css
--font-sans: Modern sans-serif (e.g., Geist Sans, Inter, system-ui)
--font-mono: Monospace for code (e.g., Geist Mono, Fira Code)
```

### 2. Type Scale
Use a consistent type scale with clear hierarchy:

```
text-xs: 0.75rem    - Metadata, labels
text-sm: 0.875rem   - Secondary text, captions
text-base: 1rem     - Body text
text-lg: 1.125rem   - Emphasized body
text-xl: 1.25rem    - Small headings
text-2xl: 1.5rem    - Section headings
text-3xl: 1.875rem  - Major headings
text-4xl: 2.25rem   - Page titles
text-5xl: 3rem      - Hero text
text-6xl: 3.75rem   - Display text
```

### 3. Font Weights
- **Regular (400)**: Body text
- **Medium (500)**: UI labels, buttons
- **Semibold (600)**: Subheadings
- **Bold (700)**: Headings, emphasis

### 4. Line Height
- **Tight**: Headings (`leading-tight`)
- **Normal**: Body text (`leading-normal`)
- **Relaxed**: Long-form content (`leading-relaxed`)

### 5. Text Colors
- **Primary text**: `text-foreground`
- **Secondary text**: `text-muted-foreground`
- **Interactive text**: `text-primary hover:text-primary/90`

---

## Layout & Spacing

### 1. Container Strategy
```css
container mx-auto px-4
max-w-6xl mx-auto (for content areas)
```

### 2. Spacing Scale
Follow a consistent spacing system:
```
0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 5rem, 6rem, 8rem, 10rem
```

### 3. Grid Systems
- **Two-column**: `grid lg:grid-cols-2 gap-12`
- **Three-column**: `grid md:grid-cols-3 gap-6`
- **Masonry**: Use `columns-1 md:columns-2 lg:columns-3`

### 4. Section Padding
- **Standard sections**: `py-20`
- **Hero sections**: `min-h-screen`
- **Compact sections**: `py-12`

### 5. Card Layouts
- **Padding**: `p-6` or `p-8` for larger cards
- **Spacing between cards**: `gap-6` or `space-y-6`
- **Border radius**: `rounded-lg` or `rounded-xl`

---

## Components

### 1. Button Design

#### Variants
- **Primary**: Solid background with brand color
- **Secondary**: Subtle background
- **Outline**: Border only
- **Ghost**: No background, hover state only
- **Destructive**: Red/danger styling

#### Sizes
- **Small**: `h-8 px-3`
- **Default**: `h-9 px-4`
- **Large**: `h-10 px-6`
- **Icon**: `size-9` (square)

#### States
- **Hover**: Slight opacity change or background shift
- **Focus**: Visible ring with offset
- **Disabled**: `opacity-50 pointer-events-none`
- **Loading**: Include spinner, disable interaction

### 2. Card Components

#### Structure
```html
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

#### Styling
- **Background**: `bg-card`
- **Border**: `border border-border`
- **Shadow**: `shadow-sm` default, `shadow-xl` on hover
- **Hover effect**: `hover:border-primary/20`

### 3. Input Fields

#### Base Styling
- **Height**: `h-9`
- **Padding**: `px-3 py-1`
- **Border**: `border-input`
- **Background**: `bg-transparent` or `bg-input/30` in dark mode
- **Focus**: Ring with color indication

#### Validation States
- **Error**: `border-destructive` with error ring
- **Success**: Green border with check icon
- **Warning**: Orange border with warning icon

### 4. Badge/Tag Components
- **Small size**: `text-xs px-2 py-1`
- **Default size**: `text-sm px-3 py-1`
- **Variants**: Default, outline, secondary
- **Shape**: `rounded-full` or `rounded-md`

### 5. Navigation Components

#### Navbar
- **Fixed positioning**: `fixed top-0 z-50`
- **Glass effect**: `bg-background/80 backdrop-blur-md`
- **Hide on scroll**: Transform animations
- **Active states**: Underline or color change

#### Mobile Menu
- **Trigger**: Hamburger icon
- **Slide animation**: From right or bottom
- **Overlay**: Dark backdrop
- **Close on navigation**: Auto-dismiss

---

## Animations & Interactions

### 1. Motion Principles

#### Timing Functions
- **Spring**: Natural, bouncy movement
- **Ease Out**: Quick start, slow end (most common)
- **Linear**: Consistent speed (loading states)

#### Durations
- **Instant**: 100ms (hover states)
- **Fast**: 200-300ms (micro-interactions)
- **Normal**: 400-600ms (page transitions)
- **Slow**: 800-1200ms (complex animations)

### 2. Animation Patterns

#### Fade Variants
```javascript
fadeIn: opacity 0 → 1
fadeInUp: opacity 0 → 1, y: 20 → 0
fadeInDown: opacity 0 → 1, y: -20 → 0
```

#### Scale Variants
```javascript
scaleIn: scale 0.8 → 1, opacity 0 → 1
scaleOut: scale 1 → 0.8, opacity 1 → 0
```

#### Slide Variants
```javascript
slideInLeft: x: -20 → 0
slideInRight: x: 20 → 0
```

### 3. Stagger Animations
- **Container delay**: 0.3s
- **Children delay**: 0.1s between each
- **Use for**: Lists, grids, multiple elements

### 4. Hover Effects
- **Scale**: `hover:scale-105`
- **Shadow**: `hover:shadow-xl`
- **Color**: Darken/lighten by 10%
- **Transform**: `hover:translate-y-[-5px]`

### 5. Loading States
- **Skeleton screens**: Animated gradient backgrounds
- **Spinners**: Rotating elements
- **Progress bars**: Linear or circular
- **Pulsing**: `animate-pulse` for placeholders

### 6. Scroll Animations
- **Trigger**: When element enters viewport
- **Options**: Fade in, slide up, scale
- **Once**: Animate only on first view
- **Parallax**: Different scroll speeds for depth

---

## Responsive Design

### 1. Breakpoint System
```css
sm: 640px   - Mobile landscape
md: 768px   - Tablet portrait
lg: 1024px  - Tablet landscape/Desktop
xl: 1280px  - Large desktop
2xl: 1536px - Extra large screens
```

### 2. Mobile-First Approach
- **Default**: Mobile styles
- **Progressive**: Add complexity at larger screens
- **Example**: `text-base md:text-lg lg:text-xl`

### 3. Responsive Patterns

#### Navigation
- **Mobile**: Hamburger menu
- **Tablet**: Condensed nav
- **Desktop**: Full navigation bar

#### Grid Layouts
- **Mobile**: Single column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns

#### Typography
- **Mobile**: Smaller sizes, tighter spacing
- **Desktop**: Larger sizes, more whitespace

### 4. Touch Targets
- **Minimum size**: 44x44px on mobile
- **Spacing**: Adequate gap between interactive elements
- **Hover alternatives**: Focus states for touch devices

---

## Visual Effects

### 1. Glass Morphism
```css
bg-background/80
backdrop-blur-md
border border-border/40
```

### 2. Gradient Overlays
- **Subtle backgrounds**: 5-10% opacity
- **Mesh gradients**: Multiple gradient layers
- **Animated gradients**: Slow pulse or movement

### 3. Grid Patterns
```css
background-image:
  linear-gradient(to right, #80808012 1px, transparent 1px),
  linear-gradient(to bottom, #80808012 1px, transparent 1px);
background-size: 24px 24px;
```

### 4. Floating Elements
- **3D transforms**: Subtle rotation and movement
- **Parallax**: Different scroll speeds
- **Orbit animations**: Circular paths
- **Hover lift**: Transform on interaction

### 5. Shadow System
- **xs**: Subtle elevation
- **sm**: Default cards
- **md**: Hover states
- **lg**: Modals, dropdowns
- **xl**: High emphasis
- **2xl**: Maximum elevation

### 6. Border Treatments
- **Default**: 1px solid with low opacity
- **Focus**: Color change with ring
- **Gradient borders**: Using pseudo elements
- **Animated borders**: Color transitions

---

## Accessibility

### 1. Focus Management
- **Visible focus rings**: Never remove outline
- **Custom focus styles**: Ring with offset
- **Focus trap**: In modals and overlays
- **Skip links**: For keyboard navigation

### 2. Color Contrast
- **WCAG AA**: 4.5:1 for normal text
- **WCAG AAA**: 7:1 for enhanced contrast
- **Large text**: 3:1 minimum
- **Interactive elements**: Clear state changes

### 3. ARIA Attributes
- **Landmarks**: role, aria-label
- **States**: aria-expanded, aria-selected
- **Live regions**: aria-live for updates
- **Descriptions**: aria-describedby for context

### 4. Semantic HTML
- **Use appropriate elements**: nav, main, section, article
- **Heading hierarchy**: h1 → h6 in order
- **Interactive elements**: button for actions, a for navigation
- **Form labels**: Associate with inputs

### 5. Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  /* Reduce or remove animations */
}
```

---

## Best Practices Summary

1. **Consistency**: Use the same patterns throughout the application
2. **Performance**: Optimize animations and avoid layout shifts
3. **Accessibility**: Always consider keyboard and screen reader users
4. **Progressive Enhancement**: Start simple, add complexity
5. **User Feedback**: Clear states and transitions
6. **White Space**: Give elements room to breathe
7. **Visual Hierarchy**: Clear importance through size, weight, and color
8. **Delight**: Add subtle animations and interactions that bring joy
9. **Context**: Design patterns should match user expectations
10. **Testing**: Verify on multiple devices and screen sizes

---

## Implementation Tips

### Using with Tailwind CSS v4
1. Define CSS variables in `:root` and `.dark`
2. Use `@theme inline` for custom theme values
3. Apply utilities with semantic meaning
4. Create component classes with `@apply` sparingly
5. Use arbitrary values when needed: `bg-[color]`

### Component Architecture
1. Build small, reusable components
2. Use composition over configuration
3. Implement variant props for flexibility
4. Maintain consistent prop interfaces
5. Document component usage

### Performance Optimization
1. Use CSS transforms for animations
2. Implement lazy loading for images
3. Minimize re-renders with proper state management
4. Use CSS containment for complex layouts
5. Optimize bundle size with tree shaking

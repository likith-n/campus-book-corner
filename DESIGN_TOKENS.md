# BookShare Design Tokens

Complete design system specification for developers and designers.

## 🎨 Color System

### Primary Colors (HSL Format)

**Light Mode:**
```css
--primary: 221 83% 53%;           /* Academic Blue #3B82F6 */
--primary-hover: 221 83% 45%;     /* Darker on hover */
--primary-foreground: 0 0% 100%;  /* White text on primary */

--secondary: 38 92% 50%;          /* Warm Amber #F59E0B */
--secondary-hover: 38 92% 42%;    /* Darker amber */
--secondary-foreground: 0 0% 100%; /* White text on secondary */

--success: 142 71% 45%;           /* Green #10B981 */
--success-foreground: 0 0% 100%;

--destructive: 0 84% 60%;         /* Red #EF4444 */
--destructive-foreground: 0 0% 100%;

--background: 0 0% 98%;           /* Soft white #FAFAFA */
--foreground: 222 47% 11%;        /* Dark text #1E293B */

--card: 0 0% 100%;                /* Pure white cards */
--card-foreground: 222 47% 11%;

--muted: 210 40% 96%;             /* Light gray #F1F5F9 */
--muted-foreground: 215 16% 47%;  /* Medium gray text */

--border: 214 32% 91%;            /* Subtle borders #E2E8F0 */
--input: 214 32% 91%;             /* Input borders */
--ring: 221 83% 53%;              /* Focus ring (primary) */
```

**Dark Mode:**
```css
--background: 222 47% 8%;         /* Dark navy #0F172A */
--foreground: 210 40% 98%;        /* Near white text */

--primary: 221 83% 53%;           /* Same blue, works in dark */
--primary-hover: 221 83% 60%;     /* Lighter on hover in dark */

--card: 222 47% 11%;              /* Slightly lighter cards */
--border: 217 33% 17%;            /* Darker borders */

/* Other colors adjusted for proper contrast */
```

### Semantic Colors

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `primary` | `hsl(221 83% 53%)` | `hsl(221 83% 53%)` | CTAs, links, focus |
| `secondary` | `hsl(38 92% 50%)` | `hsl(38 92% 50%)` | Accent buttons |
| `success` | `hsl(142 71% 45%)` | `hsl(142 71% 45%)` | Success states |
| `destructive` | `hsl(0 84% 60%)` | `hsl(0 63% 31%)` | Errors, delete |
| `muted` | `hsl(210 40% 96%)` | `hsl(217 33% 17%)` | Disabled, subtle |

## 📐 Spacing Scale

Based on Tailwind's default spacing (1 unit = 0.25rem = 4px):

```
2  = 0.5rem  = 8px   - Minimal gap
3  = 0.75rem = 12px  - Compact spacing
4  = 1rem    = 16px  - Standard gap
6  = 1.5rem  = 24px  - Section spacing
8  = 2rem    = 32px  - Large spacing
12 = 3rem    = 48px  - Extra large
16 = 4rem    = 64px  - Section padding
20 = 5rem    = 80px  - Page padding
```

**Usage Examples:**
- Card padding: `p-6` (24px)
- Section spacing: `space-y-8` (32px between items)
- Container padding: `px-4` mobile, `px-8` desktop

## 🔤 Typography

### Font Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

Loaded from Google Fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Subtle text, de-emphasized |
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Emphasized body text |
| Semibold | 600 | Headings, labels, buttons |
| Bold | 700 | Strong emphasis, hero headings |

### Font Sizes & Line Heights

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem | Labels, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem | Secondary text |
| `text-base` | 1rem (16px) | 1.5rem | Body text |
| `text-lg` | 1.125rem (18px) | 1.75rem | Lead paragraphs |
| `text-xl` | 1.25rem (20px) | 1.75rem | Subheadings |
| `text-2xl` | 1.5rem (24px) | 2rem | Card titles |
| `text-3xl` | 1.875rem (30px) | 2.25rem | Page headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem | Hero headings |
| `text-6xl` | 3.75rem (60px) | 1 | Large displays |

### Text Styles

```css
/* Headings - Semibold with tight tracking */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Body - Antialiased for crisp rendering */
body {
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 🌓 Shadows

Custom shadow system for depth:

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-card: 0 2px 8px rgb(0 0 0 / 0.08);

/* Dark Mode Shadows (more pronounced) */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);
--shadow-card: 0 2px 8px rgb(0 0 0 / 0.3);
```

**Usage:**
- `shadow-card`: Default card elevation
- `shadow-md`: Dropdowns, popovers
- `shadow-lg`: Modals, dialogs
- Hover effect: `hover:shadow-lg`

## 📏 Border Radius

Unified rounding system:

```css
--radius: 0.75rem; /* Base radius = 12px */

/* Derived values */
border-radius-lg: var(--radius);        /* 12px - Cards, modals */
border-radius-md: calc(var(--radius) - 2px); /* 10px - Buttons */
border-radius-sm: calc(var(--radius) - 4px); /* 8px - Inputs */
```

**Usage:**
- Cards: `rounded-lg` (12px)
- Buttons: `rounded-md` (10px)
- Inputs: `rounded-md` (10px)
- Badges: `rounded-full` (9999px)

## ✨ Animations & Transitions

### Timing Functions

```css
/* Smooth easing */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Durations */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
```

### Keyframe Animations

**Fade In:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

**Card Hover:**
```css
.card-hover {
  transition: all 200ms ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Interactive States

| State | Transform | Shadow | Timing |
|-------|-----------|--------|--------|
| Rest | none | `shadow-card` | - |
| Hover | `translateY(-4px)` | `shadow-lg` | 200ms |
| Active | `scale(0.98)` | `shadow-sm` | 100ms |
| Focus | none | Focus ring | 150ms |

## 🎯 Component Variants

### Button Variants

**Default (Primary):**
```css
background: hsl(var(--primary));
color: hsl(var(--primary-foreground));
hover:background: hsl(var(--primary-hover));
```

**Secondary:**
```css
background: hsl(var(--secondary));
color: hsl(var(--secondary-foreground));
```

**Outline:**
```css
border: 1px solid hsl(var(--border));
background: transparent;
hover:background: hsl(var(--muted));
```

**Ghost:**
```css
background: transparent;
hover:background: hsl(var(--muted));
```

### Badge Variants

**Condition Badges:**
```css
/* New */
.badge-new {
  background: hsl(var(--success));
  color: hsl(var(--success-foreground));
}

/* Good */
.badge-good {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Fair */
.badge-fair {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default styles apply to mobile (< 640px) */

@media (min-width: 640px) {  /* sm: tablet portrait */
  /* 2-column grid, larger text */
}

@media (min-width: 768px) {  /* md: tablet landscape */
  /* Show desktop nav, 3-column grid */
}

@media (min-width: 1024px) { /* lg: desktop */
  /* 4-column grid, sidebar filters */
}

@media (min-width: 1280px) { /* xl: large desktop */
  /* Wider container, more spacing */
}
```

## 🖼️ Image Guidelines

### Aspect Ratios

- **Book Covers:** 3:4 (portrait)
- **Hero Images:** 16:9 (landscape)
- **User Avatars:** 1:1 (square)

### Optimization

- Format: WebP with JPG fallback
- Max width: 1920px for hero images
- Thumbnail size: 400x400px
- Use `loading="lazy"` for off-screen images

## 📋 Implementation Example

### Using Design Tokens in Components

**Good ✅:**
```tsx
// Using semantic tokens
<Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  List Your Books
</Button>

<div className="rounded-lg shadow-card p-6 space-y-4">
  <h2 className="text-2xl font-semibold">Featured Books</h2>
</div>
```

**Bad ❌:**
```tsx
// Hard-coded colors
<Button className="bg-blue-500 text-white hover:bg-blue-600">
  List Your Books
</Button>

<div className="rounded-xl shadow-xl p-8 space-y-6">
  <h2 className="text-3xl font-bold">Featured Books</h2>
</div>
```

## 🔧 Customization Guide

To customize the design system for your brand:

1. **Update `src/index.css`** with your HSL color values
2. **Modify `tailwind.config.ts`** font family and extend theme
3. **Change `index.html`** to load your custom font
4. **Update this file** with new token values

### Example: Changing Primary Color

```css
/* In src/index.css */
:root {
  --primary: 280 100% 70%;  /* Purple instead of blue */
  --primary-hover: 280 100% 60%;
}
```

All components automatically adapt!

---

**Design System Version:** 1.0.0  
**Last Updated:** 2024-01-20  
**Maintained by:** BookShare Development Team

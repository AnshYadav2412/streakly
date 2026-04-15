# Quick Reference - Custom Tailwind Classes

## 🎯 Most Used Classes

### Layout
```css
container-custom      /* Max-width container with padding */
section              /* Standard section spacing (py-16 to py-24) */
grid-auto            /* Responsive 1-2-3 column grid */
```

### Buttons
```css
btn-primary          /* Blue primary button */
btn-secondary        /* Gray secondary button */
btn-outline          /* Outlined button */
btn-lg               /* Large button size */
```

### Cards
```css
card-hover           /* Card with hover effect */
card-body            /* Card padding (p-6) */
feature-card         /* Centered feature card */
```

### Typography
```css
heading-1            /* Main page heading (4xl-6xl) */
heading-2            /* Section heading (3xl-5xl) */
heading-3            /* Subsection heading (2xl-3xl) */
text-lead            /* Large body text (lg-xl) */
gradient-text        /* Blue-purple gradient text */
```

### Effects
```css
glass                /* Glassmorphism effect */
nav-link             /* Navigation link style */
badge-primary        /* Primary badge/tag */
```

## 🎨 Color Palette

```
Primary:   bg-blue-600, text-blue-600
Secondary: bg-purple-600, text-purple-600
Success:   bg-green-600, text-green-600
Warning:   bg-yellow-600, text-yellow-600
Danger:    bg-red-600, text-red-600
Neutral:   bg-gray-50 to bg-gray-900
```

## 📐 Spacing Scale

```
section       /* py-16 sm:py-20 lg:py-24 */
section-sm    /* py-12 sm:py-16 */
section-lg    /* py-20 sm:py-28 lg:py-32 */
```

## 🎯 Common Patterns

### Hero Section
```jsx
<section className="hero-section">
  <div className="container-narrow text-center">
    <h1 className="heading-1 mb-6">
      Your <span className="gradient-text">Title</span>
    </h1>
    <p className="text-lead mb-8">Description</p>
    <button className="btn-primary btn-lg">CTA</button>
  </div>
</section>
```

### Feature Grid
```jsx
<section className="section">
  <div className="container-custom">
    <div className="grid-auto">
      <div className="feature-card">
        <div className="feature-icon">{/* Icon */}</div>
        <h3 className="heading-4">Title</h3>
        <p className="text-body">Description</p>
      </div>
    </div>
  </div>
</section>
```

### Navigation
```jsx
<nav className="glass">
  <div className="container-custom">
    <div className="flex items-center justify-between h-16">
      <div className="logo">Brand</div>
      <div className="flex gap-8">
        <a href="#" className="nav-link">Link</a>
      </div>
      <button className="btn-primary btn-sm">CTA</button>
    </div>
  </div>
</nav>
```

### Card Layout
```jsx
<div className="card-hover">
  <div className="card-body">
    <h3 className="heading-4 mb-2">Title</h3>
    <p className="text-body mb-4">Content</p>
    <button className="btn-primary">Action</button>
  </div>
</div>
```

## 🔥 Pro Tips

1. **Combine custom + utility classes**
   ```jsx
   <div className="card-hover p-8 bg-blue-50">
   ```

2. **Responsive modifiers work**
   ```jsx
   <div className="container-custom py-8 md:py-16">
   ```

3. **Stack classes for complex designs**
   ```jsx
   <button className="btn-primary btn-lg shadow-2xl">
   ```

4. **Use semantic HTML**
   ```jsx
   <section className="section">
   <article className="card">
   <nav className="glass">
   ```

## 📱 Responsive Breakpoints

```
sm:   640px   (tablet)
md:   768px   (small desktop)
lg:   1024px  (desktop)
xl:   1280px  (large desktop)
2xl:  1536px  (extra large)
```

## 🎨 Gradient Backgrounds

```jsx
bg-gradient-to-r from-blue-600 to-purple-600
bg-gradient-to-br from-blue-50 via-white to-purple-50
```

## 🚀 Performance Tips

- Use `card-hover` instead of custom hover animations
- Leverage `glass` for modern UI effects
- Use `container-*` for consistent max-widths
- Combine classes instead of creating new ones

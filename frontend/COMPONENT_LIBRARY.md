# Custom Tailwind Component Library

This project includes a custom component library built with Tailwind CSS utility classes. All custom classes are defined in `src/index.css` using the `@layer components` directive.

## 📦 Available Components

### Container Utilities
```jsx
<div className="container-custom">     // Max-width: 1280px (7xl)
<div className="container-narrow">     // Max-width: 896px (4xl)
<div className="container-wide">       // Max-width: 1400px
```

### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-ghost">Ghost Button</button>

// Sizes
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary btn-lg">Large</button>
```

### Cards
```jsx
<div className="card">Basic Card</div>
<div className="card-hover">Card with Hover Effect</div>
<div className="card-bordered">Card with Border</div>

// Card Sections
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Body Content</div>
  <div className="card-footer">Footer</div>
</div>
```

### Typography
```jsx
<h1 className="heading-1">Main Heading</h1>
<h2 className="heading-2">Section Heading</h2>
<h3 className="heading-3">Subsection Heading</h3>
<h4 className="heading-4">Small Heading</h4>

<p className="text-lead">Lead paragraph text</p>
<p className="text-body">Body text</p>
<p className="text-small">Small text</p>

<span className="gradient-text">Gradient Text</span>
```

### Badges
```jsx
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
```

### Form Inputs
```jsx
<input type="text" className="input" placeholder="Enter text" />
<input type="text" className="input-error" placeholder="Error state" />
```

### Sections
```jsx
<section className="section">Default Section</section>
<section className="section-sm">Small Section</section>
<section className="section-lg">Large Section</section>
```

### Grid Layouts
```jsx
<div className="grid-auto">        // 1-2-3 column responsive grid
<div className="grid-auto-4">      // 1-2-4 column responsive grid
```

### Feature Cards
```jsx
<div className="feature-card">
  <div className="feature-icon">
    {/* Icon SVG */}
  </div>
  <h3 className="heading-4">Feature Title</h3>
  <p className="text-body">Feature description</p>
</div>
```

### Navigation
```jsx
<a href="#" className="nav-link">Link</a>
<a href="#" className="nav-link-active">Active Link</a>
```

### Special Effects
```jsx
<div className="glass">Glassmorphism Effect</div>
<div className="hero-section">Full-height Hero</div>
<hr className="divider" />
```

## 🎨 Color Palette

The design uses a blue-purple gradient theme:
- Primary: Blue (600-700)
- Secondary: Purple (600-700)
- Neutral: Gray scale
- Backgrounds: White, Gray-50, Gray-900

## 📱 Responsive Breakpoints

All components are mobile-first and responsive:
- `sm`: 640px (tablet)
- `md`: 768px (small desktop)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

## 🚀 Usage Example

```jsx
import React from 'react';

const MyComponent = () => {
  return (
    <section className="section">
      <div className="container-custom">
        <h2 className="heading-2 text-center mb-8">My Section</h2>
        
        <div className="grid-auto">
          <div className="card-hover card-body">
            <h3 className="heading-4 mb-2">Card Title</h3>
            <p className="text-body">Card content goes here</p>
            <button className="btn-primary mt-4">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};
```

## 🎯 Best Practices

1. **Combine classes**: Mix custom classes with Tailwind utilities
   ```jsx
   <div className="card-hover p-8 bg-blue-50">
   ```

2. **Responsive design**: Use Tailwind's responsive prefixes
   ```jsx
   <div className="container-custom py-8 md:py-16">
   ```

3. **Consistency**: Use the custom classes for consistent spacing and styling across the app

4. **Extend when needed**: Add new custom classes to `index.css` following the same pattern

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components (Home, About, etc.)
│   ├── layouts/          # Layout components (Header, Footer)
│   ├── assets/           # Images, icons, fonts
│   ├── index.css         # Custom Tailwind component library
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx          # Entry point
├── tailwind.config.cjs   # Tailwind configuration
└── postcss.config.cjs    # PostCSS configuration
```

## 🔧 Extending the Library

To add new custom components, edit `src/index.css`:

```css
@layer components {
  .your-custom-class {
    @apply /* Tailwind utilities */;
  }
}
```

This keeps all custom styles organized and ensures proper CSS cascade with Tailwind.

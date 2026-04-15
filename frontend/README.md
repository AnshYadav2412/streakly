# Impulse - Productivity Platform Frontend

A modern, responsive productivity platform built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- **[Component Library](./COMPONENT_LIBRARY.md)** - Custom Tailwind component classes
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Folder organization and conventions

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Custom Component Library** - Pre-built Tailwind component classes

## 🏗️ Project Structure

```
src/
├── assets/          # Static files (images, icons)
├── components/      # Reusable React components
├── layouts/         # Layout components
├── pages/           # Page components
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Custom Tailwind library
```

## 🎯 Features

- ✅ Custom Tailwind component library
- ✅ Responsive design (mobile-first)
- ✅ Modern UI with glassmorphism effects
- ✅ Clean and expandable folder structure
- ✅ React Router for navigation
- ✅ Production-ready build setup

## 🎨 Custom Component Classes

All custom classes are defined in `src/index.css`. Examples:

```jsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>

// Cards
<div className="card-hover card-body">
  <h3 className="heading-4">Title</h3>
  <p className="text-body">Content</p>
</div>

// Containers
<div className="container-custom">
  <section className="section">
    {/* Content */}
  </section>
</div>
```

See [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) for full documentation.

## 🔧 Configuration

### Tailwind Config (`tailwind.config.cjs`)
- Content paths configured for all JSX/TSX files
- Custom theme extensions can be added here

### PostCSS Config (`postcss.config.cjs`)
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## 📱 Responsive Design

All components use mobile-first responsive design:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Design System

- **Primary Color**: Blue (600-700)
- **Secondary Color**: Purple (600-700)
- **Neutral**: Gray scale
- **Typography**: Inter font family
- **Spacing**: Tailwind's default scale (4px base)

## 🚀 Development Workflow

1. **Create a new page** in `src/pages/`
2. **Add route** in `src/App.jsx`
3. **Build components** in `src/components/`
4. **Use custom classes** from the component library
5. **Test responsiveness** on different screen sizes

## 📦 Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to any static hosting service.

## 🤝 Contributing

1. Follow the naming conventions in PROJECT_STRUCTURE.md
2. Use the custom component classes for consistency
3. Keep components small and focused
4. Write responsive, mobile-first code

## 📄 License

MIT

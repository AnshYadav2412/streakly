# Project Structure

## 📁 Folder Organization

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, fonts
│   ├── components/        # Reusable React components
│   │   └── common/        # Common UI components (Button, Input, etc.)
│   ├── layouts/           # Layout components (Header, Footer, Sidebar)
│   ├── pages/             # Page components (Home, Dashboard, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── services/          # API services
│   ├── context/           # React Context providers
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Custom Tailwind component library
├── tailwind.config.cjs    # Tailwind configuration
├── postcss.config.cjs     # PostCSS configuration
└── package.json           # Dependencies

```

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `TaskCard.jsx`)
- **Pages**: PascalCase (e.g., `Home.jsx`, `Dashboard.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `apiClient.js`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.js`, `useTasks.js`)

## 🎯 Component Organization

### Pages (`src/pages/`)
Full page components that represent routes:
- `Home.jsx` - Landing page
- `Dashboard.jsx` - Main dashboard
- `Tasks.jsx` - Task management page
- `Settings.jsx` - Settings page

### Components (`src/components/`)
Reusable UI components:
- `common/` - Generic components (Button, Input, Card)
- `tasks/` - Task-specific components (TaskList, TaskItem)
- `dashboard/` - Dashboard-specific components

### Layouts (`src/layouts/`)
Layout wrappers:
- `MainLayout.jsx` - Main app layout with header/footer
- `DashboardLayout.jsx` - Dashboard layout with sidebar
- `AuthLayout.jsx` - Authentication pages layout

## 🚀 Adding New Features

### 1. Create a new page:
```jsx
// src/pages/NewPage.jsx
import React from 'react';

const NewPage = () => {
  return (
    <div className="section">
      <div className="container-custom">
        <h1 className="heading-1">New Page</h1>
      </div>
    </div>
  );
};

export default NewPage;
```

### 2. Add route in App.jsx:
```jsx
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

### 3. Create reusable components:
```jsx
// src/components/common/CustomButton.jsx
import React from 'react';

const CustomButton = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
```

## 🎨 Styling Guidelines

1. **Use custom classes from index.css** for consistent styling
2. **Combine with Tailwind utilities** for specific adjustments
3. **Keep components responsive** using Tailwind's responsive prefixes
4. **Follow the design system** defined in COMPONENT_LIBRARY.md

## 📦 State Management

- **Local state**: Use `useState` for component-level state
- **Shared state**: Use React Context for app-wide state
- **Server state**: Use React Query or SWR for API data

## 🔧 Best Practices

1. **Keep components small and focused**
2. **Extract reusable logic into custom hooks**
3. **Use TypeScript for type safety** (optional but recommended)
4. **Write meaningful component and prop names**
5. **Add PropTypes or TypeScript interfaces**
6. **Keep business logic separate from UI components**

## 🧪 Testing Structure

```
src/
├── components/
│   └── __tests__/
│       └── Button.test.jsx
├── pages/
│   └── __tests__/
│       └── Home.test.jsx
```

## 📚 Import Aliases (Optional)

Configure in `vite.config.js`:
```js
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@pages': '/src/pages',
    '@utils': '/src/utils',
  }
}
```

Then import like:
```jsx
import Button from '@components/common/Button';
import { formatDate } from '@utils/date';
```

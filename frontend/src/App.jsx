import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HabitProvider } from './context/HabitContext'
import { ProjectProvider } from './context/ProjectContext'
import { TimeProvider } from './context/TimeContext'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPrompt from './components/InstallPrompt'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const HabitTracker = lazy(() => import('./pages/HabitTracker'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Projects = lazy(() => import('./pages/Projects'))
const TimeTracker = lazy(() => import('./pages/TimeTracker'))

// Root redirect component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && location.pathname === '/') {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const token = localStorage.getItem('token');
      
      if (user && rememberMe && token) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, location]);

  return <Home />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HabitTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <HabitTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time"
          element={
            <ProtectedRoute>
              <TimeTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallPrompt />
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <ProjectProvider>
          <TimeProvider>
            <AppRoutes />
          </TimeProvider>
        </ProjectProvider>
      </HabitProvider>
    </AuthProvider>
  )
}

export default App

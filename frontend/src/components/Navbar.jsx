import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/streakly_icon.svg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={logo} alt="Streakly" className="h-10 w-auto" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">Streakly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') || isActive('/habits') ? 'text-orange-600 font-semibold' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'text-orange-600 font-semibold' : ''}`}
            >
              Analytics
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{user.name}</span>
              </div>
            )}
            <button onClick={handleLogout} className="btn-outline btn-sm">
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              {user && (
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-base font-medium transition-colors ${
                  isActive('/dashboard') || isActive('/habits')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-base font-medium transition-colors ${
                  isActive('/analytics')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                📈 Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="mx-4 mt-2 btn-outline btn-sm text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

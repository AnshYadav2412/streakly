import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/streakly_icon.svg';
import InstallInstructions from '../components/InstallInstructions';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Streakly" className="h-10 w-auto" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Streakly</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#about" className="nav-link">About</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
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
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  About
                </a>
                <div className="px-4 pt-2 flex flex-col gap-2">
                  <Link to="/login" className="btn-ghost btn-sm text-center">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary btn-sm text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-lg pt-32">
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-orange-700 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Boost Your Productivity</span>
          </div>

          <h1 className="heading-1 mb-6">
            Work Smarter, Not Harder with{' '}
            <span className="gradient-text">Streakly</span>
          </h1>

          <p className="text-lead mb-8 max-w-2xl mx-auto">
            Build unstoppable habits and track your streaks. The all-in-one productivity platform 
            that helps you stay consistent and achieve your goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register" className="btn-primary btn-lg">
              Start Free Trial
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="btn-outline btn-lg">
              Watch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">10K+</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">50M+</div>
              <div className="text-xs sm:text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">99.9%</div>
              <div className="text-xs sm:text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Everything You Need to Stay Productive</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Powerful features designed to help you focus on what matters most
            </p>
          </div>

          <div className="grid-auto">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Task Management</h3>
              <p className="text-body">
                Organize your work with intuitive task lists, priorities, and deadlines
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Time Tracking</h3>
              <p className="text-body">
                Track time spent on tasks and projects with automatic timers
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Analytics</h3>
              <p className="text-body">
                Get insights into your productivity patterns and progress
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Team Collaboration</h3>
              <p className="text-body">
                Work together seamlessly with shared projects and real-time updates
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Smart Reminders</h3>
              <p className="text-body">
                Never miss a deadline with intelligent notifications and reminders
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Secure & Private</h3>
              <p className="text-body">
                Your data is encrypted and protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Install App Section */}
      <section className="section bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Get the Streakly App</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Install Streakly on your device for quick access, offline support, and a native app experience
            </p>
          </div>
          <InstallInstructions />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container-narrow text-center">
          <h2 className="heading-2 text-white mb-4">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-lead text-orange-100 mb-8">
            Join thousands of professionals who are already working smarter
          </p>
          <button className="btn bg-white text-orange-600 hover:bg-gray-100 btn-lg">
            <Link to="/register">Start Your Free Trial</Link>
          </button>
          <p className="text-small text-orange-100 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-sm bg-gray-900 text-gray-400">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="divider border-gray-800"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Streakly. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Page transition animation
    setPageTransition(true);
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPageTransition(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      
      {/* Main Content */}
      <main className={`relative z-10 transition-all duration-300 flex-1 overflow-y-auto ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <Navbar />
        {/* Page Transition Overlay */}
        <div className={`fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 z-50 transition-all duration-300 ${
          pageTransition ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white font-semibold">Loading...</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className={`transition-all duration-500 p-6 ${
          isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}>
          {children}
        </div>
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-2xl hover:shadow-yellow-400/25 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90'
      } hover:scale-110`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default Layout;

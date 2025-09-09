import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Settings, 
  User, 
  ChevronDown, 
  LogOut,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Home,
  GraduationCap,
  Users,
  Mail
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (userMenuRef.current) {
        const rect = userMenuRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
    };

    if (isUserMenuOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/courses', label: 'Courses', icon: GraduationCap },
    { to: '/about', label: 'About', icon: Users },
    { to: '/contact', label: 'Contact', icon: Mail }
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-slate-900/90 backdrop-blur-xl shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-75"></div>
                <div className="relative h-10 w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ITC</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">ITC</span>
                <div className="text-sm text-gray-300 font-medium -mt-1">
                  Kids Career Design
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  to={link.to}
                  key={link.to}
                  className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActiveLink(link.to)
                      ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {isActiveLink(link.to) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <button className="relative p-3 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-xl group">
                    <Bell className="w-6 h-6 group-hover:animate-bounce" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </button>

                  {/* Settings */}
                  <button className="p-3 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-xl group">
                    <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>

                  {/* Sync */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group">
                    <RefreshCw className="w-4 h-4 text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-purple-400 font-medium">Sync</span>
                  </button>

                  {/* User Profile */}
                  <div className="relative" ref={userMenuRef}>
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="group flex items-center space-x-3 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    Login
                  </Link>
                  <Link to="/register" className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Register</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Dropdown Portal */}
      {isUserMenuOpen && createPortal(
        <div 
          className="fixed w-80 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-[9999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-lg">{user?.name}</div>
                <div className="text-sm text-gray-300">{user?.email}</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  {user?.role?.toUpperCase()} ACCOUNT
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            <button
              onClick={() => {
                navigate(user?.role === 'admin' ? '/admin/dashboard' : '/student');
                setIsUserMenuOpen(false);
              }}
              className="flex items-center space-x-4 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Dashboard</div>
                <div className="text-xs text-gray-400">Go to main dashboard</div>
              </div>
            </button>
            
            <button
              onClick={() => {
                navigate(user?.role === 'admin' ? '/admin/settings' : '/update-user');
                setIsUserMenuOpen(false);
              }}
              className="flex items-center space-x-4 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Profile Settings</div>
                <div className="text-xs text-gray-400">Manage your account</div>
              </div>
            </button>
            
            <div className="border-t border-white/10 my-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 w-full px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogOut className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Sign Out</div>
                <div className="text-xs text-gray-400">End your session</div>
              </div>
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className={`absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/20 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-24">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  to={link.to}
                  key={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isActiveLink(link.to)
                      ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-6 w-6" />
                  <span className="text-lg">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

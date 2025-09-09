import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertCircle, Lock, User, Crown } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && role && user?.role !== role) {
      setShowAccessDenied(true);
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, role, user]);

  // Loading state with animated spinner
  if (isLoading || isAnimating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
              <Shield className="absolute inset-0 w-8 h-8 text-white m-auto" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Verifying Access</h2>
          <p className="text-gray-300">Please wait while we check your permissions...</p>
          
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied screen with animation
  if (role && user?.role !== role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Access Denied Content */}
        <div className={`relative z-10 text-center transform transition-all duration-1000 ${
          showAccessDenied ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30 flex items-center justify-center">
              <Lock className="w-16 h-16 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 border border-red-500/20 max-w-2xl mx-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <h1 className="text-4xl font-black text-white">Access Denied</h1>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              You don't have permission to access this area. This section requires{' '}
              <span className={`font-bold ${role === 'admin' ? 'text-yellow-400' : 'text-blue-400'}`}>
                {role === 'admin' ? 'administrator' : 'student'} privileges
              </span>.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-slate-700/50 rounded-2xl px-6 py-3 border border-white/10">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Your Role:</span>
                <span className="font-bold text-white capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-700/50 rounded-2xl px-6 py-3 border border-white/10">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Required:</span>
                <span className="font-bold text-yellow-400 capitalize">{role}</span>
              </div>
            </div>

            <button
              onClick={() => window.history.back()}
              className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Go Back
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/5 rounded-full animate-float"></div>
          <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-orange-500/5 rounded-full animate-float animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  // Success animation for authorized access
  return (
    <div className={`transform transition-all duration-700 ${
      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      {children}
    </div>
  );
};

export default ProtectedRoute;
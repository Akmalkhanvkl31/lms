import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  BookOpen, 
  Users, 
  ClipboardList, 
  FileText, 
  Video, 
  Settings,
  LogOut,
  Calendar,
  PenTool,
  Trophy,
  Image,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/batches', label: 'Batches', icon: ClipboardList },
    { to: '/admin/assignments', label: 'Assignments', icon: PenTool },
    { to: '/admin/materials', label: 'Materials', icon: FileText },
    { to: '/admin/videos', label: 'Videos', icon: Video },
    { to: '/admin/attendance', label: 'Attendance', icon: Calendar },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/videos', label: 'Videos', icon: Video },
    { to: '/student/sessions', label: 'Sessions', icon: BookOpen },
    { to: '/student/assignments', label: 'Assignments', icon: PenTool },
    { to: '/student/quizzes', label: 'Quizzes', icon: Trophy },
    { to: '/student/gallery', label: 'Gallery', icon: Image },
  ];

  const sidebarLinks = user?.role === 'admin' ? adminLinks : studentLinks;
  const settingsLink = user?.role === 'admin' ? '/admin/settings' : '/student/settings';
  const panelName = user?.role === 'admin' ? 'Admin Panel' : 'Student Panel';

  return (
    <div 
      className={`bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 z-50 ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-white/10 px-4">
        <Link to="/" className="group flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-75"></div>
            <BookOpen className="relative h-10 w-10 text-white p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl" />
          </div>
          <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
            <span className="text-2xl font-black text-white">ITC</span>
            <div className="text-sm text-gray-300 font-medium -mt-1">{panelName}</div>
          </div>
        </Link>
      </div>

      {/* User Info Section */}
      {isExpanded && (
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 group ${
              isActive(link.to)
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            } ${!isExpanded ? 'justify-center' : ''}`}
          >
            <link.icon className={`h-5 w-5 transition-transform duration-300 ${isActive(link.to) ? 'text-purple-400' : ''} group-hover:scale-110`} />
            <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 max-w-0 overflow-hidden'}`}>
              {link.label}
            </span>
            {isActive(link.to) && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <Link
          to={settingsLink}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 mb-2 group ${
            isActive(settingsLink)
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          } ${!isExpanded ? 'justify-center' : ''}`}
        >
          <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 max-w-0 overflow-hidden'}`}>
            Settings
          </span>
        </Link>
        
        <button
          onClick={logout}
          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-2xl font-semibold text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group ${!isExpanded ? 'justify-center' : ''}`}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 max-w-0 overflow-hidden'}`}>
            Logout
          </span>
        </button>
      </div>

      {/* Floating Sparkles Animation */}
      {isExpanded && (
        <div className="absolute top-1/2 right-2 pointer-events-none">
          <Sparkles className="h-4 w-4 text-purple-400/30 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
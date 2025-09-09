import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  PenTool,
  Trophy,
  UserPlus,
  BarChart3,
  Plus,
  Video,
  TrendingUp,
  MoreHorizontal,
  Sparkles,
  Zap,
  Rocket,
  Activity,
  Target,
  ChevronRight,
  RefreshCw,
  TrendingDown,
  Globe,
} from 'lucide-react';

const AdminDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    { 
      label: 'Total Students', 
      value: '2,847', 
      change: '+12.3%', 
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'from-blue-500/20 to-cyan-500/20',
      description: 'Active enrolled students'
    },
    { 
      label: 'Live Batches', 
      value: '24', 
      change: '+3', 
      trend: 'up',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      bgGlow: 'from-emerald-500/20 to-teal-500/20',
      description: 'Currently active batches'
    },
    { 
      label: 'Assignments', 
      value: '156', 
      change: '+8', 
      trend: 'up',
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'from-purple-500/20 to-pink-500/20',
      description: 'Total assignments created'
    },
    { 
      label: 'Completion Rate', 
      value: '94.2%', 
      change: '+2.1%', 
      trend: 'up',
      icon: Trophy,
      color: 'from-orange-500 to-red-500',
      bgGlow: 'from-orange-500/20 to-red-500/20',
      description: 'Average completion rate'
    }
  ];

  const recentActivities = [
    { 
      type: 'New student enrolled', 
      user: 'Sarah Wilson', 
      time: '2 minutes ago',
      status: 'success',
      avatar: '👩‍🎓',
      color: 'emerald',
      action: 'Joined Career Explorers batch'
    },
    { 
      type: 'Assignment submitted', 
      user: 'Mike Johnson', 
      time: '15 minutes ago',
      status: 'info',
      avatar: '👨‍💻',
      color: 'blue',
      action: 'Submitted creative writing project'
    },
    { 
      type: 'Quiz completed', 
      user: 'Emma Davis', 
      time: '32 minutes ago',
      status: 'success',
      avatar: '👩‍🔬',
      color: 'purple',
      action: 'Scored 95% in Communication Skills'
    },
    { 
      type: 'Video uploaded', 
      user: 'Admin Team', 
      time: '1 hour ago',
      status: 'warning',
      avatar: '🎥',
      color: 'orange',
      action: 'Added new leadership session'
    },
    { 
      type: 'Batch created', 
      user: 'Dr. Smith', 
      time: '2 hours ago',
      status: 'info',
      avatar: '👨‍🏫',
      color: 'pink',
      action: 'Created Future Leaders Grade 10'
    }
  ];

  const StatCard = ({ stat, index }: { stat: { label: string, value: string, change: string, trend: string, icon: React.ElementType, color: string, bgGlow: string, description: string }, index: number }) => (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        transform: hoveredCard === `stat-${index}` ? 'translateY(-8px) scale(1.02)' : ''
      }}
      onMouseEnter={() => setHoveredCard(`stat-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-gradient-x`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="h-10 w-10 text-white" />
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
            stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {stat.trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-bold">{stat.change}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-gray-200 font-semibold text-lg">{stat.label}</h3>
          <p className="text-5xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {stat.value}
          </p>
          <p className="text-gray-400 text-sm">{stat.description}</p>
        </div>
      </div>

      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse animation-delay-300"></div>
    </div>
  );

  const ActivityItem = ({ activity, index }: { activity: { type: string, user: string, time: string, status: string, avatar: string, color: string, action: string }, index: number }) => (
    <div
      className={`group flex items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-102 border border-white/10 hover:border-purple-500/30 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 border border-white/20">
        <span className="text-3xl">{activity.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-white font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {activity.type}
          </h4>
          <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
            NEW
          </span>
        </div>
        <p className="text-gray-300 font-medium mb-1">{activity.action}</p>
        <p className="text-gray-400 text-sm">{activity.user} • {activity.time}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full animate-pulse ${
          activity.color === 'emerald' ? 'bg-emerald-400' :
          activity.color === 'blue' ? 'bg-blue-400' :
          activity.color === 'purple' ? 'bg-purple-400' :
          activity.color === 'orange' ? 'bg-orange-400' : 'bg-pink-400'
        }`}></div>
        <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  const QuickActionCard = ({ action }: { action: { icon: React.ElementType, label: string, color: string, onClick: () => void, description: string } }) => (
    <button
      onClick={action.onClick}
      className="group w-full flex items-center gap-6 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-purple-500/30"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
        <action.icon className="h-8 w-8 text-white" />
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-white font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
          {action.label}
        </h4>
        <p className="text-gray-400 text-sm">{action.description}</p>
      </div>
      <ChevronRight className="h-6 w-6 text-gray-400 group-hover:translate-x-1 group-hover:text-purple-400 transition-all duration-300" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`,
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
            animationDelay: '2s'
          }}
        />

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-10">
        {/* Enhanced Hero Section */}
        <div className="relative text-center mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
          
          <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-2xl mb-8">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <Sparkles className="h-6 w-6 text-purple-400 animate-bounce" />
              <span className="font-bold text-purple-200 text-lg">ITC Admin Command Center</span>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Admin Dashboard
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Manage your educational empire with style and precision
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                Quick Actions
              </button>
              <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 group-hover:animate-pulse" />
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Enhanced Recent Activity */}
          <div className="xl:col-span-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 overflow-hidden">
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Live Activity Feed
                      </h3>
                      <p className="text-gray-400 text-lg">Real-time updates from your platform</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-bold text-sm">LIVE</span>
                  </div>
                  <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <RefreshCw className="h-5 w-5 text-gray-400 hover:animate-spin" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} />
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <button className="group w-full text-center text-purple-400 hover:text-pink-400 font-bold transition-colors duration-300 flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl hover:bg-white/10">
                  <Globe className="h-5 w-5" />
                  View All Activity
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Quick Actions
                  </h3>
                  <p className="text-gray-400">Fast-track your workflow</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: UserPlus, label: 'Add Student', color: 'from-blue-500 to-cyan-500', onClick: () => {}, description: 'Enroll new learners' },
                  { icon: Plus, label: 'Create Batch', color: 'from-emerald-500 to-teal-500', onClick: () => {}, description: 'Start new cohorts' },
                  { icon: PenTool, label: 'New Assignment', color: 'from-purple-500 to-pink-500', onClick: () => {}, description: 'Create learning tasks' },
                  { icon: Video, label: 'Upload Video', color: 'from-orange-500 to-red-500', onClick: () => {}, description: 'Add video content' }
                ].map((action, index) => (
                  <QuickActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            {/* Enhanced Performance Overview */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Performance Pulse
                  </h3>
                  <p className="text-gray-400">System health monitor</p>
                </div>
              </div>
              
              <div className="relative h-48 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl flex items-center justify-center overflow-hidden border border-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 animate-gradient-x"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-emerald-400 font-black text-xl">System Health: Excellent</p>
                  <p className="text-gray-400 mt-2">All metrics performing above average</p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400">99.9% Uptime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-400">Fast Response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

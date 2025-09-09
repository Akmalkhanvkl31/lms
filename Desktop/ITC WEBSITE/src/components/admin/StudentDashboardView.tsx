import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  PenTool, 
  Trophy, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Search,
  Eye,
  Award,
  Target,
  Zap,
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  BarChart3,
  Globe,
  Rocket,
  Coffee,
  Activity
} from 'lucide-react';

const StudentDashboardView = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const batches = [
    { id: '1', name: 'Career Explorers - Grade 7', students: 20, color: 'from-blue-500 to-cyan-500' },
    { id: '2', name: 'Innovation Champions - Grade 8', students: 18, color: 'from-purple-500 to-pink-500' },
    { id: '3', name: 'Future Leaders - Grade 9', students: 22, color: 'from-emerald-500 to-teal-500' }
  ];

  const students = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      batchId: '1',
      batchName: 'Career Explorers - Grade 7',
      attendance: 92,
      averageScore: 85,
      assignmentsCompleted: 8,
      assignmentsPending: 2,
      quizzesCompleted: 5,
      lastActive: '2024-01-15',
      status: 'active',
      avatar: '👨‍🎓',
      streak: 7,
      achievements: ['Quick Learner', 'Perfect Attendance']
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      batchId: '1',
      batchName: 'Career Explorers - Grade 7',
      attendance: 88,
      averageScore: 92,
      assignmentsCompleted: 9,
      assignmentsPending: 1,
      quizzesCompleted: 6,
      lastActive: '2024-01-14',
      status: 'active',
      avatar: '👩‍💻',
      streak: 12,
      achievements: ['Top Performer', 'Creative Thinker', 'Helpful Peer']
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      batchId: '2',
      batchName: 'Innovation Champions - Grade 8',
      attendance: 95,
      averageScore: 78,
      assignmentsCompleted: 7,
      assignmentsPending: 3,
      quizzesCompleted: 4,
      lastActive: '2024-01-16',
      status: 'active',
      avatar: '👨‍🔬',
      streak: 5,
      achievements: ['Innovation Star']
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      batchId: '3',
      batchName: 'Future Leaders - Grade 9',
      attendance: 76,
      averageScore: 88,
      assignmentsCompleted: 6,
      assignmentsPending: 4,
      quizzesCompleted: 3,
      lastActive: '2024-01-12',
      status: 'at-risk',
      avatar: '👩‍🎨',
      streak: 2,
      achievements: ['Creative Leader']
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-emerald-500 to-teal-500';
      case 'at-risk': return 'from-yellow-500 to-orange-500';
      case 'inactive': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-emerald-400';
    if (attendance >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const batchStats = batches.map(batch => {
    const batchStudents = students.filter(s => s.batchId === batch.id);
    const avgAttendance = batchStudents.reduce((sum, s) => sum + s.attendance, 0) / batchStudents.length;
    const avgScore = batchStudents.reduce((sum, s) => sum + s.averageScore, 0) / batchStudents.length;
    const atRiskCount = batchStudents.filter(s => s.status === 'at-risk').length;
    const topPerformers = batchStudents.filter(s => s.averageScore >= 85).length;
    
    return {
      ...batch,
      avgAttendance: Math.round(avgAttendance),
      avgScore: Math.round(avgScore),
      atRiskCount,
      topPerformers
    };
  });

  const BatchCard = ({ batch, index }) => (
    <div 
      className={`group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        transform: hoveredCard === `batch-${index}` ? 'translateY(-8px) scale(1.02)' : ''
      }}
      onMouseEnter={() => setHoveredCard(`batch-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated gradient border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${batch.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x`}></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${batch.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{batch.students}</div>
            <div className="text-sm text-gray-400">Students</div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
          {batch.name}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className={`text-lg font-bold ${getAttendanceColor(batch.avgAttendance)}`}>
              {batch.avgAttendance}%
            </div>
            <div className="text-xs text-gray-400">Avg Attendance</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className={`text-lg font-bold ${getScoreColor(batch.avgScore)}`}>
              {batch.avgScore}%
            </div>
            <div className="text-xs text-gray-400">Avg Score</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-300">{batch.topPerformers} top performers</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className={`h-4 w-4 ${batch.atRiskCount > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className={batch.atRiskCount > 0 ? 'text-red-400' : 'text-emerald-400'}>
              {batch.atRiskCount} at risk
            </span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float animation-delay-1000"></div>
    </div>
  );

  const StudentCard = ({ student, index }) => (
    <tr 
      className={`group hover:bg-white/5 transition-all duration-300 transform hover:scale-102 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              {student.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r ${getStatusColor(student.status)} rounded-full flex items-center justify-center border-2 border-slate-800`}>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {student.name}
            </div>
            <div className="text-gray-400 text-sm">{student.email}</div>
            <div className="flex items-center gap-2 mt-1">
              {student.achievements.slice(0, 2).map((achievement, i) => (
                <span key={i} className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
      
      <td className="p-6">
        <div className="text-gray-400 text-sm font-medium">{student.batchName}</div>
      </td>
      
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
            {student.attendance}%
          </div>
          {student.attendance < 75 && (
            <AlertCircle className="h-4 w-4 text-red-400 animate-pulse" />
          )}
        </div>
      </td>
      
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className={`text-lg font-bold ${getScoreColor(student.averageScore)}`}>
            {student.averageScore}%
          </div>
          {student.averageScore >= 85 && (
            <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
          )}
        </div>
      </td>
      
      <td className="p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-white font-medium">{student.assignmentsCompleted}</span>
            <span className="text-gray-400 text-sm">completed</span>
          </div>
          {student.assignmentsPending > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-medium">{student.assignmentsPending}</span>
              <span className="text-gray-400 text-sm">pending</span>
            </div>
          )}
        </div>
      </td>
      
      <td className="p-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">{student.quizzesCompleted}</span>
        </div>
      </td>
      
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(student.status)} text-white`}>
            {student.status}
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-orange-400" />
            <span className="text-orange-400 font-bold text-sm">{student.streak}</span>
          </div>
        </div>
      </td>
      
      <td className="p-6">
        <div className="text-gray-400 text-sm">
          {new Date(student.lastActive).toLocaleDateString()}
        </div>
      </td>
      
      <td className="p-6">
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
            <Eye className="h-4 w-4 text-gray-300 hover:text-white" />
          </button>
          <button className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-110">
            <Award className="h-4 w-4 text-purple-400" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-8 relative">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
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
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-lg mb-4">
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
            <Sparkles className="h-5 w-5 text-purple-400 animate-bounce" />
            <span className="font-semibold text-blue-200">Student Analytics Hub</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Performance Dashboard
          </h2>
          <p className="text-xl text-gray-300">Track student progress and engagement across all batches</p>
        </div>
      </div>

      {/* Batch Overview Cards */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-6 w-6 text-emerald-400" />
          <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Batch Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {batchStats.map((batch, index) => (
            <BatchCard key={batch.id} batch={batch} index={index} />
          ))}
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">Smart Filters</div>
              <div className="text-sm text-gray-400">Refine your student analysis</div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="md:w-72">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all" className="bg-slate-800">All Batches</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id} className="bg-slate-800">{batch.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Student Table */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Student Directory
              </h3>
              <p className="text-gray-400">Showing {filteredStudents.length} students</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-semibold text-sm">Live Data</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-6 text-gray-300 font-semibold">Student</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Batch</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Attendance</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Avg Score</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Assignments</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Quizzes</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Status</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Last Active</th>
                <th className="text-left p-6 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredStudents.map((student, index) => (
                <StudentCard key={student.id} student={student} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: Users,
            label: 'Total Students',
            value: filteredStudents.length.toString(),
            color: 'from-blue-500 to-cyan-500',
            description: 'Across all batches'
          },
          {
            icon: Calendar,
            label: 'Avg Attendance',
            value: `${Math.round(filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / filteredStudents.length)}%`,
            color: 'from-emerald-500 to-teal-500',
            description: 'This month'
          },
          {
            icon: TrendingUp,
            label: 'Avg Performance',
            value: `${Math.round(filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / filteredStudents.length)}%`,
            color: 'from-purple-500 to-pink-500',
            description: 'Overall score'
          },
          {
            icon: AlertCircle,
            label: 'Need Attention',
            value: filteredStudents.filter(s => s.status === 'at-risk').length.toString(),
            color: 'from-orange-500 to-red-500',
            description: 'At-risk students'
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden"
          >
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 animate-gradient-x`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-300 font-medium text-sm">{stat.label}</p>
                <p className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs">{stat.description}</p>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float animation-delay-1000"></div>
          </div>
        ))}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI Insights
            </h3>
            <p className="text-gray-400">Powered by advanced analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Trending Up</span>
            </div>
            <p className="text-white font-medium mb-2">Overall Performance Improving</p>
            <p className="text-gray-400 text-sm">Average scores increased by 12% this month across all batches.</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Attention Needed</span>
            </div>
            <p className="text-white font-medium mb-2">Attendance Dip Detected</p>
            <p className="text-gray-400 text-sm">4 students showing decreased attendance patterns this week.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">Achievement</span>
            </div>
            <p className="text-white font-medium mb-2">New Learning Streak Record</p>
            <p className="text-gray-400 text-sm">Jane Smith achieved a 12-day consecutive learning streak!</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="group bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            <Rocket className="h-5 w-5 group-hover:animate-bounce" />
            <span>Generate Detailed Report</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
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

export default StudentDashboardView;
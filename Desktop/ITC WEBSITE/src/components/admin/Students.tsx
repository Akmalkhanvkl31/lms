import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  UserCheck, 
  UserX, 
  Eye,
  Download,
  Sparkles,
  GraduationCap,
  Phone,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Heart,
  BookOpen,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  grade: string;
  school: string;
  batchName: string;
  status: string;
  approved: boolean;
  parentName: string;
  parentContact: string;
  enrollmentDate: string;
  avatar: string;
  progress: number;
  assignments: { completed: number; total: number };
  attendance: number;
  achievements: string[];
  lastActive: string;
}

const StudentsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  // const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock data - replace with real Supabase data
  const students = [
    {
      id: '1',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      studentId: 'ITC2024001',
      grade: 'Grade 7',
      school: 'Delhi Public School',
      batchName: 'Career Explorers - Grade 7',
      status: 'active',
      approved: true,
      parentName: 'Dr. Robert Wilson',
      parentContact: '+91 9876543210',
      enrollmentDate: '2024-02-15',
      avatar: '👩‍🎓',
      progress: 85,
      assignments: { completed: 12, total: 15 },
      attendance: 92,
      achievements: ['Quick Learner', 'Perfect Attendance'],
      lastActive: '2024-03-15'
    },
    {
      id: '2',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      studentId: 'ITC2024002',
      grade: 'Grade 8',
      school: 'St. Mary\'s School',
      batchName: 'Innovation Champions - Grade 8',
      status: 'active',
      approved: true,
      parentName: 'Jennifer Johnson',
      parentContact: '+91 9876543211',
      enrollmentDate: '2024-02-20',
      avatar: '👨‍💻',
      progress: 78,
      assignments: { completed: 10, total: 15 },
      attendance: 88,
      achievements: ['Creative Thinker', 'Tech Enthusiast'],
      lastActive: '2024-03-16'
    },
    {
      id: '3',
      fullName: 'Emma Davis',
      email: 'emma.davis@email.com',
      studentId: 'ITC2024003',
      grade: 'Grade 9',
      school: 'Cambridge International',
      batchName: 'Future Leaders - Grade 9',
      status: 'pending',
      approved: false,
      parentName: 'Michael Davis',
      parentContact: '+91 9876543212',
      enrollmentDate: '2024-03-10',
      avatar: '👩‍🔬',
      progress: 0,
      assignments: { completed: 0, total: 0 },
      attendance: 0,
      achievements: [],
      lastActive: 'Never'
    },
    {
      id: '4',
      fullName: 'Alex Chen',
      email: 'alex.chen@email.com',
      studentId: 'ITC2024004',
      grade: 'Grade 7',
      school: 'International School',
      batchName: 'Career Explorers - Grade 7',
      status: 'active',
      approved: true,
      parentName: 'Lisa Chen',
      parentContact: '+91 9876543213',
      enrollmentDate: '2024-02-25',
      avatar: '👨‍🎨',
      progress: 92,
      assignments: { completed: 14, total: 15 },
      attendance: 95,
      achievements: ['Top Performer', 'Creative Leader', 'Mentor'],
      lastActive: '2024-03-16'
    }
  ];

  const batches = [
    { id: '1', name: 'Career Explorers - Grade 7', students: 28 },
    { id: '2', name: 'Innovation Champions - Grade 8', students: 24 },
    { id: '3', name: 'Future Leaders - Grade 9', students: 22 }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || student.batchName.includes(selectedBatch);
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-emerald-500 to-teal-500';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'inactive': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 85) return 'from-emerald-500 to-teal-500';
    if (progress >= 70) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const StudentCard = ({ student, index }: { student: Student, index: number }) => (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        transform: hoveredCard === `student-${index}` ? 'translateY(-8px) scale(1.02)' : ''
      }}
      onMouseEnter={() => setHoveredCard(`student-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl"></div>
      
      <div className="relative z-10">
        {/* Student Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-white/20">
                {student.avatar}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r ${getStatusColor(student.status)} rounded-full flex items-center justify-center border-2 border-slate-800`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {student.fullName}
              </h3>
              <p className="text-gray-400 text-sm font-medium">{student.studentId}</p>
              <p className="text-blue-400 text-sm">{student.email}</p>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(student.status)} text-white`}>
            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          </div>
        </div>

        {/* Student Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Grade & School</span>
              </div>
              <p className="text-white font-medium">{student.grade}</p>
              <p className="text-gray-300 text-sm">{student.school}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">Batch</span>
              </div>
              <p className="text-white font-medium text-sm">{student.batchName}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                Progress Overview
              </span>
              <span className="text-white font-bold">{student.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(student.progress)} transition-all duration-500`}
                style={{ width: `${student.progress}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-white font-bold">{student.assignments.completed}/{student.assignments.total}</div>
                <div className="text-gray-400">Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{student.attendance}%</div>
                <div className="text-gray-400">Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{student.achievements.length}</div>
                <div className="text-gray-400">Achievements</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {student.achievements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {student.achievements.slice(0, 2).map((achievement: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {achievement}
                </span>
              ))}
              {student.achievements.length > 2 && (
                <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full">
                  +{student.achievements.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Parent Info */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-gray-400 text-sm">Parent/Guardian</span>
            </div>
            <p className="text-white font-medium">{student.parentName}</p>
            <p className="text-gray-300 text-sm flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {student.parentContact}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            // onClick={() => setSelectedStudent(student)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
          
          {!student.approved && (
            <>
              <button className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all duration-300 hover:scale-110 border border-emerald-500/30">
                <UserCheck className="h-4 w-4 text-emerald-400" />
              </button>
              <button className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-300 hover:scale-110 border border-red-500/30">
                <UserX className="h-4 w-4 text-red-400" />
              </button>
            </>
          )}
          
          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110">
            <MoreHorizontal className="h-4 w-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float animation-delay-1000"></div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, color, description }: { icon: React.ElementType, value: string, label: string, color: string, description: string }) => (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 animate-gradient-x`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-300 font-medium text-sm">{label}</p>
          <p className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {value}
          </p>
          <p className="text-gray-400 text-xs">{description}</p>
        </div>
      </div>

      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
    </div>
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

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-lg mb-8">
            <Users className="h-5 w-5 text-blue-400 animate-pulse" />
            <Sparkles className="h-5 w-5 text-purple-400 animate-bounce" />
            <span className="font-semibold text-blue-200">Student Management Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Student Directory
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Manage and monitor student progress across all batches with advanced analytics and insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            value={students.length.toString()}
            label="Total Students"
            color="from-blue-500 to-cyan-500"
            description="Enrolled students"
          />
          <StatCard
            icon={CheckCircle}
            value={students.filter(s => s.approved).length.toString()}
            label="Approved"
            color="from-emerald-500 to-teal-500"
            description="Active students"
          />
          <StatCard
            icon={Clock}
            value={students.filter(s => !s.approved).length.toString()}
            label="Pending"
            color="from-yellow-500 to-orange-500"
            description="Awaiting approval"
          />
          <StatCard
            icon={TrendingUp}
            value="94.2%"
            label="Avg Progress"
            color="from-purple-500 to-pink-500"
            description="Overall performance"
          />
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
                <div className="text-sm text-gray-400">Refine your student search</div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="md:w-56">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All Batches</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.name} className="bg-slate-800">{batch.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="active" className="bg-slate-800">Active</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="inactive" className="bg-slate-800">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                // onClick={() => setShowAddModal(true)}
                className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5 group-hover:animate-bounce" />
                Add Student
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Download className="h-5 w-5 group-hover:animate-pulse" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStudents.map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Users className="h-16 w-16 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Students Found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search criteria or add new students to get started</p>
            <button 
              // onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <UserPlus className="h-5 w-5" />
              Add Your First Student
            </button>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
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

export default StudentsPage;

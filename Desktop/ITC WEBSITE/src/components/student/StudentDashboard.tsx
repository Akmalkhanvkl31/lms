import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Play, BookOpen, PenTool, Trophy, Users, Clock, Star, Video, Send, Target, Award, Sparkles, TrendingUp, Calendar, MessageCircle, Heart, Zap, Rocket, CheckCircle, ArrowRight, Globe, Activity, Gift } from 'lucide-react';
import VideoPlayer from '../common/VideoPlayer';
import AssignmentSubmissionModal from './AssignmentSubmissionModal';
import { Assignment } from '../../types';
import { supabase } from '../../supabaseClient';

interface SubmissionData {
  assignmentId: string;
  content: string;
  file?: File;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setAssignments(data);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const videos = [
    {
      id: '1',
      title: 'CEO Interactive Session - Leadership Fundamentals',
      description: 'An engaging session with industry leaders discussing the fundamentals of leadership and career development.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube' as const,
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      instructor: 'Mr. Rajesh Kumar'
    },
    {
      id: '2',
      title: 'Industry Veterans Talk - Career Pathways',
      description: 'Learn from experienced professionals about different career opportunities and how to prepare for them.',
      url: 'https://vimeo.com/123456789',
      platform: 'vimeo' as const,
      videoId: '123456789',
      thumbnail: 'https://vumbnail.com/123456789.jpg',
      instructor: 'Ms. Priya Sharma'
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'CEO Interactive Session',
      instructor: 'Mr. Rajesh Kumar',
      duration: '45 min',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'live',
      difficulty: 'beginner',
      description: 'Interactive session with industry leaders',
      progress: 75,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Industry Veterans Talk',
      instructor: 'Ms. Priya Sharma',
      duration: '60 min',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'video',
      difficulty: 'intermediate',
      description: 'Learn from experienced professionals',
      progress: 100,
      rating: 4.9
    },
    {
      id: 3,
      title: 'Hartoise Training Videos',
      instructor: 'Training Team',
      duration: '30 min',
      thumbnail: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'video',
      difficulty: 'beginner',
      description: 'Comprehensive skill development videos',
      progress: 45,
      rating: 4.7
    }
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Career Exploration Quiz',
      questions: 15,
      timeLimit: 30,
      status: 'available',
      description: 'Test your knowledge about different career paths',
      difficulty: 'intermediate',
      points: 150
    },
    {
      id: 2,
      title: 'Communication Skills Assessment',
      questions: 20,
      timeLimit: 25,
      status: 'completed',
      score: 85,
      description: 'Evaluate your communication abilities',
      difficulty: 'beginner',
      points: 200
    }
  ];

  const achievements = [
    { id: 1, title: 'Quick Learner', icon: '🚀', earned: true, description: 'Complete 5 lessons in a day' },
    { id: 2, title: 'Perfect Attendance', icon: '🎯', earned: true, description: '100% attendance for a week' },
    { id: 3, title: 'Top Performer', icon: '🏆', earned: false, description: 'Score above 90% in 3 quizzes' },
    { id: 4, title: 'Creative Thinker', icon: '💡', earned: true, description: 'Submit a creative assignment' }
  ];

  const handleSubmitAssignment = (submissionData: SubmissionData) => {
    console.log('Assignment submitted:', submissionData);
    setShowSubmissionModal(false);
    setSelectedAssignment(null);
  };

  const StatCard = ({ icon: Icon, label, value, color, description, trend }: any) => (
    <div className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-${color}-500/25 transition-all duration-700 transform hover:scale-105 border border-white/20 hover:border-${color}-400/50 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-bold">{trend}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-gray-200 font-semibold text-lg">{label}</h3>
          <p className="text-5xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {value}
          </p>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
    </div>
  );

  const renderOverview = () => (
    <div className="p-8 space-y-10">
      {/* Enhanced Welcome Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
        
        <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-2xl mb-8">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <Heart className="h-6 w-6 text-pink-400 animate-bounce" />
            <span className="font-bold text-purple-200 text-lg">Welcome Back</span>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Hello, {user?.name}! 🎉
          </h2>
          <p className="text-2xl text-gray-300 mb-8">Ready to explore your future career path?</p>
          
          <div className="flex flex-wrap gap-6 justify-center text-lg">
            {[
              { icon: '📚', label: 'Student ID', value: user?.studentId },
              { icon: '🎓', label: 'Grade', value: user?.grade },
              { icon: '🏫', label: 'School', value: user?.school }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                <span className="mr-3">{item.icon}</span>
                <span className="font-semibold text-white">{item.label}:</span>
                <span className="ml-2 text-purple-300">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
              <Rocket className="h-6 w-6 group-hover:animate-bounce" />
              Continue Learning
            </button>
            <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
              <Target className="h-6 w-6 group-hover:animate-pulse" />
              View Progress
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon={BookOpen}
          label="Courses Completed"
          value="8"
          color="from-blue-500 to-cyan-500"
          description="Keep up the great work!"
          trend="+2 this week"
        />
        <StatCard
          icon={PenTool}
          label="Assignments Done"
          value="12"
          color="from-emerald-500 to-teal-500"
          description="Excellent progress!"
          trend="+3 this week"
        />
        <StatCard
          icon={Trophy}
          label="Quiz Average"
          value="85%"
          color="from-yellow-500 to-orange-500"
          description="Above class average"
          trend="+5% improvement"
        />
      </div>

      {/* Achievement Showcase */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Your Achievements
            </h3>
            <p className="text-gray-400 text-lg">Celebrate your learning milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-400/50' 
                  : 'bg-white/5 border-white/20 hover:border-white/30'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-3 ${achievement.earned ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-bold mb-2 ${achievement.earned ? 'text-yellow-300' : 'text-gray-400'}`}>
                  {achievement.title}
                </h4>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
                {achievement.earned && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">EARNED</span>
                  </div>
                )}
              </div>
              
              {achievement.earned && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recent Activity
            </h3>
            <p className="text-gray-400 text-lg">Your learning journey highlights</p>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { action: 'Completed "Industry Veterans Talk"', time: '2 hours ago', icon: '🎯', color: 'purple' },
            { action: 'Submitted "Creative Writing Project"', time: '1 day ago', icon: '📝', color: 'green' },
            { action: 'Scored 85% in Communication Quiz', time: '2 days ago', icon: '🏆', color: 'yellow' },
            { action: 'Started new course "Leadership Fundamentals"', time: '3 days ago', icon: '🚀', color: 'blue' }
          ].map((activity, index) => (
            <div key={index} className="group flex items-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/30">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 text-3xl bg-gradient-to-br ${
                activity.color === 'purple' ? 'from-purple-500/20 to-pink-500/20' :
                activity.color === 'green' ? 'from-emerald-500/20 to-teal-500/20' :
                activity.color === 'yellow' ? 'from-yellow-500/20 to-orange-500/20' :
                'from-blue-500/20 to-cyan-500/20'
              } border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {activity.action}
                </p>
                <p className="text-gray-400">{activity.time}</p>
              </div>
              <div className={`w-4 h-4 rounded-full animate-pulse ${
                activity.color === 'purple' ? 'bg-purple-400' :
                activity.color === 'green' ? 'bg-emerald-400' :
                activity.color === 'yellow' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Learning Insights
            </h3>
            <p className="text-gray-400 text-lg">Personalized recommendations just for you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <span className="text-emerald-400 font-bold">STRENGTH</span>
            </div>
            <h4 className="text-white font-bold text-xl mb-2">Visual Learning</h4>
            <p className="text-gray-400 mb-4">You excel at video-based content and visual presentations.</p>
            <button className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 group">
              Explore Visual Courses
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-purple-400" />
              <span className="text-purple-400 font-bold">GOAL</span>
            </div>
            <h4 className="text-white font-bold text-xl mb-2">Next Milestone</h4>
            <p className="text-gray-400 mb-4">Complete 2 more assignments to unlock the Leadership badge.</p>
            <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 group">
              View Progress
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-2xl mb-6">
          <Video className="h-6 w-6 text-purple-400" />
          <span className="font-bold text-purple-200 text-lg">Video Library</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Learning Videos
        </h2>
        <p className="text-xl text-gray-300">Expand your knowledge with expert-led sessions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {videos.map((video) => (
          <VideoPlayer key={video.id} video={video} />
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-2xl mb-6">
          <BookOpen className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-blue-200 text-lg">Learning Sessions</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Interactive Sessions
        </h2>
        <p className="text-xl text-gray-300">Engage with industry experts and build your skills</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 transform hover:scale-105 border border-white/20 hover:border-blue-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                
                {/* Course type badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                  course.type === 'live' 
                    ? 'bg-red-500/80 text-white border border-red-400/50' 
                    : 'bg-blue-500/80 text-white border border-blue-400/50'
                }`}>
                  {course.type === 'live' ? '🔴 LIVE' : '📹 VIDEO'}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-bold">{course.rating}</span>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold">Progress</span>
                    <span className="text-white text-sm font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                    {course.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                    course.difficulty === 'intermediate' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {course.difficulty.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-3 group/btn">
                  <Play className="h-5 w-5 group-hover/btn:animate-pulse" />
                  {course.type === 'live' ? 'Join Live Session' : 'Continue Learning'}
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-sm rounded-full border border-red-500/30 shadow-2xl mb-6">
          <PenTool className="h-6 w-6 text-red-400" />
          <span className="font-bold text-red-200 text-lg">My Assignments</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Assignment Hub
        </h2>
        <p className="text-xl text-gray-300">Track your submissions and showcase your learning</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assignments.map((assignment) => (
          <div 
            key={assignment.id} 
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-700 transform hover:scale-105 border border-white/20 hover:border-red-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all duration-300">
                  {assignment.title}
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                  assignment.status === 'submitted' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                  assignment.status === 'graded' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {assignment.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{assignment.description}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-400" />
                    <span className="font-semibold">Due:</span>
                  </div>
                  <span className="font-bold">{new Date(`${assignment.dueDate}T${assignment.dueTime}`).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Max Score:</span>
                  </div>
                  <span className="font-bold">{assignment.maxScore} points</span>
                </div>
              </div>
              
              {assignment.status === 'submitted' && assignment.score && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-green-300 text-lg">Your Grade</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-green-300 font-black text-xl">
                        {Math.round((assignment.score / assignment.maxScore) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-green-300 font-semibold mb-2">
                    Score: {assignment.score}/{assignment.maxScore}
                  </div>
                  {assignment.feedback && (
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                      <p className="text-green-200 text-sm italic">"{assignment.feedback}"</p>
                    </div>
                  )}
                </div>
              )}
              
              {assignment.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowSubmissionModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                >
                  <Send className="h-5 w-5 group-hover/btn:animate-pulse" />
                  Submit Assignment
                  <Sparkles className="h-5 w-5 group-hover/btn:animate-spin" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30 shadow-2xl mb-6">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="font-bold text-yellow-200 text-lg">Quiz Center</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          Knowledge Tests
        </h2>
        <p className="text-xl text-gray-300">Challenge yourself and earn points</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {quizzes.map((quiz) => (
          <div 
            key={quiz.id} 
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-700 transform hover:scale-105 border border-white/20 hover:border-yellow-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
                  {quiz.title}
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                  quiz.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {quiz.status === 'completed' ? '✅ COMPLETED' : '🎯 AVAILABLE'}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{quiz.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-gray-400 text-sm mb-1">Questions</div>
                  <div className="text-white font-bold text-lg">{quiz.questions}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-gray-400 text-sm mb-1">Time Limit</div>
                  <div className="text-white font-bold text-lg">{quiz.timeLimit} min</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-gray-400 text-sm mb-1">Difficulty</div>
                  <div className={`font-bold text-lg ${
                    quiz.difficulty === 'beginner' ? 'text-green-400' : 
                    quiz.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {quiz.difficulty}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="text-gray-400 text-sm mb-1">Points</div>
                  <div className="text-yellow-400 font-bold text-lg">{quiz.points}</div>
                </div>
              </div>
              
              {quiz.score && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-300 text-lg">Your Score</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-400 fill-current animate-pulse" />
                      <span className="text-green-300 font-black text-2xl">{quiz.score}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {quiz.status === 'available' && (
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center gap-3 group/btn">
                  <Zap className="h-5 w-5 group-hover/btn:animate-bounce" />
                  Start Quiz Challenge
                  <Trophy className="h-5 w-5 group-hover/btn:animate-pulse" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-pink-500/30 shadow-2xl mb-6">
          <Users className="h-6 w-6 text-pink-400" />
          <span className="font-bold text-pink-200 text-lg">Memory Gallery</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Learning Moments
        </h2>
        <p className="text-xl text-gray-300">Capture and celebrate your educational journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400'
        ].map((image, index) => (
          <div 
            key={index} 
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-pink-500/25 transition-all duration-700 transform hover:scale-105 border border-white/20 hover:border-pink-400/50"
          >
            <div className="relative">
              <img 
                src={image} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-purple-600/60 via-pink-600/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-black text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  Learning Event {index + 1}
                </h3>
                <p className="text-gray-300 text-sm">Interactive session with industry experts and fellow learners</p>
                
                <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-semibold">12</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">5</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'sessions', label: 'Sessions', icon: Play },
    { id: 'assignments', label: 'Assignments', icon: PenTool },
    { id: 'quizzes', label: 'Quizzes', icon: Trophy },
    { id: 'gallery', label: 'Gallery', icon: Users }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Enhanced Background */}
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
        {[...Array(25)].map((_, i) => (
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
      <div className="relative z-10">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'sessions' && renderCourses()}
        {activeTab === 'assignments' && renderAssignments()}
        {activeTab === 'quizzes' && renderQuizzes()}
        {activeTab === 'gallery' && renderGallery()}
      </div>

      <AssignmentSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        assignment={selectedAssignment}
        onSubmit={handleSubmitAssignment}
      />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
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

        /* Glass morphism utilities */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      ` }} />
    </div>
  );
};

export default StudentDashboard;
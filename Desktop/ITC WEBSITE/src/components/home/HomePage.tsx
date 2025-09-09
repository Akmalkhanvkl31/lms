import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Award, 
  PlayCircle,
  ExternalLink,
  Video as VideoIcon,
  Sparkles,
  ChevronRight,
  Play,
  Star,
  Users,
  BookOpen,
  Target,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  Shield,
  Heart,
  Lightbulb,
  Rocket,
  Brain,
  Eye,
  Download,
  Share2,
  Coffee,
  Code,
  Palette,
  Music,
  GraduationCap,
  Monitor,
  Headphones,
  BarChart3
} from 'lucide-react';
import { Video } from '../../types';
import { featuredVideos, features, highlights, galleryImages } from '../../data/homePageData';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(imageInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const displayedVideos = showAllVideos ? featuredVideos : featuredVideos.slice(0, 3);

  const VideoCard = ({ video, index }: { video: Video; index: number }) => (
    <div 
      className={`group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ 
        animationDelay: `${index * 200}ms`,
        transform: hoveredCard === index ? 'translateY(-8px) scale(1.02)' : ''
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl"></div>
      
      <div className="relative z-10 p-6">
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600';
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 relative">
              <Play className="h-8 w-8 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            Featured
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
            12:34
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
          {video.title}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">{video.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-blue-400 font-medium">{video.instructor}</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>1.2K</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>4.8</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn">
            <span className="relative z-10">Watch Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110">
            <Heart className="h-4 w-4 text-gray-300 hover:text-red-400 transition-colors" />
          </button>
          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110">
            <Share2 className="h-4 w-4 text-gray-300 hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float animation-delay-1000"></div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, gradient }: { icon: any, value: string, label: string, gradient: string }) => (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
      
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{value}</div>
        <div className="text-gray-300 font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs with mouse parallax */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            animationDelay: '2s'
          }}
        ></div>

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

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-24 h-24 border border-purple-500/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 border border-pink-500/30 rounded-full animate-float animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-20 pb-16"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      >
        {/* Dynamic background image with parallax */}
        <div 
          className="absolute inset-0 transition-opacity duration-2000"
          style={{
            backgroundImage: `url(${galleryImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            transform: `scale(${1 + scrollY * 0.0001})`
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-20">
          {/* Animated Status Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <Sparkles className="h-5 w-5 text-purple-400 animate-bounce" />
            <span className="font-semibold text-purple-200">🚀 Transforming Education Since 2020</span>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-500"></div>
          </div>

          {/* Main Heading with Gradient Animation */}
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              ITC Kids
            </span>
            <br />
            <span className="text-gray-200 text-4xl md:text-6xl lg:text-7xl font-light">
              Career Design
            </span>
          </h1>

          {/* Animated Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Empowering the next generation through{' '}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              innovative learning experiences
            </span>, 
            expert mentorship, and real-world skill development
          </p>

          {/* Animated CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <button className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 overflow-hidden">
              <Rocket className="w-6 h-6 group-hover:animate-bounce" />
              <span className="relative z-10">Start Learning Journey</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:shadow-lg transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-3">
              <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Animated Hero Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto transform transition-all duration-1000 delay-800 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <StatCard icon={Users} value="100K+" label="Active Students" gradient="from-purple-500 to-pink-500" />
            <StatCard icon={BookOpen} value="1M+" label="Learning Hours" gradient="from-blue-500 to-cyan-500" />
            <StatCard icon={Award} value="2.5K+" label="Graduates" gradient="from-emerald-500 to-teal-500" />
            <StatCard icon={Globe} value="50+" label="Countries" gradient="from-orange-500 to-red-500" />
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section with Gradient Background */}
      <section className="py-24 bg-gradient-to-b from-transparent via-slate-800/50 to-transparent relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-gradient-x"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-8">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-blue-300">Why Choose Us</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Modern Learning{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Platform
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Combining cutting-edge technology with proven educational methodologies for an exceptional learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Learning",
                description: "Personalized learning paths powered by artificial intelligence and machine learning",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Expert Mentorship",
                description: "Learn from industry professionals and experienced educators worldwide",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Monitor,
                title: "Interactive Content",
                description: "Engaging multimedia content designed for modern digital learners",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: Award,
                title: "Certified Programs",
                description: "Industry-recognized certifications to boost your career prospects",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-500/20 hover:border-purple-400/50 overflow-hidden"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                  
                  <button className="text-purple-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300 group-hover:text-pink-400">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Learning Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-green-500/30 mb-8">
              <VideoIcon className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">Premium Content</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Featured{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                Learning Videos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our curated collection of educational content designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowAllVideos(!showAllVideos)}
              className="group bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto relative overflow-hidden"
            >
              <span className="relative z-10">{showAllVideos ? 'Show Less' : 'Explore All Content'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* About AIMRI Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800/50 to-purple-800/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 animate-gradient-x"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 mb-8">
                <Award className="w-5 h-5 text-orange-400" />
                <span className="font-semibold text-orange-300">Excellence in Education</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                About{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
                  AIMRI
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The Aries International Maritime Research Institute (AIMRI) is revolutionizing 
                industrial education by connecting academic learning with real-world expertise.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-orange-400 group-hover:animate-spin" />
                    <span className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">25K+</span>
                  </div>
                  <div className="text-sm text-gray-300">Training Hours Delivered</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-400 group-hover:animate-bounce" />
                    <span className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">100+</span>
                  </div>
                  <div className="text-sm text-gray-300">Successful Batches</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 relative overflow-hidden">
                  <Globe className="w-5 h-5 group-hover:animate-spin" />
                  <span className="relative z-10">Visit AIMRI</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="group bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 group">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="AIMRI Excellence"
                  className="w-full h-80 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating achievement badges with animations */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white shadow-2xl border border-white/20 transform hover:scale-110 transition-transform duration-300 animate-float">
                  <Award className="w-8 h-8 mb-2 animate-bounce" />
                  <div className="font-bold">Excellence</div>
                  <div className="text-sm opacity-90">Award Winner</div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white shadow-2xl border border-white/20 transform hover:scale-110 transition-transform duration-300 animate-float animation-delay-1000">
                  <TrendingUp className="w-8 h-8 mb-2 animate-pulse" />
                  <div className="font-bold">Growing</div>
                  <div className="text-sm opacity-90">Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-x"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-pink-500/30 mb-8">
              <Palette className="w-5 h-5 text-pink-400" />
              <span className="font-semibold text-pink-300">Visual Stories</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Visual{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Gallery
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Witness the transformative journey through our events, workshops, conferences, 
              and student achievements that capture the essence of our educational revolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-pink-500/25"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h4 className="font-bold text-lg mb-1">Event Highlight</h4>
                        <p className="text-sm text-gray-300">Interactive Learning Session</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors hover:scale-110">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors hover:scale-110">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float animation-delay-1000"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto relative overflow-hidden">
              <Eye className="w-5 h-5 group-hover:animate-pulse" />
              <span className="relative z-10">View Full Gallery</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-20 animate-gradient-x"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl animate-float animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30 mb-8">
            <Rocket className="w-5 h-5 text-yellow-400 animate-bounce" />
            <span className="font-semibold text-yellow-300">Join the Revolution</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
            Ready to Start Your{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
              Journey?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            Join thousands of students who are already exploring their future careers with ITC 
            and transforming their educational experience into real-world success stories.
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-16 py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 overflow-hidden">
              <Zap className="w-6 h-6 group-hover:animate-bounce" />
              <span className="relative z-10">Register Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group bg-white/10 backdrop-blur-sm text-white px-16 py-6 rounded-2xl font-bold text-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center justify-center gap-3">
              <Coffee className="w-6 h-6 group-hover:animate-pulse" />
              Already Have an Account?
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust indicators with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white group-hover:animate-pulse" />
              </div>
              <div className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">Secure Learning</div>
              <div className="text-sm text-gray-400">Protected Environment</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Code className="h-8 w-8 text-white group-hover:animate-bounce" />
              </div>
              <div className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">Modern Tech</div>
              <div className="text-sm text-gray-400">Latest Technology</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-white group-hover:animate-pulse" />
              </div>
              <div className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 group-hover:bg-clip-text transition-all duration-300">Expert Mentors</div>
              <div className="text-sm text-gray-400">Industry Professionals</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Music className="h-8 w-8 text-white group-hover:animate-spin" />
              </div>
              <div className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">Creative Arts</div>
              <div className="text-sm text-gray-400">Multimedia Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with floating gradient line */}
      <div className="relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default HomePage;
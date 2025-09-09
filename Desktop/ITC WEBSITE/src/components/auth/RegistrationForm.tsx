import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Phone, Mail, MapPin, Upload, CheckCircle, 
  Sparkles, ArrowRight, School, Users, Globe, Heart, 
  GraduationCap, Shield, Star, Home, BookOpen
} from 'lucide-react';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    schoolName: '',
    grade: '',
    schoolAddress: '',
    parentName: '',
    relationship: '',
    contactNumber: '',
    email: '',
    password: '',
    address: '',
    preferredLanguage: '',
    hobbies: '',
    specialNeeds: '',
    agreeToTerms: false
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real multi-step form, you would update the step here.
    // For now, this comment is to satisfy the linter.
    setCurrentStep(prev => prev + 1);

    try {
      await register({ ...formData, photo: photo ?? undefined });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-500/20 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto blur opacity-30 animate-pulse"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Registration Successful! 🎉
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Welcome to the ITC family! Your registration has been submitted successfully. 
              You'll be redirected to the login page shortly.
            </p>
            
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-emerald-500/30">
              <div className="h-2 bg-emerald-200/20 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-emerald-300 text-sm mt-2">Redirecting in 3 seconds...</p>
            </div>

            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formSections = [
    {
      title: "Basic Details",
      icon: User,
      color: "from-purple-500 to-pink-500",
      fields: ['fullName', 'dateOfBirth', 'gender']
    },
    {
      title: "School Information",
      icon: School,
      color: "from-blue-500 to-cyan-500",
      fields: ['schoolName', 'grade', 'schoolAddress']
    },
    {
      title: "Contact Details",
      icon: Phone,
      color: "from-emerald-500 to-teal-500",
      fields: ['parentName', 'relationship', 'contactNumber', 'email', 'address']
    },
    {
      title: "Additional Info",
      icon: Heart,
      color: "from-orange-500 to-red-500",
      fields: ['preferredLanguage', 'hobbies', 'specialNeeds']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animationDelay: '1s'
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            <span className="font-semibold text-purple-200">Join ITC Kids Career Design</span>
            <Star className="h-4 w-4 text-yellow-400 animate-bounce" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Student <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Registration</span>
          </h1>
          <p className="text-gray-300 text-lg">Start your amazing learning journey with us</p>
        </div>

        {/* Progress Indicator */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex justify-between items-center mb-4">
            {formSections.map((section, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${section.color} shadow-lg` 
                    : 'bg-slate-700 border border-slate-600'
                }`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {section.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Basic Details</h2>
                  <p className="text-gray-300">Tell us about yourself</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Date of Birth</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-slate-800">Select Gender</option>
                    <option value="male" className="bg-slate-800">Male</option>
                    <option value="female" className="bg-slate-800">Female</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Photo Upload</label>
                  <div className="relative group">
                    <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* School Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <School className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">School Information</h2>
                  <p className="text-gray-300">Your educational background</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">School Name</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your school name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Grade/Class</label>
                  <select
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-slate-800">Select Grade</option>
                    <option value="5" className="bg-slate-800">Class 5</option>
                    <option value="6" className="bg-slate-800">Class 6</option>
                    <option value="7" className="bg-slate-800">Class 7</option>
                    <option value="8" className="bg-slate-800">Class 8</option>
                    <option value="9" className="bg-slate-800">Class 9</option>
                    <option value="10" className="bg-slate-800">Class 10</option>
                    <option value="11" className="bg-slate-800">Class 11</option>
                    <option value="12" className="bg-slate-800">Class 12</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-200">School Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <textarea
                      name="schoolAddress"
                      required
                      value={formData.schoolAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Enter your school address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                  <p className="text-gray-300">Parent/Guardian details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Parent/Guardian Name</label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter parent/guardian name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Relationship</label>
                  <input
                    type="text"
                    name="relationship"
                    required
                    value={formData.relationship}
                    onChange={handleInputChange}
                    placeholder="e.g., Father, Mother, Guardian"
                    className="w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="tel"
                      name="contactNumber"
                      required
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Password</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Residential Address</label>
                  <div className="relative group">
                    <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Enter residential address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Additional Information</h2>
                  <p className="text-gray-300">Help us know you better</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Preferred Language</label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                    <select
                      name="preferredLanguage"
                      required
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="" className="bg-slate-800">Select Language</option>
                      <option value="english" className="bg-slate-800">English</option>
                      <option value="malayalam" className="bg-slate-800">Malayalam</option>
                      <option value="hindi" className="bg-slate-800">Hindi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Hobbies/Interests (Optional)</label>
                  <div className="relative group">
                    <Star className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="text"
                      name="hobbies"
                      value={formData.hobbies}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g., Reading, Sports, Music"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Special Needs (If any)</label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Please mention any special needs or requirements"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-5 w-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div>
                  <label className="text-sm text-gray-200 leading-relaxed">
                    <span className="font-semibold text-white">I agree to the terms and conditions</span> of the ITC LMS and consent to the processing of my personal data for educational purposes. I understand that this information will be used to provide personalized learning experiences and communicate important updates.
                  </label>
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-300">
                    <Shield className="h-4 w-4" />
                    <span>Your data is protected and secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden min-w-[200px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="relative z-10">Submit Registration</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>

          {/* Already have account link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500/20 rounded-full opacity-0 animate-float animation-delay-1000" style={{ opacity: isVisible ? 0.6 : 0 }}></div>
        <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-pink-500/20 rounded-full opacity-0 animate-float animation-delay-2000" style={{ opacity: isVisible ? 0.6 : 0 }}></div>
        <div className="absolute top-1/2 -left-4 w-6 h-6 bg-blue-500/20 rounded-full opacity-0 animate-float animation-delay-3000" style={{ opacity: isVisible ? 0.6 : 0 }}></div>
      </div>
    </div>
  );
};

export default RegistrationForm;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  X, 
  UserPlus, 
  Sparkles, 
  User, 
  Mail, 
  GraduationCap, 
  School, 
  Users,
  Phone,
  Star,
  Zap,
  ArrowRight,
  CheckCircle,
  Heart,
  Award,
  Target,
  Calendar,
  MapPin,
  BookOpen,
  Globe,
  Palette,
  Brain,
  Camera,
  Shield
} from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: any) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    schoolName: '',
    schoolAddress: '',
    address: '',
    preferredLanguage: 'English',
    hobbies: '',
    specialNeeds: '',
    parentName: '',
    parentRelationship: 'Parent',
    parentContact: '',
    parentEmail: '',
    batchId: '',
    photoUrl: ''
  });

  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [batches, setBatches] = useState<{id: string, name: string, grade_level: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      const fetchBatches = async () => {
        const { data, error } = await supabase.from('batches').select('id, name, grade_level, status');
        if (error) {
          console.error('Error fetching batches:', error);
        } else {
          setBatches(data?.filter(batch => batch.status === 'active') || []);
        }
      };

      fetchBatches();
      
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      const userId = authData.user.id;

      // Step 2: Upload photo if provided
      let photoUrl = '';
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('student-photos')
          .upload(fileName, photoFile);

        if (uploadError) {
          console.warn('Photo upload failed:', uploadError.message);
        } else {
          const { data: urlData } = supabase.storage
            .from('student-photos')
            .getPublicUrl(fileName);
          photoUrl = urlData.publicUrl;
        }
      }

      // Step 3: Generate student ID
      const currentYear = new Date().getFullYear();
      const studentId = `ITC${currentYear}${String(Date.now()).slice(-4)}`;

      // Step 4: Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          full_name: formData.fullName,
          role: 'student'
        }]);

      if (userError) {
        throw new Error(`User creation error: ${userError.message}`);
      }

      // Step 5: Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert([{
          id: userId,
          student_id: studentId,
          batch_id: formData.batchId ? parseInt(formData.batchId) : null,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          school_name: formData.schoolName,
          grade: formData.grade,
          school_address: formData.schoolAddress || null,
          address: formData.address || null,
          preferred_language: formData.preferredLanguage,
          hobbies: formData.hobbies || null,
          special_needs: formData.specialNeeds || null,
          photo_url: photoUrl || null,
          status: 'active'
        }]);

      if (studentError) {
        throw new Error(`Student creation error: ${studentError.message}`);
      }

      // Step 6: Create parent record
      if (formData.parentName && formData.parentContact) {
        const { error: parentError } = await supabase
          .from('parents')
          .insert([{
            student_id: userId,
            full_name: formData.parentName,
            relationship: formData.parentRelationship,
            contact_number: formData.parentContact,
            email: formData.parentEmail || null,
            is_primary: true
          }]);

        if (parentError) {
          console.warn('Parent creation error:', parentError.message);
        }
      }

      // Step 7: Initialize student progress if batch is assigned
      if (formData.batchId) {
        const { error: progressError } = await supabase
          .from('student_progress')
          .insert([{
            student_id: userId,
            batch_id: parseInt(formData.batchId),
            total_assignments: 0,
            completed_assignments: 0,
            total_quizzes: 0,
            completed_quizzes: 0,
            average_score: 0,
            attendance_percentage: 0,
            learning_streak_days: 0,
            last_activity_date: new Date().toISOString().split('T')[0],
            achievements: []
          }]);

        if (progressError) {
          console.warn('Progress initialization error:', progressError.message);
        }
      }

      setMessage({ type: 'success', text: '🎉 Student enrolled successfully! Welcome to ITC!' });
      
      // Prepare response data
      const studentData = {
        id: userId,
        studentId,
        fullName: formData.fullName,
        email: formData.email,
        grade: formData.grade,
        school: formData.schoolName,
        batchId: formData.batchId,
        parentName: formData.parentName,
        parentContact: formData.parentContact,
        status: 'active',
        enrollmentDate: new Date().toISOString().split('T')[0]
      };

      if (onSubmit) {
        onSubmit(studentData);
      }
      
      // Reset and close after success
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2500);

    } catch (error) {
      console.error('Student creation error:', error);
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unexpected error occurred during enrollment.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      grade: '',
      schoolName: '',
      schoolAddress: '',
      address: '',
      preferredLanguage: 'English',
      hobbies: '',
      specialNeeds: '',
      parentName: '',
      parentRelationship: 'Parent',
      parentContact: '',
      parentEmail: '',
      batchId: '',
      photoUrl: ''
    });
    setPhotoFile(null);
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: User, description: 'Personal details', color: 'from-blue-500 to-cyan-500' },
    { number: 2, title: 'Academic Info', icon: GraduationCap, description: 'School & education', color: 'from-purple-500 to-pink-500' },
    { number: 3, title: 'Parent/Guardian', icon: Heart, description: 'Contact information', color: 'from-emerald-500 to-teal-500' },
    { number: 4, title: 'Review', icon: CheckCircle, description: 'Final confirmation', color: 'from-orange-500 to-red-500' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * -0.015}px`,
            bottom: `${mousePosition.y * -0.015}px`,
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.008}px`,
            bottom: `${mousePosition.y * 0.008}px`,
            animationDelay: '2s'
          }}
        />
        
        {/* Floating elements representing learning */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 8}s`
            }}
          >
            {i % 5 === 0 && <BookOpen className="w-3 h-3 text-blue-400" />}
            {i % 5 === 1 && <Brain className="w-3 h-3 text-purple-400" />}
            {i % 5 === 2 && <Star className="w-2 h-2 text-yellow-400" />}
            {i % 5 === 3 && <Sparkles className="w-3 h-3 text-pink-400" />}
            {i % 5 === 4 && <Award className="w-3 h-3 text-emerald-400" />}
          </div>
        ))}
      </div>

      <div className={`relative w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Dynamic Gradient Border */}
        <div className="absolute inset-0 rounded-3xl animate-gradient-x" style={{
          background: `linear-gradient(135deg, ${steps[currentStep - 1]?.color || 'from-blue-500 to-cyan-500'})`
        }} />
        <div className="absolute inset-[2px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl" />
        
        <div className="relative z-10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative px-8 py-6" style={{
            background: `linear-gradient(135deg, ${steps[currentStep - 1]?.color || 'from-blue-600/90 via-cyan-600/90 to-purple-600/90'})`
          }}>
            <div className="absolute inset-0 opacity-80 animate-gradient-x" style={{
              background: `linear-gradient(135deg, ${steps[currentStep - 1]?.color || 'from-blue-600 via-cyan-600 to-purple-600'})`
            }} />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Welcome New Student</h2>
                  <p className="text-blue-100">Join the ITC learning community and start your journey</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                  <span className="text-white font-semibold text-sm">Step {currentStep}/4</span>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 group disabled:opacity-50"
                >
                  <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Enhanced Step Progress */}
            <div className="mt-6 flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-white/20 backdrop-blur-sm scale-105' 
                      : 'bg-white/10'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.number 
                        ? 'bg-white text-blue-600 shadow-lg scale-110' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div className="font-semibold text-white">{step.title}</div>
                      <div className="text-xs text-blue-100">{step.description}</div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step.number 
                        ? 'bg-white shadow-lg' 
                        : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="p-8">
              <div className="min-h-[500px] relative">
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <UserPlus className="h-16 w-16 text-blue-400 animate-bounce" />
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-xl font-bold mb-2">Creating Student Account...</p>
                        <p className="text-gray-400">Setting up the learning journey</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success/Error Message */}
                {message && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 rounded-2xl border z-10 ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                      : 'bg-red-500/20 border-red-500 text-red-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                      <span className="font-medium">{message.text}</span>
                    </div>
                  </div>
                )}

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-lg mb-4">
                        <User className="h-5 w-5 text-blue-400 animate-pulse" />
                        <span className="font-semibold text-blue-200">Personal Information</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Let's Get to Know You
                      </h3>
                      <p className="text-gray-400 text-lg">Tell us about yourself to create your profile</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-400" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your complete name"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-400" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="student@example.com"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a secure password"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        >
                          <option value="" className="bg-slate-800">Select Gender</option>
                          <option value="Male" className="bg-slate-800">Male</option>
                          <option value="Female" className="bg-slate-800">Female</option>
                          <option value="Other" className="bg-slate-800">Other</option>
                          <option value="Prefer not to say" className="bg-slate-800">Prefer not to say</option>
                        </select>
                      </div>

                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          Home Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Enter your complete address"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          Preferred Language
                        </label>
                        <select
                          name="preferredLanguage"
                          value={formData.preferredLanguage}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        >
                          <option value="English" className="bg-slate-800">English</option>
                          <option value="Malayalam" className="bg-slate-800">Malayalam</option>
                          <option value="Hindi" className="bg-slate-800">Hindi</option>
                          <option value="Tamil" className="bg-slate-800">Tamil</option>
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Camera className="h-4 w-4 text-blue-400" />
                          Profile Photo
                        </label>
                        <input
                          type="file"
                          onChange={handlePhotoChange}
                          accept="image/*"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Palette className="h-4 w-4 text-blue-400" />
                          Hobbies & Interests
                        </label>
                        <textarea
                          name="hobbies"
                          value={formData.hobbies}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Tell us about your hobbies, interests, and what you love to do..."
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-blue-400" />
                          Special Needs or Accommodations
                        </label>
                        <textarea
                          name="specialNeeds"
                          value={formData.specialNeeds}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Any special learning needs, accommodations, or support requirements..."
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-blue-400/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Information */}
                {currentStep === 2 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg mb-4">
                        <GraduationCap className="h-5 w-5 text-purple-400 animate-pulse" />
                        <span className="font-semibold text-purple-200">Academic Information</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Your Educational Journey
                      </h3>
                      <p className="text-gray-400 text-lg">Tell us about your school and academic background</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <School className="h-4 w-4 text-purple-400" />
                          School Name *
                        </label>
                        <input
                          type="text"
                          name="schoolName"
                          required
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          placeholder="Enter your school name"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-400" />
                          Current Grade *
                        </label>
                        <select
                          name="grade"
                          required
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        >
                          <option value="" className="bg-slate-800">Select Current Grade</option>
                          <option value="Grade 5" className="bg-slate-800">Grade 5</option>
                          <option value="Grade 6" className="bg-slate-800">Grade 6</option>
                          <option value="Grade 7" className="bg-slate-800">Grade 7</option>
                          <option value="Grade 8" className="bg-slate-800">Grade 8</option>
                          <option value="Grade 9" className="bg-slate-800">Grade 9</option>
                          <option value="Grade 10" className="bg-slate-800">Grade 10</option>
                          <option value="Grade 11" className="bg-slate-800">Grade 11</option>
                          <option value="Grade 12" className="bg-slate-800">Grade 12</option>
                        </select>
                      </div>

                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-400" />
                          School Address
                        </label>
                        <textarea
                          name="schoolAddress"
                          value={formData.schoolAddress}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Enter your school's complete address"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-purple-400/50"
                        />
                      </div>

                      <div className="group md:col-span-2">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-400" />
                          Assign to Batch (Optional)
                        </label>
                        <select
                          name="batchId"
                          value={formData.batchId}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        >
                          <option value="" className="bg-slate-800">Assign to batch later</option>
                          {batches.map(batch => (
                            <option key={batch.id} value={batch.id} className="bg-slate-800">
                              {batch.name} ({batch.grade_level})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Academic Interests Preview */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="h-6 w-6 text-purple-400" />
                        <span className="text-purple-400 font-bold text-lg">Academic Focus Areas</span>
                      </div>
                      <p className="text-white font-medium mb-3">Based on your grade level, you'll have access to:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Career Exploration', 'Skill Development', 'Creative Projects', 'Industry Insights'].map((area) => (
                          <div key={area} className="bg-white/10 rounded-xl p-3 text-center">
                            <div className="text-purple-400 font-semibold text-sm">{area}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Parent/Guardian Information */}
                {currentStep === 3 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 shadow-lg mb-4">
                        <Heart className="h-5 w-5 text-emerald-400 animate-pulse" />
                        <span className="font-semibold text-emerald-200">Parent/Guardian Details</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Family Connection
                      </h3>
                      <p className="text-gray-400 text-lg">Contact information for your parent or guardian</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-emerald-400" />
                          Parent/Guardian Name *
                        </label>
                        <input
                          type="text"
                          name="parentName"
                          required
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="Full name of parent/guardian"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-400" />
                          Relationship *
                        </label>
                        <select
                          name="parentRelationship"
                          required
                          value={formData.parentRelationship}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        >
                          <option value="Parent" className="bg-slate-800">Parent</option>
                          <option value="Father" className="bg-slate-800">Father</option>
                          <option value="Mother" className="bg-slate-800">Mother</option>
                          <option value="Guardian" className="bg-slate-800">Guardian</option>
                          <option value="Grandparent" className="bg-slate-800">Grandparent</option>
                          <option value="Other" className="bg-slate-800">Other</option>
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-400" />
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="parentContact"
                          required
                          value={formData.parentContact}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-emerald-400" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          placeholder="parent@example.com"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                      </div>
                    </div>

                    {/* Communication Preferences */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-emerald-400" />
                        <span className="text-emerald-400 font-bold text-lg">Communication & Updates</span>
                      </div>
                      <div className="space-y-3">
                        <p className="text-white font-medium">Your parent/guardian will receive:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            'Enrollment confirmation',
                            'Progress reports',
                            'Assignment notifications',
                            'Event invitations'
                          ].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                              <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 shadow-lg mb-4">
                        <CheckCircle className="h-5 w-5 text-orange-400 animate-pulse" />
                        <span className="font-semibold text-orange-200">Final Review</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Welcome to ITC! 🎉
                      </h3>
                      <p className="text-gray-400 text-lg">Review your information before joining our learning community</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Student Information */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                        <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          Student Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Full Name:</span>
                            <p className="text-white font-bold text-lg mt-1">{formData.fullName || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Email:</span>
                            <p className="text-white font-medium mt-1">{formData.email || 'Not specified'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Grade:</span>
                              <p className="text-white font-medium mt-1">{formData.grade || 'Not selected'}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Gender:</span>
                              <p className="text-white font-medium mt-1">{formData.gender || 'Not specified'}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">School:</span>
                            <p className="text-white font-medium mt-1">{formData.schoolName || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Language:</span>
                            <p className="text-white font-medium mt-1">{formData.preferredLanguage}</p>
                          </div>
                          {formData.batchId && (
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Assigned Batch:</span>
                              <p className="text-white font-bold mt-1">
                                {batches.find(b => b.id === formData.batchId)?.name || 'Unknown Batch'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Parent/Guardian Information */}
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                        <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                          </div>
                          Parent/Guardian
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Name:</span>
                            <p className="text-white font-bold text-lg mt-1">{formData.parentName || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Relationship:</span>
                            <p className="text-white font-medium mt-1">{formData.parentRelationship}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Contact:</span>
                            <p className="text-white font-medium mt-1">{formData.parentContact || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Email:</span>
                            <p className="text-white font-medium mt-1">{formData.parentEmail || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    {(formData.hobbies || formData.specialNeeds || formData.address) && (
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                        <h4 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Palette className="h-4 w-4 text-white" />
                          </div>
                          Additional Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {formData.hobbies && (
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Hobbies & Interests:</span>
                              <p className="text-white text-sm mt-1">{formData.hobbies}</p>
                            </div>
                          )}
                          {formData.specialNeeds && (
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Special Needs:</span>
                              <p className="text-white text-sm mt-1">{formData.specialNeeds}</p>
                            </div>
                          )}
                          {formData.address && (
                            <div className="md:col-span-2">
                              <span className="text-gray-400 text-sm font-medium">Address:</span>
                              <p className="text-white text-sm mt-1">{formData.address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Welcome Preview Card */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-gradient-x"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-pulse">
                            <UserPlus className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                              Ready to Join ITC! 
                            </h4>
                            <p className="text-orange-300 font-medium">Your learning adventure is about to begin</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-white/10 rounded-xl">
                            <Award className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-orange-400 font-bold text-sm">Career Ready</div>
                            <div className="text-gray-400 text-xs">Skills Development</div>
                          </div>
                          <div className="text-center p-4 bg-white/10 rounded-xl">
                            <Brain className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-orange-400 font-bold text-sm">Creative</div>
                            <div className="text-gray-400 text-xs">Innovation Focus</div>
                          </div>
                          <div className="text-center p-4 bg-white/10 rounded-xl">
                            <Users className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-orange-400 font-bold text-sm">Community</div>
                            <div className="text-gray-400 text-xs">Peer Learning</div>
                          </div>
                          <div className="text-center p-4 bg-white/10 rounded-xl">
                            <Target className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-orange-400 font-bold text-sm">Goal Focused</div>
                            <div className="text-gray-400 text-xs">Achievement Path</div>
                          </div>
                        </div>

                        <div className="bg-orange-500/20 rounded-xl p-6 border border-orange-500/30">
                          <div className="flex items-center gap-3 mb-3">
                            <Sparkles className="h-5 w-5 text-orange-400 animate-pulse" />
                            <span className="text-orange-400 font-bold">What happens next?</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-white">Account creation & email confirmation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-white">Access to learning dashboard</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-white">Parent notification sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-white">Welcome orientation materials</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Navigation Footer */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentStep === 1 || isLoading
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                      : 'bg-white/10 text-white hover:bg-white/20 transform hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="h-5 w-5 group-hover:animate-bounce" />
                      <span>{isLoading ? 'Enrolling...' : 'Join ITC Community'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
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
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(1deg);
          }
          66% {
            transform: translateY(4px) rotate(-1deg);
          }
        }
        
        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #06b6d4);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #0891b2);
        }

        /* Enhanced focus states */
        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        /* File input styling */
        input[type="file"]::-webkit-file-upload-button {
          border-radius: 9999px;
          border: none;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          color: white;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        input[type="file"]::-webkit-file-upload-button:hover {
          background: linear-gradient(to right, #2563eb, #0891b2);
          transform: scale(1.05);
        }

        /* Enhanced animations */
        .group:hover .animate-bounce {
          animation: bounce 1s infinite;
        }

        /* Loading animation */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Success animation */
        @keyframes celebration {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .animate-celebration {
          animation: celebration 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StudentModal;
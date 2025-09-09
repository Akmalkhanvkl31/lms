import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  X, 
  PenTool, 
  Calendar, 
  Clock, 
  Sparkles, 
  Upload, 
  FileText, 
  Users, 
  Star, 
  Zap,
  ArrowRight,
  Trash2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  Brain,
  Rocket,
  Heart
} from 'lucide-react';
import { Assignment } from '../../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (assignmentData: Assignment) => void;
  assignment: Assignment | null;
  onSuccess: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    batchId: '',
    dueDate: '',
    dueTime: '',
    maxScore: 100,
    submissionType: 'text',
    allowLateSubmission: false,
    attachments: [] as File[],
    difficulty: 'intermediate',
    estimatedHours: 2,
    category: 'general'
  });

  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      const fetchBatches = async () => {
        const { data, error } = await supabase.from('batches').select('id, name');
        if (error) {
          console.error('Error fetching batches:', error);
        } else {
          setBatches(data);
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
      const { title, description, instructions, batchId, dueDate, dueTime, attachments, maxScore, submissionType, allowLateSubmission, difficulty, estimatedHours, category } = formData;

      // Upload attachments to Supabase Storage
      const attachmentUrls = await Promise.all(
        attachments.map(async (file) => {
          const filePath = `assignments/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('assignment-attachments')
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          const { data: urlData } = supabase.storage
            .from('assignment-attachments')
            .getPublicUrl(filePath);

          return { name: file.name, url: urlData.publicUrl, size: file.size };
        })
      );

      // Combine Date and Time for Supabase
      const dueDateTime = new Date(`${dueDate}T${dueTime}`);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Prepare data for Supabase
      const assignmentData = {
        title,
        description,
        instructions,
        batch_id: parseInt(batchId),
        due_date: dueDateTime.toISOString(),
        max_score: maxScore,
        submission_type: submissionType,
        allow_late_submission: allowLateSubmission,
        attachments: attachmentUrls,
        created_by: user?.id,
        is_published: true,
        // Additional metadata
        metadata: {
          difficulty,
          estimated_hours: estimatedHours,
          category,
          created_via: 'admin_dashboard'
        }
      };

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setMessage({ type: 'success', text: '🎉 Assignment created successfully!' });
        if (onSubmit) {
          onSubmit(data[0]);
        }
        
        // Reset form and close after success animation
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      instructions: '',
      batchId: '',
      dueDate: '',
      dueTime: '',
      maxScore: 100,
      submissionType: 'text',
      allowLateSubmission: false,
      attachments: [],
      difficulty: 'intermediate',
      estimatedHours: 2,
      category: 'general'
    });
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText, description: 'Assignment fundamentals', color: 'from-blue-500 to-cyan-500' },
    { number: 2, title: 'Configuration', icon: Target, description: 'Settings & delivery', color: 'from-purple-500 to-pink-500' },
    { number: 3, title: 'Review', icon: CheckCircle, description: 'Final confirmation', color: 'from-emerald-500 to-teal-500' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"
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
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className={`relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Dynamic Gradient Border */}
        <div className="absolute inset-0 rounded-3xl animate-gradient-x" style={{
          background: `linear-gradient(45deg, ${steps[currentStep - 1]?.color || 'from-purple-500 to-pink-500'})`
        }} />
        <div className="absolute inset-[2px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl" />
        
        <div className="relative z-10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative px-8 py-6" style={{
            background: `linear-gradient(135deg, ${steps[currentStep - 1]?.color || 'from-purple-600/90 via-pink-600/90 to-blue-600/90'})`
          }}>
            <div className="absolute inset-0 opacity-80 animate-gradient-x" style={{
              background: `linear-gradient(135deg, ${steps[currentStep - 1]?.color || 'from-purple-600 via-pink-600 to-blue-600'})`
            }} />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                  <PenTool className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Create Assignment</h2>
                  <p className="text-purple-100">Design engaging learning experiences for students</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                  <span className="text-white font-semibold text-sm">Step {currentStep}/3</span>
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
                        ? 'bg-white text-purple-600 shadow-lg scale-110' 
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
                      <div className="text-xs text-purple-100">{step.description}</div>
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

          {/* Form Content with Loading Overlay */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="p-8">
              <div className="min-h-[500px] relative">
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Rocket className="h-16 w-16 text-purple-400 animate-bounce" />
                        <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-xl font-bold mb-2">Creating Assignment...</p>
                        <p className="text-gray-400">Preparing your learning experience</p>
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
                      {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
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
                        <BookOpen className="h-5 w-5 text-blue-400 animate-pulse" />
                        <span className="font-semibold text-blue-200">Assignment Fundamentals</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Let's Create Something Amazing
                      </h3>
                      <p className="text-gray-400 text-lg">Start with the core details of your assignment</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-400" />
                          Assignment Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Career Exploration: My Future in Technology"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50 text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-400" />
                          Assignment Description *
                        </label>
                        <textarea
                          name="description"
                          required
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Provide a clear and engaging description of what students will learn and accomplish..."
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Brain className="h-4 w-4 text-blue-400" />
                          Detailed Instructions
                        </label>
                        <textarea
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleInputChange}
                          rows={6}
                          placeholder="Provide step-by-step instructions, requirements, rubric criteria, and expectations for students..."
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-blue-400/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-400" />
                            Difficulty Level
                          </label>
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                          >
                            <option value="beginner" className="bg-slate-800">Beginner</option>
                            <option value="intermediate" className="bg-slate-800">Intermediate</option>
                            <option value="advanced" className="bg-slate-800">Advanced</option>
                          </select>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            Estimated Hours
                          </label>
                          <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleInputChange}
                            min="1"
                            max="40"
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-400" />
                          Assignment Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400/50"
                        >
                          <option value="general" className="bg-slate-800">General Assignment</option>
                          <option value="career" className="bg-slate-800">Career Exploration</option>
                          <option value="skills" className="bg-slate-800">Skill Development</option>
                          <option value="creative" className="bg-slate-800">Creative Project</option>
                          <option value="research" className="bg-slate-800">Research Assignment</option>
                          <option value="presentation" className="bg-slate-800">Presentation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Configuration */}
                {currentStep === 2 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg mb-4">
                        <Target className="h-5 w-5 text-purple-400 animate-pulse" />
                        <span className="font-semibold text-purple-200">Configuration & Settings</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Perfect Your Assignment
                      </h3>
                      <p className="text-gray-400 text-lg">Configure delivery, deadlines, and submission preferences</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-400" />
                          Target Batch *
                        </label>
                        <select
                          name="batchId"
                          required
                          value={formData.batchId}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        >
                          <option value="" className="bg-slate-800">Select Target Batch</option>
                          {batches.map(batch => (
                            <option key={batch.id} value={batch.id} className="bg-slate-800">{batch.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-400" />
                          Submission Type *
                        </label>
                        <select
                          name="submissionType"
                          required
                          value={formData.submissionType}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        >
                          <option value="text" className="bg-slate-800">Text Submission</option>
                          <option value="file" className="bg-slate-800">File Upload Only</option>
                          <option value="both" className="bg-slate-800">Text + File Upload</option>
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          Due Date *
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          required
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-400" />
                          Due Time *
                        </label>
                        <input
                          type="time"
                          name="dueTime"
                          required
                          value={formData.dueTime}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-purple-400" />
                          Maximum Score
                        </label>
                        <input
                          type="number"
                          name="maxScore"
                          value={formData.maxScore}
                          onChange={handleInputChange}
                          min="1"
                          max="1000"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-400/50"
                        />
                      </div>
                    </div>

                    {/* Enhanced File Upload Area */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4 text-purple-400" />
                        Reference Materials & Resources (Optional)
                      </label>
                      <div 
                        className={`relative border-2 border-dashed border-purple-500/30 rounded-2xl p-8 text-center transition-all duration-300 group-hover:border-purple-400/50 ${
                          isDragging ? 'border-purple-400 bg-purple-500/10 scale-105' : 'hover:bg-white/5'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const files = Array.from(e.dataTransfer.files);
                          setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <Upload className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-bounce" />
                          <p className="text-white font-bold text-xl mb-2">Drag & drop files here</p>
                          <p className="text-gray-400 text-lg mb-4">or click to browse your computer</p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-300 text-sm font-medium">PDF, DOC, PPT, Images & More</span>
                          </div>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      
                      {formData.attachments.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-purple-400" />
                            <span className="text-white font-semibold">Attached Files ({formData.attachments.length})</span>
                          </div>
                          <div className="space-y-3 max-h-40 overflow-y-auto">
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <span className="text-white font-medium block">{file.name}</span>
                                    <span className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Late Submission Toggle */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">Allow Late Submissions</div>
                            <div className="text-gray-400 text-sm">Students can submit after the deadline (with potential penalties)</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="allowLateSubmission"
                            checked={formData.allowLateSubmission}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-16 h-9 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 shadow-lg"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className={`space-y-6 transform transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 shadow-lg mb-4">
                        <CheckCircle className="h-5 w-5 text-emerald-400 animate-pulse" />
                        <span className="font-semibold text-emerald-200">Final Review</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Ready to Launch! 🚀
                      </h3>
                      <p className="text-gray-400 text-lg">Review all details before creating your assignment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
                        <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          Assignment Details
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Title:</span>
                            <p className="text-white font-bold text-lg mt-1">{formData.title || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Description:</span>
                            <p className="text-white text-sm line-clamp-3 mt-1">{formData.description || 'Not specified'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Difficulty:</span>
                              <p className="text-white font-medium capitalize mt-1">{formData.difficulty}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Est. Hours:</span>
                              <p className="text-white font-medium mt-1">{formData.estimatedHours}h</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Category:</span>
                            <p className="text-white font-medium capitalize mt-1">{formData.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Max Score:</span>
                            <p className="text-white font-bold text-lg mt-1">{formData.maxScore} points</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
                        <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          Configuration
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Target Batch:</span>
                            <p className="text-white font-bold mt-1">
                              {formData.batchId ? 
                                batches.find(b => b.id === formData.batchId)?.name || 'Unknown Batch' 
                                : 'Not selected'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Due Date & Time:</span>
                            <p className="text-white font-medium mt-1">
                              {formData.dueDate && formData.dueTime 
                                ? `${new Date(formData.dueDate).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })} at ${formData.dueTime}`
                                : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Submission Type:</span>
                            <p className="text-white font-medium capitalize mt-1">{formData.submissionType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Late Submissions:</span>
                            <p className={`font-bold mt-1 ${formData.allowLateSubmission ? 'text-emerald-400' : 'text-red-400'}`}>
                              {formData.allowLateSubmission ? '✓ Allowed' : '✗ Not Allowed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                        <h4 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <Upload className="h-4 w-4 text-white" />
                          </div>
                          Reference Materials ({formData.attachments.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                              <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-white text-sm font-medium truncate block">{file.name}</span>
                                <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success Preview Card */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-emerald-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 animate-gradient-x"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center animate-pulse">
                            <Rocket className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                              Assignment Ready! 
                            </h4>
                            <p className="text-emerald-300 font-medium">Your learning experience is configured and ready to launch</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-emerald-400 font-bold text-lg">Ready</div>
                            <div className="text-gray-400 text-sm">Status</div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-emerald-400 font-bold text-lg">{formData.estimatedHours}h</div>
                            <div className="text-gray-400 text-xs">Est. Duration</div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-emerald-400 font-bold text-lg">{formData.maxScore}</div>
                            <div className="text-gray-400 text-xs">Max Points</div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-emerald-400 font-bold text-lg">{formData.attachments.length}</div>
                            <div className="text-gray-400 text-xs">Resources</div>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold text-sm">Impact Preview</span>
                          </div>
                          <p className="text-white text-sm">
                            Students will receive instant notifications and can begin working immediately after creation. 
                            This assignment will contribute to their learning journey and skill development in the ITC program.
                          </p>
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

                  {currentStep < 3 ? (
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
                      <span>{isLoading ? 'Creating...' : 'Create Assignment'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
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
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }

        /* Enhanced focus states */
        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
        }

        /* Improved animations */
        .group:hover .animate-bounce {
          animation: bounce 1s infinite;
        }

        /* Loading animation */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AssignmentModal;

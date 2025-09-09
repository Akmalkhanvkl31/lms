import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Users, 
  Sparkles, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Star,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: any) => void;
}

const BatchModal: React.FC<BatchModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    instructor: '',
    capacity: 25,
    grade: ''
  });

  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const batchData = {
      id: Date.now().toString(),
      ...formData,
      students: [],
      createdDate: new Date().toISOString().split('T')[0],
      status: 'planning'
    };

    onSubmit(batchData);
    
    // Reset form with animation
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      instructor: '',
      capacity: 25,
      grade: ''
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Batch Details', icon: BookOpen, description: 'Basic information' },
    { number: 2, title: 'Review & Create', icon: CheckCircle, description: 'Final confirmation' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * -0.015}px`,
            bottom: `${mousePosition.y * -0.015}px`,
            animationDelay: '1s'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className={`relative w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl animate-gradient-x" />
        <div className="absolute inset-[2px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl" />
        
        <div className="relative z-10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90 px-8 py-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-80 animate-gradient-x" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Create New Batch</h2>
                  <p className="text-emerald-100">Build the next generation of learners</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                  <span className="text-white font-semibold text-sm">Step {currentStep}/2</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 group"
                >
                  <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Step Progress */}
            <div className="mt-6 flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-white/10'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.number 
                        ? 'bg-white text-emerald-600 shadow-lg' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{step.title}</div>
                      <div className="text-xs text-emerald-100">{step.description}</div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number 
                        ? 'bg-white' 
                        : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="min-h-[400px]">
              {/* Step 1: Batch Details */}
              {currentStep === 1 && (
                <div className={`space-y-6 transform transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Batch Information
                    </h3>
                    <p className="text-gray-400">Set up the foundation for your new learning cohort</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-emerald-400" />
                        Batch Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Career Explorers - Grade 7"
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-emerald-400" />
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Brief description of the batch objectives and curriculum..."
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-emerald-400/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          required
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          required
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-emerald-400" />
                          Instructor *
                        </label>
                        <input
                          type="text"
                          name="instructor"
                          required
                          value={formData.instructor}
                          onChange={handleInputChange}
                          placeholder="Lead instructor name"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-emerald-400" />
                          Grade Level *
                        </label>
                        <select
                          name="grade"
                          required
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        >
                          <option value="" className="bg-slate-800">Select Grade Level</option>
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
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-400" />
                        Batch Capacity
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          min="1"
                          max="50"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          students max
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {currentStep === 2 && (
                <div className={`space-y-6 transform transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Review & Confirm
                    </h3>
                    <p className="text-gray-400">Verify all details before creating your batch</p>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-emerald-400" />
                          Batch Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm">Batch Name:</span>
                            <p className="text-white font-medium text-lg">{formData.name || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Description:</span>
                            <p className="text-white text-sm">{formData.description || 'No description provided'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Grade Level:</span>
                            <p className="text-white font-medium">{formData.grade || 'Not selected'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                          <Target className="h-5 w-5 text-emerald-400" />
                          Configuration
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-400 text-sm">Duration:</span>
                            <p className="text-white font-medium">
                              {formData.startDate && formData.endDate 
                                ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
                                : 'Dates not set'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Instructor:</span>
                            <p className="text-white font-medium">{formData.instructor || 'Not assigned'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Capacity:</span>
                            <p className="text-white font-medium">{formData.capacity} students maximum</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Success Preview */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-emerald-400" />
                        <span className="text-emerald-400 font-bold text-lg">Ready to Launch!</span>
                      </div>
                      <p className="text-white font-medium mb-2">Your batch is configured and ready to go.</p>
                      <p className="text-gray-400 text-sm">Students can be enrolled immediately after creation.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  currentStep === 1 
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-white/20 transform hover:scale-105'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Cancel
                </button>

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="group bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <Zap className="h-5 w-5 group-hover:animate-bounce" />
                    <span>Create Batch</span>
                  </button>
                )}
              </div>
            </div>
          </div>
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

export default BatchModal;
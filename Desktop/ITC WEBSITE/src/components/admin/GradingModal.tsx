import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Save, User, Calendar, FileText, Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Submission, Grade } from '../../types';
import { supabase } from '../../supabaseClient';

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onGrade: (gradeData: Grade) => void;
}

const GradingModal: React.FC<GradingModalProps> = ({ isOpen, onClose, submission, onGrade }) => {
  const [gradeData, setGradeData] = useState<Omit<Grade, 'submissionId' | 'gradedDate' | 'gradedBy'>>({
    score: 0,
    feedback: '',
    rubricScores: {
      content: 0,
      creativity: 0,
      presentation: 0,
      timeliness: 0
    },
    privateNotes: '',
    encouragement: ''
  });

  const [activeTab, setActiveTab] = useState('submission');
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (submission) {
      // Reset form when a new submission is loaded
      setGradeData({
        score: submission.score || 0,
        feedback: submission.feedback || '',
        rubricScores: { content: 0, creativity: 0, presentation: 0, timeliness: 0 }, // Reset or load existing rubric
        privateNotes: '',
        encouragement: ''
      });
    }
  }, [submission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    const finalGrade: Grade = {
      ...gradeData,
      submissionId: submission.id,
      gradedDate: new Date().toISOString(),
      gradedBy: currentUser?.email || 'Admin',
    };

    onGrade(finalGrade);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGradeData(prev => ({
      ...prev,
      [name]: name === 'score' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleRubricChange = (category: keyof Grade['rubricScores'], value: string) => {
    setGradeData(prev => ({
      ...prev,
      rubricScores: {
        ...prev.rubricScores,
        [category]: parseInt(value, 10) || 0
      }
    }));
  };

  if (!isOpen || !submission) return null;

  const rubricCategories = [
    { 
      key: 'content', 
      label: 'Content Quality', 
      description: 'Accuracy, depth, and relevance of content',
      maxPoints: 40
    },
    { 
      key: 'creativity', 
      label: 'Creativity & Innovation', 
      description: 'Original thinking and creative solutions',
      maxPoints: 20
    },
    { 
      key: 'presentation', 
      label: 'Presentation & Organization', 
      description: 'Structure, clarity, and professional presentation',
      maxPoints: 30
    },
    { 
      key: 'timeliness', 
      label: 'Timeliness', 
      description: 'Submitted on time and met deadlines',
      maxPoints: 10
    }
  ];

  const calculateTotalScore = () => {
    return Object.values(gradeData.rubricScores).reduce((sum, score) => sum + score, 0);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'submission', label: 'Student Submission', icon: FileText },
    { id: 'grading', label: 'Grade & Feedback', icon: Star },
    { id: 'rubric', label: 'Detailed Rubric', icon: Award }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Grade Assignment</h2>
                <p className="text-sm text-gray-600">Review and evaluate student submission</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Student Info Bar */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{submission.studentName}</h3>
                  <p className="text-sm text-gray-600">{submission.assignmentTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className={`font-medium ${
                    submission.isLate ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {submission.isLate ? 'Late Submission' : 'On Time'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Max: {submission.maxScore} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Submission Tab */}
            {activeTab === 'submission' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Submission</h3>
                  <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {submission.content || 'No text content provided.'}
                      </p>
                    </div>
                  </div>
                </div>

                {submission.attachments && submission.attachments.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Attachments</h4>
                    <div className="space-y-2">
                      {submission.attachments.map((file, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600">{file.size || 'Unknown size'}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-900 mb-3">Quick Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h5 className="font-medium text-gray-900">Strengths</h5>
                      <p className="text-sm text-gray-600 mt-1">Well-structured content with clear examples</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h5 className="font-medium text-gray-900">Areas for Improvement</h5>
                      <p className="text-sm text-gray-600 mt-1">Could benefit from more detailed analysis</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <h5 className="font-medium text-gray-900">Overall Quality</h5>
                      <p className="text-sm text-gray-600 mt-1">Meets expectations with room for growth</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grading Tab */}
            {activeTab === 'grading' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Scoring */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="score"
                          required
                          min="0"
                          max={submission.maxScore}
                          value={gradeData.score || ''}
                          onChange={handleInputChange}
                          placeholder="Enter score"
                          className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="text-2xl font-bold text-gray-400">
                        / {submission.maxScore}
                      </div>
                    </div>
                    
                    {gradeData.score > 0 && (
                      <div className="mt-4 text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(gradeData.score, submission.maxScore)}`}>
                          {Math.round((gradeData.score / submission.maxScore) * 100)}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              Math.round((gradeData.score / submission.maxScore) * 100) >= 85 
                                ? 'bg-green-500' 
                                : Math.round((gradeData.score / submission.maxScore) * 100) >= 70 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min((gradeData.score / submission.maxScore) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Quick Rubric</h4>
                    <div className="space-y-3">
                      {(Object.keys(gradeData.rubricScores) as Array<keyof typeof gradeData.rubricScores>).map((category) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800 capitalize">{category}</span>
                          <select
                            value={gradeData.rubricScores[category] || ''}
                            onChange={(e) => handleRubricChange(category, e.target.value)}
                            className="px-3 py-1 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">-</option>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Satisfactory</option>
                            <option value="2">2 - Needs Improvement</option>
                            <option value="1">1 - Poor</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Feedback */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <MessageSquare className="inline w-4 h-4 mr-1" />
                      Student Feedback *
                    </label>
                    <textarea
                      name="feedback"
                      required
                      value={gradeData.feedback}
                      onChange={handleInputChange}
                      rows={8}
                      placeholder="Provide constructive feedback to help the student improve..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Be specific and constructive. Focus on what was done well and areas for improvement.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Encouragement & Next Steps
                    </label>
                    <textarea
                      name="encouragement"
                      value={gradeData.encouragement}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Add motivational comments and suggestions for next steps..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Private Notes (Not visible to student)
                    </label>
                    <textarea
                      name="privateNotes"
                      value={gradeData.privateNotes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Add internal notes for reference..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rubric Tab */}
            {activeTab === 'rubric' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Rubric Assessment</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Rubric Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {calculateTotalScore()}/{rubricCategories.reduce((sum, cat) => sum + cat.maxPoints, 0)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {rubricCategories.map((category) => (
                    <div key={category.key} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{category.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm text-gray-600">Max Points</div>
                          <div className="text-lg font-bold text-gray-900">{category.maxPoints}</div>
                        </div>
                      </div>

                        <div className="grid grid-cols-5 gap-2">
                        {[5, 4, 3, 2, 1].map((scoreValue) => (
                          <button
                            key={scoreValue}
                            type="button"
                            onClick={() => handleRubricChange(category.key as keyof Grade['rubricScores'], scoreValue.toString())}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              gradeData.rubricScores[category.key as keyof typeof gradeData.rubricScores] === scoreValue
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-bold text-lg">{scoreValue}</div>
                            <div className="text-xs text-gray-600">
                              {scoreValue === 5 && 'Excellent'}
                              {scoreValue === 4 && 'Good'}
                              {scoreValue === 3 && 'Satisfactory'}
                              {scoreValue === 2 && 'Needs Work'}
                              {scoreValue === 1 && 'Poor'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Rubric Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {rubricCategories.map((category) => {
                      const score = gradeData.rubricScores[category.key as keyof typeof gradeData.rubricScores] || 0;
                      const percentage = (score / 5) * 100;
                      return (
                        <div key={category.key} className="bg-white rounded-.lg p-3 text-center">
                          <div className="font-medium text-gray-900">{category.label}</div>
                          <div className={`text-2xl font-bold ${getScoreColor(score, 5)}`}>
                            {score}/5
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${
                                percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Submit Grade
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default GradingModal;

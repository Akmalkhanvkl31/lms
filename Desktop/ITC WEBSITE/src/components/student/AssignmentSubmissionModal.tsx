import React, { useState } from 'react';
import { X, Upload, Send, FileText } from 'lucide-react';

interface AssignmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onSubmit: (submissionData: any) => void;
}

const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({ 
  isOpen, 
  onClose, 
  assignment, 
  onSubmit 
}) => {
  const [submissionData, setSubmissionData] = useState({
    content: '',
    attachments: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission = {
      id: Date.now().toString(),
      assignmentId: assignment.id,
      studentId: 'current-student-id', // In real app, get from auth context
      content: submissionData.content,
      attachments: submissionData.attachments.map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      })),
      submittedDate: new Date().toISOString(),
      isLate: new Date() > new Date(`${assignment.dueDate}T${assignment.dueTime}`),
      status: 'submitted'
    };

    onSubmit(submission);
    setSubmissionData({ content: '', attachments: [] });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSubmissionData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const removeFile = (index: number) => {
    setSubmissionData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen || !assignment) return null;

  const isLate = new Date() > new Date(`${assignment.dueDate}T${assignment.dueTime}`);
  const canSubmitText = assignment.submissionType === 'text' || assignment.submissionType === 'both';
  const canSubmitFiles = assignment.submissionType === 'file' || assignment.submissionType === 'both';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Submit Assignment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Assignment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{assignment.title}</h3>
            <p className="text-gray-600 mb-3">{assignment.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Due: {new Date(`${assignment.dueDate}T${assignment.dueTime}`).toLocaleString()}</span>
              <span>Max Score: {assignment.maxScore}</span>
              {isLate && (
                <span className="text-red-600 font-medium">⚠️ Late Submission</span>
              )}
            </div>
            {assignment.instructions && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.instructions}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {canSubmitText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response {assignment.submissionType === 'text' && '*'}
                </label>
                <textarea
                  value={submissionData.content}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
                  required={assignment.submissionType === 'text'}
                  rows={8}
                  placeholder="Write your response here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {canSubmitFiles && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Attachments {assignment.submissionType === 'file' && '*'}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  required={assignment.submissionType === 'file' && submissionData.attachments.length === 0}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, PPT, JPG, PNG, TXT
                </p>

                {submissionData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {submissionData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">
                          📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isLate && assignment.allowLateSubmission && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ This is a late submission. Late submissions may receive a penalty as per the course policy.
                </p>
              </div>
            )}

            {isLate && !assignment.allowLateSubmission && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  ❌ Late submissions are not allowed for this assignment. Please contact your instructor.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLate && !assignment.allowLateSubmission}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionModal;
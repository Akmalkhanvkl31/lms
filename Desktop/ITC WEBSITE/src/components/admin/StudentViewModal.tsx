import React from 'react';
import { Student } from '../../types';
import { X, User, Mail, GraduationCap, School, Users, Phone, CheckCircle, Clock } from 'lucide-react';

interface StudentViewModalProps {
  student: Student;
  onClose: () => void;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center">
      <Icon className="h-5 w-5 text-purple-300" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);

const StudentViewModal: React.FC<StudentViewModalProps> = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-white/20">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {student.fullName}
                </h2>
                <p className="text-gray-400">{student.studentId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-full transition-colors duration-300"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 mb-4">Personal Details</h3>
              <DetailItem icon={Mail} label="Email" value={student.email} />
              <DetailItem icon={GraduationCap} label="Grade" value={student.grade} />
              <DetailItem icon={School} label="School" value={student.school} />
            </div>
            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 mb-4">Parent/Guardian</h3>
              <DetailItem icon={Users} label="Name" value={student.parentName} />
              <DetailItem icon={Phone} label="Contact" value={student.parentContact} />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {student.approved ? (
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              ) : (
                <Clock className="h-6 w-6 text-yellow-400" />
              )}
              <p className={`text-lg font-bold ${student.approved ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {student.approved ? 'Approved' : 'Pending Approval'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;

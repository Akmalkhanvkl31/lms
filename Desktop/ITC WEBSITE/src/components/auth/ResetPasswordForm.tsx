import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const success = await updateUser({ password });

    if (success) {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError('Failed to update password. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-500/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4">Reset Password</h1>
          <p className="text-gray-300 text-lg">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your new password"
              />
            </div>
          </div>

          {message && (
            <div className="flex items-center gap-3 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="text-green-300">{message}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 rounded-xl border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden min-w-[200px] justify-center"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Update Password</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

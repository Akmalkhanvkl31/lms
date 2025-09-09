import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './components/home/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import UpdateUserForm from './components/auth/UpdateUserForm';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRegistrationForm from './components/auth/AdminRegistrationForm';
import Courses from './components/Courses';
import About from './components/About';
import Contact from './components/Contact';
import Students from './components/admin/Students';
import Batches from './components/admin/Batches';
import Assignments from './components/admin/Assignments';
import Materials from './components/admin/Materials';
import Videos from './components/admin/Videos';
import Attendance from './components/admin/Attendance';
import Settings from './components/admin/Settings';
import StudentVideos from './components/student/Videos';
import StudentSessions from './components/student/Sessions';
import StudentAssignments from './components/student/Assignments';
import StudentQuizzes from './components/student/Quizzes';
import StudentGallery from './components/student/Gallery';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/courses" element={<Layout><Courses /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route path="register-admin" element={<AdminRegistrationForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="update-password" element={<ResetPasswordForm />} />
        <Route path="update-user" element={<UpdateUserForm />} />
        <Route
          path="student"
          element={
            <ProtectedRoute role="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute role="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="student/videos" element={<ProtectedRoute role="student"><Layout><StudentVideos /></Layout></ProtectedRoute>} />
        <Route path="student/sessions" element={<ProtectedRoute role="student"><Layout><StudentSessions /></Layout></ProtectedRoute>} />
        <Route path="student/assignments" element={<ProtectedRoute role="student"><Layout><StudentAssignments /></Layout></ProtectedRoute>} />
        <Route path="student/quizzes" element={<ProtectedRoute role="student"><Layout><StudentQuizzes /></Layout></ProtectedRoute>} />
        <Route path="student/gallery" element={<ProtectedRoute role="student"><Layout><StudentGallery /></Layout></ProtectedRoute>} />
        <Route
          path="admin"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="admin/students" element={<ProtectedRoute role="admin"><Layout><Students /></Layout></ProtectedRoute>} />
        <Route path="admin/batches" element={<ProtectedRoute role="admin"><Layout><Batches /></Layout></ProtectedRoute>} />
        <Route path="admin/assignments" element={<ProtectedRoute role="admin"><Layout><Assignments /></Layout></ProtectedRoute>} />
        <Route path="admin/materials" element={<ProtectedRoute role="admin"><Layout><Materials /></Layout></ProtectedRoute>} />
        <Route path="admin/videos" element={<ProtectedRoute role="admin"><Layout><Videos /></Layout></ProtectedRoute>} />
        <Route path="admin/attendance" element={<ProtectedRoute role="admin"><Layout><Attendance /></Layout></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute role="admin"><Layout><Settings /></Layout></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

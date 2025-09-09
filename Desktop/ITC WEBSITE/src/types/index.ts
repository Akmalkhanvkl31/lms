export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'parent';
  fullName?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentRegistrationData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  schoolName: string;
  grade: string;
  schoolAddress: string;
  parentName: string;
  relationship: string;
  contactNumber: string;
  email: string;
  password: string;
  address: string;
  preferredLanguage: string;
  hobbies: string;
  specialNeeds: string;
  agreeToTerms: boolean;
  photo?: File;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  course_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  name: string;
  batch_id: string;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Parent {
  id: string;
  user_id: string;
  name: string;
  student_id: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  submitted_at: string;
  grade: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  playlist_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_option: number;
  created_at: string;
  updated_at: string;
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  student_id: string;
  answers: number[];
  score: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Demo {
  id: string;
  name: string;
  email: string;
  phone: string;
  course_id: string;
  requested_at: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface AimriInfo {
  id: string;
  about_us: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

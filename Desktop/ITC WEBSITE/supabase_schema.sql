-- Enhanced Users Table
-- This table will store user information and is linked to Supabase's auth.users table.
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins Table
-- Stores admin-specific information.
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES users(id),
    position TEXT,
    department TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batches Table
-- Stores information about different batches of students.
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    grade_level TEXT,
    capacity INTEGER DEFAULT 25,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students Table
-- Stores student-specific information.
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id),
    student_id TEXT UNIQUE,
    batch_id INTEGER REFERENCES batches(id),
    date_of_birth DATE,
    gender TEXT,
    school_name TEXT,
    grade TEXT,
    school_address TEXT,
    address TEXT,
    preferred_language TEXT DEFAULT 'English',
    hobbies TEXT,
    special_needs TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'graduated')),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parents Table
-- Stores parent/guardian information for each student.
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    full_name TEXT NOT NULL,
    relationship TEXT DEFAULT 'Parent',
    contact_number TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlists Table
-- Stores playlists of videos.
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    batch_id INTEGER REFERENCES batches(id),
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos Table
-- Stores video information and links them to playlists.
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    platform TEXT CHECK (platform IN ('youtube', 'vimeo', 'other')),
    video_id TEXT,
    vimeo_embed_url TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    instructor TEXT,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials Table
-- Stores study materials.
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id),
    batch_id INTEGER REFERENCES batches(id),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    created_by UUID REFERENCES users(id),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments Table
-- Stores assignment details for each batch.
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id),
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMPTZ,
    max_score INTEGER DEFAULT 100,
    submission_type TEXT DEFAULT 'text' CHECK (submission_type IN ('text', 'file', 'both')),
    allow_late_submission BOOLEAN DEFAULT false,
    attachments JSONB,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions Table
-- Stores student submissions for assignments.
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id),
    student_id UUID REFERENCES students(id),
    content TEXT,
    submission_url TEXT,
    attachments JSONB,
    submission_type TEXT CHECK (submission_type IN ('text', 'file', 'both')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,
    score INTEGER,
    feedback TEXT,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES users(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes Table
-- Stores quiz information.
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id),
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit_minutes INTEGER,
    total_questions INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    is_published BOOLEAN DEFAULT false,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Questions Table
-- Stores questions for each quiz.
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id),
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
    options JSONB, -- e.g., [{"option": "A", "text": "Answer A"}, {"option": "B", "text": "Answer B"}]
    correct_answer TEXT,
    points INTEGER DEFAULT 1,
    explanation TEXT,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Submissions Table
-- Stores student submissions for quizzes.
CREATE TABLE quiz_submissions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id),
    student_id UUID REFERENCES students(id),
    answers JSONB,
    score INTEGER,
    total_possible INTEGER,
    time_taken_minutes INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses Table
-- Stores course information, which can include videos and live sessions.
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    thumbnail_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('live', 'video', 'hybrid')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER,
    is_featured BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Enrollments Table
-- Tracks which students are enrolled in which courses.
CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    student_id UUID REFERENCES students(id),
    enrollment_status TEXT DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'dropped', 'suspended')),
    progress_percentage INTEGER DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(course_id, student_id)
);

-- Gallery Images Table
-- Stores images for the gallery.
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT,
    is_featured BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demos Table
-- Stores information about demo videos.
CREATE TABLE demos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AIMRI Info Table
-- Stores information about AIMRI.
CREATE TABLE aimri_info (
    id SERIAL PRIMARY KEY,
    about_text TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    training_hours_delivered INTEGER DEFAULT 0,
    successful_batches INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    achievement_highlights JSONB,
    contact_info JSONB,
    social_links JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Table
-- Stores attendance records for students in each batch.
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    batch_id INTEGER REFERENCES batches(id),
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
    notes TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, batch_id, date)
);

-- Notifications Table
-- Stores system notifications for users.
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Progress Table
-- Tracks detailed progress metrics for students.
CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    batch_id INTEGER REFERENCES batches(id),
    total_assignments INTEGER DEFAULT 0,
    completed_assignments INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    completed_quizzes INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
    learning_streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    achievements JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, batch_id)
);

-- Events Table
-- Stores information about events, workshops, and sessions.
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('workshop', 'seminar', 'conference', 'session', 'festival')),
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    meeting_link TEXT,
    capacity INTEGER,
    registration_required BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Registrations Table
-- Tracks event registrations.
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id UUID REFERENCES users(id),
    registration_status TEXT DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'cancelled', 'no_show')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

-- User and authentication indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Student indexes
CREATE INDEX idx_students_batch_id ON students(batch_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_enrollment_date ON students(enrollment_date);

-- Batch indexes
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_start_date ON batches(start_date);
CREATE INDEX idx_batches_grade_level ON batches(grade_level);

-- Assignment and submission indexes
CREATE INDEX idx_assignments_batch_id ON assignments(batch_id);
CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Quiz indexes
CREATE INDEX idx_quizzes_batch_id ON quizzes(batch_id);
CREATE INDEX idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX idx_quiz_submissions_student_id ON quiz_submissions(student_id);

-- Attendance indexes
CREATE INDEX idx_attendance_student_batch_date ON attendance(student_id, batch_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Video and material indexes
CREATE INDEX idx_videos_playlist_id ON videos(playlist_id);
CREATE INDEX idx_materials_batch_id ON materials(batch_id);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Progress tracking indexes
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_batch_id ON student_progress(batch_id);

-- =================================================================
-- FUNCTIONS AND TRIGGERS
-- =================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate student progress
CREATE OR REPLACE FUNCTION calculate_student_progress(student_uuid UUID, batch_int INTEGER)
RETURNS TABLE(
    assignments_completed INTEGER,
    assignments_total INTEGER,
    quizzes_completed INTEGER,
    quizzes_total INTEGER,
    avg_score DECIMAL,
    attendance_pct DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(
            (SELECT COUNT(*) FROM submissions s 
             JOIN assignments a ON s.assignment_id = a.id 
             WHERE s.student_id = student_uuid AND a.batch_id = batch_int AND s.status = 'submitted'),
            0
        )::INTEGER as assignments_completed,
        
        COALESCE(
            (SELECT COUNT(*) FROM assignments a 
             WHERE a.batch_id = batch_int AND a.is_published = true),
            0
        )::INTEGER as assignments_total,
        
        COALESCE(
            (SELECT COUNT(*) FROM quiz_submissions qs 
             JOIN quizzes q ON qs.quiz_id = q.id 
             WHERE qs.student_id = student_uuid AND q.batch_id = batch_int AND qs.is_completed = true),
            0
        )::INTEGER as quizzes_completed,
        
        COALESCE(
            (SELECT COUNT(*) FROM quizzes q 
             WHERE q.batch_id = batch_int AND q.is_published = true),
            0
        )::INTEGER as quizzes_total,
        
        COALESCE(
            (SELECT AVG(s.score) FROM submissions s 
             JOIN assignments a ON s.assignment_id = a.id 
             WHERE s.student_id = student_uuid AND a.batch_id = batch_int AND s.score IS NOT NULL),
            0
        )::DECIMAL as avg_score,
        
        COALESCE(
            (SELECT 
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE (COUNT(*) FILTER (WHERE status = 'present') * 100.0 / COUNT(*))
                END
             FROM attendance att 
             WHERE att.student_id = student_uuid AND att.batch_id = batch_int),
            0
        )::DECIMAL as attendance_pct;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for admins table
CREATE POLICY "Admins can view their own profile" ON admins FOR SELECT USING (auth.uid() = id);

-- Policies for students table
CREATE POLICY "Students can view their own data" ON students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all students" ON students FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update student data" ON students FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete students" ON students FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies for submissions table
CREATE POLICY "Students can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create their own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can view all submissions" ON submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- =================================================================
-- SAMPLE DATA INSERTION
-- =================================================================

-- Insert sample batch data
INSERT INTO batches (name, description, instructor, grade_level, start_date, end_date, status) VALUES
('Career Explorers - Grade 7', 'Introduction to various career paths and skill development for Grade 7 students', 'Ms. Sarah Johnson', 'Grade 7', '2024-02-01', '2024-06-30', 'active'),
('Innovation Champions - Grade 8', 'Creative thinking and innovation workshops for Grade 8 students', 'Dr. Michael Chen', 'Grade 8', '2024-02-15', '2024-07-15', 'active'),
('Future Leaders - Grade 9', 'Leadership development and career planning for Grade 9 students', 'Prof. Emily Davis', 'Grade 9', '2024-03-01', '2024-08-01', 'planning');

-- Insert sample AIMRI info
INSERT INTO aimri_info (
    about_text, 
    mission_statement, 
    vision_statement,
    training_hours_delivered, 
    successful_batches, 
    total_students,
    achievement_highlights,
    contact_info,
    social_links
) VALUES (
    'The Aries International Maritime Research Institute (AIMRI) is a trailblazing educational organization dedicated to transforming industrial education by bridging the gap between academic learning and real-world expertise.',
    'To create a holistic and immersive learning environment that seamlessly integrates academic knowledge with industry practices, promoting continuous skill development, innovation, and efficiency.',
    'To become the premier destination for professional industry training—The Oxford of Industrial Education.',
    25000,
    100,
    2500,
    '{"achievements": ["100+ successful batches", "2500+ young professionals trained", "25,000+ hours of training content", "99.9% system uptime"]}',
    '{"email": "info@aimri.org", "phone": "+91-XXX-XXX-XXXX", "address": "AIMRI Campus, Education City"}',
    '{"website": "https://aimri.org", "linkedin": "https://linkedin.com/company/aimri", "youtube": "https://youtube.com/@aimri"}'
);

-- =================================================================
-- ADMIN USER CREATION TEMPLATE
-- =================================================================
-- Note: This section provides the template for creating admin users
-- Replace the placeholder values with actual data when setting up

/*
-- Step 1: Create the user in Supabase Auth (via dashboard or API)
-- Step 2: Get the user ID from auth.users table
-- Step 3: Run these commands with the actual UUID

INSERT INTO users (id, full_name, role)
VALUES ('your-admin-user-uuid-here', 'Admin Full Name', 'admin');

INSERT INTO admins (id, position, department, phone_number)
VALUES ('your-admin-user-uuid-here', 'Chief Administrator', 'Education Technology', '+91-XXX-XXX-XXXX');
*/

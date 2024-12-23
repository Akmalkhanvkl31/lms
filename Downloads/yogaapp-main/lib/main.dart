import 'package:flutter/material.dart';
import 'presentation/pages/auth/login_page.dart';
import 'presentation/pages/auth/signup_page.dart'; // Added import for SignupPage
import 'presentation/pages/auth/forgot_password_page.dart';
import 'presentation/pages/main/main_container.dart';
import 'presentation/pages/schedule/schedule_meeting_page.dart';
import 'presentation/pages/home/home_page.dart';
import 'presentation/pages/profile/profile_page.dart';
import 'presentation/pages/classes/classes_page.dart'; // Added import for ClassesPage
import 'presentation/pages/progress/progress_page.dart'; // Added import for ProgressPage

void main() {
  runApp(
    MaterialApp(
      theme: ThemeData(
        primaryColor: const Color(0xFF6B4EFF), // Purple theme color
        scaffoldBackgroundColor: const Color(0xFF000000), // Premium black background
        colorScheme: ColorScheme.dark(
          primary: const Color(0xFF6B4EFF),
          surface: const Color(0xFF000000),
        ),
      ),
      home: LoginPage(),
      routes: {
        '/schedule': (context) => ScheduleMeetingPage(), // Navigate to ScheduleMeetingPage
        '/profile': (context) => MainContainer(initialIndex: 3), // Navigate to ProfilePage
        '/signup': (context) => SignupPage(), // Added route for SignupPage
        '/forgot-password': (context) => ForgotPasswordPage(),
        '/classes': (context) => ClassesPage(), // Navigate to ClassesPage
        '/progress': (context) => ProgressPage(), // Navigate to ProgressPage
      },
    ),
  );
}

// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:sanskar_yoga/presentation/pages/auth/login_page.dart';

void main() {
  testWidgets('Login page test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const LoginPage());

    // Verify that the email field is present.
    expect(find.byKey(const Key('email_field')), findsOneWidget);

    // Verify that the password field is present.
    expect(find.byKey(const Key('password_field')), findsOneWidget);

    // Verify that the "Remember me" checkbox is present.
    expect(find.byKey(const Key('remember_me_checkbox')), findsOneWidget);

    // Verify that the "Forgot Password?" button is present.
    expect(find.byKey(const Key('forgot_password_button')), findsOneWidget);

    // Verify that the "Login" button is present.
    expect(find.byKey(const Key('login_button')), findsOneWidget);

    // Verify that the "Sign Up" link is present.
    expect(find.byKey(const Key('sign_up_link')), findsOneWidget);
  });
}

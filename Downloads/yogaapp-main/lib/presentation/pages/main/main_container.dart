import 'package:flutter/material.dart';
import '../../widgets/bottom_navigation.dart';
import '../home/home_page.dart';
import '../classes/classes_page.dart';
import '../chat/chat_page.dart';
import '../profile/profile_page.dart';
import '../progress/progress_page.dart';

class MainContainer extends StatefulWidget {
  final int initialIndex;
  const MainContainer({Key? key, this.initialIndex = 0}) : super(key: key);

  @override
  _MainContainerState createState() => _MainContainerState();
}

class _MainContainerState extends State<MainContainer> {
  late int _currentIndex;
  bool _isLoading = false;
  final List<Widget> _pages = [
    HomePage(),
    ClassesPage(),
    ChatPage(),
    ProgressPage(),
    ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        isLoading: _isLoading,
      ),
    );
  }
}

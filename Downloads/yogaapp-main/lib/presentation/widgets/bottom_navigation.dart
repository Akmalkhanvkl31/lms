import 'package:flutter/material.dart';
import 'package:sanskar_yoga/presentation/pages/profile/profile_page.dart';

class AppBottomNavigation extends StatefulWidget {
  final int currentIndex;
  final Function(int) onTap;
  final bool isLoading;

  const AppBottomNavigation({
    Key? key,
    required this.currentIndex,
    required this.onTap,
    required this.isLoading,
  }) : super(key: key);

  @override
  _AppBottomNavigationState createState() => _AppBottomNavigationState();
}

class _AppBottomNavigationState extends State<AppBottomNavigation> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        border: Border(
          top: BorderSide(
            color: Colors.white12,
            width: 0.5,
          ),
        ),
      ),
      child: widget.isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: Colors.amber[800],
              ),
            )
          : BottomNavigationBar(
              currentIndex: widget.currentIndex,
              onTap: widget.onTap,
              backgroundColor: Colors.transparent,
              elevation: 0,
              type: BottomNavigationBarType.fixed,
              selectedItemColor: Color(0xFF6B4EFF),
              unselectedItemColor: Colors.white70,
              items: [
                BottomNavigationBarItem(
                  icon: Icon(Icons.home),
                  label: 'Home',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.play_circle_outline),
                  label: 'Classes',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.people_outline),
                  label: 'Community',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.insights_outlined),
                  label: 'Progress',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.person_outline),
                  label: 'Profile',
                ),
              ],
            ),
    );
  }
}

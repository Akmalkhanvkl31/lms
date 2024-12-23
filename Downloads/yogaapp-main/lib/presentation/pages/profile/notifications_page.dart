import 'package:flutter/material.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({Key? key}) : super(key: key);

  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool classReminders = true;
  bool newContent = true;
  bool communityUpdates = false;
  bool achievements = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text('Notifications'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          _buildSwitchTile(
            'Class Reminders',
            'Get notified before your scheduled classes',
            classReminders,
            (value) => setState(() => classReminders = value),
          ),
          _buildSwitchTile(
            'New Content',
            'Be the first to know about new classes and programs',
            newContent,
            (value) => setState(() => newContent = value),
          ),
          _buildSwitchTile(
            'Community Updates',
            'Stay updated with community activities',
            communityUpdates,
            (value) => setState(() => communityUpdates = value),
          ),
          _buildSwitchTile(
            'Achievements',
            'Get notified when you earn new achievements',
            achievements,
            (value) => setState(() => achievements = value),
          ),
        ],
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    bool value,
    Function(bool) onChanged,
  ) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(12),
      ),
      child: SwitchListTile(
        title: Text(
          title,
          style: TextStyle(color: Colors.white),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.white70),
        ),
        value: value,
        onChanged: onChanged,
        activeColor: Theme.of(context).primaryColor,
      ),
    );
  }
}

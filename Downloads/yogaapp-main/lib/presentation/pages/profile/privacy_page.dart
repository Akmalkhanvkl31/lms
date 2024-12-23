import 'package:flutter/material.dart';

class PrivacyPage extends StatelessWidget {
  const PrivacyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text('Privacy'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          _buildSection(
            'Profile Visibility',
            'Control who can see your profile information',
            Icons.visibility_outlined,
            onTap: () {},
          ),
          _buildSection(
            'Data Usage',
            'Manage how your data is collected and used',
            Icons.data_usage_outlined,
            onTap: () {},
          ),
          _buildSection(
            'Connected Accounts',
            'Manage connected social media accounts',
            Icons.link_outlined,
            onTap: () {},
          ),
          _buildSection(
            'Privacy Policy',
            'Read our privacy policy',
            Icons.policy_outlined,
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildSection(
    String title,
    String subtitle,
    IconData icon, {
    required VoidCallback onTap,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(title, style: TextStyle(color: Colors.white)),
        subtitle: Text(subtitle, style: TextStyle(color: Colors.white70)),
        trailing: Icon(Icons.chevron_right, color: Colors.white70),
        onTap: onTap,
      ),
    );
  }
}

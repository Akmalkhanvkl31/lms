import 'package:flutter/material.dart';

class ActivityData {
  final int date;
  final int minutes;
  final int calories;
  final int sessions;

  ActivityData({
    required this.date,
    required this.minutes,
    required this.calories,
    required this.sessions,
  });
}

class Achievement {
  final String title;
  final String description;
  final IconData icon;
  final bool isUnlocked;
  final double progress;

  Achievement({
    required this.title,
    required this.description,
    required this.icon,
    required this.isUnlocked,
    required this.progress,
  });
}

class ProgressPage extends StatefulWidget {
  const ProgressPage({Key? key}) : super(key: key);

  @override
  _ProgressPageState createState() => _ProgressPageState();
}

class _ProgressPageState extends State<ProgressPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedPeriod = 'Week';

  final List<String> _periods = ['Week', 'Month', 'Year'];

final List<ActivityData> _weeklyData = [
  ActivityData(date: 1, minutes: 45, calories: 150, sessions: 2),
  ActivityData(date: 2, minutes: 30, calories: 100, sessions: 1),
  ActivityData(date: 3, minutes: 60, calories: 200, sessions: 2),
  ActivityData(date: 4, minutes: 45, calories: 150, sessions: 1),
  ActivityData(date: 5, minutes: 30, calories: 100, sessions: 1),
  ActivityData(date: 6, minutes: 90, calories: 300, sessions: 3),
  ActivityData(date: 7, minutes: 60, calories: 200, sessions: 2),
];

  final List<Achievement> _achievements = [
    Achievement(
      title: 'Early Bird',
      description: 'Complete 5 morning sessions',
      icon: Icons.wb_sunny,
      isUnlocked: true,
      progress: 1.0,
    ),
    Achievement(
      title: 'Consistency Master',
      description: 'Practice for 7 days in a row',
      icon: Icons.calendar_today,
      isUnlocked: false,
      progress: 0.7,
    ),
    Achievement(
      title: 'Zen Master',
      description: 'Complete 10 meditation sessions',
      icon: Icons.self_improvement,
      isUnlocked: false,
      progress: 0.4,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Progress',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Theme.of(context).primaryColor,
          tabs: [
            Tab(text: 'Activity'),
            Tab(text: 'Achievements'),
            Tab(text: 'Stats'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildActivityTab(),
          _buildAchievementsTab(),
          _buildStatsTab(),
        ],
      ),
    );
  }

  Widget _buildActivityTab() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildPeriodSelector(),
          SizedBox(height: 24),
          SizedBox(height: 24),
          _buildActivityStats(),
        ],
      ),
    );
  }

  Widget _buildPeriodSelector() {
    return Container(
      padding: EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: _periods.map((period) {
          final isSelected = period == _selectedPeriod;
          return GestureDetector(
            onTap: () => setState(() => _selectedPeriod = period),
            child: Container(
              padding: EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              decoration: BoxDecoration(
                color: isSelected
                    ? Theme.of(context).primaryColor
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                period,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }



  Widget _buildActivityStats() {
    final totalMinutes = _weeklyData.fold<int>(
      0,
      (sum, data) => sum + data.minutes,
    );
    final totalCalories = _weeklyData.fold<int>(
      0,
      (sum, data) => sum + data.calories,
    );
    final totalSessions = _weeklyData.fold<int>(
      0,
      (sum, data) => sum + data.sessions,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Weekly Summary',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildStatCard(
              'Total Time',
              '$totalMinutes min',
              Icons.timer,
            ),
            _buildStatCard(
              'Calories',
              '$totalCalories kcal',
              Icons.local_fire_department,
            ),
            _buildStatCard(
              'Sessions',
              '$totalSessions',
              Icons.fitness_center,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, color: Theme.of(context).primaryColor, size: 32),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAchievementsTab() {
    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _achievements.length,
      itemBuilder: (context, index) {
        final achievement = _achievements[index];
        return _buildAchievementCard(achievement);
      },
    );
  }

  Widget _buildAchievementCard(Achievement achievement) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: achievement.isUnlocked
                      ? Theme.of(context).primaryColor
                      : Colors.white12,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  achievement.icon,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      achievement.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      achievement.description,
                      style: TextStyle(
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: achievement.progress,
              backgroundColor: Colors.white12,
              valueColor: AlwaysStoppedAnimation<Color>(
                Theme.of(context).primaryColor,
              ),
              minHeight: 8,
            ),
          ),
          SizedBox(height: 8),
          Text(
            '${(achievement.progress * 100).toInt()}% Complete',
            style: TextStyle(
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsTab() {
    return ListView(
      padding: EdgeInsets.all(16),
      children: [
        _buildStatGroup(
          'Practice Stats',
          [
            _buildStatItem('Total Sessions', '48'),
            _buildStatItem('Total Minutes', '1,440'),
            _buildStatItem('Avg. Session Length', '30 min'),
          ],
        ),
        SizedBox(height: 24),
        _buildStatGroup(
          'Fitness Stats',
          [
            _buildStatItem('Total Calories', '4,800'),
            _buildStatItem('Avg. Calories/Session', '100'),
            _buildStatItem('Active Days', '24'),
          ],
        ),
        SizedBox(height: 24),
        _buildStatGroup(
          'Achievement Stats',
          [
            _buildStatItem('Achievements Unlocked', '5/12'),
            _buildStatItem('Current Streak', '7 days'),
            _buildStatItem('Longest Streak', '14 days'),
          ],
        ),
      ],
    );
  }

  Widget _buildStatGroup(String title, List<Widget> stats) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 16),
        Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Color(0xFF2A2A2A),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: stats,
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.white70,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

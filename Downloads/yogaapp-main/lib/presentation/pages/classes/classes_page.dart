// lib/presentation/pages/classes/classes_page.dart
import 'package:flutter/material.dart';

class YogaClass {
  final String title;
  final String instructor;
  final String level;
  final String duration;
  final String image;
  final String category;
  final double rating;
  final int students;
  final bool isLive;

  YogaClass({
    required this.title,
    required this.instructor,
    required this.level,
    required this.duration,
    required this.image,
    required this.category,
    required this.rating,
    required this.students,
    this.isLive = false,
  });
}

class ClassesPage extends StatefulWidget {
  const ClassesPage({Key? key}) : super(key: key);

  @override
  _ClassesPageState createState() => _ClassesPageState();
}

class _ClassesPageState extends State<ClassesPage> {
  bool _isLoading = true; // Add loading state
  String _selectedCategory = 'All';
  String _selectedLevel = 'All Levels';
  String _selectedDuration = 'Any Duration';

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 2), () {
      setState(() {
        _isLoading = false; // Simulate loading delay
      });
    });
  }

  final List<String> _categories = [
    'All',
    'Hatha',
    'Vinyasa',
    'Ashtanga',
    'Meditation',
    'Breathing',
  ];

  final List<String> _levels = [
    'All Levels',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  final List<String> _durations = [
    'Any Duration',
    '15 min',
    '30 min',
    '45 min',
    '60 min',
  ];

  final List<YogaClass> _classes = [
    YogaClass(
      title: 'Morning Flow Yoga',
      instructor: 'Sarah Wilson',
      level: 'Beginner',
      duration: '30 min',
      image: 'assets/images/class1.jpg',
      category: 'Vinyasa',
      rating: 4.8,
      students: 1234,
      isLive: true,
    ),
    YogaClass(
      title: 'Power Yoga',
      instructor: 'Mike Johnson',
      level: 'Advanced',
      duration: '45 min',
      image: 'assets/images/class2.jpg',
      category: 'Ashtanga',
      rating: 4.9,
      students: 856,
    ),
    // Add more classes...
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            _buildAppBar(),
            _buildFilters(),
            _buildClassesList(),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      floating: true,
      backgroundColor: Theme.of(context).colorScheme.background,
      title: Text(
        'Yoga Classes',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.search, color: Colors.white),
          onPressed: () {
            // Implement search
          },
        ),
        IconButton(
          icon: Icon(Icons.filter_list, color: Colors.white),
          onPressed: () {
            // Show advanced filters
          },
        ),
      ],
    );
  }

  Widget _buildFilters() {
    return SliverToBoxAdapter(
      child: SingleChildScrollView(
        child: Column(
          children: [
            _buildFilterSection('Category', _categories, _selectedCategory,
                (value) => setState(() => _selectedCategory = value)),
            _buildFilterSection('Level', _levels, _selectedLevel,
                (value) => setState(() => _selectedLevel = value)),
            _buildFilterSection('Duration', _durations, _selectedDuration,
                (value) => setState(() => _selectedDuration = value)),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterSection(
    String title,
    List<String> items,
    String selectedValue,
    Function(String) onSelected,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            title,
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(
          height: 40,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: 12),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              final isSelected = item == selectedValue;
              return Container(
                margin: EdgeInsets.symmetric(horizontal: 4),
                child: FilterChip(
                  label: Text(item),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) onSelected(item);
                  },
                  backgroundColor: Color(0xFF2A2A2A),
                  selectedColor: Theme.of(context).primaryColor,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : Colors.white70,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildClassesList() {
    return SliverPadding(
      padding: EdgeInsets.all(16),
      sliver: SliverGrid(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        delegate: SliverChildBuilderDelegate(
          (context, index) => _buildClassCard(_classes[index]),
          childCount: _classes.length,
        ),
      ),
    );
  }

  Widget _buildClassCard(YogaClass yogaClass) {
    return GestureDetector(
      onTap: () {
        // Navigate to class detail
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ClassDetailPage(yogaClass: yogaClass),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(16),
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  ClipRRect(
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(16)),
                    child: Image.asset(
                      yogaClass.image,
                      height: 120,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  if (yogaClass.isLive)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.live_tv, size: 14, color: Colors.white),
                            SizedBox(width: 4),
                            Text(
                              'LIVE',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      yogaClass.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Text(
                      yogaClass.instructor,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                    SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.star, size: 16, color: Colors.amber),
                        SizedBox(width: 4),
                        Text(
                          yogaClass.rating.toString(),
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                        SizedBox(width: 8),
                        Text(
                          '${yogaClass.students} students',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      children: [
                        _buildClassTag(yogaClass.level),
                        SizedBox(width: 8),
                        _buildClassTag(yogaClass.duration),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClassTag(String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: Colors.white70,
          fontSize: 12,
        ),
      ),
    );
  }
}

// Class detail page (stub - to be implemented)
class ClassDetailPage extends StatelessWidget {
  final YogaClass yogaClass;

  const ClassDetailPage({
    Key? key,
    required this.yogaClass,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text(yogaClass.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Center(
        child: Text(
          'Class Detail Page - To be implemented',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

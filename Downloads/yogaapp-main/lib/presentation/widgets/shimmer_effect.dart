import 'package:flutter/material.dart';

class ShimmerEffect extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerEffect({
    Key? key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
  }) : super(key: key);

  @override
  _ShimmerEffectState createState() => _ShimmerEffectState();
}

class _ShimmerEffectState extends State<ShimmerEffect> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();

    _animation = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOutSine),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.borderRadius),
            gradient: LinearGradient(
              begin: Alignment(-1.0 + _animation.value, 0),
              end: Alignment(1.0 + _animation.value, 0),
              colors: [
                Color(0xFF2A2A2A),
                Color(0xFF3A3A3A),
                Color(0xFF2A2A2A),
              ],
              stops: [0.0, 0.5, 1.0],
            ),
          ),
        );
      },
    );
  }
}

// Example usage for different components:

// Custom Shimmer Widgets for HomePage

class HeaderShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ShimmerEffect(
                width: 120,
                height: 24,
                borderRadius: 4,
              ),
              SizedBox(height: 4),
              ShimmerEffect(
                width: 180,
                height: 16,
                borderRadius: 4,
              ),
            ],
          ),
          ShimmerEffect(
            width: 48,
            height: 48,
            borderRadius: 24,
          ),
        ],
      ),
    );
  }
}

class DailyProgressShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ShimmerEffect(
            width: 120,
            height: 20,
            borderRadius: 4,
          ),
          SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              ShimmerEffect(
                width: 60,
                height: 40,
                borderRadius: 4,
              ),
              ShimmerEffect(
                width: 60,
                height: 40,
                borderRadius: 4,
              ),
              ShimmerEffect(
                width: 60,
                height: 40,
                borderRadius: 4,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ScheduleButtonShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ShimmerEffect(
        width: double.infinity,
        height: 56,
        borderRadius: 12,
      ),
    );
  }
}

class ClassCardShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ShimmerEffect(
            width: double.infinity,
            height: 150,
            borderRadius: 12,
          ),
          SizedBox(height: 12),
          ShimmerEffect(
            width: 120,
            height: 20,
          ),
          SizedBox(height: 8),
          ShimmerEffect(
            width: 80,
            height: 16,
          ),
          SizedBox(height: 12),
          Row(
            children: [
              ShimmerEffect(
                width: 60,
                height: 24,
                borderRadius: 12,
              ),
              SizedBox(width: 8),
              ShimmerEffect(
                width: 60,
                height: 24,
                borderRadius: 12,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class UpcomingClassesShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: ShimmerEffect(
            width: 120,
            height: 20,
            borderRadius: 4,
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              ClassCardShimmer(),
              SizedBox(width: 16),
              ClassCardShimmer(),
            ],
          ),
        ),
      ],
    );
  }
}

// Custom Shimmer Widgets for LoginPage

class LogoShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ShimmerEffect(
        width: 120,
        height: 120,
        borderRadius: 60,
      ),
    );
  }
}

class WelcomeTextShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: ShimmerEffect(
            width: double.infinity,
            height: 24,
            borderRadius: 4,
          ),
        ),
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: ShimmerEffect(
            width: double.infinity,
            height: 16,
            borderRadius: 4,
          ),
        ),
      ],
    );
  }
}

class LoginFormShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  ShimmerEffect(
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  ),
                  const SizedBox(width: 8),
                  ShimmerEffect(
                    width: 80,
                    height: 16,
                    borderRadius: 4,
                  ),
                ],
              ),
              ShimmerEffect(
                width: 120,
                height: 16,
                borderRadius: 4,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Custom Shimmer Widgets for SignupPage

class SignupHeaderShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ShimmerEffect(
          width: 80,
          height: 80,
          borderRadius: 40,
        ),
        const SizedBox(height: 24),
        ShimmerEffect(
          width: 120,
          height: 28,
          borderRadius: 4,
        ),
        const SizedBox(height: 8),
        ShimmerEffect(
          width: 240,
          height: 16,
          borderRadius: 4,
        ),
      ],
    );
  }
}

class SignupFormShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  ShimmerEffect(
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  ),
                  const SizedBox(width: 8),
                  ShimmerEffect(
                    width: 80,
                    height: 16,
                    borderRadius: 4,
                  ),
                ],
              ),
              ShimmerEffect(
                width: 120,
                height: 16,
                borderRadius: 4,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class SignupButtonShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: ShimmerEffect(
        width: double.infinity,
        height: 56,
        borderRadius: 12,
      ),
    );
  }
}

class SocialLoginShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ShimmerEffect(
          width: 60,
          height: 60,
          borderRadius: 12,
        ),
        const SizedBox(width: 16),
        ShimmerEffect(
          width: 60,
          height: 60,
          borderRadius: 12,
        ),
      ],
    );
  }
}

class LoginLinkShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ShimmerEffect(
          width: 160,
          height: 16,
          borderRadius: 4,
        ),
        ShimmerEffect(
          width: 60,
          height: 16,
          borderRadius: 4,
        ),
      ],
    );
  }
}

// Custom Shimmer Widgets for ForgotPasswordPage

class ForgotPasswordHeaderShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ShimmerEffect(
          width: 80,
          height: 80,
          borderRadius: 40,
        ),
        const SizedBox(height: 24),
        ShimmerEffect(
          width: 120,
          height: 28,
          borderRadius: 4,
        ),
        const SizedBox(height: 8),
        ShimmerEffect(
          width: 240,
          height: 16,
          borderRadius: 4,
        ),
      ],
    );
  }
}

class EmailStepShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 24),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
        ],
      ),
    );
  }
}

class VerificationStepShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          ShimmerEffect(
            width: 120,
            height: 24,
            borderRadius: 4,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(
              6,
              (index) => ShimmerEffect(
                width: 40,
                height: 40,
                borderRadius: 8,
              ),
            ),
          ),
          const SizedBox(height: 24),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: 120,
            height: 16,
            borderRadius: 4,
          ),
        ],
      ),
    );
  }
}

class NewPasswordStepShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        children: [
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 16),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
          const SizedBox(height: 24),
          ShimmerEffect(
            width: double.infinity,
            height: 56,
            borderRadius: 12,
          ),
        ],
      ),
    );
  }
}

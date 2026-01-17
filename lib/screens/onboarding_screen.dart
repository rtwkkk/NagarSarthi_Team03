import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nagar_alert_app/providers/theme_provider.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingData> _pages = [
    OnboardingData(
      title: 'Stay Informed',
      description:
          'Get instant, real-time alerts about everything happening in your city, right on your phone.',
      imagePath: "assets/image_1.jpeg",
    ),
    OnboardingData(
      title: 'Guide & Protect',
      description:
          'Navigate communal challenges with expert guidance, practical tips, and community insights tailored for city living.',
      imagePath: "assets/image_2.jpeg",
    ),
    OnboardingData(
      title: 'Build Healthy Community',
      description:
          'Get together with your neighbors to create a safer, more connected, and thriving living environment for all.',
      imagePath: "assets/image_3.jpeg",
    ),
  ];

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  void _skipToEnd() {
    _pageController.animateToPage(
      _pages.length - 1,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOutCubic,
    );
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_completed', true);
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/main');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        final theme = Theme.of(context);
        final isDark = themeProvider.isDarkMode;
        final size = MediaQuery.of(context).size;
        final isTablet = size.width > 600;

        return Scaffold(
          backgroundColor: theme.scaffoldBackgroundColor,
          body: SafeArea(
            child: Column(
              children: [
                // Top Bar (Logo + Skip)
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: isTablet ? 32 : 20,
                    vertical: isTablet ? 24 : 16,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Logo + App Name
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surface.withOpacity(
                                isDark ? 0.22 : 0.12,
                              ),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Image.asset(
                              'assets/logo.ico',
                              height: isTablet ? 44 : 42,
                              width: isTablet ? 44 : 36,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Nagar Alert',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0,
                              fontSize: isTablet ? 24 : 20,
                            ),
                          ),
                        ],
                      ),

                      // Skip button
                      if (_currentPage < _pages.length - 1)
                        TextButton(
                          onPressed: _skipToEnd,
                          child: Text(
                            'Skip',
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                // Page View - main content
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) =>
                        setState(() => _currentPage = index),
                    itemCount: _pages.length,
                    itemBuilder: (context, index) {
                      return OnboardingPage(
                        data: _pages[index],
                        isTablet: isTablet,
                        theme: theme,
                        isDark: isDark,
                      );
                    },
                  ),
                ),

                // Indicators + Bottom Button
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                  child: Column(
                    children: [
                      // Page Indicators
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          _pages.length,
                          (index) => AnimatedContainer(
                            duration: const Duration(milliseconds: 400),
                            margin: const EdgeInsets.symmetric(horizontal: 6),
                            height: 8,
                            width: _currentPage == index ? 28 : 8,
                            decoration: BoxDecoration(
                              color: _currentPage == index
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.primary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Next / Get Started Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _currentPage == _pages.length - 1
                              ? _completeOnboarding
                              : _nextPage,
                          style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                              vertical: isTablet ? 20 : 16,
                            ),
                            backgroundColor: theme.colorScheme.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            _currentPage == _pages.length - 1
                                ? "Let's Get Started"
                                : 'Next',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class OnboardingData {
  final String title;
  final String description;
  final String? imagePath;

  OnboardingData({
    required this.title,
    required this.description,
    this.imagePath,
  });
}

class OnboardingPage extends StatelessWidget {
  final OnboardingData data;
  final bool isTablet;
  final ThemeData theme;
  final bool isDark;

  const OnboardingPage({
    super.key,
    required this.data,
    required this.isTablet,
    required this.theme,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isTablet ? 48 : 24,
        vertical: 20,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Image / Illustration
          Container(
            height: isTablet ? size.height * 0.45 : size.height * 0.38,
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 40),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: theme.shadowColor.withOpacity(0.12),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: data.imagePath != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Image.asset(data.imagePath!, fit: BoxFit.cover),
                  )
                : Center(
                    child: Icon(
                      Icons.image_outlined,
                      size: isTablet ? 100 : 80,
                      color: theme.colorScheme.primary.withOpacity(0.3),
                    ),
                  ),
          ),

          // Title
          Text(
            data.title,
            textAlign: TextAlign.center,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w800,
              height: 1.2,
              color: theme.colorScheme.onSurface,
            ),
          ),

          SizedBox(height: isTablet ? 24 : 20),

          // Description
          Text(
            data.description,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyLarge?.copyWith(
              height: 1.5,
              color: theme.colorScheme.onSurface.withOpacity(0.75),
            ),
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

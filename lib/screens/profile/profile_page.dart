import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:nagar_alert_app/screens/profile/helpers/about_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/achievements_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/credibility_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/feedback_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/help_center_screen.dart';
// import 'package:nagar_alert_app/screens/profile/helpers/location_preference_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/notification_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/personal_info_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/privacy_security_screen.dart';
import 'package:nagar_alert_app/screens/profile/helpers/theme_setting_screen.dart';
// import 'package:nagar_alert_app/screens/profile/helpers/saved_location_screen.dart';
import 'package:nagar_alert_app/services/auth_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final User? currentUser = FirebaseAuth.instance.currentUser;
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: currentUser == null
          ? const Center(child: Text('Not logged in'))
          : StreamBuilder<DocumentSnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('users')
                  .doc(currentUser.uid)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                if (!snapshot.hasData || !snapshot.data!.exists) {
                  return const Center(child: Text('User data not found'));
                }
                final userData = snapshot.data!.data() as Map<String, dynamic>;
                final String name = userData['name'] ?? 'User';
                final String email = userData['email'] ?? '';
                final String avatarUrl = userData['avatar'] ?? '';
                final int credibilityScore = userData['credibilityScore'] ?? 50;
                final int totalReports = userData['totalReports'] ?? 0;
                final int points = userData['points'] ?? 0;

                // Generate initials from name
                final String initials = name
                    .trim()
                    .split(' ')
                    .map((part) {
                      return part.isNotEmpty ? part[0].toUpperCase() : '';
                    })
                    .take(2)
                    .join();

                return CustomScrollView(
                  slivers: [
                    // Custom App Bar with Profile Header
                    SliverAppBar(
                      expandedHeight: 280,
                      floating: false,
                      pinned: true,
                      backgroundColor: Colors.white,
                      elevation: 0,
                      flexibleSpace: FlexibleSpaceBar(
                        background: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.blue.shade500,
                                Colors.blue.shade600,
                                Colors.indigo.shade700,
                              ],
                            ),
                          ),
                          child: SafeArea(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                const SizedBox(height: 20),
                                // Profile Picture with Badge
                                Stack(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 3,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(
                                              0.2,
                                            ),
                                            blurRadius: 20,
                                            offset: const Offset(0, 10),
                                          ),
                                        ],
                                      ),
                                      child: CircleAvatar(
                                        radius: 50,
                                        backgroundColor: Colors.white,
                                        backgroundImage: avatarUrl.isNotEmpty
                                            ? NetworkImage(avatarUrl)
                                            : null,
                                        child: avatarUrl.isEmpty
                                            ? Text(
                                                initials.isEmpty
                                                    ? 'U'
                                                    : initials,
                                                style: TextStyle(
                                                  fontSize: 32,
                                                  fontWeight: FontWeight.w800,
                                                  color: Colors.blue.shade700,
                                                ),
                                              )
                                            : null,
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 0,
                                      right: 0,
                                      child: Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: Colors.green.shade400,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: Colors.white,
                                            width: 3,
                                          ),
                                        ),
                                        child: const Icon(
                                          Icons.verified_rounded,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                // Name
                                Flexible(
                                  child: Text(
                                    name,
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      fontSize: 26,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                ),
                                // Badge
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.25),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.star_rounded,
                                        color: Colors.amber,
                                        size: 16,
                                      ),
                                      SizedBox(width: 6),
                                      Text(
                                        'Active Citizen Reporter',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                // Quick Stats
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    _buildQuickStat('$totalReports', 'Reports'),
                                    _buildVerticalDivider(),
                                    _buildQuickStat(
                                      '${credibilityScore.toStringAsFixed(0)}%',
                                      'Accuracy',
                                    ),
                                    _buildVerticalDivider(),
                                    _buildQuickStat(
                                      points.toString(),
                                      'Points',
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 20),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    // Profile Content
                    SliverToBoxAdapter(
                      child: Column(
                        children: [
                          const SizedBox(height: 20),
                          ListTile(
                            leading: const Icon(Icons.palette_outlined),
                            title: const Text('Display & Theme'),
                            subtitle: const Text('Light, Dark, System'),
                            trailing: const Icon(Icons.chevron_right_rounded),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const ThemeSettingsScreen(),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 20),
                          // Credibility Score Card (Clickable)
                          GestureDetector(
                            onTap: () => _navigateToCredibilityDetails(
                              context,
                              credibilityScore,
                              totalReports,
                            ),
                            child: Container(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Colors.purple.shade400,
                                    Colors.purple.shade600,
                                    Colors.deepPurple.shade700,
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.purple.shade300.withOpacity(
                                      0.4,
                                    ),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Credibility Score',
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Row(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              credibilityScore.toString(),
                                              style: const TextStyle(
                                                fontSize: 48,
                                                fontWeight: FontWeight.w900,
                                                color: Colors.white,
                                                height: 1,
                                                letterSpacing: -2,
                                              ),
                                            ),
                                            const Padding(
                                              padding: EdgeInsets.only(
                                                bottom: 8,
                                                left: 4,
                                              ),
                                              child: Text(
                                                '/100',
                                                style: TextStyle(
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.white70,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        const Row(
                                          children: [
                                            Icon(
                                              Icons.trending_up_rounded,
                                              color: Colors.greenAccent,
                                              size: 16,
                                            ),
                                            SizedBox(width: 6),
                                            Text(
                                              '+8 points this month',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    width: 80,
                                    height: 80,
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Center(
                                      child: Icon(
                                        Icons.workspace_premium_rounded,
                                        color: Colors.amber,
                                        size: 40,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          // Account Settings
                          _buildSectionTitle('Account Settings'),
                          _buildSettingsCard([
                            _buildSettingsTile(
                              context,
                              Icons.person_outline_rounded,
                              'Personal Information',
                              'Update your profile details',
                              Colors.blue,
                              () =>
                                  _navigateToPersonalInfo(context, name, email),
                            ),
                            const Divider(height: 1),
                            // _buildSettingsTile(
                            //   context,
                            //   Icons.location_on_outlined,
                            //   'Location Preferences',
                            //   'Manage alert areas',
                            //   Colors.red,
                            //   () => _navigateToLocationPreferences(context),
                            // ),
                            // const Divider(height: 1),
                            _buildSettingsTile(
                              context,
                              Icons.notifications_outlined,
                              'Notifications',
                              'Configure alert settings',
                              Colors.orange,
                              () => _navigateToNotifications(context),
                            ),
                            const Divider(height: 1),
                            _buildSettingsTile(
                              context,
                              Icons.security_rounded,
                              'Privacy & Security',
                              'Manage your data',
                              Colors.green,
                              () => _navigateToPrivacySecurity(context),
                            ),
                          ]),
                          // My Activity (Report History removed)
                          _buildSectionTitle('My Activity'),
                          _buildSettingsCard([
                            // _buildSettingsTile(
                            //   context,
                            //   Icons.bookmark_outline_rounded,
                            //   'Saved Locations',
                            //   '5 locations',
                            //   Colors.indigo,
                            //   () => _navigateToSavedLocations(context),
                            // ),
                            // const Divider(height: 1),
                            _buildSettingsTile(
                              context,
                              Icons.emoji_events_outlined,
                              'Achievements',
                              'View your badges',
                              Colors.amber,
                              () => _navigateToAchievements(context, points),
                            ),
                          ]),
                          // Support
                          _buildSectionTitle('Support'),
                          _buildSettingsCard([
                            _buildSettingsTile(
                              context,
                              Icons.help_outline_rounded,
                              'Help Center',
                              'Get support',
                              Colors.teal,
                              () => _navigateToHelpCenter(context),
                            ),
                            const Divider(height: 1),
                            _buildSettingsTile(
                              context,
                              Icons.feedback_outlined,
                              'Send Feedback',
                              'Help us improve',
                              Colors.cyan,
                              () => _navigateToFeedback(context),
                            ),
                            const Divider(height: 1),
                            _buildSettingsTile(
                              context,
                              Icons.info_outline_rounded,
                              'About',
                              'Version 1.2.4',
                              Colors.blueGrey,
                              () => _navigateToAbout(context),
                            ),
                          ]),
                          const SizedBox(height: 20),
                          // Logout Button
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 20),
                            child: OutlinedButton(
                              onPressed: () => _handleLogout(context),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                side: BorderSide(
                                  color: Colors.red.shade300,
                                  width: 2,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.logout_rounded,
                                    color: Colors.red.shade600,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Logout',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.red.shade600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
    );
  }

  Widget _buildQuickStat(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Colors.white,
            height: 1,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildVerticalDivider() {
    return Container(
      width: 1,
      height: 30,
      color: Colors.white.withOpacity(0.3),
      margin: const EdgeInsets.symmetric(horizontal: 24),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Colors.black87,
            letterSpacing: -0.3,
          ),
        ),
      ),
    );
  }

  Widget _buildSettingsCard(List<Widget> children) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }

  Widget _buildSettingsTile(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    Color color,
    VoidCallback onTap,
  ) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color, size: 24),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: Colors.black87,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          fontSize: 13,
          color: Colors.grey.shade600,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400),
      onTap: onTap,
    );
  }

  // Navigation methods
  void _navigateToCredibilityDetails(
    BuildContext context,
    int score,
    int totalReports,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            CredibilityDetailsScreen(score: score, totalReports: totalReports),
      ),
    );
  }

  void _navigateToPersonalInfo(
    BuildContext context,
    String name,
    String email,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PersonalInfoScreen()),
    );
  }

  // void _navigateToLocationPreferences(BuildContext context) {
  //   Navigator.push(
  //     context,
  //     MaterialPageRoute(
  //       builder: (context) => const LocationPreferencesScreen(),
  //     ),
  //   );
  // }

  void _navigateToNotifications(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const NotificationsScreen()),
    );
  }

  void _navigateToPrivacySecurity(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const PrivacySecurityScreen()),
    );
  }

  // void _navigateToSavedLocations(BuildContext context) {
  //   Navigator.push(
  //     context,
  //     MaterialPageRoute(builder: (context) => const SavedLocationsScreen()),
  //   );
  // }

  void _navigateToAchievements(BuildContext context, int points) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AchievementsScreen(points: points),
      ),
    );
  }

  void _navigateToHelpCenter(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const HelpCenterScreen()),
    );
  }

  void _navigateToFeedback(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const FeedbackScreen()),
    );
  }

  void _navigateToAbout(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AboutScreen()),
    );
  }
}

// Logout function
Future<void> _handleLogout(BuildContext context) async {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) => const Center(
      child: CircularProgressIndicator(
        strokeWidth: 3,
        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
      ),
    ),
  );
  try {
    await AuthService().signOut();
    if (Navigator.canPop(context)) Navigator.pop(context);
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  } catch (e) {
    if (Navigator.canPop(context)) Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Logout failed: $e'), backgroundColor: Colors.red),
    );
  }
}

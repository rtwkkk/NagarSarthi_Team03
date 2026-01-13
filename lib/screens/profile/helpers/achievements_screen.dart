// lib/screens/profile/achievements_screen.dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AchievementsScreen extends StatelessWidget {
  final int points;

  const AchievementsScreen({super.key, required this.points});

  @override
  Widget build(BuildContext context) {
    final User? user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Achievements'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .doc(user!.uid)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final data = snapshot.data!.data() as Map<String, dynamic>;
          final List<dynamic> unlocked = data['achievements'] ?? [];
          final int totalReports = data['totalReports'] ?? 0;
          final int credibility = data['credibilityScore'] ?? 50;

          final List<Map<String, dynamic>> allAchievements = [
            {
              'title': 'First Report',
              'icon': Icons.flag_rounded,
              'unlocked': totalReports >= 1,
              'desc': 'Submitted your first report',
            },
            {
              'title': 'Citizen Reporter',
              'icon': Icons.how_to_vote_rounded,
              'unlocked': totalReports >= 10,
              'desc': '10 reports submitted',
            },
            {
              'title': 'Trusted Source',
              'icon': Icons.verified_rounded,
              'unlocked': credibility >= 80,
              'desc': 'Credibility score 80+',
            },
            {
              'title': 'Community Hero',
              'icon': Icons.emoji_events_rounded,
              'unlocked': totalReports >= 50,
              'desc': '50 reports submitted',
            },
            {
              'title': 'Accuracy Master',
              'icon': Icons.star_rounded,
              'unlocked': credibility >= 95,
              'desc': '95%+ accuracy',
            },
            {
              'title': 'Point Collector',
              'icon': Icons.military_tech_rounded,
              'unlocked': points >= 500,
              'desc': 'Earned 500 points',
            },
          ];

          final int unlockedCount = allAchievements
              .where((a) => a['unlocked'])
              .length;

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Text(
                        '$unlockedCount / ${allAchievements.length}',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Achievements Unlocked',
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        '$points Points Earned',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: Colors.amber.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              ...allAchievements.map((achievement) {
                final bool isUnlocked = achievement['unlocked'];
                return Card(
                  elevation: isUnlocked ? 4 : 1,
                  color: isUnlocked
                      ? Colors.amber.shade50
                      : Colors.grey.shade100,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: isUnlocked
                          ? Colors.amber.shade600
                          : Colors.grey.shade400,
                      child: Icon(achievement['icon'], color: Colors.white),
                    ),
                    title: Text(
                      achievement['title'],
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: isUnlocked
                            ? Colors.black87
                            : Colors.grey.shade600,
                      ),
                    ),
                    subtitle: Text(achievement['desc']),
                    trailing: isUnlocked
                        ? const Icon(
                            Icons.check_circle_rounded,
                            color: Colors.green,
                          )
                        : const Icon(Icons.lock_rounded, color: Colors.grey),
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}

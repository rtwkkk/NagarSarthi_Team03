import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final User? _user = FirebaseAuth.instance.currentUser;

  Future<void> _updatePreference(String key, bool value) async {
    if (_user == null) return;
    await FirebaseFirestore.instance.collection('users').doc(_user!.uid).update(
      {'notificationPreferences.$key': value},
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          'Notification Settings',
          style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 0.4),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black87,
        centerTitle: true,
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: _user != null
            ? FirebaseFirestore.instance
                  .collection('users')
                  .doc(_user!.uid)
                  .snapshots()
            : null,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text('No preferences found'));
          }

          final prefs =
              (snapshot.data!.data()
                      as Map<String, dynamic>)['notificationPreferences']
                  as Map<String, dynamic>? ??
              {};

          return CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeaderCard(),
                      const SizedBox(height: 28),
                      Text(
                        'Alert Preferences',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Colors.blueGrey.shade800,
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildListDelegate([
                  _buildModernSwitchTile(
                    title: 'General Alerts',
                    subtitle: 'New reports & incidents near you',
                    icon: Icons.campaign_rounded,
                    color: Colors.orange.shade700,
                    value: prefs['generalAlerts'] ?? true,
                    onChanged: (v) => _updatePreference('generalAlerts', v),
                  ),
                  _buildModernSwitchTile(
                    title: 'Emergency Only',
                    subtitle: 'High-priority & critical incidents',
                    icon: Icons.warning_amber_rounded,
                    color: Colors.red.shade700,
                    value: prefs['emergencyAlerts'] ?? true,
                    onChanged: (v) => _updatePreference('emergencyAlerts', v),
                  ),
                  _buildModernSwitchTile(
                    title: 'Daily Digest',
                    subtitle: 'Evening summary of your area',
                    icon: Icons.summarize_rounded,
                    color: Colors.teal.shade600,
                    value: prefs['dailySummary'] ?? false,
                    onChanged: (v) => _updatePreference('dailySummary', v),
                  ),
                  _buildModernSwitchTile(
                    title: 'Community Updates',
                    subtitle: 'Resolved cases & official actions',
                    icon: Icons.group_rounded,
                    color: Colors.indigo.shade600,
                    value: prefs['communityUpdates'] ?? true,
                    onChanged: (v) => _updatePreference('communityUpdates', v),
                  ),
                  const Divider(height: 32, indent: 20, endIndent: 20),
                  _buildModernSwitchTile(
                    title: 'Sound & Vibration',
                    subtitle: 'Play sound when new alert arrives',
                    icon: Icons.volume_up_rounded,
                    color: Colors.purple.shade600,
                    value: prefs['soundEnabled'] ?? true,
                    onChanged: (v) => _updatePreference('soundEnabled', v),
                  ),
                  const SizedBox(height: 40),
                ]),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue.shade600, Colors.indigo.shade700],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.25),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(
            Icons.notifications_active_rounded,
            color: Colors.white,
            size: 42,
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Stay Updated',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'Choose what matters most to you',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModernSwitchTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: Card(
        elevation: 3,
        shadowColor: color.withOpacity(0.3),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: SwitchListTile(
          value: value,
          onChanged: onChanged,
          title: Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          subtitle: Text(
            subtitle,
            style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
          ),
          secondary: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          activeColor: color,
          activeTrackColor: color.withOpacity(0.4),
          inactiveThumbColor: Colors.grey.shade400,
          inactiveTrackColor: Colors.grey.shade300,
        ),
      ),
    );
  }
}

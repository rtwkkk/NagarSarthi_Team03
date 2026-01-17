// lib/screens/profile/privacy_security_screen.dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class PrivacySecurityScreen extends StatefulWidget {
  const PrivacySecurityScreen({super.key});

  @override
  State<PrivacySecurityScreen> createState() => _PrivacySecurityScreenState();
}

class _PrivacySecurityScreenState extends State<PrivacySecurityScreen> {
  final User? user = FirebaseAuth.instance.currentUser;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Privacy & Security'),
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
          if (!snapshot.hasData)
            return const Center(child: CircularProgressIndicator());

          final data = snapshot.data!.data() as Map<String, dynamic>;
          final bool anonymousMode = data['anonymousMode'] ?? false;

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _buildOptionTile(
                icon: Icons.visibility_off_rounded,
                title: 'Anonymous Reporting',
                subtitle: anonymousMode
                    ? 'Your name is hidden in reports'
                    : 'Your name is visible',
                trailing: Switch(
                  value: anonymousMode,
                  onChanged: (v) {
                    FirebaseFirestore.instance
                        .collection('users')
                        .doc(user!.uid)
                        .update({'anonymousMode': v});
                  },
                ),
              ),
              const SizedBox(height: 12),
              _buildOptionTile(
                icon: Icons.delete_forever_rounded,
                title: 'Delete My Account',
                subtitle: 'Permanently remove all data',
                color: Colors.red,
                onTap: () => _showDeleteAccountDialog(context),
              ),
              const SizedBox(height: 12),
              _buildOptionTile(
                icon: Icons.shield_rounded,
                title: 'Data Privacy Policy',
                onTap: () {
                  // Open web view or show in-app policy
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Privacy Policy will open here'),
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildOptionTile({
    required IconData icon,
    required String title,
    String? subtitle,
    Color? color,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: (color ?? Colors.green).withOpacity(0.1),
          child: Icon(icon, color: color ?? Colors.green.shade700),
        ),
        title: Text(
          title,
          style: TextStyle(fontWeight: FontWeight.w600, color: color),
        ),
        subtitle: subtitle != null ? Text(subtitle) : null,
        trailing: trailing ?? const Icon(Icons.chevron_right_rounded),
        onTap: onTap,
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text(
          'This action is permanent. All your reports, points, and data will be deleted.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            onPressed: () {
              // Implement actual delete logic
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Account deletion requested')),
              );
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

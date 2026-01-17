// lib/screens/profile/about_screen.dart
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  String _version = '1.2.4';

  @override
  void initState() {
    super.initState();
    _loadVersion();
  }

  Future<void> _loadVersion() async {
    final info = await PackageInfo.fromPlatform();
    setState(() => _version = info.version);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('About'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Center(
            child: Column(
              children: [
                Icon(
                  Icons.security_rounded,
                  size: 80,
                  color: Colors.blue.shade700,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Nagar Alert',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                Text(
                  'Version $_version',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'Nagar Alert is a citizen-powered platform for reporting local issues, safety concerns, and emergencies. '
                'Together, we make our neighborhoods safer and more responsive.',
                style: TextStyle(fontSize: 16, height: 1.5),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          const SizedBox(height: 24),
          ListTile(
            leading: const Icon(Icons.privacy_tip_rounded),
            title: const Text('Privacy Policy'),
            onTap: () => _launchURL('https://yourapp.com/privacy'),
          ),
          ListTile(
            leading: const Icon(Icons.description_rounded),
            title: const Text('Terms of Service'),
            onTap: () => _launchURL('https://yourapp.com/terms'),
          ),
          ListTile(
            leading: const Icon(Icons.code_rounded),
            title: const Text('Open Source Licenses'),
            onTap: () => showLicensePage(context: context),
          ),
        ],
      ),
    );
  }

  void _launchURL(String url) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Opening $url')));
    // Use url_launcher package in production
  }
}

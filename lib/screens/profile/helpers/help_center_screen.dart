// lib/screens/profile/help_center_screen.dart
import 'package:flutter/material.dart';

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> faqs = [
      {
        'q': 'How do I report an issue?',
        'a':
            'Tap the + button on the home screen, describe the issue, add photos if possible, and submit.',
      },
      {
        'q': 'What happens after I submit a report?',
        'a':
            'Your report is reviewed by moderators. Verified reports are shared with authorities and the community.',
      },
      {
        'q': 'How is credibility score calculated?',
        'a':
            'Based on accuracy of past reports, verified confirmations, and community feedback.',
      },
      {
        'q': 'Can I report anonymously?',
        'a':
            'Yes! Enable "Anonymous Reporting" in Privacy & Security settings.',
      },
      {
        'q': 'Why am I not receiving alerts?',
        'a': 'Check your Location Preferences and Notification settings.',
      },
    ];

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Help Center'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            elevation: 3,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Icon(
                    Icons.help_rounded,
                    size: 60,
                    color: Colors.teal.shade600,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'How can we help you?',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Browse FAQs or contact support',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Frequently Asked Questions',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          ...faqs.map(
            (faq) => ExpansionTile(
              title: Text(
                faq['q']!,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Text(
                    faq['a']!,
                    style: const TextStyle(color: Colors.black87),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Support email sent! (Implement email intent here)',
                  ),
                ),
              );
            },
            icon: const Icon(Icons.email_rounded),
            label: const Text('Contact Support'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Colors.teal.shade600,
            ),
          ),
        ],
      ),
    );
  }
}

// lib/screens/language_selection_screen.dart
import 'package:flutter/material.dart';
import 'package:nagar_alert_app/models/language_models.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageSelectionScreen extends StatefulWidget {
  const LanguageSelectionScreen({super.key});

  @override
  State<LanguageSelectionScreen> createState() =>
      _LanguageSelectionScreenState();
}

class _LanguageSelectionScreenState extends State<LanguageSelectionScreen> {
  String? _selectedCode;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 60),
              Text(
                'Choose Your Language',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              Expanded(
                child: ListView.builder(
                  itemCount: AppLanguage.supported.length,
                  itemBuilder: (context, index) {
                    final lang = AppLanguage.supported[index];
                    final isSelected = _selectedCode == lang.code;

                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      title: Text(
                        lang.nativeName,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                      subtitle: Text(lang.name),
                      trailing: isSelected
                          ? const Icon(Icons.check_circle, color: Colors.green)
                          : null,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      tileColor: isSelected
                          ? Colors.green.withOpacity(0.1)
                          : null,
                      onTap: () {
                        setState(() => _selectedCode = lang.code);
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: _selectedCode == null
                    ? null
                    : () async {
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setString(
                          'preferred_language',
                          _selectedCode!,
                        );

                        // Optional: Set locale for intl / flutter_localizations
                        // Intl.defaultLocale = _selectedCode;

                        if (!mounted) return;
                        Navigator.pushReplacementNamed(context, '/main');
                      },
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Continue', style: TextStyle(fontSize: 18)),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

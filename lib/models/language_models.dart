// lib/models/app_language.dart
class AppLanguage {
  final String code; // 'en', 'hi', 'bn', etc.
  final String name; // "English", "हिन्दी", "বাংলা"
  final String nativeName; // "English", "हिन्दी", "বাংলা"

  const AppLanguage({
    required this.code,
    required this.name,
    required this.nativeName,
  });

  static const List<AppLanguage> supported = [
    AppLanguage(code: 'en', name: 'English', nativeName: 'English'),
    AppLanguage(code: 'hi', name: 'Hindi', nativeName: 'हिन्दी'),
    AppLanguage(code: 'bn', name: 'Bengali', nativeName: 'বাংলা'),
    AppLanguage(code: 'ta', name: 'Tamil', nativeName: 'தமிழ்'),
    AppLanguage(code: 'te', name: 'Telugu', nativeName: 'తెలుగు'),
    AppLanguage(code: 'mr', name: 'Marathi', nativeName: 'मराठी'),
    AppLanguage(code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી'),
    AppLanguage(code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ'),
    AppLanguage(code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം'),
    AppLanguage(code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ'),
    // Add more as needed
  ];
}

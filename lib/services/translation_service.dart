import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TranslationService {
  static GenerativeModel? _model;
  static bool _initialized = false;

  // Map language codes to full names for better translation
  static const Map<String, String> languageNames = {
    'en': 'English',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'gu': 'Gujarati',
  };

  static Future<void> init() async {
    if (_initialized) return; // Prevent re-initialization

    // Firebase is already initialized in main.dart
    _model = GenerativeModel(
      model: 'gemini-2.5-flash',
      apiKey: 'AIzaSyAps7lQjnBKewHa4nOAgQyR9zJSHdHyNGM',
      generationConfig: GenerationConfig(
        temperature: 0.1, // almost deterministic for translation
        topK: 1,
      ),
    );
    _initialized = true;
  }

  static Future<String> translate({
    required String text,
    required String targetLanguage, // 'hi', 'bn', 'en', 'gu'
    String sourceLanguage = 'en',
  }) async {
    if (_model == null) await init();

    if (text.trim().isEmpty) return text;

    // If already in target language, return as is
    if (sourceLanguage == targetLanguage || targetLanguage == 'en') {
      return text;
    }

    final targetLanguageName = languageNames[targetLanguage] ?? targetLanguage;

    final prompt = '''Translate the following text to $targetLanguageName.
Keep the meaning accurate and preserve the severity and urgency tone of any incident reporting.
Do NOT add explanations. Return ONLY the translated text.

Text:
$text''';

    try {
      final response = await _model!.generateContent([Content.text(prompt)]);
      final translated = response.text?.trim() ?? text;
      return translated.isNotEmpty ? translated : text;
    } catch (e) {
      print("Translation failed for $targetLanguage: $e");
      return text; // fallback to original
    }
  }
}

class IncidentTranslationCache {
  static const _prefix = 'trans_';

  static Future<String?> getCachedTranslation(
    String incidentId,
    String field, // 'title' / 'description'
    String lang,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('${_prefix}${incidentId}_${field}_$lang');
  }

  static Future<void> cacheTranslation(
    String incidentId,
    String field,
    String lang,
    String translatedText,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      '${_prefix}${incidentId}_${field}_$lang',
      translatedText,
    );
  }
}

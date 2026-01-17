// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppLocalizationsHi extends AppLocalizations {
  AppLocalizationsHi([String locale = 'hi']) : super(locale);

  @override
  String get appTitle => 'नगर अलर्ट हब';

  @override
  String get appName => 'नगर अलर्ट हब';

  @override
  String get platformTagline => 'एआई-संचालित इंटेलिजेंस प्लेटफॉर्म';

  @override
  String get welcomeBack => 'वापस स्वागत है';

  @override
  String get signInSubtitle =>
      'रीयल-टाइम नागरिक अलर्ट्स देखने के लिए साइन इन करें';

  @override
  String get emailOrPhone => 'ईमेल या फोन नंबर';

  @override
  String get emailHint => 'अपना ईमेल या फोन नंबर डालें';

  @override
  String get password => 'पासवर्ड';

  @override
  String get passwordHint => 'अपना पासवर्ड डालें';

  @override
  String get rememberMe => 'मुझे याद रखें';

  @override
  String get forgotPassword => 'पासवर्ड भूल गए?';

  @override
  String get signIn => 'साइन इन करें';

  @override
  String get orContinueWith => 'या जारी रखें';

  @override
  String get google => 'Google';

  @override
  String get otpLogin => 'OTP से लॉगिन';

  @override
  String get noAccount => 'खाता नहीं है? ';

  @override
  String get signUpCitizen => 'नागरिक के रूप में साइन अप करें';

  @override
  String get secured => '🔒 एंड-टू-एंड एन्क्रिप्शन से सुरक्षित';

  @override
  String get verified => '✓ भारत सरकार द्वारा सत्यापित';

  @override
  String get locationJamshedpur => 'जमशेदपुर, झारखंड';

  @override
  String get todaysOverview => 'आज का अवलोकन';

  @override
  String get live => 'लाइव';

  @override
  String get activeAlertsRightNow => 'अभी सक्रिय अलर्ट';

  @override
  String get highPriority => 'उच्च प्राथमिकता';

  @override
  String get inProgress => 'जाँच जारी';

  @override
  String get verifiedThisMonth => 'इस महीने सत्यापित';

  @override
  String get reportsThisMonth => 'इस महीने रिपोर्ट्स';

  @override
  String get avgResponseTime => 'औसत प्रतिक्रिया समय';

  @override
  String get noResolvedIncidentsYet => 'अभी तक कोई सुलझा हुआ मामला नहीं';

  @override
  String basedOnXResolvedCasesThisMonth(int count) {
    return 'इस महीने के $count सुलझे मामलों के आधार पर';
  }

  @override
  String get recentIncidentsLast2Hours => 'हाल की घटनाएँ (पिछले २ घंटे)';

  @override
  String get noIncidentsLast2Hours => 'पिछले २ घंटों में कोई घटना नहीं।';

  @override
  String get pastIncidents => 'पिछली घटनाएँ';

  @override
  String get clickHereToView => 'देखने के लिए यहाँ क्लिक करें';

  @override
  String get reportIncident => 'घटना रिपोर्ट करें';

  @override
  String get verifiedBadge => 'सत्यापित';

  @override
  String get pendingBadge => 'लंबित';

  @override
  String reportsCount(int count) {
    return '$count रिपोर्ट';
  }

  @override
  String credibilityPercent(int percent) {
    return '$percent% विश्वसनीय';
  }

  @override
  String get unknownIncident => 'अज्ञात घटना';

  @override
  String get justNow => 'अभी-अभी';

  @override
  String minutesAgo(int count) {
    return '$count मिनट पहले';
  }

  @override
  String hoursAgo(int count) {
    return '$count घंटे पहले';
  }

  @override
  String daysAgo(int count) {
    return '$count दिन पहले';
  }
}

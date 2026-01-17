// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Gujarati (`gu`).
class AppLocalizationsGu extends AppLocalizations {
  AppLocalizationsGu([String locale = 'gu']) : super(locale);

  @override
  String get appTitle => 'નગર એલર્ટ હબ';

  @override
  String get appName => 'નગર એલર્ટ હબ';

  @override
  String get platformTagline => 'એઆઈ આધારિત ઇન્ટેલિજન્સ પ્લેટફોર્મ';

  @override
  String get welcomeBack => 'પાછા સ્વાગત છે';

  @override
  String get signInSubtitle => 'રીઅલ-ટાઇમ નાગરિક એલર્ટ્સ જોવા માટે સાઇન ઇન કરો';

  @override
  String get emailOrPhone => 'ઈમેઇલ અથવા ફોન';

  @override
  String get emailHint => 'તમારો ઈમેઇલ અથવા ફોન નંબર દાખલ કરો';

  @override
  String get password => 'પાસવર્ડ';

  @override
  String get passwordHint => 'તમારો પાસવર્ડ દાખલ કરો';

  @override
  String get rememberMe => 'મને યાદ રાખો';

  @override
  String get forgotPassword => 'પાસવર્ડ ભૂલી ગયા?';

  @override
  String get signIn => 'સાઇન ઇન કરો';

  @override
  String get orContinueWith => 'અથવા આની સાથે ચાલુ રાખો';

  @override
  String get google => 'Google';

  @override
  String get otpLogin => 'OTP લૉગિન';

  @override
  String get noAccount => 'ખાતું નથી? ';

  @override
  String get signUpCitizen => 'નાગરિક તરીકે સાઇન અપ કરો';

  @override
  String get secured => '🔒 એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન દ્વારા સુરક્ષિત';

  @override
  String get verified => '✓ ભારત સરકાર દ્વારા ચકાસાયેલ';

  @override
  String get locationJamshedpur => 'જામસેદપુર, ઝારખંડ';

  @override
  String get todaysOverview => 'આજની ઝાંખી';

  @override
  String get live => 'લાઈવ';

  @override
  String get activeAlertsRightNow => 'હમણાં સક્રિય એલર્ટ્સ';

  @override
  String get highPriority => 'ઉચ્ચ પ્રાથમિકતા';

  @override
  String get inProgress => 'તપાસ ચાલુ છે';

  @override
  String get verifiedThisMonth => 'આ મહિને ચકાસાયેલ';

  @override
  String get reportsThisMonth => 'આ મહિને રિપોર્ટ્સ';

  @override
  String get avgResponseTime => 'સરેરાશ પ્રતિસાદ સમય';

  @override
  String get noResolvedIncidentsYet => 'હજુ સુધી કોઈ ઉકેલાયેલ ઘટના નથી';

  @override
  String basedOnXResolvedCasesThisMonth(int count) {
    return 'આ મહિનેના $count ઉકેલાયેલ કેસોના આધારે';
  }

  @override
  String get recentIncidentsLast2Hours => 'તાજેતરની ઘટનાઓ (છેલ્લા ૨ કલાક)';

  @override
  String get noIncidentsLast2Hours => 'છેલ્લા ૨ કલાકમાં કોઈ ઘટના નથી.';

  @override
  String get pastIncidents => 'ગત ઘટનાઓ';

  @override
  String get clickHereToView => 'જોવા માટે અહીં ક્લિક કરો';

  @override
  String get reportIncident => 'ઘટનાની રિપોર્ટ કરો';

  @override
  String get verifiedBadge => 'ચકાસાયેલ';

  @override
  String get pendingBadge => 'બાકી';

  @override
  String reportsCount(int count) {
    return '$count રિપોર્ટ્સ';
  }

  @override
  String credibilityPercent(int percent) {
    return '$percent% વિશ્વસનીય';
  }

  @override
  String get unknownIncident => 'અજ્ઞાત ઘટના';

  @override
  String get justNow => 'હમણાં જ';

  @override
  String minutesAgo(int count) {
    return '$count મિનિટ પહેલાં';
  }

  @override
  String hoursAgo(int count) {
    return '$count કલાક પહેલાં';
  }

  @override
  String daysAgo(int count) {
    return '$count દિવસ પહેલાં';
  }
}

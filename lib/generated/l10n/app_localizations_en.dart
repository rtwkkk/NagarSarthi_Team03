// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Nagar Alert Hub';

  @override
  String get appName => 'Nagar Alert Hub';

  @override
  String get platformTagline => 'AI-Powered Intelligence Platform';

  @override
  String get welcomeBack => 'Welcome Back';

  @override
  String get signInSubtitle => 'Sign in to access real-time civic alerts';

  @override
  String get emailOrPhone => 'Email or Phone';

  @override
  String get emailHint => 'Enter your email or phone number';

  @override
  String get password => 'Password';

  @override
  String get passwordHint => 'Enter your password';

  @override
  String get rememberMe => 'Remember me';

  @override
  String get forgotPassword => 'Forgot password?';

  @override
  String get signIn => 'Sign In';

  @override
  String get orContinueWith => 'or continue with';

  @override
  String get google => 'Google';

  @override
  String get otpLogin => 'OTP Login';

  @override
  String get noAccount => 'Don\'t have an account? ';

  @override
  String get signUpCitizen => 'Sign up as Citizen';

  @override
  String get secured => '🔒 Secured by end-to-end encryption';

  @override
  String get verified => '✓ Verified by Government of India';

  @override
  String get locationJamshedpur => 'Jamshedpur, Jharkhand';

  @override
  String get todaysOverview => 'Today\'s Overview';

  @override
  String get live => 'Live';

  @override
  String get activeAlertsRightNow => 'Active Alerts Right Now';

  @override
  String get highPriority => 'High Priority';

  @override
  String get inProgress => 'In Progress';

  @override
  String get verifiedThisMonth => 'Verified this month';

  @override
  String get reportsThisMonth => 'Reports this month';

  @override
  String get avgResponseTime => 'Avg Response Time';

  @override
  String get noResolvedIncidentsYet => 'No resolved incidents yet';

  @override
  String basedOnXResolvedCasesThisMonth(int count) {
    return 'Based on $count resolved cases this month';
  }

  @override
  String get recentIncidentsLast2Hours => 'Recent Incidents (Last 2 Hours)';

  @override
  String get noIncidentsLast2Hours => 'No incidents in the last 2 hours.';

  @override
  String get pastIncidents => 'Past Incidents';

  @override
  String get clickHereToView => 'Click here to view';

  @override
  String get reportIncident => 'Report Incident';

  @override
  String get verifiedBadge => 'VERIFIED';

  @override
  String get pendingBadge => 'PENDING';

  @override
  String reportsCount(int count) {
    return '$count reports';
  }

  @override
  String credibilityPercent(int percent) {
    return '$percent% credible';
  }

  @override
  String get unknownIncident => 'Unknown Incident';

  @override
  String get justNow => 'Just now';

  @override
  String minutesAgo(int count) {
    return '$count min ago';
  }

  @override
  String hoursAgo(int count) {
    return '$count hr ago';
  }

  @override
  String daysAgo(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '# days ago',
      one: '# day ago',
    );
    return '$_temp0';
  }
}

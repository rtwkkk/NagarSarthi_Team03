import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_bn.dart';
import 'app_localizations_en.dart';
import 'app_localizations_gu.dart';
import 'app_localizations_hi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('hi'),
    Locale('gu'),
    Locale('bn'),
  ];

  /// Application title (used in login, app bar, etc)
  ///
  /// In en, this message translates to:
  /// **'Nagar Alert Hub'**
  String get appTitle;

  /// Main application name shown in app bar
  ///
  /// In en, this message translates to:
  /// **'Nagar Alert Hub'**
  String get appName;

  /// Tagline shown on login/welcome screen
  ///
  /// In en, this message translates to:
  /// **'AI-Powered Intelligence Platform'**
  String get platformTagline;

  /// Greeting on login/welcome screen
  ///
  /// In en, this message translates to:
  /// **'Welcome Back'**
  String get welcomeBack;

  /// No description provided for @signInSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in to access real-time civic alerts'**
  String get signInSubtitle;

  /// No description provided for @emailOrPhone.
  ///
  /// In en, this message translates to:
  /// **'Email or Phone'**
  String get emailOrPhone;

  /// No description provided for @emailHint.
  ///
  /// In en, this message translates to:
  /// **'Enter your email or phone number'**
  String get emailHint;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @passwordHint.
  ///
  /// In en, this message translates to:
  /// **'Enter your password'**
  String get passwordHint;

  /// No description provided for @rememberMe.
  ///
  /// In en, this message translates to:
  /// **'Remember me'**
  String get rememberMe;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get forgotPassword;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get signIn;

  /// No description provided for @orContinueWith.
  ///
  /// In en, this message translates to:
  /// **'or continue with'**
  String get orContinueWith;

  /// Google sign-in button
  ///
  /// In en, this message translates to:
  /// **'Google'**
  String get google;

  /// Alternative login method
  ///
  /// In en, this message translates to:
  /// **'OTP Login'**
  String get otpLogin;

  /// No description provided for @noAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'\'t have an account? '**
  String get noAccount;

  /// No description provided for @signUpCitizen.
  ///
  /// In en, this message translates to:
  /// **'Sign up as Citizen'**
  String get signUpCitizen;

  /// No description provided for @secured.
  ///
  /// In en, this message translates to:
  /// **'🔒 Secured by end-to-end encryption'**
  String get secured;

  /// No description provided for @verified.
  ///
  /// In en, this message translates to:
  /// **'✓ Verified by Government of India'**
  String get verified;

  /// Default/current city shown in app bar
  ///
  /// In en, this message translates to:
  /// **'Jamshedpur, Jharkhand'**
  String get locationJamshedpur;

  /// Section title
  ///
  /// In en, this message translates to:
  /// **'Today\'\'s Overview'**
  String get todaysOverview;

  /// Small live indicator badge
  ///
  /// In en, this message translates to:
  /// **'Live'**
  String get live;

  /// Main big number description
  ///
  /// In en, this message translates to:
  /// **'Active Alerts Right Now'**
  String get activeAlertsRightNow;

  /// No description provided for @highPriority.
  ///
  /// In en, this message translates to:
  /// **'High Priority'**
  String get highPriority;

  /// No description provided for @inProgress.
  ///
  /// In en, this message translates to:
  /// **'In Progress'**
  String get inProgress;

  /// Monthly stat card title
  ///
  /// In en, this message translates to:
  /// **'Verified this month'**
  String get verifiedThisMonth;

  /// Monthly stat card title
  ///
  /// In en, this message translates to:
  /// **'Reports this month'**
  String get reportsThisMonth;

  /// Average response time section title
  ///
  /// In en, this message translates to:
  /// **'Avg Response Time'**
  String get avgResponseTime;

  /// Shown when there are no resolved cases
  ///
  /// In en, this message translates to:
  /// **'No resolved incidents yet'**
  String get noResolvedIncidentsYet;

  /// Footnote under average response time
  ///
  /// In en, this message translates to:
  /// **'Based on {count} resolved cases this month'**
  String basedOnXResolvedCasesThisMonth(int count);

  /// Section title
  ///
  /// In en, this message translates to:
  /// **'Recent Incidents (Last 2 Hours)'**
  String get recentIncidentsLast2Hours;

  /// Empty state message
  ///
  /// In en, this message translates to:
  /// **'No incidents in the last 2 hours.'**
  String get noIncidentsLast2Hours;

  /// Section title
  ///
  /// In en, this message translates to:
  /// **'Past Incidents'**
  String get pastIncidents;

  /// Text on button/link to past incidents screen
  ///
  /// In en, this message translates to:
  /// **'Click here to view'**
  String get clickHereToView;

  /// Floating action button label
  ///
  /// In en, this message translates to:
  /// **'Report Incident'**
  String get reportIncident;

  /// Badge for verified incidents
  ///
  /// In en, this message translates to:
  /// **'VERIFIED'**
  String get verifiedBadge;

  /// Badge for not-yet-verified incidents
  ///
  /// In en, this message translates to:
  /// **'PENDING'**
  String get pendingBadge;

  /// Incident metric - number of reports
  ///
  /// In en, this message translates to:
  /// **'{count} reports'**
  String reportsCount(int count);

  /// Incident metric - credibility score
  ///
  /// In en, this message translates to:
  /// **'{percent}% credible'**
  String credibilityPercent(int percent);

  /// Fallback title when incident has no title
  ///
  /// In en, this message translates to:
  /// **'Unknown Incident'**
  String get unknownIncident;

  /// Time ago - less than 1 minute
  ///
  /// In en, this message translates to:
  /// **'Just now'**
  String get justNow;

  /// Time ago - minutes
  ///
  /// In en, this message translates to:
  /// **'{count} min ago'**
  String minutesAgo(int count);

  /// Time ago - hours
  ///
  /// In en, this message translates to:
  /// **'{count} hr ago'**
  String hoursAgo(int count);

  /// Time ago - days (with plural support)
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{# day ago} other{# days ago}}'**
  String daysAgo(int count);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['bn', 'en', 'gu', 'hi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'bn':
      return AppLocalizationsBn();
    case 'en':
      return AppLocalizationsEn();
    case 'gu':
      return AppLocalizationsGu();
    case 'hi':
      return AppLocalizationsHi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}

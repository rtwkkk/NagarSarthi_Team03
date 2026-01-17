// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Bengali Bangla (`bn`).
class AppLocalizationsBn extends AppLocalizations {
  AppLocalizationsBn([String locale = 'bn']) : super(locale);

  @override
  String get appTitle => 'নগর অ্যালার্ট হাব';

  @override
  String get appName => 'নগর অ্যালার্ট হাব';

  @override
  String get platformTagline => 'এআই-চালিত ইন্টেলিজেন্স প্ল্যাটফর্ম';

  @override
  String get welcomeBack => 'ফিরে আসার জন্য স্বাগতম';

  @override
  String get signInSubtitle => 'রিয়েল-টাইম নাগরিক সতর্কতা দেখতে সাইন ইন করুন';

  @override
  String get emailOrPhone => 'ইমেইল বা ফোন';

  @override
  String get emailHint => 'আপনার ইমেইল বা ফোন নম্বর লিখুন';

  @override
  String get password => 'পাসওয়ার্ড';

  @override
  String get passwordHint => 'আপনার পাসওয়ার্ড লিখুন';

  @override
  String get rememberMe => 'আমাকে মনে রাখুন';

  @override
  String get forgotPassword => 'পাসওয়ার্ড ভুলে গেছেন?';

  @override
  String get signIn => 'সাইন ইন করুন';

  @override
  String get orContinueWith => 'অথবা এর মাধ্যমে চালিয়ে যান';

  @override
  String get google => 'Google';

  @override
  String get otpLogin => 'ওটিপি লগইন';

  @override
  String get noAccount => 'অ্যাকাউন্ট নেই? ';

  @override
  String get signUpCitizen => 'নাগরিক হিসেবে সাইন আপ করুন';

  @override
  String get secured => '🔒 এন্ড-টু-এন্ড এনক্রিপশন দ্বারা সুরক্ষিত';

  @override
  String get verified => '✓ ভারত সরকার কর্তৃক যাচাইকৃত';

  @override
  String get locationJamshedpur => 'জামশেদপুর, ঝাড়খণ্ড';

  @override
  String get todaysOverview => 'আজকের সারসংক্ষেপ';

  @override
  String get live => 'লাইভ';

  @override
  String get activeAlertsRightNow => 'এখন সক্রিয় অ্যালার্ট';

  @override
  String get highPriority => 'উচ্চ অগ্রাধিকার';

  @override
  String get inProgress => 'তদন্ত চলছে';

  @override
  String get verifiedThisMonth => 'এই মাসে যাচাইকৃত';

  @override
  String get reportsThisMonth => 'এই মাসের রিপোর্ট';

  @override
  String get avgResponseTime => 'গড় প্রতিক্রিয়ার সময়';

  @override
  String get noResolvedIncidentsYet => 'এখনও কোনো সমাধান হওয়া ঘটনা নেই';

  @override
  String basedOnXResolvedCasesThisMonth(int count) {
    return 'এই মাসের $countটি সমাধান হওয়া কেসের উপর ভিত্তি করে';
  }

  @override
  String get recentIncidentsLast2Hours => 'সাম্প্রতিক ঘটনা (গত ২ ঘণ্টা)';

  @override
  String get noIncidentsLast2Hours => 'গত ২ ঘণ্টায় কোনো ঘটনা নেই।';

  @override
  String get pastIncidents => 'পূর্ববর্তী ঘটনা';

  @override
  String get clickHereToView => 'দেখতে এখানে ক্লিক করুন';

  @override
  String get reportIncident => 'ঘটনা রিপোর্ট করুন';

  @override
  String get verifiedBadge => 'যাচাইকৃত';

  @override
  String get pendingBadge => 'অপেক্ষমাণ';

  @override
  String reportsCount(int count) {
    return '$countটি রিপোর্ট';
  }

  @override
  String credibilityPercent(int percent) {
    return '$percent% বিশ্বাসযোগ্য';
  }

  @override
  String get unknownIncident => 'অজানা ঘটনা';

  @override
  String get justNow => 'এইমাত্র';

  @override
  String minutesAgo(int count) {
    return '$count মিনিট আগে';
  }

  @override
  String hoursAgo(int count) {
    return '$count ঘণ্টা আগে';
  }

  @override
  String daysAgo(int count) {
    return '$count দিন আগে';
  }
}

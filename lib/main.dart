import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:nagar_alert_app/firebase_options.dart';
import 'package:nagar_alert_app/l10n/app_localizations.dart';
import 'package:nagar_alert_app/providers/incident_provider.dart';
import 'package:nagar_alert_app/providers/theme_provider.dart';
import 'package:nagar_alert_app/screens/login_page.dart';
import 'package:nagar_alert_app/screens/main_screen.dart';
import 'package:provider/provider.dart';
import 'providers/locale_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => IncidentProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const NagarAlertApp(),
    ),
  );
}

class NagarAlertApp extends StatelessWidget {
  const NagarAlertApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<LocaleProvider, ThemeProvider>(
      builder: (context, localeProvider, themeProvider, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Nagar Alert Hub',

          // Theme Configuration
          theme: lightTheme,
          darkTheme: darkTheme,
          themeMode: themeProvider.themeMode,

          // Localization Configuration
          locale: localeProvider.locale,
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],

          // Navigation Configuration
          home: StreamBuilder<User?>(
            stream: FirebaseAuth.instance.authStateChanges(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                  body: Center(child: CircularProgressIndicator()),
                );
              }
              if (snapshot.hasData) {
                // User is logged in
                return const MainScreen();
              }
              // User is not logged in
              return const LoginScreen();
            },
          ),
          routes: {'/login': (context) => const LoginScreen()},
        );
      },
    );
  }
}

// Locale _getCurrentLanguageOnlyLocale(BuildContext context) {
//   final Locale currentLocale = Localizations.localeOf(context);
//   // Return only language code (ignore country code)
//   return Locale(currentLocale.languageCode);
// }

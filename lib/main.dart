import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
// import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:nagar_alert_app/firebase_options.dart';
// import 'package:nagar_alert_app/l10n/app_localizations.dart';
import 'package:nagar_alert_app/providers/incident_provider.dart';
import 'package:nagar_alert_app/providers/theme_provider.dart';
import 'package:nagar_alert_app/screens/login_page.dart';
import 'package:nagar_alert_app/screens/main_screen.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'providers/locale_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await Supabase.initialize(
    url: 'https://nehtzjlfiveqtnaodmzs.supabase.co', // PROJECT URL
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laHR6amxmaXZlcXRuYW9kbXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQ3NDAsImV4cCI6MjA4MzI5MDc0MH0.eN-4x_aLZZnczRn6HLOhum5N3yBqidoZ_TMi01HJfIw', // ANON KEY
  );
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
          // locale: localeProvider.locale,
          // supportedLocales: AppLocalizations.supportedLocales,
          // localizationsDelegates: const [
          //   AppLocalizations.delegate,
          //   GlobalMaterialLocalizations.delegate,
          //   GlobalWidgetsLocalizations.delegate,
          //   GlobalCupertinoLocalizations.delegate,
          // ],

          // Navigation Configuration
          home: StreamBuilder<firebase_auth.User?>(
            stream: firebase_auth.FirebaseAuth.instance.authStateChanges(),
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

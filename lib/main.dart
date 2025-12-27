import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:nagar_alert_app/l10n/app_localizations.dart';
import 'package:nagar_alert_app/providers/incident_provider.dart';
// import 'package:nagar_alert_app/screens/login_page.dart';
import 'package:nagar_alert_app/screens/main_screen.dart';
import 'package:provider/provider.dart'; // Add provider: ^6.1.1 to pubspec.yaml
import 'providers/locale_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => IncidentProvider()),
      ],
      child: const NagarAlertApp(),
    ),
  );
}

class NagarAlertApp extends StatelessWidget {
  const NagarAlertApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LocaleProvider>(
      builder: (context, localeProvider, child) {
        return MaterialApp(
          title: 'Nagar Alert Hub',
          locale: localeProvider.locale,
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          home: MainScreen(),
          debugShowCheckedModeBanner: false,
        );
      },
    );
  }
}

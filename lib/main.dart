import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:nagar_alert_app/l10n/app_localizations.dart';
import 'package:nagar_alert_app/screens/login_page.dart';
import 'package:provider/provider.dart'; // Add provider: ^6.1.1 to pubspec.yaml
import 'providers/locale_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => LocaleProvider(),
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
          home: const LoginScreen(),
          debugShowCheckedModeBanner: false,
        );
      },
    );
  }
}

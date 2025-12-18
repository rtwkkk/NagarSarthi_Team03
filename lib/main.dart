import 'package:flutter/material.dart';
import 'package:nagar_alert_app/screens/login_page.dart';

void main() {
  runApp(const NagarAlertHub());
}

class NagarAlertHub extends StatelessWidget {
  const NagarAlertHub({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nagar Alert Hub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Inter',
        scaffoldBackgroundColor: Colors.white,
      ),
      home: const LoginScreen(),
    );
  }
}

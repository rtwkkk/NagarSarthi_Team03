import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nagar_alert_app/screens/dashboard_screen.dart';
import 'package:nagar_alert_app/screens/map_screen.dart';
import 'package:nagar_alert_app/screens/profile_page.dart';
import 'package:nagar_alert_app/screens/reports_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  Future<bool> _showExitDialog(BuildContext parentContext) {
    return showDialog<bool>(
      context: parentContext,
      builder: (dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Text(
            "Exit App",
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
          ),
          content: Text(
            "Are you sure you want to exit?",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w400),
          ),
          actionsPadding: const EdgeInsets.only(bottom: 12, right: 10),
          actions: [
            // ----------- NO BUTTON -----------
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Color(0xFF10B981),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: Text(
                "No",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            // ----------- YES BUTTON -----------
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Color(0xFF10B981),
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text(
                "Yes",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        );
      },
    ).then((value) => value ?? false);
  }

  final List<Widget> _screens = [
    //profile, report , map, dashboard
    const DashboardScreen(),
    const MapScreen(),
    const ReportsScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;

        bool exit = await _showExitDialog(context);

        if (exit) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        body: IndexedStack(index: _selectedIndex, children: _screens),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF10B981),
          unselectedItemColor: Colors.grey,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
            BottomNavigationBarItem(icon: Icon(Icons.report), label: 'Reports'),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

// class MapScreen extends StatelessWidget {
//   const MapScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const Scaffold(body: Center(child: Text('Map Screen')));
//   }
// }

// class ReportsScreen extends StatelessWidget {
//   const ReportsScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const Scaffold(body: Center(child: Text('Reports Screen')));
//   }
// }

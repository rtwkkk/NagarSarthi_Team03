// lib/providers/theme_provider.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeProvider() {
    _loadThemeMode();
  }

  ThemeMode get themeMode => _themeMode;

  bool get isDarkMode {
    if (_themeMode == ThemeMode.system) {
      return WidgetsBinding.instance.platformDispatcher.platformBrightness ==
          Brightness.dark;
    }
    return _themeMode == ThemeMode.dark;
  }

  Future<void> _loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final themeModeString = prefs.getString('themeMode') ?? 'system';

    switch (themeModeString) {
      case 'light':
        _themeMode = ThemeMode.light;
        break;
      case 'dark':
        _themeMode = ThemeMode.dark;
        break;
      default:
        _themeMode = ThemeMode.system;
    }
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    String themeModeString;
    switch (mode) {
      case ThemeMode.light:
        themeModeString = 'light';
        break;
      case ThemeMode.dark:
        themeModeString = 'dark';
        break;
      default:
        themeModeString = 'system';
    }
    await prefs.setString('themeMode', themeModeString);
  }

  void toggleTheme() {
    if (_themeMode == ThemeMode.light) {
      setThemeMode(ThemeMode.dark);
    } else {
      setThemeMode(ThemeMode.light);
    }
  }
}

// Light Theme
ThemeData lightTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(
    primary: Colors.indigo.shade600,
    secondary: Colors.cyan.shade600,
    tertiary: Colors.teal.shade600,
    surface: Colors.white,
    error: Colors.red.shade600,
    onPrimary: Colors.white,
    onSecondary: Colors.white,
    onTertiary: Colors.white,
    onSurface: Colors.black87,
    outlineVariant: Colors.grey.shade300,
  ),
  scaffoldBackgroundColor: Colors.grey.shade50,
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.white,
    foregroundColor: Colors.black87,
    elevation: 0,
    centerTitle: true,
    surfaceTintColor: Colors.transparent,
    iconTheme: const IconThemeData(color: Colors.black87),
  ),
  cardTheme: CardThemeData(
    color: Colors.white,
    elevation: 1,
    surfaceTintColor: Colors.white,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.indigo.shade600,
      foregroundColor: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      elevation: 0,
    ),
  ),
  textTheme: TextTheme(
    displayLarge: const TextStyle(
      fontSize: 32,
      fontWeight: FontWeight.w900,
      color: Colors.black87,
      letterSpacing: -0.5,
    ),
    displayMedium: const TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.w800,
      color: Colors.black87,
      letterSpacing: -0.3,
    ),
    headlineSmall: const TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w800,
      color: Colors.black87,
      letterSpacing: -0.2,
    ),
    titleLarge: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w700,
      color: Colors.black87,
    ),
    bodyLarge: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: Colors.black87,
    ),
    bodyMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      color: Colors.grey.shade700,
    ),
    bodySmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      color: Colors.grey.shade600,
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Colors.grey.shade100,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey.shade300),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey.shade300),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.indigo.shade600, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  ),
  iconTheme: IconThemeData(color: Colors.indigo.shade600, size: 24),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: Colors.indigo.shade600,
    unselectedItemColor: Colors.grey.shade600,
    elevation: 8,
  ),
  dividerColor: Colors.grey.shade300,
);

// Dark Theme
ThemeData darkTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    primary: Colors.indigo.shade400,
    secondary: Colors.cyan.shade400,
    tertiary: Colors.teal.shade400,
    surface: const Color(0xFF1E1E1E),
    error: Colors.red.shade400,
    onPrimary: Colors.black,
    onSecondary: Colors.black,
    onTertiary: Colors.black,
    onSurface: const Color(0xFFE0E0E0),
    outlineVariant: Colors.grey.shade800,
  ),
  scaffoldBackgroundColor: const Color(0xFF121212),
  appBarTheme: const AppBarTheme(
    backgroundColor: Color(0xFF1E1E1E),
    foregroundColor: Color(0xFFE0E0E0),
    elevation: 0,
    centerTitle: true,
    surfaceTintColor: Colors.transparent,
    iconTheme: IconThemeData(color: Color(0xFFE0E0E0)),
  ),
  cardTheme: CardThemeData(
    color: const Color(0xFF1E1E1E),
    elevation: 1,
    surfaceTintColor: const Color(0xFF1E1E1E),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.indigo.shade400,
      foregroundColor: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      elevation: 0,
    ),
  ),
  textTheme: TextTheme(
    displayLarge: const TextStyle(
      fontSize: 32,
      fontWeight: FontWeight.w900,
      color: Color(0xFFE0E0E0),
      letterSpacing: -0.5,
    ),
    displayMedium: const TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.w800,
      color: Color(0xFFE0E0E0),
      letterSpacing: -0.3,
    ),
    headlineSmall: const TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w800,
      color: Color(0xFFE0E0E0),
      letterSpacing: -0.2,
    ),
    titleLarge: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w700,
      color: Color(0xFFE0E0E0),
    ),
    bodyLarge: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: Color(0xFFE0E0E0),
    ),
    bodyMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      color: Colors.grey.shade400,
    ),
    bodySmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      color: Colors.grey.shade500,
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color(0xFF2C2C2C),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey.shade800),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey.shade800),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.indigo.shade400, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
  ),
  iconTheme: IconThemeData(color: Colors.indigo.shade400, size: 24),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: const Color(0xFF1E1E1E),
    selectedItemColor: Colors.indigo.shade400,
    unselectedItemColor: Colors.grey.shade600,
    elevation: 8,
  ),
  dividerColor: Colors.grey.shade800,
);

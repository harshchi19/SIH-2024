// import 'package:flutter/material.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/home.dart';

// class DarkMode extends StatefulWidget {
//   @override
//   State<DarkMode> createState() => _DarkModeState();
// }

// class _DarkModeState extends State<DarkMode> {
//   ThemeMode _themeMode = ThemeMode.light; 

//   void _toggleTheme() {
//     setState(() {
//       _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Dark Mode Example',
//       theme: ThemeData.light(), 
//       darkTheme: ThemeData.dark(), 
//       themeMode: _themeMode, 
//       home: Home(toggleTheme: _toggleTheme),
//     );
//   }
// }






import 'package:flutter/material.dart';
import 'package:vaanivikas/Screens/Student Therapist/Screens/home.dart';
import 'package:vaanivikas/constants.dart';

// import 'Screens/Supervisor/Screens/home.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VaniVikas',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: kPrimaryLightColor),
        useMaterial3: true,
      ),
      // home: const Splashscreen(),
      home:  const Home(),
    );
  }
}
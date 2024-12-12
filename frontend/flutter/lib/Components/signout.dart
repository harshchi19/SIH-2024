

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> signOut(BuildContext context) async {
  try {
    final prefs = await SharedPreferences.getInstance();

    // Clear stored user session data
    await prefs.clear();

    // Navigate back to the login screen
    Navigator.of(context).pushReplacementNamed('/');
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Error signing out: $e")),
    );
  }
}
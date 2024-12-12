import 'package:flutter/material.dart';
import '../../../constants.dart';
import '../widgets/patient_timeline.dart';

class PatientDetailsPage extends StatelessWidget {
  final Map<String, String> patient;

  const PatientDetailsPage({super.key, required this.patient});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Main background is now white
      appBar: AppBar(
        title: Text(
          patient['name']!,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: kButtonColor,
        elevation: 3,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Basic Information Section
            Container(
              decoration: BoxDecoration(
                color: kButtonColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: kPrimaryColor.withOpacity(0.5), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: kPrimaryDarkColor.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  // CircleAvatar with initials
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: kButtonColor,
                    child: Text(
                      _getInitials(patient['name']!),
                      style: const TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        patient['name']!,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: kPrimaryDarkColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "ID: ${patient['id']!}",
                        style: const TextStyle(
                          fontSize: 16,
                          color: kPrimaryColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // History Section with light green gradient
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [kButtonColor, Colors.white],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: kPrimaryColor.withOpacity(0.4), width: 1),
                boxShadow: [
                  BoxShadow(
                    color: kSecondaryColor.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "History",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: kPrimaryDarkColor,
                    ),
                  ),
                  SizedBox(height: 8),
                  TimelineWidget(),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Notes Section
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [kButtonColor, Colors.white],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: kPrimaryDarkColor.withOpacity(0.4), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Notes",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: kPrimaryDarkColor,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "Patient has been undergoing therapy for the past 6 months. Reports indicate consistent improvement.",
                    style: TextStyle(
                      fontSize: 16,
                      color: kPrimaryColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper function to extract initials
  String _getInitials(String name) {
    final names = name.split(' ');
    final initials = names.length > 1
        ? '${names[0][0]}${names[1][0]}'
        : '${names[0][0]}${names[0][1]}';
    return initials.toUpperCase();
  }
}

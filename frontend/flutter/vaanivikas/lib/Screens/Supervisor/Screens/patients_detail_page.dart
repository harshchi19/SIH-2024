
import 'package:flutter/material.dart';
import '../../../constants.dart';
import '../widgets/patient_timeline.dart';

class PatientDetailsPage extends StatelessWidget {
  final Map<String, String> patient;

  const PatientDetailsPage({super.key, required this.patient});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(patient['name']!),
        backgroundColor: kPrimaryColor,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Basic Information
            Row(
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
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      patient['id']!,
                      style: const TextStyle(color: kPrimaryColor),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Timeline Section
            const Text(
              "History",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: kPrimaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const TimelineWidget(),

            // Notes or Additional Information
            const SizedBox(height: 20),
            const Text(
              "Notes",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: kPrimaryColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Patient has been undergoing therapy for the past 6 months. Reports indicate consistent improvement.",
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

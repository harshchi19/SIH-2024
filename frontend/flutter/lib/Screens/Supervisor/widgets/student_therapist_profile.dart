
import 'package:flutter/material.dart';
import '../../../constants.dart';

class TherapistProfilePage extends StatelessWidget {
  const TherapistProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Therapist Profile"),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Sarah Johnson",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text("Year 3 • Cognitive Behavioral Therapy"),
            const SizedBox(height: 16),
            const Divider(),
            const Text(
              "Assigned Patients",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: 15, // Replace with patient count
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text("Patient ${index + 1}"),
                    subtitle: LinearProgressIndicator(
                      value: (index + 1) / 20, // Replace with dynamic data
                      color: kButtonColor,
                      backgroundColor: kButtonColor.withOpacity(0.3),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

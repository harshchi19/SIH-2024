
import 'package:flutter/material.dart';
import '../../../constants.dart';
import '../widgets/student_therapist_profile.dart';

class StudentTherapistPage extends StatelessWidget {
  const StudentTherapistPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPrimaryLightColor.withOpacity(0.1),
      appBar: AppBar(
        title: const Text("Student Therapists"),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: 5, // Replace with dynamic data length
          itemBuilder: (context, index) {
            return TherapistCard(
              name: "Sarah Johnson",
              year: "Year 3",
              hoursLogged: 156,
              specialization: "Cognitive Behavioral Therapy",
              progress: 15 / 20,
              activePatients: 15,
              nextAppointment: "2:30 PM",
              onViewProfile: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TherapistProfilePage(),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class TherapistCard extends StatelessWidget {
  final String name;
  final String year;
  final int hoursLogged;
  final String specialization;
  final double progress;
  final int activePatients;
  final String nextAppointment;
  final VoidCallback onViewProfile;

  const TherapistCard({super.key, 
    required this.name,
    required this.year,
    required this.hoursLogged,
    required this.specialization,
    required this.progress,
    required this.activePatients,
    required this.nextAppointment,
    required this.onViewProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      color: Colors.white,
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  backgroundColor: kSecondaryColor,
                  child: Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: kPrimaryColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text("$year • $hoursLogged hours logged"),
                  ],
                ),
                const Spacer(),
                const Icon(Icons.star, color: Colors.amber),
                const Text("4.8", style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              specialization,
              style: const TextStyle(
                fontSize: 16,
                color: kPrimaryDarkColor,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: LinearProgressIndicator(
                    value: progress,
                    color: kButtonColor,
                    backgroundColor: kButtonColor.withOpacity(0.3),
                  ),
                ),
                const SizedBox(width: 8),
                Text("${(progress * 20).toInt()}/20"),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "$activePatients active patients",
                  style: const TextStyle(color: kSecondaryColor),
                ),
                Text(
                  "Next: $nextAppointment",
                  style: const TextStyle(color: kSecondaryColor),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: kButtonColor,
              ),
              onPressed: onViewProfile,
              child: const Center(
                child: Text("View Profile" ,
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

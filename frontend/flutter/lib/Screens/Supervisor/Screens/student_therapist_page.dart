import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../../constants.dart';

class StudentTherapistPage extends StatefulWidget {
  const StudentTherapistPage({super.key});

  @override
  _StudentTherapistPageState createState() => _StudentTherapistPageState();
}

class _StudentTherapistPageState extends State<StudentTherapistPage> {
  List<Map<String, dynamic>> studentTherapists = [];
  bool isLoading = false;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchStudentTherapists();
  }

  Future<void> fetchStudentTherapists() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final url =
          Uri.parse('http://10.0.2.2:4224/student-therapist/get-all-students');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          studentTherapists = data.cast<Map<String, dynamic>>(); // Updated data structure
          isLoading = false;
        });
      } else {
        setState(() {
          errorMessage =
              'Failed to fetch student therapists. Status code: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred while fetching data.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Student Therapists"),
        backgroundColor: kPrimaryColor,
        elevation: 0,
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage != null
              ? Center(
                  child: Text(
                    errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),
                )
              : studentTherapists.isEmpty
                  ? const Center(
                      child: Text(
                        'No student therapists found.',
                        style: TextStyle(color: kPrimaryDarkColor, fontSize: 16),
                      ),
                    )
                  : Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: ListView.builder(
                        itemCount: studentTherapists.length,
                        itemBuilder: (context, index) {
                          final student = studentTherapists[index];
                          return TherapistCard(
                            name: student['name'] ?? 'Name not provided',
                            email: student['email'] ?? 'Email not provided',
                            phoneNo:
                                student['phone_no'] ?? 'Phone not provided',
                            specialization: student['specialization']
                                    ?.replaceAll(RegExp(r'[\[\]\"]'), '') ??
                                'Specialization not provided',
                            qualifications: student['qualifications']
                                    ?.replaceAll(RegExp(r'[\[\]\"]'), '') ??
                                'Qualifications not provided',
                            availability: student['availability']
                                    ?.replaceAll(RegExp(r'[\[\]\"]'), '') ??
                                'Availability not provided',
                            location: student['location']?['city'] ??
                                'City not provided',
                            onViewProfile: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content:
                                      Text('Profile of ${student['name']}'),
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
  final String email;
  final String phoneNo;
  final String specialization;
  final String qualifications;
  final String availability;
  final String location;
  final VoidCallback onViewProfile;

  const TherapistCard({
    required this.name,
    required this.email,
    required this.phoneNo,
    required this.specialization,
    required this.qualifications,
    required this.availability,
    required this.location,
    required this.onViewProfile,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      elevation: 8,
      shadowColor: kPrimaryColor.withOpacity(0.2),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green.shade700, Colors.green.shade400],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  backgroundColor: kPrimaryColor,
                  child: Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      email,
                      style: const TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    Text(
                      phoneNo,
                      style: const TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
                const Spacer(),
                const Icon(Icons.star, color: Colors.amber),
                const Text("4.8", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Specialization: $specialization',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.white,
              ),
            ),
            Text(
              'Qualifications: $qualifications',
              style: const TextStyle(
                fontSize: 14,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Availability: $availability',
              style: const TextStyle(
                fontSize: 14,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Location: $location',
              style: const TextStyle(
                fontSize: 14,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green.shade800,
                elevation: 5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: onViewProfile,
              child: const Center(
                child: Text(
                  "View Profile",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

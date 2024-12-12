  import 'package:flutter/material.dart';

class AssignedTherapistsList extends StatelessWidget {
  const AssignedTherapistsList({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8.0),
        boxShadow: [
          BoxShadow(color: Colors.grey.shade200, blurRadius: 5.0),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Assigned Student Therapists",
            style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.0),
          TherapistItem(therapistName: "Ananya Sharma"),
          TherapistItem(therapistName: "Rohan Deshmukh"),
          TherapistItem(therapistName: "Ishita Patel"),
          TherapistItem(therapistName: "Karan Mehta"),
          TherapistItem(therapistName: "Sonya Gupta"),
          TherapistItem(therapistName: "Kiran Mehra"),
        ],
      ),
    );
  }
}

class TherapistItem extends StatelessWidget {
  final String therapistName;

  const TherapistItem({super.key, required this.therapistName});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: Colors.green[100],
            child: Icon(Icons.person, color: Colors.green[800]),
          ),
          const SizedBox(width: 12.0),
          Text(
            therapistName,
            style: const TextStyle(fontSize: 16.0),
          ),
        ],
      ),
    );
  }
}

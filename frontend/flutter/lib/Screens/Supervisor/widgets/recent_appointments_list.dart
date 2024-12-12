import 'package:flutter/material.dart';

class RecentAppointmentsList extends StatelessWidget {
  const RecentAppointmentsList({super.key});

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
          Text("Recent Appointments", style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold)),
          SizedBox(height: 8.0),
          AppointmentItem(patientName: "Aarav Patel", room: "Room No. 32"),
          AppointmentItem(patientName: "Vivaan Singh", room: "Room No. 25"),
        ],
      ),
    );
  }
}

class AppointmentItem extends StatelessWidget {
  final String patientName;
  final String room;

  const AppointmentItem({super.key, required this.patientName, required this.room});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(patientName),
      subtitle: Text(room),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:vaanivikas/constants.dart';

class MeetingDetailPage extends StatelessWidget {
  final String title;
  final String supervisor;
  final String patient;
  final String roomNo;
  final String date;
  final String startTime;
  final String endTime;
  final String description;

  const MeetingDetailPage({
    super.key,
    required this.title,
    required this.supervisor,
    required this.patient,
    required this.roomNo,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Meeting Details"),
        backgroundColor: kPrimaryColor,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFFa8e063), // Light green
              Color(0xFF56ab2f), // Dark green
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: Card(
              elevation: 12,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              shadowColor: Colors.greenAccent,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.9),
                      Colors.white.withOpacity(0.5),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 8,
                      offset: Offset(2, 2),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF56ab2f), // Matching green
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    DetailRow(
                      label: "Supervisor:",
                      value: supervisor,
                    ),
                    DetailRow(
                      label: "Patient:",
                      value: patient,
                    ),
                    DetailRow(
                      label: "Room No:",
                      value: roomNo,
                    ),
                    DetailRow(
                      label: "Date:",
                      value: date,
                    ),
                    DetailRow(
                      label: "Start Time:",
                      value: startTime,
                    ),
                    DetailRow(
                      label: "End Time:",
                      value: endTime,
                    ),
                    const Divider(height: 30, thickness: 1.5),
                    const Text(
                      "Description:",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.black87,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const DetailRow({
    super.key,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                color: Colors.black87,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
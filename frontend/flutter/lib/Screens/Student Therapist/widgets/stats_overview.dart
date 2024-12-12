// import 'package:flutter/material.dart';

// class StatsOverview extends StatelessWidget {
//   const StatsOverview({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const Row(
//       mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//       children: [
//         Expanded(child: StatCard(title: "Total Patients", count: 348)),
//         Expanded(child: StatCard(title: "Student Therapists", count: 12)),
//         Expanded(child: StatCard(title: "Appointments", count: 678)),
//         Expanded(child: StatCard(title: "Therapy Sessions", count: 567)),
//       ],
//     );
//   }
// }

// class StatCard extends StatelessWidget {
//   final String title;
//   final int count;

//   const StatCard({super.key, required this.title, required this.count});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       margin: const EdgeInsets.symmetric(horizontal: 8.0),
//       padding: const EdgeInsets.all(16.0),
//       decoration: BoxDecoration(
//         color: Colors.blue[50],
//         borderRadius: BorderRadius.circular(8.0),
//       ),
//       child: Column(
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           Text(
//             count.toString(),
//             style: const TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
//           ),
//           const SizedBox(height: 8.0),
//           Text(title, style: const TextStyle(fontSize: 16.0)),
//         ],
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';

class StatsOverview extends StatelessWidget {
  const StatsOverview({super.key});

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Expanded(child: StatCard(title: "Total Patients", count: 348)),
              Expanded(child: StatCard(title: "Students", count: 12)),
            ],
          ),
          SizedBox(height: 8.0), // Add spacing between rows
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Expanded(child: StatCard(title: "Appointments", count: 678)),
              Expanded(child: StatCard(title: "Sessions", count: 567)),
            ],
          ),
        ],
      ),
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final int count;

  const StatCard({super.key, required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(8.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: Colors.blue.shade200, width: 1),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            count.toString(),
            style: const TextStyle(fontSize: 28.0, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8.0),
          Text(
            title.replaceAll('-', '\n'), // Split text at hyphens and place on a new line
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 14.0),
          ),
        ],
      ),
    );
  }
}

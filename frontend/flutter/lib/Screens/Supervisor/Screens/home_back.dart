import 'dart:async';
import 'package:flutter/material.dart';
import '../../../api_service.dart';
import '../../../constants.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  late Future<Map<String, dynamic>> _dashboardData;

  @override
  void initState() {
    super.initState();
    _dashboardData = ApiService.getSupervisorDashboardData();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _dashboardData,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text("Error: ${snapshot.error}"));
        } else {
          final data = snapshot.data!;
          return Scaffold(
            appBar: AppBar(
              title: const Text("Supervisor Dashboard"),
              backgroundColor: kPrimaryColor,
            ),
            body: Column(
              children: [
                Text("Total Patients: ${data['totalPatients']}"),
                Text("Total Therapists: ${data['totalTherapists']}"),
                // Use more widgets like StatsOverview, charts, etc.
              ],
            ),
          );
        }
      },
    );
  }
}

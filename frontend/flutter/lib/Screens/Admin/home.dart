import 'package:flutter/material.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/widgets/bar_chart_widget.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/widgets/pie_chart_widget.dart';
import 'package:vaanivikas/Screens/admin/sidebar_admin.dart';
import 'package:vaanivikas/constants.dart';
import 'line_chart_widget.dart';
import 'stats_overview.dart';

class AdminHome extends StatefulWidget {
  const AdminHome({super.key});

  @override
  State<AdminHome> createState() => _AdminHomeState();
}

class _AdminHomeState extends State<AdminHome> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        drawer: const AdminNav(),
        appBar: AppBar(
          title: const Text('Dashboard'),
          backgroundColor: kPrimaryColor,
          elevation: 0,
        ),
        body: Stack(
          children: [
            // Background gradient
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [kPrimaryLightColor, kPrimaryDarkColor],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
            SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Overview with glossy card design
                  _buildGlassCard(
                    child: const SizedBox(
                      height: 200,
                      child: StatsOverview(),
                    ),
                  ),
                  const SizedBox(height: 16.0),

                  // Bar Chart with border and gradient
                  _buildGradientCard(
                    child: const SizedBox(
                      height: 300,
                      child: BarChartPage(),
                    ),
                  ),
                  const SizedBox(height: 16.0),

                  // Pie Chart with border and gradient
                  _buildGradientCard(
                    child: const SizedBox(
                      height: 400,
                      child: PieChartPage(),
                    ),
                  ),
                  const SizedBox(height: 16.0),

                  // Line Chart with border and gradient
                  _buildGradientCard(
                    child: const SizedBox(
                      height: 300,
                      child: LineChartPage(),
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

  // Helper method for creating a glossy card
  Widget _buildGlassCard({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.4), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(10),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: child,
      ),
    );
  }

  // Helper method for creating a card with gradient and border
  Widget _buildGradientCard({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [kButtonColor, kPrimaryColor],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: kSecondaryColor.withOpacity(0.5), width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(10),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: child,
      ),
    );
  }
}

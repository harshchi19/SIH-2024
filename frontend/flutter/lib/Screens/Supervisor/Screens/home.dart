import 'package:flutter/material.dart';
import 'package:vaanivikas/Components/navbar.dart';

import 'package:vaanivikas/constants.dart';
import '../../../Components/sidebar_supervisor.dart';
import '../widgets/bar_chart_widget.dart';
import '../widgets/line_chart_widget.dart';
import '../widgets/pie_chart_widget.dart';
import '../widgets/stats_overview.dart';

class SupervisorHome extends StatefulWidget {

  @override
  State<SupervisorHome> createState() => _SupervisorHomeState();
}

class _SupervisorHomeState extends State<SupervisorHome> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        drawer: SUPNavbar(),
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
                      height: 300,
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

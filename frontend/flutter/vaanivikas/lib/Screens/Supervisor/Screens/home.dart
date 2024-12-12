
import 'package:flutter/material.dart';
import 'package:vaanivikas/constants.dart';
import '../../../Components/sidebar_supervisor.dart';
import '../widgets/bar_chart_widget.dart';
import '../widgets/line_chart_widget.dart';
import '../widgets/pie_chart_widget.dart';
import '../widgets/stats_overview.dart';

class Home extends StatefulWidget {
  
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  late final VoidCallback toggleTheme;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        drawer: const Navbar(),
        appBar: AppBar(
          title: const Text('Dashboard'),
          backgroundColor: kPrimaryColor,
          elevation: 0,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Add size constraints to StatsOverview or other widgets
              SizedBox(
                height: 200, // Example height for charts
                child: StatsOverview(),
              ),
              const SizedBox(height: 16.0),
              const SizedBox(
                height: 300, // Define a fixed height for MainScreen
                child: BarChartPage(),
              ),
              const SizedBox(
                height: 300, 
                child: PieChartPage(),
              ),
              const SizedBox(
                height: 300, // Define a fixed height for MainScreen
                // child: DashboardPage(),
                child: LineChartPage(),
              ),
              const SizedBox(height: 16.0),
              // Add other widgets here with appropriate height constraints
              // SizedBox(
              //   height: 200, 
              //   child: NotificationPanel(),
              // ),
              // SizedBox(height: 16.0),
              // SizedBox(
              //   height: 200,
              //   child: AssignedTherapistsList(),
              // ),
            ],
          ),
        ),
      ),
    );
  }
}

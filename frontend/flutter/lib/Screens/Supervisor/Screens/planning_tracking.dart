import 'package:flutter/material.dart';
import 'package:timelines/timelines.dart';
import 'package:vaanivikas/constants.dart';

class PlanningAndTrackingPage extends StatelessWidget {
  final List<String> timelineSteps = [
    'Define Goals',
    'Brainstorm Ideas',
    'Set Deadlines',
    'Assign Responsibilities',
    'Track Progress',
    'Review Outcomes',
  ];

   PlanningAndTrackingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Planning and Tracking'),
        backgroundColor: kPrimaryLightColor,
      ),
      body: Timeline.tileBuilder(
        theme: TimelineThemeData(
          connectorTheme: const ConnectorThemeData(
            color: kPrimaryDarkColor,
            thickness: 3.0,
          ),
          indicatorTheme: const IndicatorThemeData(
            color: kColor,
            size: 20.0,
          ),
        ),
        builder: TimelineTileBuilder.connected(
          itemCount: timelineSteps.length,
          connectorBuilder: (_, index, type) => const SolidLineConnector(),
          indicatorBuilder: (_, __) => const DotIndicator(),
          contentsBuilder: (context, index) => GestureDetector(
            onTap: () {
              // Navigate to the detailed planning screen for each step
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PlanningStepDetailPage(
                    stepName: timelineSteps[index],
                  ),
                ),
              );
            },
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    timelineSteps[index],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class PlanningStepDetailPage extends StatelessWidget {
  final String stepName;

  const PlanningStepDetailPage({super.key, required this.stepName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(stepName),
        backgroundColor: kPrimaryLightColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Plan for: $stepName',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              decoration: InputDecoration(
                labelText: 'Enter details for $stepName',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 20),
            TextField(
              decoration: InputDecoration(
                labelText: 'Add any notes for $stepName',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
              maxLines: 5,
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                // Save or submit the data
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Planning details saved!'),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: kColor,
              ),
              child: const Text(
                'Save',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

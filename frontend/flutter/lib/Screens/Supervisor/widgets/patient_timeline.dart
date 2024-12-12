import 'package:flutter/material.dart';
import 'package:timelines/timelines.dart';
import '../../../constants.dart';

class TimelineWidget extends StatelessWidget {
  const TimelineWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return FixedTimeline.tileBuilder(
      builder: TimelineTileBuilder.connected(
        connectionDirection: ConnectionDirection.before,
        itemCount: 4,
        contentsBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              _getContent(index),
              style: const TextStyle(fontSize: 16),
            ),
          );
        },
        indicatorBuilder: (context, index) {
          return const DotIndicator(color: kPrimaryLightColor);
        },
        connectorBuilder: (context, index, type) {
          return const SolidLineConnector(color: kPrimaryLightColor);
        },
      ),
    );
  }

  String _getContent(int index) {
    switch (index) {
      case 0:
        return "Appointment booked on Nov 10, 2024.";
      case 1:
        return "Initial diagnosis conducted.";
      case 2:
        return "Therapy session completed successfully.";
      case 3:
        return "Follow-up session scheduled for Dec 5, 2024.";
      default:
        return "";
    }
  }
}

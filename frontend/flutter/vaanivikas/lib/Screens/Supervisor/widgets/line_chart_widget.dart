
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class LineChartPage extends StatelessWidget {
  const LineChartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SfCartesianChart(
          primaryXAxis: CategoryAxis(),
          primaryYAxis: NumericAxis(labelFormat: '{value}'),
          series: <ChartSeries>[
            LineSeries<LineChartModel, String>(
              dataSource: [
                LineChartModel('Day 1', 2),
                LineChartModel('Day 2', 3),
                LineChartModel('Day 3', 4),
                LineChartModel('Day 4', 6),
                LineChartModel('Day 5', 8),
                LineChartModel('Day 6', 12),
                LineChartModel('Day 7', 14),
              ],
              xValueMapper: (LineChartModel data, _) => data.day,
              yValueMapper: (LineChartModel data, _) => data.count,
              color: Colors.teal,
              markerSettings: const MarkerSettings(isVisible: true),
              dataLabelSettings: const DataLabelSettings(isVisible: true),
            ),
          ],
        ),
      ),
    );
  }
}

class LineChartModel {
  final String day;
  final int count;

  LineChartModel(this.day, this.count);
}
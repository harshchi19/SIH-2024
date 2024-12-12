import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class PieChartPage extends StatelessWidget {
  const PieChartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SfCircularChart(
          legend: const Legend(isVisible: true, position: LegendPosition.bottom),
          series: <CircularSeries>[
            PieSeries<PieChartModel, String>(
              dataSource: [
                PieChartModel('Recovered', 45, Colors.blue),
                PieChartModel('Under Treatment', 30, Colors.pink),
                PieChartModel('Critical', 10, Colors.red),
              ],
              xValueMapper: (PieChartModel data, _) => data.status,
              yValueMapper: (PieChartModel data, _) => data.count,
              dataLabelSettings: const DataLabelSettings(isVisible: true),
            ),
          ],
        ),
      ),
    );
  }
}

class PieChartModel {
  final String status;
  final int count;
  final Color color;

  PieChartModel(this.status, this.count, this.color);
}

import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class BarChartPage extends StatelessWidget {
  const BarChartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SfCartesianChart(
          primaryXAxis: CategoryAxis(),
          primaryYAxis: NumericAxis(labelFormat: '{value}'),
          series: <ChartSeries>[
            BarSeries<BarChartModel, String>(
              dataSource: [
                BarChartModel('Recovered', 45),
                BarChartModel('Under Treatment', 30),
                BarChartModel('Critical', 10),
              ],
              xValueMapper: (BarChartModel data, _) => data.status,
              yValueMapper: (BarChartModel data, _) => data.count,
              color: Colors.teal,
              dataLabelSettings: const DataLabelSettings(isVisible: true),
            ),
          ],
        ),
      ),
    );
  }
}

class BarChartModel {
  final String status;
  final int count;

  BarChartModel(this.status, this.count);
}

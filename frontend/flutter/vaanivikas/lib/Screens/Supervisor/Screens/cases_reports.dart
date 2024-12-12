
import 'package:flutter/material.dart';

import '../../../constants.dart';
import 'cases_reports_detail_screen.dart';

class CasesAndReportsPage extends StatelessWidget {
  final List<Map<String, String>> cases = [
    {
      'id': '#CMP801',
      'therapist': 'Ananya Sharma',
      'appointment': 'Aarav Patel',
      'details': 'Babbling',
      'date': 'Just now'
    },
    {
      'id': '#CMP802',
      'therapist': 'Rohan Deshmukh',
      'appointment': 'Vivaan Singh',
      'details': 'Audiology',
      'date': 'A minute ago'
    },
    {
      'id': '#CMP803',
      'therapist': 'Ishita Patel',
      'appointment': 'Aarav Patel',
      'details': 'Hearing Aid',
      'date': '1 hour ago'
    },
    {
      'id': '#CMP804',
      'therapist': 'Karan Mehta',
      'appointment': 'Shanaya Sharma',
      'details': 'Caucheology',
      'date': 'Yesterday'
    },
    {
      'id': '#CMP805',
      'therapist': 'Sanya Gupta',
      'appointment': 'Vivaan Singh',
      'details': 'Audiology',
      'date': 'Feb 2, 2024'
    },
  ];

  const CasesAndReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cases and Reports'),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: cases.length,
                itemBuilder: (context, index) {
                  final caseItem = cases[index];
                  return Card(
                    elevation: 4,
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    child: ListTile(
                      title: Text(caseItem['id']!),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Therapist: ${caseItem['therapist']}'),
                          Text('Appointment: ${caseItem['appointment']}'),
                          Text('Details: ${caseItem['details']}'),
                          Text('Date: ${caseItem['date']}'),
                        ],
                      ),
                      trailing: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CaseDetailsPage(
                                caseId: caseItem['id']!,
                                details: caseItem,
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kPrimaryLightColor,
                        ),
                        child: const Text('View Report',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

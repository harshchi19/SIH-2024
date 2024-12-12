import 'package:flutter/material.dart';

import 'cases_reports_detail_screen.dart';
import '../../../constants.dart';


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

  CasesAndReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cases and Reports'),
        backgroundColor: kPrimaryColor,
        elevation: 6,
        shadowColor: kPrimaryDarkColor,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [kPrimaryColor, kSecondaryColor],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: cases.length,
                  itemBuilder: (context, index) {
                    final caseItem = cases[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15.0),
                        side: BorderSide(color: kPrimaryLightColor, width: 1),
                      ),
                      elevation: 6,
                      margin: const EdgeInsets.symmetric(vertical: 10.0),
                      shadowColor: kColor,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [kPrimaryLightColor.withOpacity(0.7), kPrimaryDarkColor.withOpacity(0.7)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(15.0),
                          boxShadow: [
                            BoxShadow(
                              color: kSecondaryColor.withOpacity(0.5),
                              blurRadius: 8,
                              offset: const Offset(2, 4),
                            ),
                          ],
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(12.0),
                          title: Text(
                            caseItem['id']!,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Therapist: ${caseItem['therapist']}',
                                style: const TextStyle(color: Colors.white70),
                              ),
                              Text(
                                'Appointment: ${caseItem['appointment']}',
                                style: const TextStyle(color: Colors.white70),
                              ),
                              Text(
                                'Details: ${caseItem['details']}',
                                style: const TextStyle(color: Colors.white70),
                              ),
                              Text(
                                'Date: ${caseItem['date']}',
                                style: const TextStyle(color: Colors.white70),
                              ),
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
                              backgroundColor: kButtonColor,
                              shadowColor: Colors.black45,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: const Text(
                              'View Report',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
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
      ),
    );
  }
}

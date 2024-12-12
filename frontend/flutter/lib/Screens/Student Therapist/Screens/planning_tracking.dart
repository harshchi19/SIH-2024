// import 'package:flutter/material.dart';
// import 'package:timelines/timelines.dart';
// import 'package:vaanivikas/constants.dart';

// class PlanningAndTrackingPage extends StatelessWidget {
//   final List<String> timelineSteps = [
//     'Define Goals',
//     'Brainstorm Ideas',
//     'Set Deadlines',
//     'Assign Responsibilities',
//     'Track Progress',
//     'Review Outcomes',
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Planning and Tracking'),
//         backgroundColor: kPrimaryLightColor,
//       ),
//       body: Timeline.tileBuilder(
//         theme: TimelineThemeData(
//           connectorTheme: const ConnectorThemeData(
//             color: kPrimaryDarkColor,
//             thickness: 3.0,
//           ),
//           indicatorTheme: const IndicatorThemeData(
//             color: kColor,
//             size: 20.0,
//           ),
//         ),
//         builder: TimelineTileBuilder.connected(
//           itemCount: timelineSteps.length,
//           connectorBuilder: (_, index, type) => const SolidLineConnector(),
//           indicatorBuilder: (_, __) => const DotIndicator(),
//           contentsBuilder: (context, index) => GestureDetector(
//             onTap: () {
//               // Navigate to the detailed planning screen for each step
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => PlanningStepDetailPage(
//                     stepName: timelineSteps[index],
//                   ),
//                 ),
//               );
//             },
//             child: Padding(
//               padding: const EdgeInsets.all(16.0),
//               child: Card(
//                 elevation: 4,
//                 child: Padding(
//                   padding: const EdgeInsets.all(16.0),
//                   child: Text(
//                     timelineSteps[index],
//                     style: const TextStyle(
//                       fontSize: 16,
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class PlanningStepDetailPage extends StatelessWidget {
//   final String stepName;

//   const PlanningStepDetailPage({Key? key, required this.stepName})
//       : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(stepName),
//         backgroundColor: kPrimaryLightColor,
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text(
//               'Plan for: $stepName',
//               style: const TextStyle(
//                 fontSize: 20,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 20),
//             TextField(
//               decoration: InputDecoration(
//                 labelText: 'Enter details for $stepName',
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(10.0),
//                 ),
//               ),
//               maxLines: 3,
//             ),
//             const SizedBox(height: 20),
//             TextField(
//               decoration: InputDecoration(
//                 labelText: 'Add any notes for $stepName',
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(10.0),
//                 ),
//               ),
//               maxLines: 5,
//             ),
//             const Spacer(),
//             ElevatedButton(
//               onPressed: () {
//                 // Save or submit the data
//                 ScaffoldMessenger.of(context).showSnackBar(
//                   const SnackBar(
//                     content: Text('Planning details saved!'),
//                   ),
//                 );
//               },
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: kColor,
//               ),
//               child: const Text(
//                 'Save',
//                 style: TextStyle(fontWeight: FontWeight.bold),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';

class PlanningStepDetailPage extends StatefulWidget {
  const PlanningStepDetailPage({super.key});

  @override
  _PlanningStepDetailPageState createState() => _PlanningStepDetailPageState();
}

class _PlanningStepDetailPageState extends State<PlanningStepDetailPage> {
  File? _selectedPdf;
  String? treatmentPlan = '';

  // Function to pick the PDF file
  Future<void> _pickPdf() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
    if (result != null) {
      setState(() {
        _selectedPdf = File(result.files.single.path!);
      });
    }
  }

  // Function to send PDF to the backend and fetch the treatment plan
  Future<void> _generateTreatmentPlan() async {
    const String apiUrl = 'http://192.168.183.34:8001/generate-treatment-plan/';

    if (_selectedPdf == null) {
      setState(() {
        treatmentPlan = 'Please select a PDF file first.';
      });
      return;
    }

    try {
      var request = http.MultipartRequest('POST', Uri.parse(apiUrl));

      // Add the PDF file
      request.files.add(await http.MultipartFile.fromPath('pdf', _selectedPdf!.path));

      var response = await request.send();

      if (response.statusCode == 200) {
        // Parse the response and display the treatment plan
        String responseBody = await response.stream.bytesToString();
        setState(() {
          treatmentPlan = responseBody;
        });
      } else {
        setState(() {
          treatmentPlan = 'Failed to generate treatment plan. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        treatmentPlan = 'Error: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Generate Treatment Plan'),
        backgroundColor: Colors.green, // AppBar color set to green
        elevation: 4,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title Text
              const Text(
                'Upload a Patient PDF',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,  // Title color matching AppBar
                ),
              ),
              const SizedBox(height: 20),

              // Select PDF Button
              ElevatedButton(
                onPressed: _pickPdf,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green, // Same color for both buttons
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12), // Rounded corners
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                  elevation: 5,
                ),
                child: const Text(
                  'Select PDF File',
                  style: TextStyle(fontSize: 16),
                ),
              ),
              const SizedBox(height: 20),

              // Generate Treatment Plan Button
              ElevatedButton(
                onPressed: _generateTreatmentPlan,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green, // Same color for both buttons
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12), // Rounded corners
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                  elevation: 5,
                ),
                child: const Text(
                  'Generate Treatment Plan',
                  style: TextStyle(fontSize: 16),
                ),
              ),
              const SizedBox(height: 20),

              // Treatment Plan Text Display
              if (treatmentPlan != null) ...[
                const Text(
                  'Treatment Plan:',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green, // Heading color matching AppBar
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: Colors.white, // White background for the treatment plan box
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      treatmentPlan ?? '',
                      style: const TextStyle(fontSize: 16, color: Colors.black),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

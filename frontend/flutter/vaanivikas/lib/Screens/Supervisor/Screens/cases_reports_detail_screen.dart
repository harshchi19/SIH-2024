
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:open_filex/open_filex.dart';
import 'package:vaanivikas/constants.dart';

class CaseDetailsPage extends StatefulWidget {
  final String caseId;
  final Map<String, String> details;

  const CaseDetailsPage({super.key, required this.caseId, required this.details});

  @override
  State<CaseDetailsPage> createState() => _CaseDetailsPageState();
}

class _CaseDetailsPageState extends State<CaseDetailsPage> {
  String? uploadedFileName;

  void _uploadReport() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        uploadedFileName = result.files.single.name;
      });
      // Handle file upload logic here (e.g., send to server)
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Uploaded: ${result.files.single.name}')),
      );
    }
  }

  void _downloadReport() {
    // Logic to download the report
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Downloading report...')),
    );

    // Example: Open a sample file (you can replace this with actual file logic)
    if (uploadedFileName != null) {
      OpenFilex.open(uploadedFileName!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final details = widget.details;

    return Scaffold(
      appBar: AppBar(
        title: Text('Details - ${widget.caseId}'),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Case Details',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text('Therapist: ${details['therapist']}'),
            Text('Appointment: ${details['appointment']}'),
            Text('Details: ${details['details']}'),
            Text('Date: ${details['date']}'),
            const SizedBox(height: 24),
            const Divider(),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _uploadReport,
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload Report',
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: kColor,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _downloadReport,
              icon: const Icon(Icons.download),
              label: const Text('Download Report',
                style: TextStyle(color: Colors.white),
                ),
              style: ElevatedButton.styleFrom(
                backgroundColor: kColor,
              ),
            ),
            if (uploadedFileName != null) ...[
              const SizedBox(height: 16),
              Text('Uploaded Report: $uploadedFileName'),
            ],
          ],
        ),
      ),
    );
  }
}

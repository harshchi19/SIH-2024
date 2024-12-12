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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Uploaded: ${result.files.single.name}')),
      );
    }
  }

  void _downloadReport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Downloading report...')),
    );

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
        elevation: 6,
        shadowColor: kPrimaryDarkColor,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [kPrimaryLightColor, kSecondaryColor],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [kPrimaryLightColor.withOpacity(0.7), kPrimaryDarkColor.withOpacity(0.7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12.0),
                  boxShadow: [
                    BoxShadow(
                      color: kSecondaryColor.withOpacity(0.4),
                      blurRadius: 10,
                      offset: const Offset(2, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Case Details',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Therapist: ${details['therapist']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Appointment: ${details['appointment']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Details: ${details['details']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Date: ${details['date']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Container(
                height: 1,
                color: kPrimaryDarkColor.withOpacity(0.5),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _uploadReport,
                icon: const Icon(Icons.upload_file, color: Colors.white),
                label: const Text(
                  'Upload Report',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  shadowColor: Colors.black45,
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _downloadReport,
                icon: const Icon(Icons.download, color: Colors.white),
                label: const Text(
                  'Download Report',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  shadowColor: Colors.black45,
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              if (uploadedFileName != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [kPrimaryLightColor.withOpacity(0.5), kPrimaryDarkColor.withOpacity(0.5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Text(
                    'Uploaded Report: $uploadedFileName',
                    style: const TextStyle(color: Colors.white, fontSize: 16),
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

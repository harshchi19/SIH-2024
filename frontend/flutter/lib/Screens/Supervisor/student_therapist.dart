import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'package:http_parser/http_parser.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: StudentTherapistScreen(),
  ));
}

class StudentTherapistScreen extends StatefulWidget {
  @override
  _StudentTherapistScreenState createState() => _StudentTherapistScreenState();
}

class _StudentTherapistScreenState extends State<StudentTherapistScreen> {
  final String baseUrl = "http://10.0.2.2:8004"; // Replace with your FastAPI server address
  bool isUploading = false;
  String? selectedFilePath;

  // Pick a file using FilePicker
  Future<void> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'], // Only allow PDF files
    );

    if (result != null) {
      setState(() {
        selectedFilePath = result.files.single.path;
      });
    }
  }

  // Upload the selected file to the server
  Future<void> uploadFile() async {
    if (selectedFilePath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please select a file first.")),
      );
      return;
    }

    setState(() {
      isUploading = true;
    });

    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse("$baseUrl/upload_file/"), // Endpoint for file upload
      );
      request.files.add(await http.MultipartFile.fromPath(
        'file',
        selectedFilePath!,
        contentType: MediaType('application', 'pdf'),
      ));

      var response = await request.send();

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("File uploaded successfully!")),
        );
        setState(() {
          selectedFilePath = null;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to upload file. Status code: ${response.statusCode}")),
        );
      }
    } catch (e) {
      print("Error uploading file: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred during file upload.")),
      );
    } finally {
      setState(() {
        isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Student Therapist Panel"),
        backgroundColor: Colors.deepPurple,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              onPressed: pickFile,
              icon: Icon(Icons.upload_file),
              label: Text("Select File"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
              ),
            ),
            if (selectedFilePath != null) ...[
              SizedBox(height: 16),
              Text("Selected File: ${selectedFilePath!.split('/').last}"),
            ],
            SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: isUploading ? null : uploadFile,
              icon: isUploading ? CircularProgressIndicator() : Icon(Icons.cloud_upload),
              label: Text(isUploading ? "Uploading..." : "Upload File"),
              style: ElevatedButton.styleFrom(
                backgroundColor: isUploading ? Colors.grey : Colors.deepPurple,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

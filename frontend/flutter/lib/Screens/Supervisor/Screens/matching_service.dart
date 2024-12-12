import 'dart:convert';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class UploadScreen extends StatefulWidget {
  @override
  _UploadScreenState createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  bool isLoading = false;
  List<Map<String, dynamic>> similarityScores = [];

  final String serverUrl =
      'http://10.0.2.2:8003/calculate_similarity/';

  Future<void> uploadPdfAndFetchSimilarity() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      File file = File(result.files.single.path!);
      setState(() {
        isLoading = true;
      });

      try {
        var request = http.MultipartRequest(
          'POST',
          Uri.parse(serverUrl),
        );

        request.files.add(
          await http.MultipartFile.fromPath('pdf_file', file.path),
        );

        var response = await request.send();

        if (response.statusCode == 200) {
          var responseData = await response.stream.bytesToString();
          var data = jsonDecode(responseData);

          setState(() {
            similarityScores =
                List<Map<String, dynamic>>.from(data['top_similarities']);
            isLoading = false;
          });
        } else {
          showError(
              "Failed to fetch similarity scores. Status code: ${response.statusCode}");
        }
      } catch (e) {
        showError("Error occurred: $e");
      }
    } else {
      showError("No file selected.");
    }
  }

  void showError(String message) {
    setState(() {
      isLoading = false;
    });
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('PDF Similarity Checker')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: uploadPdfAndFetchSimilarity,
              child: const Text('Upload PDF'),
            ),
            if (isLoading)
              const CircularProgressIndicator()
            else if (similarityScores.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: similarityScores.length,
                  itemBuilder: (context, index) {
                    final item = similarityScores[index];
                    return ListTile(
                      title: Text(item['filename']),
                      subtitle: Text(
                          "Similarity Score: ${(item['similarity_score'] * 100).toStringAsFixed(2)}%"),
                    );
                  },
                ),
              )
            else
              const Text('No results to display.'),
          ],
        ),
      ),
    );
  }
}

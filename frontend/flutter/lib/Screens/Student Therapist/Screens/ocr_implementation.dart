// import 'package:flutter/material.dart';
// import 'package:file_picker/file_picker.dart';
// import 'package:permission_handler/permission_handler.dart';
// import 'package:http/http.dart' as http;
// import 'dart:io';
// import 'dart:convert';

// class MedicalCaseUploadPage extends StatefulWidget {
//   @override
//   _MedicalCaseUploadPageState createState() => _MedicalCaseUploadPageState();
// }

// class _MedicalCaseUploadPageState extends State<MedicalCaseUploadPage> {
//   List<File> _selectedFiles = [];
//   bool _isLoading = false;

//   Future<void> _requestCameraPermission() async {
//     final status = await Permission.camera.request();
//     if (status != PermissionStatus.granted) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Camera permission is required')),
//       );
//     }
//   }

//   Future<void> _pickFiles() async {
//     FilePickerResult? result = await FilePicker.platform.pickFiles(
//       type: FileType.custom,
//       allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
//       allowMultiple: true,
//     );

//     if (result != null) {
//       setState(() {
//         _selectedFiles = result.paths.map((path) => File(path!)).toList();
//       });
//     }
//   }

//   Future<void> _uploadFiles() async {
//     if (_selectedFiles.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Please select files first')),
//       );
//       return;
//     }

//     setState(() {
//       _isLoading = true;
//     });

//     try {
//       var request = http.MultipartRequest(
//         'POST',
//         Uri.parse('http://10.0.2.2:8000/process_multiple_documents/'),
//       );

//       for (var file in _selectedFiles) {
//         request.files.add(await http.MultipartFile.fromPath(
//           'files',
//           file.path,
//         ));
//       }

//       var streamedResponse = await request.send();
//       var response = await http.Response.fromStream(streamedResponse);

//       if (response.statusCode == 200) {
//         var data = json.decode(response.body);
//         _showResultsDialog(data);
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text('Upload failed: ${response.reasonPhrase}')),
//         );
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Upload failed: $e')),
//       );
//       print(e);
//     } finally {
//       setState(() {
//         _isLoading = false;
//       });
//     }
//   }

//   void _showResultsDialog(dynamic results) {
//     showDialog(
//       context: context,
//       builder: (context) => AlertDialog(
//         title: const Text('Processing Results'),
//         content: SingleChildScrollView(
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               for (var result in results)
//                 Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       'Filename: ${result['filename']}',
//                       style: const TextStyle(fontWeight: FontWeight.bold),
//                     ),
//                     Text('Case Name: ${result['case_data']['case_name']}'),
//                     Text('Case No: ${result['case_data']['case_no']}'),
//                     Text('Provisional Diagnosis: ${result['case_data']['provisional_diagnosis']}'),
//                     const Divider(),
//                   ],
//                 ),
//             ],
//           ),
//         ),
//         actions: [
//           TextButton(
//             onPressed: () => Navigator.of(context).pop(),
//             child: const Text('Close'),
//           ),
//         ],
//       ),
//     );
//   }

//   @override
//   void initState() {
//     super.initState();
//     _requestCameraPermission();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('OCR Implementation'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             ElevatedButton(
//               onPressed: _pickFiles,
//               child: const Text('Select Files'),
//             ),
//             const SizedBox(height: 20),
//             _selectedFiles.isNotEmpty
//                 ? Column(
//                     children: [
//                       Text('Selected Files: ${_selectedFiles.length}'),
//                       ..._selectedFiles.map(
//                         (file) => Text(file.path.split('/').last),
//                       ),
//                     ],
//                   )
//                 : const Text('No files selected'),
//             const SizedBox(height: 20),
//             _isLoading
//                 ? const CircularProgressIndicator()
//                 : ElevatedButton(
//                     onPressed: _uploadFiles,
//                     child: const Text('Upload & Process'),
//                   ),
//           ],
//         ),
//       ),
//     );
//   }
// }
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class CaseProcessorScreen extends StatefulWidget {
  const CaseProcessorScreen({super.key});

  @override
  _CaseProcessorScreenState createState() => _CaseProcessorScreenState();
}

class _CaseProcessorScreenState extends State<CaseProcessorScreen> {
  final ImagePicker _picker = ImagePicker();
  List<File> _selectedImages = [];
  String? _extractedText = "";
  Map<String, dynamic>? _caseData;
  bool _isLoading = false;

  final String backendUrl =
      "http://10.0.2.2:8000/process_case/"; // Replace with your backend URL

  // Select images from gallery or camera
  Future<void> _selectImages() async {
    final List<XFile> pickedFiles = await _picker.pickMultiImage();
    if (pickedFiles != null && pickedFiles.isNotEmpty) {
      setState(() {
        _selectedImages = pickedFiles.map((file) => File(file.path)).toList();
      });
    }
  }

  // Upload images and process case data
  Future<void> _processImages() async {
    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select images first")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      var request = http.MultipartRequest('POST', Uri.parse(backendUrl));
      
      // Add the image files to the request
      for (var image in _selectedImages) {
        var imageBytes = image.readAsBytesSync();
        var multipartFile = http.MultipartFile.fromBytes(
          'files',
          imageBytes,
          filename: image.path.split('/').last,
          contentType: MediaType('image', 'jpg'), // Set correct content type (jpg or png)
        );
        request.files.add(multipartFile);
      }

      // Send the request
      var response = await request.send();

      // Read the response
      if (response.statusCode == 200) {
        var responseData = await http.Response.fromStream(response);
        var responseBody = json.decode(responseData.body);

        setState(() {
          _extractedText = responseBody["combined_text"];
          _caseData = responseBody["case_data"];
        });
      } else {
        throw Exception("Failed to process images");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Medical Case Processor"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: _selectImages,
              icon: const Icon(Icons.image),
              label: const Text("Select Images"),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _processImages,
              icon: const Icon(Icons.upload),
              label: const Text("Process Images"),
            ),
            const SizedBox(height: 20),
            _isLoading
                ? const CircularProgressIndicator()
                : Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (_extractedText != null &&
                              _extractedText!.isNotEmpty)
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Extracted Text:",
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18),
                                ),
                                const SizedBox(height: 10),
                                Text(_extractedText ?? ""),
                                const Divider(),
                              ],
                            ),
                          if (_caseData != null)
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Extracted Case Data:",
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18),
                                ),
                                const SizedBox(height: 10),
                                Text(jsonEncode(_caseData)),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}

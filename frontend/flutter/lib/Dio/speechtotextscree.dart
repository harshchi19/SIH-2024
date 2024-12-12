import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:vaanivikas/Dio/speech_t_text.dart';
import 'dart:io';
import 'api_service.dart';

class SpeechToTextScreen extends StatefulWidget {
  @override
  _SpeechToTextScreenState createState() => _SpeechToTextScreenState();
}

class _SpeechToTextScreenState extends State<SpeechToTextScreen> {
  final ApiService _apiService = ApiService();
  String? _transcription;

  Future<void> _pickAudioFile() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickVideo(source: ImageSource.gallery); // For audio use gallery
    if (pickedFile != null) {
      final file = File(pickedFile.path);
      final formData = await prepareFormData(file);
      try {
        final response = await _apiService.speechToText(formData);
        setState(() {
          _transcription = response.data['transcription'];
        });
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Speech-to-Text')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _pickAudioFile,
              child: Text('Upload Audio File'),
            ),
            SizedBox(height: 16),
            if (_transcription != null) Text('Transcription: $_transcription'),
          ],
        ),
      ),
    );
  }
}

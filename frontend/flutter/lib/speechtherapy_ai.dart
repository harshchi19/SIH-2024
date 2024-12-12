
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(baseUrl: 'http://127.0.0.1:5000'));

  Future<String> textToSpeech(String text) async {
    try {
      final response = await _dio.post('/text-to-speech', data: {'text': text});
      return response.data['file_path'];
    } catch (e) {
      throw Exception('Failed to convert text to speech');
    }
  }

  Future<String> speechToText(String audioFilePath) async {
    try {
      FormData formData = FormData.fromMap({
        'audio_file': await MultipartFile.fromFile(audioFilePath, filename: 'audio.wav'),
      });

      final response = await _dio.post('/speech-to-text', data: formData);
      return response.data['transcription'];
    } catch (e) {
      throw Exception('Failed to transcribe audio');
    }
  }
}

class SpeechTherapyApp extends StatefulWidget {
  const SpeechTherapyApp({super.key});

  @override
  _SpeechTherapyAppState createState() => _SpeechTherapyAppState();
}

class _SpeechTherapyAppState extends State<SpeechTherapyApp> {
  final ApiService _apiService = ApiService();

  void _convertTextToSpeech(String text) async {
    try {
      String filePath = await _apiService.textToSpeech(text);
      print("Audio saved at: $filePath");
    } catch (e) {
      print(e);
    }
  }

  void _convertSpeechToText(String audioFilePath) async {
    try {
      String transcription = await _apiService.speechToText(audioFilePath);
      print("Transcription: $transcription");
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Speech Therapy App')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => _convertTextToSpeech("Hello, this is a test speech synthesis."),
              child: const Text("Text to Speech"),
            ),
            ElevatedButton(
              onPressed: () => _convertSpeechToText('path_to_audio_file.wav'),
              child: const Text("Speech to Text"),
            ),
          ],
        ),
      ),
    );
  }
}
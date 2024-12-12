import 'package:flutter/material.dart';
import 'api_service.dart';

class TextToSpeechScreen extends StatelessWidget {
  final TextEditingController _textController = TextEditingController();
  final ApiService _apiService = ApiService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Text-to-Speech')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _textController,
              decoration: InputDecoration(labelText: 'Enter Text'),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                final text = _textController.text;
                try {
                  final response = await _apiService.textToSpeech(text);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Audio File: ${response.data['file_path']}')),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: $e')),
                  );
                }
              },
              child: Text('Convert to Speech'),
            ),
          ],
        ),
      ),
    );
  }
}

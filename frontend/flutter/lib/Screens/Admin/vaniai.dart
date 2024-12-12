import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';

import '../../constants.dart';



class AIChatScreen extends StatefulWidget {
  @override
  _AIChatScreenState createState() => _AIChatScreenState();
}

class _AIChatScreenState extends State<AIChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final stt.SpeechToText _speechToText = stt.SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();

  bool _isListening = false;
  List<Map<String, String>> _messages = [];

  void _startListening() async {
    if (!_isListening) {
      bool available = await _speechToText.initialize(
        onError: (error) => print("Speech Error: ${error.errorMsg}"),
        onStatus: (status) => print("Speech Status: $status"),
      );
      if (available) {
        setState(() => _isListening = true);
        _speechToText.listen(
          onResult: (result) {
            setState(() {
              _controller.text = result.recognizedWords;
            });
          },
          listenFor: Duration(seconds: 30),
          pauseFor: Duration(seconds: 5),
          localeId: 'en_US',
        );
      } else {
        print("Speech-to-Text not available");
      }
    } else {
      setState(() => _isListening = false);
      _speechToText.stop();
    }
  }

  void _sendMessage() async {
    String userMessage = _controller.text;
    if (userMessage.trim().isEmpty) return;

    setState(() {
      _messages.add({"role": "user", "content": userMessage});
    });
    _controller.clear();

    // Send message to FastAPI
    var response = await http.post(
      Uri.parse('http://172.16.214.250:8000/text/'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({"user_input": userMessage}),
    );

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      setState(() {
        _messages.add({"role": "assistant", "content": data['response']});
      });
      _speak(data['response']);
    } else {
      setState(() {
        _messages.add({"role": "assistant", "content": "Error: ${response.reasonPhrase}"});
      });
    }
  }

  void _speak(String text) async {
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setPitch(1.0);
    await _flutterTts.speak(text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Chatbot"),
        backgroundColor: kPrimaryLightColor,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [kPrimaryColor, kPrimaryLightColor],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6.0, horizontal: 12.0),
                    child: Row(
                      mainAxisAlignment: _messages[index]["role"] == "user"
                          ? MainAxisAlignment.end
                          : MainAxisAlignment.start,
                      children: [
                        if (_messages[index]["role"] == "assistant")
                          IconButton(
                            icon: Icon(Icons.volume_up, color: Colors.white),
                            onPressed: () => _speak(_messages[index]["content"]!),
                          ),
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: _messages[index]["role"] == "user"
                                  ? kButtonColor.withOpacity(0.8)
                                  : kSecondaryColor.withOpacity(0.8),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: kPrimaryLightColor, width: 1),
                            ),
                            child: Text(
                              _messages[index]["role"] == "user"
                                  ? "You: ${_messages[index]["content"]}"
                                  : "Assistant: ${_messages[index]["content"]}",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(
                      _isListening ? Icons.mic : Icons.mic_none,
                      color: Colors.white,
                    ),
                    onPressed: _startListening,
                    iconSize: 30,
                    splashRadius: 24,
                    splashColor: kPrimaryDarkColor,
                  ),
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [kColor, kPrimaryLightColor],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: "Type your message...",
                          hintStyle: TextStyle(color: Colors.white70),
                          contentPadding: EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.send, color: Colors.white),
                    onPressed: _sendMessage,
                    iconSize: 30,
                    splashRadius: 24,
                    splashColor: kPrimaryDarkColor,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

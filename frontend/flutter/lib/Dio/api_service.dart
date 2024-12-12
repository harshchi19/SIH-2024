import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'http://10.0.2.2:8000', // Replace with your backend URL
      connectTimeout: const Duration(milliseconds: 5000),
      receiveTimeout: const Duration(milliseconds: 3000),
    ),
  );

  // POST request for Text-to-Speech
  Future<Response> textToSpeech(String text) async {
    try {
      final response = await _dio.post(
        '/text-to-speech',
        data: {'text': text},
      );
      return response;
    } on DioException catch (e) {
      throw Exception('Text-to-Speech failed: ${e.response?.data}');
    }
  }

  // POST request for Speech-to-Text
  Future<Response> speechToText(FormData formData) async {
    try {
      final response = await _dio.post(
        '/speech-to-text',
        data: formData,
        options: Options(contentType: 'multipart/form-data'),
      );
      return response;
    } on DioException catch (e) {
      throw Exception('Speech-to-Text failed: ${e.response?.data}');
    }
  }
}

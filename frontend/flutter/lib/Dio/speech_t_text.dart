import 'package:dio/dio.dart';
import 'dart:io';

Future<FormData> prepareFormData(File audioFile) async {
  final fileName = audioFile.path.split('/').last;

  return FormData.fromMap({
    'audio_file': await MultipartFile.fromFile(
      audioFile.path,
      filename: fileName,
    ),
  });
}

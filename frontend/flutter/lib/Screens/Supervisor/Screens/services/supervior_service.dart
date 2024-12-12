import 'dart:convert';
import 'package:http/http.dart' as http;
import '../model/supervisor_model.dart';
import 'api_config.dart';
import 'api_exception.dart';

class SupervisorService {
  final String endpoint = "supervisor/get-all-supervisors";

  Future<List<Supervisor>> fetchSupervisors() async {
    try {
      final url = Uri.parse('http://172.16.214.250:4224/${endpoint}');
      
      print('Fetching supervisors from: $url'); // Debug log
      
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      ).timeout(
        const Duration(seconds: 60),
        onTimeout: () {
          throw ApiException('Request timed out');
        },
      );

      print('Response status: ${response.statusCode}'); // Debug log
      print('Response body: ${response.body}'); // Debug log

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Supervisor.fromJson(json)).toList();
      } else {
        throw ApiException(
          'Failed to load supervisors: ${response.statusCode}\n${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching supervisors: $e'); // Debug log
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException('Failed to load supervisors: $e');
    }
  }
}
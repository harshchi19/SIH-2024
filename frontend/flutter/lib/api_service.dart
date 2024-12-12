import 'dart:convert';
import 'package:http/http.dart' as http;
import 'constants.dart';

class ApiService {
  // static const String baseUrl = "http://localhost:3000"; // Update with your backend's base URL

  static Future<Map<String, dynamic>> onboardSupervisor(Map<String, String> supervisorData) async {
    final url = Uri.parse("$apiBaseUrl/supervisor/add-supervisor");
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(supervisorData),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to onboard supervisor: ${response.body}");
    }
  }

  static Future<Map<String, dynamic>> getSupervisorDashboardData() async {
    final url = Uri.parse("$apiBaseUrl/supervisors/dashboard");
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to fetch dashboard data: ${response.body}");
    }
  }
}

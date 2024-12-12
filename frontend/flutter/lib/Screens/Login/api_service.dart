// import 'dart:convert';
// import 'package:http/http.dart' as http;

// class APIService {
//   final String baseUrl =
//       'http://10.0.2.2:4224'; // Replace with your backend URL

//   Future<Map<String, dynamic>> loginUser({
//     required String userType,
//     required String phoneNo,
//     required String password,
//     required String nameOrId,
//   }) async {
//     final url = Uri.parse('$baseUrl/auth/login-user');
//     final Map<String, dynamic> data = {
//       "userType": userType,
//       "phone_no": phoneNo,
//       "password": password,
//     };

//     if (userType == "PAT") {
//       data["name"] = nameOrId;
//     } else if (userType == "STT") {
//       data["therapist_id"] = nameOrId;
//     } else if (userType == "SUP") {
//       data["supervisor_id"] = nameOrId;
//     }

//     try {
//       final response = await http.post(
//         url,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: json.encode(data),
//       );

//       if (response.statusCode == 200) {
//         return json.decode(response.body);
//       } else {
//         final responseBody = response.body;
//         print("Error Response: $responseBody");
//         throw Exception(
//             "Error: ${responseBody.isNotEmpty ? json.decode(responseBody)['message'] : 'Unknown error'}");
//       }
//     } catch (e) {
//       print("Error: $e");
//       throw Exception("An error occurred: $e");
//     }
//   }

//   // Future<Map<String, dynamic>> loginUser({
//   //   required String userType,
//   //   required String phoneNo,
//   //   required String password,
//   //   required String nameOrId,
//   // }) async {
//   //   final url = Uri.parse('$baseUrl/auth/login-user');
//   //   final response = await http.post(
//   //     url,
//   //     headers: {'Content-Type': 'application/json'},
//   //     body: jsonEncode({
//   //       'userType': userType,
//   //       'phoneNo': phoneNo,
//   //       'password': password,
//   //       'nameOrId': nameOrId,
//   //     }),
//   //   );

//   //   if (response.statusCode == 200) {
//   //     return jsonDecode(response.body);
//   //   } else {
//   //     throw Exception('Failed to log in. Error: ${response.statusCode}');
//   //   }
//   // }

//   Future<Map<String, dynamic>> getSidebarData(
//       {required String userType}) async {
//     final url = Uri.parse('$baseUrl/sidebar/get-sidebar-data/$userType');
//     final response = await http.get(
//       url,
//       headers: {'Content-Type': 'application/json'},
//     );

//     if (response.statusCode == 200) {
//       return jsonDecode(response.body);
//     } else {
//       throw Exception(
//           'Failed to fetch sidebar data. Error: ${response.statusCode}');
//     }
//   }
// }


import 'dart:convert';
import 'package:http/http.dart' as http;

class APIService {
  final String baseUrl = 'http://10.0.2.2:4224'; // Replace with your backend URL

  Future<Map<String, dynamic>> loginUser({
    required String userType,
    required String email,
    // String? email,
    String? phoneNo,
    required String password,
    String? supervisorId,
    String? studentTherapistId,
  }) async {
    final url = Uri.parse('$baseUrl/auth/login-user');
    final Map<String, dynamic> data = {
      "userType": userType,
      "password": password,
    };

    if (userType == "HOD" || userType == "ADM") {
      data["email"] = email;
    } else {
      data["phone_no"] = phoneNo;
      if (userType == "SUP") {
        data["supervisor_id"] = supervisorId;
      } else if (userType == "STT") {
        data["student_therapist_id"] = studentTherapistId;
      }
    }

    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
        },
        body: json.encode(data),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final responseBody = response.body;
        print("Error Response: $responseBody");
        throw Exception(
            "Error: ${responseBody.isNotEmpty ? json.decode(responseBody)['message'] : 'Unknown error'}");
      }
    } catch (e) {
      print("Error: $e");
      throw Exception("An error occurred: $e");
    }
  }
}
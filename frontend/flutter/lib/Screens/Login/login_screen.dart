// // import 'package:flutter/material.dart';
// // import 'package:vaanivikas/responsive.dart';
// // import '../../Components/background.dart';
// // import 'components/login_form.dart';
// // import 'components/login_top_image.dart';
// //
// // class LoginScreen extends StatelessWidget {
// //   const LoginScreen({Key? key}) : super(key: key);
// //
// //   @override
// //   Widget build(BuildContext context) {
// //     return const Background(
// //       child: SingleChildScrollView(
// //         child: Responsive(
// //           mobile: MobileLoginScreen(),
// //           desktop: Row(
// //             children: [
// //               Expanded(
// //                 child: LoginScreenTopImage(),
// //               ),
// //               Expanded(
// //                 child: Row(
// //                   mainAxisAlignment: MainAxisAlignment.center,
// //                   children: [
// //                     SizedBox(
// //                       width: 450,
// //                       child: LoginScreen(),
// //                     ),
// //                   ],
// //                 ),
// //               ),
// //             ],
// //           ),
// //         ),
// //       ),
// //     );
// //   }
// // }
// //
// // class MobileLoginScreen extends StatelessWidget {
// //   const MobileLoginScreen({
// //     Key? key,
// //   }) : super(key: key);
// //
// //   @override
// //   Widget build(BuildContext context) {
// //     return const Column(
// //       mainAxisAlignment: MainAxisAlignment.center,
// //       children: <Widget>[
// //         LoginScreenTopImage(),
// //         Row(
// //           children: [
// //             Spacer(),
// //             Expanded(
// //               flex: 8,
// //               child: LoginScreen(),
// //             ),
// //             Spacer(),
// //           ],
// //         ),
// //       ],
// //     );
// //   }
// // }
// // import 'package:flutter/material.dart';
// // import 'package:vaanivikas/Screens/Patient/screens/patient/patient_screen.dart';
// // import 'package:vaanivikas/Screens/Student%20Therapist/Screens/home.dart';
// // import '../../Components/navbar.dart';
// // import '../Supervisor/Screens/home.dart';
// // import 'api_service.dart';

// // class LoginScreen extends StatefulWidget {
// //   const LoginScreen({super.key});

// //   @override
// //   _LoginScreenState createState() => _LoginScreenState();
// // }

// // class _LoginScreenState extends State<LoginScreen> {
// //   final TextEditingController _phoneController = TextEditingController();
// //   final TextEditingController _passwordController = TextEditingController();
// //   final TextEditingController _nameOrIdController = TextEditingController();
// //   String _userType = 'PAT'; // Default user type
// //   final APIService _apiService = APIService();

// //   Future<void> _login() async {
// //     final String phoneNo = _phoneController.text.trim();
// //     final String password = _passwordController.text.trim();
// //     final String nameOrId = _nameOrIdController.text.trim();

// //     if (phoneNo.isEmpty || password.isEmpty || nameOrId.isEmpty) {
// //       ScaffoldMessenger.of(context).showSnackBar(
// //         const SnackBar(content: Text("All fields are required")),
// //       );
// //       return;
// //     }

// //     try {
// //       final responseData = await _apiService.loginUser(
// //         userType: _userType,
// //         phoneNo: phoneNo,
// //         password: password,
// //         nameOrId: nameOrId,
// //       );

// //       // Extract userName from the response
// //       final String userName = responseData['userName'];

// //       // Show welcome message
// //       ScaffoldMessenger.of(context).showSnackBar(
// //         SnackBar(content: Text("Welcome $userName")),
// //       );

// //       // Navigate to the appropriate home screen based on userType
// //       Widget homeScreen;
// //       switch (_userType) {
// //         case 'PAT':
// //           homeScreen = PatientScreen(userId: responseData['userId']);
// //           break;
// //         case 'STT':
// //           homeScreen = Home(userId: responseData['userId']);
// //           break;
// //         case 'SUP':
// //           homeScreen = SupervisorHome(
// //             userId: responseData['userId'],
// //             // userType: responseData['userType'],
// //             // userName: userName,
// //           );
// //           break;
// //         default:
// //           throw Exception("Invalid user type");
// //       }

// //       Navigator.pushReplacement(
// //         context,
// //         MaterialPageRoute(builder: (context) => homeScreen),
// //       );
// //     } catch (e) {
// //       print(e.toString());
// //     }
// //   }
// //   // Future<void> _login() async {
// //   //   final String phoneNo = _phoneController.text.trim();
// //   //   final String password = _passwordController.text.trim();
// //   //   final String nameOrId = _nameOrIdController.text.trim();

// //   //   if (phoneNo.isEmpty || password.isEmpty || nameOrId.isEmpty) {
// //   //     ScaffoldMessenger.of(context).showSnackBar(
// //   //       const SnackBar(content: Text("All fields are required")),
// //   //     );
// //   //     return;
// //   //   }

// //   //   try {
// //   //     final responseData = await _apiService.loginUser(
// //   //       userType: _userType,
// //   //       phoneNo: phoneNo,
// //   //       password: password,
// //   //       nameOrId: nameOrId,
// //   //     );

// //   //     final String userName = responseData['userName'];
// //   //     final String userEmail = responseData['email'];
// //   //     final String userImage =
// //   //         responseData['image']; // Use a placeholder if not available
// //   //     final sidebarResponse =
// //   //         await _apiService.getSidebarData(userType: _userType);

// //   //     // Sidebar data
// //   //     final List<dynamic> sidebarData = sidebarResponse['sidebarData'];

// //   //     ScaffoldMessenger.of(context).showSnackBar(
// //   //       SnackBar(content: Text("Welcome $userName")),
// //   //     );

// //   //     // Navigate to the appropriate home screen
// //   //     Widget homeScreen;
// //   //     switch (_userType) {
// //   //       case 'PAT':
// //   //         homeScreen = PatientScreen(
// //   //           userId: responseData['userId'],
// //   //           sidebar: Navbar(
// //   //             userName: userName,
// //   //             userEmail: userEmail,
// //   //             userImage: userImage,
// //   //             sidebarData: sidebarData.cast<Map<String, dynamic>>(),
// //   //           ),
// //   //         );
// //   //         break;
// //   //       case 'STT':
// //   //         homeScreen = Home(
// //   //           userId: responseData['userId'],
// //   //           sidebar: Navbar(
// //   //             userName: userName,
// //   //             userEmail: userEmail,
// //   //             userImage: userImage,
// //   //             sidebarData: sidebarData.cast<Map<String, dynamic>>(),
// //   //           ),
// //   //         );
// //   //         break;
// //   //       case 'SUP':
// //   //         homeScreen = SupervisorHome(
// //   //           userId: responseData['userId'],
// //   //           sidebar: Navbar(
// //   //             userName: userName,
// //   //             userEmail: userEmail,
// //   //             userImage: userImage,
// //   //             sidebarData: sidebarData.cast<Map<String, dynamic>>(),
// //   //           ),
// //   //         );
// //   //         break;
// //   //       default:
// //   //         throw Exception("Invalid user type");
// //   //     }

// //   //     Navigator.pushReplacement(
// //   //       context,
// //   //       MaterialPageRoute(builder: (context) => homeScreen),
// //   //     );
// //   //   } catch (e) {
// //   //     print(e.toString());
// //   //   }
// //   // }

// //   @override
// //   Widget build(BuildContext context) {
// //     return Scaffold(
// //       appBar: AppBar(title: const Text("Login")),
// //       body: Padding(
// //         padding: const EdgeInsets.all(16.0),
// //         child: Column(
// //           children: [
// //             DropdownButtonFormField<String>(
// //               value: _userType,
// //               items: const [
// //                 DropdownMenuItem(value: 'PAT', child: Text('Patient')),
// //                 DropdownMenuItem(
// //                     value: 'STT', child: Text('Student Therapist')),
// //                 DropdownMenuItem(value: 'SUP', child: Text('Supervisor')),
// //               ],
// //               onChanged: (value) {
// //                 setState(() {
// //                   _userType = value!;
// //                   _nameOrIdController.clear();
// //                 });
// //               },
// //               decoration: const InputDecoration(labelText: "User Type"),
// //             ),
// //             TextField(
// //               controller: _phoneController,
// //               decoration: const InputDecoration(labelText: "Phone Number"),
// //               keyboardType: TextInputType.phone,
// //             ),
// //             TextField(
// //               controller: _passwordController,
// //               decoration: const InputDecoration(labelText: "Password"),
// //               obscureText: true,
// //             ),
// //             TextField(
// //               controller: _nameOrIdController,
// //               decoration: InputDecoration(
// //                 labelText: _userType == 'PAT'
// //                     ? "Name"
// //                     : (_userType == 'STT' ? "Therapist ID" : "Supervisor ID"),
// //               ),
// //             ),
// //             const SizedBox(height: 20),
// //             ElevatedButton(
// //               onPressed: _login,
// //               child: const Text("Login"),
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }
// // }

// import 'package:flutter/material.dart';
// import 'package:vaanivikas/Screens/Patient/screens/patient/patient_screen.dart';
// import 'package:vaanivikas/Screens/Student%20Therapist/Screens/home.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/home.dart';
// import '../../Components/navbar.dart';
// import 'api_service.dart';

// class LoginScreen extends StatefulWidget {
//   const LoginScreen({super.key});

//   @override
//   _LoginScreenState createState() => _LoginScreenState();
// }

// class _LoginScreenState extends State<LoginScreen> {
//   final TextEditingController _phoneController = TextEditingController();
//   final TextEditingController _passwordController = TextEditingController();
//   final TextEditingController _nameOrIdController = TextEditingController();
//   String _userType = 'PAT'; // Default user type
//   final APIService _apiService = APIService();

//   Future<void> _login() async {
//     final String phoneNo = _phoneController.text.trim();
//     final String password = _passwordController.text.trim();
//     final String nameOrId = _nameOrIdController.text.trim();

//     if (phoneNo.isEmpty || password.isEmpty || nameOrId.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text("All fields are required")),
//       );
//       return;
//     }

//     try {
//   final responseData = await _apiService.loginUser(
//     userType: _userType,
//     phoneNo: phoneNo,
//     password: password,
//     nameOrId: nameOrId,
//   );

//   // Check for null or missing values in the response and provide default values
//   final String userName = responseData['userName'] ?? 'Unknown User';
//   final String userEmail = responseData['email'] ?? 'unknown@example.com';
//   final String userImage = responseData['image'] ?? 'assets/images/yash.jpg'; // Provide a default image

//   // Print response to debug
//   print('Response Data: $responseData');

//   // Sidebar data handling
//   final sidebarResponse = await _apiService.getSidebarData(userType: _userType);
//   final List<Map<String, dynamic>> sidebarData = List<Map<String, dynamic>>.from(sidebarResponse['sidebarData'] ?? []);

//   // Check if sidebarData is empty or null and handle accordingly
//   if (sidebarData.isEmpty) {
//     print('Sidebar data is empty');
//   }

//   ScaffoldMessenger.of(context).showSnackBar(
//     SnackBar(content: Text("Welcome $userName")),
//   );

//   // Navigate to the appropriate home screen
//   Widget homeScreen;
//   switch (_userType) {
//     case 'PAT':
//       homeScreen = PatientScreen(
//         userId: responseData['userId'] ?? 'Unknown',
//         sidebar: Navbar(
//           userName: userName,
//           userEmail: userEmail,
//           userImage: userImage,
//           sidebarData: sidebarData,
//         ),
//       );
//       break;
//     case 'STT':
//       homeScreen = Home(
//         userId: responseData['userId'] ?? 'Unknown',
//         sidebar: Navbar(
//           userName: userName,
//           userEmail: userEmail,
//           userImage: userImage,
//           sidebarData: sidebarData,
//         ),
//       );
//       break;
//     case 'SUP':
//       homeScreen = SupervisorHome(
//         userId: responseData['userId'] ?? 'Unknown',
//         sidebar: Navbar(
//           userName: userName,
//           userEmail: userEmail,
//           userImage: userImage,
//           sidebarData: sidebarData,
//         ),
//       );
//       break;
//     default:
//       throw Exception("Invalid user type");
//   }

//   Navigator.pushReplacement(
//     context,
//     MaterialPageRoute(builder: (context) => homeScreen),
//   );
// } catch (e) {
//   print('Error: $e');
//   ScaffoldMessenger.of(context).showSnackBar(
//     SnackBar(content: Text('An error occurred: ${e.toString()}')),
//   );
// }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Login")),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           children: [
//             DropdownButtonFormField<String>(
//               value: _userType,
//               items: const [
//                 DropdownMenuItem(value: 'PAT', child: Text('Patient')),
//                 DropdownMenuItem(value: 'STT', child: Text('Student Therapist')),
//                 DropdownMenuItem(value: 'SUP', child: Text('Supervisor')),
//               ],
//               onChanged: (value) {
//                 setState(() {
//                   _userType = value!;
//                   _nameOrIdController.clear();
//                 });
//               },
//               decoration: const InputDecoration(labelText: "User Type"),
//             ),
//             TextField(
//               controller: _phoneController,
//               decoration: const InputDecoration(labelText: "Phone Number"),
//               keyboardType: TextInputType.phone,
//             ),
//             TextField(
//               controller: _passwordController,
//               decoration: const InputDecoration(labelText: "Password"),
//               obscureText: true,
//             ),
//             TextField(
//               controller: _nameOrIdController,
//               decoration: InputDecoration(
//                 labelText: _userType == 'PAT'
//                     ? "Name"
//                     : (_userType == 'STT' ? "Therapist ID" : "Supervisor ID"),
//               ),
//             ),
//             const SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: _login,
//               child: const Text("Login"),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'api_service.dart';

// class LoginScreen extends StatefulWidget {
//   @override
//   _LoginScreenState createState() => _LoginScreenState();
// }

// class _LoginScreenState extends State<LoginScreen> {
//   final TextEditingController _phoneController = TextEditingController();
//   final TextEditingController _passwordController = TextEditingController();
//   final TextEditingController _emailController = TextEditingController();
//   final TextEditingController _idController = TextEditingController();
//   String _userType = 'PAT'; // Default user type

//   final APIService _apiService = APIService();

//   void _login() async {
//     try {
//       final response = await _apiService.loginUser(
//         userType: _userType,
//         email: _emailController.text,
//         phoneNo: (_userType == 'HOD' || _userType == 'ADM')
//             ? null
//             : _phoneController.text,
//         password: _passwordController.text,
//         supervisorId: _userType == 'SUP' ? _idController.text : null,
//         studentTherapistId: _userType == 'STT' ? _idController.text : null,
//       );

//       if (response['message'] == 'Login successful') {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text("Login Successful!")),
//         );
//         // Navigate to the next screen
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text(response['message'])),
//         );
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text("Error: $e")),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Login'),
//       ),
//       body: SingleChildScrollView(
//         child: Padding(
//           padding: const EdgeInsets.all(16.0),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               DropdownButton<String>(
//                 value: _userType,
//                 items: [
//                   DropdownMenuItem(value: 'PAT', child: Text('Patient')),
//                   DropdownMenuItem(
//                       value: 'STT', child: Text('Student Therapist')),
//                   DropdownMenuItem(value: 'SUP', child: Text('Supervisor')),
//                   DropdownMenuItem(
//                       value: 'HOD', child: Text('Head of Department')),
//                   DropdownMenuItem(value: 'ADM', child: Text('Admin')),
//                 ],
//                 onChanged: (value) {
//                   setState(() {
//                     _userType = value!;
//                   });
//                 },
//               ),
//               if (_userType == 'HOD' || _userType == 'ADM')
//                 TextField(
//                   controller: _emailController,
//                   decoration: InputDecoration(labelText: 'Email'),
//                 ),
//               if (_userType == 'SUP' || _userType == 'STT')
//                 TextField(
//                   controller: _idController,
//                   decoration: InputDecoration(labelText: 'ID'),
//                 ),
//               if (!(_userType == 'HOD' || _userType == 'ADM'))
//                 TextField(
//                   controller: _phoneController,
//                   decoration: InputDecoration(labelText: 'Phone Number'),
//                 ),
//               TextField(
//                 controller: _passwordController,
//                 decoration: InputDecoration(labelText: 'Password'),
//                 obscureText: true,
//               ),
//               SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _login,
//                 child: Text('Login'),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/home.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/home.dart';
import 'package:vaanivikas/constants.dart';
import '../Admin/home.dart';
import '../hod/hod_sidebar.dart';
import 'api_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _idController = TextEditingController();
  String _userType = 'STT'; // Default user type

  final APIService _apiService = APIService();

  void _login() async {
    try {
      final response = await _apiService.loginUser(
        userType: _userType,
        email: _emailController.text,
        phoneNo: (_userType == 'HOD' || _userType == 'ADM')
            ? null
            : _phoneController.text,
        password: _passwordController.text,
        supervisorId: _userType == 'SUP' ? _idController.text : null,
        studentTherapistId: _userType == 'STT' ? _idController.text : null,
      );

      if (response['message'] == 'Login successful') {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Login Successful!")),
        );

        // Navigate to different home screens based on userType
        switch (_userType) {
          // case 'PAT':
          //   Navigator.of(context).pushReplacement(MaterialPageRoute(
          //     builder: (context) => PatientHomeScreen(),
          //   ));
          //   break;
          case 'STT':
            Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (context) => Home(),
            ));
            break;
          case 'SUP':
            Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (context) => SupervisorHome(),
            ));
            break;
          case 'HOD':
            Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (context) => HODNav(),
            ));
            break;
          case 'ADM':
            Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (context) => AdminHome(),
            ));
            break;
          default:
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Unknown user type")),
            );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'])),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login', style: TextStyle(color: Colors.white)),
        backgroundColor: kPrimaryColor,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              DropdownButtonFormField<String>(
                value: _userType,
                decoration: InputDecoration(
                  labelText: 'Select User Type',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                items: const [
                  DropdownMenuItem(value: 'PAT', child: Text('Patient')),
                  DropdownMenuItem(
                      value: 'STT', child: Text('Student Therapist')),
                  DropdownMenuItem(value: 'SUP', child: Text('Supervisor')),
                  DropdownMenuItem(
                      value: 'HOD', child: Text('Head of Department')),
                  DropdownMenuItem(value: 'ADM', child: Text('Admin')),
                ],
                onChanged: (value) {
                  setState(() {
                    _userType = value!;
                  });
                },
              ),
              const SizedBox(height: 16.0),
              if (_userType == 'HOD' || _userType == 'ADM')
                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                ),
              if (_userType == 'SUP' || _userType == 'STT')
                TextField(
                  controller: _idController,
                  decoration: InputDecoration(
                    labelText: 'ID',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                ),
              if (!(_userType == 'HOD' || _userType == 'ADM'))
                TextField(
                  controller: _phoneController,
                  decoration: InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                ),
              const SizedBox(height: 16.0),
              TextField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 24.0),
              ElevatedButton(
                onPressed: _login,
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                child: const Text(
                  'Login',
                  style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
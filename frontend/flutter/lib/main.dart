import 'package:flutter/material.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/cases_reports.dart';

import 'package:vaanivikas/Screens/Supervisor/Screens/display_supervisors.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/onboard_form.dart';
import 'package:vaanivikas/Screens/admin/cases_reports_detail_screen.dart';
import 'package:vaanivikas/Screens/admin/home.dart';
import 'package:vaanivikas/Screens/admin/sidebar_admin.dart';
import 'package:vaanivikas/Screens/hod/hod_sidebar.dart';
// import 'Screens/Patient/screens/display patient/display_pateint.dart';
import 'Screens/Patient/patient_form.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/home.dart';
import 'Screens/Login/login_screen.dart';
import 'Screens/Login/components/login_form.dart';
import 'Screens/Login/login_screen.dart';
import 'Screens/Patient/screens/patient/patient_screen.dart';
import 'Screens/Supervisor/Screens/display_similarity.dart';
import 'Screens/Supervisor/Screens/student_therapist_page.dart';
import 'constants.dart';

import 'vaniai.dart';
// PAT-m3w4hp9a-4O6BBK
// PAT-m49v426l-M6M0DX
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VaniVikas',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: kPrimaryColor),
        useMaterial3: true,
      ),
      // home: const Home(userId: ''),
      // home:  AdminDashboard(),
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/supervisor/dashboard': (context) =>
            SupervisorHome(),
        '/supervisor/supervisors': (context) => const SupervisorListScreen(),
        '/supervisor/student-therapists': (context) =>
            const StudentTherapistPage(),
        // '/supervisor/patients': (context) => const PatientHome(),
        '/supervisor/patients/matchmaking': (context) =>
            const DisplaySimilarity(),
        '/supervisor/patients/add-patient': (context) =>
            PatientScreen(userId: '', sidebar: Container()),
      },
      // onGenerateRoute: (settings) {
      //   if (settings.name == '/supervisor/dashboard') {
      //     final args = settings.arguments as Map<String, dynamic>;
      //     return MaterialPageRoute(
      //       builder: (context) => SupervisorHome(
      //         userId: args['userId'],
      //         sidebar: args['sidebar'],
      //       ),
      //     );
      //   }
      //   return null; // Fallback for undefined routes
      // },

      // routes: {
      //   '/': (context) => const LoginScreen(),
      //   '/patient/calendar': (context) => const MeetingPage(),
      //   '/patient/communication': (context) => const ChatScreen(),
      //   '/supervisor/dashboard': (context) => SupervisorHome(
      //         userId: '',
      //         sidebar: Container(),
      //       ),
      //   '/supervisor/supervisors': (context) => const SupervisorListScreen(),
      //   '/supervisor/student-therapists': (context) => const StudentTherapistPage(),
      //   'supervisor/calendar': (context) => const MeetingPage(),
      //   'supervisor/communication': (context) => const ChatScreen(),
      //   'supervisor/reports': (context) => CasesAndReportsPage(),
      //   '/supervisor/patients': (context) => const PatientHome(),
      //   '/supervisor/patients/matchmaking': (context) => const DisplaySimilarity(),
      //   '/supervisor/patients/add-patient': (context) => PatientScreen(userId: '', sidebar: Container(),),
      // },
    );
  }
}


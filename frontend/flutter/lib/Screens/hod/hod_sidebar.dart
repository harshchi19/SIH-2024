import 'package:flutter/material.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/cases_reports.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/chat_screen.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/patients_page.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/Screens/planning_tracking.dart';
import 'package:vaanivikas/Screens/Student%20Therapist/widgets/notifications_panel.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/display_supervisors.dart';
import 'package:vaanivikas/constants.dart';

import '../../Dio/chatscreen.dart';
import '../Student Therapist/Screens/appointment_screen.dart';
import '../Student Therapist/Screens/profile.dart';


class HODNav extends StatelessWidget {
  const HODNav({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: const Text("Yash Buddhadev"),
            accountEmail: const Text("yash21@gmail.com"),
            currentAccountPicture: CircleAvatar(
              child: ClipOval(
                child: Image.asset("assets/images/yash.jpg"),
              ),
            ),
            decoration: BoxDecoration(
              color: kPrimaryDarkColor,
            ),
          ),
          ListTile(
            leading: const Icon(Icons.message_outlined),
            title: const Text('Chat'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) =>  ChatScreen()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.person_2_outlined),
            title: const Text('Patient'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => PatientsPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.verified_user_outlined),
            title: const Text('Profile'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProfilePage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.cases_outlined),
            title: const Text('Cases & Reports'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => CasesAndReportsPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.feedback_outlined),
            title: const Text('Plans and Tracking'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const PlanningStepDetailPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.calendar_month_outlined),
            title: const Text('Appointment'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const MeetingPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.notification_add_outlined),
            title: const Text('Notification'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) =>  NotificationPanel()),
              );
            },
          ),
           ListTile(
            leading: const Icon(Icons.person_2_outlined),
            title: const Text('Supervisor'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) =>  SupervisorListScreen()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout_outlined),
            title: const Text('Sign Out'),
            onTap: () => print("Signout Button Pressed !"),
          ),
          
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:vaanivikas/Components/signout.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/chat_screen.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/display_supervisors.dart';
import '../Screens/Supervisor/Screens/cases_reports.dart';
import '../Screens/Supervisor/Screens/patients_page.dart';
import '../Screens/Supervisor/Screens/profile.dart';
import '../Screens/Supervisor/Screens/student_therapist_page.dart';
import '../Screens/Supervisor/widgets/notifications_panel.dart';
import '../constants.dart';

class SUPNavbar extends StatelessWidget {
  const SUPNavbar({super.key});

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
                child: ClipOval(child: Image.asset("assets/images/yash.jpg"),),
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
                MaterialPageRoute(builder: (context) => const ChatScreen()),
              );
            },
            ),
            ListTile(
              leading: const Icon(Icons.person_2_outlined),
              title: const Text('Student Therapist'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => StudentTherapistPage()),
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
              title: const Text('Case Alloaction'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => CasesAndReportsPage()),
              );
            },
            ),
             ListTile(
              leading: const Icon(Icons.feedback_outlined),
              title: const Text('Reports'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => CasesAndReportsPage()),
              );
            },
            ),
            ListTile(
              leading: const Icon(Icons.notification_add_outlined),
              title: const Text('Notification'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NotificationPanel()),
              );
            },
            ),
             ListTile(
              leading: const Icon(Icons.person_3_rounded),
              title: const Text('Patients'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const PatientsPage()),
              );
            },
              // onTap: toggleTheme, // Calls the theme toggle function
            ),
            ListTile(
              leading: const Icon(Icons.person_2_outlined),
              title: const Text('View Supervisors'),
              onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SupervisorListScreen()),
              );
            },
            ),
            ListTile(
              leading: const Icon(Icons.logout_outlined),
              title: const Text('Sign Out'),
              onTap: () => signOut(context)
            ),
        ],
      ),
    );
  }
}

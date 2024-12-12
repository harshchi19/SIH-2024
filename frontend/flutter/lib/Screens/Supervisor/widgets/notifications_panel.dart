import 'package:flutter/material.dart';

import '../../../constants.dart';


class NotificationPanel extends StatefulWidget {
  const NotificationPanel({super.key});

  @override
  _NotificationPanelState createState() => _NotificationPanelState();
}

class _NotificationPanelState extends State<NotificationPanel>
    with SingleTickerProviderStateMixin {
  final List<Map<String, String>> notifications = [
    {'title': 'Room No. 33 is now available', 'time': '7 minutes ago'},
    {'title': 'New Patient Registration', 'time': '23 minutes ago'},
    {'title': 'Room No. 23 is now available', 'time': '59 minutes ago'},
  ];

  final List<Map<String, String>> appointments = [
    {'name': 'Aarav Patel', 'room': 'Room No. 32', 'time': '23 minutes ago'},
    {'name': 'Vivaan Singh', 'room': 'Room No. 25', 'time': '47 minutes ago'},
    {'name': 'Aastha Shukla', 'room': 'Room No. 33', 'time': '1 hour ago'},
    {'name': 'Alia Kapoor', 'room': 'Room No. 32', 'time': '3 hours ago'},
  ];

  final List<String> therapists = [
    'Ananya Sharma',
    'Rohan Deshmukh',
    'Ishita Patel',
    'Karan Mehta',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications Panel'),
        backgroundColor: kPrimaryDarkColor,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionTitle('Notifications'),
              _buildNotificationCards(),
              const SizedBox(height: 20),
              _buildSectionTitle('Recent Appointments'),
              _buildAppointmentList(),
              const SizedBox(height: 20),
              _buildSectionTitle('Assigned Student Therapists'),
              _buildTherapistList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: kSecondaryColor,
        ),
      ),
    );
  }

  Widget _buildNotificationCards() {
    return Column(
      children: notifications.map((notification) {
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: kPrimaryLightColor,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 8,
                offset: Offset(2, 2),
              )
            ],
          ),
          child: Row(
            children: [
              const Icon(
                Icons.notifications_active_outlined,
                color: kButtonColor,
                size: 28,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notification['title']!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification['time']!,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildAppointmentList() {
    return Column(
      children: appointments.map((appointment) {
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: kColor,
            child: Text(
              appointment['name']!.substring(0, 2),
              style: const TextStyle(color: Colors.white),
            ),
          ),
          title: Text(
            appointment['name']!,
            style: const TextStyle(color: kPrimaryColor),
          ),
          subtitle: Text(
            '${appointment['room']} • ${appointment['time']}',
            style: const TextStyle(color: kSecondaryColor),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTherapistList() {
    return Column(
      children: therapists.map((therapist) {
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: kPrimaryDarkColor,
            child: Text(
              therapist.substring(0, 2),
              style: const TextStyle(color: Colors.white),
            ),
          ),
          title: Text(
            therapist,
            style: const TextStyle(color: kSecondaryColor),
          ),
        );
      }).toList(),
    );
  }
}

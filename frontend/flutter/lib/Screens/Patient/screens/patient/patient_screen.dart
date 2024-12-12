import 'package:flutter/material.dart';
import 'package:vaanivikas/Components/navbar.dart';
import '../../../../constants.dart';
import '../../widgets/custom_tab_bar.dart';
import 'tabs/basic_details_page.dart';
import 'tabs/address_details_page.dart';
import 'tabs/medical_details_page.dart';
import 'tabs/non_verbal_communication_page.dart';
import 'tabs/reading_writing_skills_page.dart';
import 'tabs/speech_development_history_page.dart';
import 'tabs/voice_details_page.dart';


class PatientScreen extends StatelessWidget {
  final String userId;
  final Widget sidebar;
  const PatientScreen({super.key, required this.userId, required this.sidebar});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 7,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Patient Details'),
          bottom: const CustomTabBar(),
          backgroundColor: Colors.transparent, // Transparent app bar for gradient effect
          elevation: 0,
        ),
        body: Stack(
          children: [
            // Light Green Gradient Background
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    kButtonColor.withOpacity(0.9), 
                    kColor.withOpacity(0.8), 
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
            // Content with Padding and Styled Borders
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Expanded(
                    child: TabBarView(
                      children: [
                        _buildTabContainer(const BasicDetailsPage()),
                        _buildTabContainer(const AddressDetailsPage()),
                        _buildTabContainer(const MedicalDetailsPage()),
                        _buildTabContainer(const NonVerbalCommunicationPage()),
                        _buildTabContainer(const ReadingWritingSkillsPage()),
                        _buildTabContainer(const SpeechDevelopmentHistoryPage()),
                        _buildTabContainer(const VoiceDetailsPage()),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper function to wrap each tab content in a styled container
  Widget _buildTabContainer(Widget page) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85), // Semi-transparent white background for content
        borderRadius: BorderRadius.circular(16), // Rounded corners
        border: Border.all(
          color: kPrimaryLightColor, // Light border color for the content box
          width: 2,
        ),
      ),
      child: page,
    );
  }
}

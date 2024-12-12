import 'package:flutter/material.dart';

import '../../widgets/custom_date_picker.dart';
import '../../widgets/custom_text_field.dart';

class SpeechDevelopmentHistoryPage extends StatelessWidget {
  const SpeechDevelopmentHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextField(
            label: 'First Words',
            hint: 'Enter first words spoken',
          ),
          SizedBox(height: 16),
          CustomDatePicker(
            label: 'First Words Date',
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Language Development',
            hint: 'Describe language development progress',
            maxLines: 3,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Speech Therapy History',
            hint: 'Enter details of previous speech therapy',
            maxLines: 3,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Current Speech Issues',
            hint: 'Describe current speech challenges',
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}

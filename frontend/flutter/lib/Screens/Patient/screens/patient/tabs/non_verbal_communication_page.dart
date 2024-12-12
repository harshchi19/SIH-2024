import 'package:flutter/material.dart';
import '../../../widgets/custom_checkbox.dart';
import '../../../widgets/custom_text_field.dart';

class NonVerbalCommunicationPage extends StatelessWidget {
  const NonVerbalCommunicationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Communication Methods:',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          CustomCheckbox(
            title: 'Gestures',
            value: false,
            onChanged: (value) {},
          ),
          CustomCheckbox(
            title: 'Sign Language',
            value: false,
            onChanged: (value) {},
          ),
          CustomCheckbox(
            title: 'Picture Communication',
            value: false,
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Eye Contact',
            hint: 'Describe eye contact behavior',
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Facial Expressions',
            hint: 'Describe facial expressions',
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Additional Notes',
            hint: 'Enter any additional observations',
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}
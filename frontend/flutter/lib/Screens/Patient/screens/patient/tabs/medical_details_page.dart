import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_checkbox.dart';

class MedicalDetailsPage extends StatelessWidget {
  const MedicalDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CustomTextField(
            label: 'Current Medications',
            hint: 'Enter current medications',
            maxLines: 3,
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Allergies',
            hint: 'Enter allergies if any',
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          const Text(
            'Medical Conditions:',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          CustomCheckbox(
            title: 'Diabetes',
            value: false,
            onChanged: (value) {},
          ),
          CustomCheckbox(
            title: 'Hypertension',
            value: false,
            onChanged: (value) {},
          ),
          CustomCheckbox(
            title: 'Heart Disease',
            value: false,
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Other Medical Conditions',
            hint: 'Enter other medical conditions',
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}
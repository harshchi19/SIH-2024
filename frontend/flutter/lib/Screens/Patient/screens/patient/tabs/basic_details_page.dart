import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_date_picker.dart';

class BasicDetailsPage extends StatelessWidget {
  const BasicDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CustomTextField(
            label: 'Full Name',
            hint: 'Enter patient\'s full name',
          ),
          const SizedBox(height: 16),
          const CustomDatePicker(
            label: 'Date of Birth',
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Gender',
              border: OutlineInputBorder(),
            ),
            items: ['Male', 'Female', 'Other']
                .map((String value) => DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    ))
                .toList(),
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Contact Number',
            hint: 'Enter contact number',
            keyboardType: TextInputType.phone,
          ),
        ],
      ),
    );
  }
}
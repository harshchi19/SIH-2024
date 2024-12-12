import 'package:flutter/material.dart';
import '../../../widgets/custom_radio_group.dart';
import '../../../widgets/custom_text_field.dart';

class ReadingWritingSkillsPage extends StatelessWidget {
  const ReadingWritingSkillsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomRadioGroup(
            title: 'Reading Level',
            options: const ['Beginner', 'Intermediate', 'Advanced'],
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          CustomRadioGroup(
            title: 'Writing Level',
            options: const ['Beginner', 'Intermediate', 'Advanced'],
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Reading Comprehension',
            hint: 'Describe reading comprehension skills',
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Writing Skills',
            hint: 'Describe writing abilities',
            maxLines: 2,
          ),
          const SizedBox(height: 16),
          const CustomTextField(
            label: 'Specific Challenges',
            hint: 'Note any specific challenges',
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}
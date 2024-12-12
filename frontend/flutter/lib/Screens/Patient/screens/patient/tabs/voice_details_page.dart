import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_slider.dart';

class VoiceDetailsPage extends StatelessWidget {
  const VoiceDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomSlider(
            title: 'Voice Pitch',
            min: 0,
            max: 10,
            divisions: 10,
          ),
          SizedBox(height: 16),
          CustomSlider(
            title: 'Voice Loudness',
            min: 0,
            max: 10,
            divisions: 10,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Voice Quality',
            hint: 'Describe voice quality',
            maxLines: 2,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Voice Concerns',
            hint: 'Note any specific voice concerns',
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}
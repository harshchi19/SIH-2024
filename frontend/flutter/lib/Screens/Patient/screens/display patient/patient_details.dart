import 'package:flutter/material.dart';

class PatientDetails extends StatelessWidget {
  final Map<String, dynamic> patientData;

  const PatientDetails({super.key, required this.patientData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(patientData['name']),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SectionTitle(title: 'Basic Information'),
            Text('Age: ${patientData['age']}'),
            Text('Sex: ${patientData['sex']}'),
            Text('Date of Birth: ${patientData['date_of_birth']}'),
            const SizedBox(height: 20),
            const SectionTitle(title: 'Address Details'),
            Text('Address Line 1: ${patientData['address_details']['address_line1']}'),
            Text('City: ${patientData['address_details']['city']}'),
            Text('Postal Code: ${patientData['address_details']['postal_code']}'),
            const SizedBox(height: 20),
            const SectionTitle(title: 'Medical Details'),
            Text('Multilingual Factors: ${patientData['medical_details']['multilingual_factors']}'),
            Text('Clinical Impression: ${patientData['medical_details']['clinical_impression']}'),
            Text('Recommendations: ${patientData['medical_details']['recommendations']}'),
            const SizedBox(height: 20),
            const SectionTitle(title: 'Speech Development History'),
            Text('First Word: ${patientData['speech_development_history']['first_word']}'),
            Text('First Sentence: ${patientData['speech_development_history']['first_sentence']}'),
            const SizedBox(height: 20),
            const SectionTitle(title: 'Voice Details'),
            Text('Pitch Quality: ${patientData['voice_details']['pitch_quality']}'),
            Text('Loudness: ${patientData['voice_details']['loudness']}'),
            Text('Voice Quality: ${patientData['voice_details']['voice_quality']}'),
          ],
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;

  const SectionTitle({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.blueAccent,
        ),
      ),
    );
  }
}

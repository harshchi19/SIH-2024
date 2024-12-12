import 'package:flutter/material.dart';

class PatientLookUpCard extends StatelessWidget {
  final Map<String, dynamic>? patientData;

  const PatientLookUpCard({required this.patientData, super.key});

  @override
  Widget build(BuildContext context) {
    if (patientData == null || patientData!.isEmpty) {
      // Handle case where no data is available.
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            'No patient data available.',
            style: TextStyle(fontSize: 16, color: Colors.redAccent),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    // Safely extract fields with null checks and default values.
    final String name = patientData?['name'] ?? 'Name not provided';
    final String id = patientData?['patient_id'] ?? 'ID not provided';
    final String age = patientData?['age']?.toString() ?? 'Age not provided';
    final String gender = patientData?['sex'] ?? 'Gender not provided';
    final String phone = patientData?['phone_no'] ?? 'Phone not provided';
    final String email = patientData?['email'] ?? 'Email not provided';
    final String address = patientData?['address_details']?['address_line1'] ?? 'Address not provided';
    final String city = patientData?['address_details']?['city'] ?? 'City not provided';
    final String postalCode = patientData?['address_details']?['postal_code'] ?? 'Postal code not provided';

    return Card(
      elevation: 4.0,
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Patient Details',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildDetailRow('Name', name),
            _buildDetailRow('Patient ID', id),
            _buildDetailRow('Age', age),
            _buildDetailRow('Gender', gender),
            _buildDetailRow('Phone', phone),
            _buildDetailRow('Email', email),
            const SizedBox(height: 12),
            const Text(
              'Address',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            _buildDetailRow('Street', address),
            _buildDetailRow('City', city),
            _buildDetailRow('Postal Code', postalCode),
          ],
        ),
      ),
    );
  }

  // Helper method to create a row for each detail.
  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }
}


import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'patient_card_get_byid.dart'; // Ensure this file path is correct.

class PatientLookup extends StatefulWidget {
  const PatientLookup({super.key});

  @override
  _PatientLookupState createState() => _PatientLookupState();
}

class _PatientLookupState extends State<PatientLookup> {
  final TextEditingController _controller = TextEditingController();
  Map<String, dynamic>? patientData;
  bool isLoading = false;
  String? errorMessage;

  Future<void> fetchPatientById(String patientId) async {
    final url = Uri.parse('http://10.0.2.2:4224/patient/get-patient-by-id/$patientId');

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          patientData = data;
          isLoading = false;
        });
      } else if (response.statusCode == 404) {
        setState(() {
          patientData = null;
          errorMessage = 'Patient not found.';
          isLoading = false;
        });
      } else {
        throw Exception('Failed to fetch patient data');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'An error occurred. Please try again.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Lookup'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'Enter Patient ID',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final patientId = _controller.text.trim();
                if (patientId.isNotEmpty) {
                  fetchPatientById(patientId);
                } else {
                  setState(() {
                    errorMessage = 'Please enter a valid patient ID.';
                  });
                }
              },
              child: const Text('Fetch Patient Details'),
            ),
            const SizedBox(height: 16),
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (errorMessage != null)
              Text(
                errorMessage!,
                style: const TextStyle(color: Colors.red),
              )
            else if (patientData != null)
              Expanded(
                child: SingleChildScrollView(
                  child: PatientLookUpCard(patientData: patientData!),
                ),
              )
            else
              const Center(child: Text('No data to display')),
          ],
        ),
      ),
    );
  }
}

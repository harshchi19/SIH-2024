import 'package:flutter/material.dart';
import '../widgets/patient_card.dart';
import '../widgets/patient_form.dart';
import 'patients_detail_page.dart';
import '../../../constants.dart';

class PatientsPage extends StatefulWidget {
  const PatientsPage({super.key});

  @override
  _PatientsPageState createState() => _PatientsPageState();
}

class _PatientsPageState extends State<PatientsPage> {
  final List<Map<String, String>> _patients = [
    {'id': '#P001', 'name': 'Aarav Patel'},
    {'id': '#P002', 'name': 'Vivaan Singh'},
    {'id': '#P003', 'name': 'Anaya Sharma'},
    {'id': '#P004', 'name': 'Ishita Patel'},
    {'id': '#P005', 'name': 'Rohan Deshmukh'},
  ];

  void _addNewPatient(Map<String, String> newPatient) {
    setState(() {
      _patients.add(newPatient);
    });
  }

  void _openAddPatientForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            top: 16,
            left: 16,
            right: 16,
          ),
          child: AddPatientForm(onSubmit: _addNewPatient),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patients'),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: _patients.length,
          itemBuilder: (context, index) {
            final patient = _patients[index];
            return PatientCard(
              id: patient['id']!,
              name: patient['name']!,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        PatientDetailsPage(patient: patient),
                  ),
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _openAddPatientForm,
        backgroundColor: kButtonColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}

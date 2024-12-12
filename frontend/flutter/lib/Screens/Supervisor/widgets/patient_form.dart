import 'package:flutter/material.dart';
import '../../../constants.dart';

class AddPatientForm extends StatefulWidget {
  final Function(Map<String, String>) onSubmit;

  const AddPatientForm({super.key, required this.onSubmit});

  @override
  _AddPatientFormState createState() => _AddPatientFormState();
}

class _AddPatientFormState extends State<AddPatientForm> {
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  final _nameController = TextEditingController();

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final newPatient = {
        'id': _idController.text,
        'name': _nameController.text,
      };
      widget.onSubmit(newPatient);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Add New Patient',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: kPrimaryColor,
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _idController,
            decoration: const InputDecoration(labelText: 'Patient ID'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a patient ID';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Patient Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a patient name';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _submitForm,
            style: ElevatedButton.styleFrom(
              backgroundColor: kPrimaryColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Add Patient',
                style: TextStyle(color: Colors.white)
            ),
          ),
        ],
      ),
    );
  }
}

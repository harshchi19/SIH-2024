import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class PatientRegistrationForm extends StatefulWidget {
  @override
  _PatientRegistrationFormState createState() => _PatientRegistrationFormState();
}

class _PatientRegistrationFormState extends State<PatientRegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();
  File? _image;
  
  // Form fields
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  DateTime? _dateOfBirth;
  String _gender = 'Male';
  final TextEditingController _motherTongueController = TextEditingController();
  final TextEditingController _addressLine1Controller = TextEditingController();
  final TextEditingController _addressLine2Controller = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _stateController = TextEditingController();
  final TextEditingController _postalCodeController = TextEditingController();
  final TextEditingController _countryController = TextEditingController();
  
  // Medical history controllers
  final TextEditingController _multilingualFactorsController = TextEditingController();
  final TextEditingController _attentionDetailsController = TextEditingController();
  final TextEditingController _languageEvaluationController = TextEditingController();
  final TextEditingController _auditorySkillsController = TextEditingController();
  final TextEditingController _formalTestingController = TextEditingController();
  final TextEditingController _diagnosticFormulationController = TextEditingController();
  final TextEditingController _clinicalImpressionController = TextEditingController();
  final TextEditingController _recommendationsController = TextEditingController();
  
  // Speech development controllers
  final TextEditingController _speechVocalizationController = TextEditingController();
  final TextEditingController _speechBabblingController = TextEditingController();
  final TextEditingController _firstWordController = TextEditingController();
  final TextEditingController _firstSentenceController = TextEditingController();

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      setState(() {
        _image = File(image.path);
      });
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      try {
        final uri = Uri.parse('http://10.0.2.2:8002/patient/register');
        final request = http.MultipartRequest('POST', uri);
        
        // Add text fields
        request.fields['full_name'] = _fullNameController.text;
        request.fields['password'] = _passwordController.text;
        request.fields['email'] = _emailController.text;
        request.fields['phone'] = _phoneController.text;
        request.fields['date_of_birth'] = _dateOfBirth!.toIso8601String();
        request.fields['gender'] = _gender;
        request.fields['mother_tongue'] = _motherTongueController.text;
        request.fields['address_line1'] = _addressLine1Controller.text;
        request.fields['address_line2'] = _addressLine2Controller.text;
        request.fields['city'] = _cityController.text;
        request.fields['state'] = _stateController.text;
        request.fields['postal_code'] = _postalCodeController.text;
        request.fields['country'] = _countryController.text;
        request.fields['multilingual_factors'] = _multilingualFactorsController.text;
        request.fields['attention_details'] = _attentionDetailsController.text;
        request.fields['language_evaluation'] = _languageEvaluationController.text;
        request.fields['auditory_skills'] = _auditorySkillsController.text;
        request.fields['formal_testing'] = _formalTestingController.text;
        request.fields['diagnostic_formulation'] = _diagnosticFormulationController.text;
        request.fields['clinical_impression'] = _clinicalImpressionController.text;
        request.fields['recommendations'] = _recommendationsController.text;
        request.fields['speech_vocalization'] = _speechVocalizationController.text;
        request.fields['speech_babbling'] = _speechBabblingController.text;
        request.fields['speech_first_word'] = _firstWordController.text;
        request.fields['speech_first_sentence'] = _firstSentenceController.text;
        
        // Add image if selected
        if (_image != null) {
          request.files.add(await http.MultipartFile.fromPath(
            'image',
            _image!.path,
          ));
        }
        
        final response = await request.send();
        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Registration successful!')),
          );
        } else {
          throw Exception('Failed to register patient');
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Registration'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Basic Information Section
              const Text(
                'Basic Information',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              
              // Image picker
              Center(
                child: Column(
                  children: [
                    if (_image != null)
                      Image.file(_image!, height: 100, width: 100)
                    else
                      const Icon(Icons.person, size: 100),
                    ElevatedButton(
                      onPressed: _pickImage,
                      child: const Text('Take Photo'),
                    ),
                  ],
                ),
              ),
              
              TextFormField(
                controller: _fullNameController,
                decoration: const InputDecoration(labelText: 'Full Name'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Phone'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              // Date of Birth picker
              ListTile(
                title: const Text('Date of Birth'),
                subtitle: Text(_dateOfBirth?.toString() ?? 'Not selected'),
                onTap: () async {
                  final DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    setState(() {
                      _dateOfBirth = picked;
                    });
                  }
                },
              ),
              
              // Gender dropdown
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: const InputDecoration(labelText: 'Gender'),
                items: ['Male', 'Female', 'Other']
                    .map((label) => DropdownMenuItem(
                          value: label,
                          child: Text(label),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _gender = value!;
                  });
                },
              ),
              
              // Address fields
              TextFormField(
                controller: _addressLine1Controller,
                decoration: const InputDecoration(labelText: 'Address Line 1'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _addressLine2Controller,
                decoration: const InputDecoration(labelText: 'Address Line 2'),
              ),
              
              TextFormField(
                controller: _cityController,
                decoration: const InputDecoration(labelText: 'City'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _stateController,
                decoration: const InputDecoration(labelText: 'State'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _postalCodeController,
                decoration: const InputDecoration(labelText: 'Postal Code'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              TextFormField(
                controller: _countryController,
                decoration: const InputDecoration(labelText: 'Country'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              
              // Medical History Section
              const SizedBox(height: 32),
              const Text(
                'Medical History',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              
              TextFormField(
                controller: _multilingualFactorsController,
                decoration: const InputDecoration(labelText: 'Multilingual Factors'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _attentionDetailsController,
                decoration: const InputDecoration(labelText: 'Attention Details'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _languageEvaluationController,
                decoration: const InputDecoration(labelText: 'Language Evaluation'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _auditorySkillsController,
                decoration: const InputDecoration(labelText: 'Auditory Skills'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _formalTestingController,
                decoration: const InputDecoration(labelText: 'Formal Testing'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _diagnosticFormulationController,
                decoration: const InputDecoration(labelText: 'Diagnostic Formulation'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _clinicalImpressionController,
                decoration: const InputDecoration(labelText: 'Clinical Impression'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _recommendationsController,
                decoration: const InputDecoration(labelText: 'Recommendations'),
                maxLines: 3,
              ),
              
              // Speech Development Section
              const SizedBox(height: 32),
              const Text(
                'Speech Development',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              
              TextFormField(
                controller: _speechVocalizationController,
                decoration: const InputDecoration(labelText: 'Speech Vocalization'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _speechBabblingController,
                decoration: const InputDecoration(labelText: 'Speech Babbling'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _firstWordController,
                decoration: const InputDecoration(labelText: 'First Word'),
                maxLines: 3,
              ),
              
              TextFormField(
                controller: _firstSentenceController,
                decoration: const InputDecoration(labelText: 'First Sentence'),
                maxLines: 3,
              ),
              
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitForm,
                  child: const Text('Submit'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
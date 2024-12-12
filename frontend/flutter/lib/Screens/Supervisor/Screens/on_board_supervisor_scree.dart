import 'package:flutter/material.dart';
import 'package:vaanivikas/constants.dart';
import '../../../api_service.dart';

class OnboardSupervisorScreen extends StatefulWidget {
  const OnboardSupervisorScreen({super.key});

  @override
  _OnboardSupervisorScreenState createState() => _OnboardSupervisorScreenState();
}

class _OnboardSupervisorScreenState extends State<OnboardSupervisorScreen> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, String> _formData = {};

  Future<void> _onboardSupervisor() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        final response = await ApiService.onboardSupervisor(_formData);
        if (response["message"] == "sup_onb_suc") {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content:  Text("Supervisor onboarded successfully!"),
          ));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text("Failed to onboard: ${response['message']}"),
          ));
        }
      } catch (e) {
        print("Error: $e");
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text("Error occurred: $e"),
        ));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Onboard Supervisor"),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: "Name"),
                validator: (value) => value!.isEmpty ? "Enter name" : null,
                onSaved: (value) => _formData["name"] = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Email"),
                validator: (value) => value!.isEmpty ? "Enter email" : null,
                onSaved: (value) => _formData["email"] = value!,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Phone Number"),
                validator: (value) => value!.isEmpty ? "Enter phone number" : null,
                onSaved: (value) => _formData["phone_no"] = value!,
              ),
              ElevatedButton(
                onPressed: _onboardSupervisor,
                child: const Text("Submit"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

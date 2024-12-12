import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:flutter_gradient_colors/flutter_gradient_colors.dart';

class SupervisorFormPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Supervisor Details'),
        centerTitle: true,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: GradientColors.green,
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: Container(
        padding: EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green.shade100, Colors.green.shade400],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                  'Supervisor Details',
                  style: TextStyle(
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              SizedBox(height: 20.0),
              CustomTextField(label: 'Supervisor ID', hint: 'Enter Supervisor ID'),
              CustomTextField(label: 'Name', hint: 'Enter Name'),
              CustomTextField(label: 'Password', hint: 'Enter Password', isPassword: true),
              CustomTextField(label: 'Phone Number', hint: 'Enter Phone Number'),
              CustomTextField(label: 'Email', hint: 'Enter Email'),
              CustomTextField(label: 'Date of Birth', hint: 'Enter Date of Birth (YYYY-MM-DD)'),
              CustomTextField(label: 'Age', hint: 'Enter Age'),
              CustomTextField(label: 'Sex', hint: 'Enter Sex (Male/Female)'),
              CustomTextField(label: 'Department', hint: 'Enter Department'),
              CustomTextField(label: 'Preferred Language 1', hint: 'Enter Preferred Language 1'),
              CustomTextField(label: 'Preferred Language 2', hint: 'Enter Preferred Language 2'),
              CustomTextField(label: 'Preferred Language 3', hint: 'Enter Preferred Language 3'),
              SizedBox(height: 20.0),
              Center(
                child: ElevatedButton(
                  onPressed: () {
                    // Handle form submission here
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade700,
                    padding: EdgeInsets.symmetric(horizontal: 30.0, vertical: 15.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                  ),
                  child: Text(
                    'Submit',
                    style: TextStyle(fontSize: 18.0, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CustomTextField extends StatelessWidget {
  final String label;
  final String hint;
  final bool isPassword;

  CustomTextField({
    required this.label,
    required this.hint,
    this.isPassword = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: Colors.green.shade900),
          ),
          SizedBox(height: 5.0),
          TextField(
            obscureText: isPassword,
            decoration: InputDecoration(
              hintText: hint,
              filled: true,
              fillColor: Colors.white,
              contentPadding: EdgeInsets.symmetric(horizontal: 15.0, vertical: 15.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
                borderSide: BorderSide(color: Colors.green.shade700),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

void main() => runApp(MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SupervisorFormPage(),
    ));

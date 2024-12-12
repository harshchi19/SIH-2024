// import 'package:flutter/material.dart';
// import '../../../constants.dart';

// class AppointmentForm extends StatefulWidget {
//   final DateTime selectedDate;

//   const AppointmentForm({required this.selectedDate});

//   @override
//   _AppointmentFormState createState() => _AppointmentFormState();
// }

// class _AppointmentFormState extends State<AppointmentForm> {
//   final _formKey = GlobalKey<FormState>();
//   String? _title;
//   String? _description;

//   void _saveAppointment() {
//     if (_formKey.currentState!.validate()) {
//       _formKey.currentState!.save();
//       // Save data logic here (e.g., send to backend or local database)
//       Navigator.pop(context);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(
//           'Add Appointment - ${widget.selectedDate.toLocal().toString().split(' ')[0]}',
//           style: kAppBarTextStyle,
//         ),
//         backgroundColor: kPrimaryColor,
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: Column(
//             children: [
//               TextFormField(
//                 decoration: const InputDecoration(
//                   labelText: 'Title',
//                   labelStyle: kLabelTextStyle,
//                   border: OutlineInputBorder(),
//                 ),
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     return 'Please enter a title';
//                   }
//                   return null;
//                 },
//                 onSaved: (value) => _title = value,
//               ),
//               const SizedBox(height: 16.0),
//               TextFormField(
//                 decoration: const InputDecoration(
//                   labelText: 'Description',
//                   labelStyle: kLabelTextStyle,
//                   border: OutlineInputBorder(),
//                 ),
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     return 'Please enter a description';
//                   }
//                   return null;
//                 },
//                 onSaved: (value) => _description = value,
//               ),
//               const SizedBox(height: 16.0),
//               ElevatedButton(
//                 onPressed: _saveAppointment,
//                 child: const Text('Save', style: kButtonTextStyle),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: kPrimaryColor,
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../constants.dart';

class AppointmentForm extends StatefulWidget {
  final DateTime selectedDate;

  const AppointmentForm({super.key, required this.selectedDate});

  @override
  _AppointmentFormState createState() => _AppointmentFormState();
}

class _AppointmentFormState extends State<AppointmentForm> {
  final _formKey = GlobalKey<FormState>();
  String? _title;
  String? _description;

  void _saveAppointment() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      // Save data logic here
      Get.back(); // Use Get.back for navigation
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Add Appointment - ${widget.selectedDate.toLocal().toString().split(' ')[0]}',
          style: kAppBarTextStyle,
        ),
        backgroundColor: kPrimaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Title',
                  labelStyle: kLabelTextStyle,
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a title';
                  }
                  return null;
                },
                onSaved: (value) => _title = value,
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Description',
                  labelStyle: kLabelTextStyle,
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a description';
                  }
                  return null;
                },
                onSaved: (value) => _description = value,
              ),
              const SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: _saveAppointment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryColor,
                ),
                child: const Text('Save', style: kButtonTextStyle),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
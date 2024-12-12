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
  String? _supervisor;
  String? _patient;
  String? _roomNo;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  Color _color = Colors.blue;
  bool _activeTab = true;
  String? _userId;

  void _saveAppointment() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      // Save data locally and close the form
      Navigator.of(context).pop({
        "title": _title,
        "supervisor": _supervisor,
        "patient": _patient,
        "roomNo": _roomNo,
        "date": widget.selectedDate,
        "startTime": _startTime,
        "endTime": _endTime,
        "color": _color,
        "activeTab": _activeTab,
        "userId": _userId,
      });
    }
  }

  Future<TimeOfDay?> _pickTime(BuildContext context, TimeOfDay? initialTime) async {
    return await showTimePicker(context: context, initialTime: initialTime ?? TimeOfDay.now());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Add Appointment - ${widget.selectedDate.toLocal().toString().split(' ')[0]}',
          style: kAppBarTextStyle.copyWith(fontWeight: FontWeight.w600),
        ),
        backgroundColor: kPrimaryColor,
        elevation: 10,
        shadowColor: kPrimaryDarkColor.withOpacity(0.5),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: kPrimaryDarkColor.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(4, 4),
              ),
            ],
          ),
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                _buildTextField("Title", "Enter title", (value) => _title = value),
                const SizedBox(height: 16.0),
                _buildTextField("Supervisor", "Enter supervisor", (value) => _supervisor = value),
                const SizedBox(height: 16.0),
                _buildTextField("Patient", "Enter patient", (value) => _patient = value),
                const SizedBox(height: 16.0),
                _buildTextField("Room No", "Enter room number", (value) => _roomNo = value),
                const SizedBox(height: 16.0),
                Row(
                  children: [
                    Expanded(
                      child: _buildTimePicker(
                        "Start Time",
                        _startTime,
                        (value) => setState(() => _startTime = value),
                      ),
                    ),
                    const SizedBox(width: 16.0),
                    Expanded(
                      child: _buildTimePicker(
                        "End Time",
                        _endTime,
                        (value) => setState(() => _endTime = value),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                SwitchListTile(
                  title: const Text("Active Tab"),
                  value: _activeTab,
                  onChanged: (value) => setState(() => _activeTab = value),
                ),
                const SizedBox(height: 16.0),
                _buildTextField("User ID", "Enter user ID", (value) => _userId = value),
                const SizedBox(height: 20.0),
                ElevatedButton(
                  onPressed: _saveAppointment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kButtonColor,
                    padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 40),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 6,
                    shadowColor: kPrimaryDarkColor.withOpacity(0.3),
                  ),
                  child: Text(
                    'Save',
                    style: kButtonTextStyle.copyWith(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String hint, Function(String?) onSaved) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)),
        filled: true,
        fillColor: Colors.grey[200],
      ),
      validator: (value) => value == null || value.isEmpty ? "Please enter $label" : null,
      onSaved: (value) => onSaved(value),
    );
  }

  Widget _buildTimePicker(String label, TimeOfDay? time, Function(TimeOfDay?) onTimePicked) {
    return GestureDetector(
      onTap: () async {
        TimeOfDay? pickedTime = await _pickTime(context, time);
        if (pickedTime != null) {
          onTimePicked(pickedTime);
        }
      },
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)),
        ),
        child: Text(
          time != null ? time.format(context) : "Select $label",
          style: const TextStyle(color: Colors.black),
        ),
      ),
    );
  }
}

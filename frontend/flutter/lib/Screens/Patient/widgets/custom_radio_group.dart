import 'package:flutter/material.dart';

class CustomRadioGroup extends StatefulWidget {
  final String title;
  final List<String> options;
  final ValueChanged<String?> onChanged;

  const CustomRadioGroup({
    super.key,
    required this.title,
    required this.options,
    required this.onChanged,
  });

  @override
  State<CustomRadioGroup> createState() => _CustomRadioGroupState();
}

class _CustomRadioGroupState extends State<CustomRadioGroup> {
  String? _selectedValue;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...widget.options.map(
          (option) => RadioListTile<String>(
            title: Text(option),
            value: option,
            groupValue: _selectedValue,
            onChanged: (value) {
              setState(() {
                _selectedValue = value;
              });
              widget.onChanged(value);
            },
          ),
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';

import '../../widgets/custom_text_field.dart';

class AddressDetailsPage extends StatelessWidget {
  const AddressDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          CustomTextField(
            label: 'Street Address',
            hint: 'Enter street address',
            maxLines: 2,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'City',
            hint: 'Enter city',
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'State',
            hint: 'Enter state',
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Postal Code',
            hint: 'Enter postal code',
            keyboardType: TextInputType.number,
          ),
          SizedBox(height: 16),
          CustomTextField(
            label: 'Country',
            hint: 'Enter country',
          ),
        ],
      ),
    );
  }
}
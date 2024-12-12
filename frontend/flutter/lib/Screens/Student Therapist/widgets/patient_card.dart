import 'package:flutter/material.dart';
import '../../../constants.dart';

class PatientCard extends StatelessWidget {
  final String id;
  final String name;
  final VoidCallback onTap;

  const PatientCard({
    super.key,
    required this.id,
    required this.name,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFB2EBF2), Color(0xFF80DEEA)], // Lighter gradient colors
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: kPrimaryDarkColor.withOpacity(0.5),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: kSecondaryColor.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
          color: Colors.white.withOpacity(0.5), // Glass effect
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                // CircleAvatar with initials
                CircleAvatar(
                  radius: 30,
                  backgroundColor: kButtonColor,
                  child: Text(
                    _getInitials(name),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Patient Name and ID
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: kSecondaryColor,
                      ),
                    ),
                    Text(
                      id,
                      style: const TextStyle(
                        color: kButtonColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Helper function to extract initials
  String _getInitials(String name) {
    final names = name.split(' ');
    final initials = names.length > 1
        ? '${names[0][0]}${names[1][0]}'
        : '${names[0][0]}${names[0][1]}';
    return initials.toUpperCase();
  }
}

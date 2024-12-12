import 'package:flutter/material.dart';

import '../../../constants.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool isEditing = false;

  String profileImage = 'https://avatars.githubusercontent.com/u/143862038?v=4';
  String name = "Yash Buddhadev";
  String email = "yash21@gmail.com";
  String phone = "+91 9876543210";
  String specialization = "Audiology";
  String experience = "2 Years";

  // Text controllers for editing
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController specializationController = TextEditingController();
  final TextEditingController experienceController = TextEditingController();

  @override
  void initState() {
    super.initState();
    nameController.text = name;
    emailController.text = email;
    phoneController.text = phone;
    specializationController.text = specialization;
    experienceController.text = experience;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: kPrimaryDarkColor,
        actions: [
          IconButton(
            icon: Icon(isEditing ? Icons.save : Icons.edit, color: Colors.white),
            onPressed: () {
              if (isEditing) {
                setState(() {
                  name = nameController.text;
                  email = emailController.text;
                  phone = phoneController.text;
                  specialization = specializationController.text;
                  experience = experienceController.text;
                  isEditing = false;
                });
              } else {
                setState(() {
                  isEditing = true;
                });
              }
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Profile Image with border and shadow
            CircleAvatar(
              radius: 60,
              backgroundImage: NetworkImage(profileImage),
              backgroundColor: kSecondaryColor,
            ),
            const SizedBox(height: 20),
            // Title Style for Section Headers
            Text(
              "Profile Details",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: kPrimaryColor,
              ),
            ),
            const SizedBox(height: 20),

            _buildProfileField(
              label: "Name",
              icon: Icons.person,
              controller: nameController,
              isEditing: isEditing,
            ),
            _buildProfileField(
              label: "Email",
              icon: Icons.email,
              controller: emailController,
              isEditing: isEditing,
            ),
            _buildProfileField(
              label: "Phone",
              icon: Icons.phone,
              controller: phoneController,
              isEditing: isEditing,
            ),
            _buildProfileField(
              label: "Specialization",
              icon: Icons.work,
              controller: specializationController,
              isEditing: isEditing,
            ),
            _buildProfileField(
              label: "Experience",
              icon: Icons.timeline,
              controller: experienceController,
              isEditing: isEditing,
            ),

            // Edit Button (styled for a more modern look)
            if (!isEditing)
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    isEditing = true;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 15,
                  ),
                  elevation: 4,
                ),
                child: const Text(
                  "Edit Profile",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileField({
    required String label,
    required IconData icon,
    required TextEditingController controller,
    required bool isEditing,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      elevation: 10,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      shadowColor: kPrimaryColor.withOpacity(0.5), // Greenish shadow
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(
              icon,
              color: kPrimaryColor,
              size: 28,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: isEditing
                  ? TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        labelText: label,
                        labelStyle: TextStyle(
                          color: kPrimaryColor,
                          fontWeight: FontWeight.w500,
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: kButtonColor),
                        ),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: kPrimaryColor.withOpacity(0.6)),
                        ),
                      ),
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          label,
                          style: TextStyle(
                            color: kSecondaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          controller.text,
                          style: const TextStyle(
                            color: Colors.black87,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

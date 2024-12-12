class Supervisor {
  final String id;
  final String supervisorId;
  final String name;
  final String email;
  final String phoneNo;
  final String department;
  final String preferredLanguage1;
  final String preferredLanguage2;
  final String preferredLanguage3;

  Supervisor({
    required this.id,
    required this.supervisorId,
    required this.name,
    required this.email,
    required this.phoneNo,
    required this.department,
    required this.preferredLanguage1,
    required this.preferredLanguage2,
    required this.preferredLanguage3,
  });

  factory Supervisor.fromJson(Map<String, dynamic> json) {
    return Supervisor(
      id: json['_id'] ?? "",
      supervisorId: json['supervisor_id'] ?? "",
      name: json['name'] ?? "",
      email: json['email'] ?? "",
      phoneNo: json['phone_no'] ?? "",
      department: json['department'] ?? "",
      preferredLanguage1: json['preferred_language1'] ?? "",
      preferredLanguage2: json['preferred_language2'] ?? "",
      preferredLanguage3: json['preferred_language3'] ?? "",
    );
  }

   Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone_no': phoneNo,
      'department': department,
      'preferred_language1': preferredLanguage1,
      'preferred_language2': preferredLanguage2,
      'preferred_language3': preferredLanguage3,
    };
   }
}

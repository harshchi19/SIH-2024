class Message {
  final String message;
  final String sentByMe;
  final String timestamp;

  Message({
    required this.message,
    required this.sentByMe,
    String? timestamp
  }) : timestamp = timestamp ?? DateTime.now().toIso8601String();

  // Factory constructor to create a Message from a JSON map
  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      message: json['message'] ?? '',
      sentByMe: json['sentByMe'] ?? '',
      timestamp: json['timestamp'] ?? DateTime.now().toIso8601String(),
    );
  }

  // Convert Message to JSON
  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'sentByMe': sentByMe,
      'timestamp': timestamp,
    };
  }
}
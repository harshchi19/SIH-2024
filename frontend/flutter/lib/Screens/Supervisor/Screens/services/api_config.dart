class ApiConfig {
  static String get baseUrl {
    const bool kIsWeb = bool.fromEnvironment('dart.library.js_util');
    if (kIsWeb) {
      return "http://127.0.0.1:4224"; // Use 127.0.0.1 instead of localhost
    }
    // For Android emulator
    return "http://10.0.2.2:4224";
  }

  static Map<String, String> get headers {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
  }
}
import 'package:flutter/material.dart';

import 'matching_service.dart';

class DisplaySimilarity extends StatelessWidget {
  const DisplaySimilarity({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PDF Similarity Checker',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: UploadScreen(),
    );
  }
}

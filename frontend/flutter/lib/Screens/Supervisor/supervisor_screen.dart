import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';



class SupervisorScreen extends StatefulWidget {
  @override
  _SupervisorScreenState createState() => _SupervisorScreenState();
}

class _SupervisorScreenState extends State<SupervisorScreen> {
  final String baseUrl =
      "http://10.0.2.2:8004"; // Replace with your FastAPI server address
  List<Map<String, dynamic>> files = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchFiles();
  }

  // Fetch list of uploaded files
  Future<void> fetchFiles() async {
    setState(() {
      isLoading = true;
    });
    try {
      final response = await Dio().get("$baseUrl/list_files/");
      if (response.statusCode == 200) {
        setState(() {
          files = List<Map<String, dynamic>>.from(response.data);
        });
      }
    } catch (e) {
      print("Error fetching files: $e");
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Download selected file
  Future<void> downloadFile(int fileId, String fileName) async {
    try {
      final dir = await getApplicationDocumentsDirectory();
      final filePath = "${dir.path}/$fileName";
      final response = await Dio().download(
        "$baseUrl/download_file/$fileId",
        filePath,
        onReceiveProgress: (received, total) {
          if (total != -1) {
            print("Progress: ${(received / total * 100).toStringAsFixed(0)}%");
          }
        },
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("File downloaded: $filePath")),
        );
      }
    } catch (e) {
      print("Error downloading file: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to download file")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Supervisor Panel"),
        backgroundColor: Colors.deepPurple,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : files.isEmpty
              ? Center(child: Text("No files uploaded yet."))
              : ListView.builder(
                  itemCount: files.length,
                  itemBuilder: (context, index) {
                    final file = files[index];
                    return Card(
                      margin: EdgeInsets.all(10),
                      child: ListTile(
                        title: Text(file['filename']),
                        trailing: IconButton(
                          icon: Icon(Icons.download),
                          onPressed: () =>
                              downloadFile(file['id'], file['filename']),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}

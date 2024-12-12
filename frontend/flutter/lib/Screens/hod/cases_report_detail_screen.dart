import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:open_filex/open_filex.dart';
import 'package:vaanivikas/constants.dart';

class CaseDetailsPage extends StatefulWidget {
  final String caseId;
  final Map<String, String> details;

  const CaseDetailsPage({super.key, required this.caseId, required this.details});

  @override
  State<CaseDetailsPage> createState() => _CaseDetailsPageState();
}

class _CaseDetailsPageState extends State<CaseDetailsPage> {
  String? uploadedFileName;
  final TextEditingController _modifyController = TextEditingController();
  final TextEditingController _rejectController = TextEditingController();

  void _uploadReport() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        uploadedFileName = result.files.single.name;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Uploaded: ${result.files.single.name}')),
      );
    }
  }

  void _downloadReport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Downloading report...')),
    );

    if (uploadedFileName != null) {
      OpenFilex.open(uploadedFileName!);
    }
  }

  void _showOptionsBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DefaultTabController(
        length: 3,
        child: Container(
          height: MediaQuery.of(context).size.height * 0.7,
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TabBar(
                labelColor: kPrimaryColor,
                unselectedLabelColor: Colors.grey,
                indicatorColor: kPrimaryColor,
                tabs: [
                  Tab(
                    icon: Icon(Icons.check_circle_outline, color: kPrimaryColor),
                    text: 'Approve',
                  ),
                  Tab(
                    icon: Icon(Icons.edit, color: kPrimaryColor),
                    text: 'Modify',
                  ),
                  Tab(
                    icon: Icon(Icons.close, color: Colors.red),
                    text: 'Reject',
                  ),
                ],
              ),
              Expanded(
                child: TabBarView(
                  children: [
                    // Approve Tab
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check_circle, color: kPrimaryColor, size: 100),
                          const SizedBox(height: 16),
                          Text(
                            'Are you sure you want to approve this case?',
                            style: TextStyle(color: kPrimaryDarkColor, fontSize: 16),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () {
                              // TODO: Implement approve logic
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Case Approved')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: kPrimaryColor,
                            ),
                            child: const Text('Confirm Approval'),
                          ),
                        ],
                      ),
                    ),
                    // Modify Tab
                    Column(
                      children: [
                        TextField(
                          controller: _modifyController,
                          decoration: InputDecoration(
                            hintText: 'Enter modification details',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: kPrimaryColor),
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          maxLines: 4,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            // TODO: Implement modify logic
                            if (_modifyController.text.isNotEmpty) {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Modification Sent: ${_modifyController.text}')),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: kPrimaryColor,
                          ),
                          child: const Text('Send Modification'),
                        ),
                      ],
                    ),
                    // Reject Tab
                    Column(
                      children: [
                        TextField(
                          controller: _rejectController,
                          decoration: InputDecoration(
                            hintText: 'Enter reason for rejection',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.red),
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          maxLines: 4,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            // TODO: Implement reject logic
                            if (_rejectController.text.isNotEmpty) {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Case Rejected: ${_rejectController.text}')),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                          ),
                          child: const Text('Confirm Rejection'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final details = widget.details;

    return Scaffold(
      appBar: AppBar(
        title: Text('Details - ${widget.caseId}'),
        backgroundColor: kPrimaryColor,
        elevation: 6,
        shadowColor: kPrimaryDarkColor,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [kPrimaryLightColor, kSecondaryColor],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [kPrimaryLightColor.withOpacity(0.7), kPrimaryDarkColor.withOpacity(0.7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12.0),
                  boxShadow: [
                    BoxShadow(
                      color: kSecondaryColor.withOpacity(0.4),
                      blurRadius: 10,
                      offset: const Offset(2, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Case Details',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Therapist: ${details['therapist']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Appointment: ${details['appointment']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Details: ${details['details']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    Text(
                      'Date: ${details['date']}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Container(
                height: 1,
                color: kPrimaryDarkColor.withOpacity(0.5),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _uploadReport,
                icon: const Icon(Icons.upload_file, color: Colors.white),
                label: const Text(
                  'Upload Report',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  shadowColor: Colors.black45,
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _downloadReport,
                icon: const Icon(Icons.download, color: Colors.white),
                label: const Text(
                  'Download Report',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kButtonColor,
                  shadowColor: Colors.black45,
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _showOptionsBottomSheet,
                icon: const Icon(Icons.menu, color: Colors.white),
                label: const Text(
                  'Feedback',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryColor,
                  shadowColor: Colors.black45,
                  elevation: 8,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              if (uploadedFileName != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [kPrimaryLightColor.withOpacity(0.5), kPrimaryDarkColor.withOpacity(0.5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Text(
                    'Uploaded Report: $uploadedFileName',
                    style: const TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    // Dispose of controllers to prevent memory leaks
    _modifyController.dispose();
    _rejectController.dispose();
    super.dispose();
  }
}
// import 'package:flutter/material.dart';
// import 'package:file_picker/file_picker.dart';
// import 'package:open_filex/open_filex.dart';
// import 'package:vaanivikas/constants.dart';

// class CaseDetailsPage extends StatefulWidget {
//   final String caseId;
//   final Map<String, String> details;

//   const CaseDetailsPage({super.key, required this.caseId, required this.details});

//   @override
//   State<CaseDetailsPage> createState() => _CaseDetailsPageState();
// }

// class _CaseDetailsPageState extends State<CaseDetailsPage> {
//   String? uploadedFileName;
//   final TextEditingController _modifyController = TextEditingController();
//   final TextEditingController _rejectController = TextEditingController();
//   final TextEditingController _approveController = TextEditingController();

//   void _uploadReport() async {
//     FilePickerResult? result = await FilePicker.platform.pickFiles();

//     if (result != null) {
//       setState(() {
//         uploadedFileName = result.files.single.name;
//       });
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Uploaded: ${result.files.single.name}')),
//       );
//     }
//   }

//   void _downloadReport() {
//     ScaffoldMessenger.of(context).showSnackBar(
//       const SnackBar(content: Text('Downloading report...')),
//     );

//     if (uploadedFileName != null) {
//       OpenFilex.open(uploadedFileName!);
//     }
//   }

//   void _showActionDialog(String action) {
//     TextEditingController controller;
//     Color actionColor;
//     String hintText;

//     switch (action) {
//       case 'Approve':
//         controller = _approveController;
//         actionColor = kPrimaryColor;
//         hintText = 'Enter approval notes (optional)';
//         break;
//       case 'Modify':
//         controller = _modifyController;
//         actionColor = kPrimaryColor;
//         hintText = 'Enter modification details';
//         break;
//       case 'Reject':
//         controller = _rejectController;
//         actionColor = Colors.red;
//         hintText = 'Enter reason for rejection';
//         break;
//       default:
//         return;
//     }

//     showDialog(
//       context: context,
//       builder: (context) => AlertDialog(
//         title: Text('$action Case', style: TextStyle(color: actionColor)),
//         content: TextField(
//           controller: controller,
//           decoration: InputDecoration(
//             hintText: hintText,
//             border: OutlineInputBorder(
//               borderRadius: BorderRadius.circular(10),
//             ),
//             focusedBorder: OutlineInputBorder(
//               borderSide: BorderSide(color: actionColor),
//               borderRadius: BorderRadius.circular(10),
//             ),
//           ),
//           maxLines: 4,
//         ),
//         actions: [
//           TextButton(
//             onPressed: () => Navigator.pop(context),
//             child: const Text('Cancel'),
//           ),
//           ElevatedButton(
//             onPressed: () {
//               Navigator.pop(context);
              
//               // Handle different actions
//               switch (action) {
//                 case 'Approve':
//                   _handleApprove(controller.text);
//                   break;
//                 case 'Modify':
//                   _handleModify(controller.text);
//                   break;
//                 case 'Reject':
//                   _handleReject(controller.text);
//                   break;
//               }
              
//               // Clear the controller
//               controller.clear();
//             },
//             style: ElevatedButton.styleFrom(backgroundColor: actionColor),
//             child: Text('Confirm $action'),
//           ),
//         ],
//       ),
//     );
//   }

//   void _handleApprove(String notes) {
//     ScaffoldMessenger.of(context).showSnackBar(
//       SnackBar(
//         content: Text('Case Approved${notes.isNotEmpty ? ': $notes' : ''}'),
//         backgroundColor: kPrimaryColor,
//       ),
//     );
//     // TODO: Implement actual approve logic
//   }

//   void _handleModify(String details) {
//     ScaffoldMessenger.of(context).showSnackBar(
//       SnackBar(
//         content: Text('Modification Requested: $details'),
//         backgroundColor: kPrimaryColor,
//       ),
//     );
//     // TODO: Implement actual modify logic
//   }

//   void _handleReject(String reason) {
//     ScaffoldMessenger.of(context).showSnackBar(
//       SnackBar(
//         content: Text('Case Rejected: $reason'),
//         backgroundColor: Colors.red,
//       ),
//     );
//     // TODO: Implement actual reject logic
//   }

//   @override
//   Widget build(BuildContext context) {
//     final details = widget.details;

//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Details - ${widget.caseId}'),
//         backgroundColor: kPrimaryColor,
//         elevation: 6,
//         shadowColor: kPrimaryDarkColor,
//       ),
//       body: Container(
//         decoration: const BoxDecoration(
//           gradient: LinearGradient(
//             colors: [kPrimaryLightColor, kSecondaryColor],
//             begin: Alignment.topLeft,
//             end: Alignment.bottomRight,
//           ),
//         ),
//         child: Padding(
//           padding: const EdgeInsets.all(16.0),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Container(
//                 padding: const EdgeInsets.all(16.0),
//                 decoration: BoxDecoration(
//                   gradient: LinearGradient(
//                     colors: [kPrimaryLightColor.withOpacity(0.7), kPrimaryDarkColor.withOpacity(0.7)],
//                     begin: Alignment.topLeft,
//                     end: Alignment.bottomRight,
//                   ),
//                   borderRadius: BorderRadius.circular(12.0),
//                   boxShadow: [
//                     BoxShadow(
//                       color: kSecondaryColor.withOpacity(0.4),
//                       blurRadius: 10,
//                       offset: const Offset(2, 4),
//                     ),
//                   ],
//                 ),
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     const Text(
//                       'Case Details',
//                       style: TextStyle(
//                         fontSize: 22,
//                         fontWeight: FontWeight.bold,
//                         color: Colors.white,
//                       ),
//                     ),
//                     const SizedBox(height: 16),
//                     Text(
//                       'Therapist: ${details['therapist']}',
//                       style: const TextStyle(color: Colors.white70, fontSize: 16),
//                     ),
//                     Text(
//                       'Appointment: ${details['appointment']}',
//                       style: const TextStyle(color: Colors.white70, fontSize: 16),
//                     ),
//                     Text(
//                       'Details: ${details['details']}',
//                       style: const TextStyle(color: Colors.white70, fontSize: 16),
//                     ),
//                     Text(
//                       'Date: ${details['date']}',
//                       style: const TextStyle(color: Colors.white70, fontSize: 16),
//                     ),
//                   ],
//                 ),
//               ),
//               const SizedBox(height: 24),
//               Container(
//                 height: 1,
//                 color: kPrimaryDarkColor.withOpacity(0.5),
//               ),
//               const SizedBox(height: 24),
//               ElevatedButton.icon(
//                 onPressed: _uploadReport,
//                 icon: const Icon(Icons.upload_file, color: Colors.white),
//                 label: const Text(
//                   'Upload Report',
//                   style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
//                 ),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: kButtonColor,
//                   shadowColor: Colors.black45,
//                   elevation: 8,
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(10),
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 16),
//               ElevatedButton.icon(
//                 onPressed: _downloadReport,
//                 icon: const Icon(Icons.download, color: Colors.white),
//                 label: const Text(
//                   'Download Report',
//                   style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
//                 ),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: kButtonColor,
//                   shadowColor: Colors.black45,
//                   elevation: 8,
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(10),
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 16),
//               PopupMenuButton<String>(
//                 onSelected: (String action) {
//                   _showActionDialog(action);
//                 },
//                 itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
//                   const PopupMenuItem<String>(
//                     value: 'Approve',
//                     child: ListTile(
//                       leading: Icon(Icons.check_circle_outline, color: kPrimaryColor),
//                       title: Text('Approve'),
//                     ),
//                   ),
//                   const PopupMenuItem<String>(
//                     value: 'Modify',
//                     child: ListTile(
//                       leading: Icon(Icons.edit, color: kPrimaryColor),
//                       title: Text('Modify'),
//                     ),
//                   ),
//                   const PopupMenuItem<String>(
//                     value: 'Reject',
//                     child: ListTile(
//                       leading: Icon(Icons.close, color: Colors.red),
//                       title: Text('Reject'),
//                     ),
//                   ),
//                 ],
//                 child: ElevatedButton.icon(
//                   icon: const Icon(Icons.menu, color: Colors.white),
//                   label: const Text(
//                     'Actions',
//                     style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
//                   ),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: kPrimaryColor,
//                     shadowColor: Colors.black45,
//                     elevation: 8,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                   ), onPressed: () {  },
//                 ),
//               ),
              
//               if (uploadedFileName != null) ...[
//                 const SizedBox(height: 16),
//                 Container(
//                   padding: const EdgeInsets.all(8.0),
//                   decoration: BoxDecoration(
//                     gradient: LinearGradient(
//                       colors: [kPrimaryLightColor.withOpacity(0.5), kPrimaryDarkColor.withOpacity(0.5)],
//                       begin: Alignment.topLeft,
//                       end: Alignment.bottomRight,
//                     ),
//                     borderRadius: BorderRadius.circular(10.0),
//                   ),
//                   child: Text(
//                     'Uploaded Report: $uploadedFileName',
//                     style: const TextStyle(color: Colors.white, fontSize: 16),
//                   ),
//                 ),
//               ],
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   @override
//   void dispose() {
//     // Dispose of controllers to prevent memory leaks
//     _modifyController.dispose();
//     _rejectController.dispose();
//     _approveController.dispose();
//     super.dispose();
//   }
// }
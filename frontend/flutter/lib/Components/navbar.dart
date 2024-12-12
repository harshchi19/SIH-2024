// // import 'package:flutter/material.dart';

// // class Navbar extends StatelessWidget {
// //   final String userName;
// //   final String userEmail;
// //   final String userImage;
// //   final List<Map<String, dynamic>> sidebarData;

// //   const Navbar({
// //     Key? key,
// //     required this.userName,
// //     required this.userEmail,
// //     required this.userImage,
// //     required this.sidebarData,
// //   }) : super(key: key);

// //   @override
// //   Widget build(BuildContext context) {
// //     return Drawer(
// //       child: ListView(
// //         padding: EdgeInsets.zero,
// //         children: [
// //           UserAccountsDrawerHeader(
// //             accountName: Text(userName),
// //             accountEmail: Text(userEmail),
// //             currentAccountPicture: CircleAvatar(
// //               child: ClipOval(
// //                 child: Image.asset(userImage),
// //               ),
// //             ),
// //             decoration: const BoxDecoration(
// //               color: Colors.blue, // Customize your header background color
// //             ),
// //           ),
// //           ...sidebarData.map((item) {
// //             return ListTile(
// //               leading: Icon(_getIconData(item['icon'])),
// //               title: Text(item['name']),
// //               onTap: () {
// //                 // Navigate to the route
// //                 Navigator.pushNamed(context, item['route']);
// //               },
// //             );
// //           }).toList(),
// //           ListTile(
// //             leading: const Icon(Icons.logout_outlined),
// //             title: const Text('Sign Out'),
// //             onTap: () => print("Signout Button Pressed!"),
// //           ),
// //         ],
// //       ),
// //     );
// //   }

// //   IconData _getIconData(String iconName) {
// //     switch (iconName) {
// //       case 'LayoutDashboard':
// //         return Icons.dashboard_outlined;
// //       case 'Users':
// //         return Icons.group_outlined;
// //       case 'Calendar':
// //         return Icons.calendar_month_outlined;
// //       case 'MessageSquare':
// //         return Icons.message_outlined;
// //       case 'Map':
// //         return Icons.map_outlined;
// //       case 'BookOpenText':
// //         return Icons.book_outlined;
// //       default:
// //         return Icons.help_outline; // Default icon
// //     }
// //   }
// // }

// import 'package:flutter/material.dart';

// class Navbar extends StatelessWidget {
//   final String userName;
//   final String userEmail;
//   final String userImage;
//   final List<Map<String, dynamic>> sidebarData;

//   const Navbar({
//     Key? key,
//     required this.userName,
//     required this.userEmail,
//     required this.userImage,
//     required this.sidebarData,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           UserAccountsDrawerHeader(
//             accountName: Text(userName),
//             accountEmail: Text(userEmail),
//             currentAccountPicture: CircleAvatar(
//               child: ClipOval(
//                 child: Image.asset(userImage),
//               ),
//             ),
//             decoration: const BoxDecoration(
//               color: Colors.blue, // Customize your header background color
//             ),
//           ),
//           ...sidebarData.map((item) {
//             if (item.containsKey('children') &&
//                 (item['children'] as List).isNotEmpty) {
//               return ExpansionTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 children: (item['children'] as List).map((child) {
//                   return ListTile(
//                     leading: Icon(_getIconData(child['icon'])),
//                     title: Text(child['name']),
//                     onTap: () {
//                       if (item['route'] != null && item['route'].isNotEmpty) {
//                         debugPrint('Navigating to route: ${item['route']}');
//                         Navigator.pushNamed(context, item['route']);
//                       } else {
//                         debugPrint('Missing route for: ${item['name']}');
//                         ScaffoldMessenger.of(context).showSnackBar(
//                           SnackBar(
//                               content: Text(
//                                   'Route not defined for ${item['name']}')),
//                         );
//                       }
//                     },
//                   );
//                 }).toList(),
//               );
//             } else {
//               return ListTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 onTap: () {
//                   if (item['route'] != null && item['route'].isNotEmpty) {
//                     Navigator.pushNamed(context, item['route']);
//                   } else {
//                     ScaffoldMessenger.of(context).showSnackBar(
//                       SnackBar(
//                           content:
//                               Text('Route not available for ${item['name']}')),
//                     );
//                   }
//                 },
//               );
//             }
//           }).toList(),
//           ListTile(
//             leading: const Icon(Icons.logout_outlined),
//             title: const Text('Sign Out'),
//             onTap: () => print("Signout Button Pressed!"),
//           ),
//         ],
//       ),
//     );
//   }

//   IconData _getIconData(String iconName) {
//     switch (iconName) {
//       case 'LayoutDashboard':
//         return Icons.dashboard_outlined;
//       case 'Users':
//         return Icons.group_outlined;
//       case 'Calendar':
//         return Icons.calendar_month_outlined;
//       case 'MessageSquare':
//         return Icons.message_outlined;
//       case 'Map':
//         return Icons.map_outlined;
//       case 'BookOpenText':
//         return Icons.book_outlined;
//       default:
//         return Icons.help_outline; // Default icon
//     }
//   }
// }

// import 'package:flutter/material.dart';

// class Navbar extends StatelessWidget {
//   final String userName;
//   final String userEmail;
//   final String userImage;
//   final List<Map<String, dynamic>> sidebarData;

//   const Navbar({
//     Key? key,
//     required this.userName,
//     required this.userEmail,
//     required this.userImage,
//     required this.sidebarData,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           UserAccountsDrawerHeader(
//             accountName: Text(userName),
//             accountEmail: Text(userEmail),
//             currentAccountPicture: CircleAvatar(
//               child: ClipOval(
//                 child: Image.asset(userImage),
//               ),
//             ),
//             decoration: const BoxDecoration(
//               color: Colors.blue,
//             ),
//           ),
//           ...sidebarData.map((item) {
//             if (item.containsKey('children') &&
//                 (item['children'] as List).isNotEmpty) {
//               return ExpansionTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 children: (item['children'] as List).map((child) {
//                   return ListTile(
//                     leading: Icon(_getIconData(child['icon'])),
//                     title: Text(child['name']),
//                     onTap: () {
//                       _navigateToRoute(context, child);
//                     },
//                   );
//                 }).toList(),
//               );
//             } else {
//               return ListTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 onTap: () {
//                   _navigateToRoute(context, item);
//                 },
//               );
//             }
//           }).toList(),
//           ListTile(
//             leading: const Icon(Icons.logout_outlined),
//             title: const Text('Sign Out'),
//             onTap: () {
//               print("Signout Button Pressed!");
//               // Add logout logic here
//               Navigator.pushNamedAndRemoveUntil(
//                 context, 
//                 '/', 
//                 (route) => false
//               );
//             },
//           ),
//         ],
//       ),
//     );
//   }

//   void _navigateToRoute(BuildContext context, Map<String, dynamic> item) {
//     if (item['route'] != null && item['route'].isNotEmpty) {
//       debugPrint('Navigating to route: ${item['route']}');
      
//       // Close the drawer before navigating
//       Navigator.pop(context);
      
//       // Navigate to the specified route
//       Navigator.pushNamed(context, item['route']);
//     } else {
//       debugPrint('Missing route for: ${item['name']}');
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Route not defined for ${item['name']}')),
//       );
//     }
//   }

//   IconData _getIconData(String iconName) {
//     switch (iconName) {
//       case 'LayoutDashboard':
//         return Icons.dashboard_outlined;
//       case 'Users':
//         return Icons.group_outlined;
//       case 'Calendar':
//         return Icons.calendar_month_outlined;
//       case 'MessageSquare':
//         return Icons.message_outlined;
//       case 'Map':
//         return Icons.map_outlined;
//       case 'BookOpenText':
//         return Icons.book_outlined;
//       default:
//         return Icons.help_outline;
//     }
//   }
// }

// import 'package:flutter/material.dart';

// // Import all necessary screens
// import 'package:vaanivikas/Screens/Supervisor/Screens/chat_screen.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/display_supervisors.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/cases_reports.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/patients_page.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/profile.dart';
// import 'package:vaanivikas/Screens/Supervisor/Screens/student_therapist_page.dart';
// import 'package:vaanivikas/Screens/Supervisor/widgets/notifications_panel.dart';
// import 'package:vaanivikas/constants.dart';

// class Navbar extends StatelessWidget {
//   final String userName;
//   final String userEmail;
//   final String userImage;
//   final List<dynamic> sidebarData;

//   const Navbar({
//     Key? key,
//     required this.userName,
//     required this.userEmail,
//     required this.userImage,
//     required this.sidebarData,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Drawer(
//       child: ListView(
//         padding: EdgeInsets.zero,
//         children: [
//           UserAccountsDrawerHeader(
//             accountName: Text(userName),
//             accountEmail: Text(userEmail),
//             currentAccountPicture: CircleAvatar(
//               child: ClipOval(
//                 child: Image.asset(userImage),
//               ),
//             ),
//             decoration: const BoxDecoration(
//               color: kPrimaryDarkColor,
//             ),
//           ),
//           // Dynamic sidebar items
//           ...sidebarData.map((item) {
//             if (item.containsKey('children') &&
//                 (item['children'] as List).isNotEmpty) {
//               return ExpansionTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 children: (item['children'] as List).map((child) {
//                   return ListTile(
//                     leading: Icon(_getIconData(child['icon'])),
//                     title: Text(child['name']),
//                     onTap: () {
//                       _navigateToRoute(context, child);
//                     },
//                   );
//                 }).toList(),
//               );
//             } else {
//               return ListTile(
//                 leading: Icon(_getIconData(item['icon'])),
//                 title: Text(item['name']),
//                 onTap: () {
//                   _navigateToRoute(context, item);
//                 },
//               );
//             }
//           }).toList(),
          
//           // Additional static navigation items from original Navbar
//           ...getAdditionalNavItems(context),
//         ],
//       ),
//     );
//   }

//   // Method to add additional navigation items not in sidebar data
//   List<Widget> getAdditionalNavItems(BuildContext context) {
//     return [
//       // Additional items not in dynamic sidebar
//       ListTile(
//         leading: const Icon(Icons.cases_outlined),
//         title: const Text('Case Allocation'),
//         onTap: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(builder: (context) => CasesAndReportsPage()),
//           );
//         },
//       ),
//       ListTile(
//         leading: const Icon(Icons.feedback_outlined),
//         title: const Text('Reports'),
//         onTap: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(builder: (context) => CasesAndReportsPage()),
//           );
//         },
//       ),
//       ListTile(
//         leading: const Icon(Icons.notification_add_outlined),
//         title: const Text('Notification'),
//         onTap: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(builder: (context) => const NotificationPanel()),
//           );
//         },
//       ),
//       // Logout item
//       ListTile(
//         leading: const Icon(Icons.logout_outlined),
//         title: const Text('Sign Out'),
//         onTap: () {
//           print("Signout Button Pressed!");
//           // Add logout logic here
//           Navigator.pushNamedAndRemoveUntil(
//             context, 
//             '/', 
//             (route) => false
//           );
//         },
//       ),
//     ];
//   }

//   void _navigateToRoute(BuildContext context, Map item) {
//     if (item['route'] != null && item['route'].isNotEmpty) {
//       debugPrint('Navigating to route: ${item['route']}');
      
//       // Close the drawer before navigating
//       Navigator.pop(context);
      
//       // Navigate to the specified route
//       Navigator.pushNamed(context, item['route']);
//     } else {
//       debugPrint('Missing route for: ${item['name']}');
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Route not defined for ${item['name']}')),
//       );
//     }
//   }

//   IconData _getIconData(String iconName) {
//     switch (iconName) {
//       case 'LayoutDashboard':
//         return Icons.dashboard_outlined;
//       case 'Users':
//         return Icons.group_outlined;
//       case 'Calendar':
//         return Icons.calendar_month_outlined;
//       case 'MessageSquare':
//         return Icons.message_outlined;
//       case 'Map':
//         return Icons.map_outlined;
//       case 'BookOpenText':
//         return Icons.book_outlined;
//       case 'FileText':
//         return Icons.file_copy_outlined;
//       default:
//         return Icons.help_outline;
//     }
//   }
// }

// // Helper class for navigation (optional, but recommended)
// class NavigationHelper {
//   static void navigateToRoute(BuildContext context, String route) {
//     Navigator.pushNamed(context, route);
//   }

//   static void navigateToRouteWithArguments(
//     BuildContext context, 
//     String route, 
//     dynamic arguments
//   ) {
//     Navigator.pushNamed(
//       context, 
//       route, 
//       arguments: arguments
//     );
//   }
// }

import 'package:flutter/material.dart';

// Import all necessary screens
import 'package:vaanivikas/Screens/Supervisor/Screens/chat_screen.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/display_supervisors.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/cases_reports.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/patients_page.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/profile.dart';
import 'package:vaanivikas/Screens/Supervisor/Screens/student_therapist_page.dart';
import 'package:vaanivikas/Screens/Supervisor/widgets/notifications_panel.dart';
import 'package:vaanivikas/constants.dart';

class Navbar extends StatelessWidget {
  final String userName;
  final String userEmail;
  final String userImage;
  final List<dynamic> sidebarData;

  const Navbar({
    Key? key,
    required this.userName,
    required this.userEmail,
    required this.userImage,
    required this.sidebarData,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(userName),
            accountEmail: Text(userEmail),
            currentAccountPicture: CircleAvatar(
              child: ClipOval(
                child: Image.asset(userImage),
              ),
            ),
            decoration: const BoxDecoration(
              color: kPrimaryDarkColor,
            ),
          ),
          // Dynamic sidebar items
          ...sidebarData.map((item) {
            if (item.containsKey('children') &&
                (item['children'] as List).isNotEmpty) {
              return ExpansionTile(
                leading: Icon(_getIconData(item['icon'])),
                title: Text(item['name']),
                children: (item['children'] as List).map((child) {
                  return ListTile(
                    leading: Icon(_getIconData(child['icon'])),
                    title: Text(child['name']),
                    onTap: () {
                      _navigateToRoute(context, child);
                    },
                  );
                }).toList(),
              );
            } else {
              return ListTile(
                leading: Icon(_getIconData(item['icon'])),
                title: Text(item['name']),
                onTap: () {
                  _navigateToRoute(context, item);
                },
              );
            }
          }).toList(),
        ],
      ),
    );
  }

  void _navigateToRoute(BuildContext context, Map item) {
    if (item['route'] != null && item['route'].isNotEmpty) {
      debugPrint('Navigating to route: ${item['route']}');
      
      // Close the drawer before navigating
      Navigator.pop(context);
      
      // Navigate to the specified route
      Navigator.pushNamed(context, item['route']);
    } else {
      debugPrint('Missing route for: ${item['name']}');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Route not defined for ${item['name']}')),
      );
    }
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'LayoutDashboard':
        return Icons.dashboard_outlined;
      case 'Users':
        return Icons.group_outlined;
      case 'Calendar':
        return Icons.calendar_month_outlined;
      case 'MessageSquare':
        return Icons.message_outlined;
      case 'Map':
        return Icons.map_outlined;
      case 'BookOpenText':
        return Icons.book_outlined;
      case 'FileText':
        return Icons.file_copy_outlined;
      default:
        return Icons.help_outline;
    }
  }
}

// Helper class for navigation (optional, but recommended)
class NavigationHelper {
  static void navigateToRoute(BuildContext context, String route) {
    Navigator.pushNamed(context, route);
  }

  static void navigateToRouteWithArguments(
    BuildContext context, 
    String route, 
    dynamic arguments
  ) {
    Navigator.pushNamed(
      context, 
      route, 
      arguments: arguments
    );
  }
}
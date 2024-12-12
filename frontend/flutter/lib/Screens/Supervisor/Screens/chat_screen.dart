// import 'package:flutter/material.dart';
// import 'package:flutter_application_1/controller/chat_controller.dart';
// import 'package:flutter_application_1/model/message.dart';
// import 'package:get/get.dart';
// import 'package:socket_io_client/socket_io_client.dart' as IO;


// class ChatScreen extends StatefulWidget {
//   const ChatScreen({Key? key}) : super(key: key);

//   @override
//   _ChatScreenState createState() => _ChatScreenState();
// }

// class _ChatScreenState extends State<ChatScreen> {
//   Color green = Colors.green;
//   Color black = Colors.black;
//   TextEditingController msgInputController = TextEditingController();

//   late IO.Socket socket;
//   ChatController chatController = ChatController();

//   @override
//   void initState() {
//     socket = IO.io(
//       'http://localhost:4000',
//       IO.OptionBuilder()
//           .setTransports(['websocket'])
//           .disableAutoConnect()
//           .build(),
//     );

//     socket.connect();
//     setUpSocketListener();
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: black,
//       body: Container(
//         child: Column(
//           children: [
//             Expanded(
//               flex: 9,
//               child: Obx(
//                 () => ListView.builder(
//                   itemCount: chatController.chatMessages.length,
//                   itemBuilder: (context, index) {
//                     var currentItem = chatController.chatMessages[index];
      
//                     return MessageItem(
//                       sentByMe: currentItem.sentByMe == socket.id,
//                       message: currentItem.message,
//                     );
//                   },
//                 ),
//               ),
//             ),
//             Expanded(
//               child: Container(
//                 padding: EdgeInsets.all(10),
//                 color: Colors.green,
//                 child: TextField(
//                   style: TextStyle(color: Colors.white),
//                   cursorColor: green,
//                   controller: msgInputController,
//                   decoration: InputDecoration(
//                     enabledBorder: OutlineInputBorder(
//                       borderSide: BorderSide(color: Colors.white),
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                     focusedBorder: OutlineInputBorder(
//                       borderSide: BorderSide(color: Colors.white),
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                     suffixIcon: Container(
//                       margin: EdgeInsets.only(right: 10),
//                       decoration: BoxDecoration(
//                         borderRadius: BorderRadius.circular(10),
//                         color: green,
//                       ),
//                       child: IconButton(
//                         onPressed: () {
//                           sendMessage(msgInputController.text);
//                           msgInputController.text = "";
//                         },
//                         icon: Icon(
//                           Icons.send,
//                           color: Colors.white,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   void sendMessage(String text) {
//     var messageJson = {
//       "message":text,
//       "sentByMe":socket.id

//     };
//     socket.emit('message',messageJson);
//     // chatController.chatMessages.add(Message.fromJson(messageJson));
//   }
//   void setUpSocketListener() {
//     socket.on('message-receive', (data) {
//       print(data);
//       // chatController.chatMessages.add(Message.fromJson(data));
//     });
//   }
// }

// class MessageItem extends StatelessWidget {
//   const MessageItem({Key? key, required this.sentByMe, required this.message}) : super(key: key);
//   final bool sentByMe;
//   final String message;

//   @override
//   Widget build(BuildContext context) {
//     Color green = Colors.green;
//     Color white = Colors.white;

//     return Align(
//       alignment: sentByMe ? Alignment.bottomRight : Alignment.centerLeft,
//       child: Container(
//         padding: EdgeInsets.symmetric(
//           vertical: 5,
//           horizontal: 10,
//         ),
//         margin: EdgeInsets.symmetric(
//           vertical: 3,
//           horizontal: 10,
//         ),
//         decoration: BoxDecoration(
//           borderRadius: BorderRadius.circular(5),
//           color: sentByMe ? green : white,
//         ),
//         child: Row(
//           mainAxisSize: MainAxisSize.min,
//           crossAxisAlignment: CrossAxisAlignment.baseline,
//           textBaseline: TextBaseline.alphabetic,
//           children: [
//             Text(
//               message,
//               style: TextStyle(
//                 color: sentByMe ? white : green,
//                 fontSize: 18,
//               ),
//             ),
//             SizedBox(width: 5),
//             Text(
//               '1:00 AM',
//               style: TextStyle(
//                 color: (sentByMe ? white : green).withOpacity(0.7),
//                 fontSize: 18,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'package:flutter_application_1/controller/chat_controller.dart';
// import 'package:flutter_application_1/model/message.dart';
// import 'package:get/get.dart';
// import 'package:socket_io_client/socket_io_client.dart' as IO;

// class ChatScreen extends StatefulWidget {
//   const ChatScreen({Key? key}) : super(key: key);

//   @override
//   _ChatScreenState createState() => _ChatScreenState();
// }

// class _ChatScreenState extends State<ChatScreen> {
//   // Color constants
//   final Color green = Colors.green;
//   final Color black = Colors.black;
//   final Color white = Colors.white;

//   // Controllers and socket
//   late TextEditingController msgInputController;
//   late IO.Socket socket;
//   final ChatController chatController = Get.put(ChatController());

//   @override
//   void initState() {
//     super.initState();
//     msgInputController = TextEditingController();
//     initializeSocket();
//   }

//   void initializeSocket() {
//     socket = IO.io(
//       'http://localhost:4000', // Use 10.0.2.2 for Android emulator; replace with backend IP for real device
//       IO.OptionBuilder()
//           .setTransports(['websocket'])
//           .disableAutoConnect()
//           .enableForceNew()
//           .build(),
//     );

//     socket.connect();

//     socket.onConnect((_) {
//       print('Connected with socket ID: ${socket.id}');
//     });

//     socket.on('message-receive', (data) {
//       print('Received message: $data');
//       if (data['sentByMe'] != socket.id) {
//         chatController.addMessage(Message.fromJson(data));
//       }
//     });

//     socket.onConnectError((error) => print('Connection error: $error'));
//     socket.onError((error) => print('Socket error: $error'));
//   }

//   @override
//   void dispose() {
//     socket.disconnect();
//     msgInputController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: black,
//       appBar: AppBar(
//         title: Text('Chat App', style: TextStyle(color: white)),
//         backgroundColor: green,
//       ),
//       body: Column(
//         children: [
//           // Message List
//           Expanded(
//             child: Obx(
//               () => ListView.builder(
//                 reverse: true,
//                 itemCount: chatController.chatMessages.length,
//                 itemBuilder: (context, index) {
//                   var currentItem = chatController.chatMessages[index];
//                   return MessageBubble(
//                     message: currentItem.message,
//                     sentByMe: currentItem.sentByMe == socket.id,
//                     timestamp: currentItem.timestamp,
//                   );
//                 },
//               ),
//             ),
//           ),

//           // Message Input Area
//           Container(
//             padding: const EdgeInsets.all(10),
//             color: green,
//             child: Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     controller: msgInputController,
//                     style: TextStyle(color: white),
//                     decoration: InputDecoration(
//                       hintText: 'Type a message...',
//                       hintStyle: TextStyle(color: white.withOpacity(0.7)),
//                       border: OutlineInputBorder(
//                         borderRadius: BorderRadius.circular(10),
//                         borderSide: BorderSide.none,
//                       ),
//                       filled: true,
//                       fillColor: black.withOpacity(0.3),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(width: 10),
//                 CircleAvatar(
//                   backgroundColor: white,
//                   child: IconButton(
//                     icon: Icon(Icons.send, color: green),
//                     onPressed: sendMessage,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   void sendMessage() {
//     if (msgInputController.text.trim().isNotEmpty) {
//       String messageText = msgInputController.text.trim();

//       // Prepare message data
//       var messageJson = {
//         "message": messageText,
//         "sentByMe": socket.id,
//         "timestamp": DateTime.now().toIso8601String(),
//       };

//       // Emit message to server
//       socket.emit('message', messageJson);

//       // Add message to local chat
//       chatController.addMessage(Message.fromJson(messageJson));

//       // Clear input
//       msgInputController.clear();
//     }
//   }
// }

// class MessageBubble extends StatelessWidget {
//   final String message;
//   final bool sentByMe;
//   final String timestamp;

//   const MessageBubble({
//     Key? key,
//     required this.message,
//     required this.sentByMe,
//     required this.timestamp,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Align(
//       alignment: sentByMe ? Alignment.centerRight : Alignment.centerLeft,
//       child: Container(
//         margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
//         padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
//         decoration: BoxDecoration(
//           color: sentByMe ? Colors.green : Colors.white,
//           borderRadius: BorderRadius.only(
//             topLeft: const Radius.circular(15),
//             topRight: const Radius.circular(15),
//             bottomLeft: sentByMe ? const Radius.circular(15) : Radius.zero,
//             bottomRight: sentByMe ? Radius.zero : const Radius.circular(15),
//           ),
//         ),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text(
//               message,
//               style: TextStyle(
//                 color: sentByMe ? Colors.white : Colors.black,
//                 fontSize: 16,
//               ),
//             ),
//             const SizedBox(height: 5),
//             Text(
//               _formatTimestamp(timestamp),
//               style: TextStyle(
//                 color: sentByMe ? Colors.white70 : Colors.black54,
//                 fontSize: 12,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   // Helper method to format timestamp
//   String _formatTimestamp(String timestampStr) {
//     try {
//       DateTime timestamp = DateTime.parse(timestampStr);

//       // Custom time formatting without intl package
//       String hour = timestamp.hour % 12 == 0 ? '12' : (timestamp.hour % 12).toString();
//       String minute = timestamp.minute.toString().padLeft(2, '0');
//       String period = timestamp.hour >= 12 ? 'PM' : 'AM';

//       return '$hour:$minute $period';
//     } catch (e) {
//       return '';
//     }
//   }
// }

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:vaanivikas/constants.dart';
import 'controller/chat_controller.dart';
import 'model/message.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late TextEditingController msgInputController;
  late IO.Socket socket;
  final ChatController chatController = Get.put(ChatController());

  @override
  void initState() {
    super.initState();
    msgInputController = TextEditingController();
    initializeSocket();
  }

  void initializeSocket() {
    socket = IO.io(
      'http://localhost:4000',
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .enableForceNew()
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      print('Connected with socket ID: ${socket.id}');
    });

    socket.on('user-count', (count) {
      chatController.setUserCount(count);
    });

    socket.on('message-receive', (data) {
      if (data['sentByMe'] != socket.id) {
        chatController.addMessage(Message.fromJson(data));
      }
    });

    socket.onConnectError((error) => print('Connection error: $error'));
    socket.onError((error) => print('Socket error: $error'));
  }

  @override
  void dispose() {
    socket.disconnect();
    msgInputController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Moving Gradient Background
          AnimatedBackground(),

          // Main Chat UI
          Column(
            children: [
              AppBar(
                title: const Text('Chat App', style: TextStyle(color: Colors.white)),
                backgroundColor: kPrimaryDarkColor,
                actions: [
                  Obx(() => Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          '${chatController.userCount} Users Online',
                          style: const TextStyle(color: Colors.white),
                        ),
                      )),
                ],
              ),

              // Message List
              Expanded(
                child: Obx(
                  () => ListView.builder(
                    reverse: true,
                    itemCount: chatController.chatMessages.length,
                    itemBuilder: (context, index) {
                      var currentItem = chatController.chatMessages[index];
                      return MessageBubble(
                        message: currentItem.message,
                        sentByMe: currentItem.sentByMe == socket.id,
                        timestamp: currentItem.timestamp,
                      );
                    },
                  ),
                ),
              ),

              // Message Input
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [kPrimaryColor, kPrimaryLightColor],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: kSecondaryColor.withOpacity(0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: msgInputController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Type a message...',
                          hintStyle: TextStyle(color: Colors.white.withOpacity(0.7)),
                          filled: true,
                          fillColor: Colors.black.withOpacity(0.3),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    CircleAvatar(
                      backgroundColor: Colors.white,
                      child: IconButton(
                        icon: const Icon(Icons.send, color: kPrimaryColor),
                        onPressed: sendMessage,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void sendMessage() {
    if (msgInputController.text.trim().isNotEmpty) {
      String messageText = msgInputController.text.trim();

      var messageJson = {
        "message": messageText,
        "sentByMe": socket.id,
        "timestamp": DateTime.now().toIso8601String(),
      };

      socket.emit('message', messageJson);
      chatController.addMessage(Message.fromJson(messageJson));
      msgInputController.clear();
    }
  }
}

class MessageBubble extends StatelessWidget {
  final String message;
  final bool sentByMe;
  final String timestamp;

  const MessageBubble({
    super.key,
    required this.message,
    required this.sentByMe,
    required this.timestamp,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: sentByMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
        decoration: BoxDecoration(
          gradient: sentByMe
              ? const LinearGradient(colors: [kPrimaryColor, kPrimaryLightColor])
              : const LinearGradient(colors: [Colors.white, Colors.grey]),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(15),
            topRight: const Radius.circular(15),
            bottomLeft: sentByMe ? const Radius.circular(15) : Radius.zero,
            bottomRight: sentByMe ? Radius.zero : const Radius.circular(15),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              message,
              style: TextStyle(
                color: sentByMe ? Colors.white : Colors.black,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              _formatTimestamp(timestamp),
              style: TextStyle(
                color: sentByMe ? Colors.white70 : Colors.black54,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTimestamp(String timestampStr) {
    try {
      DateTime timestamp = DateTime.parse(timestampStr);
      String hour = timestamp.hour % 12 == 0 ? '12' : (timestamp.hour % 12).toString();
      String minute = timestamp.minute.toString().padLeft(2, '0');
      String period = timestamp.hour >= 12 ? 'PM' : 'AM';
      return '$hour:$minute $period';
    } catch (e) {
      return '';
    }
  }
}

class AnimatedBackground extends StatefulWidget {
  @override
  _AnimatedBackgroundState createState() => _AnimatedBackgroundState();
}

class _AnimatedBackgroundState extends State<AnimatedBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 5),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              colors: [
                kPrimaryLightColor,
                kPrimaryDarkColor.withOpacity(0.8),
              ],
              stops: [_controller.value, _controller.value + 0.5],
            ),
          ),
        );
      },
    );
  }
}

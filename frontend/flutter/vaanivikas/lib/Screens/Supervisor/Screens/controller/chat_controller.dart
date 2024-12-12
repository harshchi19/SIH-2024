// import 'package:get/get.dart';

// class ChatController extends GetxController {
//   // Observable list of chat messages
//   RxList<Message> chatMessages = <Message>[].obs;

//   // Method to add a message to the chat
//   void addMessage(Message message) {
//     chatMessages.insert(0, message);
//   }

//   // Method to clear all messages
//   void clearMessages() {
//     chatMessages.clear();
//   }
// }
import 'package:get/get.dart';
import '../model/message.dart';

class ChatController extends GetxController {
  RxInt userCount = 0.obs; // Track the number of connected users
  RxList<Message> chatMessages = <Message>[].obs;

  void addMessage(Message message) {
    chatMessages.insert(0, message);
  }

  // Update the user count
  void setUserCount(int count) {
    userCount.value = count;
  }
}

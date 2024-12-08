// import { useEffect, useRef, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Send } from "lucide-react";
// import { useSocket } from "@/context/SocketContext.jsx"; // Importing useSocket
// import { GET_MESSAGES_ROUTE } from "@/utils/constants";
// import moment from "moment";
// const ChatHeader = ({ selectedContact }) => {
//   if (!selectedContact) return null;

//   return (
//     <div className="h-16 border-b flex items-center justify-between px-4">
//       <div className="flex items-center gap-3">
//         <Avatar className="h-10 w-10">
//           <AvatarFallback>
//             {selectedContact.name
//               .split(" ")
//               .map((n) => n[0])
//               .join("")}
//           </AvatarFallback>
//         </Avatar>
//         <div>
//           <h3 className="font-medium">{selectedContact.name}</h3>
//           <span className="text-sm text-green-500">Online</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChatMessage = ({ message, selectedContact, isOutgoing }) => (
//   <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-4`}>
//     <div
//       className={`flex items-end gap-2 max-w-[70%] ${
//         isOutgoing ? "" : "flex-row-reverse"
//       }`}
//     >
//       {!isOutgoing && (
//         <Avatar className="h-8 w-8">
//           <AvatarFallback>
//             {message.sender
//               .split(" ")
//               .map((n) => n[0])
//               .join("")}
//           </AvatarFallback>
//         </Avatar>
//       )}
//       <div
//         className={`rounded-lg p-3 ${
//           isOutgoing
//             ? "bg-[#68B984] text-white rounded-br-none"
//             : "bg-gray-100 rounded-bl-none"
//         }`}
//       >
//         <p className="text-sm">{message.content}</p>
//         <span
//           className={`text-xs ${
//             isOutgoing ? "text-white/70" : "text-gray-500"
//           }`}
//         >
//           {new Date(message.timestamp).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// const ChatArea = ({ selectedContact }) => {
//   const userId = localStorage.getItem("user");
//   // const socket = useSocket(userId); // Use the useSocket hook
//   const { socket, connected } = useSocket();
//   const [messages, setMessages] = useState([]); // Initialize the messages state
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Scroll to the bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   // console.log("SELECTED CONTACT:", selectedContact);
//   useEffect(() => {
//     if (selectedContact) {
//       const fetchMessages = async () => {
//         try {
//           const user2Id =
//             selectedContact?.supervisor_id ||
//             selectedContact?.student_therapist_id ||
//             selectedContact?.patient_id;
//           const url = `${GET_MESSAGES_ROUTE}/${userId}/${user2Id}`;
//           console.log("URL:", url);

//           const response = await fetch(
//             `${GET_MESSAGES_ROUTE}/${userId}/${user2Id}`,
//             {
//               method: "GET",
//               headers: { "Content-Type": "application/json" },
//             }
//           );

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           const result = await response.json();
//           // console.log(result.messages);
//           // Normalize messages to match the existing message structure
//           const normalizedMessages = result.messages.map((msg) => ({
//             content: msg.content,
//             sender: msg.sender_id,
//             timestamp: msg.timestamp,
//             isOutgoing: msg.sender_id === userId,
//           }));
//           console.log("Normal", normalizedMessages);
//           setMessages(normalizedMessages);
//         } catch (error) {
//           console.error("Error Fetching Messages", error);
//         }
//       };
//       fetchMessages();
//     }
//   }, [selectedContact, userId]);
//   useEffect(() => {
//     // Listen for incoming messages from the socket server
//     if (socket) {
//       socket.on("receiveMessage", (message) => {
//         console.log(message);
//         setMessages((prevMessages) => [...prevMessages, message]);
//       });

//       return () => {
//         socket.off("receiveMessage"); // Clean up the listener
//       };
//     }
//   }, [socket]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const messageData = {
//       content: newMessage.trim(),
//       sender: userId,
//       recipient:
//         selectedContact?.supervisor_id ||
//         selectedContact?.patientr_id ||
//         selectedContact?.student_therapist_id,
//       messageType: "text",
//       timestamp: new Date().toISOString(),
//     };

//     socket.emit("sendMessage", messageData);
//     console.log("Message:", messageData);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { ...messageData, isOutgoing: true },
//     ]);

//     setNewMessage("");
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       <ChatHeader selectedContact={selectedContact} />
//       <ScrollArea className="flex-1 p-4">
//         {messages.map((message, index) => (
//           <ChatMessage
//             key={index}
//             message={message}
//             selectedContact={selectedContact}
//             isOutgoing={message.isOutgoing}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </ScrollArea>

//       <div className="p-4 border-t">
//         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1"
//           />
//           <Button
//             type="submit"
//             size="icon"
//             className="bg-[#68B984] hover:bg-[#5aa873]"
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useSocket } from "@/context/SocketContext.jsx";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";

const ChatHeader = ({ selectedContact }) => {
  if (!selectedContact) return null;

  return (
    <div className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {selectedContact.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedContact.name}</h3>
          <span className="text-sm text-green-500">Online</span>
        </div>
      </div>
    </div>
  );
};

const DateSeparator = ({ date }) => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="px-3 text-sm text-gray-500">
      {moment(date).calendar(null, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "MMMM D, YYYY",
        sameElse: "MMMM D, YYYY",
      })}
    </span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>
);

const ChatMessage = ({ message, selectedContact, isOutgoing }) => (
  <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`flex items-end gap-2 max-w-[70%] ${
        isOutgoing ? "" : "flex-row-reverse"
      }`}
    >
      {!isOutgoing && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {message.sender
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 ${
          isOutgoing
            ? "bg-[#68B984] text-white rounded-br-none"
            : "bg-gray-100 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs ${
            isOutgoing ? "text-white/70" : "text-gray-500"
          }`}
        >
          {moment(message.timestamp).format("h:mm A")}
        </span>
      </div>
    </div>
  </div>
);

const ChatArea = ({ selectedContact }) => {
  const userId = localStorage.getItem("user");
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {});

  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = async () => {
        try {
          const user2Id =
            selectedContact?.supervisor_id ||
            selectedContact?.student_therapist_id ||
            selectedContact?.patient_id;
          const url = `${GET_MESSAGES_ROUTE}/${userId}/${user2Id}`;

          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();

          // Normalize messages to match the existing message structure
          const normalizedMessages = result.messages
            .map((msg) => ({
              content: msg.content,
              sender: msg.sender_id,
              timestamp: msg.timestamp,
              isOutgoing: msg.sender_id === userId,
            }))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          setMessages(normalizedMessages);
        } catch (error) {
          console.error("Error Fetching Messages", error);
        }
      };
      fetchMessages();
    }
  }, [selectedContact, userId]);

  useEffect(() => {
    // Listen for incoming messages from the socket server
    if (socket) {
      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => {
          // Check if the message is already in the list to prevent duplicates
          const isDuplicate = prevMessages.some(
            (msg) =>
              msg.content === message.content &&
              msg.timestamp === message.timestamp
          );

          return isDuplicate
            ? prevMessages
            : [...prevMessages, message].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
              );
        });
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage.trim(),
      sender: userId,
      recipient:
        selectedContact?.supervisor_id ||
        selectedContact?.patientr_id ||
        selectedContact?.student_therapist_id,
      messageType: "text",
      timestamp: new Date().toISOString(),
      isOutgoing: true,
    };

    socket.emit("sendMessage", messageData);

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, messageData].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      return updatedMessages;
    });

    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader selectedContact={selectedContact} />
      <ScrollArea className="flex-1 p-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <DateSeparator date={date} />
            {dateMessages.map((message, index) => (
              <ChatMessage
                key={`${date}-${index}`}
                message={message}
                selectedContact={selectedContact}
                isOutgoing={message.isOutgoing}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#68B984] hover:bg-[#5aa873]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;

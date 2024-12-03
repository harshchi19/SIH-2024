// import { useEffect, useRef, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Send } from "lucide-react";
// import useSocket from "@/context/SocketContext"; // Importing useSocket

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

// const ChatMessage = ({ message, isOutgoing }) => (
//   <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-4`}>
//     <div
//       className={`flex items-end gap-2 max-w-[70%] ${
//         isOutgoing ? "flex-row-reverse" : ""
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
//   const userId = localStorage.getItem("user"); // Get the userId from localStorage
//   const { socket, messages } = useSocket(userId); // Use the useSocket hook
//   // const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const messagesEndRef = useRef(null);

//   // Scroll to the bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // useEffect(() => {
//   //   // Listen for incoming messages from the socket server
//   //   socket.on("receiveMessage", (message) => {
//   //     setMessages((prevMessages) => [...prevMessages, message]);
//   //   });

//   //   return () => {
//   //     socket.off("receiveMessage"); // Clean up the listener
//   //   };
//   // }, [socket]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       content: newMessage,
//       sender: userId,
//       recipient: selectedContact.id,
//       messageType: "text",
//       // timestamp: new Date(), // Include the timestamp for display
//     };

//     // Emit the message to the backend
//     socket.emit("sendMessage", message);

//     // Optimistically update the message list in the UI
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { ...message, isOutgoing: true },
//     ]);

//     // Clear the input field
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
//             isOutgoing={message.sender === userId}
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
import { useSocket } from "@/context/SocketContext.jsx"; // Importing useSocket

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

const ChatMessage = ({ message, isOutgoing }) => (
  <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`flex items-end gap-2 max-w-[70%] ${
        isOutgoing ? "flex-row-reverse" : ""
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
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  </div>
);

const ChatArea = ({ selectedContact }) => {
  const userId = localStorage.getItem("user");
  // const socket = useSocket(userId); // Use the useSocket hook
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]); // Initialize the messages state
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for incoming messages from the socket server
    if (socket) {
      socket.on("receiveMessage", (message) => {
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receiveMessage"); // Clean up the listener
      };
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      content: newMessage,
      sender: userId,
      recipient: selectedContact.id,
      messageType: "text",
      timestamp: new Date(), // Add timestamp for message display
    };

    // Emit the message to the backend
    socket.emit("sendMessage", message);

    // Optimistically update the message list in the UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, isOutgoing: true },
    ]);

    // Clear the input field
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader selectedContact={selectedContact} />
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isOutgoing={message.sender === userId}
          />
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

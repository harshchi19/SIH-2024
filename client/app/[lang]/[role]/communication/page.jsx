// "use client";

// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import useSocket from "@/context/SocketContext";
// import {
//   Search,
//   MessagesSquare,
//   PlusCircle,
//   Phone,
//   VideoIcon,
//   MoreVertical,
//   Send,
//   Paperclip,
// } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Command,
//   CommandInput,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
// } from "@/components/ui/command";

// const NewMessageDialog = () => {
//   const [open, setOpen] = React.useState(false);
//   const [search, setSearch] = React.useState("");

//   // Mock therapist data - replace with your actual data
//   const therapists = [
//     { id: 1, name: "Ananya Sharma", specialization: "Physical Therapy" },
//     { id: 2, name: "Saniya Shetty", specialization: "Occupational Therapy" },
//     { id: 3, name: "John Doe", specialization: "Speech Therapy" },
//   ];

//   const handleSelectTherapist = (therapist) => {
//     // Handle starting a new conversation with the selected therapist
//     console.log("Starting conversation with:", therapist);
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full mb-4 gap-2">
//           <PlusCircle className="w-4 h-4" />
//           New Message
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>New Message</DialogTitle>
//         </DialogHeader>
//         <Command className="rounded-lg border shadow-md">
//           <CommandInput
//             placeholder="Search therapists..."
//             value={search}
//             onValueChange={setSearch}
//           />
//           <CommandEmpty>No therapists found.</CommandEmpty>
//           <CommandGroup className="max-h-[300px] overflow-auto">
//             {therapists.map((therapist) => (
//               <CommandItem
//                 key={therapist.id}
//                 onSelect={() => handleSelectTherapist(therapist)}
//                 className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
//               >
//                 <Avatar className="h-10 w-10">
//                   <AvatarFallback>
//                     {therapist.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{therapist.name}</span>
//                   <span className="text-sm text-gray-500">
//                     {therapist.specialization}
//                   </span>
//                 </div>
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </DialogContent>
//     </Dialog>
//   );
// };

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
//       <div className="flex items-center gap-4">
//         {/* <Button variant="ghost" size="icon">
//           <Phone className="w-5 h-5" />
//         </Button> */}
//         {/* <Button variant="ghost" size="icon">
//           <VideoIcon className="w-5 h-5" />
//         </Button> */}
//         <Button variant="ghost" size="icon">
//           <MoreVertical className="w-5 h-5" />
//         </Button>
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
//             {message.senderName
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
//   const [messages, setMessages] = React.useState([
//     {
//       id: 1,
//       content: "Hi, how can I help you today?",
//       timestamp: new Date(Date.now() - 3600000),
//       senderName: selectedContact?.name || "",
//       isOutgoing: false,
//     },
//     {
//       id: 2,
//       content: "I'd like to discuss my treatment plan",
//       timestamp: new Date(Date.now() - 1800000),
//       senderName: "You",
//       isOutgoing: true,
//     },
//   ]);
//   const [newMessage, setNewMessage] = React.useState("");
//   const messagesEndRef = React.useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   React.useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now(),
//       content: newMessage,
//       timestamp: new Date(),
//       senderName: "You",
//       isOutgoing: true,
//     };

//     setMessages([...messages, message]);
//     setNewMessage("");
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       <ChatHeader selectedContact={selectedContact} />
//       <ScrollArea className="flex-1 p-4">
//         {messages.map((message) => (
//           <ChatMessage
//             key={message.id}
//             message={message}
//             isOutgoing={message.isOutgoing}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </ScrollArea>
//       <div className="p-4 border-t">
//         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//           <Button type="button" variant="ghost" size="icon">
//             <Paperclip className="w-5 h-5 text-gray-500" />
//           </Button>
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

// const ConversationList = ({ onSelectContact, selectedId }) => {
//   const conversations = [
//     {
//       id: 1,
//       name: "Ananya Sharma",
//       lastMessage: "See you tomorrow at 2 PM",
//       time: "2m ago",
//       unread: true,
//     },
//     {
//       id: 2,
//       name: "Saniya Shetty",
//       lastMessage: "How are you feeling today?",
//       time: "1h ago",
//       unread: false,
//     },
//   ];

//   return (
//     <ScrollArea className="flex-1">
//       {conversations.map((conversation) => (
//         <div
//           key={conversation.id}
//           onClick={() => onSelectContact(conversation)}
//           className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg
//             ${selectedId === conversation.id ? "bg-gray-100" : ""}`}
//         >
//           <Avatar className="h-12 w-12">
//             <AvatarFallback>
//               {conversation.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center justify-between">
//               <span className="font-medium">{conversation.name}</span>
//               <span className="text-xs text-gray-500">{conversation.time}</span>
//             </div>
//             <p className="text-sm text-gray-500 truncate">
//               {conversation.lastMessage}
//             </p>
//           </div>
//           {conversation.unread && (
//             <div className="w-2 h-2 bg-[#68B984] rounded-full"></div>
//           )}
//         </div>
//       ))}
//     </ScrollArea>
//   );
// };

// const MessagingInterface = () => {
//   const [selectedContact, setSelectedContact] = React.useState(null);
//   const socket = useSocket();

//   return (
//     <div className="flex h-[calc(100vh-64px)]">
//       <div className="h-full flex flex-col p-4 border-r w-80">
//         <NewMessageDialog />
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//           <Input placeholder="Search conversations..." className="pl-10" />
//         </div>
//         <ConversationList
//           onSelectContact={setSelectedContact}
//           selectedId={selectedContact?.id}
//         />
//       </div>

//       {selectedContact ? (
//         <ChatArea selectedContact={selectedContact} />
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <MessagesSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900">
//               No conversation selected
//             </h3>
//             <p className="text-gray-500 mt-1">
//               Choose a conversation or start a new one
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagingInterface;

"use client";
import React from "react";
import MessagingInterface from "@/components/communication/MessagingInterface.jsx";

export default function Page() {
  return (
    <div className="container mx-auto overflow-y-scroll">
      <MessagingInterface />
    </div>
  );
}

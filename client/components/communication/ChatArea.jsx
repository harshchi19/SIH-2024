import { React, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Send, MoreVertical } from "lucide-react";

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
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
            {message.senderName
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
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi, how can I help you today?",
      timestamp: new Date(Date.now() - 3600000),
      senderName: selectedContact?.name || "",
      isOutgoing: false,
    },
    {
      id: 2,
      content: "I'd like to discuss my treatment plan",
      timestamp: new Date(Date.now() - 1800000),
      senderName: "You",
      isOutgoing: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date(),
      senderName: "You",
      isOutgoing: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader selectedContact={selectedContact} />
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOutgoing={message.isOutgoing}
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

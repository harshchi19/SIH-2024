import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, MessagesSquare } from "lucide-react";
import NewMessageDialog from "./NewMessageDialog";
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";
import useSocket from "@/context/SocketContext";

const MessagingInterface = () => {
  const userId = localStorage.getItem("user");
  const socket = useSocket(userId);
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Ananya Sharma",
      lastMessage: "See you tomorrow at 2 PM",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      name: "Saniya Shetty",
      lastMessage: "How are you feeling today?",
      time: "1h ago",
      unread: false,
    },
  ]);

  const handleAddContact = (newContact) => {
    // Check if contact already exists
    const existingContact = conversations.find(
      (conv) => conv.name === newContact.name
    );

    if (!existingContact) {
      setConversations([...conversations, newContact]);
      setSelectedContact(newContact);
    } else {
      setSelectedContact(existingContact);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-y-hidden">
      <div className="h-full flex flex-col p-4 border-r w-80">
        <NewMessageDialog onAddContact={handleAddContact} />
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>
        <ConversationList
          conversations={conversations}
          onSelectContact={setSelectedContact}
          selectedId={selectedContact?.id}
        />
      </div>

      {selectedContact ? (
        <ChatArea selectedContact={selectedContact} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessagesSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No conversation selected
            </h3>
            <p className="text-gray-500 mt-1">
              Choose a conversation or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingInterface;

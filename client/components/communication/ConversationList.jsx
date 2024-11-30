import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ConversationList = ({ conversations, onSelectContact, selectedId }) => {
  // Group conversations by type
  const groupedConversations = {
    "Student Therapist": conversations.filter(
      (conv) => conv.type === "Student Therapist"
    ),
    Supervisor: conversations.filter((conv) => conv.type === "Supervisor"),
    Patient: conversations.filter((conv) => conv.type === "Patient"),
  };

  // Render section with conversations
  const renderSection = (title, conversations) => {
    if (conversations.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectContact(conversation)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg 
              ${selectedId === conversation.id ? "bg-gray-100" : ""}`}
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {conversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">{conversation.name}</span>
                <span className="text-xs text-gray-500">
                  {conversation.time}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <div className="w-2 h-2 bg-[#68B984] rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1">
      {renderSection(
        "Student Therapists",
        groupedConversations["Student Therapist"]
      )}
      {renderSection("Supervisors", groupedConversations["Supervisor"])}
      {renderSection("Patients", groupedConversations["Patient"])}

      {/* Show message if no conversations */}
      {conversations.length === 0 && (
        <div className="text-center text-gray-500 p-4">
          No conversations yet
        </div>
      )}
    </ScrollArea>
  );
};

export default ConversationList;

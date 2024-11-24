import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Minimize2, Maximize2, Send } from "lucide-react";
import { logo } from "@/assets";
import Image from "next/image";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm your Speech Therapy Assistant. How can I help you today? I can help with:\n\n• Patient allocation\n• Therapy planning\n• Progress reports\n• Supervisor feedback\n• Clinical ratings",
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { type: "user", content: message }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content:
              "I understand you need help. Let me connect you with the relevant section of our system.",
          },
        ]);
      }, 1000);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      ) : (
        <Card
          className={`w-96 ${
            isMinimized ? "h-14 rounded-b-lg overflow-hidden" : "h-[500px]"
          } shadow-xl transition-all duration-300 ease-in-out`}
        >
          <div className="h-14 p-3 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
            <span className="font-semibold flex-row-center gap-x-2">
              <Image src={logo} alt="Vaani.ai" className="h-8 w-auto" />{" "}
              <h1 className="text-xl font-semibold">Vaani.ai</h1>
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-green-700"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-green-700"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4 h-3/4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          msg.type === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="px-3 py-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 h-11"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-green-600 hover:bg-green-700 h-11"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;

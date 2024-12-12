import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RightSidebar = ({ isOpen, onToggle }) => {
  const notifications = [
    {
      type: "room",
      message: "Room No. 33 is now available",
      time: "7 minutes ago",
    },
    {
      type: "patient",
      message: "New Patient Registration",
      time: "23 minutes ago",
    },
    {
      type: "room",
      message: "Room No. 23 is now available",
      time: "59 minutes ago",
    },
    {
      type: "event",
      message: "Speech Therapy Webinar has been scheduled",
      time: "Today, 10:00AM",
    },
  ];

  const appointments = [
    { name: "Aarav Patel", room: "32", time: "23 minutes ago" },
    { name: "Vivaan Singh", room: "25", time: "47 minutes ago" },
    { name: "Aastha Shukla", room: "33", time: "1 hour ago" },
    { name: "Alia Kapoor", room: "32", time: "3 hours ago" },
    { name: "Shanaya Sharma", room: "25", time: "5 hours ago" },
  ];

  const therapists = [
    "Ananya Sharma",
    "Rohan Deshmukh",
    "Ishita Patel",
    "Karan Mehta",
    "Sanya Gupta",
    "Kiran Mehra",
  ];

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-background border-l transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0 w-72" : "translate-x-full w-0"
      }`}
    >
      <div className="relative w-full h-full p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-10 bottom-4 bg-background border"
          onClick={onToggle}
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div>
            <h3 className="font-semibold mb-4">Notifications</h3>
            <ScrollArea className="h-40">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 mb-4">
                  <div className="mt-1">
                    {notification.type === "room" && (
                      <Badge variant="secondary" className="bg-blue-100">
                        🚪
                      </Badge>
                    )}
                    {notification.type === "patient" && (
                      <Badge variant="secondary" className="bg-green-100">
                        👤
                      </Badge>
                    )}
                    {notification.type === "event" && (
                      <Badge variant="secondary" className="bg-purple-100">
                        📅
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Recent Appointments */}
          <div>
            <h3 className="font-semibold mb-4">Recent Appointments</h3>
            <ScrollArea className="h-48">
              {appointments.map((appointment, index) => (
                <div key={index} className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={`/api/placeholder/${32 + index}/32`} /> */}
                    <AvatarFallback>
                      {appointment.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{appointment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Room No. {appointment.room}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Assigned Student Therapists */}
          <div>
            <h3 className="font-semibold mb-4">Assigned Student Therapists</h3>
            <ScrollArea className="h-48">
              {therapists.map((therapist, index) => (
                <div key={index} className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={`/api/placeholder/${32 + index}/32`} /> */}
                    <AvatarFallback>
                      {therapist
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{therapist}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

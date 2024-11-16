// import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  LayoutDashboard,
  Users,
  Calendar,
  Inbox,
  FileText,
  MessageSquare,
} from "lucide-react";
import HoverSpecializationPopup from "./HoverSpecializationPopup";

const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-[#5DB075] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/api/placeholder/32/32" alt="User" />
          <AvatarFallback>YB</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold hover:cursor-pointer hover:">
          <HoverSpecializationPopup
            name="Yash Buddhadev"
            specialization="Supervisor"
          />
        </span>
      </div>

      <nav className="space-y-2">
        {[
          {
            icon: <LayoutDashboard className="h-4 w-4" />,
            label: "Dashboard",
            active: true,
          },
          { icon: <Users className="h-4 w-4" />, label: "Student Therapist" },
          { icon: <Calendar className="h-4 w-4" />, label: "Calendar" },
          { icon: <Inbox className="h-4 w-4" />, label: "Inbox" },
          { icon: <FileText className="h-4 w-4" />, label: "Reports" },
          { icon: <Users className="h-4 w-4" />, label: "Patients" },
          {
            icon: <MessageSquare className="h-4 w-4" />,
            label: "Communication",
          },
        ].map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              item.active
                ? "bg-[#54C174] text-white hover:bg-[#54C174]"
                : "text-white hover:bg-[#FEFEFE]"
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>

      <Card className="mt-6 bg-[#54C174] border-none text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">8:45</div>
            <div className="text-sm">→</div>
            <div className="text-2xl font-bold">10:45</div>
          </div>
          <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to meet link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

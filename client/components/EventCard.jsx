import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { Calendar, Clock10, MapPin, User } from "lucide-react";

const EventCard = ({ meeting }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`w-[95%] p-2 mb-1 rounded-md shadow-sm mx-1 cursor-pointer hover:opacity-90 ${
            meeting.type === "success"
              ? "bg-green-100"
              : meeting.type === "info"
              ? "bg-blue-100"
              : meeting.type === "warning"
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          <div className="text-xs font-medium truncate">{meeting.title}</div>
          <div className="text-xs text-gray-500 truncate">
            {meeting.therapist}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 bg-white shadow-lg rounded-md p-4 z-50" // Add z-50 for high z-index
        style={{ position: "relative" }} // Ensure proper positioning
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <h4 className="font-semibold">{meeting.title}</h4>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Clock10 className="w-4 h-4 text-gray-500" />
            <span>
              {meeting.time} - {meeting.endTime}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span>{meeting.therapist}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{meeting.location}</span>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-600">{meeting.description}</p>
          </div>

          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Note: </span>
              {meeting.patientNotes}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EventCard;

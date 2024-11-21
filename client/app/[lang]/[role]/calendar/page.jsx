"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import EventCard from "@/components/EventCard.jsx";
import RightSidebar from "@/components/RightSidebar";
import { days, meetings } from "@/constants/meetings";

export default function StudentCalendar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate] = useState("July 17");
  const [currentTime] = useState("7:10 PM IST");

  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00 AM`;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="w-screen p-4 bg-white rounded-lg shadow">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border rounded-md">
              <option>Today</option>
              <option selected>{currentDate}</option>
            </select>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
            <select className="px-3 py-2 border rounded-md">
              <option>This week</option>
            </select>
            <button className="flex items-center px-3 py-2 space-x-2 text-white bg-green-500 rounded-md">
              <Plus className="w-4 h-4" />
              <span>Add event</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg">
          {/* Time column */}
          <div className="space-y-6 border-r border-gray-200 pr-2 bg-gray-50">
            <div className="h-8 pt-2" /> {/* Empty header space */}
            {timeSlots.map((time) => (
              <div key={time} className="text-sm text-gray-500 px-2">
                {time}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {days.map((day, index) => (
            <div
              key={day}
              className="flex-1 border-r border-gray-200 last:border-r-0"
            >
              <div className="h-8 font-medium px-2 py-1 border-b border-gray-200 bg-gray-50">
                {day}
              </div>
              <div className="relative h-full">
                {/* Hour grid lines */}
                {timeSlots.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute w-full border-b border-gray-100"
                    style={{ top: `${idx * 48}px`, height: "48px" }}
                  />
                ))}

                {/* Meetings */}
                {meetings
                  .filter((meeting) => meeting.day === day.split(" ")[0])
                  .map((meeting, idx) => (
                    <div
                      key={idx}
                      className="absolute w-full"
                      style={{
                        top: `${(parseInt(meeting.time) - 9) * 48}px`,
                        height: "40px",
                      }}
                    >
                      <EventCard meeting={meeting} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right Sidebar */}
      <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}

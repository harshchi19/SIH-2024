"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import EventModal from "@/components/calendar/EventModal";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
  GET_USER_CALENDAR_EVENTS_ROUTE,
  GET_USER_OBJ_ID,
  UPDATE_EVENT_BY_ID,
} from "@/utils/constants";

export default function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [editEvent, setEditEvent] = useState([]);
  const { dict, currentLang } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState({
    _id: "",
    title: "",
    supervisor: "",
    patient: "",
    roomNo: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    color: "#0000FF",
    activeTab: "appointments",
  });

  useEffect(() => {
    const userId = localStorage.getItem("user");

    if (!userId) router.push(`/${currentLang}/sign-in`);

    const getUserEvents = async () => {
      const response = await fetch(
        `${GET_USER_CALENDAR_EVENTS_ROUTE}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.userEvents);
      }
    };

    const getUserObjId = async () => {
      const response = await fetch(`${GET_USER_OBJ_ID}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.userId);
      }
    };

    getUserEvents();
    getUserObjId();
  }, []);

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    const increment = direction === "next" ? 1 : -1;

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + increment);
        break;
      case "week":
        const adjustedDate = startOfWeek(newDate, { weekStartsOn: 1 });
        newDate.setDate(adjustedDate.getDate() + increment * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + increment);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  };

  const modes = ["day", "week", "month"];

  const handleEditEvent = async () => {
    const response = await fetch(UPDATE_EVENT_BY_ID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  const renderView = () => {
    switch (viewMode) {
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            setSelectedSlot={setSelectedSlot}
            userId={currentUser}
            setEditEvent={setEditEvent}
            setData={setData}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            setSelectedSlot={setSelectedSlot}
            userId={currentUser}
            setEditEvent={setEditEvent}
            setData={setData}
          />
        );
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            setCurrentDate={setCurrentDate}
            setViewMode={setViewMode}
            userId={currentUser}
            setSelectedSlot={setSelectedSlot}
            setEditEvent={setEditEvent}
            setData={setData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 px-8 pb-6 overflow-y-auto">
      <Card className="shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <TooltipProvider>
              <div className="flex items-center space-x-5">
                <div className="flex gap-x-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => changeDate("prev")}
                        className="bg-gray-100"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{dict?.calendar?.prev}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => changeDate("next")}
                        className="bg-gray-100"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{dict?.calendar?.next}</TooltipContent>
                  </Tooltip>
                </div>

                <h2 className="text-2xl font-bold">
                  {viewMode === "day"
                    ? format(currentDate, "MMMM d, yyyy")
                    : viewMode === "week"
                    ? format(currentDate, "MMMM, yyyy")
                    : format(currentDate, "MMMM, yyyy")}
                </h2>
              </div>
            </TooltipProvider>

            <div className="flex items-center space-x-4">
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value)}
                className="border rounded-lg p-1"
              >
                {modes.map((mode) => (
                  <ToggleGroupItem
                    key={mode}
                    value={mode}
                    className={`capitalize px-4 py-2 rounded-md transition-colors 
                      ${
                        viewMode === mode
                          ? "data-[state=on]:bg-green-500 data-[state=on]:text-white data-[state=on]:font-bold"
                          : "text-green-500 font-semibold hover:bg-green-100"
                      }`}
                  >
                    {mode}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <Button
                onClick={() => setSelectedSlot({ date: currentDate })}
                className="flex items-center bg-white text-green-500 border-2 border-green-500 hover:border-green-500 hover:bg-green-500 hover:text-white rounded-md px-4 py-5"
              >
                <Plus className="h-7 w-auto" />
                <span className="text-[1rem] leading-3 font-bold">
                  {dict?.calendar?.add}
                </span>
              </Button>
            </div>
          </div>

          {renderView()}
        </CardContent>
      </Card>

      <EventModal
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        events={events}
        setEvents={setEvents}
        editEvent={editEvent}
        handleEditEvent={handleEditEvent}
        data={data}
        setData={setData}
      />
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SmallCalendar = ({ calendarDates }) => {
  const dateColorMap = calendarDates.reduce((acc, item) => {
    const date = item.selected_date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item.color);
    return acc;
  }, {});

  const [currentDate, setCurrentDate] = useState(new Date());

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      days.push({
        day,
        colors: dateColorMap[fullDate] || [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-80 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          className="p-2 bg-transparent hover:bg-gray-100 rounded border shadow-none"
        >
          <ChevronLeft className="text-gray-500" />
        </Button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
          className="p-2 bg-transparent hover:bg-gray-100 rounded border shadow-none"
        >
          <ChevronRight className="text-gray-500" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="font-medium text-sm tracking-tight text-gray-600"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((dayObj, index) => (
          <div
            key={index}
            className={`aspect-square ${
              dayObj ? "hover:bg-gray-50" : ""
            } relative`}
          >
            {dayObj && (
              <>
                <span className="absolute top-1 left-1 text-sm">
                  {dayObj.day}
                </span>
                <div className="absolute bottom-0 left-0 right-0 flex justify-start">
                  {dayObj.colors.map((color, colorIdx) => (
                    <div
                      key={colorIdx}
                      className="w-2 h-2 rounded-full m-0.5"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallCalendar;

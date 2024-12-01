import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import EventInfoPopup from "./EventInfoPopup";
import { useState } from "react";

const WeekView = ({
  currentDate,
  events,
  setSelectedSlot,
  userId,
  setEditEvent,
}) => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const { dict } = useLanguage();

  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startHour = 8 + i;
    const endHour = startHour + 1;
    return `${startHour.toString().padStart(2, "0")}:00 - ${endHour
      .toString()
      .padStart(2, "0")}:00`;
  });

  return (
    <div className="grid grid-cols-[80px_1fr] border rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="border-r">
        <div className="h-20 border-b flex-row-center">
          <Calendar className="h-6 w-auto" />
        </div>
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className={`h-16 border-b text-xs text-gray-500 flex items-center justify-center ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            {time}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="border-r last:border-r-0 border-t-0"
          >
            <div
              className={`h-20 border-b text-center flex flex-col justify-center items-center font-bold text-lg p-2`}
            >
              <h4 className="text-sm">
                {dict?.calendar?.[format(day, "EEEE")]}
              </h4>
              <h1 className="text-3xl">{format(day, "d")}</h1>
            </div>

            {timeSlots.map((time, index) => {
              const startHour = time.split(":")[0];

              const dayEvents = events.filter((event) => {
                const eventDate = new Date(event.selected_date);
                return eventDate.toDateString() === day.toDateString();
              });

              const eventsForSlot = dayEvents.filter((event) => {
                const eventStartHour = new Date(event.start_time).getHours();
                return eventStartHour === parseInt(startHour, 10);
              });

              return (
                <div
                  key={time}
                  className={`h-16 border-b relative cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() =>
                    setSelectedSlot({
                      date: addDays(day, 1),
                      time,
                    })
                  }
                >
                  {eventsForSlot.map((event, idx) => (
                    <div
                      key={event._id}
                      className="absolute flex items-center justify-between w-[95%] left-[2.5%] text-white p-2 rounded-md text-sm shadow-md"
                      onMouseEnter={() => setHoveredEventId(event._id)}
                      onMouseLeave={() => setHoveredEventId(null)}
                      style={{
                        top: `${idx * 24}px`,
                        height: "24px",
                        backgroundColor: event.color,
                      }}
                    >
                      <div className="truncate">
                        <strong>{event.title}</strong>

                        {userId === event.userId && (
                          <button
                            className="absolute top-1 right-1 text-white text-xs rounded px-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditEvent(event);
                            }}
                          >
                            <h5 className="text-xs text-gray-300 font-semibold">
                              {dict?.calendar?.edit}
                            </h5>
                          </button>
                        )}

                        {hoveredEventId === event._id && (
                          <EventInfoPopup event={event} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;

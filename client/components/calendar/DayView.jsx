import { useState } from "react";
import EventInfoPopup from "./EventInfoPopup";
import { useLanguage } from "@/context/LanguageContext";

const DayView = ({ currentDate, events, setSelectedSlot, userId }) => {
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const { dict } = useLanguage();

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startHour = 8 + i;
    const endHour = startHour + 1;
    return `${startHour.toString().padStart(2, "0")}:00 - ${endHour
      .toString()
      .padStart(2, "0")}:00`;
  });

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.selected_date);
    return eventDate.toDateString() === currentDate.toDateString();
  });

  return (
    <div className="grid grid-cols-[80px_1fr] border rounded-lg">
      <div className="border-r">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="h-20 border-b text-xs text-gray-500 flex items-center justify-center"
          >
            {time}
          </div>
        ))}
      </div>

      <div className="relative px-1">
        {timeSlots.map((time, index) => {
          const startHour = time.split(":")[0];
          const eventsForSlot = dayEvents.filter((event) => {
            const eventStartHour = new Date(event.start_time).getHours();
            return eventStartHour === parseInt(startHour, 10);
          });

          return (
            <div
              key={time}
              className="h-20 border-b relative"
              onClick={() =>
                setSelectedSlot({
                  date: currentDate,
                  time,
                })
              }
            >
              {eventsForSlot.map((event, idx) => (
                <div
                  key={event._id}
                  className={`absolute w-full p-2 px-3 pr-12 flex justify-between items-center rounded-md text-xs`}
                  onMouseEnter={() => setHoveredEventId(event._id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  style={{
                    backgroundColor: event.color,
                    top: `${idx * 20}px`,
                    height: "20px",
                  }}
                >
                  <h1 className="text-white font-semibold text-sm">
                    {event.title}
                  </h1>{" "}
                  <h1 className="text-xs text-gray-100 font-medium">
                    {new Date(event.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    -{" "}
                    {new Date(event.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h1>
                  {userId === event.userId && (
                    <button
                      className="absolute top-0.5 right-1 text-white text-xs rounded px-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Hello");
                      }}
                    >
                      <h5 className="text-xs text-gray-300 font-semibold">
                        {dict?.calendar?.edit}
                      </h5>
                    </button>
                  )}
                  {hoveredEventId === event._id && (
                    <div
                      className="absolute z-10 bg-transparent"
                      style={{
                        width: "200px",
                        maxWidth: "100%",
                        top: `${idx * 20 + 20}px`,
                      }}
                    >
                      <EventInfoPopup event={event} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;

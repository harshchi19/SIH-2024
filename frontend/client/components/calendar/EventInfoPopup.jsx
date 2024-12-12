import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Clock, Calendar, FileText } from "lucide-react";

const EventInfoPopup = ({ event }) => {
  const [position, setPosition] = useState("below");
  const popoverRef = useRef();

  useEffect(() => {
    if (popoverRef.current) {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (popoverRect.bottom > viewportHeight) {
        setPosition("above");
      } else {
        setPosition("below");
      }
    }
  }, [event]);

  if (!event) return null;

  return (
    <div
      ref={popoverRef}
      className={`
        absolute z-50 bg-white shadow-lg rounded-xl border border-gray-200 p-4 
        transition-all duration-300 ease-in-out
        ${position === "below" ? "mt-2" : "mb-2 bottom-full"}
        w-64 max-w-xs
      `}
    >
      <div
        className="flex items-center justify-center mb-3 py-2 border-b border-gray-200 rounded-md px-2"
        style={{ backgroundColor: event.color + "20" }}
      >
        <div
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: event.color }}
        />
        <h3 className="font-bold text-base text-gray-800 flex-grow">
          {event.title}
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          <span>
            {new Date(event.selected_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-green-500" />
          <span>
            {`${format(new Date(event.start_time), "h:mm a")} - ${format(
              new Date(event.end_time),
              "h:mm a"
            )}`}
          </span>
        </div>

        {event.description && (
          <div className="flex items-start text-sm text-gray-600 mt-2">
            <FileText className="w-4 h-4 mr-2 text-purple-500 mt-1" />
            <p className="flex-grow">{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInfoPopup;

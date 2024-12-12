import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function AvailabilitySection({ availability }) {
  const convertDateTimeFormat = (inputString) => {
    const inputArray = JSON.parse(inputString);
    return inputArray.map((datetime) => {
      const [day, time] = datetime.split(" ");
      const dayAbbr = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };
      return `${dayAbbr[day]} ${time}`;
    });
  };

  const availabilityArea = convertDateTimeFormat(availability);
  const availabilityAreaMap = availabilityArea.reduce((acc, slot) => {
    const [day, time] = slot.split(" ");
    if (!acc[day]) acc[day] = new Set();
    acc[day].add(time);
    return acc;
  }, {});

  const isSlotAvailable = (day, time) => {
    return availabilityAreaMap[day]?.has(time) || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-600"></div>
            Available
          </Badge>
          <Badge variant="outline" className="gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-300"></div>
            Unavailable
          </Badge>
        </div>

        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left font-medium text-muted-foreground"></th>
                  {DAYS.map((day) => (
                    <th key={day} className="px-3 py-2 text-center font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMES.map((time) => (
                  <tr
                    key={time}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="p-2 text-sm font-medium text-muted-foreground">
                      {time}
                    </td>
                    {DAYS.map((day) => (
                      <td key={`${day}-${time}`} className="px-2">
                        <div
                          className={cn(
                            "h-3 w-6 rounded mx-auto transition-colors",
                            isSlotAvailable(day, time)
                              ? "bg-green-600"
                              : "bg-gray-300"
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

AvailabilitySection.propTypes = {
  availability: PropTypes.string.isRequired,
};

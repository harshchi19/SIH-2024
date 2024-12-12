import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SessionForm({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="report_name">Report Name</Label>
        <Input
          id="report_name"
          placeholder="Enter report name"
          value={formData.report_name}
          onChange={(e) =>
            handleInputChange("session", "report_name", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="report_type">Report Type</Label>
        <Select
          value={formData.report_type}
          onValueChange={(value) =>
            handleInputChange("session", "report_type", value)
          }
        >
          <SelectTrigger id="report_type">
            <SelectValue placeholder="Select Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="initial">Initial</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add similar structure for all other session form fields */}
      {/* Time fields */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="session_date">Session Date</Label>
        <Input
          id="session_date"
          type="date"
          value={formData.date_of_session}
          onChange={(e) =>
            handleInputChange("session", "date_of_session", e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) =>
              handleInputChange("session", "start_time", e.target.value)
            }
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) =>
              handleInputChange("session", "end_time", e.target.value)
            }
          />
        </div>
      </div>

      {/* Notes and Progress */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="progress">Progress</Label>
        <Textarea
          id="progress"
          placeholder="Enter session progress"
          value={formData.progress}
          onChange={(e) =>
            handleInputChange("session", "progress", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="goals">Goals</Label>
        <Textarea
          id="goals"
          placeholder="Enter session goals"
          value={formData.goals}
          onChange={(e) =>
            handleInputChange("session", "goals", e.target.value)
          }
        />
      </div>

      {/* Continue with other fields following the same pattern */}
    </div>
  );
}

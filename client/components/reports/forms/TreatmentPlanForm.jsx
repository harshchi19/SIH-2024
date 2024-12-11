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

export function TreatmentPlanForm({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="treatment_approach">Treatment Approach</Label>
        <Select
          value={formData.treatment_approach}
          onValueChange={(value) =>
            handleInputChange("therapy-plan", "treatment_approach", value)
          }
        >
          <SelectTrigger id="treatment_approach">
            <SelectValue placeholder="Select Treatment Approach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cognitive">Cognitive</SelectItem>
            <SelectItem value="behavioral">Behavioral</SelectItem>
            <SelectItem value="integrative">Integrative</SelectItem>
            <SelectItem value="psychodynamic">Psychodynamic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="planned_interventions">Planned Interventions</Label>
        <Textarea
          id="planned_interventions"
          placeholder="Describe planned interventions"
          value={formData.planned_interventions}
          onChange={(e) =>
            handleInputChange(
              "therapy-plan",
              "planned_interventions",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="expected_outcomes">Expected Outcomes</Label>
        <Textarea
          id="expected_outcomes"
          placeholder="Describe expected outcomes"
          value={formData.expected_outcomes}
          onChange={(e) =>
            handleInputChange(
              "therapy-plan",
              "expected_outcomes",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="frequency_of_sessions">Frequency of Sessions</Label>
        <Input
          id="frequency_of_sessions"
          placeholder="E.g., Weekly, Bi-weekly"
          value={formData.frequency_of_sessions}
          onChange={(e) =>
            handleInputChange(
              "therapy-plan",
              "frequency_of_sessions",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="estimated_duration">Estimated Duration</Label>
        <Input
          id="estimated_duration"
          placeholder="E.g., 3 months, 6 months"
          value={formData.estimated_duration}
          onChange={(e) =>
            handleInputChange(
              "therapy-plan",
              "estimated_duration",
              e.target.value
            )
          }
        />
      </div>
    </div>
  );
}

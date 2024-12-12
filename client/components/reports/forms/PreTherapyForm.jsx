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

export function PreTherapyForm({ formData, handleInputChange }) {
  return (
    <div className="space-y-6 bg-white rounded-lg">
      <p className="text-sm text-gray-600">
        Please provide the required information to proceed with the assessment.
      </p>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Patient Name"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("pre-therapy", "name", e.target.value)
              }
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="age" className="font-medium">
              Age <span className="text-red-500">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                handleInputChange("pre-therapy", "age", e.target.value)
              }
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="sex" className="font-medium">
              Sex <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sex}
              onValueChange={(value) =>
                handleInputChange("pre-therapy", "sex", value)
              }
            >
              <SelectTrigger
                id="sex"
                className="focus:ring-2 focus:ring-primary"
              >
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date_of_assignment" className="font-medium">
              Date of Assignment <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_of_assignment"
              type="date"
              value={formData.date_of_assignment}
              onChange={(e) =>
                handleInputChange(
                  "pre-therapy",
                  "date_of_assignment",
                  e.target.value
                )
              }
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Therapy Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Therapy Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="provisional_diagnosis" className="font-medium">
              Provisional Diagnosis <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="provisional_diagnosis"
              placeholder="Enter provisional diagnosis"
              value={formData.provisional_diagnosis}
              onChange={(e) =>
                handleInputChange(
                  "pre-therapy",
                  "provisional_diagnosis",
                  e.target.value
                )
              }
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Findings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.findings).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key} className="font-medium">
                {key
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Label>{" "}
              <span className="text-red-500">*</span>
              <Textarea
                id={key}
                placeholder={`Enter ${key.split("_").join(" ")}`}
                value={value}
                onChange={(e) =>
                  handleInputChange(
                    "pre-therapy",
                    "findings",
                    e.target.value,
                    key
                  )
                }
                className="focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

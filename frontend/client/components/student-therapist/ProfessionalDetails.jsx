"use client";

import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { semester, hospitalDepartments } from "@/constants/hospitalDetails";

const ProfessionalDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();
  const [newItem, setNewItem] = useState({
    language: "",
    specialization: "",
    qualifications: "",
    training: "",
  });
  const [selectedSlots, setSelectedSlots] = useState(data.availability || []);
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  // Initialize location state
  const [location, setLocation] = useState({
    city: data.location?.city || "",
    state: data.location?.state || "",
    country: data.location?.country || "",
  });

  // Update parent data when location changes
  const handleLocationChange = (field, value) => {
    const newLocation = {
      ...location,
      [field]: value,
    };
    setLocation(newLocation);
    updateData("location", newLocation);
  };
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Only update parent when selectedSlots actually changes
  useEffect(() => {
    if (JSON.stringify(data.availability) !== JSON.stringify(selectedSlots)) {
      updateData("availability", selectedSlots);
    }
  }, [selectedSlots]);

  const handleChange = (e) => {
    updateData(e.target.id, e.target.value);
  };

  const handleQualificationChange = (semester) => {
    setSelectedQualifications((prev) => {
      const isSelected = prev.includes(semester);
      if (isSelected) {
        return prev.filter((item) => item !== semester);
      } else {
        return [...prev, semester];
      }
    });
  };

  const handleSpecializationChange = (dept) => {
    setSelectedSpecializations((prev) => {
      const isSelected = prev.includes(dept);
      if (isSelected) {
        return prev.filter((item) => item !== dept);
      } else {
        return [...prev, dept];
      }
    });
  };

  useEffect(() => {
    data.qualifications = selectedQualifications.toString(", ");
    data.specialization = selectedSpecializations.toString(", ");
  }, [selectedQualifications, selectedSpecializations]);

  const handleNumberChange = (e) => {
    updateData(
      e.target.id,
      e.target.value === "" ? null : Number(e.target.value)
    );
  };

  const addToList = (field) => {
    const fieldMap = {
      language: "spoken_languages",
      specialization: "specialization",
      qualifications: "qualifications",
      training: "training_and_education",
    };

    if (newItem[field] && newItem[field].trim() !== "") {
      const mappedField = fieldMap[field];
      const currentArray = data[mappedField] || [];
      updateData(mappedField, [...currentArray, newItem[field].trim()]);
      setNewItem((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const removeFromList = (field, index) => {
    const fieldMap = {
      preferred_language1: "preferred_language1",
      preferred_language2: "preferred_language2",
      preferred_language3: "preferred_language3",
      specialization: "specialization",
      qualifications: "qualifications",
      training: "training_and_education",
    };

    const mappedField = fieldMap[field];
    const currentArray = [...(data[mappedField] || [])];
    currentArray.splice(index, 1);
    updateData(mappedField, currentArray);
  };

  const handleAvailabilityChange = (day, time) => {
    const availabilityItem = `${day} ${time}`;
    setSelectedSlots((prev) =>
      prev.includes(availabilityItem)
        ? prev.filter((item) => item !== availabilityItem)
        : [...prev, availabilityItem]
    );
  };

  const renderSelectedSlots = () => {
    return selectedSlots.length > 0 ? (
      <div className="mt-4 bg-gray-50 p-3 rounded-md">
        <h3 className="text-md font-semibold mb-2">Selected Availability:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSlots.map((slot, index) => (
            <span
              key={index}
              className="bg-primary text-white px-2 py-1 rounded-full text-sm"
            >
              {slot}
            </span>
          ))}
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Rest of the JSX remains the same */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          2. {dict?.addStudentTherapist?.professional}
        </h2>

        {/* Spoken Languages */}
        <div className="space-y-4">
          <Label>
            Preferred Languages (Up to 3){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex gap-2">
              <Input
                value={data.preferred_language1 || ""}
                onChange={(e) =>
                  updateData("preferred_language1", e.target.value)
                }
                placeholder="First Language"
                className="w-full"
              />
              {data.preferred_language1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-red-100"
                  onClick={() => removeFromList("preferred_language1", 0)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={data.preferred_language2 || ""}
                onChange={(e) =>
                  updateData("preferred_language2", e.target.value)
                }
                placeholder="Second Language"
                className="w-full"
              />
              {data.preferred_language2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-red-100"
                  onClick={() => removeFromList("preferred_language2", 0)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={data.preferred_language3 || ""}
                onChange={(e) =>
                  updateData("preferred_language3", e.target.value)
                }
                placeholder="Third Language"
                className="w-full"
              />
              {data.preferred_language3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-red-100"
                  onClick={() => removeFromList("preferred_language3", 0)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <Label htmlFor="Specialization" className="text-gray-700 text-md">
            {dict?.addStudentTherapist?.department}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger
              className={`w-full flex items-center justify-start h-12 rounded-md border ${
                selectedSpecializations.length === 0 ? "text-gray-500" : ""
              } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            >
              {selectedSpecializations.length > 0
                ? selectedSpecializations.join(", ")
                : dict?.login?.dept_plchldr}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-auto bg-slate-50 p-1 rounded">
              {hospitalDepartments.map((dept, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    handleSpecializationChange(dept);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{dept}</span>
                    {selectedSpecializations.includes(dept) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 flex flex-wrap gap-2 gap-y-1">
            {selectedSpecializations.map((dept) => (
              <span
                key={dept}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        {/* Qualifications */}
        <div className="space-y-2">
          <Label htmlFor="qualifications" className="text-gray-700 text-md">
            {dict?.addStudentTherapist?.qualifications}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger
              className={`w-full flex items-center justify-start h-12 rounded-md border ${
                selectedQualifications.length === 0 ? "text-gray-500" : ""
              } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            >
              {selectedQualifications.length > 0
                ? selectedQualifications.join(", ")
                : dict?.addStudentTherapist?.qual_plchldr}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-auto bg-slate-50 p-1 mx-3 rounded">
              {semester.map((semester, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    handleQualificationChange(semester);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{semester}</span>
                    {selectedQualifications.includes(semester) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 flex flex-wrap gap-2 gap-y-1">
            {selectedQualifications.map((semester) => (
              <span
                key={semester}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
              >
                {semester}
              </span>
            ))}
          </div>
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience_years">
            Years of Experience <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            id="experience_years"
            value={data.experience_years || ""}
            onChange={handleNumberChange}
            placeholder="Enter years of experience"
            className="w-full"
          />
        </div>

        {/* Training and Education */}
        <div className="space-y-2">
          <Label>
            Clinical Coursework <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={newItem.training}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, training: e.target.value }))
              }
              placeholder="Enter training/education"
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToList("training")}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.training_and_education.map((training, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
              >
                {training}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-0 hover:bg-red-100"
                  onClick={() => removeFromList("training", index)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-medium">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="city"
                value={location.city}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                placeholder="Enter city"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State/Province <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="state"
                value={location.state}
                onChange={(e) => handleLocationChange("state", e.target.value)}
                placeholder="Enter state/province"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="country"
                value={location.country}
                onChange={(e) =>
                  handleLocationChange("country", e.target.value)
                }
                placeholder="Enter country"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="space-y-4">
        <h2 className="text-lg">
          Availability <span className="text-red-500">*</span>
        </h2>
        <div className="border rounded-md p-4">
          <div className="grid grid-cols-8 gap-2 text-sm font-medium">
            <div className="col-span-1"></div>
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-2 mt-2">
              <div className="text-sm">{time}</div>
              {daysOfWeek.map((day) => (
                <button
                  key={`${day}-${time}`}
                  type="button"
                  onClick={() => handleAvailabilityChange(day, time)}
                  className={`p-2 rounded cursor-pointer transition-colors duration-200 ${
                    selectedSlots.includes(`${day} ${time}`)
                      ? "bg-primary text-white hover:bg-primary-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {selectedSlots.includes(`${day} ${time}`) ? "" : ""}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Render selected slots */}
        {renderSelectedSlots()}

        {/* Optional: Clear all selections */}
        {selectedSlots.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setSelectedSlots([])}
            className="mt-4"
          >
            Clear All Selections
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetails;

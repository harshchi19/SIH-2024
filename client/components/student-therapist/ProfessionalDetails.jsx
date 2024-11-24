"use client";

import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ProfessionalDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();
  const [newItem, setNewItem] = useState({
    language: "",
    specialization: "",
    qualification: "",
    training: "",
  });
  const [selectedSlots, setSelectedSlots] = useState(data.availability || []);

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
      qualification: "qualifications",
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
      language: "spoken_languages",
      specialization: "specialization",
      qualification: "qualifications",
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
          <Label>Spoken Languages</Label>
          <div className="flex gap-2">
            <Input
              value={newItem.language}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  language: e.target.value,
                }))
              }
              placeholder="Enter language"
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToList("language")}
              className="whitespace-nowrap"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(data.spoken_languages || []).map((lang, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                <span>{lang}</span>
                <button
                  onClick={() => removeFromList("language", index)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rest of the component remains the same ... */}
        {/* Specialization */}
        <div className="space-y-2">
          <Label>Specialization</Label>
          <div className="flex gap-2">
            <Input
              value={newItem.specialization}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              placeholder="Enter specialization"
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToList("specialization")}
              className="whitespace-nowrap"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.specialization || []).map((spec, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                <span>{spec}</span>
                <button
                  onClick={() => removeFromList("specialization", index)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Qualifications */}
        <div className="space-y-2">
          <Label>Qualifications</Label>
          <div className="flex gap-2">
            <Input
              value={newItem.qualification}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  qualification: e.target.value,
                }))
              }
              placeholder="Enter qualification"
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addToList("qualification")}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.qualifications.map((qual, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
              >
                {qual}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-0 hover:bg-red-100"
                  onClick={() => removeFromList("qualification", index)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience_years">Years of Experience</Label>
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
          <Label>Clinical Coursework</Label>
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
              <Label htmlFor="city">City</Label>
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
              <Label htmlFor="state">State/Province</Label>
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
              <Label htmlFor="country">Country</Label>
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
        <h2 className="text-xl font-semibold">Availability</h2>
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

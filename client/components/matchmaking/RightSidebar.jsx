// RightSidebar.jsx
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { logo } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  qualificationsOptions,
  hospitalDepartments,
  sexData,
  languageData,
  timeData,
} from "@/constants/hospitalDetails";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { MATHCMAKING_ROUTE } from "@/utils/ai.constants";
import { toast } from "@/hooks/use-toast";
import { ALLOCATING_PATIENTS_ROUTE } from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";

const RightSidebar = ({
  selectedPatientId,
  studentTherapists,
  filteredTherapists,
  setFilteredTherapists,
  supervisors,
  filteredSupervisors,
  setFilteredSupervisors,
  selectedPatient,
  selectedTherapist,
  selectedSupervisor,
}) => {
  const { dict } = useLanguage();
  const [selectedQualification, setSelectedQualification] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedSex, setSelectedSex] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { role } = useParams();

  const handleFilterChange = () => {
    let filteredTherapists = studentTherapists;
    let filteredSupervisors = supervisors;

    // Qualification Filter
    if (selectedQualification.length > 0) {
      filteredTherapists = filteredTherapists.filter((therapist) => {
        // Ensure qualifications is an array, convert to array if it's a string
        const therapistQualifications = Array.isArray(therapist.qualifications)
          ? therapist.qualifications
          : therapist.qualifications
          ? [therapist.qualifications]
          : [];

        return selectedQualification.some((qual) =>
          therapistQualifications.includes(qual)
        );
      });

      filteredSupervisors = filteredSupervisors.filter((supervisor) => {
        // Same logic for supervisors
        const supervisorQualifications = Array.isArray(
          supervisor.qualifications
        )
          ? supervisor.qualifications
          : supervisor.qualifications
          ? [supervisor.qualifications]
          : [];

        return selectedQualification.some((qual) =>
          supervisorQualifications.includes(qual)
        );
      });
    }

    // Similar modifications for other filters
    // Specialization Filter
    if (selectedSpecializations.length > 0) {
      filteredTherapists = filteredTherapists.filter((therapist) => {
        const therapistSpecializations = Array.isArray(therapist.specialization)
          ? therapist.specialization
          : therapist.specialization
          ? [therapist.specialization]
          : [];

        return selectedSpecializations.some((spec) =>
          therapistSpecializations.includes(spec)
        );
      });

      filteredSupervisors = filteredSupervisors.filter((supervisor) => {
        const supervisorSpecializations = Array.isArray(
          supervisor.specialization
        )
          ? supervisor.specialization
          : supervisor.specialization
          ? [supervisor.specialization]
          : [];

        return selectedSpecializations.some((spec) =>
          supervisorSpecializations.includes(spec)
        );
      });
    }

    // Languages Filter
    if (selectedLanguages.length > 0) {
      filteredTherapists = filteredTherapists.filter((therapist) => {
        const therapistLanguages = Array.isArray(therapist.languages)
          ? therapist.languages
          : therapist.languages
          ? [therapist.languages]
          : [];

        return selectedLanguages.some((lang) =>
          therapistLanguages.includes(lang)
        );
      });

      filteredSupervisors = filteredSupervisors.filter((supervisor) => {
        const supervisorLanguages = Array.isArray(supervisor.languages)
          ? supervisor.languages
          : supervisor.languages
          ? [supervisor.languages]
          : [];

        return selectedLanguages.some((lang) =>
          supervisorLanguages.includes(lang)
        );
      });
    }

    // Location Filter
    if (selectedLocations.trim() !== "") {
      filteredTherapists = filteredTherapists.filter((therapist) =>
        therapist.location
          .toLowerCase()
          .includes(selectedLocations.toLowerCase())
      );
      filteredSupervisors = filteredSupervisors.filter((supervisor) =>
        supervisor.location
          .toLowerCase()
          .includes(selectedLocations.toLowerCase())
      );
    }

    // Sex Filter
    if (selectedSex.length > 0) {
      filteredTherapists = filteredTherapists.filter((therapist) =>
        selectedSex.includes(therapist.sex)
      );
      filteredSupervisors = filteredSupervisors.filter((supervisor) =>
        selectedSex.includes(supervisor.sex)
      );
    }

    // Time Slots Filter
    if (selectedTimeSlots.length > 0) {
      filteredTherapists = filteredTherapists.filter((therapist) => {
        const therapistTimeSlots = Array.isArray(therapist.availableTimeSlots)
          ? therapist.availableTimeSlots
          : therapist.availableTimeSlots
          ? [therapist.availableTimeSlots]
          : [];

        return selectedTimeSlots.some((slot) =>
          therapistTimeSlots.includes(slot)
        );
      });

      filteredSupervisors = filteredSupervisors.filter((supervisor) => {
        const supervisorTimeSlots = Array.isArray(supervisor.availableTimeSlots)
          ? supervisor.availableTimeSlots
          : supervisor.availableTimeSlots
          ? [supervisor.availableTimeSlots]
          : [];

        return selectedTimeSlots.some((slot) =>
          supervisorTimeSlots.includes(slot)
        );
      });
    }

    setFilteredTherapists(filteredTherapists);
    setFilteredSupervisors(filteredSupervisors);
  };

  const handleSelectChange = (value, setter, selectedList) => {
    if (selectedList.includes(value)) {
      setter(selectedList.filter((item) => item !== value));
    } else {
      setter([...selectedList, value]);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocations(e.target.value);
  };

  const handleAIMatchmaking = async () => {
    setLoading(true);
    if (selectedPatientId === "") {
      toast({ variant: "destructive", title: "Please select a patient" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("patient_id", selectedPatientId);

    const response = await fetch(MATHCMAKING_ROUTE, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();

      const supervisorIds = result.supervisors.map(
        (supervisor) => supervisor.filename.split("_")[0]
      );
      const therapistIds = result.student_therapists.map(
        (therapist) => therapist.filename.split("_")[0]
      );

      setFilteredSupervisors((prev) =>
        prev.filter((supervisor) =>
          supervisorIds.includes(supervisor.supervisor_id)
        )
      );
      setFilteredTherapists((prev) =>
        prev.filter((therapist) =>
          therapistIds.includes(therapist.student_therapist_id)
        )
      );

      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedTherapist || !selectedSupervisor) {
      toast({ title: "Please select a Patient, Therapist and Supervsior" });
      return;
    }

    const data = { selectedPatient, selectedTherapist, selectedSupervisor };

    const response = await fetch(ALLOCATING_PATIENTS_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast({ title: result?.message });
      router.push(`/en/${role}/patients/matchmaking`);
    }
  };

  return (
    <div className="h-full w-1/4 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-hidden">
      <div className="flex items-center gap-x-2">
        <Image src={logo} alt="Logo" className="h-7 w-auto" />
        <h1 className="text-xl font-semibold">
          {dict?.matchmaking?.matchmaker}
        </h1>
      </div>

      <div className="mt-4">
        <div className="space-y-1 w-full">
          <Label htmlFor="qualification" className="text-gray-700 text-md">
            Qualifications
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger className="w-full flex items-center justify-start h-12 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm">
              {selectedQualification.length > 0 ? (
                selectedQualification.join(", ")
              ) : (
                <h1 className="text-sm text-gray-500">Select Qualifications</h1>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {qualificationsOptions.map((qual, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    handleSelectChange(
                      qual,
                      setSelectedQualification,
                      selectedQualification
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{qual}</span>
                    {selectedQualification.includes(qual) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 w-full mt-4">
          <Label htmlFor="specialization" className="text-gray-700 text-md">
            Specializations
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger className="w-full flex items-center justify-start h-12 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm">
              {selectedSpecializations.length > 0 ? (
                selectedSpecializations.join(", ")
              ) : (
                <h1 className="text-sm text-gray-500">
                  Select Specializations
                </h1>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hospitalDepartments.map((spec, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    handleSelectChange(
                      spec,
                      setSelectedSpecializations,
                      selectedSpecializations
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{spec}</span>
                    {selectedSpecializations.includes(spec) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location Input */}
        <div className="space-y-1 w-full mt-4">
          <Label htmlFor="location" className="text-gray-700 text-md">
            Location
          </Label>
          <Input
            type="text"
            id="location"
            value={selectedLocations}
            onChange={handleLocationChange}
            placeholder={dict?.addPatient?.pref_lang_plchldr}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        {/* Languages Dropdown */}
        <div className="mt-4">
          <Label htmlFor="language" className="text-gray-700 text-md">
            Languages
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger className="w-full flex items-center justify-start h-12 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm">
              {selectedLanguages.length > 0 ? (
                selectedLanguages.join(", ")
              ) : (
                <h1 className="text-sm text-gray-500">Select Languages</h1>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languageData.map((language, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    handleSelectChange(
                      language,
                      setSelectedLanguages,
                      selectedLanguages
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{language}</span>
                    {selectedLanguages.includes(language) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <Label htmlFor="gender" className="text-gray-700 text-md">
            Gender
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger className="w-full flex items-center justify-start h-12 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm">
              {selectedSex.length > 0 ? (
                selectedSex.join(", ")
              ) : (
                <h1 className="text-sm text-gray-500">Select Gender</h1>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sexData.map((sex, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    handleSelectChange(sex, setSelectedSex, selectedSex)
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{sex}</span>
                    {selectedSex.includes(sex) && (
                      <span className="text-green-500 ml-2">✔</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <Label htmlFor="time" className="text-gray-700 text-md">
            Time Slots
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger className="w-full flex items-center justify-start h-12 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm">
              {selectedTimeSlots.length > 0 ? (
                selectedTimeSlots.join(", ")
              ) : (
                <h1 className="text-sm text-gray-500">Select Time Slots</h1>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-scroll">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (day) => (
                  <div key={day}>
                    <h2 className="font-semibold text-gray-600 px-3 py-1">
                      {day}
                    </h2>
                    {timeData
                      .filter((time) => time.startsWith(day))
                      .map((time, index) => (
                        <DropdownMenuItem
                          key={`${day}-${index}`}
                          onClick={() =>
                            handleSelectChange(
                              time,
                              setSelectedTimeSlots,
                              selectedTimeSlots
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span>{time}</span>
                            {selectedTimeSlots.includes(time) && (
                              <span className="text-green-500 ml-2">✔</span>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                  </div>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <Button
            onClick={handleFilterChange}
            className="h-10 text-md mt-4 w-full py-2 px-4 border-2 bg-transparent border-green-500 text-green-500 rounded hover:bg-white font-bold"
          >
            Apply Filters
          </Button>

          <Button
            onClick={handleAIMatchmaking}
            className="h-10 mt-4 w-full py-2 text-md px-4 bg-green-600 text-white hover:bg-green-700 rounded font-semibold"
          >
            {!loading ? (
              <>
                <Sparkles />
                AI Matchmaking
              </>
            ) : (
              <>Loading...</>
            )}
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          className="h-12 mt-8 w-full py-2 text-md px-4 bg-transparent text-green-600 border-[1px] border-green-500 rounded-lg font-semibold shadow-none hover:bg-green-400 hover:text-white hover:border-none"
        >
          Allocate Patient
        </Button>
      </div>
    </div>
  );
};

export default RightSidebar;

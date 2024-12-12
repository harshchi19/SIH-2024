import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Info from "@/components/Info";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { GET_ALL_SUP_ROUTE } from "@/utils/constants";

const PatientDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();
  const [supervisorData, setSupervisorData] = useState([]);
  const [supervisorName, setSupervisorName] = useState("");

  useEffect(() => {
    const getSupervisorData = async () => {
      const response = await fetch(GET_ALL_SUP_ROUTE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSupervisorData(data);
      }
    };

    getSupervisorData();
  }, []);

  useEffect(() => {
    supervisorData.forEach((supervisor) => {
      if (supervisor._id === data.supervisor) {
        setSupervisorName(supervisor.name);
      }
    });
  }, [data]);

  const handleInputChange = (e, id, value) => {
    if (e?.target) {
      const { id: eventId, value: eventValue } = e.target;
      updateData(eventId, eventValue);
    } else if (id && value !== undefined) {
      updateData(id, value);
    }
  };

  const handleDateChange = (selectedDate, selectedType) => {
    if (selectedType === "date_of_assignment") {
      updateData("date_of_assignment", selectedDate);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">1. {dict?.pre_therapy?.patient}</h1>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="name" className="text-gray-700 text-md">
            {dict?.addPatient?.name}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            value={data?.name}
            placeholder={dict?.login?.pat_pchldr_name}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label
            htmlFor="case_no"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.case_no}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="case_no"
            value={data?.case_no}
            placeholder={dict?.pre_therapy?.case_no_plchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="age_sex"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.age_sex}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="age_sex"
            value={data?.age_sex}
            placeholder={dict?.pre_therapy?.age_plchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="date_of_assignment" className="text-gray-700 text-md">
            {dict?.addPatient?.date_of_assg}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger className="w-full h-12 bg-transparent" asChild>
              <Button
                variant={"outline"}
                className={`
              "w-[280px] justify-start text-left font-normal",
              ${!data?.date_of_assignment && "text-muted-foreground"}
            `}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data?.date_of_assignment ? (
                  format(data?.date_of_assignment, "PPP")
                ) : (
                  <span>{dict?.addPatient?.doa_plchldr}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data?.date_of_assignment}
                onSelect={(date) =>
                  handleDateChange(date, "date_of_assignment")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="supervisor"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.supervisor}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="supervisor"
            value={data?.supervisor}
            placeholder={dict?.pre_therapy?.supervisor_plchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label
            htmlFor="student_clinician"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.stt_name}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="student_clinician"
            value={data?.student_clinician}
            placeholder={dict?.pre_therapy?.stt_clic_plchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="provisional_diagnosis"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.prov_diag}
            <span className="text-red-500 ml-1">*</span>
            <Info info={dict?.pre_therapy?.prov_diag} />
          </Label>
          <Textarea
            id="provisional_diagnosis"
            value={data?.provisional_diagnosis}
            placeholder={dict?.pre_therapy?.prov_diag_plchldr}
            onChange={handleInputChange}
            className="h-24"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;

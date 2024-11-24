"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import Info from "../Info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

const BasicDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleInputChange = (e, id, value) => {
    if (e?.target) {
      const { id: eventId, value: eventValue } = e.target;
      updateData(eventId, eventValue);
    } else if (id && value !== undefined) {
      updateData(id, value);
    }
  };

  const handleDateChange = (selectedDate) => {
    handleInputChange(null, "date_of_birth", selectedDate);
  };

  const supervisorData = [
    "Dr. Shashikant Deshpande",
    "Prof. Reshma Desai",
    "Dr. Mohammad Rehan",
    "Dr. Jethalal Bhide",
  ];

  const sexData = ["Male", "Female", "Other"];

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">1. {dict?.addPatient?.basic}</h1>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="name" className="text-gray-700 text-md">
            {dict?.addPatient?.name}
          </Label>
          <Input
            type="text"
            id="name"
            value={data.name}
            placeholder={dict?.login?.pat_pchldr_name}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label
            htmlFor="password"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.login?.password}
            <Info info={dict?.addPatient?.pass_info} />
          </Label>
          <Input
            type="password"
            id="password"
            value={data.password}
            placeholder={dict?.login?.pat_pchldr_pass}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="email"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.email}
          </Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            placeholder={dict?.addPatient?.email_plchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="phone_no" className="text-gray-700 text-md">
            {dict?.login?.phone}
          </Label>
          <Input
            type="tel"
            id="phone_no"
            value={data.phone}
            placeholder={dict?.login?.pat_pchldr_phon}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="date_of_birth" className="text-gray-700 text-md">
            {dict?.addPatient?.date_of_birth}
          </Label>
          <Popover>
            <PopoverTrigger className="w-full h-12 bg-transparent" asChild>
              <Button
                variant={"outline"}
                className={`
                  "w-[280px] justify-start text-left font-normal",
                  ${!data.date_of_birth && "text-muted-foreground"}
                `}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.date_of_birth ? (
                  format(data.date_of_birth, "PPP")
                ) : (
                  <span>{dict?.addPatient?.dob_plchldr}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.date_of_birth}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="sex" className="text-gray-700 text-md">
            {dict?.addPatient?.sex}
          </Label>
          <DropdownMenu className="flex justify-start">
            <DropdownMenuTrigger
              className={`w-full flex items-center justify-start h-12 rounded-md border ${
                !data.sex ? "text-gray-500" : ""
              } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            >
              {data.sex || dict?.addPatient?.sex_plchldr}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sexData.map((sex) => (
                <DropdownMenuItem
                  key={sex}
                  onClick={() => handleInputChange(null, "sex", sex)}
                >
                  {sex}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="preferred_language" className="text-gray-700 text-md">
            {dict?.addPatient?.pref_lang}
          </Label>
          <Input
            type="text"
            id="preferred_language"
            value={data.preferred_language}
            placeholder={dict?.addPatient?.pref_lang_pchldr}
            onChange={handleInputChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="preferred_language" className="text-gray-700 text-md">
            {dict?.addPatient?.sel_sup}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`w-full flex items-center justify-start h-12 rounded-md border ${
                !data.supervisor ? "text-gray-500" : ""
              } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            >
              {data.supervisor || dict?.addPatient?.sel_sup_plchldr}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {supervisorData.map((supervisor) => (
                <DropdownMenuItem
                  key={supervisor}
                  onClick={() =>
                    handleInputChange(null, "supervisor", supervisor)
                  }
                >
                  {supervisor}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="summary"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.summary}
            <Info info={dict?.addPatient?.summary_info} />
          </Label>
          <Textarea
            id="summary"
            value={data.summary}
            placeholder={dict?.addPatient?.summary_plchldr}
            onChange={handleInputChange}
            className="h-24"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;

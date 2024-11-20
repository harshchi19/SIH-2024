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

const BasicDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const handleDateChange = (selectedDate) => {
    updateData({
      ...data,
      date_of_birth: selectedDate,
    });
  };

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
            onChange={handleChange}
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
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="phone" className="text-gray-700 text-md">
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
          <Input
            type="text"
            id="sex"
            value={data.sex}
            placeholder="M / F / O"
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;

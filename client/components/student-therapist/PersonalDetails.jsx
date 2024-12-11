"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";
import Info from "../Info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { useById } from "@/hooks/useById";
import { useAuthContext } from "@/hooks/useAuthContext";

const PersonalDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();
  const { getById, isLoading } = useById();
  const user = localStorage.getItem("user");
  const [supervisor, setSupervisor] = useState();

  useEffect(() => {
    getById(user, "SUP").then((res) => {
      if (res.success) {
        updateData("supervisor_id", res.user._id);
        console.log(res.user);
      }
    });
  }, [user]);

  const handleChange = (field, value) => {
    updateData(field, value);
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">
        1. {dict?.addStudentTherapist?.personal}
      </h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="name" className="text-gray-700 text-md">
            {dict?.addStudentTherapist?.name}
          </Label>
          <Input
            type="text"
            id="name"
            value={data.name || ""}
            placeholder={dict?.login?.pat_pchldr_name}
            onChange={(e) => handleChange("name", e.target.value)}
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
            value={data.phone_no || ""}
            placeholder={dict?.login?.pat_pchldr_phon}
            onChange={(e) => handleChange("phone_no", e.target.value)}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="email" className="text-gray-700 text-md">
            {dict?.login?.email}
          </Label>
          <Input
            type="email"
            id="email"
            value={data.email || ""}
            placeholder={dict?.login?.pat_pchldr_email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="sex" className="text-gray-700 text-md">
            {dict?.addStudentTherapist?.sex}
          </Label>
          <Select
            value={data.sex || ""}
            onValueChange={(value) => handleChange("sex", value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
              <SelectItem value="O">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="age"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addStudentTherapist?.age}
          </Label>
          <Input
            type="number"
            id="age"
            value={data.age || ""}
            placeholder={dict?.addStudentTherapist?.age_plchldr}
            onChange={(e) => handleChange("age", Number(e.target.value))}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label
            htmlFor="password"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.login?.password}
          </Label>
          <Input
            type="password"
            id="password"
            value={data.password || ""}
            placeholder={dict?.login?.pat_pchldr_pass}
            onChange={(e) => handleChange("password", e.target.value)}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logo } from "@/assets";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  qualificationsOptions,
  hospitalDepartments,
} from "@/constants/hospitalDetails";
import { useLanguage } from "@/context/LanguageContext";

const HODOnboarding = ({
  data,
  handleInputChange,
  handleSexChange,
  selectedDepartments,
  selectedQualifications,
  handleQualificationChange,
  handleDepartmentChange,
  handleSubmit,
}) => {
  const { dict, currentLang } = useLanguage();

  const sexData = ["Male", "Female", "Other"];

  return (
    <div className="h-screen w-screen flex-row-center bg-gray-100 overflow-auto">
      <div className="h-[90%] w-2/3 rounded-xl overflow-hidden py-5 shadow-2xl border bg-white max-md:w-11/12">
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex flex-col justify-start mt-6 px-14 max-sm:px-8">
              <div className="flex items-center justify-between">
                <Link href={`/${currentLang}`}>
                  <Image
                    src={logo}
                    className="h-14 w-auto mb-4 cursor-pointer"
                    alt="Logo"
                  />
                </Link>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-gray-800">
                  Register yourself as Head Of Deprtment
                </h1>
                <h3 className="text-sm font-medium mt-2 text-gray-600">
                  Please fill in the details and wait for the approval of the
                  Admin
                </h3>

                <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-8">
                  <div className="space-y-1 w-full">
                    <Label htmlFor="name" className="text-gray-700 text-md">
                      Head Of Department's Name
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
                      htmlFor="password"
                      className="text-gray-700 text-md flex items-center"
                    >
                      {dict?.login?.password}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      value={data?.password}
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
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      value={data?.email}
                      placeholder={dict?.addPatient?.email_plchldr}
                      onChange={handleInputChange}
                      className="border-gray-200 w-full h-12 text-md"
                    />
                  </div>
                  <div className="space-y-1 w-full">
                    <Label htmlFor="phone_no" className="text-gray-700 text-md">
                      {dict?.login?.phone}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="phone_no"
                      value={data?.phone}
                      placeholder={dict?.login?.pat_pchldr_phon}
                      onChange={handleInputChange}
                      className="border-gray-200 w-full h-12 text-md"
                    />
                  </div>
                </div>

                <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
                  <div className="grid w-full items-center gap-2">
                    <Label
                      htmlFor="date_of_birth"
                      className="text-gray-700 text-md"
                    >
                      {dict?.addPatient?.date_of_birth}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={data?.date_of_birth}
                      onChange={handleInputChange}
                      className="h-12 -mt-1"
                      required
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <Label htmlFor="sex" className="text-gray-700 text-md">
                      {dict?.addPatient?.sex}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <DropdownMenu className="flex justify-start">
                      <DropdownMenuTrigger
                        className={`w-full flex items-center justify-start h-12 rounded-md border ${
                          !data?.sex ? "text-gray-500" : ""
                        } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                      >
                        {data?.sex || dict?.login?.sup_sex_plchldr}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {sexData.map((sex) => (
                          <DropdownMenuItem
                            key={sex}
                            onClick={() => handleSexChange("sex", sex)}
                          >
                            {sex}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="w-full flex gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
                  <div className="space-y-1 w-full">
                    <Label
                      htmlFor="department"
                      className="text-gray-700 text-md"
                    >
                      Department
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <DropdownMenu className="flex justify-start">
                      <DropdownMenuTrigger
                        className={`w-full flex items-center justify-start h-12 rounded-md border ${
                          selectedDepartments?.length === 0
                            ? "text-gray-500"
                            : ""
                        } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                      >
                        {selectedDepartments?.length > 0
                          ? selectedDepartments.join(", ")
                          : dict?.login?.dept_plchldr}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {hospitalDepartments.map((dept, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              handleDepartmentChange(dept);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{dept}</span>
                              {selectedDepartments?.includes(dept) && (
                                <span className="text-green-500 ml-2">✔</span>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mt-2 flex flex-wrap gap-2 gap-y-1">
                      {selectedDepartments?.map((dept) => (
                        <span
                          key={dept}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 w-full">
                    <Label
                      htmlFor="qualifications"
                      className="text-gray-700 text-md"
                    >
                      {dict?.login?.qualifications}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <DropdownMenu className="flex justify-start">
                      <DropdownMenuTrigger
                        className={`w-full flex items-center justify-start h-12 rounded-md border ${
                          selectedQualifications?.length === 0
                            ? "text-gray-500"
                            : ""
                        } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                      >
                        {selectedQualifications?.length > 0
                          ? selectedQualifications?.join(", ")
                          : dict?.login?.qual_plchldr}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-80 overflow-y-scroll">
                        {qualificationsOptions?.map((qualification, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => {
                              handleQualificationChange(qualification);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{qualification}</span>
                              {selectedQualifications?.includes(
                                qualification
                              ) && (
                                <span className="text-green-500 ml-2">✔</span>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mt-2 flex flex-wrap gap-2 gap-y-1">
                      {selectedQualifications?.map((qualification) => (
                        <span
                          key={qualification}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {qualification}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-8 w-full h-12 bg-green-400 hover:bg-green-500 text-md active:scale-95 font-semibold tracking-tight"
                  onClick={handleSubmit}
                >
                  {dict?.addPatient?.submit}
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 pb-4">
            Vani Vikas © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODOnboarding;

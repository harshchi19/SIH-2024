"use client";

import { useState } from "react";
import { UserCircle, Stethoscope, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logo } from "@/assets";
import { Check } from "lucide-react";
import Link from "next/link";
import PatientForm from "@/components/login/PatientForm";
import StudentTherapistForm from "@/components/login/StudentTherapistForm";
import SupervisorForm from "@/components/login/SupervisorForm";

const SignInPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { dict, currentLang } = useLanguage();

  if (!dict) {
    return (
      <>
        <Loader />
      </>
    );
  }

  const roles = [
    {
      value: "PAT",
      label: dict?.login?.pat,
      icon: <Stethoscope className="w-7 h-7 text-blue-500" />,
      description: dict?.login?.pat_desc,
    },
    {
      value: "STT",
      label: dict?.login?.stt,
      icon: <UserCircle className="w-7 h-7 text-green-500" />,
      description: dict?.login?.stt_desc,
    },
    {
      value: "SUP",
      label: dict?.login?.sup,
      icon: <ShieldCheck className="w-7 h-7 text-purple-500" />,
      description: dict?.login?.sup_desc,
    },
  ];

  return (
    <div className="h-screen w-screen flex-row-center bg-gray-100">
      <div className="h-[80%] w-1/3 rounded-xl overflow-hidden py-5 shadow-2xl border bg-white max-md:w-11/12">
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex flex-col justify-start mt-6 px-14 max-sm:px-8">
              <div className="flex ite justify-between">
                <Link href={`/${currentLang}`}>
                  <Image
                    src={logo}
                    className="h-14 w-auto mb-4 cursor-pointer"
                    alt="Logo"
                  />
                </Link>
              </div>
              {currentStep === 1 && (
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter text-gray-800">
                    {dict?.login?.header}
                  </h1>
                  <h3 className="text-sm font-medium mt-2 text-gray-600">
                    {dict?.login?.description1}
                  </h3>

                  <div className="mt-8 grid grid-cols-1 gap-4">
                    {roles.map((role) => (
                      <Button
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        className={`relative h-20 ${
                          selectedRole === role.value
                            ? "bg-green-50"
                            : "bg-white"
                        } flex items-center justify-start p-4 border-2 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-green-500`}
                      >
                        <div className="mr-4 rounded-md border-2 p-2">
                          {role.icon}
                        </div>
                        <div className="text-left">
                          <h2 className="font-semibold text-lg text-gray-800 group-hover:text-green-600">
                            {role.label}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {role.description}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full absolute right-3 top-3 ${
                            selectedRole === role.value
                              ? "border-none"
                              : "border-2"
                          }`}
                        >
                          {selectedRole === role.value && (
                            <Check className="h-5 w-5 rounded-full p-px bg-green-500" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>

                  <Button
                    className="mt-8 w-full h-12 bg-green-400 hover:bg-green-500 text-md active:scale-95 font-semibold tracking-tight"
                    disabled={selectedRole ? false : true}
                    onClick={() => setCurrentStep(2)}
                  >
                    {dict?.login?.continue}
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <>
                  {selectedRole === "PAT" && (
                    <PatientForm setCurrentStep={setCurrentStep} />
                  )}
                  {selectedRole === "STT" && (
                    <StudentTherapistForm setCurrentStep={setCurrentStep} />
                  )}
                  {selectedRole === "SUP" && (
                    <SupervisorForm setCurrentStep={setCurrentStep} />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 pb-4">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

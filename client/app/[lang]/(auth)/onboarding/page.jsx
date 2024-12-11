"use client";

import { useEffect, useState } from "react";
import {
  CHECK_ONBOARDING_STATUS_ROUTE,
  ONBOARD_AUTH_USER_ROUTE,
} from "@/utils/constants";
import HODOnboarding from "@/components/login/HODOnboarding";
import AdminOnboarding from "@/components/login/AdminOnboarding";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

const OnboardingPage = () => {
  const userType = localStorage.getItem("userType");
  const { dict, currentLang } = useLanguage();
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [data, setData] = useState({
    name: "",
    password: "",
    phone_no: "",
    email: "",
    date_of_birth: "",
    sex: "",
    department: "",
    qualifications: "",
    preferred_language1: "",
    preferred_language2: "",
    preferred_language3: "",
  });
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const checkOnboardingFilled = async () => {
      const userId = localStorage.getItem("user");
      const userType = localStorage.getItem("userType");

      const response = await fetch(
        `${CHECK_ONBOARDING_STATUS_ROUTE}/${userId}/${userType}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          router.push(`/${currentLang}/${result.userType}/dashboard`);
        } else {
          setData((prev) => ({
            ...prev,
            email: result.email || "",
            password: result.password || "",
          }));
        }
      }
    };

    checkOnboardingFilled();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSexChange = (sexId, sexValue) => {
    setData((prevData) => ({
      ...prevData,
      [sexId]: sexValue,
    }));
  };

  const handleQualificationChange = (qualification) => {
    setSelectedQualifications((prev) => {
      const isSelected = prev.includes(qualification);
      if (isSelected) {
        return prev.filter((item) => item !== qualification);
      } else {
        return [...prev, qualification];
      }
    });
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDepartments((prev) => {
      const isSelected = prev.includes(dept);
      if (isSelected) {
        return prev.filter((item) => item !== dept);
      } else {
        return [...prev, dept];
      }
    });
  };

  const updateQualificationsField = () => {
    handleInputChange({
      target: {
        id: "qualifications",
        value: selectedQualifications.join(", "),
      },
    });
  };

  const updateDepartmentsField = () => {
    handleInputChange({
      target: {
        id: "department",
        value: selectedDepartments.join(", "),
      },
    });
  };

  useEffect(() => {
    updateDepartmentsField();
  }, [selectedDepartments]);

  useEffect(() => {
    updateQualificationsField();
  }, [selectedQualifications]);

  const handleSubmit = async () => {
    try {
      data["userId"] = localStorage.getItem("user");
      data["userType"] = localStorage.getItem("userType");

      const response = await fetch(ONBOARD_AUTH_USER_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast({ title: result.message });

        const userType = localStorage.getItem("userType");
        const rolePrefix = ROLE_PREFIXES[userType] || "user";

        router.push(`/${params.lang}/${rolePrefix}/dashboard`);
      } else {
        toast({ variant: "destructive", title: dict?.errors?.try_lat_err });
      }
    } catch (error) {
      toast({ variant: "destructive", title: dict?.errors?.try_lat_err });
    }
  };

  const ROLE_PREFIXES = {
    ADM: "admin",
    HOD: "head-of-department",
  };

  return (
    <>
      {userType === "HOD" && (
        <HODOnboarding
          data={data}
          handleInputChange={handleInputChange}
          handleSexChange={handleSexChange}
          selectedDepartments={selectedDepartments}
          selectedQualifications={selectedQualifications}
          handleQualificationChange={handleQualificationChange}
          handleDepartmentChange={handleDepartmentChange}
          handleSubmit={handleSubmit}
        />
      )}
      {userType === "ADM" && (
        <AdminOnboarding
          data={data}
          handleInputChange={handleInputChange}
          handleSexChange={handleSexChange}
          selectedDepartments={selectedDepartments}
          selectedQualifications={selectedQualifications}
          handleQualificationChange={handleQualificationChange}
          handleDepartmentChange={handleDepartmentChange}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default OnboardingPage;

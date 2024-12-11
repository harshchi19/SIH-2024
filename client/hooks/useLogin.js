import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import { LOGIN_USER_ROUTE } from "@/utils/constants";

const ROLE_PREFIXES = {
  STT: "student-therapist",
  SUP: "supervisor",
  HOD: "head-of-department",
  ADM: "admin",
};

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (formData) => {
    setIsLoading(true);
    setError(null);
    console.log(formData);

    try {
      const response = await fetch(LOGIN_USER_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("user", result.userId);
        localStorage.setItem("userType", result.userType);
        dispatch({ type: "LOGIN", payload: result.userId });
        setIsLoading(false);
        return { success: true, userRoute: ROLE_PREFIXES[result.userType] };
      } else {
        setIsLoading(false);
        setError("Login failed. Please try again.");
        return { success: false, message: "Login failed. Please try again." };
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return { login, isLoading, error };
};

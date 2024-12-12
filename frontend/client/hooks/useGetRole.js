import { useState } from "react";
import {
  GET_ALL_PAT_ROUTE,
  GET_ALL_STT_ROUTE,
  GET_ALL_SUP_ROUTE,
} from "@/utils/constants";

const ROLE_PREFIXES = {
  PAT: GET_ALL_PAT_ROUTE,
  STT: GET_ALL_STT_ROUTE,
  SUP: GET_ALL_SUP_ROUTE,
};

export const useGetRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAll = async (role) => {
    setIsLoading(true);
    setError(null);

    try {
      const route = ROLE_PREFIXES[role];

      const response = await fetch(route, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        return { success: true, users: result }; // Return user data if successful
      } else {
        // Handle cases where the response is not OK (non-2xx status codes)
        setError("Users not found.");
        return { success: false, message: "Users not found." };
      }
    } catch (err) {
      // Generic error handling
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      // Always set loading to false after the fetch is completed
      setIsLoading(false);
    }
  };

  return { getAll, isLoading, error };
};

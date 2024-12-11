import {
  GET_STT_BY_ID_ROUTE,
  GET_PAT_BY_ID_ROUTE,
  GET_SUP_BY_ID_ROUTE,
} from "@/utils/constants";
import { useState } from "react";

const ROLE_PREFIXES = {
  PAT: GET_PAT_BY_ID_ROUTE,
  STT: GET_STT_BY_ID_ROUTE,
  SUP: GET_SUP_BY_ID_ROUTE,
};

export const useById = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const getById = async (id, role) => {
    setIsLoading(true);
    setError(null);

    try {
      const route = ROLE_PREFIXES[role];

      const response = await fetch(`${route}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        return { success: true, user: result }; // Return user data if successful
      } else {
        // Handle cases where the response is not OK (non-2xx status codes)
        setError("User not found.");
        return { success: false, message: "User not found." };
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

  return { getById, isLoading, error };
};

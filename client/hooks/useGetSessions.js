import { GET_ALL_SESSIONS_ROUTE } from "@/utils/constants";
import { useState } from "react";

export const useGetSessions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GET_ALL_SESSIONS_ROUTE, {
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
      setError(err.message || "An unexpected error occurred");
      return {
        success: false,
        message: err.message || "An unexpected error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { getAllSessions, isLoading, error };
};

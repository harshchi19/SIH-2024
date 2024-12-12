import { useState } from "react";
import {
  GET_ALL_SESSIONS_BY_THERAPIST,
  GET_ALL_SESSIONS_BY_THERAPIST_PATIENT,
} from "@/utils/constants";

export const useSessionByTherapistByPatient = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSessionByTherapistByPatient = async (therapistId, patientId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${GET_ALL_SESSIONS_BY_THERAPIST_PATIENT}/${therapistId}/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        return { success: true, sessions: result }; // Return session data if successful
      } else {
        // Handle cases where the response is not OK (non-2xx status codes)
        setError("Sessions not found.");
        return { success: false, message: "Sessions not found." };
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

  return { getSessionByTherapistByPatient, isLoading, error };
};

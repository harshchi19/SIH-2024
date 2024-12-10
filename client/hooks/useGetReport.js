import { useState, useEffect } from "react";
import { GET_ALL_REPORTS } from "@/utils/constants";

export const useGetReport = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getAllReports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GET_ALL_REPORTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        return { success: true, result }; // Return user data if successful
      } else {
        setError("Report not found.");
        return { success: false, message: "Users not found." };
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getAllReports, isLoading };
};

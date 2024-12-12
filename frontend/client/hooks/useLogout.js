import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { LOGOUT_ROUTE } from "@/utils/constants";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(LOGOUT_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        dispatch({ type: "LOGOUT" });
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        setError("Logout failed. Please try again.");
        return { success: false, message: "Logout failed. Please try again." };
      }
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return { logout, loading, error };
};

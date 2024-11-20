import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { LOGIN_ROUTE } from "../utils/constants";
import axios from "axios";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (formData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                LOGIN_ROUTE,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                const user = response.data.userId;
                localStorage.setItem("user", user);
                dispatch({ type: "LOGIN", payload: user });
                setIsLoading(false);
                return { success: true };
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
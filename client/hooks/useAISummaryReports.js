import { generate } from "@syncfusion/ej2-react-schedule";
import { useState, useEffect } from "react";

const useAISummaryReports = (apiKey, endpoint, data) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAISummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { generateAISummary, loading, error };
};

export default useAISummaryReports;

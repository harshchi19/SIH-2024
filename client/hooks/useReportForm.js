import { useState } from "react";
import { useRouter } from "next/navigation";
import { initialFormData } from "@/utils/formInitialState";

export function useReportForm({ lang, role }) {
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formatFieldLabel = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleFormChange = (type, field, value, nestedField = null) => {
    return (prev) => {
      const updatedData = { ...prev };
      if (nestedField) {
        updatedData[type].findings[nestedField] = value;
      } else {
        updatedData[type][field] = value;
      }
      return updatedData;
    };
  };

  const handleReportTypeSelect = (type) => {
    setSelectedReportType(type);
    setIsTypeModalOpen(false);
  };

  const handleInputChange = (type, field, value, nestedField = null) => {
    setFormData(handleFormChange(type, field, value, nestedField));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call would go here
      console.log("Submitting report:", {
        type: selectedReportType,
        data: formData[selectedReportType],
      });
      router.push(`/${lang}/${role}/reports`);
    } catch (error) {
      console.error("Report submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isTypeModalOpen,
    setIsTypeModalOpen,
    selectedReportType,
    formData,
    isSubmitting,
    handleReportTypeSelect,
    handleInputChange,
    handleSubmit,
  };
}

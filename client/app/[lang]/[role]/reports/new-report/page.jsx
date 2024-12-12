"use client";

import { useParams, useRouter } from "next/navigation";
import { ReportTypeModal } from "@/components/reports/ReportTypeModal";
import { PreTherapyForm } from "@/components/reports/forms/PreTherapyForm";
import { SessionForm } from "@/components/reports/forms/SessionForm";
import { TreatmentPlanForm } from "@/components/reports/forms/TreatmentPlanForm";
import { ProgressReportForm } from "@/components/reports/forms/ProgressReportForm";
import { FormWrapper } from "@/components/reports/common/FormWrapper.jsx";
import { FormActions } from "@/components/reports/common/FormActions.jsx";
import { useReportForm } from "@/hooks/useReportForm.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddReportsPage() {
  const { lang, role } = useParams();
  const navigate = useRouter();
  const {
    isTypeModalOpen,
    setIsTypeModalOpen,
    selectedReportType,
    formData,
    isSubmitting,
    handleReportTypeSelect,
    handleInputChange,
    handleSubmit,
  } = useReportForm({ lang, role });
  const user = localStorage.getItem("user");

  const renderForm = () => {
    const props = {
      formData: formData[selectedReportType],
      studentTherapistId: user,
      handleInputChange,
    };

    switch (selectedReportType) {
      case "pre-therapy":
        return <PreTherapyForm {...props} />;
      case "session":
        return <SessionForm {...props} />;
      case "therapy-plan":
        return <TreatmentPlanForm {...props} />;
      case "progress-report":
        return <ProgressReportForm {...props} />;
      default:
        return null;
    }
  };
  const formatTitle = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <ReportTypeModal
        isOpen={isTypeModalOpen}
        onOpenChange={setIsTypeModalOpen}
        onSelect={handleReportTypeSelect}
      />

      {!isTypeModalOpen && selectedReportType && (
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>{formatTitle(selectedReportType)}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderForm()}
                <FormActions
                  onChangeType={() => setIsTypeModalOpen(true)}
                  onCancel={() => navigate.push(`/${lang}/${role}/reports`)}
                  isSubmitting={isSubmitting}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

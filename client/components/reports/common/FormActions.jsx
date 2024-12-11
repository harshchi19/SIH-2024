import { Button } from "@/components/ui/button";

export function FormActions({ onChangeType, onCancel, isSubmitting }) {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onChangeType}>
        Change Report Type
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
}

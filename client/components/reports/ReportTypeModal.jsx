import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reportTypes = [
  {
    value: "pre-therapy",
    label: "Pre-Therapy Report",
    description: "Initial assessment and background information",
  },
  {
    value: "session",
    label: "Session Report",
    description: "Detailed notes from a therapy session",
  },
  {
    value: "therapy-plan",
    label: "Therapy Plan",
    description: "Comprehensive treatment strategy",
  },
  {
    value: "progress-report",
    label: "Progress Report",
    description: "Evaluation of patient's therapeutic progress",
  },
];

export function ReportTypeModal({ isOpen, onOpenChange, onSelect }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Report Type</DialogTitle>
          <DialogDescription>
            Choose the type of report you want to create
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {reportTypes.map((type) => (
            <Card
              key={type.value}
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSelect(type.value)}
            >
              <CardHeader>
                <CardTitle>{type.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

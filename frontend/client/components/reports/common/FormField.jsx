import { Label } from "@/components/ui/label";

export function FormField({ children, label, id }) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

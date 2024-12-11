import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FormWrapper({ title, children, onSubmit }) {
  const formatTitle = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div className="container mx-auto p-6 overflow-y-scroll">
      <Card>
        <CardHeader>
          <CardTitle>{formatTitle(title)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

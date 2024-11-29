import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, User2 } from "lucide-react";

export function PersonalSection({ name, email, phone_no, age, role }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <p className="text-xl text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { icon: Mail, text: email, label: "Email" },
          { icon: Phone, text: phone_no, label: "Phone" },
          { icon: Calendar, text: `${age} years old`, label: "Age" },
        ].map(({ icon: Icon, text, label }, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border"
          >
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                {label}
              </h4>
              <div className="text-base font-medium">{text}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

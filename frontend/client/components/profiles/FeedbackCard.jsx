import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";

export function FeedbackCard({ feedback }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{feedback.supervisor}</h4>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(feedback.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{feedback.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">{feedback.comments}</p>

          <div className="flex flex-wrap gap-2">
            {feedback.areas.map((area, index) => (
              <Badge key={index} variant="outline">{area}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card } from "../ui/card";
import { Lightbulb } from "lucide-react";
const tips = [
  "Always include proper documentation for faster processing",
  "Submit referrals before noon for same-day review",
  "Follow up with pending referrals within 48 hours",
  "Complete your profile for better visibility",
  "Use the resources section for marketing materials",
];
export function QuickTips() {
  return (
    <Card className="p-4 md:p-5 shadow-card border-0 bg-card">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-warning" />
        <h3 className="font-semibold text-foreground text-sm md:text-base">
          Quick Tips
        </h3>
      </div>
      <ul className="space-y-1.5 md:space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground"
          >
            <span className="text-primary mt-0.5">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

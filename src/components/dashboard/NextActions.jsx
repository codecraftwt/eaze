import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
const actions = [
  {
    icon: CheckCircle2,
    text: "Referral Partner Training",
    color: "text-green-500",
    path: "/resources",
  },
  {
    icon: AlertCircle,
    text: "Access your reports",
    color: "text-amber-500",
    path: "/reports",
  },
  {
    icon: FileText,
    text: "Become an EAZE Affiliate",
    color: "text-blue-400",
    path: "/affiliate",
  },
];
export function NextActions({ onSubmitReferral, onContactSupport }) {
  return (
    <Card className="p-4 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">
          Help Desk
        </h3>
        <span className="text-muted-foreground">•••</span>
      </div>
      <div className="space-y-2 md:space-y-3 mb-4 md:mb-5">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <action.icon className={`h-4 w-4 flex-shrink-0 ${action.color}`} />
            <span className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
              {action.text}
            </span>
          </Link>
        ))}
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full rounded-full bg-card border-border text-xs md:text-sm h-9 md:h-10"
          onClick={onContactSupport}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Us
        </Button>
      </div>
    </Card>
  );
}

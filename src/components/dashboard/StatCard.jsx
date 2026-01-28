import { Card } from "../ui/card";
import { cn } from "../../lib/utils";
export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
}) {
  const cardVariants = {
    primary: "stat-card-primary text-white",
    success: "stat-card-success text-white",
    warning: "stat-card-warning text-white",
    info: "stat-card-info text-white",
    "light-blue": "stat-card-info text-white",
    default: "bg-card text-card-foreground border border-border",
  };
  const iconVariants = {
    primary: "bg-white/15 text-white",
    success: "bg-white/15 text-white",
    warning: "bg-white/15 text-white",
    info: "bg-white/15 text-white",
    "light-blue": "bg-white/15 text-white",
    default: "bg-primary/10 text-primary",
  };
  const titleVariants = {
    primary: "text-white/85",
    success: "text-white/85",
    warning: "text-white/85",
    info: "text-white/85",
    "light-blue": "text-white/85",
    default: "text-muted-foreground",
  };
  return (
    <Card
      className={cn(
        "p-3 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 border-0 rounded-xl md:rounded-2xl",
        cardVariants[variant],
        className,
      )}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div
          className={cn(
            "p-2 md:p-3 rounded-lg md:rounded-xl",
            iconVariants[variant],
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs md:text-sm font-medium truncate",
              titleVariants[variant],
            )}
          >
            {title}
          </p>
          <p className="text-lg md:text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

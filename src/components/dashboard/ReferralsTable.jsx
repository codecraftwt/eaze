import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { getMonthlyStats } from "../../lib/mockData";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getTotalApplications } from "../../store/slices/dashboardSlice";
import { isSameMonth } from "date-fns";
// Vibrant status colors with light backgrounds and colored text
export function getStatusStyles(status) {
  switch (status) {
    case "Submitted":
      return "bg-[#2D3A4F]/10 text-[#2D3A4F] border border-[#2D3A4F]/20 hover:bg-[#2D3A4F]/15"; // Deep Navy
    case "In Review":
      return "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 hover:bg-[#F59E0B]/15"; // Amber
    case "Approved":
      return "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/15"; // Emerald
    case "Funded":
      return "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/15"; // Emerald
    case "Disqualified":
      return "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/15"; // Red
    default:
      return "bg-muted text-muted-foreground border-0";
  }
}
export function ReferralsTable({ onViewAll, selectedDate }) {
  const [filter, setFilter] = useState("all");
  const stats = useMemo(
    () => getMonthlyStats(selectedDate || new Date()),
    [selectedDate],
  );
  const allApplications = stats.applications.map((app) => ({
    name: app.name,
    status: app.status,
    amount: `$${app.amount.toLocaleString()}`,
    program: app.program.charAt(0).toUpperCase() + app.program.slice(1),
  }));
  const filteredApplications = allApplications.filter((app) => {
    if (filter === "all") return true;
    if (filter === "submitted")
      return app.status === "Submitted" || app.status === "In Review";
    if (filter === "approved") return app.status === "Approved";
    if (filter === "funded") return app.status === "Funded";
    return true;
  });

  


  const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
  const {
    cashCollectedAllTime, totalApplications
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    } else {
      dispatch(getTotalApplications({ accountId: portalUserId, token: salesforceToken }));

    }
  }, [dispatch, salesforceToken, selectedDate]);

  const filteredApplicationsNew = useMemo(() => {
    if (!totalApplications) return [];
    return totalApplications.filter((app) => {
      const appDate = new Date(app.CreatedDate);
      return isSameMonth(appDate, selectedDate);
    });
  }, [totalApplications, selectedDate]);
  return (
    <Card className="p-3 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">
          My Applications
        </h3>
        {/* <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "all" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "submitted" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("submitted")}
          >
            Submitted
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "funded" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("funded")}
          >
            Funded
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "approved" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
        </div> */}
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-3 md:grid-cols-[2fr_1fr_1fr_1fr] gap-0 text-xs text-muted-foreground font-medium py-2 border-b border-border text-[#707a8f]">
          <span>Name</span>
          {/* <span>Status</span> */}
          <span className="hidden md:block">Program</span>
          <span className="text-right">Amount</span>
        </div>
        <ScrollArea className="h-[300px] md:h-[400px]">
          {filteredApplicationsNew.map((application, index) => (
            <div
              key={index}
              className="grid grid-cols-3 md:grid-cols-[2fr_1fr_1fr_1fr] gap-0 items-center py-1.5 md:py-2 hover:bg-muted/50 rounded-lg px-1 md:px-2 -mx-1 md:-mx-2 transition-colors cursor-pointer group"
            >
              <span className="font-medium text-foreground text-xs md:text-sm truncate font-thin">
                {application.Name}
              </span>
              {/* <Badge
                variant="custom"
                className={`${getStatusStyles(application.status)} text-xs w-fit`}
              >
                {application.status}
              </Badge> */}
              <span className="text-muted-foreground text-xs md:text-sm hidden md:block">
                {application.Loan_Program_Type__c}
              </span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-foreground text-xs md:text-sm">
                  ${application.Loan_Amount__c}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </Card>
  );
}

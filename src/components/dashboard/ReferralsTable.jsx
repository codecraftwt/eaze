import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { getMonthlyStats } from "../../lib/mockData";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getTotalApplications, getTotalApplicationsThisMonth } from "../../store/slices/dashboardSlice";
import { isSameMonth } from "date-fns";
import { getMonthAndYear } from "../../lib/dateUtils";
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
    case "Declined":
      return "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/15"; // Red
    case "Unknown":
      return "bg-[#64748b]/10 text-[#64748b] border border-[#64748b]/20 hover:bg-[#64748b]/15"; // Slate/Gray
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
  

  


  const dispatch = useDispatch();
   const { month, year } = getMonthAndYear(selectedDate)
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
  const {
    cashCollectedAllTime, totalApplications,totalApplicationsThisMonth
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    } else {
      dispatch(getTotalApplications({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
      dispatch(getTotalApplicationsThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));

    }
  }, [dispatch, salesforceToken, selectedDate]);


  useEffect(()=>{
    console.log(totalApplications,'totalApplications')
    console.log(totalApplications.length,'totalApplications')
    console.log(totalApplicationsThisMonth,'totalApplicationsThisMonth')
    console.log(totalApplicationsThisMonth.length,'totalApplicationsThisMonth')
  },[totalApplications])

  const filteredApplicationsNew = useMemo(() => {
    if (!totalApplications) return [];
    return totalApplications.filter((app) => {
      const appDate = new Date(app.CreatedDate);
      return isSameMonth(appDate, selectedDate);
    });
  }, [totalApplications, selectedDate]);


  const filteredApplications = totalApplicationsThisMonth.filter((app) => {
    if (filter === "all") return true;
    if (filter === "Submitted")
      return app.Lead_Partner_Status__c === "Submitted" || app.Lead_Partner_Status__c === "In Review";
    if (filter === "Approved") return app.Lead_Partner_Status__c === "Approved";
    if (filter === "Funded") return app.Lead_Partner_Status__c === "Funded";
    if (filter === "Declined") return app.Lead_Partner_Status__c === "Declined";
    return true;
  });

  //console.log(filteredApplicationsNew,'filteredApplicationsNew')
  return (
   <Card className="p-3 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
    <h3 className="font-semibold text-foreground text-sm md:text-base">
      My Applications
    </h3>
    <div className="flex flex-wrap gap-1">
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
            className={`text-xs px-2 md:px-3 ${filter === "Submitted" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("Submitted")}
          >
            Submitted
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "Funded" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("Funded")}
          >
            Funded
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "Approved" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("Approved")}
          >
            Approved
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 md:px-3 ${filter === "Declined" ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => setFilter("Declined")}
          >
            Declined
          </Button>
        </div>
  </div>

  <div className="space-y-1">
    {/* --- TABLE HEADER --- */}
    {/* Grid columns: 1.5fr (Name), 1fr (Program), 1fr (Status), 1fr (Cash), 1fr (Contact), 1fr (Amount) */}
    <div className="grid grid-cols-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 text-xs text-muted-foreground font-medium py-2 border-b border-border px-2">
      <span>Name</span>
      <span className="hidden md:block">Program</span>
      <span className="text-center md:text-left">Status</span>
      <span className="hidden md:block text-right">Cash Collected</span>
      <span className="hidden md:block text-right">Contact Info</span>
      <span className="text-right">Loan Amount</span>
    </div>

    <ScrollArea className="h-[300px] md:h-[400px]">
      {filteredApplications.map((application, index) => (
        <div
          key={application.Id || index}
          className="grid grid-cols-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 items-center py-3 hover:bg-muted/50 rounded-lg px-2 transition-colors cursor-pointer group"
        >
          {/* 1. Name */}
          <span className="font-medium text-foreground text-xs md:text-sm truncate">
            {application.Name}
          </span>

          {/* 2. Program (Hidden on mobile) */}
          <span className="text-muted-foreground text-xs md:text-sm hidden md:block truncate">
            {application.Loan_Program_Type__c || "N/A"}
          </span>

          {/* 3. Status */}
          {/* <span className="text-center md:text-left text-xs md:text-sm truncate bg-muted/30 px-2 py-1 rounded-full md:bg-transparent md:p-0">
            {application.Lead_Partner_Status__c}
          </span> */}
          <Badge
                variant="custom"
                className={`${getStatusStyles(application.Lead_Partner_Status__c)} text-xs w-fit`}
              >
                {application.Lead_Partner_Status__c}
              </Badge>

          {/* 4. Cash Collected (Hidden on mobile) */}
          <span className="text-right text-foreground text-xs md:text-sm font-medium hidden md:block">
            {application.Cash_Collected__c ? `$${Number(application.Cash_Collected__c).toLocaleString()}` : '--'}
          </span>

          {/* 5. Contact Info (Email/Mobile combined - Hidden on mobile) */}
          <div className="hidden md:flex flex-col text-right truncate">
            <span className="text-muted-foreground text-[11px] truncate">{application.Email}</span>
            <span className="text-muted-foreground text-[10px]">{application.MobilePhone}</span>
          </div>

          {/* 6. Loan Amount */}
          <div className="flex items-center justify-end gap-1">
            <span className="text-foreground font-bold text-xs md:text-sm text-right">
              ${application.Loan_Amount__c?.toLocaleString() || '0'}
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

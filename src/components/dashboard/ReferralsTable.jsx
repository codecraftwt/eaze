import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { getMonthlyStats } from "../../lib/mockData";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getTotalApplications, getTotalApplicationsThisMonth } from "../../store/slices/dashboardSlice";
import { isSameMonth } from "date-fns";
import { getMonthAndYear } from "../../lib/dateUtils";

const formatHeader = (key) => {
  if (key === "Name") return "Client Name";
  if (key === "Lead_Partner_Status__c") return "Status";
  return key
    .replace(/__c$/, "")
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
};
const formatValue = (key, value) => {
  if (value === null || value === undefined) return "--";
  if (typeof value === "number") {
    if (key.toLowerCase().includes("amount") || key.toLowerCase().includes("cash")) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }
  return String(value);
};

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
    cashCollectedAllTime, totalApplications, totalApplicationsThisMonth
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    } else {
      dispatch(getTotalApplications({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getTotalApplicationsThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));

    }
  }, [dispatch, salesforceToken, selectedDate]);


  useEffect(() => {
    // console.log(totalApplications,'totalApplications')
    // console.log(totalApplications.length,'totalApplications')
    // console.log(totalApplicationsThisMonth,'totalApplicationsThisMonth')
    // console.log(totalApplicationsThisMonth.length,'totalApplicationsThisMonth')
  }, [totalApplications])

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

  // console.log(filteredApplicationsNew,'filteredApplicationsNew')

  // 1. Get Dynamic Keys
  const dynamicColumns = useMemo(() => {
    if (!totalApplicationsThisMonth || totalApplicationsThisMonth.length === 0) return [];

    // Get all keys from the first object, excluding metadata
    // const excludedKeys = ["attributes","Id","Status"];
    // return Object.keys(totalApplicationsThisMonth[0]).filter(
    //   (key) => !excludedKeys.includes(key)
    // );

    const allKeys = Object.keys(totalApplicationsThisMonth[0]);
    const excludedKeys = ["attributes", "Id", "Name", "Status", "Lead_Partner_Status__c"];

    // Force specific order: Name first, Status second, then the rest
    return [
      "Name",
      "Lead_Partner_Status__c",
      ...allKeys.filter(key => !excludedKeys.includes(key))
    ];
  }, [totalApplicationsThisMonth]);

  const columnMinWidth = 220;
  const totalMinWidth = dynamicColumns.length * columnMinWidth;


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

      <div className="overflow-x-auto">
        <div className="min-w-[800px]"> {/* Ensures table doesn't collapse on small screens */}

          {/* --- DYNAMIC HEADER --- */}
          {/* <div 
            className="grid gap-4 text-xs text-muted-foreground font-medium py-2 border-b border-border px-2"
            style={{ gridTemplateColumns: `repeat(${dynamicColumns.length}, 1fr)` }}
          >
            {dynamicColumns.map((key) => (
              <span key={key}>{formatHeader(key)}</span>
            ))}
          </div> */}

          {/* --- DYNAMIC BODY --- */}
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div style={{ minWidth: `${totalMinWidth}px` }}>

              {/* --- HEADER --- */}
              <div
                className="grid items-center bg-muted/30 py-3 px-4 border-b border-border"
                style={{
                  gridTemplateColumns: `repeat(${dynamicColumns.length}, minmax(${columnMinWidth}px, 1fr))`
                }}
              >
                {dynamicColumns.map((key) => (
                  <span key={key} className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {formatHeader(key)}
                  </span>
                ))}
              </div>

              {/* --- BODY --- */}
              <div className="divide-y divide-border">
                {filteredApplications.map((app, rowIndex) => (
                  <div
                    key={app.Id || rowIndex}
                    className="grid items-center py-4 px-4 hover:bg-muted/50 transition-colors"
                    style={{
                      gridTemplateColumns: `repeat(${dynamicColumns.length}, minmax(${columnMinWidth}px, 1fr))`
                    }}
                  >
                    {dynamicColumns.map((key) => {
                      const val = app[key];

                      return (
                        <div key={key} className="pr-4">
                          {key === "Lead_Partner_Status__c" || key === "Status" ? (
                            <>
                              {/* <Badge variant="secondary" className="font-medium text-[10px]">
                          {val}
                        </Badge> */}
                              <Badge
                                variant="custom"
                                className={`${getStatusStyles(val)} text-xs w-fit`}
                              >
                                {val}
                              </Badge>
                            </>
                          ) : (
                            <span className="text-sm text-foreground truncate block">
                              {formatValue(key, val)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Adds the horizontal scrollbar at the bottom of the ScrollArea */}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}

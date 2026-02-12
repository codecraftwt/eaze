import { useEffect, useMemo } from "react";
// import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
// import { getMonthlyStats } from "@/lib/mockData";
import { Card } from "../ui/card";
import { getMonthlyStats } from "../../lib/mockData";
import { getMonthAndYear } from "../../lib/dateUtils";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getNewLead } from "../../store/slices/applicationSlice";
import { getApprovedThisMonth, getDeclinedThisMonth, getFundedData, getPreApprovedThisMonth } from "../../store/slices/dashboardSlice";
// EAZE Brand Colors - Executive-grade palette (muted tones)
// These colors are consistent with ReferralsTable status badges
const COLORS = {
  submitted: "#2D3A4F", // Deep Navy
  inReview: "#4A6178", // Steel Blue
  approved: "#5B9AA0", // Muted Teal
  funded: "#4A7C6F", // Muted Emerald (consistent with badges)
};
export function DealPipelineChart({ selectedDate }) {
  const stats = useMemo(
    () => getMonthlyStats(selectedDate || new Date()),
    [selectedDate],
  );
  const { month, year } =getMonthAndYear(selectedDate)
  const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
  const {
    totalApproved,
    loanByTypeThisMonth,
    loanByTypeAllTime,
    cashCollectedThisMonth,
    cashCollectedAllTime,
    totalApplications,
    fundedData,
    preApprovedApplicationsThisMonth,
    approvedApplicationsThisMonth,
    declinedApplicationsThisMonth
  } = useSelector((state) => state.dashboard);
  const {
    
newLeads

  } = useSelector((state) => state.application);
  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
      dispatch(getNewLead({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
      dispatch(getPreApprovedThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
      dispatch(getApprovedThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
      dispatch(getDeclinedThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
    }
  }, [dispatch, salesforceToken,selectedDate]);


  const { pipeline } = stats;
  const maxCount = newLeads.length + preApprovedApplicationsThisMonth.length+approvedApplicationsThisMonth.length+fundedData.length+declinedApplicationsThisMonth.length|| 0;

const pipelineStages = useMemo(() => {
  return [
    {
      name: "Submitted",
      count: newLeads.length,
      // count: newLeads.length,
      color: COLORS.submitted,
      width: "100%", // Always 100% since it's the maxCount
    },
    {
      name: "In Review",
      count: preApprovedApplicationsThisMonth.length,
      color: COLORS.inReview,
      width: `${Math.round((preApprovedApplicationsThisMonth.length / maxCount) * 100), 
    30}%`,
    },
    {
      name: "Declined",
      count: declinedApplicationsThisMonth.length,
      color: COLORS.inReview,
      width: `${Math.round((declinedApplicationsThisMonth.length / maxCount) * 100)}%`,
    },
    {
      name: "Approved",
      count: approvedApplicationsThisMonth.length,
      color: COLORS.approved,
      width: `${Math.max(
    Math.round((approvedApplicationsThisMonth.length / maxCount) * 100), 
    30
  )}%`,
    },
    {
      name: "Funded",
      count: fundedData.length,
      color: COLORS.funded,
      // width: `${Math.round((fundedData.length / maxCount) * 100)}%`,
      width: (() => {
    const actualPercentage = Math.round((fundedData.length / maxCount) * 100);
    // console.log(actualPercentage,'actualPercentage')
    // If 10% or below, return 30%, otherwise use the actual percentage
    return `${fundedData.length <= 10 ? 30 : actualPercentage}%`;
  })()
    },
  ];
}, [newLeads, preApprovedApplicationsThisMonth, approvedApplicationsThisMonth, fundedData, maxCount]);
  return (
    <Card className="p-4 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
      <h3 className="font-semibold text-foreground mb-4 md:mb-6 text-sm md:text-base">
        Deal Pipeline
      </h3>

      {/* Funnel Visualization */}
      <div className="space-y-2 md:space-y-3">
        {pipelineStages.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Stage Bar */}
              <div
                className="h-10 md:h-12 rounded-lg flex items-center justify-between px-3 md:px-4 transition-all duration-500"
                style={{
                  width: stage.width,
                  backgroundColor: stage.color,
                  minWidth: "100px",
                }}
              >
                <span className="text-white font-medium text-xs md:text-sm truncate">
                  {stage.name}
                </span>
                <span className="text-white font-bold text-sm md:text-lg ml-2">
                  {stage.count}
                </span>
              </div>

              {/* Arrow to next stage */}
              {index < pipelineStages.length - 1 && (
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0 hidden sm:block" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Conversion rates */}
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {pipelineStages.map((stage, index) => (
              <div
                key={stage.name}
                className="flex items-center gap-1 md:gap-1.5"
              >
                <div
                  className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

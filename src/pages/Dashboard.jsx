import { useState, useMemo, useEffect } from "react";
import { format, addMonths, subMonths, parseISO, isSameMonth } from "date-fns";
import {
  FileText,
  CheckCircle2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Percent,
} from "lucide-react";
// import { StatCard } from "@/components/dashboard/StatCard";
import { FundingProgramSelect } from "../components/dashboard/FundingProgramSelect";
import { DealPipelineChart } from "../components/dashboard/DealPipelineChart";
import { FundingVolumeChart } from "../components/dashboard/FundingVolumeChart";
import { FundingByProgramChart } from "../components/dashboard/FundingByProgramChart";
import { EarningsForecast } from "../components/dashboard/EarningsForecast";
import { ReferralsTable } from "../components/dashboard/ReferralsTable";
import { NextActions } from "../components/dashboard/NextActions";
import { Button } from "../components/ui/button";
import { getMonthlyStats } from "../lib/mockData";
import { StatCard } from "../components/dashboard/StatCard";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../store/slices/authSlice";
import { getCashCollectedAllTime, getFundedData, getTotalApplications, getTotalApproved } from "../store/slices/dashboardSlice";
export function Dashboard({ onNavigate, onNavigateToProgram }) {
  const [fundingProgram, setFundingProgram] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Get username from session storage
  const username = sessionStorage.getItem("partnerUsername") || "Partner";
  // Generate stats based on selected month using centralized data
  const monthlyStats = useMemo(
    () => getMonthlyStats(selectedDate),
    [selectedDate],
  );

  useEffect(() => {
    console.log(fundingProgram, 'fundingProgram')
  }, [fundingProgram])

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


  } = useSelector((state) => state.dashboard);
  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
      dispatch(getTotalApplications({ accountId: portalUserId, token: salesforceToken }));
      dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken }));
      dispatch(getCashCollectedAllTime({ accountId: portalUserId, token: salesforceToken }));
      // dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
    }
  }, [dispatch, salesforceToken]);

  // ... inside the component
  const filteredFundedData = useMemo(() => {
    if (!totalApplications) return []; // Or fundedData, whichever variable holds your JSON

    return fundedData.filter((item) => {
      // We use CreatedDate from your JSON structure
      const recordDate = parseISO(item.CreatedDate);

      // Checks if the month and year match the selectedDate in the UI
      return isSameMonth(recordDate, selectedDate);
    });
  }, [fundedData, selectedDate]);

  // To calculate the total funded amount for that month:
  const monthlyTotalFunded = useMemo(() => {
    return filteredFundedData.reduce((acc, curr) => acc + (curr.Loan_Amount__c || 0), 0);
  }, [filteredFundedData]);

  const filteredApplications = useMemo(() => {
    if (!totalApplications) return [];

    return totalApplications.filter((app) => {
      // Replace 'CreatedDate' with the actual date field name from your Salesforce object
      const appDate = parseISO(app.CreatedDate || app.Created_Date__c);
      return isSameMonth(appDate, selectedDate);
    });
  }, [totalApplications, selectedDate]);

  // You can then get the count
  const applicationsCount = filteredApplications.length;
  console.log(applicationsCount, 'applicationsCount')

  const filtercashCollectedAllTime = useMemo(() => {
    if (!totalApplications) return [];

    return cashCollectedAllTime.filter((app) => {
      // Replace 'CreatedDate' with the actual date field name from your Salesforce object
      const appDate = parseISO(app.CreatedDate || app.Created_Date__c);
      return isSameMonth(appDate, selectedDate);
    });
  }, [cashCollectedAllTime, selectedDate]);

  // You can then get the count
  const cashCollectedAllTimeConnt = filtercashCollectedAllTime.length;
  console.log(applicationsCount, 'applicationsCount')
const APPROVED_STATUSES = [
  "Funded - Invoice EAZE Client",
  "Approved By Lender-Funding In Progress",
  "EAZE Invoice Paid - File Closed"
];
const stats = useMemo(() => {
  if (!totalApplications || totalApplications.length === 0) {
    return { count: 0, approved: 0, rate: 0 };
  }

  // 1. Filter data by the selected month/year
  const monthlyData = totalApplications.filter((item) => {
    const recordDate = parseISO(item.CreatedDate);
    return isSameMonth(recordDate, selectedDate);
  });

  const totalCount = monthlyData.length;

  // 2. Filter the monthly data further by your approved status keys
  const approvedData = monthlyData.filter((item) => 
    APPROVED_STATUSES.includes(item.Status)
  );

  const approvedCount = approvedData.length;

  // 3. Calculate Rate: (Approved / Total) * 100
  const approvalRate = totalCount > 0 
    ? ((approvedCount / totalCount) * 100).toFixed(1) 
    : 0;

  return {
    totalCount,
    approvedCount,
    approvalRate
  };
}, [totalApplications, selectedDate]);

console.log(stats,'stats')


  return (
    <div className="p-4 md:p-6 animate-fade-in bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Partner Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome, {totalApproved[0]?.Account_Name__c}!
        </p>
      </div>

      {/* Monthly Funding Stats Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-base md:text-lg font-bold text-foreground">
          Monthly Funding Stats
        </h2>

        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9 bg-card border-border"
            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-card border border-border rounded-md">
            <CalendarIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <span className="text-xs md:text-sm font-medium">
              {format(selectedDate, "MMMM yyyy")}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9 bg-card border-border"
            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Row - Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Application This Month"
          value={applicationsCount}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Approved Loans"
          value={cashCollectedAllTimeConnt}
          // value={monthlyStats.approved + monthlyStats.funded}
          icon={CheckCircle2}
          variant="info"
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={Percent}
          variant="light-blue"
        />
        <StatCard
          title="Total Funded"
          value={`$${monthlyTotalFunded.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Charts Row - Deal Pipeline & Funding Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DealPipelineChart selectedDate={selectedDate} />
        <FundingVolumeChart selectedDate={selectedDate} />
      </div>

      {/* Funding by Program Chart + Earnings Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <FundingByProgramChart selectedDate={selectedDate} />
          <FundingProgramSelect
            value={fundingProgram}
            onChange={setFundingProgram}
            onNavigateToDetails={onNavigateToProgram}
          />
        </div>
        <EarningsForecast selectedDate={selectedDate} />
      </div>

      {/* Bottom Row - Table and Actions Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReferralsTable
            onViewAll={() => onNavigate("report")}
            selectedDate={selectedDate}
          />
        </div>
        <div className="space-y-4">
          <NextActions
            onSubmitReferral={() => onNavigate("submit")}
            onContactSupport={() => { }}
          />
        </div>
      </div>
    </div>
  );
}

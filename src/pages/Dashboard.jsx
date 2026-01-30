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
import { getApprovedThisMonth, getCashCollectedAllTime, getFundedData, getPreApprovedThisMonth, getTotalApplications, getTotalApplicationsThisMonth, getTotalApproved } from "../store/slices/dashboardSlice";
import { getMonthAndYear } from "../lib/dateUtils";
import { getNewLead } from "../store/slices/applicationSlice";
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
    console.log(selectedDate, 'selectedDate')

  }, [fundingProgram, selectedDate])

  const { month, year } = getMonthAndYear(selectedDate)
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
    totalApplicationsThisMonth

  } = useSelector((state) => state.dashboard);
  const {

    newLeads

  } = useSelector((state) => state.application);
  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getNewLead({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getTotalApplicationsThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getPreApprovedThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getApprovedThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
    }
  }, [dispatch, salesforceToken, selectedDate]);
  console.log(totalApplicationsThisMonth.length,'totalApplicationsThisMonth')
  const maxCount = newLeads.length + preApprovedApplicationsThisMonth.length + approvedApplicationsThisMonth.length + fundedData.length || 0;

  const totalCashCollected = useMemo(() => {
    return fundedData.reduce((acc, curr) => {
      return acc + (parseFloat(curr.Cash_Collected__c) || 0);
    }, 0);
  }, [fundedData]);



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
          value={totalApplicationsThisMonth.length}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Approved Loans"
          value={approvedApplicationsThisMonth.length}
          // value={monthlyStats.approved + monthlyStats.funded}
          icon={CheckCircle2}
          variant="info"
        />
        <StatCard
          title="Approval Rate"
          value={`${Math.round((approvedApplicationsThisMonth.length / totalApplicationsThisMonth.length) * 100)}%`}
          icon={Percent}
          variant="light-blue"
        />
        <StatCard
          title="Total Funded"
          value={'$' + totalCashCollected.toLocaleString()}
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

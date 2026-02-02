import { useEffect, useMemo } from "react";
// import { Card } from "/ui/card";
import { TrendingUp, Target, Trophy } from "lucide-react";
import { Progress } from "../ui/progress";
// import { getPerformanceData } from "@/lib/mockData";
import { Card } from "../ui/card";
import { getPerformanceData } from "../../lib/mockData";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getCashCollectedAllTime, getCashCollectedLastMonth, getCashCollectedThisMonth, getFundedData, getFundedLastMonthData } from "../../store/slices/dashboardSlice";
import { getMonthAndYear } from "../../lib/dateUtils";
export function EarningsForecast({ selectedDate }) {

   const dispatch = useDispatch();
    const { month, year } = getMonthAndYear(selectedDate)
    
    // 1. Get data from Redux
    const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
    const { cashCollectedThisMonth, cashCollectedLastMonth,cashCollectedAllTime,fundedData,fundedLastMonthData } = useSelector((state) => state.dashboard);
  
    // 2. Fetch data when token or date changes
    useEffect(() => {
      console.log(selectedDate,'selectedDate')
      if (!salesforceToken) {
        dispatch(getSalesforceToken());
      } else if (portalUserId) {
        const lastMonth = month === 1 ? 12 : month - 1;
    const lastYear = month === 1 ? year - 1 : year;
        dispatch(getCashCollectedThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
        dispatch(getCashCollectedLastMonth({ accountId: portalUserId, token: salesforceToken,month:lastMonth,year:lastYear }));
        dispatch(getCashCollectedAllTime({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));

        dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken ,month:month,year:year}));
              dispatch(getFundedLastMonthData({ accountId: portalUserId, token: salesforceToken ,month:lastMonth,year:lastYear}));
      }
    }, [dispatch, salesforceToken, portalUserId, selectedDate]);


  const data = useMemo(
    () => getPerformanceData(selectedDate || new Date(),fundedData,fundedLastMonthData,cashCollectedAllTime),
    [selectedDate,fundedData,fundedLastMonthData],
  );


  const { lastMonth, currentMonth } = data;
  const progressPercent = Math.min(
    Math.round((currentMonth.amount / currentMonth.target) * 100),
    100,
  );
  const remaining = currentMonth.target - currentMonth.amount;
  const isAhead = currentMonth.amount >= currentMonth.target;
  return (
    <Card className="p-4 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card h-full">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm md:text-base">
          Performance
        </h3>
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* Last Month - Target to Beat */}
        <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-secondary-50">
          <div className="flex items-center gap-2 md:gap-3">
            <Trophy className="h-4 w-4 md:h-5 md:w-5 text-warning" />
            <div>
              <p className="text-xs md:text-sm font-medium text-foreground">
                {lastMonth.month}
              </p>
              <p className="text-xs text-muted-foreground">Target to Beat</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-base md:text-lg font-bold text-foreground">
              ${lastMonth.amount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Current Month Progress */}
        <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-primary-10 border border-primary-20">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div>
              <p className="text-xs md:text-sm font-medium text-foreground">
                {currentMonth.month}
              </p>
              <p className="text-xs text-muted-foreground">Your Progress</p>
            </div>
            <div className="text-right">
              <p className="text-base md:text-lg font-bold text-primary">
                ${currentMonth.amount.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                of ${currentMonth.target.toLocaleString()}
              </p>
            </div>
          </div>

          <Progress value={progressPercent} className="h-1.5 md:h-2 mb-2" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {progressPercent}% complete
            </span>
            {isAhead ? (
              <span className="text-success font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                You beat last month!
              </span>
            ) : (
              <span className="text-muted-foreground">
                ${remaining.toLocaleString()} to go
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Keep pushing to beat your personal best!
        </p>
      </div>
    </Card>
  );
}

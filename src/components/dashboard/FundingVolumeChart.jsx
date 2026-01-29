import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getWeeklyFundingVolume } from "../../lib/mockData";
import { subMonths } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getFundedData, getFundedLastMonthData } from "../../store/slices/dashboardSlice";
import { getMonthAndYear } from "../../lib/dateUtils";
// EAZE Brand Colors
const COLORS = {
  thisMonth: "#2D3A4F", // Deep Navy
  lastMonth: "#CBD5E1", // Cool Grey
  cumulative: "#4A7C6F", // Subtle Emerald
};
const CustomTooltip = ({ active, payload, label, showComparison }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white border border-border rounded-xl shadow-lg p-4 min-w-[200px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">This Month:</span>
            <span className="font-medium" style={{ color: COLORS.thisMonth }}>
              ${(data.volume / 1000).toFixed(1)}K
            </span>
          </div>
          {showComparison && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Month:</span>
              <span className="font-medium" style={{ color: "#64748B" }}>
                ${(data.lastMonthVolume / 1000).toFixed(1)}K
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>Deals:</span>
            <span>{data.count} deals</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>Deals:</span>
            <span>{data.count} deals</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
export function FundingVolumeChart({ selectedDate }) {
  const [showComparison, setShowComparison] = useState(false);
  const currentDate = selectedDate || new Date();
  const lastMonthDate = subMonths(currentDate, 1);
  // Generate data based on selected month using centralized data


  const { month, year } = getMonthAndYear(selectedDate)
  // Calculate Last Month and Last Year
const lastMonth = month === 1 ? 12 : month - 1;
const lastYear = month === 1 ? year - 1 : year;

console.log(`Current: ${month}/${year}`);
console.log(`Last Month: ${lastMonth}/${lastYear}`);
   const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
  const {
    cashCollectedAllTime, fundedData,fundedLastMonthData
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    } else {
      dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken ,month:month,year:year}));
      dispatch(getFundedLastMonthData({ accountId: portalUserId, token: salesforceToken ,month:lastMonth,year:lastYear}));

    }
  }, [dispatch, salesforceToken, selectedDate]);

  useEffect(()=>{
    console.log(fundedData,'fundedData')
  },[fundedData,selectedDate])



  // Generate data based on selected month using centralized data
  const thisMonthData = useMemo(() => getWeeklyFundingVolume(currentDate,fundedData), [currentDate,selectedDate,fundedData]);
  const lastMonthData = useMemo(() => getWeeklyFundingVolume(lastMonthDate,fundedLastMonthData), [lastMonthDate,selectedDate,fundedLastMonthData]);
  
  // Combine this month and last month data
  
  // Combine this month and last month data
  const monthData = thisMonthData.map((week, i) => ({
    ...week,
    volume: week.thisMonth,
    lastMonthVolume: lastMonthData[i]?.thisMonth || 0,
    count: Math.round(week.thisMonth / 15000),
  }));
  const formatYAxisLeft = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  console.log(monthData,'monthData')
  return (
    <Card className="p-4 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">
          Funding Volume
        </h3>
        <div className="flex items-center gap-2">
          {/* Comparison Toggle */}
          <Button
            variant={showComparison ? "default" : "outline"}
            size="sm"
            className={`h-7 px-2 md:px-3 text-xs transition-colors ${
    showComparison ? "text-white" : "text-muted-foreground"
  }`}
            onClick={() => setShowComparison(!showComparison)}
          >
            vs Last Month
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 md:gap-4 mb-2 text-[10px] md:text-xs flex-wrap">
        <div className="flex items-center gap-1 md:gap-1.5">
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded-sm"
            style={{ backgroundColor: COLORS.thisMonth }}
          />
          <span className="text-muted-foreground">This Month</span>
        </div>
        {showComparison && (
          <div className="flex items-center gap-1 md:gap-1.5">
            <div
              className="w-2 h-2 md:w-3 md:h-3 rounded-sm"
              style={{ backgroundColor: COLORS.lastMonth }}
            />
            <span className="text-muted-foreground">Last Month</span>
          </div>
        )}
      </div>

      <div className="h-[280px] md:h-[320px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthData}
            barCategoryGap="15%"
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 10 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 9 }}
              tickFormatter={formatYAxisLeft}
              domain={[0, 1000000]}
              ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
              interval={0}
              width={50}
            />
            <Tooltip
              content={<CustomTooltip showComparison={showComparison} />}
              cursor={{ fill: "rgba(45, 58, 79, 0.08)" }}
            />

            {/* Last Month Bars (if comparison enabled) */}
            {showComparison && (
              <Bar
                yAxisId="left"
                dataKey="lastMonthVolume"
                fill={COLORS.lastMonth}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            )}

            {/* This Month Bars */}
            <Bar
              yAxisId="left"
              dataKey="volume"
              fill={COLORS.thisMonth}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

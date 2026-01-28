import { useEffect, useMemo } from "react";
import { Card } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { getFundingByProgram } from "../../lib/mockData";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../../store/slices/authSlice";
import { getCashCollectedAllTime } from "../../store/slices/dashboardSlice";
import { isSameMonth } from "date-fns";
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground">{label}</p>
        <p
          className="text-sm font-medium"
          style={{ color: payload[0]?.payload?.fill }}
        >
          ${payload[0].value.toLocaleString()} Funded
        </p>
      </div>
    );
  }
  return null;
};
export function FundingByProgramChart({ selectedDate }) {
  const programFundingData = useMemo(
    () => getFundingByProgram(selectedDate || new Date()),
    [selectedDate],
  );
  

  const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
  const {
   cashCollectedAllTime
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      dispatch(getCashCollectedAllTime({ accountId: portalUserId, token: salesforceToken }));
     
    }
  }, [dispatch, salesforceToken, selectedDate]);


  const chartData = useMemo(() => {
  // 1. Initialize temporary counters
  const totals= {
    "Eaze Cap": 0,
    "Platinum": 0,
    "Diamond": 0,
    "Elite": 0,
  };

  // 2. Loop through API data and filter by selectedDate
  if (cashCollectedAllTime && Array.isArray(cashCollectedAllTime)) {
    cashCollectedAllTime.forEach((app) => {
      const appDate = new Date(app.CreatedDate);
      
      if (isSameMonth(appDate, selectedDate)) {
        const program = app.Loan_Program_Type__c; // e.g., "Eaze Cap"
        if (program && typeof totals[program] !== 'undefined') {
          totals[program] += Number(app.Loan_Amount__c || 0);
        }
      }
    });
  }

  // 3. Map the totals into your specific array format
  return [
    {
      name: "EazeCap",
      value: totals["Eaze Cap"],
      fill: "hsl(220, 45%, 25%)",
    },
    {
      name: "Platinum",
      value: totals["Platinum"],
      fill: "hsl(215, 35%, 45%)",
    },
    {
      name: "Diamond",
      value: totals["Diamond"],
      fill: "hsl(158, 40%, 38%)",
    },
    {
      name: "Elite",
      value: totals["Elite"],
      fill: "hsl(40, 45%, 45%)",
    },
  ];
}, [cashCollectedAllTime, selectedDate]);

 const total = chartData.reduce((sum, p) => sum + p.value, 0);
  return (
    <Card className="p-4 md:p-5 shadow-sm border border-border rounded-xl md:rounded-2xl bg-card">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm md:text-lg">
            Funding by Program
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Total: ${total.toLocaleString()} funded
          </p>
        </div>
      </div>

      <div className="h-[200px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="20%"
            margin={{ left: 0, right: 5, top: 5 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 10 }}
              tickFormatter={(value) => {
                if (value >= 1000000)
                  return `$${(value / 1000000).toFixed(0)}M`;
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                return `$${value}`;
              }}
              domain={[0, 1000000]}
              ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
              interval={0}
              width={50}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(45, 58, 79, 0.08)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {programFundingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

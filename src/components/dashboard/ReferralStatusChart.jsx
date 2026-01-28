import { Card } from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
// EAZE Brand Colors - Consistent with ReferralsTable and DealPipelineChart
const COLORS = {
  submitted: "#2D3A4F", // Deep Navy
  inReview: "#4A6178", // Steel Blue
  approved: "#5B9AA0", // Muted Teal
  funded: "#4A7C6F", // Muted Emerald
  disqualified: "#8B5A5A", // Muted Red
};
const data = [
  { name: "Submitted", value: 26, color: COLORS.submitted },
  { name: "In Review", value: 16, color: COLORS.inReview },
  { name: "Approved", value: 36, color: COLORS.approved },
  { name: "Funded", value: 25, color: COLORS.funded },
  { name: "Disqualified", value: 20, color: COLORS.disqualified },
];
export function ReferralStatusChart({ selectedDate }) {
  return (
    <Card className="p-5 shadow-sm border border-border rounded-2xl bg-card">
      <h3 className="font-semibold text-foreground mb-4">Referral Status</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

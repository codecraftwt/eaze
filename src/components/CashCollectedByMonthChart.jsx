import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

const ALL_LOAN_TYPES = ["Elite", "Diamond", "Eaze Cap","GA"];

export default function CashCollectedByMonthChart({ leads }) {
  const { months, loanTypes, data } = React.useMemo(() => {
    const result = {};
    const loanTypesSet = new Set(ALL_LOAN_TYPES);

    leads.forEach((lead) => {
      const date = new Date(lead.CreatedDate);
      const monthKey = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const loanType = lead.Loan_Program_Type__c || "Unknown";

      const cash = Number(
        String(lead.Cash_Collected__c || 0).replace(/,/g, "")
      );

      if (!result[monthKey]) {
        result[monthKey] = {};
        // initialize all loan types to 0 for the month
        ALL_LOAN_TYPES.forEach((type) => {
          result[monthKey][type] = 0;
        });
      }

      result[monthKey][loanType] += cash;
    });

    const sortedMonths = Object.keys(result).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      months: sortedMonths,
      loanTypes: Array.from(loanTypesSet),
      data: result,
    };
  }, [leads]);

  console.log(loanTypes,'loanTypes')
  const series = loanTypes.map((loanType) => ({
    label: loanType,
    data: months.map((month) => data[month][loanType]),
  }));

  console.log(series,'series')

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <Typography variant="h6" gutterBottom>
        Cash Collected by Month (Loan Type)
      </Typography>

      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: months,
          },
        ]}
        series={series}
        height={420}
      />
    </Box>
  );
}

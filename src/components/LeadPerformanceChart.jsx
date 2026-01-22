import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography, Box } from '@mui/material';

const LeadPerformanceChart = ({ data }) => {
  // 1. Prepare Month Names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 2. Initialize the aggregated data for all 12 months
  const monthlyStats = monthNames.map((month) => ({
    month,
    loanAmount: 0,
    cashCollected: 0,
  }));

  const currentYear = new Date().getFullYear();

  // 3. Process the raw data
  data.forEach((item) => {
    const createdDate = new Date(item.CreatedDate);
    
    // Filter to only include items from the current year
    if (createdDate.getFullYear() === currentYear) {
      const monthIndex = createdDate.getMonth(); // 0-11
      
      monthlyStats[monthIndex].loanAmount += item.Loan_Amount__c || 0;
      monthlyStats[monthIndex].cashCollected += parseFloat(item.Cash_Collected__c || 0);
    }
  });

  // Optional: Filter out months with zero data if you only want to show months with activity
  // const chartData = monthlyStats.filter(m => m.loanAmount > 0 || m.cashCollected > 0);
  const chartData = monthlyStats; 

  return (
    <Paper className='mt-3' sx={{ p: 2, width: '100%', borderRadius: 2 }} elevation={0} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Monthly Performance ({currentYear})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total Loan Amount vs. Total Cash Collected
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <BarChart
          dataset={chartData}
          xAxis={[{ 
            scaleType: 'band', 
            dataKey: 'month',
            label: 'Months' 
          }]}
          series={[
            { dataKey: 'loanAmount', label: 'Loan Amount ($)', color: '#1976d2' },
            { dataKey: 'cashCollected', label: 'Cash Collected ($)', color: '#2e7d32' },
          ]}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'middle' },
              padding: -5,
            },
          }}
          margin={{ top: 70, bottom: 50, left: 70, right: 20 }}
        />
      </Box>
    </Paper>
  );
};

export default LeadPerformanceChart;
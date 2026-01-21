import React, { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography, Box, Link } from '@mui/material';

const FundedByProgramChart = ({ fundedData }) => {
  const chartData = useMemo(() => {
    if (!fundedData || !Array.isArray(fundedData)) return [];
    
    const counts = fundedData.reduce((acc, item) => {
      const type = item.Loan_Program_Type__c || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      program: key,
      count: counts[key],
    }));
  }, [fundedData]);

  return (
    <Paper className='mt-3' sx={{ p: 2, width: '100%', borderRadius: 2 }} elevation={0} variant="outlined">
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }}>
        Lead 2026 Funded All By Program Type
      </Typography>
      
      <Box sx={{ width: '100%', height: 350 }}>
        <BarChart
          dataset={chartData}
          layout="horizontal"
          // REDUCED LEFT MARGIN: From 150 to 90/100 to remove extra space
          margin={{ left: 0, right: 30, top: 10, bottom: 40 }}
          yAxis={[{ 
            scaleType: 'band', 
            dataKey: 'program',
            // Removes truncation dots and ensures full name shows
            width: 70,
          }]}
          xAxis={[{ 
            label: 'Record Count',
            tickMinStep: 1, 
          }]}
          series={[
            { 
              dataKey: 'count', 
              color: '#00a3ff', 
              label: 'Record Count',
            }
          ]}
          slotProps={{
            legend: { hidden: true }
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
        <Link 
          href="#" 
          underline="hover" 
          sx={{ fontSize: '0.75rem', color: '#0070d2', fontWeight: 500 }}
        >
          View Report (Lead 2026 Funded All By Program Type)
        </Link>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          As of Jan 21, 2026
        </Typography>
      </Box>
    </Paper>
  );
};

export default FundedByProgramChart;
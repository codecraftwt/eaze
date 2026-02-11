import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Select, MenuItem, FormControl, InputLabel,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Grid, Divider
} from '@mui/material';
import * as XLSX from 'xlsx';
import { getSalesforceToken } from '../store/slices/authSlice';
import { getFundedData, getFundedData2, getFundedDataThisYear, getTotalApproved } from '../store/slices/dashboardSlice';
import { getMonthAndYear } from '../lib/dateUtils';

const ReportTab = () => {
  const { fundedData2 } = useSelector((state) => state.dashboard);
  const {
    totalApproved,
    loanByTypeThisMonth,
    loanByTypeAllTime,
    cashCollectedThisMonth,
    cashCollectedAllTime,
    fundedData,
    fundedDataThisYear
  } = useSelector((state) => state.dashboard);
  const [statusFilter, setStatusFilter] = useState('Funded');
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  // console.log(selectedDate,'selectedDate')
  const { month, year } = getMonthAndYear(selectedDate)
  // console.log(month,'month')
  // console.log(year,'year')

  // 2. Calculation Helper Function
  const calculateMetrics = (data) => {
    let cash = 0;
    let loan = 0;
    const breakdown = {};

    data.forEach(item => {
      const c = parseFloat(item.Cash_Collected__c) || 0;
      const l = parseFloat(item.Loan_Amount__c) || 0;
      const type = item.Loan_Program_Type__c || 'Unknown';

      cash += c;
      loan += l;
      if (!breakdown[type]) breakdown[type] = { cash: 0, loan: 0 };
      breakdown[type].cash += c;
      breakdown[type].loan += l;
    });

    return { count: data.length, cash, loan, breakdown };
  };



  const yearlyMetrics = useMemo(() => {
    // Filter data specifically for the year 2026 only
    const yearData = fundedDataThisYear.filter(item => {
      const d = new Date(item.CreatedDate);
      return d.getFullYear() === 2026;
    });
    return calculateMetrics(yearData);
  }, [fundedData2, fundedDataThisYear]);

  // 4. Dynamic Columns
  const columns = useMemo(() => {
    if (fundedData2.length === 0) return [];
    return Object.keys(fundedData2[0]).filter(key => key !== 'Id' && key !== 'attributes');
  }, [fundedData2]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funded Report");
    XLSX.writeFile(workbook, "Funded_Report_2026.xlsx");
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      //console.log('hiiiiii')
      dispatch(getFundedData2({ accountId: portalUserId, token: salesforceToken }));
      dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
      dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
      dispatch(getFundedDataThisYear({ accountId: portalUserId, token: salesforceToken }));
    }
  }, [dispatch, salesforceToken]);

  useEffect(() => {
    // console.log(fundedData2,'fundedData2')
    // console.log(fundedData,'fundedData')
    // console.log(fundedDataThisYear,'fundedDataThisYear')
  }, [fundedData2, fundedData, fundedDataThisYear])

  // 1. Filtering Logic for Table & Top Tiles (Filtered View)
  const filteredData = useMemo(() => {
    return fundedDataThisYear.filter((item) => {
      const matchesStatus = statusFilter === 'All' ||
        (item.Status && item.Status.toLowerCase().includes('funded'));

      const itemDate = item.CreatedDate ? new Date(item.CreatedDate) : null;
      const matchesMonth = monthFilter === '' ||
        (itemDate && itemDate.getMonth() === parseInt(monthFilter));

      return matchesStatus && matchesMonth;
    });
  }, [fundedData2, statusFilter, monthFilter, fundedDataThisYear]);

  // 3. Generate Metrics for both Sections
  const filteredMetrics = useMemo(() => calculateMetrics(fundedData), [fundedData]);

  // Reusable Tile Component
  const MetricTiles = ({ title, data, colorScheme }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#546e7a' }}>{title}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${colorScheme.app}` }}>
            <Typography variant="overline" color="textSecondary">Applications</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{data.count}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${colorScheme.cash}` }}>
            <Typography variant="overline" color="textSecondary">Cash Collected</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${data.cash.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${colorScheme.loan}` }}>
            <Typography variant="overline" color="textSecondary">Loan Amount</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${data.loan.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 1.5, height: '100%', bgcolor: '#f8fafc' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, textAlign: 'center' }}>Breakdown (Cash | Loan)</Typography>
            <Box sx={{ maxHeight: 60, overflowY: 'auto' }}>
              {Object.entries(data.breakdown).map(([type, vals]) => (
                <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{type}</Typography>
                  <Typography sx={{ fontSize: '0.65rem' }}>${vals.cash.toLocaleString()} | ${vals.loan.toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }} className="bg-gray-100 min-h-screen p-6">
      <header className="bg-white p-4 shadow rounded-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Funded</h1>
          <p className="text-sm text-gray-500 ">
            {totalApproved[0]?.Account_Name__c}
          </p>
        </div>
      </header>
      {/* SECTION 1: SELECTED VIEW (FILTERED) */}
      <MetricTiles
        title={month === '' ? "Current View (All Months)" : `Current View (${months[month - 1]})`}
        data={filteredMetrics}
        colorScheme={{ app: '#48bb78', cash: '#00a3ff', loan: '#f56565' }}
      />

      <Divider sx={{ my: 4 }} />

      {/* SECTION 2: THIS YEAR (TOTAL 2026) */}
      <MetricTiles
        title="Performance: This Year (2026)"
        data={yearlyMetrics}
        colorScheme={{ app: '#81c784', cash: '#4fc3f7', loan: '#e57373' }}
      />

      {/* FILTERS & TABLE */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', }}>
        <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Funded">Funded</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
          <InputLabel>Month</InputLabel>
          <Select value={monthFilter} label="Month" onChange={(e) => setMonthFilter(e.target.value)}>
            <MenuItem value="">All Months</MenuItem>
            {months.map((m, index) => <MenuItem key={m} value={index}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" color="success" onClick={downloadExcel} sx={{ ml: 'auto' }}>Download Excel</Button>
      </Paper>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{
                  fontWeight: 'bold', bgcolor: '#eceff1', whiteSpace: 'nowrap',
                  minWidth: '150px'
                }}>{col.replace('__c', '').replace(/_/g, ' ')}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((col) => <TableCell key={col}>{row[col]?.toString() || '-'}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTab;
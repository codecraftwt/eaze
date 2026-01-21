import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Paper, Select, MenuItem, FormControl, InputLabel, 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Grid 
} from '@mui/material';
import * as XLSX from 'xlsx';
import { getSalesforceToken } from '../store/slices/authSlice';
import { getFundedData } from '../store/slices/dashboardSlice';

const ReportTab = () => {
  const { fundedData } = useSelector((state) => state.dashboard);
  const [statusFilter, setStatusFilter] = useState('Funded');
  const [monthFilter, setMonthFilter] = useState('');

  // 1. Filtering Logic
  const filteredData = useMemo(() => {
    return fundedData.filter((item) => {
      const matchesStatus = statusFilter === 'All' || 
        (item.Status && item.Status.toLowerCase().includes('funded'));
      
      const itemDate = item.CreatedDate ? new Date(item.CreatedDate) : null;
      const matchesMonth = monthFilter === '' || 
        (itemDate && itemDate.getMonth() === parseInt(monthFilter));
      
      return matchesStatus && matchesMonth;
    });
  }, [fundedData, statusFilter, monthFilter]);

  // 2. Metrics Calculations for Cards
  const metrics = useMemo(() => {
    const totalApplications = filteredData.length;
    
    // Sum Cash_Collected__c (Converting string to float)
    const totalCash = filteredData.reduce((acc, item) => {
      const val = parseFloat(item.Cash_Collected__c) || 0;
      return acc + val;
    }, 0);

    // Group Cash Collected by Program Type
    const cashByProgram = filteredData.reduce((acc, item) => {
      const type = item.Loan_Program_Type__c || 'Unknown';
      const val = parseFloat(item.Cash_Collected__c) || 0;
      acc[type] = (acc[type] || 0) + val;
      return acc;
    }, {});

    return { totalApplications, totalCash, cashByProgram };
  }, [filteredData]);

  // 3. Dynamic Columns
  const columns = useMemo(() => {
    if (filteredData.length === 0) return [];
    return Object.keys(filteredData[0]).filter(key => key !== 'Id' && key !== 'attributes');
  }, [filteredData]);

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
        dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken }));
      }
    }, [dispatch, salesforceToken]);

  return (
    <Box sx={{ p: 3 }} className="bg-gray-100 min-h-screen p-6">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Funded Report Dashboard</Typography>

      {/* --- DASHBOARD CARDS SECTION --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Funded (Cash Collected) */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f0f9ff', borderLeft: '5px solid #00a3ff' }}>
            <Typography variant="overline" color="textSecondary">Total Cash Collected</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0070d2' }}>
              ${metrics.totalCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Applications */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f0fff4', borderLeft: '5px solid #48bb78' }}>
            <Typography variant="overline" color="textSecondary">Total Applications</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2f855a' }}>
              {metrics.totalApplications}
            </Typography>
          </Paper>
        </Grid>

        {/* Cash by Program (Small Scrollable List) */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%', maxHeight: 120, overflowY: 'auto', bgcolor: '#fffaf0', borderLeft: '5px solid #ed8936' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>By Program Type</Typography>
            {Object.entries(metrics.cashByProgram).map(([type, total]) => (
              <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{type}:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>${total.toLocaleString()}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* --- FILTERS SECTION --- */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Funded">Funded</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Month (2026)</InputLabel>
          <Select value={monthFilter} label="Month (2026)" onChange={(e) => setMonthFilter(e.target.value)}>
            <MenuItem value="">All Months</MenuItem>
            {months.map((m, index) => (
              <MenuItem key={m} value={index}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="success" onClick={downloadExcel} sx={{ ml: { md: 'auto' } }}>
          Download Excel
        </Button>
      </Paper>

      {/* --- DATA TABLE --- */}
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>
                  {col.replace('__c', '').replace(/_/g, ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col]?.toString() || '-'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTab;
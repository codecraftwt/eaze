import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Paper, Grid, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { motion } from 'framer-motion';

const PopupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Sample data for each section
  const totalApprovedData = [
    { category: "Total Approved", amount: 2455015.00, percentage: 5.33, quantity: 138 },
  ];

  const totalPreApprovedData = [
    { category: "Client has accepted terms", amount: 56000.00, percentage: 0.19, quantity: 5 },
    { category: "Pre-Approved Pending Income Verification", amount: 25000.00, percentage: 0.08, quantity: 2 },
    { category: "All Docs In - Pending Final Underwriting Decision", amount: 12000.00, percentage: 0.04, quantity: 1 },
  ];

  const totalDeclinesData = [
    { category: "Declined - Client Does Not Meet Minimum Credit Requirements", amount: 51506248.00, percentage: 77.81, quantity: 1209 },
    { category: "Declined - Client Did Not Pass Pre-qualifying Questions", amount: 44725530.00, percentage: 46.73, quantity: 580 },
    { category: "Declined - Client Does Not Meet Minimum 35K Annual Income Requirements", amount: 5024720.00, percentage: 5.45, quantity: 141 },
  ];

  // Helper function to calculate totals
  const calculateTotal = (data, field) => data.reduce((acc, item) => acc + item[field], 0);

  // Combined Total for all sections
  const combinedQuantity = 
    calculateTotal(totalApprovedData, 'quantity') + 
    calculateTotal(totalPreApprovedData, 'quantity') + 
    calculateTotal(totalDeclinesData, 'quantity');

  const combinedAmount = 
    calculateTotal(totalApprovedData, 'amount') + 
    calculateTotal(totalPreApprovedData, 'amount') + 
    calculateTotal(totalDeclinesData, 'amount');

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      {/* Modal Header */}
      <DialogTitle>Total Applications</DialogTitle>

      {/* Modal Body with Combined Totals at the Top */}
      <DialogContent>
        {/* Combined Totals Displayed at the Top with 50% Width */}
        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper className="p-4" style={{ backgroundColor: '#4CAF50', color: 'white', textAlign: 'center' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total Quantity</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>{combinedQuantity}</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper className="p-4" style={{ backgroundColor: '#2196F3', color: 'white', textAlign: 'center' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total Amount</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>${combinedAmount.toLocaleString()}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Table for Total Approved */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold text-green-600">Total Approved</h4>
          <TableContainer component={Paper} className="mb-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Quantity</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Amount</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalApprovedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">${row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        {/* Table for Total Pre-approved */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h4 className="text-lg font-semibold text-yellow-600">Total Pre-approved</h4>
          <TableContainer component={Paper} className="mb-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Quantity</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Amount</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalPreApprovedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">${row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        {/* Table for Total Declines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h4 className="text-lg font-semibold text-red-600">Total Declines</h4>
          <TableContainer component={Paper} className="mb-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Quantity</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Amount</TableCell>
                  <TableCell align="right" style={{ width: '25%' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalDeclinesData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">${row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </DialogContent>

      {/* Modal Footer with Close Button */}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupModal;

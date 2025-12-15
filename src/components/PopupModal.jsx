import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from '@mui/material';
import { motion } from 'framer-motion';

export function GroupedLeadStatuses({ groupedData, isActive }) {
  const categoryRefs = {}; // Object to hold refs for each category
  const globalRef = useRef();

  // Function to get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'approved':
        return '#4CAF50'; // Green
      case 'preApproved':
        return '#FFEB3B'; // Yellow
      case 'declined':
        return '#F44336'; // Red
      case 'closedLost':
        return '#FF9800'; // Orange
      case 'gloable': // Global color
        return '#B0BEC5'; // Grey for Global (change as needed)
      default:
        return '#FFFFFF'; // White (default color)
    }
  };

  // Function to handle table style, applying blue border for the active category
  const getTableStyle = (category) => {
    if(category=='gloable') return {};
    return isActive === category 
      ? { border: '3px solid #2196F3', borderRadius: '4px', padding: '5px' }
      : {}; // Return empty object for inactive categories (no border change)
  };

  // Scroll to the active category when isActive changes
  useEffect(() => {
    if (isActive && categoryRefs[isActive]) {
      categoryRefs[isActive].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isActive]);

  return (
    <div>
      {/* Global Summary */}
      {isActive === 'gloable' && (
        <div
          ref={globalRef}
          style={isActive === 'gloable' ? { border: '3px solid #2196F3', borderRadius: '4px', padding: '5px', marginBottom: '20px' } : {}}
        >
          <Typography variant="h6" sx={{ mt: 3 }}>
            Global Summary
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3, mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{ paddingRight: '55px' }}>
                    Total Count
                  </TableCell>
                  <TableCell align="left" style={{ width: '28%' }}>
                    Total Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right" style={{ paddingRight: '80px' }}>
                    {groupedData.gloable?.gloableCount}
                  </TableCell>
                  <TableCell align="left" style={{ width: '28%' }}>
                    ${ (groupedData.gloable?.gloableAmount || 0).toLocaleString() }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Only render the table of the active category */}
      {(isActive && groupedData[isActive]) || isActive === 'gloable' ? (
        <div
          style={{ marginBottom: '40px', ...getTableStyle(isActive) }}
          ref={categoryRefs[isActive]} // Set ref here
        >
          {/* Global Table for 'gloable' */}
          {isActive !== 'gloable' && (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 1 }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: getCategoryColor(isActive),
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                {isActive.charAt(0).toUpperCase() + isActive.slice(1)}
              </Typography>

              {/* HEADER TABLE */}
              <TableContainer
                component={Paper}
                sx={{ mb: 2 }}
                style={{ backgroundColor: getCategoryColor(isActive) }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ width: '54%' }}>
                        Status
                      </TableCell>
                      <TableCell align="center">Count</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">%</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>{groupedData[isActive].header?.status}</TableCell>
                      <TableCell align="center">{groupedData[isActive].header?.chaildCount}</TableCell>
                      <TableCell align="right">
                        ${ (groupedData[isActive].header?.chaildAmount || 0).toLocaleString() }
                      </TableCell>
                      <TableCell align="right">
                        {groupedData[isActive].header?.chailPersent?.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* BODY TABLE */}
              <TableContainer
                component={Paper}
                style={{ backgroundColor: getCategoryColor(isActive) }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ width: '54%' }}>
                        Status
                      </TableCell>
                      <TableCell align="center">Count</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Percent</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {groupedData[isActive].body?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row?.status}</TableCell>
                        <TableCell align="center">{row?.count}</TableCell>
                        <TableCell align="right">${row?.amount.toLocaleString()}</TableCell>
                        <TableCell align="right">{row?.percent?.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

const PopupModal = ({ isOpen, onClose, groupedData, isActive }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Total Applications</DialogTitle>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GroupedLeadStatuses groupedData={groupedData} isActive={isActive} />
        </motion.div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupModal;

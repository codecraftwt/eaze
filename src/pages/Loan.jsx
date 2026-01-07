import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalApplicationsThisMonth, getTotalApplications, getApprovedThisMonth, getTotalApproved, getDeclinedThisMonth, getTotalDeclined, getPreApprovedThisMonth, getTotalPreApproved, getTotalDeclinePercent, getTopDeclineReason, getLoanByTypeThisMonth, getLoanByTypeAllTime, getCashCollectedThisMonth, getCashCollectedAllTime } from '../store/slices/dashboardSlice'; 
import { getSalesforceToken } from '../store/slices/authSlice'; 
import { BarChart } from '@mui/x-charts/BarChart';
import CashCollectedByMonthChart from '../components/CashCollectedByMonthChart';

// MUI Imports
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function valueFormatter(value) {
    return `${value}mm`;
}

const MonthlySummaryChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
            {declinedPreQualifierChartData?.months.length > 0 ||
                declinedPreQualifierChartData?.totalLeads.length > 0 ||
                declinedPreQualifierChartData?.newLeads.length > 0 ? (
                <BarChart
                    xAxis={[{ data: declinedPreQualifierChartData.months }]} 
                    series={[
                        { data: declinedPreQualifierChartData.totalLeads, label: 'Total', id: 'pvId' }, 
                        { data: declinedPreQualifierChartData.newLeads, label: 'Declined', id: 'uvId' },   
                    ]}
                    height={300}
                />
            ) : (
                <div>No data available</div> 
            )}
        </div>
    );
};

function Loan() {
    const dispatch = useDispatch();
    const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
    const {
        totalApproved,
        loanByTypeThisMonth,
        loanByTypeAllTime,
        cashCollectedThisMonth,
        cashCollectedAllTime,
    } = useSelector((state) => state.dashboard);

    // --- MUI MODAL STATE ---
    const [open, setOpen] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [timeframe, setTimeframe] = useState(""); // Track if it's "This Month" or "Last 12 Months"

    useEffect(() => {
        if (!salesforceToken) {
            dispatch(getSalesforceToken()); 
        } else {
            dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getLoanByTypeThisMonth({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getLoanByTypeAllTime({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getCashCollectedThisMonth({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getCashCollectedAllTime({ accountId: portalUserId, token: salesforceToken }));
        }
    }, [dispatch, salesforceToken]);

    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); 
        const currentYear = now.getFullYear();

        const totalCashThisMonth = cashCollectedAllTime.reduce((sum, lead) => {
            const createdDate = new Date(lead.CreatedDate);
            if (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear &&
                lead.Cash_Collected__c
            ) {
                const cash = Number(String(lead.Cash_Collected__c).replace(/,/g, ""));
                return sum + (isNaN(cash) ? 0 : cash);
            }
            return sum;
        }, 0);

        console.log("This month cash collected:", totalCashThisMonth);
    }, [loanByTypeThisMonth, loanByTypeAllTime, cashCollectedThisMonth, cashCollectedAllTime, totalApproved]);

    // --- CLICK HANDLERS ---
    const handleThisMonthCardClick = (type) => {
        const matches = cashCollectedThisMonth.filter(item => item.Loan_Program_Type__c === type);
        setSelectedLeads(matches);
        setSelectedType(type);
        setTimeframe("This Month");
        setOpen(true);
    };

    const handleAllTimeCardClick = (type) => {
        // Filter from allTime data
        const matches = cashCollectedAllTime.filter(item => item.Loan_Program_Type__c === type);
        setSelectedLeads(matches);
        setSelectedType(type);
        setTimeframe("Last 12 Months");
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    // Dynamic Columns Helper
    const getDynamicColumns = (data) => {
        if (!data || data.length === 0) return [];
        
        // 1. Define fields to exclude
        const excludedFields = ['attributes', 'Id', 'id', 'RecordTypeId', 'Loan_Program_Type__c'];
        
        // 2. Get all valid keys
        let columns = Object.keys(data[0]).filter(key => !excludedFields.includes(key));

        // 3. Move "Name" to the beginning if it exists
        const nameIndex = columns.findIndex(col => col.toLowerCase() === 'name');
        if (nameIndex > -1) {
            const nameCol = columns.splice(nameIndex, 1)[0]; // Remove Name from current position
            columns.unshift(nameCol); // Add it to the start
        }
        
        return columns;
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <header className="bg-white p-4 shadow rounded-md mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Loan</h1>
                    <p className="text-sm text-gray-500 ">
                        {totalApproved[0]?.Account_Name__c}
                    </p>
                </div>
            </header>

            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-5">
                This Month
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loanByTypeThisMonth.map(loan => (
                    <div
                        key={loan.Loan_Program_Type__c}
                        onClick={() => handleThisMonthCardClick(loan.Loan_Program_Type__c)}
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-400"
                    >
                        <h3 className="text-gray-500 text-sm">
                            {loan.Loan_Program_Type__c}
                        </h3>
                        <p className="text-2xl font-bold mt-2">
                            {loan.expr0 ?? 0}
                        </p>
                    </div>
                ))}

                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Cash Collected</h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedThisMonth.map(item => item.Cash_Collected__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Loan Amount </h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
            </div>

            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-5 mt-5">
                Last 12 Month
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loanByTypeAllTime.map(loan => (
                    <div
                        key={loan.Loan_Program_Type__c}
                        onClick={() => handleAllTimeCardClick(loan.Loan_Program_Type__c)}
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-400"
                    >
                        <h3 className="text-gray-500 text-sm">
                            {loan.Loan_Program_Type__c}
                        </h3>
                        <p className="text-2xl font-bold mt-2">
                            {loan.expr0 ?? 0}
                        </p>
                    </div>
                ))}

                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Cash Collected</h3>
                    <p className="text-2xl font-bold mt-2">
                        ${cashCollectedAllTime
                            .filter(item => {
                                if (!item.CreatedDate) return false;
                                return (new Date(item.CreatedDate).getFullYear() === new Date().getFullYear() - 1);
                            })
                            .map(item => Number(String(item.Cash_Collected__c || 0).replace(/,/g, "")))
                            .reduce((sum, amount) => sum + amount, 0)
                            .toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Loan Amount </h3>
                    <p className="text-2xl font-bold mt-2">
                        ${cashCollectedAllTime
                            .filter(item => {
                                if (!item.CreatedDate) return false;
                                return new Date(item.CreatedDate).getFullYear() === new Date().getFullYear() - 1;
                            })
                            .map(item => Number(item.Loan_Amount__c || 0))
                            .reduce((sum, amount) => sum + amount, 0)
                            .toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <CashCollectedByMonthChart leads={cashCollectedAllTime} />
            </div>

            {/* --- MUI DIALOG (POPUP) --- */}
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="text-gray-400 text-sm block">{timeframe}</span>
                        Leads for {selectedType}
                    </div>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {getDynamicColumns(selectedLeads).map((col) => (
                                        <TableCell 
                                            key={col} 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                backgroundColor: '#f8f9fa',
                                                whiteSpace: 'nowrap', 
                                                minWidth: '150px'     
                                            }}
                                        >
                                            {col.replace('__c', '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedLeads.length > 0 ? selectedLeads.map((row, index) => (
                                    <TableRow key={index} hover>
                                        {getDynamicColumns(selectedLeads).map((col) => (
                                            <TableCell key={col} sx={{ whiteSpace: 'nowrap' }}>
                                                {row[col] ? String(row[col]) : '—'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">No detailed leads found for this type.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Loan;
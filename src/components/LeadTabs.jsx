import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function LeadTabs({ onTabChange, data,onMonthChange }) {
    const [tab, setTab] = useState(0);
    const [groupedLeads, setGroupedLeads] = useState([]);
    const { newLeads, preApprovedLeads, approvedLeads, applicationDeclinedLeads, closedLostLeads, allDeclinedLeads, status, error } = useSelector((state) => state.application);
    const [selectedMonth, setSelectedMonth] = useState('');

    // Function to get the current month name
    const getCurrentMonth = () => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth();  // Get current month index (0-11)
        return monthNames[currentMonthIndex];  // Return the current month name
    };

    useEffect(() => {
        setSelectedMonth(getCurrentMonth());  // Set the default selected month to the current month
        if(onMonthChange)onMonthChange(getCurrentMonth());
    }, []);


    const handleChange = (event, newValue) => {
        setTab(newValue);
        if (onTabChange) onTabChange(newValue);
    };

    useEffect(() => {
        console.log('data', data)
    }, [data]);



    const groupLeadsByStatus = (leads) => {
        return leads.reduce((acc, lead) => {
            const statusGroup = lead.Status;

            const leadData = {
                Name: lead.Name,
                CreatedDate: lead.CreatedDate,
                MobilePhone: lead.MobilePhone,
                Email: lead.Email,
                Loan_Amount__c: lead.Loan_Amount__c || null, // If no loan amount, set it to null
            };

            if (acc[statusGroup]) {
                acc[statusGroup].data.push(leadData);
            } else {
                acc[statusGroup] = {
                    title: statusGroup,
                    data: [leadData],
                };
            }

            return acc;
        }, {});
    };

    useEffect(() => {
        let groupedData = {};
        // Log the data to the console
        if (newLeads.length > 0 && tab === 0) {
            console.log("New Leads: ", newLeads);
            groupedData = groupLeadsByStatus(newLeads);
            setGroupedLeads(Object.values(groupedData));

             const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = newLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex 
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }
        if (preApprovedLeads.length > 0 && tab === 1) {
            console.log("Pre-Approved Leads: ", preApprovedLeads);
            groupedData = groupLeadsByStatus(preApprovedLeads);
            setGroupedLeads(Object.values(groupedData));

            const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = preApprovedLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex 
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }
        if (approvedLeads.length > 0 && tab === 2) {
            // Format the selectedMonth to match the month in the date (e.g., 'January', 'February', etc.)
            const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = approvedLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex && lead.Status === 'Funded - Invoice EAZE Client';
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }
        if (applicationDeclinedLeads.length > 0 && tab === 3) {
            console.log("Application Declined Leads: ", applicationDeclinedLeads);
            groupedData = groupLeadsByStatus(applicationDeclinedLeads);
            setGroupedLeads(Object.values(groupedData));

             const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = applicationDeclinedLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex 
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }
        if (closedLostLeads.length > 0 && tab === 4) {
            console.log("Closed Lost Leads: ", closedLostLeads);
            groupedData = groupLeadsByStatus(closedLostLeads);
            setGroupedLeads(Object.values(groupedData));

            
             const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = closedLostLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex 
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }

        if (allDeclinedLeads.length > 0 && tab === 5) {
            console.log("Closed Lost Leads: ", allDeclinedLeads);
            groupedData = groupLeadsByStatus(allDeclinedLeads);
            setGroupedLeads(Object.values(groupedData));

             const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

            // Filter leads by the selected month
            const filteredLeads = allDeclinedLeads.filter((lead) => {
                const leadDate = new Date(lead.CreatedDate); // Convert the CreatedDate to a Date object
                const leadMonthIndex = leadDate.getMonth(); // Get the month index (0 for January, 1 for February, etc.)

                // Check if the lead's month matches the selected month and if the status is 'Funded - Invoice EAZE Client'
                return leadMonthIndex === selectedMonthIndex 
            });

            console.log("Filtered Approved Leads: ", filteredLeads);

            // Group the filtered leads by their status
            groupedData = groupLeadsByStatus(filteredLeads);

            // Set the grouped leads for rendering
            setGroupedLeads(Object.values(groupedData));
        }

        console.log('status', status);
    }, [newLeads, preApprovedLeads, approvedLeads, applicationDeclinedLeads, closedLostLeads, allDeclinedLeads, tab,selectedMonth]);


    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        if(onMonthChange)onMonthChange(event.target.value);
    };
    // ===================================================
    // UI SECTION COMPONENT
    // ===================================================
    const SectionTable = ({ title, rows }) => (
        <Box sx={{ mt: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell sx={{ width: 550 }}><strong>Phone</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Agent Name</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row?.Name}</TableCell>
                                <TableCell>
                                    {new Date(row.CreatedDate).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell sx={{ width: 550 }}> {/* Increase the width of the MobilePhone column */}
                                    {row?.MobilePhone}
                                </TableCell>
                                <TableCell>
                                    <a href={`mailto:${row?.Email}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                        {row?.Email}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    ${row?.Loan_Amount__c?.toLocaleString() || 0} {/* Add $ symbol and format number */}
                                </TableCell>
                                <TableCell>{row?.agent || "-"}</TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            {/* Date Dropdown */}
            {(tab == 0 ||tab == 1 ||tab == 2 || tab == 3 || tab == 4 || tab == 5 )&&
             <div className="flex justify-end">
                <FormControl sx={{ mb: 3, width: 200, }}>
                    <InputLabel>Month</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                            <MenuItem key={index} value={month}>
                                {month} 25
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            }
           
            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={handleChange}
                variant="scrollable"        // <-- makes tabs responsive
                scrollButtons="auto"        // <-- auto-shows scroll arrows on small screens
                allowScrollButtonsMobile    // <-- ensures scroll buttons appear on mobile
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Tab label="New Leads" />
                <Tab label="Current" />
                <Tab label="Approved" />
                <Tab label="Declined" />
                <Tab label="Closed Lost" />
                <Tab label="Declined - Pre-Qualifier" />
            </Tabs>
            {/* here add date dropdown jan to des 25 only month */}

            {/* New Leads Tab */}
            {(tab === 0 || tab === 1 || tab === 2 || tab === 3 || tab === 4 || tab === 5) && (
                <Card sx={{ mt: 0, p: 2 }}>
                    <CardContent sx={{mt:0}}>
                        {groupedLeads.length === 0 ? (
                            <Typography variant="h6" align="center" sx={{ py: 3, color: "gray" }}>
                                No data found
                            </Typography>
                        ) : (
                            // Your table for New Leads goes here
                            groupedLeads?.map((lead, index) => (
                                <SectionTable key={index} title={lead.title} rows={lead.data} />
                            ))
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

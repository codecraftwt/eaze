import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalApplicationsThisMonth, getTotalApplications, getApprovedThisMonth, getTotalApproved, getDeclinedThisMonth, getTotalDeclined, getPreApprovedThisMonth, getTotalPreApproved, getTotalDeclinePercent, getTopDeclineReason, getLoanByTypeThisMonth, getLoanByTypeAllTime, getCashCollectedThisMonth, getCashCollectedAllTime } from '../store/slices/dashboardSlice'; // Ensure correct imports
import { getSalesforceToken } from '../store/slices/authSlice'; // Ensure correct import
import { BarChart } from '@mui/x-charts/BarChart';
import PopupModal from '../components/PopupModal';
import CashCollectedByMonthChart from '../components/CashCollectedByMonthChart';

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
                    xAxis={[{ data: declinedPreQualifierChartData.months }]} // Pass months as the x-axis labels
                    series={[
                        { data: declinedPreQualifierChartData.totalLeads, label: 'Total', id: 'pvId' }, // Total leads series
                        { data: declinedPreQualifierChartData.newLeads, label: 'Declined', id: 'uvId' },   // New leads series
                    ]}
                    height={300}
                />
            ) : (
                <div>No data available</div> // Fallback message when no data exists
            )}
        </div>
    );
};


function Loan() {
    const dispatch = useDispatch();
    const [leadsData, setLeadsData] = useState([]);
    const [groupedThisMonthData, setGroupedThisMonthData] = useState({});
    const [groupedAllMonthData, setGroupedAllMonthData] = useState({});
    const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
    const {
        totalApplicationsThisMonth,
        approvedApplicationsThisMonth,
        declinedApplicationsThisMonth,
        preApprovedApplicationsThisMonth,
        totalApplications,
        totalApproved,
        totalDeclined,
        totalPreApproved,
        totalDeclinePercent,
        topDeclineReason,
        loanByTypeThisMonth,
        loanByTypeAllTime,
        cashCollectedThisMonth,
        cashCollectedAllTime,
    } = useSelector((state) => state.dashboard);

    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalAllOpen, setModalAllOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('Jan 25');
    const [isActive, setIsActive] = useState('approved');
    const [barChartData, setBarChartData] = useState({
        months: [],
        approved: [],
        current: [],
        declined: [],
    });

    const categoryMap = {
        approved: [
            "Funded - Invoice EAZE Client",
            "Approved By Lender-Funding In Progress",
            "EAZE Invoice Paid - File Closed"
        ],
        declined: [
            "Declined - Client Does Not Meet Minimum Credit Requirements",
            "Declined - Client did not pass the pre-qualifying questions",
            "Declined - Client Does Not Meet Minimum 35k Annual Income Requirements",
            "Declined - Client Declined During Income Verification",
            "Declined - Client Does Not Meet Minimum 2 Years Of Self-Employment Requirements",
            "Declined - Client Does Not Meet Minimum W-2 1 Year Employment Requirements",
            "Declined Debt To Income Ratio – File Closed",
            "Declined - Client's Credit over 620 - Declined By All Lenders"
        ],
        preApproved: [
            "Pre-Approved Pending Income Verification",
            "Client has accepted terms - Moving forward with income Verification",
            "Terms Pitched - Email to Agent To Follow Up",
            "All Docs In - Pending Final Underwriting Decision"
        ],
        closedLost: [
            "Closed Lost - Pre-approved - Client Missed EAZE Consultation - Message to Agent",
            "Closed Lost - Terms Pitched - Client Did Not Move Forward With Offer",
            "Closed Lost - Pre-Approved - Client Not Moving Forward with Opportunity",
            "Closed Lost - Pre-Approved - Client Never Scheduled Appointment With EAZE",
            "Closed Lost - Pre-Approved -  Per Agent - Client Not Moving Forward with Opportunity",
            "Closed Lost - Pre-Approved - Client Non-Responsive During Income Verification",
            "Closed Lost - Alert - Please Check Notes",
            "Closed Lost  - Client Non-Responsive During Verification Call",
            "Closed Lost - Pre-approved - Client Canceled EAZE Consultation",
            "Closed Lost - Pre-approved - Client Self-Funded Program",
            "Closed Lost - Pre-Approved - Client Did Not Receive Large Enough Approval"
        ]
    };
    const categoryMapNew = {
        approved: [
            "Funded - Invoice EAZE Client",
            "Approved By Lender-Funding In Progress",
            "EAZE Invoice Paid - File Closed"
        ],
        declined: [
            "Declined - Client Does Not Meet Minimum Credit Requirements",
            "Declined - Client did not pass the pre-qualifying questions",
            "Declined - Client Does Not Meet Minimum 35k Annual Income Requirements",
            "Declined - Client Declined During Income Verification",
            "Declined - Client Does Not Meet Minimum 2 Years Of Self-Employment Requirements",
            "Declined - Client Does Not Meet Minimum W-2 1 Year Employment Requirements",
            "Declined Debt To Income Ratio – File Closed",
            "Declined - Client's Credit over 620 - Declined By All Lenders"
        ],
        declinedthisMonth: [
            "Declined - Client Does Not Meet Minimum Credit Requirements"
        ],
        preApproved: [
            "Pre-Approved Pending Income Verification",
            "Client has accepted terms - Moving forward with income Verification",
            "Terms Pitched - Email to Agent To Follow Up",
            "All Docs In - Pending Final Underwriting Decision"
        ],
        closedLost: [
            "Closed Lost - Pre-approved - Client Missed EAZE Consultation - Message to Agent",
            "Closed Lost - Terms Pitched - Client Did Not Move Forward With Offer",
            "Closed Lost - Pre-Approved - Client Not Moving Forward with Opportunity",
            "Closed Lost - Pre-Approved - Client Never Scheduled Appointment With EAZE",
            "Closed Lost - Pre-Approved -  Per Agent - Client Not Moving Forward with Opportunity",
            "Closed Lost - Pre-Approved - Client Non-Responsive During Income Verification",
            "Closed Lost - Alert - Please Check Notes",
            "Closed Lost  - Client Non-Responsive During Verification Call",
            "Closed Lost - Pre-approved - Client Canceled EAZE Consultation",
            "Closed Lost - Pre-approved - Client Self-Funded Program",
            "Closed Lost - Pre-Approved - Client Did Not Receive Large Enough Approval"
        ]
    };

    function getDeclinedLeadsCount(fields, apiResponse) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Current month (0-11)
        const currentYear = currentDate.getFullYear(); // Current year (e.g., 2025)

        // Filter for declined leads and check if the "Declined_or_Closed_Lost_Date__c" is in the current month
        const declinedLeadsThisMonth = apiResponse.filter(lead => {
            const declinedDate = new Date(lead.Declined_or_Closed_Lost_Date__c);
            return (
                fields.declinedthisMonth.includes(lead.Status) && // Check if lead's status is in 'declined' category
                declinedDate.getMonth() === currentMonth &&
                declinedDate.getFullYear() === currentYear
            );
        });

        return declinedLeadsThisMonth.length; // Return the count of declined leads
    }

    function filterDeclinedLeadsForMonth(data, monthName, statusCategory) {
        // Map month name to the corresponding month number (0-based, so Dec is 11)
        const monthMapping = {
            "Jan 25": 0, "Feb 25": 1, "Mar 25": 2, "Apr 25": 3, "May 25": 4,
            "Jun 25": 5, "Jul 25": 6, "Aug 25": 7, "Sep 25": 8, "Oct 25": 9,
            "Nov 25": 10, "Dec 25": 11
        };

        // Get the month number for the provided monthName (e.g., "Dec 25" -> 11)
        const monthNumber = monthMapping[monthName];

        // Filter the data for leads that were declined in the specific month (e.g., December)
        return data.filter(lead => {
            const declinedDate = new Date(lead.Declined_or_Closed_Lost_Date__c);
            const isDeclinedStatus = statusCategory.declined.includes(lead.Status);

            // Check if the lead's Declined or Closed Lost Date is in the specified month (e.g., December)
            return isDeclinedStatus && declinedDate.getMonth() === monthNumber;
        });
    }


    function groupLeadStatuses(categoryMap, leads) {
        const result = {
            approved: {
                header: {
                    status: "approved",
                    chaildCount: 0,
                    chaildAmount: 0,
                    chailPersent: 0
                },
                body: categoryMap.approved.map(status => ({
                    status,
                    count: 0,
                    amount: 0,
                    percent: 0
                }))
            },
            declined: {
                header: {
                    status: "declined",
                    chaildCount: 0,
                    chaildAmount: 0,
                    chailPersent: 0
                },
                body: categoryMap.declined.map(status => ({
                    status,
                    count: 0,
                    amount: 0,
                    percent: 0
                }))
            },
            preApproved: {
                header: {
                    status: "preApproved",
                    chaildCount: 0,
                    chaildAmount: 0,
                    chailPersent: 0
                },
                body: categoryMap.preApproved.map(status => ({
                    status,
                    count: 0,
                    amount: 0,
                    percent: 0
                }))
            },
            closedLost: {
                header: {
                    status: "closedLost",
                    chaildCount: 0,
                    chaildAmount: 0,
                    chailPersent: 0
                },
                body: categoryMap.closedLost.map(status => ({
                    status,
                    count: 0,
                    amount: 0,
                    percent: 0
                }))
            },
            gloable: {
                gloableCount: 0,
                gloableAmount: 0
            }
        };

        leads.forEach(lead => {
            const status = lead.Status;
            const amount = lead.Loan_Amount__c || 0;

            // Update global totals
            result.gloable.gloableCount++;
            result.gloable.gloableAmount += amount;

            for (const category in categoryMap) {
                if (categoryMap[category].includes(status)) {
                    const item = result[category].body.find(s => s.status === status);
                    if (item) {
                        item.count++;
                        item.amount += amount;
                    }

                    result[category].header.chaildCount++;
                    result[category].header.chaildAmount += amount;
                }
            }
        });

        // Calculate percentages (UPDATED)
        const globalAmount = result.gloable.gloableAmount;

        for (const category in result) {
            if (category !== "gloable") {
                // NEW: header percent = chaildAmount / globalAmount
                result[category].header.chailPersent =
                    globalAmount > 0
                        ? (result[category].header.chaildAmount / globalAmount) * 100
                        : 0;

                // NEW: body percent = item.amount / globalAmount
                result[category].body.forEach(item => {
                    item.percent =
                        globalAmount > 0 ? (item.amount / globalAmount) * 100 : 0;
                });
            }
        }

        return result;
    }

    //   function formatLeadsByStatusUpdated(data, categoryMap) {
    //     // Initialize arrays for Approved, Current (Pre-Approved), and Declined counts
    //     const months = [
    //       "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
    //       "Sep 25", "Oct 25", "Nov 25", "Dec 25"
    //     ];

    //     const approved = new Array(12).fill(0);
    //     const current = new Array(12).fill(0);  // 'Current' corresponds to Pre-approved
    //     const declined = new Array(12).fill(0);

    //     // Helper function to get the month index from the date
    //     // function getMonthIndex(date) {
    //     //   console.log(date, 'date')
    //     //   const month = new Date(date).getMonth(); // Get the month index (0-11)
    //     //   // console.log(month, 'month')
    //     //   return month;
    //     // }

    //     function getMonthIndex(date) {
    //   // console.log(date, 'date');

    //   const parsedDate = new Date(date);  // Convert the string to a Date object
    //   const month = parsedDate.getMonth(); // Get the month index (0-11)
    //   const year = parsedDate.getFullYear();  // Get the full year

    //   // Adjust the year part to only consider the last two digits
    //   const yearShort = year % 100;  // This gets the last two digits (e.g., 2022 -> 22)
    //   // console.log(month, 'month', yearShort, 'yearShort');

    //   // If the year is 2022 or 2023, for example, you could map it to "25" as needed
    //   // Example: year == 2022 -> 25 or use your own logic to adjust the mapping

    //   // Return the month index
    //   return month;
    // }

    //     // Process each lead and classify by month and status
    //     data.forEach(lead => {
    //       const monthIndex = getMonthIndex(lead.CreatedDate);
    //       // console.log(monthIndex, 'monthIndex')
    //       // Increment count for total leads
    //       if (categoryMap.approved.includes(lead.Status)) {
    //         approved[monthIndex] += 1; // Increment approved leads
    //       } else if (categoryMap.declined.includes(lead.Status)) {
    //         declined[monthIndex] += 1; // Increment declined leads
    //       } else if (categoryMap.preApproved.includes(lead.Status)) {
    //         current[monthIndex] += 1; // Increment current leads (Pre-approved)
    //       }
    //     });

    //     // Return the formatted JSON
    //     return {
    //       months,
    //       approved,
    //       current,
    //       declined
    //     };
    //   }




    // this month

    function formatLeadsByStatusUpdated(data, categoryMap) {
        // Initialize arrays for Approved, Current (Pre-Approved), and Declined counts
        const months = [
            "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
            "Sep 25", "Oct 25", "Nov 25", "Dec 25"
        ];

        // Array to hold counts for each month of the year
        const approved = new Array(12).fill(0);
        const current = new Array(12).fill(0);  // 'Current' corresponds to Pre-approved
        const declined = new Array(12).fill(0);

        // Helper function to get the month index and filter by year 2025
        function getMonthIndex(date) {
            const parsedDate = new Date(date);  // Convert the string to a Date object
            const month = parsedDate.getMonth(); // Get the month index (0-11)
            const year = parsedDate.getFullYear();  // Get the full year

            // Only process the data for the year 2025
            if (year !== 2025) {
                return -1;  // Return -1 if the year is not 2025 (ignores this lead)
            }

            return month;  // Return the month index if the year is 2025
        }

        // Process each lead and classify by month and status
        data.forEach(lead => {
            const monthIndex = getMonthIndex(lead.CreatedDate);

            // If the year is not 2025, skip this lead
            if (monthIndex === -1) return;

            // Increment count for total leads based on the status
            if (categoryMap.approved.includes(lead.Status)) {
                approved[monthIndex] += 1; // Increment approved leads
            } else if (categoryMap.declined.includes(lead.Status)) {
                declined[monthIndex] += 1; // Increment declined leads
            } else if (categoryMap.preApproved.includes(lead.Status)) {
                current[monthIndex] += 1; // Increment current leads (Pre-approved)
            }
        });

        // Return the formatted JSON with counts for each month for the year 2025
        return {
            months,
            approved,
            current,
            declined
        };
    }
    function formatLeadsByStatusUpdatedNew(data, categoryMap) {
        // Initialize arrays for Approved, Current (Pre-Approved), Declined, and Closed Lost counts
        const months = [
            "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
            "Sep 25", "Oct 25", "Nov 25", "Dec 25"
        ];

        // Array to hold counts for each month of the year
        const approved = new Array(12).fill(0);
        const current = new Array(12).fill(0);  // 'Current' corresponds to Pre-approved
        const declined = new Array(12).fill(0);
        const closedLost = new Array(12).fill(0); // Array for "Closed Lost" status

        // This array will hold the final data as an array of objects
        const monthlyData = [];

        // Helper function to get the month index and filter by year 2025
        function getMonthIndex(date) {
            const parsedDate = new Date(date);  // Convert the string to a Date object
            const month = parsedDate.getMonth(); // Get the month index (0-11)
            const year = parsedDate.getFullYear();  // Get the full year

            // Only process the data for the year 2025
            if (year !== 2025) {
                return -1;  // Return -1 if the year is not 2025 (ignores this lead)
            }

            return month;  // Return the month index if the year is 2025
        }

        // Process each lead and classify by month and status
        data.forEach(lead => {
            const monthIndex = getMonthIndex(lead.CreatedDate);

            // If the year is not 2025, skip this lead
            if (monthIndex === -1) return;

            // Increment the count for each category and push the data into the monthlyData array
            if (categoryMap.approved.includes(lead.Status)) {
                approved[monthIndex] += 1; // Increment approved leads
                monthlyData.push({
                    month: months[monthIndex],
                    status: "Approved",
                    count: approved[monthIndex]
                });
            } else if (categoryMap.declined.includes(lead.Status)) {
                declined[monthIndex] += 1; // Increment declined leads
                monthlyData.push({
                    month: months[monthIndex],
                    status: "Declined",
                    count: declined[monthIndex]
                });
            } else if (categoryMap.preApproved.includes(lead.Status)) {
                current[monthIndex] += 1; // Increment current leads (Pre-approved)
                monthlyData.push({
                    month: months[monthIndex],
                    status: "Pre-Approved",
                    count: current[monthIndex]
                });
            } else if (categoryMap.closedLost.includes(lead.Status)) {
                closedLost[monthIndex] += 1; // Increment closed lost leads
                monthlyData.push({
                    month: months[monthIndex],
                    status: "Closed Lost",
                    count: closedLost[monthIndex]
                });
            }
        });

        // Return the formatted array of objects
        return monthlyData;
    }



    const openModal = (category) => {
        setModalOpen(true);
        setIsActive(category);  // Set isActive dynamically based on the category or some other criteria
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    // total
    const openAllModal = (category) => {
        setModalAllOpen(true);
        setIsActive(category);  // Set isActive dynamically based on the category or some other criteria
    };

    const closeAllModal = () => {
        setModalAllOpen(false);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    useEffect(() => {
        if (!salesforceToken) {
            dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
        } else {
            dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getLoanByTypeThisMonth({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getLoanByTypeAllTime({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getCashCollectedThisMonth({ accountId: portalUserId, token: salesforceToken }));
            dispatch(getCashCollectedAllTime({ accountId: portalUserId, token: salesforceToken }));
        }
    }, [dispatch, salesforceToken]);

    useEffect(() => {

        console.log(loanByTypeThisMonth, 'loanByTypeThisMonth')
        console.log(loanByTypeAllTime, 'loanByTypeAllTime')
        console.log(cashCollectedThisMonth, 'cashCollectedThisMonth')
        console.log(cashCollectedAllTime, 'cashCollectedAllTime')
        console.log(new Set(cashCollectedAllTime.map(m => m.Loan_Program_Type__c)), 'Loan_Program_Type__c__test')

        // const response = /* paste the API response object here */;

        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based
        const currentYear = now.getFullYear();

        const totalCashThisMonth = cashCollectedAllTime.reduce((sum, lead) => {
            const createdDate = new Date(lead.CreatedDate);

            if (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear &&
                lead.Cash_Collected__c
            ) {
                // Remove commas and convert to number
                const cash = Number(
                    String(lead.Cash_Collected__c).replace(/,/g, "")
                );

                return sum + (isNaN(cash) ? 0 : cash);
            }

            return sum;
        }, 0);

        console.log("This month cash collected:", totalCashThisMonth);
        console.log(totalApproved, 'totalApproved')
    }, [
        loanByTypeThisMonth,
        loanByTypeAllTime,
        cashCollectedThisMonth,
        cashCollectedAllTime,
        totalApproved
    ]);


    // List of months from Jan 25 to Dec 25
    const months = [
        'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
        'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
    ];

    const loanTypes = [
        { key: "elite", label: "Elite" },
        { key: "diamond", label: "Diamond" },
        { key: "ga", label: "GA" },
        { key: "eaze cap", label: "Eaze Cap" },
    ];


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
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-gray-500 text-sm">
                            {loan.Loan_Program_Label__c
                                || loan.Loan_Program_Type__c}
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

                {/* <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Loan Amount ({loanByTypeThisMonth[0]?.Loan_Program_Type__c}) This Month</h3>
                    <p className="text-2xl font-bold mt-2">${loanByTypeThisMonth.map(item => item.expr0 || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Cash Collected This Month</h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Loan Amount </h3>
                    <p className="text-2xl font-bold mt-2">${loanByTypeAllTime.map(item => item.expr0 || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Cash Collected</h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedAllTime.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div> */}
                {/* {loanTypes.map(type => {
                    const matchedLoan = loanByTypeThisMonth.find(
                        f => f.Loan_Program_Type__c?.toLowerCase() === type.key
                    );

                    return (
                        <div
                            key={type.key}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-gray-500 text-sm">
                                Loan Amount ({type.label}) This Month
                            </h3>

                            <p className="text-2xl font-bold mt-2">
                                ${matchedLoan ? matchedLoan.expr0 : 0}
                            </p>
                        </div>
                    );
                })} */}
                {/* {loanTypes.map(type => {
                    const matchedLoan = loanByTypeAllTime.find(
                        f => f.Loan_Program_Type__c?.toLowerCase() === type.key
                    );

                    return (
                        <div
                            key={type.key}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-gray-500 text-sm">
                               Total Loan Amount ({type.label})
                            </h3>

                            <p className="text-2xl font-bold mt-2">
                                ${matchedLoan ? matchedLoan.expr0 : 0}
                            </p>
                        </div>
                    );
                })} */}


            </div>

            {/* <p className='mb-2 mt-2'>This Year</p> */}
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-5 mt-5">
                Last 12 Year
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loanByTypeAllTime.map(loan => (
                    <div
                        key={loan.Loan_Program_Type__c}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-gray-500 text-sm">
                            {loan.Loan_Program_Label__c ||
                                loan.Loan_Program_Type__c}
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
                                return (
                                    new Date(item.CreatedDate).getFullYear() ===
                                    new Date().getFullYear()-1
                                );
                            })
                            .map(item =>
                                Number(String(item.Cash_Collected__c || 0).replace(/,/g, ""))
                            )
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
                                return new Date(item.CreatedDate).getFullYear() === new Date().getFullYear()-1;
                            })
                            .map(item => Number(item.Loan_Amount__c || 0))
                            .reduce((sum, amount) => sum + amount, 0)
                            .toLocaleString()}
                    </p>

                </div>

                {/* <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Loan Amount ({loanByTypeThisMonth[0]?.Loan_Program_Type__c}) This Month</h3>
                    <p className="text-2xl font-bold mt-2">${loanByTypeThisMonth.map(item => item.expr0 || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Cash Collected This Month</h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Loan Amount </h3>
                    <p className="text-2xl font-bold mt-2">${loanByTypeAllTime.map(item => item.expr0 || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" >
                    <h3 className="text-gray-500 text-sm">Total Cash Collected</h3>
                    <p className="text-2xl font-bold mt-2">${cashCollectedAllTime.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
                </div> */}
                {/* {loanTypes.map(type => {
                    const matchedLoan = loanByTypeThisMonth.find(
                        f => f.Loan_Program_Type__c?.toLowerCase() === type.key
                    );

                    return (
                        <div
                            key={type.key}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-gray-500 text-sm">
                                Loan Amount ({type.label}) This Month
                            </h3>

                            <p className="text-2xl font-bold mt-2">
                                ${matchedLoan ? matchedLoan.expr0 : 0}
                            </p>
                        </div>
                    );
                })} */}
                {/* {loanTypes.map(type => {
                    const matchedLoan = loanByTypeAllTime.find(
                        f => f.Loan_Program_Type__c?.toLowerCase() === type.key
                    );

                    return (
                        <div
                            key={type.key}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-gray-500 text-sm">
                               Total Loan Amount ({type.label})
                            </h3>

                            <p className="text-2xl font-bold mt-2">
                                ${matchedLoan ? matchedLoan.expr0 : 0}
                            </p>
                        </div>
                    );
                })} */}


            </div>
            <div
                className="bg-white p-6 rounded-lg shadow-md mt-6"
            >
                <CashCollectedByMonthChart leads={cashCollectedAllTime} />
            </div>

        </div>
    );
}

export default Loan;

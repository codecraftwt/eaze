import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalApplicationsThisMonth, getTotalApplications, getApprovedThisMonth, getTotalApproved, getDeclinedThisMonth, getTotalDeclined, getPreApprovedThisMonth, getTotalPreApproved, getTotalDeclinePercent, getTopDeclineReason } from '../store/slices/dashboardSlice'; // Ensure correct imports
import { getSalesforceToken } from '../store/slices/authSlice'; // Ensure correct import
import { BarChart } from '@mui/x-charts/BarChart';
import PopupModal from '../components/PopupModal';

export function valueFormatter(value) {
  return `${value}mm`;
}
const DeclinedSummaryCard = ({ declinePercent, topDeclineReason, declineValue }) => (
  <div className="w-full bg-white rounded-xl shadow-sm p-6 flex items-center justify-between mb-6 mt-5">
    <div>
      <p className="text-3xl font-bold text-[#0A2156]">{declinePercent}%</p>
      <p className="text-sm text-gray-500">Total Declined</p>
    </div>
    <div className="text-center">
      <p className="text-3xl font-bold text-[#0A2156]">${declineValue}</p>
      <p className="text-sm text-gray-500">Top Declined Reason</p>
    </div>
    <div className="text-right w-[40%]">
      <p className="text-sm text-gray-500">{topDeclineReason}</p>
    </div>
  </div>
);

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


function Dashboard() {
  const dispatch = useDispatch();
  const [leadsData, setLeadsData] = useState([]);
  const [groupedThisMonthData, setGroupedThisMonthData] = useState({});
  const [groupedAllMonthData, setGroupedAllMonthData] = useState({});
  const { salesforceToken } = useSelector((state) => state.auth);
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
    topDeclineReason
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

  function formatLeadsByStatusUpdated(data, categoryMap) {
    // Initialize arrays for Approved, Current (Pre-Approved), and Declined counts
    const months = [
      "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
      "Sep 25", "Oct 25", "Nov 25", "Dec 25"
    ];

    const approved = new Array(12).fill(0);
    const current = new Array(12).fill(0);  // 'Current' corresponds to Pre-approved
    const declined = new Array(12).fill(0);

    // Helper function to get the month index from the date
    function getMonthIndex(date) {
      const month = new Date(date).getMonth(); // Get the month index (0-11)
      return month;
    }

    // Process each lead and classify by month and status
    data.forEach(lead => {
      const monthIndex = getMonthIndex(lead.CreatedDate);

      // Increment count for total leads
      if (categoryMap.approved.includes(lead.Status)) {
        approved[monthIndex] += 1; // Increment approved leads
      } else if (categoryMap.declined.includes(lead.Status)) {
        declined[monthIndex] += 1; // Increment declined leads
      } else if (categoryMap.preApproved.includes(lead.Status)) {
        current[monthIndex] += 1; // Increment current leads (Pre-approved)
      }
    });

    // Return the formatted JSON
    return {
      months,
      approved,
      current,
      declined
    };
  }




  // this month
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
      // this month
      dispatch(getTotalApplicationsThisMonth({ token: salesforceToken }));
      dispatch(getApprovedThisMonth({ token: salesforceToken }));
      dispatch(getDeclinedThisMonth({ token: salesforceToken }));
      dispatch(getPreApprovedThisMonth({ token: salesforceToken }));

      // total
      dispatch(getTotalApplications({ token: salesforceToken }));
      dispatch(getTotalApproved({ token: salesforceToken }));
      dispatch(getTotalDeclined({ token: salesforceToken }));
      dispatch(getTotalPreApproved({ token: salesforceToken }));
      dispatch(getTotalDeclinePercent({ token: salesforceToken }));
      dispatch(getTopDeclineReason({ token: salesforceToken }));
    }
  }, [dispatch, salesforceToken]);

  useEffect(() => {
    // Only log when the data is available (non-empty or updated)
    if (totalApplicationsThisMonth.length !== 0) {
      console.log(totalApplicationsThisMonth.length, 'totalApplicationsThisMonth');
      const result = groupLeadStatuses(categoryMap, totalApplicationsThisMonth);
      console.log(result, 'result')
      setGroupedThisMonthData(result);
      //   console.log(totalApplicationsThisMonth.map(item => item.Loan_Amount__c || 0)   // extract only loan amounts
      // .reduce((sum, amount) => sum + amount, 0), 'totalApplicationsThisMonth--this month loan amount');
      const closedLost = totalApplicationsThisMonth.filter(item =>
        item.Status.toLowerCase().startsWith("closed lost"));
      console.log([...new Set(closedLost.map(item => item.Status))], 'closedLost status')
    }

    // Total stats
    if (totalApplications.length !== 0) {
      console.log(totalApplications, 'totalApplications');
      const result = groupLeadStatuses(categoryMap, totalApplications);
      console.log(result, 'result')
      const closedLost = totalApplications.filter(item =>
        item.Status.toLowerCase().startsWith("declined"));
      console.log([...new Set(closedLost.map(item => item.Status))], 'declined status')
      setGroupedAllMonthData(result);
      const barChat = formatLeadsByStatusUpdated(totalApplications, categoryMap);
      console.log(barChat, 'barChat')
      setBarChartData(barChat);
      //   console.log(totalApplications.length, 'totalApplications');
      //   console.log(totalApplications.map(item => item.Loan_Amount__c || 0)   // extract only loan amounts
      // .reduce((sum, amount) => sum + amount, 0), 'totalApplications--this month loan amount');
    }

    if (totalApproved.length !== 0) {
      console.log(totalApproved, 'totalApproved')
      console.log(totalApproved.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0), 'totalApproved');
    }

    if (totalDeclinePercent !== null) {
      console.log(totalDeclinePercent, 'totalDeclinePercent')
    }

  }, [
    totalApplicationsThisMonth,
    approvedApplicationsThisMonth,
    declinedApplicationsThisMonth,
    preApprovedApplicationsThisMonth,
    totalApplications,
    totalApproved,
    totalDeclined,
    totalPreApproved,
    totalDeclinePercent
  ]);

  useEffect(() => {
    if (totalApplications.length !== 0) {
      console.log(totalApplications, 'totalApplications-----------');
      const data = totalApplications.filter((m) => m.Status == topDeclineReason?.decline_reason).map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()
      console.log(data, 'data')
    }
  }, [topDeclineReason, totalApplications]);

  // List of months from Jan 25 to Dec 25
  const months = [
    'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
    'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="bg-white p-4 shadow rounded-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Funding Analytics</h1>
          {/* <div className="text-sm text-gray-500">Short video instructions on how to use your Funding Analytics Portal</div> */}
          <a
            href="https://www.loom.com/share/4302a1e8367144febea20c450b25f9fa?sid=39568934-592e-45ad-9f03-512b455fcb1d"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 cursor-pointer hover:text-blue-500"
          >
            Short video instructions on how to use your Funding Analytics Portal
          </a>
          <div className="relative w-60">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a Month</option>
              {months.map((month) => (
                <option key={month} value={month} className="text-gray-700">
                  {month}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openModal('gloable')}>
          <h3 className="text-gray-500 text-sm">Applications This Month</h3>
          <p className="text-2xl font-bold mt-2">{totalApplicationsThisMonth.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openModal('approved')}>
          <h3 className="text-gray-500 text-sm">Approved This Month</h3>
          <p className="text-2xl font-bold mt-2">${approvedApplicationsThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openModal('declined')}>
          <h3 className="text-gray-500 text-sm">Declined This Month</h3>
          <p className="text-2xl font-bold mt-2">${declinedApplicationsThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openModal('preApproved')}>
          <h3 className="text-gray-500 text-sm">Pre-Approved This Month</h3>
          <p className="text-2xl font-bold mt-2">${preApprovedApplicationsThisMonth.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openAllModal('gloable')}>
          <h3 className="text-gray-500 text-sm">Total Applications</h3>
          <p className="text-2xl font-bold mt-2">{totalApplications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openAllModal('approved')}>
          <h3 className="text-gray-500 text-sm">Total Approved</h3>
          <p className="text-2xl font-bold mt-2">${totalApproved.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openAllModal('declined')}>
          <h3 className="text-gray-500 text-sm">Total Declined</h3>
          <p className="text-2xl font-bold mt-2">${totalDeclined.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={() => openAllModal('preApproved')}>
          <h3 className="text-gray-500 text-sm">Total Pre-Approved</h3>
          <p className="text-2xl font-bold mt-2">${totalPreApproved.map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <DeclinedSummaryCard
        declinePercent={totalDeclinePercent?.decline_percent}
        topDeclineReason={topDeclineReason?.decline_reason}
        declineValue={totalApplications.filter((m) => m.Status == topDeclineReason?.decline_reason).map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}
      />

      {/* Monthly Summary Chart */}
      {/* <MonthlySummaryChart /> */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
        {barChartData?.months.length > 0 ||
          barChartData?.approved.length > 0 || barChartData?.declined.length > 0 ||
          barChartData?.current.length > 0 ? (
          <BarChart
            xAxis={[{ data: barChartData.months }]} // Pass months as the x-axis labels
            series={[
              { data: barChartData.approved, label: 'Approved', id: 'pvId' }, // Total leads series
              { data: barChartData.current, label: 'Current', id: 'uvId' },   // New leads series
              { data: barChartData.declined, label: 'Declined', id: 'udId' },   // New leads series
            ]}
            height={300}
          />
        ) : (
          <div>No data available</div> // Fallback message when no data exists
        )}
      </div>
      <PopupModal groupedData={groupedThisMonthData} isActive={isActive} isOpen={isModalOpen} onClose={closeModal} title="Declined Summary" content="Declined — Client Does Not Meet Minimum Credit Requirements" />
      <PopupModal groupedData={groupedAllMonthData} isActive={isActive} isOpen={isModalAllOpen} onClose={closeAllModal} title="Declined Summary" content="Declined — Client Does Not Meet Minimum Credit Requirements" />
    </div>
  );
}

export default Dashboard;

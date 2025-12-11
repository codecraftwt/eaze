import React, { useEffect, useRef, useState } from "react";
import LeadTabs from "../components/LeadTabs.jsx";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
// import { desktopOS, valueFormatter } from './webUsageStats';
import { AiOutlineFile } from 'react-icons/ai';   // Import Document Icon
import { FiDollarSign } from 'react-icons/fi';     // Import Dollar Icon
import { AiOutlineUser } from 'react-icons/ai';       // For Current Applications
import { FiCheckCircle } from 'react-icons/fi';        // For Revenue in-progress
import { HiOutlineChartPie } from 'react-icons/hi';
// import { FiCheckCircle } from 'react-icons/fi';   // Check Icon
import { HiCurrencyDollar } from 'react-icons/hi';  // Dollar Icon
import { GiMoneyStack } from 'react-icons/gi';      // Money Stack Icon
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Another check icon

// import { FiCheckCircle } from 'react-icons/fi';      // Checkmark Icon
// import { HiCurrencyDollar } from 'react-icons/hi';    // Dollar Icon
import { AiOutlineCloseCircle } from 'react-icons/ai'; // Decline Icon
import { FaExclamationCircle } from 'react-icons/fa'; // Warning Icon
import { useDispatch, useSelector } from "react-redux";
import { getAllDeclined, getApplicationDeclineLead, getApprovedLead, getClosedLost, getNewLead, getPreApprovedLead } from "../store/slices/applicationSlice.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { getSalesforceToken } from "../store/slices/authSlice.js";
import { getTopDeclineReason, getTotalApplications, getTotalApproved, getTotalDeclined } from "../store/slices/dashboardSlice.js";
// donut chat data
export const desktopOS = [
  {
    label: 'Windows',
    value: 72.72,
  },
  {
    label: 'OS X',
    value: 16.38,
  },
  {
    label: 'Linux',
    value: 3.83,
  },
  {
    label: 'Chrome OS',
    value: 2.42,
  },
  {
    label: 'Other',
    value: 4.65,
  },
];


export const valueFormatter = (item) => `${item.value}%`;
// Register chart elements

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const { salesforceToken } = useSelector((state) => state.auth);
  const { newLeads, preApprovedLeads, approvedLeads, applicationDeclinedLeads, closedLostLeads, allDeclinedLeads, status, error } = useSelector((state) => state.application);
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

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');

  const [groupedLeads, setGroupedLeads] = useState([]);

  // new leads
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [totalNewleadsAmount, setTotalNewleadsAmount] = useState(0);
  const [newLeadsChartData, setNewLeadsChartData] = useState({
    months: [],
    totalLeads: [],
    newLeads: []
  });

  // current
  const [preApprovedLeadsCount, setPreApprovedLeadsCount] = useState(0);
  const [totalPreApprovedLeadsAmount, setTotalPreApprovedLeadsAmount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [preApprovedChartData, setPreApprovedChartData] = useState([])


  // approved
  const [compareToLastMonth, setCompareToLastMonth] = useState(0);
  const [thisMonthApprovedCount, setThisMonthApprovedCount] = useState(0);
  const [thisMonthApprovedRevenue, setThisMonthApprovedRevenue] = useState(0);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0);
  const [totalApprovedRevenue, setTotalApprovedRevenue] = useState(0);
  const [approvedChartData, setApprovedChartData] = useState({
    months: [],
    totalLeads: [],
    newLeads: []
  });

  // declined
  const [declinedCount, setDeclinedCount] = useState(0);
  const [declinedRevenue, setDeclinedRevenue] = useState(0);
  const [totalDeclinedCount, setTotalDeclinedCount] = useState(0);
  const [totalDeclinedRevenue, setTotalDeclinedRevenue] = useState(0);
  const [declinedChartData, setDeclinedChartData] = useState({
    months: [],
    totalLeads: [],
    newLeads: []
  });
  const [thisMonthDeclinedCount, setThisMonthDeclinedCount] = useState(0);
  const [thisMonthDeclinedRevenue, setThisMonthDeclinedRevenue] = useState(0);
  const [compareToDeclinedLastMonth, setCompareToDeclinedLastMonth] = useState(0);
  const [chartDeclinedData, setChartDeclinedData] = useState([]);


  // closed lost
  const [closedLostCount, setClosedLostCount] = useState(0);
  const [closedLostRevenue, setClosedLostRevenue] = useState(0);
  const [totalClosedLostCount, setTotalClosedLostCount] = useState(0);
  const [totalClosedLostRevenue, setTotalClosedLostRevenue] = useState(0);
  const [closedLostChartData, setClosedLostChartData] = useState({
    months: [],
    totalLeads: [],
    newLeads: []
  });
  const [thisMonthClosedLostCount, setThisMonthClosedLostCount] = useState(0);
  const [thisMonthClosedLostRevenue, setThisMonthClosedLostRevenue] = useState(0);
  const [compareToClosedLostLastMonth, setCompareToClosedLostLastMonth] = useState(0);
  const [chartClosedLostData, setChartClosedLostData] = useState([]);

  // Declined - Pre-Qualifier
  const [thisMonthDeclinedCountPreQualifier, setThisMonthDeclinedCountPreQualifier] = useState(0);
  const [declinedTotalPreQualifier, setDeclinedTotalPreQualifier] = useState(0);
  const [compareToDeclinedLastMonthPreQualifier, setCompareToDeclinedLastMonthPreQualifier] = useState(0);
  const [declinedPreQualifierChartData, setDeclinedPreQualifierChartData] = useState({
    months: [],
    totalLeads: [],
    newLeads: []
});

  // Access application data from Redux state

  // Store the chart instances using useRef
  const currentChartRef = useRef(null);
  const preApprovedChartRef = useRef(null);
  const approvedChartRef = useRef(null);
  const declinedChartRef = useRef(null);

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
  // new leads
  function formatLeadsData(leads) {
    const months = [
      "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
      "Sep 25", "Oct 25", "Nov 25", "Dec 25"
    ];

    // Initialize arrays for total leads and new leads count
    const totalLeads = new Array(12).fill(0);
    const newLeads = new Array(12).fill(0);

    // Process each lead and classify by month
    leads.forEach(lead => {
      const createdDate = new Date(lead.CreatedDate);
      const monthIndex = createdDate.getMonth(); // Get the month index (0-11)

      totalLeads[monthIndex] += 1; // Increment total leads count

      // Check if the lead is "New Lead"
      if(selectedTab === 0){
        if (lead.Status === "New Lead") {
          newLeads[monthIndex] += 1; // Increment new leads count
        }
      }
      if(selectedTab === 2){
        if (lead.Status === "Funded - Invoice EAZE Client") {
          newLeads[monthIndex] += 1; // Increment new leads count
        }
        
      }
      if(selectedTab === 3){
        if (lead.Status === "Declined - Client Does Not Meet Minimum Credit Requirements") {
          newLeads[monthIndex] += 1; // Increment new leads count
        }
        
      }
      if(selectedTab === 4){
        if (lead.Status === "Closed - Lost") {
          newLeads[monthIndex] += 1; // Increment new leads count
        }
        
      }
      
    });

    // Return the formatted JSON
    return {
      months,
      totalLeads,
      newLeads
    };
  }
  function formatLeadsDataNew( leads) {
    const months = [
      "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
      "Sep 25", "Oct 25", "Nov 25", "Dec 25"
    ];

    // Initialize arrays for total leads and new leads count
    const totalLeads = new Array(12).fill(0);
    const newLeads = new Array(12).fill(0);

    // Process each entry in totaldata for totalLeads
    totalApplications.forEach(lead => {
      const createdDate = new Date(lead.CreatedDate);
      const monthIndex = createdDate.getMonth(); // Get the month index (0-11)
      totalLeads[monthIndex] += 1; // Increment total leads count
    });

    // Process each entry in leads for newLeads
    leads.forEach(lead => {
      const createdDate = new Date(lead.CreatedDate);
      const monthIndex = createdDate.getMonth(); // Get the month index (0-11)
      newLeads[monthIndex] += 1; // Increment new leads count
    });

    // Return the formatted JSON
    return {
      months,
      totalLeads,
      newLeads
    };
}

  // current
  function formatChartData(leads) {
    // Count occurrences of each status
    const statusCount = {};

    leads.forEach(lead => {
      if (statusCount[lead.Status]) {
        statusCount[lead.Status] += 1;
      } else {
        statusCount[lead.Status] = 1;
      }
    });

    // Calculate total number of leads
    const totalLeads = leads.length;

    // Format the data for the PieChart with percentages
    const formattedData = Object.keys(statusCount).map(status => ({
      label: status,
      value: ((statusCount[status] / totalLeads) * 100).toFixed(2), // Calculate percentage
    }));

    return formattedData;
  }
  function formatPreApprovedData(leads) {
    console.log(leads, 'leads')
    // Filter for leads with "Pre-Approved - Client Has Not Scheduled Call With EAZE" status
    const filteredLeads = leads.filter(lead => lead.Status == 'Pre-Approved Pending Income Verification');
    console.log(filteredLeads, 'filteredLeads')
    // Sum the Loan_Amount__c for the filtered leads
    const totalLoanAmount = filteredLeads.reduce((sum, lead) => sum + lead.Loan_Amount__c, 0);

    // Format the data for the PieChart
    return [
      {
        label: 'Pre-Approved Pending Income Verification',
        value: totalLoanAmount,
      }
    ];
  }

  // aproved
  function calculatePercentageChange(selectedMonth, approvedLeads) {
    // Get current date and current year
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();  // Current month index (0 for January, 1 for February, etc.)
    const currentYear = currentDate.getFullYear();

    // Convert the selected month to month index (e.g., January -> 0, February -> 1, etc.)
    const selectedMonthIndex = new Date(Date.parse(selectedMonth + " 1, 2025")).getMonth();

    // Calculate the last month index (if selectedMonth is January, last month will be December of previous year)
    const lastMonthIndex = selectedMonthIndex - 1;
    const adjustedYear = lastMonthIndex < 0 ? currentYear - 1 : currentYear;
    const lastMonthDate = new Date(adjustedYear, lastMonthIndex, 1); // The first day of the last month
 let percentage = 0;
    if(selectedTab === 2){
      
      // Filter leads for the selected month
      const currentMonthLeads = approvedLeads.filter((lead) => {
          const leadDate = new Date(lead.CreatedDate);
          const leadMonthIndex = leadDate.getMonth();
          return leadMonthIndex === selectedMonthIndex && lead.Status === 'Funded - Invoice EAZE Client';
      });
  
      // Filter leads for the last month
      const lastMonthLeads = approvedLeads.filter((lead) => {
          const leadDate = new Date(lead.CreatedDate);
          const leadMonthIndex = leadDate.getMonth();
          return leadMonthIndex === lastMonthIndex && lead.Status === 'Funded - Invoice EAZE Client';
      });
  
      // Calculate the count of leads for both months
      const currentMonthCount = currentMonthLeads.length;
      const lastMonthCount = lastMonthLeads.length;
  
      // Calculate the percentage difference
     
      if (lastMonthCount > 0) {
          percentage = ((currentMonthCount / lastMonthCount) - 1) * 100; // Percentage difference
      } else {
          // If no leads in last month, set a high value or 0 based on your needs
          percentage = currentMonthCount > 0 ? 100 : 0;
      }
    }
    if(selectedTab==3 || selectedTab==4 || selectedTab==5 ){
      // Filter leads for the selected month
      const currentMonthLeads = approvedLeads.filter((lead) => {
          const leadDate = new Date(lead.CreatedDate);
          const leadMonthIndex = leadDate.getMonth();
          return leadMonthIndex === selectedMonthIndex 
      });
  
      // Filter leads for the last month
      const lastMonthLeads = approvedLeads.filter((lead) => {
          const leadDate = new Date(lead.CreatedDate);
          const leadMonthIndex = leadDate.getMonth();
          return leadMonthIndex === lastMonthIndex 
      });
  
      // Calculate the count of leads for both months
      const currentMonthCount = currentMonthLeads.length;
      const lastMonthCount = lastMonthLeads.length;
  
      // Calculate the percentage difference
     
      if (lastMonthCount > 0) {
          percentage = ((currentMonthCount / lastMonthCount) - 1) * 100; // Percentage difference
      } else {
          // If no leads in last month, set a high value or 0 based on your needs
          percentage = currentMonthCount > 0 ? 100 : 0;
      }
    }

    // Return the percentage value
    return percentage;
}


  // Fetch data when the component is mounted or when the tab changes
  useEffect(() => {
    // Trigger actions to fetch data based on the selected tab
    const fetchData = async () => {
      dispatch(getTotalApproved({ token: salesforceToken }));
      if (selectedTab === 0) {
        // New Applications
        console.log("Fetching New Applications...");
        await dispatch(getNewLead({ token: salesforceToken }));
      } else if (selectedTab === 1) {
        // Current Applications
        console.log("Fetching Current Applications...");
        await dispatch(getPreApprovedLead({ token: salesforceToken }));
      } else if (selectedTab === 2) {
        // Approved Applications
        console.log("Fetching Approved Applications...");
        await dispatch(getApprovedLead({ token: salesforceToken }));
      } else if (selectedTab === 3) {
        // Declined Applications
         dispatch(getTotalApplications({ token: salesforceToken }));
        console.log("Fetching Declined Applications...");
        await dispatch(getApplicationDeclineLead({ token: salesforceToken }));
        dispatch(getTotalDeclined({ token: salesforceToken }));
              dispatch(getTopDeclineReason({ token: salesforceToken }));
      } else if (selectedTab === 4) {
        // Closed Lost Applications
        console.log("Fetching Closed Lost Applications...");
        await dispatch(getClosedLost({ token: salesforceToken }));
      } else if (selectedTab === 5) {
        // All Declined Applications
        console.log("Fetching All Declined Applications...");
        await dispatch(getAllDeclined({ token: salesforceToken }));
      }
    };
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      fetchData();
    }


  }, [dispatch, selectedTab, salesforceToken]); // Fetch when the selectedTab changes

  useEffect(() => {
    let groupedData = {};
    // Log the data to the console
    if (newLeads.length > 0 && selectedTab === 0) {
      console.log("New Leads: ", newLeads);
      console.log("New Leads: ", newLeads.length);
      const sumLoanAmounts = newLeads
        .map(lead => lead.Loan_Amount__c)
        .filter(amount => amount !== null)  // Filter out nulls
        .map(amount => {
          // Ensure the value is a valid number
          const numericAmount = Number(amount);
          if (isNaN(numericAmount)) {
            console.warn(`Invalid Loan Amount: ${amount}`);
            return 0;  // Replace invalid amounts with 0
          }
          return numericAmount;
        })
        .reduce((acc, curr) => acc + curr, 0);

      console.log("Total Loan Amount: ", sumLoanAmounts);
      const formattedData = formatLeadsDataNew(newLeads);
      console.log("formattedData", formattedData);
      setNewLeadsChartData(formattedData);
      setTotalNewleadsAmount(sumLoanAmounts);
      setNewLeadCount(newLeads.map((m) => m.Status == 'New Lead').filter((m) => m).length);
      //   groupedData = groupLeadsByStatus(newLeads);
      // setGroupedLeads(Object.values(groupedData));
    }
    if (preApprovedLeads.length > 0 && selectedTab === 1) {
      console.log("Pre-Approved Leads: ", preApprovedLeads);
      groupedData = groupLeadsByStatus(preApprovedLeads);
      setGroupedLeads(Object.values(groupedData));
      setPreApprovedLeadsCount(preApprovedLeads.length);
      const sumLoanAmounts = preApprovedLeads
        .map(lead => lead.Loan_Amount__c)
        .filter(amount => amount !== null)  // Filter out nulls
        .map(amount => {
          // Ensure the value is a valid number
          const numericAmount = Number(amount);
          if (isNaN(numericAmount)) {
            console.warn(`Invalid Loan Amount: ${amount}`);
            return 0;  // Replace invalid amounts with 0
          }
          return numericAmount;
        })
        .reduce((acc, curr) => acc + curr, 0);
      console.log("Total Loan Amount: ", sumLoanAmounts);
      setTotalPreApprovedLeadsAmount(sumLoanAmounts);
      const formattedData = formatChartData(preApprovedLeads);
      console.log("Formatted Pie Chart Data:", formattedData);
      setChartData(formattedData);
      const formattedPreApprovedData = formatPreApprovedData(preApprovedLeads);
      console.log("Formatted Pie Chart Data:", formattedPreApprovedData);
      setPreApprovedChartData(formattedPreApprovedData);
    }
    if (approvedLeads.length > 0 && selectedTab === 2) {
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
            setThisMonthApprovedCount(filteredLeads.length);
            setThisMonthApprovedRevenue(filteredLeads.reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

            setTotalApprovedCount(approvedLeads.filter((f)=>f.Status === 'Funded - Invoice EAZE Client').length);
            setTotalApprovedRevenue(approvedLeads.filter((f)=>f.Status === 'Funded - Invoice EAZE Client').reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

           const percentageChange = calculatePercentageChange(selectedMonth, approvedLeads);
           setCompareToLastMonth(percentageChange);
           const formattedData=formatLeadsDataNew(approvedLeads);
           setApprovedChartData(formattedData);
           console.log(formattedData,'formattedData')
           console.log(`Percentage Change: ${percentageChange.toFixed(2)}%`);

      console.log("Approved Leads: ", approvedLeads);
      console.log("Approved Leads selectedMonth: ", selectedMonth);
      groupedData = groupLeadsByStatus(approvedLeads);
      setGroupedLeads(Object.values(groupedData));
    }
    if (applicationDeclinedLeads.length > 0 && selectedTab === 3) {
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
            setThisMonthDeclinedCount(filteredLeads.length);
            setThisMonthDeclinedRevenue(filteredLeads.reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

            setTotalDeclinedCount(applicationDeclinedLeads.length);
            setTotalDeclinedRevenue(applicationDeclinedLeads.reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

            const percentageChange = calculatePercentageChange(selectedMonth, applicationDeclinedLeads);
           setCompareToDeclinedLastMonth(percentageChange);
            const formattedData=formatLeadsDataNew(applicationDeclinedLeads);
           setDeclinedChartData(formattedData);
           const formattedDataPie = formatChartData(filteredLeads);
      console.log("Formatted Pie Chart Data:", formattedDataPie);
      setChartDeclinedData(formattedDataPie);
    }
    if (closedLostLeads.length > 0 && selectedTab === 4) {
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
            setThisMonthClosedLostCount(filteredLeads.length);
            setThisMonthClosedLostRevenue(filteredLeads.reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

            setTotalClosedLostCount(closedLostLeads.length);
            setTotalClosedLostRevenue(closedLostLeads.reduce((acc, lead) => acc + lead.Loan_Amount__c, 0));

            const percentageChange = calculatePercentageChange(selectedMonth, closedLostLeads);
           setCompareToClosedLostLastMonth(percentageChange);
            const formattedData=formatLeadsDataNew(closedLostLeads);
           setClosedLostChartData(formattedData);
           const formattedDataPie = formatChartData(filteredLeads);
      console.log("Formatted Pie Chart Data:", formattedDataPie);
      setChartClosedLostData(formattedDataPie);
    }

    if (allDeclinedLeads.length > 0 && selectedTab === 5) {
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
            setThisMonthDeclinedCountPreQualifier(filteredLeads.length);


            

            setDeclinedTotalPreQualifier(allDeclinedLeads.length);

            const percentageChange = calculatePercentageChange(selectedMonth, allDeclinedLeads);
           setCompareToDeclinedLastMonthPreQualifier(percentageChange);
            const formattedData=formatLeadsDataNew(allDeclinedLeads);
           setDeclinedPreQualifierChartData(formattedData);
           
    }
  }, [newLeads, preApprovedLeads, approvedLeads, applicationDeclinedLeads, closedLostLeads, allDeclinedLeads, selectedTab,selectedMonth]);

  useEffect(() => {
    const formattedData = formatLeadsData(newLeads);
    console.log("formattedData", formattedData);
    setNewLeadsChartData(formattedData);
  }, [newLeads]);

  // Cleanup function to destroy the chart instances before re-render
  useEffect(() => {
    // Destroy previous charts before rendering new ones
    if (currentChartRef.current) {
      currentChartRef.current.destroy();
    }
    if (preApprovedChartRef.current) {
      preApprovedChartRef.current.destroy();
    }
    if (approvedChartRef.current) {
      approvedChartRef.current.destroy();
    }
    if (declinedChartRef.current) {
      declinedChartRef.current.destroy();
    }
  }, [selectedTab]); // This will trigger when selectedTab changes (tab switch)

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* RIGHT SIDE - CARDS + CHART (40%) */}
        {selectedTab === 0 && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CARD 1 - New Applications */}
                <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                  <AiOutlineFile className="h-8 w-8 text-gray-500" />  {/* Icon */}
                  <div>
                    <div className="text-gray-500 text-sm">New Applications</div>
                    <div className="text-3xl font-semibold mt-2">{newLeadCount}</div>
                  </div>
                </div>

                {/* CARD 2 - Revenue Overview */}
                <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                  <FiDollarSign className="h-8 w-8 text-gray-500" />  {/* Icon */}
                  <div>
                    <div className="text-gray-500 text-sm">Revenue</div>
                    <div className="text-3xl font-semibold mt-2">${totalNewleadsAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* CHART - Monthly Summary */}
              <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>

                {newLeadsChartData?.months.length > 0 ||
                  newLeadsChartData?.totalLeads.length > 0 ||
                  newLeadsChartData?.newLeads.length > 0 ? (
                  <BarChart
                    xAxis={[{ data: newLeadsChartData.months }]} // Pass months as the x-axis labels
                    series={[
                      { data: newLeadsChartData.totalLeads, label: 'Total', id: 'pvId' }, // Total leads series
                      { data: newLeadsChartData.newLeads, label: 'New Leads', id: 'uvId' },   // New leads series
                    ]}
                    height={300}
                  />
                ) : (
                  <div>No data available</div> // Fallback message when no data exists
                )}
              </div>

            </div>
          </>
        )}


        {/* ====================== CURRENT TAB RIGHT PANEL ====================== */}
        {selectedTab === 1 && (
          <div className="lg:col-span-2 space-y-6">
            {/* CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 - Current Applications */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Current Applications</div>
                  <div className="text-3xl font-semibold mt-2">{preApprovedLeadsCount}</div>
                </div>
                <div className="text-4xl text-gray-500">
                  <AiOutlineUser />
                </div>
              </div>

              {/* CARD 2 - Revenue in-progress */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Revenue in-progress</div>
                  <div className="text-3xl font-semibold mt-2">${totalPreApprovedLeadsAmount.toLocaleString()}</div>
                </div>
                <div className="text-4xl text-green-500">
                  <FiCheckCircle />
                </div>
              </div>
            </div>

            {/* DONUT CHART CARD #1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Current</h2>
              <div className="flex items-center justify-between">
                <div className="w-full">
                  {/* <PieChart
                    series={[{
                      data: desktopOS,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      valueFormatter,
                    }]}
                    height={200}
                    width={200}
                  /> */}
                  {chartData.length > 0 ? (
                    <PieChart
                      series={[{
                        data: chartData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                      }]}
                      height={200}
                      width={200}
                    />
                  ) : (
                    <div>No data available</div>
                  )}
                </div>
                {/* <div className="text-sm text-gray-600 flex items-center">
                  <HiOutlineChartPie className="h-5 w-5 mr-2" />
                  <span>Current Data</span>
                </div> */}
              </div>
            </div>

            {/* DONUT CHART CARD #2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Pre-Approved Pending Income Verification
              </h2>
              <div className="flex items-center justify-between">
                <div className="w-full">
                  {preApprovedChartData.length > 0 ? (
                    <PieChart
                      series={[{
                        data: preApprovedChartData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      }]}
                      height={200}
                      width={200}
                    />
                  ) : (
                    <div>No data available</div>
                  )}
                </div>
                {/* <div className="text-sm text-right font-semibold mt-4">
                  <div className="text-right font-semibold mt-4">$27,000.00</div>
                  <div className="flex items-center justify-end text-gray-500 mt-2">
                    <HiOutlineChartPie className="h-5 w-5 mr-2" />
                    <span>Pending Income Verification</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* ====================== APPROVED TAB RIGHT PANEL ====================== */}
        {selectedTab === 2 && (
          <div className="lg:col-span-2 space-y-6">
            {/* CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 - Compare to last month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Compare to last month</div>
                  <div className="text-3xl font-semibold mt-2">{compareToLastMonth}%</div>
                </div>
                <div className="text-4xl text-green-500">
                  <FiCheckCircle /> {/* Checkmark icon */}
                </div>
              </div>

              {/* CARD 2 - This Month Approved */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">This Month Approved</div>
                  <div className="text-3xl font-semibold mt-2">{thisMonthApprovedCount}</div>
                </div>
                <div className="text-4xl text-green-500">
                  <FiCheckCircle /> {/* Checkmark icon */}
                </div>
              </div>
            </div>

            {/* CARDS 3 & 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 3 - This Month Revenue */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">This Month Revenue</div>
                  <div className="text-3xl font-semibold mt-2">${thisMonthApprovedRevenue.toLocaleString()}</div>
                </div>
                <div className="text-4xl text-yellow-500">
                  <HiCurrencyDollar /> {/* Dollar icon */}
                </div>
              </div>

              {/* CARD 4 - Total Approved */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Total Approved</div>
                  <div className="text-3xl font-semibold mt-2">{totalApprovedCount}</div>
                </div>
                <div className="text-4xl text-green-500">
                  <FiCheckCircle /> {/* Checkmark icon */}
                </div>
              </div>
            </div>

            {/* CARD 5 - Total Revenue */}
            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">Total Revenue</div>
                <div className="text-3xl font-semibold mt-2">${totalApprovedRevenue.toLocaleString()}</div>
              </div>
              <div className="text-4xl text-blue-500">
                <GiMoneyStack /> {/* Money stack icon */}
              </div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              {/* <Bar data={chartData} options={chartOptions} /> */}
              {approvedChartData?.months.length > 0 ||
                  approvedChartData?.totalLeads.length > 0 ||
                  approvedChartData?.newLeads.length > 0 ? (
                  <BarChart
                    xAxis={[{ data: approvedChartData.months }]} // Pass months as the x-axis labels
                    series={[
                      { data: approvedChartData.totalLeads, label: 'Total', id: 'pvId' }, // Total leads series
                      { data: approvedChartData.newLeads, label: 'Approved', id: 'uvId' },   // New leads series
                    ]}
                    height={300}
                  />
                ) : (
                  <div>No data available</div> // Fallback message when no data exists
                )}
            </div>
          </div>
        )}

        {/* ====================== DECLINED TAB RIGHT PANEL ====================== */}
        {/* RIGHT SIDE - CARDS + CHART (40%) */}
        {selectedTab === 3 && (  // This will render when the "Declined" tab is selected
          <div className="lg:col-span-2 space-y-6">
            {/* First Row - Card 1 and Card 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 - Declined This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{thisMonthDeclinedCount}</div>
                  <div className="text-gray-500 text-sm mt-2">Declined This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Declined */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{totalDeclinedCount}</div>
                  <div className="text-gray-500 text-sm mt-2">Total Declined</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>
            </div>

            {/* Second Row - Card 3 and Card 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 3 - Decline in Applications From Last Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold text-red-500">{compareToDeclinedLastMonth.toLocaleString()}%</div>
                  <div className="text-gray-500 text-sm mt-2">Decline in Applications From Last Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <FaExclamationCircle /> {/* Warning Icon */}
                </div>
              </div>

              {/* CARD 4 - Declined in Revenue This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">${thisMonthDeclinedRevenue.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm mt-2">Declined in Revenue This Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <HiCurrencyDollar /> {/* Dollar Icon */}
                </div>
              </div>
            </div>

            {/* Third Row - Card 5 and Card 6 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 5 - Top Declined Reason */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-semibold">${totalApplications.filter((m)=>m.Status==topDeclineReason?.decline_reason).map(item => item.Loan_Amount__c || 0).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</div>
                <div className="text-gray-500 text-sm mt-1 font-semibold">
                  Top Declined Reason:
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {topDeclineReason?.decline_reason}
                </div>
              </div>

              {/* CARD 6 - Declined in Revenue */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">${totalDeclinedRevenue.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm mt-2">Declined in Revenue</div>
                </div>
                <div className="text-4xl text-red-500">
                  <HiCurrencyDollar /> {/* Dollar Icon */}
                </div>
              </div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              {/* <Bar data={chartData} options={chartOptions} /> */}
               {declinedChartData?.months.length > 0 ||
                  declinedChartData?.totalLeads.length > 0 ||
                  declinedChartData?.newLeads.length > 0 ? (
                  <BarChart
                    xAxis={[{ data: declinedChartData.months }]} // Pass months as the x-axis labels
                    series={[
                      { data: declinedChartData.totalLeads, label: 'Total', id: 'pvId' }, // Total leads series
                      { data: declinedChartData.newLeads, label: 'Declined', id: 'uvId' },   // New leads series
                    ]}
                    height={300}
                  />
                ) : (
                  <div>No data available</div> // Fallback message when no data exists
                )}
            </div>
          </div>
        )}
        {/* ====================== closed Lost TAB RIGHT PANEL ====================== */}
        {/* RIGHT SIDE - CARDS + CHART (40%) */}
        {selectedTab === 4 && (  // This will render when the "Declined" tab is selected
          <div className="lg:col-span-2 space-y-6">
            {/* First Row - Card 1 and Card 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 - Closed This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{thisMonthClosedLostCount}</div>
                  <div className="text-gray-500 text-sm mt-2">Closed This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Lost */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{totalClosedLostCount}</div>
                  <div className="text-gray-500 text-sm mt-2">Total Lost</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>
            </div>

            {/* Second Row - Card 3 and Card 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 3 - Lost in Applications From Last Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold text-red-500">{compareToClosedLostLastMonth}%</div>
                  <div className="text-gray-500 text-sm mt-2">Lost in Applications From Last Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <FaExclamationCircle /> {/* Warning Icon */}
                </div>
              </div>

              {/* CARD 4 - Lost in Revenue This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">${thisMonthClosedLostRevenue.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm mt-2">Lost in Revenue This Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <HiCurrencyDollar /> {/* Dollar Icon */}
                </div>
              </div>
            </div>

            {/* Third Row - Card 5 and Card 6 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 5 - Top Lost Reason */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-semibold">$44,659,530</div>
                <div className="text-gray-500 text-sm mt-1 font-semibold">
                  Top Lost Reason:
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Closed Lost - Terms Pitched - Client Did Not Move Forward With Offer
                </div>
              </div>

              {/* CARD 6 - Lost in Revenue */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">${totalClosedLostRevenue.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm mt-2">Lost in Revenue</div>
                </div>
                <div className="text-4xl text-red-500">
                  <HiCurrencyDollar /> {/* Dollar Icon */}
                </div>
              </div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              {/* <Bar data={chartData} options={chartOptions} /> */}
              {closedLostChartData?.months.length > 0 ||
                  closedLostChartData?.totalLeads.length > 0 ||
                  closedLostChartData?.newLeads.length > 0 ? (
                  <BarChart
                    xAxis={[{ data: closedLostChartData.months }]} // Pass months as the x-axis labels
                    series={[
                      { data: closedLostChartData.totalLeads, label: 'Total', id: 'pvId' }, // Total leads series
                      { data: closedLostChartData.newLeads, label: 'Closed Lost', id: 'uvId' },   // New leads series
                    ]}
                    height={300}
                  />
                ) : (
                  <div>No data available</div> // Fallback message when no data exists
                )}
            </div>
          </div>
        )}

        {/* ======================= Declined - Pre-Qualifier =============================================== */}
        {selectedTab === 5 && (  // This will render when the "Declined" tab is selected
          <div className="lg:col-span-2 space-y-6">
            {/* First Row - Card 1 and Card 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 - Closed This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{thisMonthDeclinedCountPreQualifier}</div>
                  <div className="text-gray-500 text-sm mt-2">Declined This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Lost */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">{declinedTotalPreQualifier}</div>
                  <div className="text-gray-500 text-sm mt-2">Total Declined</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-3xl font-semibold text-red-500">{compareToDeclinedLastMonthPreQualifier}%</div>
                <div className="text-gray-500 text-sm mt-2">Decline in Applications From Last Month</div>
              </div>
              <div className="text-4xl text-red-500">
                <FaExclamationCircle /> {/* Warning Icon */}
              </div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              {/* <Bar data={chartData} options={chartOptions} /> */}
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
          </div>
        )}
        {/* LEFT SIDE - TABLE (60%) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
          <LeadTabs onTabChange={setSelectedTab} data={groupedLeads} onMonthChange={setSelectedMonth} />
          {/* DONUT CHART CARD */}
          {selectedTab === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Declined Stats</h2>
              <div className="flex items-center justify-between">
                <div className="w-full">
                  {/* <Doughnut data={declinedChart} ref={declinedChartRef} /> */}
                   {chartDeclinedData.length > 0 ? (
                    <PieChart
                      series={[{
                        data: chartDeclinedData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                      }]}
                      height={200}
                      width={200}
                    />
                  ) : (
                    <div>No data available</div>
                  )}
                </div>

                
              </div>
            </div>
          )}
          {selectedTab === 4 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Closed Stats</h2>
              <div className="flex items-center justify-between">
                <div className="w-full">
                  {/* <Doughnut data={declinedChart} ref={declinedChartRef} /> */}
                  {chartClosedLostData.length > 0 ? (
                    <PieChart
                      series={[{
                        data: chartClosedLostData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                      }]}
                      height={200}
                      width={200}
                    />
                  ) : (
                    <div>No data available</div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ApplicationsPage;

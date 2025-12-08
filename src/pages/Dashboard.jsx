import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalApplicationsThisMonth, getTotalApplications, getApprovedThisMonth, getTotalApproved, getDeclinedThisMonth, getTotalDeclined, getPreApprovedThisMonth, getTotalPreApproved } from '../store/slices/dashboardSlice'; // Ensure correct imports
import { getSalesforceToken } from '../store/slices/authSlice'; // Ensure correct import
import { BarChart } from '@mui/x-charts/BarChart';
import PopupModal from '../components/PopupModal';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
      width: 60,
    },
  ],
  height: 300,
};
export const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'Feb',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'Mar',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'Apr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'Aug',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'Sept',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'Oct',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'Nov',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'Dec',
  },
];

export function valueFormatter(value) {
  return `${value}mm`;
}
const DeclinedSummaryCard = ({ declinePercent, topDeclineReason }) => (
  <div className="w-full bg-white rounded-xl shadow-sm p-6 flex items-center justify-between mb-6 mt-5">
    <div>
      <p className="text-3xl font-bold text-[#0A2156]">{declinePercent}%</p>
      <p className="text-sm text-gray-500">Total Declined</p>
    </div>
    <div className="text-center">
      <p className="text-3xl font-bold text-[#0A2156]">$80,000</p>
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
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month' }]}
      series={[
        { dataKey: 'london', label: 'London', valueFormatter },
        { dataKey: 'paris', label: 'Paris', valueFormatter },
        { dataKey: 'newYork', label: 'New York', valueFormatter },
        { dataKey: 'seoul', label: 'Seoul', valueFormatter },
      ]}
      {...chartSetting}
    />
    </div>
  );
};


function Dashboard() {
  const dispatch = useDispatch();
  const [leadsData, setLeadsData] = useState([]); 
  const { salesforceToken } = useSelector((state) => state.auth);
  const {
    totalApplicationsThisMonth,
    approvedApplicationsThisMonth,
    declinedApplicationsThisMonth,
    totalApplications,
    totalApproved,
    totalDeclined,
    totalPreApproved,
  } = useSelector((state) => state.dashboard);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Jan 25');

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
    } else {
      dispatch(getTotalApplicationsThisMonth({ token: salesforceToken }));
      dispatch(getApprovedThisMonth({ token: salesforceToken }));
      dispatch(getDeclinedThisMonth({ token: salesforceToken }));
      dispatch(getTotalApplications({ token: salesforceToken }));
      dispatch(getTotalApproved({ token: salesforceToken }));
      dispatch(getTotalDeclined({ token: salesforceToken }));
      dispatch(getTotalPreApproved({ token: salesforceToken }));
    }
  }, [dispatch, salesforceToken]);

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
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Applications This Month</h3>
          <p className="text-2xl font-bold mt-2">{0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Approved This Month</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Declined This Month</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Pre-Approved This Month</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Total Applications</h3>
          <p className="text-2xl font-bold mt-2">{0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Total Approved</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Total Declined</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md" onClick={openModal}>
          <h3 className="text-gray-500 text-sm">Total Pre-Approved</h3>
          <p className="text-2xl font-bold mt-2">${0}</p>
        </div>
      </div>

      <DeclinedSummaryCard
        declinePercent="5.45"
        topDeclineReason="Client Does Not Meet Minimum Credit Requirements"
      />

      {/* Monthly Summary Chart */}
      <MonthlySummaryChart/>

      <PopupModal isOpen={isModalOpen} onClose={closeModal} title="Declined Summary" content="Declined — Client Does Not Meet Minimum Credit Requirements" />
    </div>
  );
}

export default Dashboard;

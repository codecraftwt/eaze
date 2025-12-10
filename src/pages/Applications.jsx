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
  const [selectedTab, setSelectedTab] = useState(0);

  // Store the chart instances using useRef
  const currentChartRef = useRef(null);
  const preApprovedChartRef = useRef(null);
  const approvedChartRef = useRef(null);
  const declinedChartRef = useRef(null);
  // Example chart data
  const chartData = {
    labels: ["Dec 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25"],
    datasets: [
      {
        label: "New Leads",
        data: [5, 10, 7, 12, 8, 15],
        backgroundColor: "rgba(0, 123, 255, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  // ===================== CURRENT TAB — DONUT CHART DATA =====================
  const currentChart = {
    labels: [
      "Pre-Approved - Client Has Not Scheduled Call With EAZE",
      "Booked with Eaze",
      "Client has accepted terms",
      "All Docs In",
      "Terms Pitched",
    ],
    datasets: [
      {
        data: [1, 15, 6, 1, 2],
        backgroundColor: [
          "#b8b6cc",
          "#25316D",
          "#4052A1",
          "#000000",
          "#7B7D9C",
        ],
      },
    ],
  };

  const preApprovedChart = {
    labels: ["Pre-Approved Pending Income Verification"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["#c7c5d6"],
      },
    ],
  };

  // ===================== APPROVED TAB — DONUT CHART DATA =====================
  const approvedChart = {
    labels: ["This Month Approved", "Total Approved"],
    datasets: [
      {
        data: [5, 137], // Example numbers for "This Month Approved" and "Total Approved"
        backgroundColor: ["#28A745", "#FFC107"],
      },
    ],
  };

  // ===================== DECLINED TAB — DONUT CHART DATA =====================
  const declinedChart = {
    labels: ["Declined - Client Does Not Meet Minimum Credit Requirements"],
    datasets: [
      {
        data: [19], // Example number for "Declined This month"
        backgroundColor: ["#DC3545"],
      },
    ],
  };


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
                    <div className="text-3xl font-semibold mt-2">0</div>
                  </div>
                </div>

                {/* CARD 2 - Revenue Overview */}
                <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                  <FiDollarSign className="h-8 w-8 text-gray-500" />  {/* Icon */}
                  <div>
                    <div className="text-gray-500 text-sm">Revenue</div>
                    <div className="text-3xl font-semibold mt-2">$0</div>
                  </div>
                </div>
              </div>

              {/* CHART - Monthly Summary */}
              <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
                {/* <Bar data={chartData} options={chartOptions} /> */}
                <BarChart
                  xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
                  series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                  height={300}
                />
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
                  <div className="text-3xl font-semibold mt-2">26</div>
                </div>
                <div className="text-4xl text-gray-500">
                  <AiOutlineUser />
                </div>
              </div>

              {/* CARD 2 - Revenue in-progress */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Revenue in-progress</div>
                  <div className="text-3xl font-semibold mt-2">$376,100</div>
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
                <div className="w-48">
                  <PieChart
                    series={[{
                      data: desktopOS,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      valueFormatter,
                    }]}
                    height={200}
                    width={200}
                  />
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <HiOutlineChartPie className="h-5 w-5 mr-2" />
                  <span>Current Data</span>
                </div>
              </div>
            </div>

            {/* DONUT CHART CARD #2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Pre-Approved - Client Has Not Scheduled Call With EAZE
              </h2>
              <div className="flex items-center justify-between">
                <div className="w-48">
                  <PieChart
                    series={[{
                      data: desktopOS,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      valueFormatter,
                    }]}
                    height={200}
                    width={200}
                  />
                </div>
                <div className="text-sm text-right font-semibold mt-4">
                  <div className="text-right font-semibold mt-4">$27,000.00</div>
                  <div className="flex items-center justify-end text-gray-500 mt-2">
                    <HiOutlineChartPie className="h-5 w-5 mr-2" />
                    <span>Pending Income Verification</span>
                  </div>
                </div>
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
                  <div className="text-3xl font-semibold mt-2">200.00%</div>
                </div>
                <div className="text-4xl text-green-500">
                  <FiCheckCircle /> {/* Checkmark icon */}
                </div>
              </div>

              {/* CARD 2 - This Month Approved */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">This Month Approved</div>
                  <div className="text-3xl font-semibold mt-2">5</div>
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
                  <div className="text-3xl font-semibold mt-2">$47,500</div>
                </div>
                <div className="text-4xl text-yellow-500">
                  <HiCurrencyDollar /> {/* Dollar icon */}
                </div>
              </div>

              {/* CARD 4 - Total Approved */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-gray-500 text-sm">Total Approved</div>
                  <div className="text-3xl font-semibold mt-2">137</div>
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
                <div className="text-3xl font-semibold mt-2">$2,447,515</div>
              </div>
              <div className="text-4xl text-blue-500">
                <GiMoneyStack /> {/* Money stack icon */}
              </div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              {/* <Bar data={chartData} options={chartOptions} /> */}
              <BarChart
                xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                height={300}
              />
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
                  <div className="text-3xl font-semibold">19</div>
                  <div className="text-gray-500 text-sm mt-2">Declined This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Declined */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">1426</div>
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
                  <div className="text-3xl font-semibold text-red-500">79.17%</div>
                  <div className="text-gray-500 text-sm mt-2">Decline in Applications From Last Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <FaExclamationCircle /> {/* Warning Icon */}
                </div>
              </div>

              {/* CARD 4 - Declined in Revenue This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">$193,500</div>
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
                <div className="text-3xl font-semibold">$44,659,530</div>
                <div className="text-gray-500 text-sm mt-1 font-semibold">
                  Top Declined Reason:
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  Declined - Client Does Not Meet Minimum Credit Requirements
                </div>
              </div>

              {/* CARD 6 - Declined in Revenue */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">$51,440,248</div>
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
              <BarChart
                xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                height={300}
              />
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
                  <div className="text-3xl font-semibold">11</div>
                  <div className="text-gray-500 text-sm mt-2">Closed This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Lost */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">482</div>
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
                  <div className="text-3xl font-semibold text-red-500">79.17%</div>
                  <div className="text-gray-500 text-sm mt-2">Lost in Applications From Last Month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <FaExclamationCircle /> {/* Warning Icon */}
                </div>
              </div>

              {/* CARD 4 - Lost in Revenue This Month */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">$193,500</div>
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
                  <div className="text-3xl font-semibold">$51,440,248</div>
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
              <BarChart
                xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                height={300}
              />
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
                  <div className="text-3xl font-semibold">11</div>
                  <div className="text-gray-500 text-sm mt-2">Declined This month</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>

              {/* CARD 2 - Total Lost */}
              <div className="bg-white p-6 rounded-lg shadow flex justify-between">
                <div>
                  <div className="text-3xl font-semibold">482</div>
                  <div className="text-gray-500 text-sm mt-2">Total Declined</div>
                </div>
                <div className="text-4xl text-red-500">
                  <AiOutlineCloseCircle /> {/* Decline Icon */}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-3xl font-semibold text-red-500">79.17%</div>
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
              <BarChart
                xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                height={300}
              />
            </div>
          </div>
        )}
        {/* LEFT SIDE - TABLE (60%) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
          <LeadTabs onTabChange={setSelectedTab} />
          {/* DONUT CHART CARD */}
          {selectedTab === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Declined Stats</h2>
              <div className="flex items-center justify-between">
                <div className="w-48">
                  {/* <Doughnut data={declinedChart} ref={declinedChartRef} /> */}
                  <PieChart
                    series={[
                      {
                        data: desktopOS,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                      },
                    ]}
                    height={200}
                    width={200}
                  />
                </div>

                <div className="text-sm">
                  {/* <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: declinedChart.datasets[0].backgroundColor[0] }}
                    ></span>
                    Declined - Client Does Not Meet Minimum Credit Requirements
                  </div> */}
                  <div className="text-right font-semibold mt-4">$44,659,530</div>
                </div>
              </div>
            </div>
          )}
          {selectedTab === 4 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Closed Stats</h2>
              <div className="flex items-center justify-between">
                <div className="w-48">
                  {/* <Doughnut data={declinedChart} ref={declinedChartRef} /> */}
                  <PieChart
                    series={[
                      {
                        data: desktopOS,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                      },
                    ]}
                    height={200}
                    width={200}
                  />
                </div>

                <div className="text-sm">
                  {/* <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: declinedChart.datasets[0].backgroundColor[0] }}
                    ></span>
                    Declined - Client Does Not Meet Minimum Credit Requirements
                  </div> */}
                  <div className="text-right font-semibold mt-4">$44,659,530</div>
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

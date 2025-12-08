import React, { useEffect, useRef, useState } from "react";
import LeadTabs from "../components/LeadTabs.jsx";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
        {/* LEFT SIDE - TABLE (60%) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
          <LeadTabs onTabChange={setSelectedTab} />
          {/* DONUT CHART CARD */}
          {selectedTab === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Declined Stats</h2>
              <div className="flex items-center justify-between">
                <div className="w-48">
                  <Doughnut data={declinedChart} ref={declinedChartRef} />
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: declinedChart.datasets[0].backgroundColor[0] }}
                    ></span>
                    Declined - Client Does Not Meet Minimum Credit Requirements
                  </div>
                  <div className="text-right font-semibold mt-4">$44,659,530</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - CARDS + CHART (40%) */}
        {selectedTab === 0 && (
          <div className="lg:col-span-2 space-y-6">
            {/* CARD 1 - New Applications */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">New Applications</div>
              <div className="text-3xl font-semibold mt-2">0</div>
            </div>

            {/* CARD 2 - Revenue Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Revenue</div>
              <div className="text-3xl font-semibold mt-2">$0</div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* ====================== CURRENT TAB RIGHT PANEL ====================== */}
        {selectedTab === 1 && (
          <div className="lg:col-span-2 space-y-6">
            {/* CARDS */}
            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">Current Applications</div>
                <div className="text-3xl font-semibold mt-2">26</div>
              </div>
              <div className="text-4xl">👤</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">Revenue in-progress</div>
                <div className="text-3xl font-semibold mt-2">$376,100</div>
              </div>
              <div className="text-4xl">✔</div>
            </div>

            {/* DONUT CHART CARD #1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Current</h2>

              <div className="flex items-center justify-between">
                <div className="w-48">
                  <Doughnut data={currentChart} ref={currentChartRef} />
                </div>

                <ul className="text-sm space-y-2">
                  {currentChart.labels.map((label, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            currentChart.datasets[0].backgroundColor[i],
                        }}
                      ></span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DONUT CHART CARD #2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Pre-Approved - Client Has Not Scheduled Call With EAZE
              </h2>

              <div className="flex items-center justify-between">
                <div className="w-48">
                  <Doughnut data={preApprovedChart} ref={preApprovedChartRef} />
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          preApprovedChart.datasets[0].backgroundColor[0],
                      }}
                    ></span>
                    Pre-Approved Pending Income Verification
                  </div>

                  <div className="text-right font-semibold mt-4">$27,000.00</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================== APPROVED TAB RIGHT PANEL ====================== */}
        {selectedTab === 2 && (
          <div className="lg:col-span-2 space-y-6">
            {/* CARDS */}
            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">This Month Approved</div>
                <div className="text-3xl font-semibold mt-2">5</div>
              </div>
              <div className="text-4xl">✅</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">This Month Revenue</div>
                <div className="text-3xl font-semibold mt-2">$47,500</div>
              </div>
              <div className="text-4xl">💰</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">Total Approved</div>
                <div className="text-3xl font-semibold mt-2">137</div>
              </div>
              <div className="text-4xl">✅</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow flex justify-between">
              <div>
                <div className="text-gray-500 text-sm">Total Revenue</div>
                <div className="text-3xl font-semibold mt-2">$2,447,515</div>
              </div>
              <div className="text-4xl">💵</div>
            </div>

            {/* DONUT CHART CARD #1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Approved</h2>

              <div className="flex items-center justify-between">
                <div className="w-48">
                  <Doughnut data={approvedChart} ref={approvedChartRef} />
                </div>

                <ul className="text-sm space-y-2">
                  {approvedChart.labels.map((label, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: approvedChart.datasets[0].backgroundColor[i],
                        }}
                      ></span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DONUT CHART CARD #2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Pre-Approved - Client Has Not Scheduled Call With EAZE
              </h2>

              <div className="flex items-center justify-between">
                <div className="w-48">
                  <Doughnut data={preApprovedChart} ref={preApprovedChartRef} />
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: preApprovedChart.datasets[0].backgroundColor[0],
                      }}
                    ></span>
                    Pre-Approved Pending Income Verification
                  </div>

                  <div className="text-right font-semibold mt-4">$27,000.00</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDE - CARDS + CHART (40%) */}
        {selectedTab === 3 && (  // This will render when the "Declined" tab is selected
          <div className="lg:col-span-2 space-y-6">

            {/* CARD 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold">19</div>
              <div className="text-gray-500 text-sm mt-2">Declined This month</div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold">1426</div>
              <div className="text-gray-500 text-sm mt-2">Total Declined</div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold text-red-500">79.17%</div>
              <div className="text-gray-500 text-sm mt-2">Decline in Applications From Last Month</div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold">$193,500</div>
              <div className="text-gray-500 text-sm mt-2">Declined in Revenue This Month</div>
            </div>

            {/* CARD 5 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold">$44,659,530</div>
              <div className="text-gray-500 text-sm mt-1 font-semibold">
                Top Declined Reason:
              </div>
              <div className="text-gray-600 text-xs mt-1">
                Declined - Client Does Not Meet Minimum Credit Requirements
              </div>
            </div>

            {/* CARD 6 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-semibold">$51,440,248</div>
              <div className="text-gray-500 text-sm mt-2">Declined in Revenue</div>
            </div>

            {/* CHART - Monthly Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
              <Bar data={chartData} options={chartOptions} />
            </div>

            
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;

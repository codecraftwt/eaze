import { getSalesforceToken } from "../store/slices/authSlice";
import { getCashCollectedLastMonth, getCashCollectedThisMonth, getTotalApplications } from "../store/slices/dashboardSlice";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Seeded random number generator for consistent data per month
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
const clientNames = [
  "Tech Solutions Inc",
  "Construction Plus",
  "Healthcare Group",
  "Retail Chain Co",
  "Manufacturing Ltd",
  "Logistics Express",
  "Food Services Inc",
  "Auto Dealers Group",
  "Property Mgmt Co",
  "Cleaning Services",
  "Security Systems",
  "Event Planners LLC",
  "Printing Press Co",
  "Wellness Center",
  "Import Export Ltd",
  "Digital Marketing Co",
  "Solar Energy Inc",
  "Fitness Chain",
  "Legal Partners LLP",
  "Hospitality Group",
  "ABC Retail",
  "Quick Services",
  "Metro Supplies",
  "City Bakery",
  "Prime Auto",
  "Fresh Foods Co",
  "Urban Fitness",
  "Tech Repairs",
  "Green Gardens",
  "Style Salon",
  "Quick Print",
  "Home Comfort",
  "Pet Paradise",
  "Clean Pro",
  "Daily Deli",
  "Smart Electronics",
  "Cozy Cafe",
  "Fast Freight",
  "Beauty Box",
  "Local Motors",
];
const industries = [
  "Technology",
  "Construction",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Logistics",
  "Food & Beverage",
  "Automotive",
  "Real Estate",
  "Services",
  "Security",
  "Events",
  "Printing",
  "Trade",
  "Marketing",
  "Energy",
  "Fitness",
  "Legal",
  "Hospitality",
  "Wholesale",
  "Beauty",
  "HVAC",
  "Pet Services",
  "Cleaning",
];
const programs = ["eazecap", "platinum", "diamond", "elite"];
const terms = ["6 months", "12 months", "18 months", "24 months", "36 months"];
// Cache for generated monthly data to ensure consistency across all components
const monthlyDataCache = new Map();
function getCacheKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}
// Generate applications for a specific month (cached)
export function generateMonthlyApplications(targetDate, count = 50) {
  const cacheKey = getCacheKey(targetDate);
  // Return cached data if available
  if (monthlyDataCache.has(cacheKey)) {
    return monthlyDataCache.get(cacheKey);
  }
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);
  const today = new Date();
  // Use month and year as seed for consistent data per month
  const seed = targetDate.getMonth() + targetDate.getFullYear() * 12;
  // Only generate dates up to today if viewing current month
  const maxDate = isSameMonth(targetDate, today) ? today : monthEnd;
  const availableDays = eachDayOfInterval({ start: monthStart, end: maxDate });
  if (availableDays.length === 0) {
    monthlyDataCache.set(cacheKey, []);
    return [];
  }
  const applications = [];
  for (let i = 0; i < count; i++) {
    const itemSeed = seed * 1000 + i;
    const random = () => seededRandom(itemSeed + applications.length);
    // Pick a random day within the month
    const dayIndex = Math.floor(random() * availableDays.length);
    const appDate = availableDays[dayIndex];
    // Determine status with better variety using item-specific seed
    const statusRoll = seededRandom(itemSeed * 7 + i * 13);
    let status;
    // More evenly distributed statuses for variety
    if (statusRoll < 0.2) {
      status = "Submitted";
    } else if (statusRoll < 0.35) {
      status = "In Review";
    } else if (statusRoll < 0.55) {
      status = "Approved";
    } else if (statusRoll < 0.85) {
      status = "Funded";
    } else {
      status = "Disqualified";
    }
    // Better program distribution using different seed
    const programRoll = seededRandom(itemSeed * 11 + i * 17);
    const program = programs[Math.floor(programRoll * programs.length)];
    const clientIndex = Math.floor(random() * clientNames.length);
    const industryIndex = Math.floor(random() * industries.length);
    // Amount between $5,000 and $30,000
    const amount = Math.round((5000 + random() * 25000) / 1000) * 1000;
    applications.push({
      id: `${program.toUpperCase().slice(0, 2)}-${String(i + 1).padStart(3, "0")}`,
      name: clientNames[clientIndex],
      client: clientNames[clientIndex],
      industry: industries[industryIndex],
      amount,
      term: terms[Math.floor(random() * terms.length)],
      status,
      date: appDate,
      dateStr: format(appDate, "MMM dd, yyyy"),
      contact: `contact@${clientNames[clientIndex].toLowerCase().replace(/[^a-z]/g, "")}.com`,
      program,
    });
  }
  // Sort by date descending (most recent first)
  const sortedApps = applications.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
  // Cache the result
  monthlyDataCache.set(cacheKey, sortedApps);
  return sortedApps;
}
// Get stats for a specific month
export function getMonthlyStats(targetDate) {
  const applications = generateMonthlyApplications(targetDate, 50);
  const submitted = applications.filter((a) => a.status === "Submitted").length;
  const inReview = applications.filter((a) => a.status === "In Review").length;
  const approved = applications.filter((a) => a.status === "Approved").length;
  const funded = applications.filter((a) => a.status === "Funded").length;
  const disqualified = applications.filter(
    (a) => a.status === "Disqualified",
  ).length;
  const totalFunded = applications
    .filter((a) => a.status === "Funded")
    .reduce((sum, a) => sum + a.amount, 0);
  const totalPending = applications
    .filter((a) => ["Submitted", "In Review", "Approved"].includes(a.status))
    .reduce((sum, a) => sum + a.amount, 0);
  const totalDisqualified = applications
    .filter((a) => a.status === "Disqualified")
    .reduce((sum, a) => sum + a.amount, 0);
  const totalSubmitted = submitted + inReview + approved + funded;
  const approvalRate =
    totalSubmitted > 0
      ? Math.round(((approved + funded) / totalSubmitted) * 100)
      : 0;
  return {
    applications,
    submitted: submitted + inReview + approved + funded, // Total referrals submitted
    inReview,
    approved,
    funded,
    disqualified,
    totalFunded,
    totalPending,
    totalDisqualified,
    approvalRate,
    pipeline: {
      submitted: submitted + inReview + approved + funded,
      inReview: inReview + approved + funded,
      approved: approved + funded,
      funded,
    },
  };
}
// Get weekly breakdown for funding volume chart
export function getWeeklyFundingVolume(targetDate, data) {
  // 1. Initialize 4 weeks with 0
  const weeks = [0, 0, 0, 0];
  
  if (!data || !Array.isArray(data)) return weeks.map((amount, index) => ({
    name: `Week ${index + 1}`,
    thisMonth: 0,
  }));

  // 2. Process the actual API data
  data.forEach(app => {
    const appDate = new Date(app.CreatedDate);
    
    // Only include if it's the correct month and it's "Funded"
    if (isSameMonth(appDate, targetDate) && app.Status?.includes("Funded")) {
      const dayOfMonth = appDate.getDate();
      
      // Calculate week index: Days 1-7 = W1, 8-14 = W2, 15-21 = W3, 22+ = W4
      const weekIndex = Math.min(3, Math.floor((dayOfMonth - 1) / 7));
      
      // Use the Salesforce field Loan_Amount__c
      weeks[weekIndex] += Number(app.Cash_Collected__c || 0);
    }
  });
  
  // 3. Map to chart format
  return weeks.map((amount, index) => ({
    name: `Week ${index + 1}`,
    thisMonth: amount,
  }));
}
// Get funding by program
export function getFundingByProgram(targetDate) {
  const applications = generateMonthlyApplications(targetDate, 50);
  const programTotals = {
    eazecap: 0,
    platinum: 0,
    diamond: 0,
    elite: 0,
  };
  applications
    .filter((a) => a.status === "Funded")
    .forEach((app) => {
      programTotals[app.program] += app.amount;
    });
  return [
    {
      name: "EazeCap",
      value: programTotals.eazecap,
      fill: "hsl(220, 45%, 25%)",
    },
    {
      name: "Platinum",
      value: programTotals.platinum,
      fill: "hsl(215, 35%, 45%)",
    },
    {
      name: "Diamond",
      value: programTotals.diamond,
      fill: "hsl(158, 40%, 38%)",
    },
    { name: "Elite", value: programTotals.elite, fill: "hsl(40, 45%, 45%)" },
  ];
}
// Get performance comparison (current vs previous month)
export function getPerformanceData(targetDate,thisMonth,lastMonth,alltime) {
  console.log(thisMonth,'thisMonth')
  console.log(lastMonth,'lastMonth')
  const currentStats = getMonthlyStats(targetDate);
  const previousMonth = subMonths(targetDate, 1);
  const previousStats = getMonthlyStats(previousMonth);

  const calculateTotal = (dataArray) => {
    if (!Array.isArray(dataArray)) return 0;
    return dataArray.reduce((sum, record) => {
      const amount = parseFloat(record.Cash_Collected__c) || 0;
      return sum + amount;
    }, 0);
  };

  const currentAmount = calculateTotal(thisMonth);
    const lastMonthAmount = calculateTotal(lastMonth);
    const alltimeamount = calculateTotal(alltime);
    console.log(currentAmount,'currentAmount')
    console.log(lastMonthAmount,'lastMonthAmount')
    console.log(alltimeamount,'alltimeamount')
  return {
    lastMonth: {
      month: format(previousMonth, "MMM yyyy"),
      amount: lastMonthAmount,
    },
    currentMonth: {
      month: format(targetDate, "MMM yyyy"),
      amount: currentAmount,
      target: lastMonthAmount,
    },
  };
}

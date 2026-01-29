import { useState, useMemo, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, subMonths, addMonths, isSameMonth, parse } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../store/slices/authSlice";
import { getCashCollectedAllTime, getCashCollectedThisMonth, getFundedData, getTotalApproved } from "../store/slices/dashboardSlice";
import { getMonthAndYear } from "../lib/dateUtils";
const programData = {
  eazecap: {
    name: "EazeCap",
    description:
      "Entry-level funding program for small to medium businesses seeking quick capital solutions.",
    minDeal: "$10,000",
    maxDeal: "$150,000",
    avgProcessing: "3-5 Days",
    partnerPayout: "8-12%",
    totalFunded: "$1,245,000",
    totalPending: "$328,000",
    totalDisqualified: "$156,000",
    totalApplications: 20,
    approvalRate: "65%",
    avgDealSize: "$54,500",
    applications: [
      {
        id: "EC-001",
        client: "ABC Retail",
        amount: "$45,000",
        status: "Funded",
        date: "Jan 15, 2026",
        industry: "Retail",
        term: "12 months",
        contactEmail: "contact@abcretail.com",
      },
      {
        id: "EC-002",
        client: "Quick Services",
        amount: "$28,000",
        status: "Pending",
        date: "Jan 18, 2026",
        industry: "Services",
        term: "6 months",
        contactEmail: "info@quickservices.com",
      },
      {
        id: "EC-003",
        client: "Metro Supplies",
        amount: "$72,000",
        status: "Funded",
        date: "Jan 20, 2026",
        industry: "Wholesale",
        term: "18 months",
        contactEmail: "sales@metrosupplies.com",
      },
      {
        id: "EC-004",
        client: "City Bakery",
        amount: "$35,000",
        status: "Disqualified",
        date: "Jan 12, 2026",
        industry: "Food & Beverage",
        term: "12 months",
        contactEmail: "owner@citybakery.com",
      },
      {
        id: "EC-005",
        client: "Prime Auto",
        amount: "$88,000",
        status: "Funded",
        date: "Jan 10, 2026",
        industry: "Automotive",
        term: "24 months",
        contactEmail: "finance@primeauto.com",
      },
      {
        id: "EC-006",
        client: "Fresh Foods Co",
        amount: "$52,000",
        status: "Pending",
        date: "Jan 21, 2026",
        industry: "Food & Beverage",
        term: "12 months",
        contactEmail: "admin@freshfoods.com",
      },
      {
        id: "EC-007",
        client: "Urban Fitness",
        amount: "$41,000",
        status: "Funded",
        date: "Jan 08, 2026",
        industry: "Health & Fitness",
        term: "18 months",
        contactEmail: "manager@urbanfitness.com",
      },
      {
        id: "EC-008",
        client: "Tech Repairs",
        amount: "$29,000",
        status: "Disqualified",
        date: "Jan 14, 2026",
        industry: "Technology",
        term: "6 months",
        contactEmail: "support@techrepairs.com",
      },
      {
        id: "EC-009",
        client: "Green Gardens",
        amount: "$67,000",
        status: "Funded",
        date: "Jan 06, 2026",
        industry: "Landscaping",
        term: "12 months",
        contactEmail: "info@greengardens.com",
      },
      {
        id: "EC-010",
        client: "Style Salon",
        amount: "$38,000",
        status: "Pending",
        date: "Jan 19, 2026",
        industry: "Beauty",
        term: "12 months",
        contactEmail: "booking@stylesalon.com",
      },
      {
        id: "EC-011",
        client: "Quick Print",
        amount: "$55,000",
        status: "Funded",
        date: "Jan 05, 2026",
        industry: "Printing",
        term: "18 months",
        contactEmail: "orders@quickprint.com",
      },
      {
        id: "EC-012",
        client: "Home Comfort",
        amount: "$92,000",
        status: "Disqualified",
        date: "Jan 11, 2026",
        industry: "HVAC",
        term: "24 months",
        contactEmail: "service@homecomfort.com",
      },
      {
        id: "EC-013",
        client: "Pet Paradise",
        amount: "$48,000",
        status: "Funded",
        date: "Jan 04, 2026",
        industry: "Pet Services",
        term: "12 months",
        contactEmail: "care@petparadise.com",
      },
      {
        id: "EC-014",
        client: "Clean Pro",
        amount: "$33,000",
        status: "Pending",
        date: "Jan 22, 2026",
        industry: "Cleaning",
        term: "6 months",
        contactEmail: "info@cleanpro.com",
      },
      {
        id: "EC-015",
        client: "Daily Deli",
        amount: "$61,000",
        status: "Funded",
        date: "Jan 03, 2026",
        industry: "Food & Beverage",
        term: "12 months",
        contactEmail: "owner@dailydeli.com",
      },
      {
        id: "EC-016",
        client: "Smart Electronics",
        amount: "$79,000",
        status: "Funded",
        date: "Jan 02, 2026",
        industry: "Electronics",
        term: "18 months",
        contactEmail: "sales@smartelectronics.com",
      },
      {
        id: "EC-017",
        client: "Cozy Cafe",
        amount: "$44,000",
        status: "Pending",
        date: "Jan 20, 2026",
        industry: "Food & Beverage",
        term: "12 months",
        contactEmail: "hello@cozycafe.com",
      },
      {
        id: "EC-018",
        client: "Fast Freight",
        amount: "$86,000",
        status: "Funded",
        date: "Jan 01, 2026",
        industry: "Logistics",
        term: "24 months",
        contactEmail: "dispatch@fastfreight.com",
      },
      {
        id: "EC-019",
        client: "Beauty Box",
        amount: "$37,000",
        status: "Disqualified",
        date: "Jan 13, 2026",
        industry: "Beauty",
        term: "6 months",
        contactEmail: "shop@beautybox.com",
      },
      {
        id: "EC-020",
        client: "Local Motors",
        amount: "$95,000",
        status: "Funded",
        date: "Dec 30, 2025",
        industry: "Automotive",
        term: "24 months",
        contactEmail: "sales@localmotors.com",
      },
    ],
  },
  platinum: {
    name: "Platinum",
    description:
      "Mid-tier program offering competitive rates for established businesses with strong revenue.",
    minDeal: "$50,000",
    maxDeal: "$500,000",
    avgProcessing: "5-7 Days",
    partnerPayout: "10-15%",
    totalFunded: "$4,850,000",
    totalPending: "$1,120,000",
    totalDisqualified: "$680,000",
    totalApplications: 20,
    approvalRate: "72%",
    avgDealSize: "$275,000",
    applications: [
      {
        id: "PT-001",
        client: "Tech Solutions Inc",
        amount: "$250,000",
        status: "Funded",
        date: "Jan 12, 2026",
        industry: "Technology",
        term: "24 months",
        contactEmail: "cfo@techsolutions.com",
      },
      {
        id: "PT-002",
        client: "Construction Plus",
        amount: "$180,000",
        status: "Funded",
        date: "Jan 16, 2026",
        industry: "Construction",
        term: "18 months",
        contactEmail: "finance@constructionplus.com",
      },
      {
        id: "PT-003",
        client: "Healthcare Group",
        amount: "$320,000",
        status: "Pending",
        date: "Jan 19, 2026",
        industry: "Healthcare",
        term: "36 months",
        contactEmail: "admin@healthcaregroup.com",
      },
      {
        id: "PT-004",
        client: "Retail Chain Co",
        amount: "$275,000",
        status: "Funded",
        date: "Jan 11, 2026",
        industry: "Retail",
        term: "24 months",
        contactEmail: "treasury@retailchain.com",
      },
      {
        id: "PT-005",
        client: "Manufacturing Ltd",
        amount: "$420,000",
        status: "Disqualified",
        date: "Jan 14, 2026",
        industry: "Manufacturing",
        term: "36 months",
        contactEmail: "cfo@manufacturingltd.com",
      },
      {
        id: "PT-006",
        client: "Logistics Express",
        amount: "$195,000",
        status: "Funded",
        date: "Jan 09, 2026",
        industry: "Logistics",
        term: "18 months",
        contactEmail: "finance@logisticsexpress.com",
      },
      {
        id: "PT-007",
        client: "Food Services Inc",
        amount: "$310,000",
        status: "Pending",
        date: "Jan 20, 2026",
        industry: "Food & Beverage",
        term: "24 months",
        contactEmail: "accounts@foodservices.com",
      },
      {
        id: "PT-008",
        client: "Auto Dealers Group",
        amount: "$485,000",
        status: "Funded",
        date: "Jan 07, 2026",
        industry: "Automotive",
        term: "36 months",
        contactEmail: "cfo@autodealers.com",
      },
      {
        id: "PT-009",
        client: "Property Mgmt Co",
        amount: "$225,000",
        status: "Disqualified",
        date: "Jan 13, 2026",
        industry: "Real Estate",
        term: "24 months",
        contactEmail: "finance@propertymgmt.com",
      },
      {
        id: "PT-010",
        client: "Cleaning Services",
        amount: "$165,000",
        status: "Funded",
        date: "Jan 06, 2026",
        industry: "Services",
        term: "18 months",
        contactEmail: "accounts@cleaningservices.com",
      },
      {
        id: "PT-011",
        client: "Security Systems",
        amount: "$290,000",
        status: "Pending",
        date: "Jan 21, 2026",
        industry: "Security",
        term: "24 months",
        contactEmail: "finance@securitysystems.com",
      },
      {
        id: "PT-012",
        client: "Event Planners LLC",
        amount: "$205,000",
        status: "Funded",
        date: "Jan 05, 2026",
        industry: "Events",
        term: "18 months",
        contactEmail: "accounts@eventplanners.com",
      },
      {
        id: "PT-013",
        client: "Printing Press Co",
        amount: "$355,000",
        status: "Funded",
        date: "Jan 04, 2026",
        industry: "Printing",
        term: "24 months",
        contactEmail: "cfo@printingpress.com",
      },
      {
        id: "PT-014",
        client: "Wellness Center",
        amount: "$185,000",
        status: "Pending",
        date: "Jan 22, 2026",
        industry: "Healthcare",
        term: "18 months",
        contactEmail: "finance@wellnesscenter.com",
      },
      {
        id: "PT-015",
        client: "Import Export Ltd",
        amount: "$445,000",
        status: "Funded",
        date: "Jan 03, 2026",
        industry: "Trade",
        term: "36 months",
        contactEmail: "treasury@importexport.com",
      },
      {
        id: "PT-016",
        client: "Furniture World",
        amount: "$260,000",
        status: "Disqualified",
        date: "Jan 15, 2026",
        industry: "Retail",
        term: "24 months",
        contactEmail: "accounts@furnitureworld.com",
      },
      {
        id: "PT-017",
        client: "Travel Agency Pro",
        amount: "$175,000",
        status: "Funded",
        date: "Jan 02, 2026",
        industry: "Travel",
        term: "18 months",
        contactEmail: "finance@travelagencypro.com",
      },
      {
        id: "PT-018",
        client: "Staffing Solutions",
        amount: "$395,000",
        status: "Funded",
        date: "Jan 01, 2026",
        industry: "HR Services",
        term: "24 months",
        contactEmail: "cfo@staffingsolutions.com",
      },
      {
        id: "PT-019",
        client: "Dental Practice",
        amount: "$215,000",
        status: "Pending",
        date: "Jan 18, 2026",
        industry: "Healthcare",
        term: "24 months",
        contactEmail: "admin@dentalpractice.com",
      },
      {
        id: "PT-020",
        client: "Law Firm Partners",
        amount: "$340,000",
        status: "Funded",
        date: "Dec 30, 2025",
        industry: "Legal",
        term: "36 months",
        contactEmail: "finance@lawfirmpartners.com",
      },
    ],
  },
  diamond: {
    name: "Diamond",
    description:
      "Premium program for high-value deals with enhanced benefits and priority support.",
    minDeal: "$150,000",
    maxDeal: "$1,000,000",
    avgProcessing: "7-10 Days",
    partnerPayout: "12-18%",
    totalFunded: "$12,450,000",
    totalPending: "$2,850,000",
    totalDisqualified: "$1,920,000",
    totalApplications: 20,
    approvalRate: "78%",
    avgDealSize: "$695,000",
    applications: [
      {
        id: "DM-001",
        client: "Enterprise Corp",
        amount: "$750,000",
        status: "Funded",
        date: "Jan 10, 2026",
        industry: "Technology",
        term: "36 months",
        contactEmail: "cfo@enterprisecorp.com",
      },
      {
        id: "DM-002",
        client: "Manufacturing Co",
        amount: "$480,000",
        status: "Funded",
        date: "Jan 14, 2026",
        industry: "Manufacturing",
        term: "24 months",
        contactEmail: "treasury@manufacturingco.com",
      },
      {
        id: "DM-003",
        client: "Logistics Global",
        amount: "$620,000",
        status: "Pending",
        date: "Jan 21, 2026",
        industry: "Logistics",
        term: "36 months",
        contactEmail: "cfo@logisticsglobal.com",
      },
      {
        id: "DM-004",
        client: "Retail Empire",
        amount: "$890,000",
        status: "Funded",
        date: "Jan 08, 2026",
        industry: "Retail",
        term: "48 months",
        contactEmail: "finance@retailempire.com",
      },
      {
        id: "DM-005",
        client: "Tech Innovators",
        amount: "$720,000",
        status: "Disqualified",
        date: "Jan 12, 2026",
        industry: "Technology",
        term: "36 months",
        contactEmail: "cfo@techinnovators.com",
      },
      {
        id: "DM-006",
        client: "Healthcare Plus",
        amount: "$550,000",
        status: "Funded",
        date: "Jan 06, 2026",
        industry: "Healthcare",
        term: "36 months",
        contactEmail: "treasury@healthcareplus.com",
      },
      {
        id: "DM-007",
        client: "Construction Giants",
        amount: "$950,000",
        status: "Pending",
        date: "Jan 19, 2026",
        industry: "Construction",
        term: "48 months",
        contactEmail: "cfo@constructiongiants.com",
      },
      {
        id: "DM-008",
        client: "Auto Group Int",
        amount: "$680,000",
        status: "Funded",
        date: "Jan 04, 2026",
        industry: "Automotive",
        term: "36 months",
        contactEmail: "finance@autogroupint.com",
      },
      {
        id: "DM-009",
        client: "Food Chain LLC",
        amount: "$420,000",
        status: "Disqualified",
        date: "Jan 11, 2026",
        industry: "Food & Beverage",
        term: "24 months",
        contactEmail: "cfo@foodchain.com",
      },
      {
        id: "DM-010",
        client: "Energy Solutions",
        amount: "$780,000",
        status: "Funded",
        date: "Jan 02, 2026",
        industry: "Energy",
        term: "48 months",
        contactEmail: "treasury@energysolutions.com",
      },
      {
        id: "DM-011",
        client: "Pharma Distribution",
        amount: "$850,000",
        status: "Pending",
        date: "Jan 20, 2026",
        industry: "Pharmaceutical",
        term: "36 months",
        contactEmail: "cfo@pharmadist.com",
      },
      {
        id: "DM-012",
        client: "Aviation Services",
        amount: "$920,000",
        status: "Funded",
        date: "Jan 01, 2026",
        industry: "Aviation",
        term: "48 months",
        contactEmail: "finance@aviationservices.com",
      },
      {
        id: "DM-013",
        client: "Marine Transport",
        amount: "$590,000",
        status: "Funded",
        date: "Dec 30, 2025",
        industry: "Maritime",
        term: "36 months",
        contactEmail: "treasury@marinetransport.com",
      },
      {
        id: "DM-014",
        client: "Industrial Supply",
        amount: "$670,000",
        status: "Disqualified",
        date: "Jan 13, 2026",
        industry: "Industrial",
        term: "36 months",
        contactEmail: "cfo@industrialsupply.com",
      },
      {
        id: "DM-015",
        client: "Chemical Corp",
        amount: "$810,000",
        status: "Funded",
        date: "Dec 28, 2025",
        industry: "Chemical",
        term: "48 months",
        contactEmail: "finance@chemicalcorp.com",
      },
      {
        id: "DM-016",
        client: "Textile Mills",
        amount: "$460,000",
        status: "Pending",
        date: "Jan 22, 2026",
        industry: "Textile",
        term: "24 months",
        contactEmail: "treasury@textilemills.com",
      },
      {
        id: "DM-017",
        client: "Electronics Mega",
        amount: "$740,000",
        status: "Funded",
        date: "Dec 26, 2025",
        industry: "Electronics",
        term: "36 months",
        contactEmail: "cfo@electronicsmega.com",
      },
      {
        id: "DM-018",
        client: "Packaging Pro",
        amount: "$530,000",
        status: "Funded",
        date: "Dec 24, 2025",
        industry: "Packaging",
        term: "24 months",
        contactEmail: "finance@packagingpro.com",
      },
      {
        id: "DM-019",
        client: "Warehouse Logistics",
        amount: "$880,000",
        status: "Pending",
        date: "Jan 18, 2026",
        industry: "Logistics",
        term: "48 months",
        contactEmail: "treasury@warehouselogistics.com",
      },
      {
        id: "DM-020",
        client: "Steel Works Inc",
        amount: "$990,000",
        status: "Funded",
        date: "Dec 22, 2025",
        industry: "Manufacturing",
        term: "48 months",
        contactEmail: "cfo@steelworks.com",
      },
    ],
  },
  elite: {
    name: "Elite",
    description:
      "Exclusive top-tier program for enterprise-level funding with maximum benefits and white-glove service.",
    minDeal: "$500,000",
    maxDeal: "$5,000,000",
    avgProcessing: "10-14 Days",
    partnerPayout: "15-22%",
    totalFunded: "$45,200,000",
    totalPending: "$8,500,000",
    totalDisqualified: "$5,800,000",
    totalApplications: 20,
    approvalRate: "82%",
    avgDealSize: "$3,100,000",
    applications: [
      {
        id: "EL-001",
        client: "National Brands LLC",
        amount: "$2,500,000",
        status: "Funded",
        date: "Jan 8, 2026",
        industry: "Consumer Goods",
        term: "48 months",
        contactEmail: "cfo@nationalbrands.com",
      },
      {
        id: "EL-002",
        client: "Mega Industries",
        amount: "$1,800,000",
        status: "Pending",
        date: "Jan 17, 2026",
        industry: "Manufacturing",
        term: "36 months",
        contactEmail: "treasury@megaindustries.com",
      },
      {
        id: "EL-003",
        client: "Global Ventures",
        amount: "$3,200,000",
        status: "Funded",
        date: "Jan 22, 2026",
        industry: "Investment",
        term: "60 months",
        contactEmail: "cfo@globalventures.com",
      },
      {
        id: "EL-004",
        client: "Continental Corp",
        amount: "$4,500,000",
        status: "Funded",
        date: "Jan 05, 2026",
        industry: "Conglomerate",
        term: "60 months",
        contactEmail: "finance@continentalcorp.com",
      },
      {
        id: "EL-005",
        client: "Empire Holdings",
        amount: "$2,800,000",
        status: "Disqualified",
        date: "Jan 10, 2026",
        industry: "Real Estate",
        term: "48 months",
        contactEmail: "treasury@empireholdings.com",
      },
      {
        id: "EL-006",
        client: "Pacific Enterprises",
        amount: "$3,900,000",
        status: "Funded",
        date: "Jan 03, 2026",
        industry: "Diversified",
        term: "60 months",
        contactEmail: "cfo@pacificenterprises.com",
      },
      {
        id: "EL-007",
        client: "Atlantic Group",
        amount: "$2,100,000",
        status: "Pending",
        date: "Jan 19, 2026",
        industry: "Shipping",
        term: "48 months",
        contactEmail: "finance@atlanticgroup.com",
      },
      {
        id: "EL-008",
        client: "Summit Industries",
        amount: "$4,200,000",
        status: "Funded",
        date: "Jan 01, 2026",
        industry: "Technology",
        term: "60 months",
        contactEmail: "treasury@summitindustries.com",
      },
      {
        id: "EL-009",
        client: "Apex Capital",
        amount: "$1,650,000",
        status: "Disqualified",
        date: "Jan 12, 2026",
        industry: "Finance",
        term: "36 months",
        contactEmail: "cfo@apexcapital.com",
      },
      {
        id: "EL-010",
        client: "Horizon Holdings",
        amount: "$3,600,000",
        status: "Funded",
        date: "Dec 29, 2025",
        industry: "Investment",
        term: "60 months",
        contactEmail: "finance@horizonholdings.com",
      },
      {
        id: "EL-011",
        client: "Crown Enterprises",
        amount: "$2,950,000",
        status: "Pending",
        date: "Jan 20, 2026",
        industry: "Hospitality",
        term: "48 months",
        contactEmail: "treasury@crownenterprises.com",
      },
      {
        id: "EL-012",
        client: "Dynasty Corp",
        amount: "$4,800,000",
        status: "Funded",
        date: "Dec 27, 2025",
        industry: "Conglomerate",
        term: "60 months",
        contactEmail: "cfo@dynastycorp.com",
      },
      {
        id: "EL-013",
        client: "Titan Industries",
        amount: "$3,400,000",
        status: "Funded",
        date: "Dec 25, 2025",
        industry: "Manufacturing",
        term: "60 months",
        contactEmail: "finance@titanindustries.com",
      },
      {
        id: "EL-014",
        client: "Pinnacle Group",
        amount: "$2,200,000",
        status: "Disqualified",
        date: "Jan 14, 2026",
        industry: "Consulting",
        term: "48 months",
        contactEmail: "treasury@pinnaclegroup.com",
      },
      {
        id: "EL-015",
        client: "Fortress Holdings",
        amount: "$3,750,000",
        status: "Funded",
        date: "Dec 23, 2025",
        industry: "Real Estate",
        term: "60 months",
        contactEmail: "cfo@fortressholdings.com",
      },
      {
        id: "EL-016",
        client: "Legacy Partners",
        amount: "$1,950,000",
        status: "Pending",
        date: "Jan 21, 2026",
        industry: "Investment",
        term: "48 months",
        contactEmail: "finance@legacypartners.com",
      },
      {
        id: "EL-017",
        client: "Monarch Enterprises",
        amount: "$4,100,000",
        status: "Funded",
        date: "Dec 21, 2025",
        industry: "Diversified",
        term: "60 months",
        contactEmail: "treasury@monarchenterprises.com",
      },
      {
        id: "EL-018",
        client: "Sovereign Capital",
        amount: "$2,700,000",
        status: "Funded",
        date: "Dec 19, 2025",
        industry: "Finance",
        term: "48 months",
        contactEmail: "cfo@sovereigncapital.com",
      },
      {
        id: "EL-019",
        client: "Vanguard Holdings",
        amount: "$3,100,000",
        status: "Pending",
        date: "Jan 18, 2026",
        industry: "Investment",
        term: "60 months",
        contactEmail: "finance@vanguardholdings.com",
      },
      {
        id: "EL-020",
        client: "Elite Investments",
        amount: "$4,950,000",
        status: "Funded",
        date: "Dec 17, 2025",
        industry: "Finance",
        term: "60 months",
        contactEmail: "treasury@eliteinvestments.com",
      },
    ],
  },
};
export function FundingProgramDetails({ program, onBack }) {
    const { programId } = useParams();
    const navigate = useNavigate();
  const data = programData[programId] || programData.eazecap;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handlePreviousMonth = () =>
    setSelectedDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedDate((prev) => addMonths(prev, 1));
  // Filter applications based on selected month
  const filteredApplications = useMemo(() => {
    return data.applications.filter((app) => {
      const appDate = parse(app.date, "MMM dd, yyyy", new Date());
      return isSameMonth(appDate, selectedDate);
    });
  }, [data.applications, selectedDate]);
  // Calculate totals based on filtered data
  const totalFunded = filteredApplications
    .filter((app) => app.status === "Funded")
    .reduce((sum, app) => sum + parseInt(app.amount.replace(/[$,]/g, "")), 0);
  const totalPending = filteredApplications
    .filter((app) => app.status === "Pending")
    .reduce((sum, app) => sum + parseInt(app.amount.replace(/[$,]/g, "")), 0);
  const totalDisqualified = filteredApplications
    .filter((app) => app.status === "Disqualified")
    .reduce((sum, app) => sum + parseInt(app.amount.replace(/[$,]/g, "")), 0);
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "funded":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "disqualified":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const handleDownloadReport = () => {
    const headers = [
      "Deal ID",
      "Client",
      "Amount",
      "Status",
      "Date",
      "Industry",
      "Term",
      "Contact Email",
    ];
    const rows = data.applications.map((app) =>
      [
        app.id,
        app.client,
        app.amount,
        app.status,
        app.date,
        app.industry,
        app.term,
        app.contactEmail,
      ].join(","),
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name}_applications_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

const { month, year } = getMonthAndYear(selectedDate)
const dispatch = useDispatch();
const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
const {
        totalApproved,
        loanByTypeThisMonth,
        loanByTypeAllTime,
        cashCollectedThisMonth,
        cashCollectedAllTime,
    } = useSelector((state) => state.dashboard);
  useEffect(() => {
      if (!salesforceToken) {
        dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
      } else {
        dispatch(getCashCollectedThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
        // dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
      }
    }, [dispatch, salesforceToken,selectedDate]);

    useEffect(() => {
    if (cashCollectedThisMonth.length > 0 && programId) {
        console.log('Raw Data:', cashCollectedThisMonth);

        const filteredData = cashCollectedThisMonth.filter(item => 
            // Case-insensitive check to avoid "Elite" vs "elite" bugs
            item.Loan_Program_Type__c?.toLowerCase() === programId.toLowerCase()
        );

        console.log(`Filtered Data for ${programId}:`, filteredData);
    }
}, [cashCollectedThisMonth, programId]); // Added programId to dependencies


const filteredApplications2 = useMemo(() => {
  // 1. First, filter by the dynamic Program ID from the URL
  const byProgram = cashCollectedThisMonth.filter(item => 
    item.Loan_Program_Type__c?.toLowerCase() === programId?.toLowerCase()
  );

  // 2. Then, filter that result by the Selected Month
  return byProgram.filter((app) => {
    // Check which date field your API uses (CreatedDate is standard for SF)
    const rawDate = app.CreatedDate || app.date; 
    if (!rawDate) return false;

    // Use parseISO if the date is "2025-12-06T14:51:57.000+0000"
    // Or parse if it's a custom string format
    const appDate = typeof rawDate === 'string' && rawDate.includes('T') 
      ? new Date(rawDate) 
      : parse(rawDate, "MMM dd, yyyy", new Date());

    return isSameMonth(appDate, selectedDate);
  });
}, [cashCollectedThisMonth, programId, selectedDate]);

console.log(filteredApplications2,'filteredApplications2')

const stats = useMemo(() => {
  const initialStats = {
    funded: { count: 0, amount: 0 },
    disqualified: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
  };

  return filteredApplications2.reduce((acc, app) => {
    const status = app.Status?.toLowerCase() || "";
    const loanAmount = parseFloat(app.Loan_Amount__c) || 0;
    const cashCollected = parseFloat(app.Cash_Collected__c) || 0;

    // 1. FUNDED: We use Cash_Collected__c for the "Realized" amount
    if (status.includes("funded")) {
      acc.funded.count += 1;
      acc.funded.amount += cashCollected; 
    } 
    // 2. DISQUALIFIED: Count and Total Loan Amount lost
    else if (status.includes("declined") || status.includes("closed lost")) {
      acc.disqualified.count += 1;
      acc.disqualified.amount += loanAmount;
    } 
    // 3. PENDING: Count and Total Loan Amount currently in pipeline
    else {
      acc.pending.count += 1;
      acc.pending.amount += loanAmount;
    }

    return acc;
  }, initialStats);
}, [filteredApplications2]);

console.log(stats,'stats')


  const handleBack = () => {
    // 3. Navigate to the main dashboard path
    // Use -1 to go back to the previous page, or "/dashboard" for a fixed route
    navigate("/dashboard"); 
  };
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-foreground">
              {data.name} Program
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[140px] justify-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {format(selectedDate, "MMMM yyyy")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleDownloadReport}
            className="bg-primary hover:bg-primary/90 text-sm md:text-base text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card className="p-3 md:p-5 bg-card border-border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-success/10">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                Total Amount Funded
              </p>
              <p className="text-lg md:text-2xl font-bold text-success">
                ${stats.funded.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-5 bg-card border-border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                Total Pending
              </p>
              <p className="text-lg md:text-2xl font-bold text-warning">
                ${stats.pending.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-5 bg-card border-border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-destructive/10">
              <XCircle className="h-5 w-5 md:h-6 md:w-6 text-destructive" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                Total Disqualified
              </p>
              <p className="text-lg md:text-2xl font-bold text-destructive">
                ${stats.pending.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Applications Table - Full Details */}
      <Card className="p-3 md:p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            Applications ({filteredApplications2.length})
          </h3>
        </div>
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs md:text-sm whitespace-nowrap">
                  Client
                </TableHead>
                {/* <TableHead className="text-xs md:text-sm whitespace-nowrap hidden sm:table-cell">
                  Industry
                </TableHead> */}
                <TableHead className="text-xs md:text-sm whitespace-nowrap">
                  Amount
                </TableHead>
                {/* <TableHead className="text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">
                  Term
                </TableHead> */}
                {/* <TableHead className="text-xs md:text-sm whitespace-nowrap">
                  Status
                </TableHead> */}
                <TableHead className="text-xs md:text-sm whitespace-nowrap hidden md:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-xs md:text-sm whitespace-nowrap hidden xl:table-cell">
                  Contact
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications2.map((app) => (
                <TableRow key={app.Id}>
                  <TableCell className="font-medium text-xs md:text-sm max-w-[100px] md:max-w-none truncate">
                    {app.Name}
                  </TableCell>
                  {/* <TableCell className="text-muted-foreground text-xs md:text-sm hidden sm:table-cell">
                    {app.industry}
                  </TableCell> */}
                  <TableCell className="text-xs md:text-sm whitespace-nowrap">
                    {app.Loan_Amount__c}
                  </TableCell>
                  {/* <TableCell className="text-muted-foreground text-xs md:text-sm hidden lg:table-cell">
                    {app.term}
                  </TableCell> */}
                  {/* <TableCell>
                    <span
                      className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap ${getStatusColor(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </TableCell> */}
                  <TableCell className="text-muted-foreground text-xs md:text-sm hidden md:table-cell">
                    {app.CreatedDate}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden xl:table-cell truncate max-w-[150px]">
                    {app.Email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

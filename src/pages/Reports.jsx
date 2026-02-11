import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    FileText,
    Download,
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import * as XLSX from "xlsx";
// import { toast } from "sonner";
import { format, subMonths, addMonths, isSameMonth, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getSalesforceToken } from "../store/slices/authSlice";
import { getCashCollectedAllTime, getCashCollectedThisMonth, getDeclinedThisMonth, getFundedData, getTotalApplicationsThisMonth } from "../store/slices/dashboardSlice";
import { getMonthAndYear } from "../lib/dateUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// Program colors matching charts
const PROGRAM_COLORS = {
    all: "#2D3A4F", // Deep Navy
    eazecap: "#2D3A4F", // Deep Navy
    platinum: "#4A6178", // Steel Blue
    diamond: "#4A7C6F", // Muted Emerald
    elite: "#8B7355", // Muted Amber
};
const fundingPrograms = [
    { id: "all", name: "All Programs", color: PROGRAM_COLORS.all },
    { id: "eaze cap", name: "EazeCap", color: PROGRAM_COLORS.eazecap },
    { id: "platinum", name: "Platinum", color: PROGRAM_COLORS.platinum },
    { id: "diamond", name: "Diamond", color: PROGRAM_COLORS.diamond },
    { id: "elite", name: "Elite", color: PROGRAM_COLORS.elite },
    // { id: "Funded", name: "Funded", color: PROGRAM_COLORS.elite },
];
const allApplications = [
    {
        id: "PT-001",
        client: "Tech Solutions Inc",
        industry: "Technology",
        amount: 25000,
        term: "24 months",
        status: "Funded",
        date: "Jan 12, 2026",
        contact: "cfo@techsolutions.com",
        program: "eazecap",
    },
    {
        id: "PT-002",
        client: "Construction Plus",
        industry: "Construction",
        amount: 18000,
        term: "18 months",
        status: "Funded",
        date: "Jan 16, 2026",
        contact: "finance@constructionplus.com",
        program: "platinum",
    },
    {
        id: "PT-003",
        client: "Healthcare Group",
        industry: "Healthcare",
        amount: 32000,
        term: "36 months",
        status: "In Review",
        date: "Jan 19, 2026",
        contact: "admin@healthcaregroup.com",
        program: "diamond",
    },
    {
        id: "PT-004",
        client: "Retail Chain Co",
        industry: "Retail",
        amount: 27500,
        term: "24 months",
        status: "Funded",
        date: "Jan 11, 2026",
        contact: "treasury@retailchain.com",
        program: "elite",
    },
    {
        id: "PT-005",
        client: "Manufacturing Ltd",
        industry: "Manufacturing",
        amount: 38000,
        term: "36 months",
        status: "Declined",
        date: "Jan 14, 2026",
        contact: "cfo@manufacturingltd.com",
        program: "eazecap",
    },
    {
        id: "PT-006",
        client: "Logistics Express",
        industry: "Logistics",
        amount: 19500,
        term: "18 months",
        status: "Funded",
        date: "Jan 09, 2026",
        contact: "finance@logisticsexpress.com",
        program: "platinum",
    },
    {
        id: "PT-007",
        client: "Food Services Inc",
        industry: "Food & Beverage",
        amount: 31000,
        term: "24 months",
        status: "Approved",
        date: "Jan 20, 2026",
        contact: "accounts@foodservices.com",
        program: "diamond",
    },
    {
        id: "PT-008",
        client: "Auto Dealers Group",
        industry: "Automotive",
        amount: 40000,
        term: "36 months",
        status: "Funded",
        date: "Jan 07, 2026",
        contact: "cfo@autodealers.com",
        program: "elite",
    },
    {
        id: "PT-009",
        client: "Property Mgmt Co",
        industry: "Real Estate",
        amount: 22500,
        term: "24 months",
        status: "Declined",
        date: "Jan 13, 2026",
        contact: "finance@propertymgmt.com",
        program: "eazecap",
    },
    {
        id: "PT-010",
        client: "Cleaning Services",
        industry: "Services",
        amount: 16500,
        term: "18 months",
        status: "Funded",
        date: "Jan 06, 2026",
        contact: "accounts@cleaningservices.com",
        program: "platinum",
    },
    {
        id: "PT-011",
        client: "Security Systems",
        industry: "Security",
        amount: 29000,
        term: "24 months",
        status: "Submitted",
        date: "Jan 21, 2026",
        contact: "finance@securitysystems.com",
        program: "diamond",
    },
    {
        id: "PT-012",
        client: "Event Planners LLC",
        industry: "Events",
        amount: 20500,
        term: "18 months",
        status: "Funded",
        date: "Jan 05, 2026",
        contact: "accounts@eventplanners.com",
        program: "elite",
    },
    {
        id: "PT-013",
        client: "Printing Press Co",
        industry: "Printing",
        amount: 35500,
        term: "24 months",
        status: "Funded",
        date: "Jan 04, 2026",
        contact: "cfo@printingpress.com",
        program: "eazecap",
    },
    {
        id: "PT-014",
        client: "Wellness Center",
        industry: "Healthcare",
        amount: 18500,
        term: "18 months",
        status: "In Review",
        date: "Jan 22, 2026",
        contact: "finance@wellnesscenter.com",
        program: "platinum",
    },
    {
        id: "PT-015",
        client: "Import Export Ltd",
        industry: "Trade",
        amount: 39500,
        term: "36 months",
        status: "Funded",
        date: "Jan 03, 2026",
        contact: "treasury@importexport.com",
        program: "diamond",
    },
    {
        id: "PT-016",
        client: "Digital Marketing Co",
        industry: "Marketing",
        amount: 17500,
        term: "18 months",
        status: "Funded",
        date: "Jan 02, 2026",
        contact: "accounts@digitalmarketing.com",
        program: "elite",
    },
    {
        id: "PT-017",
        client: "Solar Energy Inc",
        industry: "Energy",
        amount: 37000,
        term: "36 months",
        status: "Approved",
        date: "Jan 23, 2026",
        contact: "cfo@solarenergy.com",
        program: "eazecap",
    },
    {
        id: "PT-018",
        client: "Fitness Chain",
        industry: "Fitness",
        amount: 28000,
        term: "24 months",
        status: "Funded",
        date: "Jan 01, 2026",
        contact: "finance@fitnesschain.com",
        program: "platinum",
    },
    {
        id: "PT-019",
        client: "Legal Partners LLP",
        industry: "Legal",
        amount: 34000,
        term: "24 months",
        status: "Declined",
        date: "Jan 15, 2026",
        contact: "admin@legalpartners.com",
        program: "diamond",
    },
    {
        id: "PT-020",
        client: "Hospitality Group",
        industry: "Hospitality",
        amount: 36500,
        term: "36 months",
        status: "Funded",
        date: "Dec 30, 2025",
        contact: "treasury@hospitalitygroup.com",
        program: "elite",
    },
];
// Vibrant status colors with light backgrounds and colored text
const getStatusBadge = (status) => {
    switch (status) {
        case "Submitted":
            return (
                <Badge className="bg-[#2D3A4F]/10 text-[#2D3A4F] border border-[#2D3A4F]/20 hover:bg-[#2D3A4F]/15">
                    Submitted
                </Badge>
            );
        case "In Review":
            return (
                <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 hover:bg-[#F59E0B]/15">
                    In Review
                </Badge>
            );
        case "Approved":
            return (
                <Badge className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/15">
                    Approved
                </Badge>
            );
        case "Funded":
            return (
                <Badge className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/15">
                    Funded
                </Badge>
            );
        case "Declined":
            return (
                <Badge className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/15">
                    Declined
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};
export function Reports() {
    const [selectedProgram, setSelectedProgram] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handlePreviousMonth = () =>
        setSelectedDate((prev) => subMonths(prev, 1));
    const handleNextMonth = () => setSelectedDate((prev) => addMonths(prev, 1));
    // Filter applications based on selected program AND selected month
    const filteredApplications = useMemo(() => {
        return allApplications.filter((app) => {
            const programMatch =
                selectedProgram === "all" || app.program === selectedProgram;
            const appDate = parse(app.date, "MMM dd, yyyy", new Date());
            const monthMatch = isSameMonth(appDate, selectedDate);
            return programMatch && monthMatch;
        });
    }, [selectedProgram, selectedDate]);
    // Calculate totals based on filtered data
    const totalFunded = filteredApplications
        .filter((app) => app.status === "Funded")
        .reduce((sum, app) => sum + app.amount, 0);
    const totalInProgress = filteredApplications
        .filter((app) =>
            ["Submitted", "In Review", "Approved"].includes(app.status),
        )
        .reduce((sum, app) => sum + app.amount, 0);
    const totalDeclined = filteredApplications
        .filter((app) => app.status === "Declined")
        .reduce((sum, app) => sum + app.amount, 0);
    const programName =
        fundingPrograms.find((p) => p.id === selectedProgram)?.name ||
        "All Programs";

    //console.log(selectedDate, 'selectedDate')

    const { month, year } = getMonthAndYear(selectedDate)
    const dispatch = useDispatch();
    const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
    const {
        totalApproved,
        loanByTypeThisMonth,
        loanByTypeAllTime,
        cashCollectedThisMonth,
        cashCollectedAllTime,
        fundedData,
        declinedApplicationsThisMonth,
        totalApplicationsThisMonth
    } = useSelector((state) => state.dashboard);
    useEffect(() => {
        if (!salesforceToken) {
            dispatch(getSalesforceToken()); // Fetch the Salesforce token if not available
        } else {
            dispatch(getFundedData({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
            dispatch(getDeclinedThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
            dispatch(getCashCollectedThisMonth({ accountId: portalUserId, token: salesforceToken, month: month, year: year }));
            dispatch(getTotalApplicationsThisMonth({ accountId: portalUserId, token: salesforceToken,month:month,year:year }));
            // dispatch(getTotalApproved({ accountId: portalUserId, token: salesforceToken }));
        }
    }, [dispatch, salesforceToken, selectedDate]);

    useEffect(() => {
        if (fundedData.length > 0 && selectedProgram) {
            //console.log('Raw Data:', fundedData);

            const filteredData = fundedData.filter(item =>
                // Case-insensitive check to avoid "Elite" vs "elite" bugs
                item.Loan_Program_Type__c?.toLowerCase() === selectedProgram.toLowerCase()
            );

            //console.log(`Filtered Data for ${selectedProgram}:`, filteredData);
        }
        //console.log(declinedApplicationsThisMonth, 'declinedApplicationsThisMonth')
    }, [fundedData, selectedProgram, declinedApplicationsThisMonth]); // Added programId to dependencies


    const filteredApplications2 = useMemo(() => {
        // fundedData
        // 1. Parent Filter: Filter by Lead_Partner_Status__c (All vs Funded)
    const byStatus = totalApplicationsThisMonth.filter(item => {
        // Assuming your filter state is called 'selectedStatus' 
        // and it holds values like "all" or "funded"
        if (selectedStatus?.toLowerCase() === "all") return true;

        return item.Lead_Partner_Status__c?.toLowerCase() === "funded";
    });

    // 2. Filter by Program ID
    const byProgram = byStatus.filter(item => {
        if (selectedProgram?.toLowerCase() === "all") return true;

        return item.Loan_Program_Type__c?.toLowerCase() === selectedProgram?.toLowerCase();
    });

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
    }, [fundedData, selectedProgram, selectedDate,totalApplicationsThisMonth,selectedStatus]);

    console.log(filteredApplications2, 'filteredApplications2')

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
    }, [filteredApplications2,totalApplicationsThisMonth,selectedProgram]);

    //console.log(stats, 'stats')

    const generateExcel = (reportType) => {
        // Create Excel workbook
        const wb = XLSX.utils.book_new();
        // Summary data
        const summaryData = [
            ["EAZE Partner Portal"],
            [""],
            ["Report Type", reportType.charAt(0).toUpperCase() + reportType.slice(1)],
            ["Program", programName],
            ["Generated", new Date().toLocaleDateString()],
            [""],
            ["Summary Statistics"],
            ["Total Funded", `$${stats.funded.amount.toLocaleString()}`],
            ["Total In Progress", `$${stats.pending.amount.toLocaleString()}`],
            ["Total Declined", `$${stats.disqualified.amount.toLocaleString()}`],
            ["Total Applications", filteredApplications2.length],
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, "Summary");
        // Applications data - matching exact column order
        const applicationHeaders = [
            "Client",
            "Amount",
            // "Term",
            "Status",
            "Program",
            "Date",
            "Contact",
        ];
        const applicationRows = filteredApplications2.map((app) => [
            app.Name,
            `$${app.Loan_Amount__c.toLocaleString()}`,
            // app.term,
            app.status,
            app.Loan_Program_Type__c.charAt(0).toUpperCase() + app.Loan_Program_Type__c.slice(1),
            app.CreatedDate,
            app.Email,
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([
            applicationHeaders,
            ...applicationRows,
        ]);
        // Set column widths
        ws2["!cols"] = [
            { wch: 22 }, // Client
            { wch: 12 }, // Amount
            { wch: 12 }, // Term
            { wch: 14 }, // Status
            { wch: 12 }, // Program
            { wch: 14 }, // Date
            { wch: 32 }, // Contact
        ];
        XLSX.utils.book_append_sheet(wb, ws2, "Applications");
        const fileNames = {
            monthly: "eaze-monthly-report-jan-2026.xlsx",
            quarterly: "eaze-quarterly-report-q4-2024.xlsx",
            yearly: "eaze-yearly-report-2024.xlsx",
            full: `eaze-applications-${selectedProgram}.xlsx`,
        };
        const reportNames = {
            monthly: "Monthly Summary (January 2025)",
            quarterly: "Quarterly Report (Q4 2024)",
            yearly: "Yearly Report (2024)",
            full: `Applications Report - ${programName}`,
        };
        XLSX.writeFile(wb, fileNames[reportType]);
        // toast.success(`${reportNames[reportType]} downloaded successfully!`);
    };


    const totalDeclinedAmount = useMemo(() => {
        return declinedApplicationsThisMonth.reduce((acc, curr) => {
            // 1. Check if "All Programs" is selected OR if the program matches the row
            const isAll = selectedProgram === "all";

            // Normalize strings to lowercase to ensure they match (e.g., "Eaze Cap" vs "eaze cap")
            const isMatch = curr.Loan_Program_Type__c?.toLowerCase() === selectedProgram?.toLowerCase();

            if (isAll || isMatch) {
                return acc + (Number(curr.Loan_Amount__c) || 0);
            }

            return acc;
        }, 0);
    }, [declinedApplicationsThisMonth, selectedProgram]);
    const totalLoanAmount = useMemo(() => {
        return cashCollectedThisMonth.reduce((acc, curr) => {
            // 1. Check if "All Programs" is selected OR if the program matches the row
            const isAll = selectedProgram === "all";

            // Normalize strings to lowercase to ensure they match (e.g., "Eaze Cap" vs "eaze cap")
            const isMatch = curr.Loan_Program_Type__c?.toLowerCase() === selectedProgram?.toLowerCase();

            if (isAll || isMatch) {
                return acc + (Number(curr.Loan_Amount__c) || 0);
            }

            return acc;
        }, 0);
    }, [cashCollectedThisMonth, selectedProgram]);

const statusOptions = [
  { label: "All Applications", value: "all", color: "#94a3b8" }, // Slate
  { label: "Funded Only", value: "funded", color: "#22c55e" }    // Green
];

let columnKeys = [];
  if (filteredApplications2.length > 0) {
  // 1. Collect every unique key from every object in the array
  const allUniqueKeys = new Set();
  filteredApplications2.forEach(obj => {
    Object.keys(obj).forEach(key => allUniqueKeys.add(key));
  });

  // Convert Set back to an array
  const allKeys = Array.from(allUniqueKeys);
  
  const keysToExclude = ['attributes', 'Id', 'Name'];
  
  // 2. Build the final array: Start with 'Name', then add the rest
  columnKeys = [
    'Name', 
    ...allKeys.filter(key => !keysToExclude.includes(key))
  ];
}

  // 2. Helper to format header names (e.g., Loan_Amount__c -> Loan Amount)
  const formatHeader = (key) => {
    return key
      .replace(/__c$/, '')      // Remove Salesforce custom field suffix
      .replace(/_/g, ' ')       // Replace underscores with spaces
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .trim();
  };
    return (
        <div className="p-4 md:p-6 space-y-6 bg-background">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                        My Reports
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        View and download your performance reports
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* --- NEW PARENT FILTER START --- */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40 bg-background border-input h-8 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
                {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                            <span 
                                className="w-2 h-2 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: status.color }} 
                            />
                            <span>{status.label}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {/* --- NEW PARENT FILTER END --- */}
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
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
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
                </div>
            </div>

            {/* Funding Program Filter */}
            <div className="space-y-3">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                    Select Program
                </h2>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3">
                    {fundingPrograms.map((program) => (
                        <button
                            key={program.id}
                            onClick={() => setSelectedProgram(program.id)}
                            className={`flex items-center justify-center gap-2 px-3 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${selectedProgram === program.id
                                ? "bg-primary text-primary-foreground shadow-md text-white"
                                : "bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                    backgroundColor:
                                        selectedProgram === program.id ? "white" : program.color,
                                }}
                            />
                            <span>{program.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Report Cards - Compact design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-3 p-3 md:p-4 pb-2">
                        <div className="p-2 bg-primary-10 rounded-lg">
                            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm md:text-base">
                                Monthly Summary
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {selectedDate ? (
                                    `${new Date(selectedDate).toLocaleString('default', { month: 'long' })} ${new Date(selectedDate).getFullYear()}`
                                ) : (
                                    "All Time"
                                )} • {programName}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 h-8 text-xs"
                            onClick={() => generateExcel("monthly")}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download Excel
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-3 p-3 md:p-4 pb-2">
                        <div className="p-2 bg-primary-10 rounded-lg">
                            <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm md:text-base">
                                Quarterly Report
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                Q1 {year} • {programName}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 h-8 text-xs"
                            onClick={() => generateExcel("quarterly")}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download Excel
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-3 p-3 md:p-4 pb-2">
                        <div className="p-2 bg-primary-10 rounded-lg">
                            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm md:text-base">
                                Yearly Report
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {year} • {programName}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 h-8 text-xs"
                            onClick={() => generateExcel("yearly")}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download Excel
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Cards */}
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
                Applications - {programName}
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-success">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-success/15 rounded-full">
                                <CheckCircle className="h-6 w-6 text-[#1fad6b]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Amount Funded
                                </p>
                                <p className="text-2xl font-bold text-success">
                                    ${stats.funded.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-warning">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-warning/15 rounded-full">
                                <Clock className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total In Progress
                                </p>
                                <p className="text-2xl font-bold text-warning">
                                    ${totalLoanAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-destructive/15 rounded-full">
                                <XCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Declined</p>
                                <p className="text-2xl font-bold text-destructive">
                                    ${totalDeclinedAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Applications Table */}
            <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">
          Applications ({filteredApplications2.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columnKeys.map((key) => (
                  <TableHead key={key} className="whitespace-nowrap text-xs md:text-sm capitalize">
                    {formatHeader(key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications2.map((app) => (
                <TableRow key={app.Id}>
                  {columnKeys.map((key) => (
                    <TableCell key={`${app.Id}-${key}`} className="text-xs md:text-sm whitespace-nowrap">
                      {/* Special formatting for specific types */}
                      {typeof app[key] === 'number' && key.includes('Amount') 
                        ? `$${app[key].toLocaleString()}` 
                        : String(app[key] || '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
        </div>
    );
}

import { useState } from "react";
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
} from "@mui/material";

export default function LeadTabs({ onTabChange }) {
    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
         if (onTabChange) onTabChange(newValue);
    };

    // ===================================================
    // ✅ Dummy Data (based on your screenshot)
    // ===================================================
    const currentData = {
        preApproved: [
            {
                name: "Bassem Abdallah",
                date: "11/07/2025",
                phone: "(708) 997-1767",
                email: "bassem115@yahoo.com",
                amount: "$12,000.00",
                agent: "Roland Bordon III",
            },
            {
                name: "Emily Kacsmar",
                date: "03/22/2022",
                phone: "(908) 268-1419",
                email: "emmylouand24@gmail.com",
                amount: "$15,000.00",
                agent: "Anthony Di Re",
            },
        ],

        bookedWithEaze: [
            {
                name: "Steve O'Brien",
                date: "Booked",
                phone: "(704) 877-8360",
                email: "s.obrien@crds.com",
                amount: "$7,500.00",
                agent: "Peter Vekselman",
            },
            {
                name: "A Rafael",
                date: "11/03/2025 06:00 PM",
                phone: "(216) 543-1254",
                email: "a-rafael@outlook.com",
                amount: "$12,000.00",
                agent: "Peter Vekselman",
            },
            {
                name: "Mario Gomez",
                date: "11/02/2023 10:30 PM",
                phone: "(469) 724-2044",
                email: "gomezmariosr@gmail.com",
                amount: "$7,500.00",
                agent: "Peter Vekselman",
            },
            {
                name: "Duncan Miti",
                date: "05/23/2023 03:30 PM",
                phone: "(469) 363-9098",
                email: "mt_duncan@yahoo.com",
                amount: "$10,000.00",
                agent: "Valerie King (GA)",
            },
        ],

        allDocsIn: [
            {
                name: "Shayne Odum",
                date: "05/18/2023",
                phone: "(725) 230-2470",
                email: "shayneodum@gmail.com",
                amount: "$12,000.00",
                agent: "Roland Bordon III",
            },
        ],

        termsPitched: [
            {
                name: "Emmanuel Jerome",
                date: "11/12/2025",
                phone: "(609) 534-6151",
                email: "stins97@gmail.com",
                amount: "$12,000.00",
                agent: "Sandy Steed",
            },
            {
                name: "Jhosse Sanchez",
                date: "11/11/2025",
                phone: "(484) 597-2311",
                email: "sanchezjhosse@gmail.com",
                amount: "$12,000.00",
                agent: "Sandy Steed",
            },
        ],
    };
    const approvedData = [
        {
            name: "John Logan",
            date: "11/17/2025",
            phone: "(281) 676-1209",
            email: "loganmvp323@gmail.com",
            amount: "$7,500.00",
            agent: "Sandy Steed",
        },
        {
            name: "Jason Smith",
            date: "11/05/2025",
            phone: "(470) 865-8833",
            email: "jd13smith74@gmail.com",
            amount: "$12,000.00",
            agent: "Sandy Steed",
        },
        {
            name: "Paul Goetz",
            date: "11/15/2025",
            phone: "(505) 800-8835",
            email: "pauldgoetz@gmail.com",
            amount: "$8,500.00",
            agent: "David Thomas",
        },
        {
            name: "Rashod Okelly",
            date: "11/12/2025",
            phone: "(314) 319-9333",
            email: "okelbm2019@gmail.com",
            amount: "$12,000.00",
            agent: "Roland Bordon III",
        },
        {
            name: "Aaron Armstrong",
            date: "11/11/2025",
            phone: "(480) 757-4420",
            email: "aaron@mylzda.com",
            amount: "$7,500.00",
            agent: "David Thomas",
        },
    ];

    const declinedData = [
        {
            name: "Shawn Newsome",
            date: "11/17/2025",
            phone: "(443) 409-7167",
            email: "snhomerrepair@gmail.com",
            amount: "$10,000.00",
            agent: "David Thomas",
        },
        {
            name: "Marquez Core",
            date: "11/14/2025",
            phone: "(334) 909-5403",
            email: "quezcore@gmail.com",
            amount: "$10,000.00",
            agent: "Andy Goldsmith",
        },
        {
            name: "Tracy Farmer",
            date: "11/10/2025",
            phone: "(220) 242-9825",
            email: "tracyabuyshomes@gmail.com",
            amount: "$7,500.00",
            agent: "Sandy Steed",
        },
        {
            name: "Nicolas Monevais",
            date: "11/10/2025",
            phone: "(208) 240-4946",
            email: "gbltclcorp@yahoo.com",
            amount: "$12,000.00",
            agent: "Roland Bordon III",
        },
    ];
    const closedLostData = [
        {
            name: "Anthony Kearney",
            date: "11/10/2025",
            phone: "(917) 771-8049",
            email: "tkearney622ce@gmail.com",
            amount: "$7,500.00",
            agent: "David Thomas",
        },
        {
            name: "Scott Rokita",
            date: "11/03/2025",
            phone: "(773) 956-9961",
            email: "scottyro@yahoo.com",
            amount: "$12,000.00",
            agent: "Sandy Steed",
        },
        {
            name: "Terms Pitched - Client Did Not Move Forward With Opportunity",
            date: "11/02/2025",
            phone: "(469) 724-2044",
            email: "terms_pitched@example.com",
            amount: "$10,000.00",
            agent: "Roland Bordon III",
        },
    ];
    // Dummy Data for New Leads (Example)
    const newLeadsData = [];

    // Dummy Data for Declined - Pre-Qualifier (Example)
    const declinedPreQualifierData = [];


    // ===================================================
    // UI SECTION COMPONENT
    // ===================================================
    const SectionTable = ({ title, rows }) => (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Agent Name</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.agent}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ width: "100%", p: 3 }}>
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

            {/* New Leads Tab */}
            {tab === 0 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>
                        {newLeadsData.length === 0 ? (
                            <Typography variant="h6" align="center" sx={{ py: 3, color: "gray" }}>
                                No data found
                            </Typography>
                        ) : (
                            // Your table for New Leads goes here
                            <SectionTable title="New Leads" rows={newLeadsData} />
                        )}
                    </CardContent>
                </Card>
            )}
            {/* CURRENT TAB */}
            {tab === 1 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>

                        <SectionTable title="Pre-Approved - Client Has Not Scheduled Call With EAZE" rows={currentData.preApproved} />

                        <SectionTable title="Booked with Eaze" rows={currentData.bookedWithEaze} />

                        <SectionTable title="All Docs In - Pending Final Underwriting Decision" rows={currentData.allDocsIn} />

                        <SectionTable title="Terms Pitched - Email to Agent To Follow Up" rows={currentData.termsPitched} />

                    </CardContent>
                </Card>
            )}
            {tab === 2 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Approved Clients
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Phone</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Amount</strong></TableCell>
                                        <TableCell><strong>Agent Name</strong></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {approvedData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.agent}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </CardContent>
                </Card>
            )}
            {/* DECLINED TAB */}
            {tab === 3 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Declined – Client Does Not Meet Minimum Credit Requirements
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Phone</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Amount</strong></TableCell>
                                        <TableCell><strong>Agent Name</strong></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {declinedData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.agent}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>

                    </CardContent>
                </Card>
            )}
            {/* CLOSED LOST TAB */}
            {tab === 4 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Closed Lost - Pre-Approved - Client Non-Responsive During Income Verification
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Phone</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Amount</strong></TableCell>
                                        <TableCell><strong>Agent Name</strong></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {closedLostData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.agent}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>

                    </CardContent>
                </Card>
            )}
            {/* Declined - Pre-Qualifier Tab */}
            {tab === 5 && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <CardContent>
                        {declinedPreQualifierData.length === 0 ? (
                            <Typography variant="h6" align="center" sx={{ py: 3, color: "gray" }}>
                                No data found
                            </Typography>
                        ) : (
                            // Your table for Declined - Pre-Qualifier goes here
                            <SectionTable title="Declined - Pre-Qualifier" rows={declinedPreQualifierData} />
                        )}
                    </CardContent>
                </Card>
            )}



        </Box>
    );
}

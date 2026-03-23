import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLeadData } from '../store/slices/leadDetailSlice';
import { getSalesforceToken } from '../store/slices/authSlice';
import { Skeleton } from '../components/ui/skeleton';
import PersonIcon from '@mui/icons-material/Person';

// Keys to exclude from the detail grid
const EXCLUDED_KEYS = new Set(['Id', 'attributes']);

// Convert a Salesforce API key to a human-readable label
const formatLabel = (key) => {
  return key
    .replace(/__c$/i, '')
    .replace(/__r$/i, '')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
};

// ── Modal Component ──
const ClimbCreditModal = ({ isOpen, onClose, appLink, appLinkError }) => {
  if (!isOpen) return null;

  const isSuccess = !!appLink;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Modal box — stop click propagation so backdrop click closes but content click doesn't */}
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-muted-foreground hover:text-foreground text-xl leading-none"
        >
          ✕
        </button>

        {isSuccess ? (
          // ── SUCCESS STATE ──
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">Application Link Ready</h2>
              <p className="text-sm text-muted-foreground">
                The Climb Credit loan application link has been generated successfully.
              </p>
            </div>
            <a
              href={appLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              Click here to open
            </a>
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Close
            </button>
          </div>
        ) : (
          // ── ERROR STATE ──
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-2xl">✕</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">Unable to Generate Link</h2>
              <p className="text-sm text-muted-foreground">{appLinkError}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const LeadDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { salesforceToken } = useSelector((state) => state.auth);
  const { data, status, error } = useSelector((state) => state.leadDetail);

  const [tokenLoading, setTokenLoading] = React.useState(false);

  // ── Climb Credit modal state ──
  const [modalOpen, setModalOpen]           = React.useState(false);
  const [appLink, setAppLink]               = React.useState(null);
  const [appLinkLoading, setAppLinkLoading] = React.useState(false);
  const [appLinkError, setAppLinkError]     = React.useState(null);

  React.useEffect(() => {
    if (!id) return;
    if (!salesforceToken) {
      setTokenLoading(true);
      dispatch(getSalesforceToken());
      return;
    }
    dispatch(getLeadData({ leadId: id, token: salesforceToken }));
  }, [id, salesforceToken, dispatch]);

  // ── Handler: POST /services/apexrest/climb/application ──
  const handleClimbCredit = async () => {
    if (!data?.Email) {
      setAppLink(null);
      setAppLinkError('No email found for this lead.');
      setModalOpen(true);
      return;
    }

    setAppLinkLoading(true);
    setAppLink(null);
    setAppLinkError(null);

    try {
      const BASE_URL = 'https://eazeconsulting.my.salesforce.com';
      const response = await fetch(`${BASE_URL}/services/apexrest/climb/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${salesforceToken}`,
        },
        body: JSON.stringify({ email: data.Email }),
      });

      const json = await response.json();

      if (json?.applicationLink && json.applicationLink !== 'NO_SCHOOL_ID') {
        setAppLink(json.applicationLink);
        setAppLinkError(null);
      } else if (json?.applicationLink === 'NO_SCHOOL_ID') {
        setAppLinkError('No school ID is associated with this lead.');
        setAppLink(null);
      } else {
        setAppLinkError(json?.message || 'Failed to retrieve the application link.');
        setAppLink(null);
      }
    } catch (err) {
      setAppLinkError('Network error. Please try again.');
      setAppLink(null);
    } finally {
      setAppLinkLoading(false);
      setModalOpen(true); // open modal for both success and error
    }
  };

  const loading = status === 'loading' || tokenLoading;

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-6 bg-card border border-border rounded">
        <h2 className="text-sm font-semibold text-destructive mb-2">Error Loading Details</h2>
        <p className="text-sm text-foreground">{error}</p>
        <Link to="/dashboard" className="inline-block mt-3 text-sm text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="m-4 p-6 bg-card border border-border rounded">
        <h2 className="text-sm font-semibold text-foreground mb-2">Lead Details</h2>
        <p className="text-sm text-muted-foreground">No data available for this lead.</p>
        <Link to="/dashboard" className="inline-block mt-3 text-sm text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  // ── Header values ──
  const leadName   = [data?.FirstName, data?.LastName].filter(Boolean).join(' ') || data?.Name || 'Lead';
  const mobile     = data?.MobilePhone || data?.Phone || '';
  const email      = data?.Email || '';
  const leadSource = data?.LeadSource || '';
  const leadStatus = data?.Status || '';
  const agentName  = data?.Agent_Name__c || data?.Agent_Name_Text__c || '';

  // ── Build dynamic field list from actual API keys ──
  const allFields = Object.keys(data)
    .filter((key) => !EXCLUDED_KEYS.has(key))
    .map((key) => ({
      key,
      label: formatLabel(key),
      value: data[key],
    }));

  const fieldPairs = [];
  for (let i = 0; i < allFields.length; i += 2) {
    fieldPairs.push([allFields[i], allFields[i + 1] || null]);
  }

  const renderFieldValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-sm text-muted-foreground">—</span>;
    }

    const display = String(value);

    // Render raw HTML anchor strings (e.g. Credible_Application_Link__c)
    if (display.startsWith('<a ') || display.includes('href=')) {
      return (
        <span
          className="text-sm [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700"
          dangerouslySetInnerHTML={{ __html: display }}
        />
      );
    }

    if (key === 'MobilePhone' || key === 'Phone') {
      return (
        <a href={`tel:${display}`} className="text-sm text-blue-500 hover:underline">
          {display}
        </a>
      );
    }

    if (key === 'Email' || key?.toLowerCase().includes('email')) {
      return (
        <a href={`mailto:${display}`} className="text-sm text-blue-500 hover:underline">
          {display}
        </a>
      );
    }

    // Format currency fields
    if (
      key?.toLowerCase().includes('amount') ||
      key?.toLowerCase().includes('income') ||
      key?.toLowerCase().includes('fee')
    ) {
      const num = parseFloat(display);
      if (!isNaN(num)) {
        return (
          <span className="text-sm text-foreground">
            ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    }

    return <span className="text-sm text-foreground">{display}</span>;
  };

  return (
    <div className="min-h-screen bg-background text-sm text-foreground animate-fade-in">

      {/* ── CLIMB CREDIT MODAL ── */}
      <ClimbCreditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appLink={appLink}
        appLinkError={appLinkError}
      />

      {/* ── RECORD HEADER ── */}
      <div className="bg-card border-b border-border px-4 py-3">

        {/* Top row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <PersonIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground leading-none mb-0.5">Lead</div>
              <div className="text-lg font-bold text-foreground leading-tight">{leadName}</div>
            </div>
          </div>

          <button
            onClick={handleClimbCredit}
            disabled={appLinkLoading}
            className="px-3.5 py-[5px] rounded-md border border-border bg-primary text-white text-sm cursor-pointer hover:opacity-90 whitespace-nowrap transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {appLinkLoading ? 'Loading...' : 'Apply for Climb Credit Loan Application'}
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-10 gap-y-2 pt-0.5">
          {mobile && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Mobile</span>
              <a href={`tel:${mobile}`} className="text-sm text-blue-500 hover:underline">{mobile}</a>
            </div>
          )}
          {email && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Email</span>
              <a href={`mailto:${email}`} className="text-sm text-blue-500 hover:underline">{email}</a>
            </div>
          )}
          {leadSource && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Lead Source</span>
              <span className="text-sm text-foreground">{leadSource}</span>
            </div>
          )}
          {leadStatus && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Lead Status</span>
              <span className="text-sm text-foreground">{leadStatus}</span>
            </div>
          )}
          {agentName && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-0.5">Agent Name</span>
              <span className="text-sm text-foreground">{agentName}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-card border-b border-border px-4 flex">
        <div className="py-2.5 px-4 text-sm font-semibold text-primary border-b-2 border-primary cursor-pointer">
          Details
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 md:p-6">
        <div className="bg-card border border-border rounded overflow-hidden">

          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-b border-border font-semibold text-sm text-foreground cursor-pointer select-none">
            <span className="text-[10px] text-muted-foreground">▼</span>
            Personal Information
            <span className="ml-auto text-xs text-muted-foreground font-normal">{allFields.length} fields</span>
          </div>

          <div className="grid grid-cols-2">
            {fieldPairs.map(([left, right]) => (
              <React.Fragment key={left.key}>

                <div className="px-4 py-2.5 border-b border-r border-border">
                  <div className="text-xs text-muted-foreground mb-1">{left.label}</div>
                  <div className="flex items-center justify-between min-h-5">
                    <div className="flex-1 min-w-0 truncate">
                      {renderFieldValue(left.key, left.value)}
                    </div>
                    <span className="text-muted-foreground text-xs opacity-60 cursor-pointer ml-2 flex-shrink-0">✏</span>
                  </div>
                </div>

                <div className="px-4 py-2.5 border-b border-border">
                  {right ? (
                    <>
                      <div className="text-xs text-muted-foreground mb-1">{right.label}</div>
                      <div className="flex items-center justify-between min-h-5">
                        <div className="flex-1 min-w-0 truncate">
                          {renderFieldValue(right.key, right.value)}
                        </div>
                        <span className="text-muted-foreground text-xs opacity-60 cursor-pointer ml-2 flex-shrink-0">✏</span>
                      </div>
                    </>
                  ) : null}
                </div>

              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default LeadDetail;
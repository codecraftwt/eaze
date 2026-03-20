import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLeadData } from '../store/slices/leadDetailSlice';
import { getSalesforceToken } from '../store/slices/authSlice';
import { Skeleton } from '../components/ui/skeleton';
import PersonIcon from '@mui/icons-material/Person';

const LeadDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { salesforceToken } = useSelector((state) => state.auth);
  const { data, status, error } = useSelector((state) => state.leadDetail);
  const [tokenLoading, setTokenLoading] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    if (!salesforceToken) {
      setTokenLoading(true);
      dispatch(getSalesforceToken());
      return;
    }
    dispatch(getLeadData({ leadId: id, token: salesforceToken }));
  }, [id, salesforceToken, dispatch]);

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

  // Build full name from FirstName + LastName, fallback to Name field, then 'Lead'
  const leadName   = data?.Name
    || [data?.FirstName, data?.LastName].filter(Boolean).join(' ')
    || 'Lead';
  const mobile     = data?.MobilePhone   || data?.Phone   || '';
  const email      = data?.Email         || '';
  const leadSource = data?.LeadSource    || '';
  const leadStatus = data?.Status        || '';
  const agentName  = data?.Agent_Name__c || '';

  // Build personal fields dynamically from actual API keys present in data
  // Fixed pairs: left / right — use whatever keys the API actually returns
  const personalFields = [
    {
      leftLabel: 'First Name',            leftKey: 'FirstName',
      rightLabel: 'Last Name',            rightKey: 'LastName',                    rightExpand: true,
    },
    {
      leftLabel: 'Email',                 leftKey: 'Email',
      rightLabel: 'Company',              rightKey: 'Company',
    },
    {
      leftLabel: 'Mobile',                leftKey: 'MobilePhone',
      rightLabel: 'Phone',                rightKey: 'Phone',
    },
    {
      leftLabel: 'Lead Status',           leftKey: 'Status',
      rightLabel: 'Lead Source',          rightKey: 'LeadSource',
    },
    {
      leftLabel: 'Lead Record Type',      leftKey: 'RecordType',
      rightLabel: 'Agent Name',           rightKey: 'Agent_Name__c',
    },
    {
      leftLabel: 'Purpose',               leftKey: 'Purpose__c',
      rightLabel: 'Underwriting Notes',   rightKey: 'Underwriting_Notes__c',
    },
    {
      leftLabel: 'Primary Contact Email', leftKey: 'Primary_Contact_Email__c',
      rightLabel: 'Agent Approved For Lender', rightKey: 'Agent_Approved_For_Lender__c',
    },
    {
      leftLabel: 'Business Service Fee',  leftKey: 'Business_Service_Fee__c',
      rightLabel: 'Application Lender',   rightKey: 'Application_Lender__c',
    },
    {
      leftLabel: 'Discount Rate',         leftKey: 'Discount_Rate__c',
      rightLabel: 'Citizenship Status',   rightKey: 'Citizenship_Status__c',
    },
  ];

  // Also collect any extra keys from data that aren't already covered above
  const coveredKeys = new Set([
    'Id',
    ...personalFields.flatMap(f => [f.leftKey, f.rightKey]),
  ]);
  const extraFields = Object.keys(data)
    .filter(k => !coveredKeys.has(k))
    .map(k => ({ leftLabel: k.replace(/__c$/i, '').replace(/([A-Z])/g, ' $1').trim(), leftKey: k, rightLabel: null, rightKey: null }));

  const renderFieldValue = (key, value) => {
    const display = value != null && value !== '' ? String(value) : null;
    if (!display) return <span className="invisible select-none">–</span>;

    if (key === 'MobilePhone')
      return (
        <a href={`tel:${display}`} className="text-sm text-primary no-underline hover:underline">
          {display}
        </a>
      );
    if (key === 'Email' || key === 'Primary_Contact_Email__c')
      return (
        <a href={`mailto:${display}`} className="text-sm text-primary no-underline hover:underline">
          {display}
        </a>
      );

    return <span className="text-sm text-foreground">{display}</span>;
  };

  return (
    <div className="min-h-screen bg-background text-sm text-foreground animate-fade-in">

      {/* ── RECORD HEADER ── */}
      <div className="bg-card border-b border-border px-4 py-3">

        {/* Top row */}
        <div className="flex items-center justify-between mb-2.5">

          {/* Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <PersonIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground leading-none mb-0.5">Lead</div>
              <div className="text-lg font-bold text-foreground leading-tight">
                {leadName}
              </div>
            </div>
          </div>

          {/* Single action button */}
          <button className="px-3.5 py-[5px] rounded-md border border-border bg-primary text-white primary text-sm cursor-pointer hover:bg-background whitespace-nowrap transition-colors">
            Apply for Climb Credit Loan Application
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-10 gap-y-2 pt-0.5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Mobile</span>
            {mobile
              ? <a href={`tel:${mobile}`} className="text-sm text-primary no-underline hover:underline">{mobile}</a>
              : <span className="text-sm text-foreground">—</span>
            }
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Email</span>
            {email
              ? <a href={`mailto:${email}`} className="text-sm text-primary no-underline hover:underline">{email}</a>
              : <span className="text-sm text-foreground">—</span>
            }
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Lead Source</span>
            <span className="text-sm text-foreground">{leadSource || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Lead Status</span>
            <span className="text-sm text-foreground">{leadStatus || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Agent Name</span>
            <span className="text-sm text-foreground">{agentName}</span>
          </div>
        </div>
      </div>

      {/* ── TABS — Details only, Activity removed ── */}
      <div className="bg-card border-b border-border px-4 flex">
        <div className="py-2.5 px-4 text-sm font-semibold text-primary border-b-2 border-primary cursor-pointer">
          Details
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 md:p-6">
        <div className="bg-card border border-border rounded overflow-hidden">

          {/* Section header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-b border-border font-semibold text-sm text-foreground cursor-pointer select-none">
            <span className="text-[10px] text-muted-foreground">▼</span>
            Personal Information
          </div>

          {/* 2-column fields grid */}
          <div className="grid grid-cols-2">
            {personalFields.map(({ leftLabel, leftKey, rightLabel, rightKey, rightExpand }) => (
              <React.Fragment key={leftKey}>

                {/* LEFT cell */}
                <div className="px-4 py-2.5 border-b border-r border-border">
                  <div className="text-xs text-muted-foreground mb-1">{leftLabel}</div>
                  <div className="flex items-center justify-between min-h-5">
                    <div className="flex-1 min-w-0">{renderFieldValue(leftKey, data[leftKey])}</div>
                    <span className="text-muted-foreground text-xs opacity-60 cursor-pointer ml-2 flex-shrink-0">✏</span>
                  </div>
                </div>

                {/* RIGHT cell */}
                <div className="px-4 py-2.5 border-b border-border">
                  {rightLabel && (
                    <>
                      <div className="text-xs text-muted-foreground mb-1">{rightLabel}</div>
                      <div className="flex items-center justify-between min-h-5">
                        <div className="flex-1 min-w-0">{renderFieldValue(rightKey, data[rightKey])}</div>
                        {rightExpand
                          ? <span className="text-muted-foreground text-xs cursor-pointer ml-2 flex-shrink-0">⤢</span>
                          : <span className="text-muted-foreground text-xs opacity-60 cursor-pointer ml-2 flex-shrink-0">✏</span>
                        }
                      </div>
                    </>
                  )}
                </div>

              </React.Fragment>
            ))}

            {/* Extra dynamic fields not covered by fixed pairs */}
            {extraFields.map(({ leftLabel, leftKey }, i) => (
              <React.Fragment key={leftKey}>
                <div className="px-4 py-2.5 border-b border-r border-border">
                  <div className="text-xs text-muted-foreground mb-1">{leftLabel}</div>
                  <div className="flex items-center justify-between min-h-5">
                    <div className="flex-1 min-w-0">{renderFieldValue(leftKey, data[leftKey])}</div>
                    <span className="text-muted-foreground text-xs opacity-60 cursor-pointer ml-2 flex-shrink-0">✏</span>
                  </div>
                </div>
                {/* Empty right cell to keep grid balanced */}
                <div className="px-4 py-2.5 border-b border-border" />
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default LeadDetail;
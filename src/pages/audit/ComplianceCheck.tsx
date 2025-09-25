import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import {
  Calculator,
  AlertTriangle,
  CheckCircle,
  Play,
  RefreshCw,
  Eye,
  Download,
  FileText,
  Receipt,
} from "lucide-react";

interface ComplianceIssue {
  id: string;
  type: "TDS" | "GST";
  accountNo: string;
  customerName: string;
  amount: number;
  issueDescription: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved" | "In Progress";
}

const ComplianceCheck = () => {
  const { toast } = useToast();
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  
  const [complianceIssues] = useState<ComplianceIssue[]>([
    {
      id: "TDS001",
      type: "TDS",
      accountNo: "ACC001247",
      customerName: "Mumbai Enterprises Ltd",
      amount: 25000,
      issueDescription: "TDS not deducted on interest payment above ₹40,000",
      severity: "High",
      status: "Open",
    },
    {
      id: "GST002",
      type: "GST",
      accountNo: "ACC001389",
      customerName: "Delhi Trading Co",
      amount: 18000,
      issueDescription: "GST registration number not updated in system",
      severity: "Medium",
      status: "In Progress",
    },
    {
      id: "TDS003",
      type: "TDS",
      accountNo: "ACC001456",
      customerName: "Bangalore Tech Solutions",
      amount: 15000,
      issueDescription: "Incorrect TDS rate applied (10% instead of 20%)",
      severity: "High",
      status: "Open",
    },
    {
      id: "GST004",
      type: "GST",
      accountNo: "ACC001578",
      customerName: "Chennai Textiles",
      amount: 8500,
      issueDescription: "Missing GST invoice for service charges",
      severity: "Medium",
      status: "Resolved",
    },
  ]);

  const runComplianceAudit = () => {
    setAuditRunning(true);
    setAuditProgress(0);

    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAuditRunning(false);
          toast({
            title: "Compliance Audit Completed",
            description: `Found ${complianceIssues.length} compliance issues requiring attention`,
          });
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 400);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "info";
      default: return "info";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "success";
      case "In Progress": return "warning";
      case "Open": return "error";
      default: return "info";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const tdsIssues = complianceIssues.filter(issue => issue.type === "TDS");
  const gstIssues = complianceIssues.filter(issue => issue.type === "GST");
  const openIssues = complianceIssues.filter(issue => issue.status === "Open");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">TDS/GST Compliance Check</h1>
          <p className="text-muted-foreground mt-1">
            Tax compliance verification and regulatory adherence monitoring
          </p>
        </div>
        <Button 
          onClick={runComplianceAudit}
          disabled={auditRunning}
          className="gap-2"
        >
          {auditRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {auditRunning ? "Running..." : "Run Compliance Audit"}
        </Button>
      </div>

      {/* Audit Progress */}
      {auditRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Running Compliance Audit</h3>
                <span className="text-sm text-muted-foreground">{Math.round(auditProgress)}%</span>
              </div>
              <Progress value={auditProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Checking TDS deductions, GST compliance, and regulatory requirements...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold text-destructive">{complianceIssues.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all compliance areas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TDS Issues</p>
                <p className="text-2xl font-bold text-warning">{tdsIssues.length}</p>
              </div>
              <Calculator className="h-8 w-8 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tax deduction violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GST Issues</p>
                <p className="text-2xl font-bold text-info">{gstIssues.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-info" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              GST compliance gaps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold text-destructive">{openIssues.length}</p>
              </div>
              <FileText className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requiring immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Issues List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Compliance Issues</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceIssues.map((issue) => (
              <div
                key={issue.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      issue.type === "TDS" ? "bg-warning/10" : "bg-info/10"
                    }`}>
                      {issue.type === "TDS" ? (
                        <Calculator className="h-4 w-4 text-warning" />
                      ) : (
                        <Receipt className="h-4 w-4 text-info" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{issue.customerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {issue.id} • Account: {issue.accountNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </StatusBadge>
                    <StatusBadge status={getStatusColor(issue.status)}>
                      {issue.status}
                    </StatusBadge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm">{issue.issueDescription}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-medium">{formatCurrency(issue.amount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      <span className="font-medium">{issue.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {issue.status === "Open" && (
                      <Button size="sm">Resolve</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-warning" />
              TDS Compliance Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Interest Payments</h4>
              <p className="text-sm text-muted-foreground">
                TDS @ 10% applicable on interest payments exceeding ₹40,000 per annum
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Commission Payments</h4>
              <p className="text-sm text-muted-foreground">
                TDS @ 5% on commission and brokerage exceeding ₹15,000
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Professional Services</h4>
              <p className="text-sm text-muted-foreground">
                TDS @ 10% on fees for technical/professional services exceeding ₹30,000
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-info" />
              GST Compliance Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Registration</h4>
              <p className="text-sm text-muted-foreground">
                Valid GST registration required for all business transactions
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Invoice Requirements</h4>
              <p className="text-sm text-muted-foreground">
                Proper GST invoices with GSTIN, HSN codes, and tax breakup
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Return Filing</h4>
              <p className="text-sm text-muted-foreground">
                Timely filing of GSTR-1, GSTR-3B, and annual returns
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceCheck;
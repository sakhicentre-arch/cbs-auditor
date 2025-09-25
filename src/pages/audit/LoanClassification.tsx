import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Play,
  RefreshCw,
  Eye,
  Download,
  TrendingDown,
} from "lucide-react";

interface NPAAccount {
  accountNo: string;
  customerName: string;
  balance: number;
  overdueDays: number;
  classification: "Standard" | "Sub-Standard" | "Doubtful" | "Loss";
  riskScore: number;
}

const LoanClassification = () => {
  const { toast } = useToast();
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  
  const [npaAccounts] = useState<NPAAccount[]>([
    {
      accountNo: "ACC001247",
      customerName: "Mumbai Enterprises Ltd",
      balance: 2500000,
      overdueDays: 120,
      classification: "Sub-Standard",
      riskScore: 75,
    },
    {
      accountNo: "ACC001389",
      customerName: "Delhi Trading Co",
      balance: 1800000,
      overdueDays: 180,
      classification: "Doubtful",
      riskScore: 85,
    },
    {
      accountNo: "ACC001456",
      customerName: "Bangalore Tech Solutions",
      balance: 950000,
      overdueDays: 365,
      classification: "Loss",
      riskScore: 95,
    },
    {
      accountNo: "ACC001578",
      customerName: "Chennai Textiles",
      balance: 3200000,
      overdueDays: 95,
      classification: "Sub-Standard",
      riskScore: 70,
    },
  ]);

  const runNPAAudit = () => {
    setAuditRunning(true);
    setAuditProgress(0);

    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAuditRunning(false);
          toast({
            title: "NPA Audit Completed",
            description: `Found ${npaAccounts.length} NPA accounts requiring attention`,
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Standard": return "success";
      case "Sub-Standard": return "warning";
      case "Doubtful": return "error";
      case "Loss": return "error";
      default: return "info";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Loan Classification</h1>
          <p className="text-muted-foreground mt-1">
            NPA identification and loan classification analysis
          </p>
        </div>
        <Button 
          onClick={runNPAAudit}
          disabled={auditRunning}
          className="gap-2"
        >
          {auditRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {auditRunning ? "Running..." : "Run NPA Audit"}
        </Button>
      </div>

      {/* Audit Progress */}
      {auditRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Running NPA Classification Audit</h3>
                <span className="text-sm text-muted-foreground">{Math.round(auditProgress)}%</span>
              </div>
              <Progress value={auditProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing loan portfolios and payment histories...
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
                <p className="text-sm font-medium text-muted-foreground">Total NPAs</p>
                <p className="text-2xl font-bold text-destructive">{npaAccounts.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +2 from last audit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub-Standard</p>
                <p className="text-2xl font-bold text-warning">
                  {npaAccounts.filter(acc => acc.classification === "Sub-Standard").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              90+ days overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doubtful</p>
                <p className="text-2xl font-bold text-destructive">
                  {npaAccounts.filter(acc => acc.classification === "Doubtful").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              180+ days overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loss Assets</p>
                <p className="text-2xl font-bold text-destructive">
                  {npaAccounts.filter(acc => acc.classification === "Loss").length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              365+ days overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* NPA Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NPA Account Details</CardTitle>
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
            {npaAccounts.map((account) => (
              <div
                key={account.accountNo}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-card-foreground">{account.customerName}</h3>
                    <p className="text-sm text-muted-foreground">Account: {account.accountNo}</p>
                  </div>
                  <StatusBadge status={getClassificationColor(account.classification)}>
                    {account.classification}
                  </StatusBadge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Outstanding Balance</p>
                    <p className="font-medium">{formatCurrency(account.balance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overdue Days</p>
                    <p className="font-medium text-destructive">{account.overdueDays} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Score</p>
                    <p className="font-medium">{account.riskScore}/100</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Actions</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classification Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>NPA Classification Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-medium text-success">Standard</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular payment, no overdue installments
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-medium text-warning">Sub-Standard</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overdue for more than 90 days but less than 12 months
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Doubtful</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overdue for more than 12 months but less than 18 months
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Loss</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overdue for more than 18 months, considered uncollectible
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanClassification;
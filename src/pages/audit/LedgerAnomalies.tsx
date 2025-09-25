import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Play,
  RefreshCw,
  Eye,
  Download,
  DollarSign,
  RotateCcw,
  FileQuestion,
} from "lucide-react";

interface LedgerAnomaly {
  id: string;
  type: "Round Figures" | "Reversals" | "Misc Entries" | "Duplicate Transactions";
  accountNo: string;
  customerName: string;
  amount: number;
  transactionDate: string;
  description: string;
  riskLevel: "High" | "Medium" | "Low";
  status: "Flagged" | "Reviewed" | "Cleared";
}

const LedgerAnomalies = () => {
  const { toast } = useToast();
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  
  const [anomalies] = useState<LedgerAnomaly[]>([
    {
      id: "ANO001",
      type: "Round Figures",
      accountNo: "ACC001247",
      customerName: "Mumbai Enterprises Ltd",
      amount: 1000000,
      transactionDate: "2024-09-20",
      description: "Cash deposit of exactly ₹10,00,000",
      riskLevel: "High",
      status: "Flagged",
    },
    {
      id: "ANO002",
      type: "Reversals",
      accountNo: "ACC001389",
      customerName: "Delhi Trading Co",
      amount: 250000,
      transactionDate: "2024-09-19",
      description: "Transaction reversed within 24 hours",
      riskLevel: "Medium",
      status: "Reviewed",
    },
    {
      id: "ANO003",
      type: "Misc Entries",
      accountNo: "ACC001456",
      customerName: "Bangalore Tech Solutions",
      amount: 75000,
      transactionDate: "2024-09-18",
      description: "Miscellaneous credit without proper documentation",
      riskLevel: "High",
      status: "Flagged",
    },
    {
      id: "ANO004",
      type: "Duplicate Transactions",
      accountNo: "ACC001578",
      customerName: "Chennai Textiles",
      amount: 150000,
      transactionDate: "2024-09-17",
      description: "Identical transaction posted twice within minutes",
      riskLevel: "Medium",
      status: "Cleared",
    },
    {
      id: "ANO005",
      type: "Round Figures",
      accountNo: "ACC001689",
      customerName: "Kolkata Industries",
      amount: 5000000,
      transactionDate: "2024-09-16",
      description: "Large round figure transfer - ₹50,00,000",
      riskLevel: "High",
      status: "Flagged",
    },
  ]);

  const runAnomalyDetection = () => {
    setAuditRunning(true);
    setAuditProgress(0);

    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAuditRunning(false);
          toast({
            title: "Anomaly Detection Completed",
            description: `Found ${anomalies.length} potential anomalies for review`,
          });
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "info";
      default: return "info";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cleared": return "success";
      case "Reviewed": return "warning";
      case "Flagged": return "error";
      default: return "info";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Round Figures": return <DollarSign className="h-4 w-4" />;
      case "Reversals": return <RotateCcw className="h-4 w-4" />;
      case "Misc Entries": return <FileQuestion className="h-4 w-4" />;
      case "Duplicate Transactions": return <Search className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const roundFiguresCount = anomalies.filter(a => a.type === "Round Figures").length;
  const reversalsCount = anomalies.filter(a => a.type === "Reversals").length;
  const miscEntriesCount = anomalies.filter(a => a.type === "Misc Entries").length;
  const duplicatesCount = anomalies.filter(a => a.type === "Duplicate Transactions").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Ledger Anomaly Detection</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered detection of unusual patterns and suspicious transactions
          </p>
        </div>
        <Button 
          onClick={runAnomalyDetection}
          disabled={auditRunning}
          className="gap-2"
        >
          {auditRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {auditRunning ? "Scanning..." : "Run Anomaly Detection"}
        </Button>
      </div>

      {/* Audit Progress */}
      {auditRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Running Anomaly Detection</h3>
                <span className="text-sm text-muted-foreground">{Math.round(auditProgress)}%</span>
              </div>
              <Progress value={auditProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing transaction patterns, detecting outliers and suspicious activities...
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
                <p className="text-sm font-medium text-muted-foreground">Round Figures</p>
                <p className="text-2xl font-bold text-warning">{roundFiguresCount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Suspicious round amounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reversals</p>
                <p className="text-2xl font-bold text-info">{reversalsCount}</p>
              </div>
              <RotateCcw className="h-8 w-8 text-info" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Quick transaction reversals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Misc Entries</p>
                <p className="text-2xl font-bold text-destructive">{miscEntriesCount}</p>
              </div>
              <FileQuestion className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Undocumented transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duplicates</p>
                <p className="text-2xl font-bold text-warning">{duplicatesCount}</p>
              </div>
              <Search className="h-8 w-8 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Potential duplicate entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detected Anomalies</CardTitle>
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
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      anomaly.riskLevel === "High" ? "bg-destructive/10" :
                      anomaly.riskLevel === "Medium" ? "bg-warning/10" : "bg-info/10"
                    }`}>
                      {getTypeIcon(anomaly.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{anomaly.customerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {anomaly.id} • Account: {anomaly.accountNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={getRiskLevelColor(anomaly.riskLevel)}>
                      {anomaly.riskLevel} Risk
                    </StatusBadge>
                    <StatusBadge status={getStatusColor(anomaly.status)}>
                      {anomaly.status}
                    </StatusBadge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                      {anomaly.type}
                    </span>
                  </div>
                  <p className="text-sm">{anomaly.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-medium">{formatCurrency(anomaly.amount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date: </span>
                      <span className="font-medium">{formatDate(anomaly.transactionDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">Investigate</Button>
                    {anomaly.status === "Flagged" && (
                      <Button size="sm">Mark Reviewed</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detection Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-warning" />
                  <span className="font-medium">Round Figure Detection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Flags transactions with perfectly round amounts (multiples of 10,000+)
                  that may indicate structured transactions or cash deposits
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-info" />
                  <span className="font-medium">Reversal Pattern Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Identifies transactions that are reversed within a short timeframe,
                  potentially indicating errors or fraudulent activity
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Miscellaneous Entry Review</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Flags entries posted to miscellaneous accounts without proper
                  supporting documentation or business justification
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-warning" />
                  <span className="font-medium">Duplicate Detection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uses ML algorithms to identify potential duplicate transactions
                  based on amount, timing, and account patterns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerAnomalies;
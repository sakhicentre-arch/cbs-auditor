import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Eye,
  Upload,
} from "lucide-react";

// Mock data for demonstration
const auditMetrics = {
  totalAccounts: 1247,
  npaAccounts: 89,
  complianceScore: 92.5,
  pendingReviews: 23,
  completedAudits: 156,
  flaggedTransactions: 67,
};

const recentAudits = [
  {
    id: "AUD-001",
    branch: "Mumbai Central",
    type: "Loan Classification",
    status: "completed" as const,
    date: "2024-09-24",
    findings: 12,
  },
  {
    id: "AUD-002", 
    branch: "Delhi North",
    type: "TDS Compliance",
    status: "pending" as const,
    date: "2024-09-23",
    findings: 8,
  },
  {
    id: "AUD-003",
    branch: "Bangalore South",
    type: "Ledger Anomalies",
    status: "warning" as const,
    date: "2024-09-22",
    findings: 25,
  },
];

const complianceItems = [
  { name: "TDS Compliance", score: 95, trend: "up" },
  { name: "GST Filing", score: 88, trend: "down" },
  { name: "Loan Classification", score: 92, trend: "up" },
  { name: "Documentation", score: 87, trend: "stable" },
];

const Dashboard = () => {
  const npaPercentage = ((auditMetrics.npaAccounts / auditMetrics.totalAccounts) * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Audit Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor compliance and audit progress across all branches
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Eye className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Accounts"
          value={auditMetrics.totalAccounts.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="NPA Accounts"
          value={auditMetrics.npaAccounts}
          change={`${npaPercentage}% of total`}
          changeType="negative"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <MetricCard
          title="Compliance Score"
          value={`${auditMetrics.complianceScore}%`}
          change="+3.2% improvement"
          changeType="positive"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          title="Pending Reviews"
          value={auditMetrics.pendingReviews}
          change="Requires attention"
          changeType="negative"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audits */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Audits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-card-foreground">{audit.id}</span>
                      <StatusBadge
                        status={
                          audit.status === "completed"
                            ? "success"
                            : audit.status === "warning"
                            ? "warning"
                            : "pending"
                        }
                      >
                        {audit.status}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {audit.branch} • {audit.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {audit.findings} findings • {audit.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.score}%</span>
                      {item.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : item.trend === "down" ? (
                        <TrendingUp className="h-3 w-3 text-destructive rotate-180" />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-muted" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={item.score}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Upload className="h-6 w-6" />
              Upload CBS Data
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              Run Audit Check
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
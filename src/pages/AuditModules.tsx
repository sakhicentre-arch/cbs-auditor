import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Play,
  RefreshCw,
  Eye,
  Settings,
  TrendingUp,
  CreditCard,
  Calculator,
  Search,
} from "lucide-react";

interface AuditModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "idle" | "running" | "completed" | "error";
  progress?: number;
  findings: number;
  lastRun?: string;
  riskLevel: "low" | "medium" | "high";
}

const AuditModules = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<AuditModule[]>([
    {
      id: "loan-classification",
      name: "Loan Classification (NPA Tagging)",
      description: "Identify and classify Non-Performing Assets based on payment history and aging",
      icon: <CreditCard className="h-6 w-6" />,
      status: "completed",
      findings: 23,
      lastRun: "2024-09-24 14:30",
      riskLevel: "high",
    },
    {
      id: "tds-gst",
      name: "TDS/GST Compliance Check",
      description: "Verify tax deduction at source and GST compliance across all transactions",
      icon: <Calculator className="h-6 w-6" />,
      status: "completed",
      findings: 8,
      lastRun: "2024-09-24 12:15",
      riskLevel: "medium",
    },
    {
      id: "ledger-anomaly",
      name: "Ledger Anomaly Detection",
      description: "Detect unusual patterns, round figures, reversals, and misc entries",
      icon: <Search className="h-6 w-6" />,
      status: "idle",
      findings: 0,
      riskLevel: "low",
    },
    {
      id: "compliance-monitoring",
      name: "Regulatory Compliance",
      description: "Monitor adherence to RBI guidelines and banking regulations",
      icon: <FileText className="h-6 w-6" />,
      status: "idle",
      findings: 0,
      riskLevel: "medium",
    },
  ]);

  const runAuditModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: "running", progress: 0 }
        : module
    ));

    // Simulate audit run
    const auditInterval = setInterval(() => {
      setModules(prev => prev.map(module => {
        if (module.id === moduleId && module.status === "running") {
          const newProgress = Math.min((module.progress || 0) + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(auditInterval);
            const findings = Math.floor(Math.random() * 30) + 1;
            const riskLevels: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
            const riskLevel = riskLevels[Math.floor(Math.random() * 3)];
            
            toast({
              title: "Audit Completed",
              description: `${module.name} completed with ${findings} findings`,
            });
            
            return {
              ...module,
              status: "completed",
              progress: 100,
              findings,
              lastRun: new Date().toISOString().slice(0, 16).replace('T', ' '),
              riskLevel,
            };
          }
          return { ...module, progress: newProgress };
        }
        return module;
      }));
    }, 300);
  };

  const getRiskBadgeColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "error";
    }
  };

  const getStatusIcon = (status: AuditModule["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-info animate-spin" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Audit Modules</h1>
          <p className="text-muted-foreground mt-1">
            Run comprehensive audits on your CBS data
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            modules.forEach(module => {
              if (module.status === "idle") {
                runAuditModule(module.id);
              }
            });
          }}
        >
          <Play className="h-4 w-4" />
          Run All Audits
        </Button>
      </div>

      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
                <p className="text-2xl font-bold text-card-foreground">{modules.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {modules.filter(m => m.status === "completed").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Findings</p>
                <p className="text-2xl font-bold text-warning">
                  {modules.reduce((sum, m) => sum + m.findings, 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-destructive">
                  {modules.filter(m => m.riskLevel === "high").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status)}
                  <StatusBadge
                    status={
                      module.status === "completed" ? "success" :
                      module.status === "running" ? "pending" :
                      module.status === "error" ? "error" : "info"
                    }
                  >
                    {module.status}
                  </StatusBadge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {module.status === "running" && module.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Running audit...</span>
                    <span className="text-muted-foreground">{Math.round(module.progress)}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  {module.findings > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-muted-foreground">{module.findings} findings</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Risk:</span>
                    <StatusBadge status={getRiskBadgeColor(module.riskLevel)}>
                      {module.riskLevel.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>
                {module.lastRun && (
                  <span className="text-muted-foreground">
                    Last run: {module.lastRun}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => runAuditModule(module.id)}
                  disabled={module.status === "running"}
                  className="gap-2"
                >
                  {module.status === "running" ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {module.status === "running" ? "Running..." : "Run Audit"}
                </Button>
                {module.status === "completed" && (
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="h-3 w-3" />
                    View Results
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="gap-2">
                  <Settings className="h-3 w-3" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                module: "Loan Classification",
                action: "Completed audit",
                time: "2 minutes ago",
                result: "23 NPAs identified",
                status: "success" as const,
              },
              {
                module: "TDS/GST Compliance",
                action: "Audit completed",
                time: "1 hour ago", 
                result: "8 compliance issues found",
                status: "warning" as const,
              },
              {
                module: "Ledger Anomaly",
                action: "Audit started",
                time: "3 hours ago",
                result: "In progress...",
                status: "pending" as const,
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === "success" ? "bg-success" :
                    activity.status === "warning" ? "bg-warning" : "bg-info"
                  }`} />
                  <div>
                    <p className="font-medium text-card-foreground">
                      {activity.module} • {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.result} • {activity.time}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditModules;
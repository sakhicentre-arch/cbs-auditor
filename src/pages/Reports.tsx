import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Upload,
  Eye,
  Settings,
  Wand2,
  FileSpreadsheet,
  FileX,
} from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  type: "word" | "excel" | "pdf";
  description: string;
  fields: string[];
  status: "ready" | "generating" | "completed";
  progress?: number;
}

const Reports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reports, setReports] = useState<ReportTemplate[]>([
    {
      id: "temp-1",
      name: "Loan Audit Report",
      type: "word",
      description: "Comprehensive loan classification audit report with NPA analysis",
      fields: ["{{account_no}}", "{{balance}}", "{{classification}}", "{{overdue_days}}"],
      status: "ready",
    },
    {
      id: "temp-2",
      name: "Compliance Summary",
      type: "excel",
      description: "TDS and GST compliance summary with detailed findings",
      fields: ["{{branch_name}}", "{{compliance_score}}", "{{findings_count}}", "{{exceptions}}"],
      status: "ready",
    },
    {
      id: "temp-3",
      name: "Executive Dashboard",
      type: "pdf",
      description: "High-level executive summary with key metrics and trends",
      fields: ["{{total_accounts}}", "{{npa_percentage}}", "{{audit_date}}", "{{auditor_name}}"],
      status: "completed",
    },
  ]);
  const [generatingReports, setGeneratingReports] = useState<string[]>([]);
  const [auditorRemarks, setAuditorRemarks] = useState("");
  const { toast } = useToast();

  const handleGenerateReport = (templateId: string) => {
    setGeneratingReports(prev => [...prev, templateId]);
    setReports(prev => prev.map(report => 
      report.id === templateId 
        ? { ...report, status: "generating", progress: 0 }
        : report
    ));

    // Simulate report generation
    const generateInterval = setInterval(() => {
      setReports(prev => prev.map(report => {
        if (report.id === templateId && report.status === "generating") {
          const newProgress = Math.min((report.progress || 0) + Math.random() * 25, 100);
          if (newProgress >= 100) {
            clearInterval(generateInterval);
            setGeneratingReports(prev => prev.filter(id => id !== templateId));
            toast({
              title: "Report Generated",
              description: `${report.name} has been generated successfully`,
            });
            return { ...report, status: "completed", progress: 100 };
          }
          return { ...report, progress: newProgress };
        }
        return report;
      }));
    }, 200);
  };

  const getFileIcon = (type: "word" | "excel" | "pdf") => {
    switch (type) {
      case "word":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case "pdf":
        return <FileX className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Report Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate automated audit reports with customizable templates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Upload Report Template</p>
                  <p className="text-sm text-muted-foreground">
                    Word or Excel file with placeholders
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Supported placeholders:</strong></p>
              <p>• <code>{"{{account_no}}"}</code> - Account Number</p>
              <p>• <code>{"{{balance}}"}</code> - Account Balance</p>
              <p>• <code>{"{{classification}}"}</code> - Loan Classification</p>
              <p>• <code>{"{{auditor_remarks}}"}</code> - Manual Remarks</p>
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-select">Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose report template" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.type.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditor-name">Auditor Name</Label>
              <Input id="auditor-name" placeholder="Enter auditor name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-period">Audit Period</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">Current Quarter</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Auditor Observations/Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter your observations and remarks here..."
                value={auditorRemarks}
                onChange={(e) => setAuditorRemarks(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((template) => (
              <div
                key={template.id}
                className="border border-border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(template.type)}
                    <div>
                      <h3 className="font-medium text-card-foreground">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.type.toUpperCase()} Template
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={
                      template.status === "completed"
                        ? "success"
                        : template.status === "generating"
                        ? "pending"
                        : "info"
                    }
                  >
                    {template.status === "generating" ? "Generating" : 
                     template.status === "completed" ? "Ready" : "Available"}
                  </StatusBadge>
                </div>

                <p className="text-sm text-muted-foreground">{template.description}</p>

                {template.status === "generating" && template.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Generating...</span>
                      <span className="text-muted-foreground">{Math.round(template.progress)}%</span>
                    </div>
                    <Progress value={template.progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  {template.status === "ready" && (
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(template.id)}
                      disabled={generatingReports.includes(template.id)}
                      className="gap-2"
                    >
                      <Wand2 className="h-3 w-3" />
                      Generate
                    </Button>
                  )}
                  {template.status === "completed" && (
                    <>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="h-3 w-3" />
                        Preview
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="gap-2">
                    <Settings className="h-3 w-3" />
                    Edit
                  </Button>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Available Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field, index) => (
                      <code
                        key={index}
                        className="text-xs bg-muted px-1.5 py-0.5 rounded"
                      >
                        {field}
                      </code>
                    ))}
                    {template.fields.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{template.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Loan Audit Report - September 2024",
                generated: "2024-09-24 14:30",
                size: "2.4 MB",
                type: "PDF",
                status: "completed",
              },
              {
                name: "Compliance Summary - Q3 2024",
                generated: "2024-09-23 11:15",
                size: "1.8 MB",
                type: "Excel",
                status: "completed",
              },
              {
                name: "Executive Dashboard - September",
                generated: "2024-09-22 09:45",
                size: "956 KB",
                type: "PDF",
                status: "completed",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {report.type === "PDF" ? (
                    <FileX className="h-5 w-5 text-red-600" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium text-card-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Generated {report.generated} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="success">Ready</StatusBadge>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload as UploadIcon,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Eye,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "validating" | "success" | "error";
  progress: number;
  validationResults?: {
    totalRecords: number;
    validRecords: number;
    errors: string[];
    warnings: string[];
  };
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const mockValidationResults = {
    totalRecords: 1247,
    validRecords: 1198,
    errors: [
      "Missing PAN for 23 accounts",
      "Invalid date format in rows 45, 89, 156",
      "Debit-Credit imbalance in 12 transactions",
    ],
    warnings: [
      "Round figure amounts detected in 34 entries",
      "Unusual transaction timing in 18 records",
      "Missing GST details for 7 transactions",
    ],
  };

  const handleFileUpload = useCallback((uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId && f.status === "uploading") {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100);
              if (newProgress >= 100) {
                clearInterval(uploadInterval);
                
                // Start validation after upload
                setTimeout(() => {
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === fileId
                        ? { ...f, status: "validating", progress: 0 }
                        : f
                    )
                  );

                  // Simulate validation
                  const validationInterval = setInterval(() => {
                    setFiles((prev) =>
                      prev.map((f) => {
                        if (f.id === fileId && f.status === "validating") {
                          const newProgress = Math.min(f.progress + Math.random() * 25, 100);
                          if (newProgress >= 100) {
                            clearInterval(validationInterval);
                            const hasErrors = Math.random() > 0.7;
                            return {
                              ...f,
                              status: hasErrors ? "error" : "success",
                              progress: 100,
                              validationResults: mockValidationResults,
                            };
                          }
                          return { ...f, progress: newProgress };
                        }
                        return f;
                      })
                    );
                  }, 200);
                }, 500);
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 100);
    });

    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  }, [toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles);
      }
    },
    [handleFileUpload]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">CBS Data Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload and validate your Core Banking System data files
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-card-foreground">
                  Drop your CSV/Excel files here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse and select files
                </p>
              </div>
              <div className="flex justify-center">
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Select Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".csv,.xlsx,.xls"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, Excel (.xlsx, .xls) • Max size: 50MB per file
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={
                          file.status === "success"
                            ? "success"
                            : file.status === "error"
                            ? "error"
                            : "pending"
                        }
                      >
                        {file.status === "uploading"
                          ? "Uploading"
                          : file.status === "validating"
                          ? "Validating"
                          : file.status === "success"
                          ? "Valid"
                          : "Error"}
                      </StatusBadge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(file.status === "uploading" || file.status === "validating") && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {file.status === "uploading" ? "Uploading..." : "Validating..."}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(file.progress)}%
                        </span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.validationResults && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Records:</span>
                          <span className="ml-2 font-medium">
                            {file.validationResults.totalRecords.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valid Records:</span>
                          <span className="ml-2 font-medium text-success">
                            {file.validationResults.validRecords.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {file.validationResults.errors.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">
                              Errors ({file.validationResults.errors.length})
                            </span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                            {file.validationResults.errors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {file.validationResults.warnings.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <span className="text-sm font-medium text-warning">
                              Warnings ({file.validationResults.warnings.length})
                            </span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                            {file.validationResults.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-3 w-3" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Upload;
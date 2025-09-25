import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  success: "bg-success text-success-foreground hover:bg-success/80",
  warning: "bg-warning text-warning-foreground hover:bg-warning/80",
  error: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  info: "bg-info text-info-foreground hover:bg-info/80",
  pending: "bg-muted text-muted-foreground hover:bg-muted/80",
};

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  return (
    <Badge className={cn(statusStyles[status], className)} variant="outline">
      {children}
    </Badge>
  );
};
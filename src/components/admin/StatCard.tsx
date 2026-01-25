import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-card",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  primary: {
    bg: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
  },
  danger: {
    bg: "bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/20",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        styles.bg,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50"
                    : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}

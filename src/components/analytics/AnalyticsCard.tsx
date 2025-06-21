import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

export function AnalyticsCard({
  title,
  value,
  description,
  className,
  icon,
  onClick,
  clickable = false
}: AnalyticsCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden flex flex-col",
        clickable && "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "h-4 w-4 text-muted-foreground flex-shrink-0 transition-colors",
            clickable && "group-hover:text-primary"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-2xl font-bold min-h-[2.5rem] flex items-center justify-start">
          <span className="inline-block text-left leading-tight">{value}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
        {clickable && (
          <p className="text-xs text-primary mt-2 opacity-0 transition-opacity group-hover:opacity-100">
            Click to view detailed analytics →
          </p>
        )}
      </CardContent>
    </Card>
  );
} 
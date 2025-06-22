"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartTypeSelector, ChartThemeSelector, MultiChart } from "@/components/ui/chart";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CalendarDays, TrendingUp, Eye, MousePointerClick, DollarSign, BarChart } from "lucide-react";

interface DetailedAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'views' | 'conversions' | 'revenue' | 'conversion-rate';
  title: string;
  pageId?: string | number;
}

interface AnalyticsData {
  daily: Array<{ name: string; value: number; date: string }>;
  weekly: Array<{ name: string; value: number; week: string }>;
  monthly: Array<{ name: string; value: number; month: string }>;
}

const METRIC_ICONS = {
  views: Eye,
  conversions: MousePointerClick,
  revenue: DollarSign,
  'conversion-rate': BarChart,
};

const METRIC_COLORS = {
  views: '#0088FE',
  conversions: '#00C49F',
  revenue: '#FFBB28',
  'conversion-rate': '#FF8042',
};

export function DetailedAnalyticsModal({
  isOpen,
  onClose,
  metricType,
  title,
  pageId,
}: DetailedAnalyticsModalProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie' | 'radial' | 'radar'>('line');
  const [chartTheme, setChartTheme] = useState<'default' | 'dark' | 'light'>('default');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { makeAuthenticatedRequest } = useAuth();

  const processChartData = (metric: string, realData: any): AnalyticsData => {
    const chartData = realData?.chartData || [];
    const today = new Date();
    // Ensure we get the local date string, not UTC
    const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');

    // Process daily data from the real chartData
    const dailyData = [];
    const dataByDate = new Map();
    
    // First, add all the real data from chartData
    chartData.forEach((item: any) => {
      // Parse the UTC timestamp and convert to local date
      const utcDate = new Date(item.date);
      // Get the local date string (this accounts for timezone offset)
      const dateStr = utcDate.getFullYear() + '-' + 
                     String(utcDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(utcDate.getDate()).padStart(2, '0');
      const date = new Date(dateStr + 'T00:00:00'); // Create date in local timezone
      let value = 0;
      
      switch (metric) {
        case 'views':
          value = Number(item.views) || 0;
          break;
        case 'conversions':
          value = Number(item.conversions) || 0;
          break;
        case 'revenue':
          value = Number(item.revenue) || 0;
          break;
        case 'conversion-rate':
          const views = Number(item.views) || 0;
          const conversions = Number(item.conversions) || 0;
          value = views > 0 ? (conversions / views) * 100 : 0;
          break;
      }
      
      dataByDate.set(dateStr, {
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: metric === 'revenue' ? parseFloat(value.toFixed(2)) : parseFloat(value.toFixed(2)),
        date: dateStr,
      });
    });

    // Only add today's data if it's not already in chartData
    if (realData?.today && !dataByDate.has(todayStr)) {
      let todayValue = 0;
      switch (metric) {
        case 'views':
          todayValue = Number(realData.today.views) || 0;
          break;
        case 'conversions':
          todayValue = Number(realData.today.conversions) || 0;
          break;
        case 'revenue':
          todayValue = Number(realData.today.revenue) || 0;
          break;
        case 'conversion-rate':
          const todayViews = Number(realData.today.views) || 0;
          const todayConversions = Number(realData.today.conversions) || 0;
          todayValue = todayViews > 0 ? (todayConversions / todayViews) * 100 : 0;
          break;
      }
      
      // Add today's data point only if not already present
      dataByDate.set(todayStr, {
        name: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: metric === 'revenue' ? parseFloat(todayValue.toFixed(2)) : parseFloat(todayValue.toFixed(2)),
        date: todayStr,
      });
    }

    // If we have total data but limited historical data, estimate yesterday's values
    if (realData?.today && realData?.total && chartData.length === 0) {
      const totalViews = Number(realData.total.views) || 0;
      const totalConversions = Number(realData.total.conversions) || 0;
      const totalRevenue = Number(realData.total.revenue) || 0;
      
      const todayViews = Number(realData.today.views) || 0;
      const todayConversions = Number(realData.today.conversions) || 0;
      const todayRevenue = Number(realData.today.revenue) || 0;
      
      // Calculate historical values (total - today)
      const historicalViews = Math.max(0, totalViews - todayViews);
      const historicalConversions = Math.max(0, totalConversions - todayConversions);
      const historicalRevenue = Math.max(0, totalRevenue - todayRevenue);
      
      let historicalValue = 0;
      switch (metric) {
        case 'views':
          historicalValue = historicalViews;
          break;
        case 'conversions':
          historicalValue = historicalConversions;
          break;
        case 'revenue':
          historicalValue = historicalRevenue;
          break;
        case 'conversion-rate':
          // Calculate historical conversion rate from historical views/conversions
          historicalValue = historicalViews > 0 ? (historicalConversions / historicalViews) * 100 : 0;
          break;
        default:
          historicalValue = 0;
      }
      
      // Add yesterday's estimated data if there's historical value
      if (historicalValue > 0) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        

        
        dataByDate.set(yesterdayStr, {
          name: yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: metric === 'revenue' ? parseFloat(historicalValue.toFixed(2)) : parseFloat(historicalValue.toFixed(2)),
          date: yesterdayStr,
        });
      }
    }
    
    // Fill in missing days with 0 values for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (dataByDate.has(dateStr)) {
        const existingData = dataByDate.get(dateStr);
        dailyData.push(existingData);
      } else {
        dailyData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: 0,
          date: dateStr,
        });
      }
    }
    
    // Generate weekly data by aggregating daily data
    const weeklyData = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      
      let weeklyValue = 0;
      let daysWithData = 0;
      
      for (let j = 0; j < 7; j++) {
        const checkDate = new Date(weekStart);
        checkDate.setDate(checkDate.getDate() + j);
        const checkDateStr = checkDate.toISOString().split('T')[0];
        
        if (dataByDate.has(checkDateStr)) {
          const dayData = dataByDate.get(checkDateStr);
          if (metric === 'conversion-rate') {
            // For conversion rate, we need to calculate it from the aggregated views/conversions
            const dayViews = chartData.find((item: any) => item.date === checkDateStr)?.views || 0;
            const dayConversions = chartData.find((item: any) => item.date === checkDateStr)?.conversions || 0;
            if (dayViews > 0) {
              weeklyValue += (dayConversions / dayViews) * 100;
              daysWithData++;
            }
          } else {
            weeklyValue += dayData.value;
          }
        }
      }
      
      if (metric === 'conversion-rate' && daysWithData > 0) {
        weeklyValue = weeklyValue / daysWithData; // Average conversion rate for the week
      }
      
      weeklyData.push({
        name: `Week ${12 - i}`,
        value: metric === 'revenue' ? parseFloat(weeklyValue.toFixed(2)) : parseFloat(weeklyValue.toFixed(2)),
        week: weekStart.toISOString().split('T')[0],
      });
    }
    
    // Generate monthly data by aggregating daily data
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(today);
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      const monthEnd = new Date(today);
      monthEnd.setMonth(monthEnd.getMonth() - i + 1, 0);
      
      let monthlyValue = 0;
      let daysWithData = 0;
      
      // Iterate through all days in the month
      for (let day = monthStart.getDate(); day <= monthEnd.getDate(); day++) {
        const checkDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
        const checkDateStr = checkDate.toISOString().split('T')[0];
        
        if (dataByDate.has(checkDateStr)) {
          const dayData = dataByDate.get(checkDateStr);
          if (metric === 'conversion-rate') {
            const dayViews = chartData.find((item: any) => item.date === checkDateStr)?.views || 0;
            const dayConversions = chartData.find((item: any) => item.date === checkDateStr)?.conversions || 0;
            if (dayViews > 0) {
              monthlyValue += (dayConversions / dayViews) * 100;
              daysWithData++;
            }
          } else {
            monthlyValue += dayData.value;
          }
        }
      }
      
      if (metric === 'conversion-rate' && daysWithData > 0) {
        monthlyValue = monthlyValue / daysWithData; // Average conversion rate for the month
      }
      
      monthlyData.push({
        name: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: metric === 'revenue' ? parseFloat(monthlyValue.toFixed(2)) : parseFloat(monthlyValue.toFixed(2)),
        month: monthStart.toISOString().split('T')[0],
      });
    }
    

    
    return {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
    };
  };

  const fetchDetailedAnalytics = async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch real analytics data from the API
      const apiEndpoint = pageId 
        ? `/api/analytics/${pageId}` 
        : '/api/analytics/summary';
      const response = await makeAuthenticatedRequest(apiEndpoint);
      const analyticsData = await response.json();
      
      // Use real chart data from the API response
      const processedData = processChartData(metricType, analyticsData);
      setData(processedData);
    } catch (err) {
      console.error('Error fetching detailed analytics:', err);
      // Fallback to mock data if API fails
      const mockData = generateMockData(metricType);
      setData(mockData);
      setError('Using sample data - live data unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (metric: string): AnalyticsData => {
    const today = new Date();
    const dailyData = [];
    const weeklyData = [];
    const monthlyData = [];

    // Generate daily data for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const value = Math.floor(Math.random() * 100) + (metric === 'revenue' ? Math.random() * 50 : 0);
      
      dailyData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: metric === 'revenue' ? parseFloat(value.toFixed(2)) : Math.floor(value),
        date: date.toISOString().split('T')[0],
      });
    }

    // Generate weekly data for last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const value = Math.floor(Math.random() * 500) + (metric === 'revenue' ? Math.random() * 200 : 0);
      
      weeklyData.push({
        name: `Week ${12 - i}`,
        value: metric === 'revenue' ? parseFloat(value.toFixed(2)) : Math.floor(value),
        week: date.toISOString().split('T')[0],
      });
    }

    // Generate monthly data for last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const value = Math.floor(Math.random() * 2000) + (metric === 'revenue' ? Math.random() * 1000 : 0);
      
      monthlyData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: metric === 'revenue' ? parseFloat(value.toFixed(2)) : Math.floor(value),
        month: date.toISOString().split('T')[0],
      });
    }

    return {
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
    };
  };

  useEffect(() => {
    fetchDetailedAnalytics();
  }, [isOpen, metricType]);

  const getCurrentData = () => {
    if (!data) return [];
    return data[timeRange] || [];
  };

  const getMetricIcon = () => {
    const IconComponent = METRIC_ICONS[metricType];
    return <IconComponent className="h-5 w-5" />;
  };

  const getChartTitle = () => {
    const timeRangeLabel = timeRange.charAt(0).toUpperCase() + timeRange.slice(1);
    return `${title} - ${timeRangeLabel} Breakdown`;
  };

  const getChartDescription = () => {
    const currentData = getCurrentData();
    if (currentData.length === 0) return "";
    
    const total = currentData.reduce((sum, item) => sum + item.value, 0);
    const avg = total / currentData.length;
    
    if (metricType === 'revenue') {
      return `Total: $${total.toFixed(2)} | Average: $${avg.toFixed(2)}`;
    }
    
    if (metricType === 'conversion-rate') {
      return `Average: ${avg.toFixed(2)}%`;
    }
    
    return `Total: ${Math.floor(total).toLocaleString()} | Average: ${Math.floor(avg).toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getMetricIcon()}
            {title} - Detailed Analytics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={timeRange === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('daily')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Daily
              </Button>
              <Button
                variant={timeRange === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('weekly')}
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Weekly
              </Button>
              <Button
                variant={timeRange === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('monthly')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Monthly
              </Button>
            </div>

            <div className="flex gap-2">
              <ChartThemeSelector 
                value={chartTheme} 
                onValueChange={(value) => setChartTheme(value as any)} 
              />
              <ChartTypeSelector 
                value={chartType} 
                onValueChange={(value) => setChartType(value as any)} 
              />
            </div>
          </div>

          {/* Chart Content */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <MultiChart
              data={getCurrentData()}
              title={getChartTitle()}
              description={getChartDescription()}
              chartType={chartType}
              theme={chartTheme}
              className="w-full"
            />
          )}

          {/* Summary Stats */}
          {!isLoading && !error && data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getCurrentData().length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Data Points
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {metricType === 'revenue' 
                    ? `$${getCurrentData().reduce((sum, item) => sum + item.value, 0).toFixed(2)}`
                    : metricType === 'conversion-rate'
                    ? `${(getCurrentData().reduce((sum, item) => sum + item.value, 0) / getCurrentData().length).toFixed(2)}%`
                    : Math.floor(getCurrentData().reduce((sum, item) => sum + item.value, 0)).toLocaleString()
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {metricType === 'conversion-rate' ? `Average ${title}` : `Total ${title}`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getCurrentData().length > 0 
                    ? metricType === 'revenue'
                      ? `$${(getCurrentData().reduce((sum, item) => sum + item.value, 0) / getCurrentData().length).toFixed(2)}`
                      : metricType === 'conversion-rate'
                      ? `${Math.max(...getCurrentData().map(item => item.value)).toFixed(2)}%`
                      : Math.floor(getCurrentData().reduce((sum, item) => sum + item.value, 0) / getCurrentData().length).toLocaleString()
                    : '0'
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {metricType === 'conversion-rate' ? `Peak ${title}` : `Average ${title}`}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 
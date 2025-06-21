"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0']

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface BaseChartProps {
  data: ChartData[]
  title: string
  description?: string
  className?: string
  theme?: 'default' | 'dark' | 'light'
}

interface ChartTheme {
  background: string
  text: string
  grid: string
  tooltip: {
    background: string
    border: string
    text: string
  }
}

const getChartTheme = (theme: string = 'default'): ChartTheme => {
  // Check if we're in a browser environment
  const isDarkMode = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // Check if the document has dark class (for manual theme switching)
  const hasDocumentDarkClass = typeof document !== 'undefined' && 
    document.documentElement.classList.contains('dark')
  
  const isCurrentlyDark = hasDocumentDarkClass || isDarkMode
  
  const themes = {
    default: {
      background: 'transparent',
      text: isCurrentlyDark ? '#f1f5f9' : '#334155',
      grid: isCurrentlyDark ? '#475569' : '#cbd5e1',
      tooltip: {
        background: isCurrentlyDark ? '#1e293b' : '#ffffff',
        border: isCurrentlyDark ? '#475569' : '#cbd5e1',
        text: isCurrentlyDark ? '#f1f5f9' : '#334155'
      }
    },
    dark: {
      background: 'transparent',
      text: '#f1f5f9',
      grid: '#475569',
      tooltip: {
        background: '#1e293b',
        border: '#475569',
        text: '#f8fafc'
      }
    },
    light: {
      background: 'transparent',
      text: '#334155',
      grid: '#cbd5e1',
      tooltip: {
        background: '#ffffff',
        border: '#cbd5e1',
        text: '#0f172a'
      }
    }
  }
  return themes[theme as keyof typeof themes] || themes.default
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  const chartTheme = getChartTheme(theme)
  
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-lg border p-3 shadow-lg"
        style={{
          backgroundColor: chartTheme.tooltip.background,
          borderColor: chartTheme.tooltip.border,
          color: chartTheme.tooltip.text
        }}
      >
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartContainer({ 
  children, 
  title, 
  description, 
  className,
  actions
}: {
  children: React.ReactElement
  title: string
  description?: string
  className?: string
  actions?: React.ReactNode
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Bar Chart Component
export function BarChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis 
          dataKey="name" 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <YAxis 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

// Line Chart Component
export function LineChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis 
          dataKey="name" 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <YAxis 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={COLORS[0]} 
          strokeWidth={2}
          dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

// Area Chart Component
export function AreaChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis 
          dataKey="name" 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <YAxis 
          stroke={chartTheme.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.text, fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={COLORS[0]} 
          fill={COLORS[0]}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// Pie Chart Component
export function PieChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill={chartTheme.text} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend wrapperStyle={{ color: chartTheme.text, fontSize: '14px' }} />
      </PieChart>
    </ChartContainer>
  )
}

// Radial Chart Component
export function RadialChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={data}>
        <RadialBar dataKey="value" cornerRadius={10} fill={COLORS[0]} />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend wrapperStyle={{ color: chartTheme.text }} />
      </RadialBarChart>
    </ChartContainer>
  )
}

// Radar Chart Component
export function RadarChartComponent({ data, title, description, className, theme = 'default' }: BaseChartProps) {
  const chartTheme = getChartTheme(theme)
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={chartTheme.grid} />
        <PolarAngleAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 12 }} />
        <PolarRadiusAxis tick={{ fill: chartTheme.text, fontSize: 10 }} />
        <Radar 
          name="Value" 
          dataKey="value" 
          stroke={COLORS[0]} 
          fill={COLORS[0]} 
          fillOpacity={0.3} 
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
      </RadarChart>
    </ChartContainer>
  )
}

// Chart Type Selector
export function ChartTypeSelector({ 
  value, 
  onValueChange 
}: { 
  value: string
  onValueChange: (value: string) => void 
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select chart type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bar">Bar Chart</SelectItem>
        <SelectItem value="line">Line Chart</SelectItem>
        <SelectItem value="area">Area Chart</SelectItem>
        <SelectItem value="pie">Pie Chart</SelectItem>
        <SelectItem value="radial">Radial Chart</SelectItem>
        <SelectItem value="radar">Radar Chart</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Theme Selector
export function ChartThemeSelector({ 
  value, 
  onValueChange 
}: { 
  value: string
  onValueChange: (value: string) => void 
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="light">Light</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Multi Chart Component that renders different chart types
export function MultiChart({ 
  data, 
  title, 
  description, 
  className, 
  chartType = 'bar',
  theme = 'default'
}: BaseChartProps & { 
  chartType?: 'bar' | 'line' | 'area' | 'pie' | 'radial' | 'radar'
}) {
  const chartProps = { data, title, description, className, theme }
  
  switch (chartType) {
    case 'line':
      return <LineChartComponent {...chartProps} />
    case 'area':
      return <AreaChartComponent {...chartProps} />
    case 'pie':
      return <PieChartComponent {...chartProps} />
    case 'radial':
      return <RadialChartComponent {...chartProps} />
    case 'radar':
      return <RadarChartComponent {...chartProps} />
    default:
      return <BarChartComponent {...chartProps} />
  }
} 
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Database, DollarSign, Zap } from "lucide-react"

export default function ConsumptionPage() {
  const dataSourceColors = {
    "API Endpoints": "#00d9ff", // Cyan
    "File Uploads": "#00ff88", // Lime green
    SharePoint: "#ff6b6b", // Red
  }

  // Sample data for storage usage over time
  const storageData = [
    { month: "Jan", storage: 45, cost: 450 },
    { month: "Feb", storage: 52, cost: 520 },
    { month: "Mar", storage: 68, cost: 680 },
    { month: "Apr", storage: 71, cost: 710 },
    { month: "May", storage: 85, cost: 850 },
    { month: "Jun", storage: 92, cost: 920 },
  ]

  // Sample data for API calls
  const apiCallsData = [
    { month: "Jan", calls: 12500, cost: 125 },
    { month: "Feb", calls: 15800, cost: 158 },
    { month: "Mar", calls: 18200, cost: 182 },
    { month: "Apr", calls: 21500, cost: 215 },
    { month: "May", calls: 24800, cost: 248 },
    { month: "Jun", calls: 28300, cost: 283 },
  ]

  // Sample data for cost breakdown
  const costBreakdown = [
    { name: "Storage", value: 920, color: "#00d9ff" },
    { name: "API Calls", value: 283, color: "#00ff88" },
    { name: "Processing", value: 450, color: "#ff6b6b" },
    { name: "Data Transfer", value: 320, color: "#ffd700" },
  ]

  // Sample data for data sources usage
  const dataSourcesUsage = [
    { source: "API Endpoints", storage: 35, calls: 12500, cost: 408 },
    { source: "File Uploads", storage: 42, calls: 8200, cost: 502 },
    { source: "SharePoint", storage: 15, calls: 7600, cost: 293 },
  ]

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0)
  const totalStorage = storageData[storageData.length - 1].storage
  const totalApiCalls = apiCallsData[apiCallsData.length - 1].calls

  // Daily data for the last 7 days
  const dailyDataBySource = [
    { day: "Mon", "API Endpoints": 45, "File Uploads": 38, SharePoint: 22 },
    { day: "Tue", "API Endpoints": 52, "File Uploads": 42, SharePoint: 25 },
    { day: "Wed", "API Endpoints": 48, "File Uploads": 40, SharePoint: 23 },
    { day: "Thu", "API Endpoints": 61, "File Uploads": 45, SharePoint: 28 },
    { day: "Fri", "API Endpoints": 55, "File Uploads": 43, SharePoint: 26 },
    { day: "Sat", "API Endpoints": 42, "File Uploads": 35, SharePoint: 20 },
    { day: "Sun", "API Endpoints": 38, "File Uploads": 32, SharePoint: 18 },
  ]

  // Daily cost data per source
  const dailyCostBySource = [
    { day: "Mon", "API Endpoints": 120, "File Uploads": 95, SharePoint: 55 },
    { day: "Tue", "API Endpoints": 135, "File Uploads": 105, SharePoint: 62 },
    { day: "Wed", "API Endpoints": 125, "File Uploads": 100, SharePoint: 58 },
    { day: "Thu", "API Endpoints": 158, "File Uploads": 115, SharePoint: 70 },
    { day: "Fri", "API Endpoints": 142, "File Uploads": 108, SharePoint: 65 },
    { day: "Sat", "API Endpoints": 108, "File Uploads": 88, SharePoint: 50 },
    { day: "Sun", "API Endpoints": 98, "File Uploads": 80, SharePoint: 45 },
  ]

  // Monthly data for the last 12 months
  const monthlyDataBySource = [
    { month: "Jan", "API Endpoints": 408, "File Uploads": 380, SharePoint: 220 },
    { month: "Feb", "API Endpoints": 425, "File Uploads": 395, SharePoint: 235 },
    { month: "Mar", "API Endpoints": 450, "File Uploads": 420, SharePoint: 250 },
    { month: "Apr", "API Endpoints": 480, "File Uploads": 445, SharePoint: 270 },
    { month: "May", "API Endpoints": 510, "File Uploads": 475, SharePoint: 290 },
    { month: "Jun", "API Endpoints": 540, "File Uploads": 502, SharePoint: 310 },
    { month: "Jul", "API Endpoints": 565, "File Uploads": 520, SharePoint: 325 },
    { month: "Aug", "API Endpoints": 590, "File Uploads": 545, SharePoint: 340 },
    { month: "Sep", "API Endpoints": 615, "File Uploads": 568, SharePoint: 355 },
    { month: "Oct", "API Endpoints": 640, "File Uploads": 590, SharePoint: 370 },
    { month: "Nov", "API Endpoints": 665, "File Uploads": 612, SharePoint: 385 },
    { month: "Dec", "API Endpoints": 690, "File Uploads": 635, SharePoint: 400 },
  ]

  // Monthly cost data per source
  const monthlyCostBySource = [
    { month: "Jan", "API Endpoints": 1020, "File Uploads": 950, SharePoint: 550 },
    { month: "Feb", "API Endpoints": 1062, "File Uploads": 987, SharePoint: 587 },
    { month: "Mar", "API Endpoints": 1125, "File Uploads": 1050, SharePoint: 625 },
    { month: "Apr", "API Endpoints": 1200, "File Uploads": 1112, SharePoint: 675 },
    { month: "May", "API Endpoints": 1275, "File Uploads": 1187, SharePoint: 725 },
    { month: "Jun", "API Endpoints": 1350, "File Uploads": 1255, SharePoint: 775 },
    { month: "Jul", "API Endpoints": 1412, "File Uploads": 1300, SharePoint: 812 },
    { month: "Aug", "API Endpoints": 1475, "File Uploads": 1362, SharePoint: 850 },
    { month: "Sep", "API Endpoints": 1537, "File Uploads": 1420, SharePoint: 887 },
    { month: "Oct", "API Endpoints": 1600, "File Uploads": 1475, SharePoint: 925 },
    { month: "Nov", "API Endpoints": 1662, "File Uploads": 1530, SharePoint: 962 },
    { month: "Dec", "API Endpoints": 1725, "File Uploads": 1587, SharePoint: 1000 },
  ]

  // Quarterly data
  const quarterlyDataBySource = [
    { quarter: "Q1", "API Endpoints": 1283, "File Uploads": 1195, SharePoint: 705 },
    { quarter: "Q2", "API Endpoints": 1430, "File Uploads": 1340, SharePoint: 835 },
    { quarter: "Q3", "API Endpoints": 1770, "File Uploads": 1633, SharePoint: 995 },
    { quarter: "Q4", "API Endpoints": 1995, "File Uploads": 1837, SharePoint: 1162 },
  ]

  // Quarterly cost data per source
  const quarterlyCostBySource = [
    { quarter: "Q1", "API Endpoints": 3207, "File Uploads": 2987, SharePoint: 1762 },
    { quarter: "Q2", "API Endpoints": 3675, "File Uploads": 3349, SharePoint: 2087 },
    { quarter: "Q3", "API Endpoints": 4424, "File Uploads": 4082, SharePoint: 2549 },
    { quarter: "Q4", "API Endpoints": 4987, "File Uploads": 4592, SharePoint: 2887 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Consumption & Costs</h1>
        <p className="text-muted-foreground mt-2">Monitor your data usage and associated costs</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Database className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorage} GB</div>
            <p className="text-xs text-muted-foreground">+7 GB from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-lime-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalApiCalls / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">+3.5K from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+$70 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">Month-over-month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage & Cost Trend</CardTitle>
            <CardDescription>Monthly storage consumption and associated costs by data source</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyDataBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                      <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                      <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="monthly" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyDataBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="API Endpoints"
                        stroke={dataSourceColors["API Endpoints"]}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="File Uploads"
                        stroke={dataSourceColors["File Uploads"]}
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="SharePoint" stroke={dataSourceColors.SharePoint} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="quarterly" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterlyDataBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                      <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                      <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* API Calls Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Calls & Cost Trend</CardTitle>
            <CardDescription>API call volume and associated costs by data source</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyCostBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                      <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                      <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="monthly" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyCostBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="API Endpoints"
                        stroke={dataSourceColors["API Endpoints"]}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="File Uploads"
                        stroke={dataSourceColors["File Uploads"]}
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="SharePoint" stroke={dataSourceColors.SharePoint} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="quarterly" className="mt-6">
                <ChartContainer
                  config={{
                    "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                    "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                    SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quarterlyCostBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                      <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                      <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of costs across services</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                storage: { label: "Storage", color: "#00d9ff" },
                api: { label: "API Calls", color: "#00ff88" },
                processing: { label: "Processing", color: "#ff6b6b" },
                transfer: { label: "Data Transfer", color: "#ffd700" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Data Sources Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Usage by Data Source</CardTitle>
            <CardDescription>Storage and cost breakdown by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataSourcesUsage.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{source.source}</span>
                    <Badge variant="outline">${source.cost}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">Storage</p>
                      <p className="font-semibold">{source.storage} GB</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground text-xs">API Calls</p>
                      <p className="font-semibold">{(source.calls / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Projection */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Projection</CardTitle>
          <CardDescription>Estimated costs for the next 6 months based on current growth rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Next Month (Jul)</p>
              <p className="text-2xl font-bold text-foreground">$1,973</p>
              <p className="text-xs text-muted-foreground mt-1">+$70 from current</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">3 Months (Oct)</p>
              <p className="text-2xl font-bold text-foreground">$2,156</p>
              <p className="text-xs text-muted-foreground mt-1">+$253 from current</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">6 Months (Dec)</p>
              <p className="text-2xl font-bold text-foreground">$2,389</p>
              <p className="text-xs text-muted-foreground mt-1">+$486 from current</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage by Data Source */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage by Data Source</CardTitle>
          <CardDescription>Track storage consumption across different data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyDataBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                    <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                    <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyDataBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="API Endpoints"
                      stroke={dataSourceColors["API Endpoints"]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="File Uploads"
                      stroke={dataSourceColors["File Uploads"]}
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="SharePoint" stroke={dataSourceColors.SharePoint} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="quarterly" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyDataBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                    <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                    <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cost by Data Source */}
      <Card>
        <CardHeader>
          <CardTitle>Cost by Data Source</CardTitle>
          <CardDescription>Monitor costs associated with each data source</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyCostBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="API Endpoints"
                      stroke={dataSourceColors["API Endpoints"]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="File Uploads"
                      stroke={dataSourceColors["File Uploads"]}
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="SharePoint" stroke={dataSourceColors.SharePoint} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCostBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="API Endpoints" fill={dataSourceColors["API Endpoints"]} />
                    <Bar dataKey="File Uploads" fill={dataSourceColors["File Uploads"]} />
                    <Bar dataKey="SharePoint" fill={dataSourceColors.SharePoint} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="quarterly" className="mt-6">
              <ChartContainer
                config={{
                  "API Endpoints": { label: "API Endpoints", color: dataSourceColors["API Endpoints"] },
                  "File Uploads": { label: "File Uploads", color: dataSourceColors["File Uploads"] },
                  SharePoint: { label: "SharePoint", color: dataSourceColors.SharePoint },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quarterlyCostBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="API Endpoints"
                      stroke={dataSourceColors["API Endpoints"]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="File Uploads"
                      stroke={dataSourceColors["File Uploads"]}
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="SharePoint" stroke={dataSourceColors.SharePoint} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

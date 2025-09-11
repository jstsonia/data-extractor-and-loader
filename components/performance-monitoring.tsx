"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  BarChart3,
  Clock,
  Cpu,
  Database,
  Download,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  trendValue: number
  status: "good" | "warning" | "critical"
}

interface SystemResource {
  name: string
  usage: number
  total: number
  unit: string
  status: "good" | "warning" | "critical"
}

export function PerformanceMonitoring() {
  const [timeRange, setTimeRange] = useState("1h")
  const [refreshInterval, setRefreshInterval] = useState("30s")

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "Throughput",
      value: 12450,
      unit: "records/min",
      trend: "up",
      trendValue: 8.5,
      status: "good",
    },
    {
      name: "Latency",
      value: 245,
      unit: "ms",
      trend: "down",
      trendValue: 12.3,
      status: "good",
    },
    {
      name: "Error Rate",
      value: 2.1,
      unit: "%",
      trend: "up",
      trendValue: 0.8,
      status: "warning",
    },
    {
      name: "Success Rate",
      value: 97.9,
      unit: "%",
      trend: "stable",
      trendValue: 0.1,
      status: "good",
    },
  ]

  const systemResources: SystemResource[] = [
    {
      name: "CPU Usage",
      usage: 45,
      total: 100,
      unit: "%",
      status: "good",
    },
    {
      name: "Memory Usage",
      usage: 6.8,
      total: 16,
      unit: "GB",
      status: "good",
    },
    {
      name: "Disk Usage",
      usage: 234,
      total: 1000,
      unit: "GB",
      status: "good",
    },
    {
      name: "Network I/O",
      usage: 125,
      total: 1000,
      unit: "Mbps",
      status: "good",
    },
  ]

  const pipelineStages = [
    {
      name: "Data Extraction",
      throughput: "8,450 records/min",
      latency: "120ms",
      status: "good",
      bottleneck: false,
    },
    {
      name: "Data Validation",
      throughput: "8,200 records/min",
      latency: "85ms",
      status: "good",
      bottleneck: false,
    },
    {
      name: "Data Transformation",
      throughput: "6,800 records/min",
      latency: "340ms",
      status: "warning",
      bottleneck: true,
    },
    {
      name: "Data Loading",
      throughput: "7,200 records/min",
      latency: "180ms",
      status: "good",
      bottleneck: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-secondary"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-secondary text-secondary-foreground">Good</Badge>
      case "warning":
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>
      case "critical":
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-secondary" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />
      case "stable":
        return <div className="h-3 w-3 rounded-full bg-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Monitoring</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring of your data processing pipeline</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Last 5 min</SelectItem>
              <SelectItem value="15m">Last 15 min</SelectItem>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10s">10 seconds</SelectItem>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.trend === "up" ? "+" : metric.trend === "down" ? "-" : ""}
                  {metric.trendValue}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metric.value.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
              </div>
              <div className="mt-2">{getStatusBadge(metric.status)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Throughput Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Throughput Over Time
                </CardTitle>
                <CardDescription>Records processed per minute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                  Throughput chart would be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Latency Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response Time
                </CardTitle>
                <CardDescription>Average processing latency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                  Latency chart would be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Error Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Error Rate Trends
                </CardTitle>
                <CardDescription>Error percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                  Error rate chart would be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Success Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Success Rate
                </CardTitle>
                <CardDescription>Successful processing percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                  Success rate chart would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Performance</CardTitle>
              <CardDescription>Performance metrics for each stage of the data processing pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineStages.map((stage, index) => (
                  <div
                    key={stage.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          {stage.name}
                          {stage.bottleneck && <Badge className="bg-yellow-500 text-white">Bottleneck</Badge>}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Throughput: {stage.throughput}</span>
                          <span>Latency: {stage.latency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(stage.status)}
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Flow Diagram</CardTitle>
              <CardDescription>Visual representation of data flow through the pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                Pipeline flow diagram would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  System Resources
                </CardTitle>
                <CardDescription>Current system resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {systemResources.map((resource) => {
                  const percentage = (resource.usage / resource.total) * 100
                  const Icon =
                    {
                      "CPU Usage": Cpu,
                      "Memory Usage": MemoryStick,
                      "Disk Usage": HardDrive,
                      "Network I/O": Network,
                    }[resource.name] || Server

                  return (
                    <div key={resource.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{resource.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {resource.usage} / {resource.total} {resource.unit}
                          </span>
                          {getStatusBadge(resource.status)}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Resource History */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage History</CardTitle>
                <CardDescription>Historical resource utilization trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded">
                  Resource usage history chart would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Performance
              </CardTitle>
              <CardDescription>Database connection and query performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-foreground">45ms</div>
                  <div className="text-sm text-muted-foreground">Avg Query Time</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-foreground">12/20</div>
                  <div className="text-sm text-muted-foreground">Active Connections</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-foreground">99.8%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Recent performance-related alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div>
                      <div className="font-medium text-foreground">High CPU Usage Detected</div>
                      <div className="text-sm text-muted-foreground">CPU usage exceeded 80% threshold</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 minutes ago</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <div className="font-medium text-foreground">Performance Improved</div>
                      <div className="text-sm text-muted-foreground">Throughput returned to normal levels</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">15 minutes ago</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div>
                      <div className="font-medium text-foreground">Pipeline Bottleneck</div>
                      <div className="text-sm text-muted-foreground">Data transformation stage showing delays</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

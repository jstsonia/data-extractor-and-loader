"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Download,
  Upload,
  Server,
} from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      name: "Total Data Sources",
      value: "12",
      change: "+2 from last month",
      icon: Database,
      color: "text-primary",
    },
    {
      name: "Files Processed Today",
      value: "1,247",
      change: "+12% from yesterday",
      icon: FileText,
      color: "text-secondary",
    },
    {
      name: "Active Errors",
      value: "3",
      change: "-5 from yesterday",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      name: "Success Rate",
      value: "98.7%",
      change: "+0.3% from last week",
      icon: CheckCircle,
      color: "text-secondary",
    },
  ]

  const recentJobs = [
    {
      id: "job-001",
      source: "SharePoint - Sales Data",
      status: "completed",
      files: 45,
      duration: "2m 34s",
      timestamp: "2 minutes ago",
    },
    {
      id: "job-002",
      source: "API - Customer Records",
      status: "processing",
      files: 128,
      duration: "1m 12s",
      timestamp: "5 minutes ago",
    },
    {
      id: "job-003",
      source: "File Folder - Inventory",
      status: "error",
      files: 23,
      duration: "45s",
      timestamp: "8 minutes ago",
    },
    {
      id: "job-004",
      source: "API - Product Catalog",
      status: "completed",
      files: 67,
      duration: "3m 21s",
      timestamp: "15 minutes ago",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-secondary text-secondary-foreground">Completed</Badge>
      case "processing":
        return <Badge className="bg-primary text-primary-foreground">Processing</Badge>
      case "error":
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Monitor your data extraction and processing pipeline</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            New Extraction
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Extraction Jobs
            </CardTitle>
            <CardDescription>Latest data processing activities and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{job.source}</h4>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{job.files} files</span>
                      <span>{job.duration}</span>
                      <span>{job.timestamp}</span>
                    </div>
                  </div>
                  {job.status === "processing" && (
                    <div className="w-24">
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
            <CardDescription>Current system performance and resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Storage Usage</span>
                  <span className="text-sm text-muted-foreground">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Network I/O</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts for data processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Database className="h-6 w-6" />
              Configure Data Source
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <FileText className="h-6 w-6" />
              Process Files
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Calendar,
  Clock,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react"
import { useDashboardStats, useRecentJobs, useScheduledPipelines, useSystemHealth } from "@/hooks/use-api"
import { apiService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function DashboardOverview() {
  const { data: stats, error: statsError, isLoading: statsLoading } = useDashboardStats()
  const { data: recentJobs, error: jobsError, isLoading: jobsLoading } = useRecentJobs()
  const { data: scheduledPipelines, error: pipelinesError, isLoading: pipelinesLoading } = useScheduledPipelines()
  const { data: systemHealth, error: healthError, isLoading: healthLoading } = useSystemHealth()

  const apiUnavailable =
    !stats?.success || !recentJobs?.success || !scheduledPipelines?.success || !systemHealth?.success

  const handleToggleSchedule = async (pipelineId: string) => {
    try {
      await apiService.toggleSchedule(pipelineId)
      toast({
        title: "Schedule Updated",
        description: "Pipeline schedule has been toggled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const statsData = stats?.data
    ? [
        {
          name: "Total Data Sources",
          value: stats.data.totalSources?.toString() || "12",
          change: "+2 from last month",
          icon: Database,
          color: "text-primary",
        },
        {
          name: "Files Processed Today",
          value: stats.data.filesProcessedToday?.toLocaleString() || "1,247",
          change: "+12% from yesterday",
          icon: FileText,
          color: "text-secondary",
        },
        {
          name: "Active Errors",
          value: stats.data.activeErrors?.toString() || "3",
          change: "-5 from yesterday",
          icon: AlertTriangle,
          color: "text-destructive",
        },
        {
          name: "Success Rate",
          value: `${stats.data.successRate || 98.7}%`,
          change: "+0.3% from last week",
          icon: CheckCircle,
          color: "text-secondary",
        },
      ]
    : [
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

  const getScheduleStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
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

      {apiUnavailable && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to the FastAPI backend. Please ensure your FastAPI server is running and the
            NEXT_PUBLIC_API_URL environment variable is set correctly. Displaying sample data for demonstration.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : statsData.map((stat) => (
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
            {jobsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs?.data?.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">{job.source}</h4>
                        {getStatusBadge(job.status)}
                        {job.scheduled && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="mr-1 h-3 w-3" />
                            Scheduled
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{job.files} files</span>
                        <span>{job.duration}</span>
                        <span>{job.timestamp}</span>
                      </div>
                    </div>
                    {job.status === "processing" && (
                      <div className="w-24">
                        <Progress value={job.progress || 65} className="h-2" />
                      </div>
                    )}
                  </div>
                )) || <div className="text-center text-muted-foreground py-8">No recent jobs found</div>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Scheduled Pipelines
            </CardTitle>
            <CardDescription>Automated data extraction schedules and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {pipelinesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledPipelines?.data?.map((pipeline: any) => (
                  <div
                    key={pipeline.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">{pipeline.name}</h4>
                        {getScheduleStatusBadge(pipeline.status)}
                        <Badge variant="outline" className="text-xs capitalize">
                          {pipeline.frequency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pipeline.nextRun}
                        </span>
                        <span>Last: {pipeline.lastRun}</span>
                        {pipeline.success ? (
                          <CheckCircle className="h-3 w-3 text-secondary" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleToggleSchedule(pipeline.id)}>
                        {pipeline.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                )) || <div className="text-center text-muted-foreground py-8">No scheduled pipelines found</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
            {healthLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">{systemHealth?.data?.cpu || 45}%</span>
                  </div>
                  <Progress value={systemHealth?.data?.cpu || 45} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">{systemHealth?.data?.memory || 67}%</span>
                  </div>
                  <Progress value={systemHealth?.data?.memory || 67} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Storage Usage</span>
                    <span className="text-sm text-muted-foreground">{systemHealth?.data?.storage || 23}%</span>
                  </div>
                  <Progress value={systemHealth?.data?.storage || 23} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Network I/O</span>
                    <span className="text-sm text-muted-foreground">{systemHealth?.data?.network || 12}%</span>
                  </div>
                  <Progress value={systemHealth?.data?.network || 12} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts for data processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                Configure Data Source
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6" />
                Process Files
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                Manage Schedules
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

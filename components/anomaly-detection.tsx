"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Activity,
  AlertTriangle,
  Bell,
  BellRing,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Mail,
  Slack,
  Webhook,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Server,
  FolderOpen,
  Share2,
  Database,
} from "lucide-react"
import { useAnomalies, useAnomalyRules } from "@/hooks/use-api"
import { apiService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { mutate } from "swr"

interface Anomaly {
  id: string
  type: "volume" | "pattern" | "outlier" | "trend" | "threshold"
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  source: string
  detectedAt: string
  value: string
  expectedRange: string
  confidence: number
  status: "active" | "acknowledged" | "resolved" | "false_positive"
  alertsSent: number
}

interface AlertRule {
  id: string
  name: string
  type: "volume" | "pattern" | "outlier" | "trend" | "threshold"
  condition: string
  threshold: string
  isActive: boolean
  channels: string[]
  triggeredCount: number
  lastTriggered?: string
}

const getAnomalyIcon = (type: string) => {
  switch (type) {
    case "volume":
      return TrendingUp
    case "pattern":
      return Activity
    case "outlier":
      return Zap
    case "trend":
      return TrendingDown
    case "threshold":
      return AlertTriangle
    default:
      return Activity
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
    case "high":
      return <Badge className="bg-orange-500 text-white">High</Badge>
    case "medium":
      return <Badge className="bg-yellow-500 text-white">Medium</Badge>
    case "low":
      return <Badge className="bg-blue-500 text-white">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-destructive text-destructive-foreground">Active</Badge>
    case "acknowledged":
      return <Badge className="bg-yellow-500 text-white">Acknowledged</Badge>
    case "resolved":
      return <Badge className="bg-secondary text-secondary-foreground">Resolved</Badge>
    case "false_positive":
      return <Badge variant="outline">False Positive</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return Mail
    case "slack":
      return Slack
    case "webhook":
      return Webhook
    default:
      return Bell
  }
}

const getSourceIcon = (source: string) => {
  if (source.toLowerCase().includes("api")) return Server
  if (source.toLowerCase().includes("sharepoint")) return Share2
  if (source.toLowerCase().includes("folder") || source.toLowerCase().includes("file")) return FolderOpen
  if (source.toLowerCase().includes("sales") || source.toLowerCase().includes("data")) return Database
  return Database
}

export function AnomalyDetection() {
  const { data: anomaliesResponse, error: anomaliesError, isLoading: anomaliesLoading } = useAnomalies()
  const { data: rulesResponse, error: rulesError, isLoading: rulesLoading } = useAnomalyRules()

  const anomalies = anomaliesResponse?.data || []
  const alertRules = rulesResponse?.data || []

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)

  const handleAcknowledgeAnomaly = async (anomalyId: string) => {
    try {
      await apiService.acknowledgeAnomaly(anomalyId)
      mutate("/api/anomalies") // Refresh anomalies list
      toast({
        title: "Anomaly Acknowledged",
        description: "The anomaly has been acknowledged.",
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to acknowledge anomaly. Please try again.",
        variant: "destructive",
      })
    }
  }

  const anomalyStats = {
    total: anomalies.length,
    active: anomalies.filter((a: any) => a.status === "active").length,
    critical: anomalies.filter((a: any) => a.severity === "critical").length,
    resolved: anomalies.filter((a: any) => a.status === "resolved").length,
  }

  const groupedAnomalies = anomalies.reduce(
    (groups: any, anomaly: any) => {
      const source = anomaly.source
      if (!groups[source]) {
        groups[source] = []
      }
      groups[source].push(anomaly)
      return groups
    },
    {} as Record<string, Anomaly[]>,
  )

  const sourceStats = Object.entries(groupedAnomalies).map(([source, sourceAnomalies]: [string, any]) => ({
    source,
    total: sourceAnomalies.length,
    active: sourceAnomalies.filter((a: any) => a.status === "active").length,
    critical: sourceAnomalies.filter((a: any) => a.severity === "critical").length,
    resolved: sourceAnomalies.filter((a: any) => a.status === "resolved").length,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Anomaly Detection & Alerting</h1>
          <p className="text-muted-foreground mt-2">Monitor data patterns and receive intelligent alerts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Alert Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Alert Rule</DialogTitle>
                <DialogDescription>Define conditions for anomaly detection and alerting</DialogDescription>
              </DialogHeader>
              <AlertRuleForm onClose={() => setIsRuleDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Anomaly Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Anomalies</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{anomalyStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            <BellRing className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{anomalyStats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{anomalyStats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <Activity className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{anomalyStats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully handled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="anomalies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="sources">By Data Source</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>Recent anomalies detected in your data pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              {anomaliesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-5 w-16" />
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : anomaliesError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Anomalies</h3>
                  <p className="text-muted-foreground">Unable to fetch anomaly data. Please try again.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anomaly</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anomalies.map((anomaly: any) => {
                      const AnomalyIcon = getAnomalyIcon(anomaly.type)
                      return (
                        <TableRow key={anomaly.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <AnomalyIcon className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium text-foreground">{anomaly.title}</div>
                                <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {anomaly.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{anomaly.source}</div>
                              <div className="text-muted-foreground">{anomaly.detectedAt}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{anomaly.value}</div>
                              <div className="text-muted-foreground">Expected: {anomaly.expectedRange}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{anomaly.confidence}%</div>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${anomaly.confidence}%` }} />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(anomaly.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => setSelectedAnomaly(anomaly)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              {anomaly.status === "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAcknowledgeAnomaly(anomaly.id)}
                                >
                                  <Bell className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          {/* Data Source Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {sourceStats.map((stat) => {
              const SourceIcon = getSourceIcon(stat.source)
              return (
                <Card key={stat.source}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.source}</CardTitle>
                    <SourceIcon className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.total}</div>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span className="text-destructive">{stat.active} active</span>
                      <span className="text-orange-500">{stat.critical} critical</span>
                      <span className="text-secondary">{stat.resolved} resolved</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Grouped Anomaly Lists */}
          <div className="space-y-4">
            {Object.entries(groupedAnomalies).map(([source, sourceAnomalies]: [string, any]) => {
              const SourceIcon = getSourceIcon(source)
              const activeAnomalies = sourceAnomalies.filter((a: any) => a.status === "active").length
              const criticalAnomalies = sourceAnomalies.filter((a: any) => a.severity === "critical").length

              return (
                <Card key={source}>
                  <Collapsible defaultOpen={activeAnomalies > 0 || criticalAnomalies > 0}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <SourceIcon className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{source}</CardTitle>
                              <CardDescription>
                                {sourceAnomalies.length} anomalies • {activeAnomalies} active • {criticalAnomalies}{" "}
                                critical
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {criticalAnomalies > 0 && (
                              <Badge className="bg-destructive text-destructive-foreground">
                                {criticalAnomalies} Critical
                              </Badge>
                            )}
                            {activeAnomalies > 0 && (
                              <Badge className="bg-orange-500 text-white">{activeAnomalies} Active</Badge>
                            )}
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Anomaly</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sourceAnomalies.map((anomaly: any) => {
                              const AnomalyIcon = getAnomalyIcon(anomaly.type)
                              return (
                                <TableRow key={anomaly.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <AnomalyIcon className="h-4 w-4 text-primary" />
                                      <div>
                                        <div className="font-medium text-foreground">{anomaly.title}</div>
                                        <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                      {anomaly.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="font-medium">{anomaly.value}</div>
                                      <div className="text-muted-foreground">Expected: {anomaly.expectedRange}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-medium">{anomaly.confidence}%</div>
                                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary"
                                          style={{ width: `${anomaly.confidence}%` }}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getStatusBadge(anomaly.status)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button variant="outline" size="sm" onClick={() => setSelectedAnomaly(anomaly)}>
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      {anomaly.status === "active" && (
                                        <Button variant="outline" size="sm">
                                          <Bell className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configure conditions for automatic anomaly detection and alerting</CardDescription>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : rulesError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Rules</h3>
                  <p className="text-muted-foreground">Unable to fetch alert rules. Please try again.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Channels</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertRules.map((rule: any) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {rule.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm">
                            <div className="font-medium">{rule.condition}</div>
                            <div className="text-muted-foreground">Threshold: {rule.threshold}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {rule.channels?.map((channel: string) => {
                              const ChannelIcon = getChannelIcon(channel)
                              return (
                                <div key={channel} className="flex items-center gap-1">
                                  <ChannelIcon className="h-3 w-3" />
                                </div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rule.isActive ? (
                            <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{rule.triggeredCount} times</div>
                            {rule.lastTriggered && (
                              <div className="text-muted-foreground">Last: {rule.lastTriggered}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Detection Settings</CardTitle>
                <CardDescription>Configure anomaly detection parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-detection">Automatic Detection</Label>
                    <p className="text-sm text-muted-foreground">Enable continuous anomaly monitoring</p>
                  </div>
                  <Switch id="auto-detection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ml-models">Machine Learning Models</Label>
                    <p className="text-sm text-muted-foreground">Use ML for pattern recognition</p>
                  </div>
                  <Switch id="ml-models" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="real-time">Real-time Processing</Label>
                    <p className="text-sm text-muted-foreground">Process data streams in real-time</p>
                  </div>
                  <Switch id="real-time" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-frequency">Alert Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Immediate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="escalation">Escalation Policy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Standard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="conservative">Conservative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quiet-hours">Quiet Hours</Label>
                  <Input id="quiet-hours" placeholder="22:00 - 08:00" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Anomaly Detail Dialog */}
      {selectedAnomaly && (
        <Dialog open={!!selectedAnomaly} onOpenChange={() => setSelectedAnomaly(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Anomaly Details</DialogTitle>
              <DialogDescription>Detailed information about the detected anomaly</DialogDescription>
            </DialogHeader>
            <AnomalyDetailView anomaly={selectedAnomaly} onAcknowledge={handleAcknowledgeAnomaly} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AlertRuleForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    metric: "",
    threshold: 0,
    operator: ">" as ">" | "<" | "=" | "!=",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    alertChannels: [] as string[],
    autoResolve: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.metric || !formData.threshold) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await apiService.createAnomalyRule(formData)
      mutate("/api/anomalies/rules") // Refresh rules list
      toast({
        title: "Rule Created",
        description: "Alert rule has been created successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create alert rule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      alertChannels: prev.alertChannels.includes(channel)
        ? prev.alertChannels.filter((c) => c !== channel)
        : [...prev.alertChannels, channel],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input
            id="rule-name"
            placeholder="e.g., High Volume Alert"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Input
            id="rule-description"
            placeholder="Brief description of this alert rule"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="metric">Metric</Label>
          <Input
            id="metric"
            placeholder="e.g., records_per_hour, error_rate"
            value={formData.metric}
            onChange={(e) => setFormData((prev) => ({ ...prev, metric: e.target.value }))}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operator">Operator</Label>
            <Select
              value={formData.operator}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, operator: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=">">Greater than</SelectItem>
                <SelectItem value="<">Less than</SelectItem>
                <SelectItem value="=">Equal to</SelectItem>
                <SelectItem value="!=">Not equal to</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="threshold">Threshold</Label>
            <Input
              id="threshold"
              type="number"
              placeholder="e.g., 10000"
              value={formData.threshold}
              onChange={(e) => setFormData((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="severity">Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value: any) => setFormData((prev) => ({ ...prev, severity: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Alert Channels</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant={formData.alertChannels.includes("email") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleChannel("email")}
            >
              <Mail className="mr-2 h-3 w-3" />
              Email
            </Button>
            <Button
              type="button"
              variant={formData.alertChannels.includes("slack") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleChannel("slack")}
            >
              <Slack className="mr-2 h-3 w-3" />
              Slack
            </Button>
            <Button
              type="button"
              variant={formData.alertChannels.includes("webhook") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleChannel("webhook")}
            >
              <Webhook className="mr-2 h-3 w-3" />
              Webhook
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-resolve"
            checked={formData.autoResolve}
            onChange={(e) => setFormData((prev) => ({ ...prev, autoResolve: e.target.checked }))}
          />
          <Label htmlFor="auto-resolve" className="text-sm">
            Auto-resolve when conditions return to normal
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Rule"}
        </Button>
      </div>
    </form>
  )
}

function AnomalyDetailView({
  anomaly,
  onAcknowledge,
}: {
  anomaly: Anomaly
  onAcknowledge: (anomalyId: string) => void
}) {
  const AnomalyIcon = getAnomalyIcon(anomaly.type)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AnomalyIcon className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{anomaly.title}</h3>
          <p className="text-sm text-muted-foreground">{anomaly.description}</p>
        </div>
      </div>

      <div className="grid gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Source:</span>
          <span className="font-medium">{anomaly.source}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Detected:</span>
          <span className="font-medium">{anomaly.detectedAt}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Value:</span>
          <span className="font-medium">{anomaly.value}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expected Range:</span>
          <span className="font-medium">{anomaly.expectedRange}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Confidence:</span>
          <span className="font-medium">{anomaly.confidence}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Alerts Sent:</span>
          <span className="font-medium">{anomaly.alertsSent}</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Mark as False Positive</Button>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Send Alert
        </Button>
        <Button onClick={() => onAcknowledge(anomaly.id)}>Acknowledge</Button>
      </div>
    </div>
  )
}

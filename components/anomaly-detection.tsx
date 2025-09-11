"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "lucide-react"

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

export function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: "anom-001",
      type: "volume",
      severity: "critical",
      title: "Unusual data volume spike",
      description: "Data ingestion rate is 300% higher than normal baseline",
      source: "Customer API",
      detectedAt: "5 minutes ago",
      value: "15,420 records/hour",
      expectedRange: "3,000-5,000 records/hour",
      confidence: 95,
      status: "active",
      alertsSent: 3,
    },
    {
      id: "anom-002",
      type: "pattern",
      severity: "high",
      title: "Irregular data pattern detected",
      description: "Unexpected data structure in JSON payload",
      source: "SharePoint Reports",
      detectedAt: "12 minutes ago",
      value: "Schema deviation",
      expectedRange: "Standard schema",
      confidence: 87,
      status: "acknowledged",
      alertsSent: 1,
    },
    {
      id: "anom-003",
      type: "outlier",
      severity: "medium",
      title: "Statistical outlier in numeric field",
      description: "Values in 'amount' field exceed 3 standard deviations",
      source: "Sales Data",
      detectedAt: "25 minutes ago",
      value: "$1,250,000",
      expectedRange: "$100-$50,000",
      confidence: 78,
      status: "resolved",
      alertsSent: 2,
    },
    {
      id: "anom-004",
      type: "trend",
      severity: "low",
      title: "Gradual decline in data quality",
      description: "Error rate has been slowly increasing over the past week",
      source: "File Processing",
      detectedAt: "1 hour ago",
      value: "8.5% error rate",
      expectedRange: "2-5% error rate",
      confidence: 65,
      status: "active",
      alertsSent: 0,
    },
  ])

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "rule-001",
      name: "High Volume Alert",
      type: "volume",
      condition: "Records per hour > 10,000",
      threshold: "10,000 records/hour",
      isActive: true,
      channels: ["email", "slack"],
      triggeredCount: 15,
      lastTriggered: "5 minutes ago",
    },
    {
      id: "rule-002",
      name: "Schema Change Detection",
      type: "pattern",
      condition: "JSON schema deviation > 20%",
      threshold: "20% deviation",
      isActive: true,
      channels: ["webhook"],
      triggeredCount: 3,
      lastTriggered: "12 minutes ago",
    },
    {
      id: "rule-003",
      name: "Statistical Outlier Alert",
      type: "outlier",
      condition: "Value > 3 standard deviations",
      threshold: "3σ",
      isActive: false,
      channels: ["email"],
      triggeredCount: 8,
      lastTriggered: "2 days ago",
    },
  ])

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)

  const anomalyStats = {
    total: anomalies.length,
    active: anomalies.filter((a) => a.status === "active").length,
    critical: anomalies.filter((a) => a.severity === "critical").length,
    resolved: anomalies.filter((a) => a.status === "resolved").length,
  }

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
                  {anomalies.map((anomaly) => {
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
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configure conditions for automatic anomaly detection and alerting</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {alertRules.map((rule) => (
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
                          {rule.channels.map((channel) => {
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
            <AnomalyDetailView anomaly={selectedAnomaly} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AlertRuleForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input id="rule-name" placeholder="e.g., High Volume Alert" />
        </div>
        <div>
          <Label htmlFor="rule-type">Anomaly Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select anomaly type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="pattern">Pattern</SelectItem>
              <SelectItem value="outlier">Outlier</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
              <SelectItem value="threshold">Threshold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Textarea id="condition" placeholder="Define the condition that triggers this alert" />
        </div>
        <div>
          <Label htmlFor="threshold">Threshold</Label>
          <Input id="threshold" placeholder="e.g., 10,000 records/hour" />
        </div>
        <div>
          <Label htmlFor="channels">Alert Channels</Label>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-3 w-3" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Slack className="mr-2 h-3 w-3" />
              Slack
            </Button>
            <Button variant="outline" size="sm">
              <Webhook className="mr-2 h-3 w-3" />
              Webhook
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button>Create Rule</Button>
      </div>
    </div>
  )
}

function AnomalyDetailView({ anomaly }: { anomaly: Anomaly }) {
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
        <Button>Acknowledge</Button>
      </div>
    </div>
  )
}

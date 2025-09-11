"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  AlertCircle,
  Bug,
  Database,
  FileX,
} from "lucide-react"

interface DataError {
  id: string
  type: "validation" | "format" | "missing" | "duplicate" | "constraint"
  severity: "critical" | "high" | "medium" | "low"
  message: string
  description: string
  source: string
  fileName: string
  rowNumber?: number
  columnName?: string
  detectedAt: string
  status: "open" | "resolved" | "ignored" | "corrected"
  suggestedFix?: string
  affectedRecords: number
}

interface CorrectionRule {
  id: string
  name: string
  type: "replace" | "transform" | "validate" | "skip"
  condition: string
  action: string
  isActive: boolean
  appliedCount: number
}

export function ErrorDetection() {
  const [errors, setErrors] = useState<DataError[]>([
    {
      id: "err-001",
      type: "validation",
      severity: "critical",
      message: "Invalid email format",
      description: "Email addresses do not match expected format pattern",
      source: "Customer API",
      fileName: "customer_records.json",
      rowNumber: 1247,
      columnName: "email",
      detectedAt: "2 minutes ago",
      status: "open",
      suggestedFix: "Apply email validation regex pattern",
      affectedRecords: 23,
    },
    {
      id: "err-002",
      type: "missing",
      severity: "high",
      message: "Required field missing",
      description: "Customer ID field is empty for multiple records",
      source: "SharePoint",
      fileName: "customer_data.xlsx",
      rowNumber: 892,
      columnName: "customer_id",
      detectedAt: "5 minutes ago",
      status: "corrected",
      suggestedFix: "Generate sequential IDs for missing values",
      affectedRecords: 15,
    },
    {
      id: "err-003",
      type: "duplicate",
      severity: "medium",
      message: "Duplicate records found",
      description: "Multiple records with identical primary keys detected",
      source: "File Folder",
      fileName: "sales_data.csv",
      rowNumber: 3421,
      columnName: "order_id",
      detectedAt: "12 minutes ago",
      status: "open",
      suggestedFix: "Merge duplicate records or add unique suffix",
      affectedRecords: 8,
    },
    {
      id: "err-004",
      type: "format",
      severity: "low",
      message: "Date format inconsistency",
      description: "Mixed date formats found in the same column",
      source: "API",
      fileName: "transaction_log.json",
      rowNumber: 567,
      columnName: "created_date",
      detectedAt: "18 minutes ago",
      status: "ignored",
      suggestedFix: "Standardize to ISO 8601 format",
      affectedRecords: 45,
    },
  ])

  const [correctionRules, setCorrectionRules] = useState<CorrectionRule[]>([
    {
      id: "rule-001",
      name: "Email Format Correction",
      type: "validate",
      condition: "email field contains invalid format",
      action: "Apply regex validation and flag invalid entries",
      isActive: true,
      appliedCount: 156,
    },
    {
      id: "rule-002",
      name: "Missing ID Generation",
      type: "transform",
      condition: "customer_id is null or empty",
      action: "Generate sequential ID starting from max existing ID",
      isActive: true,
      appliedCount: 89,
    },
    {
      id: "rule-003",
      name: "Date Standardization",
      type: "transform",
      condition: "date format is not ISO 8601",
      action: "Convert to YYYY-MM-DD format",
      isActive: false,
      appliedCount: 0,
    },
  ])

  const [selectedError, setSelectedError] = useState<DataError | null>(null)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)

  const getErrorIcon = (type: string) => {
    switch (type) {
      case "validation":
        return AlertTriangle
      case "format":
        return FileX
      case "missing":
        return XCircle
      case "duplicate":
        return Bug
      case "constraint":
        return Database
      default:
        return AlertCircle
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
      case "open":
        return <Badge className="bg-destructive text-destructive-foreground">Open</Badge>
      case "resolved":
        return <Badge className="bg-secondary text-secondary-foreground">Resolved</Badge>
      case "ignored":
        return <Badge variant="outline">Ignored</Badge>
      case "corrected":
        return <Badge className="bg-primary text-primary-foreground">Corrected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const errorStats = {
    total: errors.length,
    open: errors.filter((e) => e.status === "open").length,
    resolved: errors.filter((e) => e.status === "resolved").length,
    critical: errors.filter((e) => e.severity === "critical").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Error Detection & Correction</h1>
          <p className="text-muted-foreground mt-2">Identify and resolve data quality issues</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Correction Rule</DialogTitle>
                <DialogDescription>Define automatic error correction logic</DialogDescription>
              </DialogHeader>
              <CorrectionRuleForm onClose={() => setIsRuleDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Errors</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{errorStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{errorStats.open}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{errorStats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully fixed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{errorStats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="errors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="errors">Error Log</TabsTrigger>
          <TabsTrigger value="rules">Correction Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="severity-filter">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type-filter">Error Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="validation">Validation</SelectItem>
                      <SelectItem value="format">Format</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="ignored">Ignored</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source-filter">Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sources</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="folder">File Folder</SelectItem>
                      <SelectItem value="sharepoint">SharePoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Table */}
          <Card>
            <CardHeader>
              <CardTitle>Error Log</CardTitle>
              <CardDescription>Detected data quality issues and their resolution status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Affected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error) => {
                    const ErrorIcon = getErrorIcon(error.type)
                    return (
                      <TableRow key={error.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ErrorIcon className="h-4 w-4 text-destructive" />
                            <div>
                              <div className="font-medium text-foreground">{error.message}</div>
                              <div className="text-sm text-muted-foreground">{error.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {error.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{error.source}</div>
                            <div className="text-muted-foreground">{error.fileName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {error.rowNumber && <div>Row: {error.rowNumber}</div>}
                            {error.columnName && <div className="text-muted-foreground">{error.columnName}</div>}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(error.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{error.affectedRecords} records</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => setSelectedError(error)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            {error.status === "open" && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </>
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
              <CardTitle>Correction Rules</CardTitle>
              <CardDescription>Automated rules for detecting and correcting data issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {correctionRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {rule.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{rule.condition}</TableCell>
                      <TableCell className="max-w-xs truncate">{rule.action}</TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{rule.appliedCount} times</TableCell>
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Error Trends</CardTitle>
                <CardDescription>Error detection over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart showing error trends would be displayed here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
                <CardDescription>Breakdown by error type and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart showing error distribution would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error Detail Dialog */}
      {selectedError && (
        <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Error Details</DialogTitle>
              <DialogDescription>Detailed information about the detected error</DialogDescription>
            </DialogHeader>
            <ErrorDetailView error={selectedError} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CorrectionRuleForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input id="rule-name" placeholder="e.g., Email Validation Rule" />
        </div>
        <div>
          <Label htmlFor="rule-type">Rule Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select rule type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="validate">Validate</SelectItem>
              <SelectItem value="transform">Transform</SelectItem>
              <SelectItem value="replace">Replace</SelectItem>
              <SelectItem value="skip">Skip</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rule-condition">Condition</Label>
          <Textarea id="rule-condition" placeholder="Define when this rule should be applied" />
        </div>
        <div>
          <Label htmlFor="rule-action">Action</Label>
          <Textarea id="rule-action" placeholder="Define what action to take when condition is met" />
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

function ErrorDetailView({ error }: { error: DataError }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground">{error.message}</h3>
            <p className="text-sm text-muted-foreground">{error.description}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{error.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">File:</span>
            <span className="font-medium">{error.fileName}</span>
          </div>
          {error.rowNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Row:</span>
              <span className="font-medium">{error.rowNumber}</span>
            </div>
          )}
          {error.columnName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Column:</span>
              <span className="font-medium">{error.columnName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Affected Records:</span>
            <span className="font-medium">{error.affectedRecords}</span>
          </div>
        </div>

        {error.suggestedFix && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Suggested Fix:</h4>
            <p className="text-sm text-muted-foreground">{error.suggestedFix}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Ignore</Button>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button>
          <RotateCcw className="mr-2 h-4 w-4" />
          Apply Fix
        </Button>
      </div>
    </div>
  )
}

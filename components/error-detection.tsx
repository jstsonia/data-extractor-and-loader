"use client"

import type React from "react"

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  ChevronDown,
  Server,
  FolderOpen,
  Share2,
} from "lucide-react"
import { useDataErrors, useCorrectionRules } from "@/hooks/use-api"
import { apiService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { mutate } from "swr"

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
  const { data: errorsResponse, error: errorsError, isLoading: errorsLoading } = useDataErrors()
  const { data: rulesResponse, error: rulesError, isLoading: rulesLoading } = useCorrectionRules()

  const errors = errorsResponse?.data || []
  const correctionRules = rulesResponse?.data || []

  const [selectedError, setSelectedError] = useState<DataError | null>(null)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)

  const handleIgnoreError = async (errorId: string) => {
    try {
      await apiService.ignoreError(errorId)
      mutate("/api/errors") // Refresh errors list
      toast({
        title: "Error Ignored",
        description: "The error has been marked as ignored.",
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to ignore error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApplyCorrectionRule = async (ruleId: string, errorIds: string[]) => {
    try {
      await apiService.applyCorrectionRule(ruleId, errorIds)
      mutate("/api/errors") // Refresh errors list
      toast({
        title: "Rule Applied",
        description: "Correction rule has been applied successfully.",
      })
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to apply correction rule. Please try again.",
        variant: "destructive",
      })
    }
  }

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
    open: errors.filter((e: any) => e.status === "open").length,
    resolved: errors.filter((e: any) => e.status === "resolved").length,
    critical: errors.filter((e: any) => e.severity === "critical").length,
  }

  const groupedErrors = errors.reduce(
    (groups: any, error: any) => {
      const source = error.source
      if (!groups[source]) {
        groups[source] = []
      }
      groups[source].push(error)
      return groups
    },
    {} as Record<string, DataError[]>,
  )

  const sourceStats = Object.entries(groupedErrors).map(([source, sourceErrors]: [string, any]) => ({
    source,
    total: sourceErrors.length,
    open: sourceErrors.filter((e: any) => e.status === "open").length,
    critical: sourceErrors.filter((e: any) => e.severity === "critical").length,
    resolved: sourceErrors.filter((e: any) => e.status === "resolved").length,
  }))

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes("api")) return Server
    if (source.toLowerCase().includes("sharepoint")) return Share2
    if (source.toLowerCase().includes("folder")) return FolderOpen
    return Database
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
          <TabsTrigger value="sources">By Data Source</TabsTrigger>
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
              {errorsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : errorsError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Errors</h3>
                  <p className="text-muted-foreground">Unable to fetch error data. Please try again.</p>
                </div>
              ) : (
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
                    {errors.map((error: any) => {
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
                                  <Button variant="outline" size="sm" onClick={() => handleIgnoreError(error.id)}>
                                    <XCircle className="h-3 w-3" />
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
                      <span className="text-destructive">{stat.open} open</span>
                      <span className="text-orange-500">{stat.critical} critical</span>
                      <span className="text-secondary">{stat.resolved} resolved</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Grouped Error Lists */}
          <div className="space-y-4">
            {Object.entries(groupedErrors).map(([source, sourceErrors]: [string, any]) => {
              const SourceIcon = getSourceIcon(source)
              const openErrors = sourceErrors.filter((e: any) => e.status === "open").length
              const criticalErrors = sourceErrors.filter((e: any) => e.severity === "critical").length

              return (
                <Card key={source}>
                  <Collapsible defaultOpen={openErrors > 0 || criticalErrors > 0}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <SourceIcon className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{source}</CardTitle>
                              <CardDescription>
                                {sourceErrors.length} errors • {openErrors} open • {criticalErrors} critical
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {criticalErrors > 0 && (
                              <Badge className="bg-destructive text-destructive-foreground">
                                {criticalErrors} Critical
                              </Badge>
                            )}
                            {openErrors > 0 && <Badge className="bg-orange-500 text-white">{openErrors} Open</Badge>}
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
                              <TableHead>Error</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>File</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Affected</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sourceErrors.map((error: any) => {
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
                                      <div className="font-medium">{error.fileName}</div>
                                      {error.rowNumber && (
                                        <div className="text-muted-foreground">Row: {error.rowNumber}</div>
                                      )}
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
              <CardTitle>Correction Rules</CardTitle>
              <CardDescription>Automated rules for detecting and correcting data issues</CardDescription>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
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
                  <p className="text-muted-foreground">Unable to fetch correction rules. Please try again.</p>
                </div>
              ) : (
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
                    {correctionRules.map((rule: any) => (
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
              )}
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
            <ErrorDetailView
              error={selectedError}
              onIgnore={handleIgnoreError}
              onApplyRule={handleApplyCorrectionRule}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CorrectionRuleForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    condition: "",
    action: "replace" as "replace" | "remove" | "flag",
    replacement: "",
    severity: "medium" as "low" | "medium" | "high",
    autoApply: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await apiService.createCorrectionRule(formData)
      mutate("/api/errors/rules") // Refresh rules list
      toast({
        title: "Rule Created",
        description: "Correction rule has been created successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create correction rule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input
            id="rule-name"
            placeholder="e.g., Email Validation Rule"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Input
            id="rule-description"
            placeholder="Brief description of what this rule does"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="rule-action">Action Type</Label>
          <Select
            value={formData.action}
            onValueChange={(value: any) => setFormData((prev) => ({ ...prev, action: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="replace">Replace</SelectItem>
              <SelectItem value="remove">Remove</SelectItem>
              <SelectItem value="flag">Flag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rule-condition">Condition</Label>
          <Textarea
            id="rule-condition"
            placeholder="Define when this rule should be applied"
            value={formData.condition}
            onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
            required
          />
        </div>
        {formData.action === "replace" && (
          <div>
            <Label htmlFor="replacement">Replacement Value</Label>
            <Input
              id="replacement"
              placeholder="Value to replace with"
              value={formData.replacement}
              onChange={(e) => setFormData((prev) => ({ ...prev, replacement: e.target.value }))}
            />
          </div>
        )}
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
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-apply"
            checked={formData.autoApply}
            onChange={(e) => setFormData((prev) => ({ ...prev, autoApply: e.target.checked }))}
          />
          <Label htmlFor="auto-apply" className="text-sm">
            Auto-apply this rule
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

function ErrorDetailView({
  error,
  onIgnore,
  onApplyRule,
}: {
  error: DataError
  onIgnore: (errorId: string) => void
  onApplyRule: (ruleId: string, errorIds: string[]) => void
}) {
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
        <Button variant="outline" onClick={() => onIgnore(error.id)}>
          Ignore
        </Button>
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

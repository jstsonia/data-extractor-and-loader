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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { mutate } from "swr"
import { useDataSources } from "@/hooks/use-api"
import { apiService } from "@/lib/api"
import {
  Database,
  FolderOpen,
  Globe,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  TestTube,
  Calendar,
  Play,
  Pause,
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "api" | "folder" | "sharepoint"
  status: "active" | "inactive" | "error"
  lastSync: string
  recordsCount: number
  config: Record<string, any>
  schedule?: {
    enabled: boolean
    frequency: "hourly" | "daily" | "weekly" | "monthly"
    time?: string
    days?: string[]
    nextRun?: string
  }
}

export function DataSources() {
  const { data: dataSourcesResponse, error, isLoading } = useDataSources()
  const dataSources = dataSourcesResponse?.data || []

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<any>(null)

  const toggleSchedule = async (sourceId: string) => {
    try {
      await apiService.toggleSchedule(sourceId)
      mutate("/api/data-sources") // Refresh data
      toast({
        title: "Schedule Updated",
        description: "Data source schedule has been toggled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const testConnection = async (sourceId: string) => {
    try {
      const result = await apiService.testDataSource(sourceId)
      toast({
        title: result.data.success ? "Connection Successful" : "Connection Failed",
        description: result.data.message,
        variant: result.data.success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test connection. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteSource = async (sourceId: string) => {
    try {
      await apiService.deleteDataSource(sourceId)
      mutate("/api/data-sources") // Refresh data
      toast({
        title: "Source Deleted",
        description: "Data source has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data source. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "api":
        return Globe
      case "folder":
        return FolderOpen
      case "sharepoint":
        return Database
      default:
        return Database
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "error":
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "inactive":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-2">Configure and manage your data extraction sources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>Configure a new data source for extraction</DialogDescription>
            </DialogHeader>
            <DataSourceForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sources Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Data Sources</h3>
            <p className="text-muted-foreground">Unable to fetch data sources. Please try again.</p>
          </div>
        ) : dataSources.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Sources</h3>
            <p className="text-muted-foreground">Get started by adding your first data source.</p>
          </div>
        ) : (
          dataSources.map((source: any) => {
            const Icon = getSourceIcon(source.type)
            return (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription className="capitalize">{source.type} Source</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(source.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(source.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Sync</span>
                    <span className="text-sm font-medium">{source.lastSync}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Records</span>
                    <span className="text-sm font-medium">{source.recordsCount?.toLocaleString() || 0}</span>
                  </div>
                  {source.schedule && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Schedule</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={source.schedule.enabled ? "default" : "outline"} className="text-xs">
                          {source.schedule.enabled ? "Active" : "Paused"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{source.schedule.frequency}</span>
                      </div>
                    </div>
                  )}
                  {source.schedule?.nextRun && source.schedule.enabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Run</span>
                      <span className="text-sm font-medium">{source.schedule.nextRun}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => testConnection(source.id)}
                    >
                      <TestTube className="mr-2 h-3 w-3" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSource(source)
                        setIsScheduleDialogOpen(true)
                      }}
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                    {source.schedule && (
                      <Button variant="outline" size="sm" onClick={() => toggleSchedule(source.id)}>
                        {source.schedule.enabled ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => deleteSource(source.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Data Source</DialogTitle>
            <DialogDescription>Configure automatic extraction schedule for {selectedSource?.name}</DialogDescription>
          </DialogHeader>
          {selectedSource && (
            <ScheduleForm
              source={selectedSource}
              onClose={() => setIsScheduleDialogOpen(false)}
              onSave={(schedule) => {
                mutate("/api/data-sources") // Refresh data sources list
                toast({
                  title: "Schedule Updated",
                  description: "Data source schedule has been updated successfully.",
                })
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Source Types Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              API Sources
            </CardTitle>
            <CardDescription>Connect to REST APIs and web services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• REST API endpoints</li>
              <li>• Authentication support</li>
              <li>• Rate limiting</li>
              <li>• Real-time polling</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              File Folders
            </CardTitle>
            <CardDescription>Monitor local and network file directories</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• File system monitoring</li>
              <li>• Multiple file formats</li>
              <li>• Batch processing</li>
              <li>• Archive management</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              SharePoint
            </CardTitle>
            <CardDescription>Extract from SharePoint sites and libraries</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Document libraries</li>
              <li>• List data extraction</li>
              <li>• Version control</li>
              <li>• Permission handling</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DataSourceForm({ onClose }: { onClose: () => void }) {
  const [sourceType, setSourceType] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sourceType) {
      toast({
        title: "Missing Information",
        description: "Please select a source type.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const sourceData = {
        name: formData.name || "",
        type: sourceType as "api" | "folder" | "sharepoint",
        config: { ...formData },
      }

      await apiService.createDataSource(sourceData)
      mutate("/api/data-sources") // Refresh data sources list
      toast({
        title: "Data Source Created",
        description: "Your data source has been created successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create data source. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="source-type">Source Type</Label>
        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api">API Endpoint</SelectItem>
            <SelectItem value="folder">File Folder</SelectItem>
            <SelectItem value="sharepoint">SharePoint</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sourceType && (
        <Tabs value={sourceType} className="w-full">
          <TabsContent value="api" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="api-name">Source Name</Label>
                <Input
                  id="api-name"
                  placeholder="e.g., Sales API"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  placeholder="https://api.example.com/data"
                  value={formData.endpoint || ""}
                  onChange={(e) => updateFormData("endpoint", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api-method">HTTP Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="GET" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="api-auth">Authentication</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="api-headers">Headers (JSON)</Label>
                <Textarea id="api-headers" placeholder='{"Authorization": "Bearer token"}' />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="folder" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="folder-name">Source Name</Label>
                <Input
                  id="folder-name"
                  placeholder="e.g., Customer Files"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="folder-path">Folder Path</Label>
                <Input
                  id="folder-path"
                  placeholder="/data/customers"
                  value={formData.path || ""}
                  onChange={(e) => updateFormData("path", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="folder-pattern">File Pattern</Label>
                  <Input id="folder-pattern" placeholder="*.csv, *.json" />
                </div>
                <div>
                  <Label htmlFor="folder-watch">Watch Mode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Enabled" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sharepoint" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="sp-name">Source Name</Label>
                <Input
                  id="sp-name"
                  placeholder="e.g., SharePoint Reports"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sp-site">Site URL</Label>
                <Input
                  id="sp-site"
                  placeholder="https://company.sharepoint.com/sites/reports"
                  value={formData.siteUrl || ""}
                  onChange={(e) => updateFormData("siteUrl", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sp-library">Document Library</Label>
                  <Input id="sp-library" placeholder="Documents" />
                </div>
                <div>
                  <Label htmlFor="sp-auth">Authentication</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="OAuth 2.0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting}>
          <TestTube className="mr-2 h-4 w-4" />
          Test Connection
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Source"}
        </Button>
      </div>
    </form>
  )
}

function ScheduleForm({
  source,
  onClose,
  onSave,
}: {
  source: any
  onClose: () => void
  onSave: (schedule: any) => void
}) {
  const [enabled, setEnabled] = useState(source.schedule?.enabled ?? false)
  const [frequency, setFrequency] = useState(source.schedule?.frequency ?? "daily")
  const [time, setTime] = useState(source.schedule?.time ?? "09:00")
  const [selectedDays, setSelectedDays] = useState<string[]>(source.schedule?.days ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const schedule = {
        enabled,
        frequency: frequency as "hourly" | "daily" | "weekly" | "monthly",
        time: frequency !== "hourly" ? time : undefined,
        days: frequency === "weekly" ? selectedDays : undefined,
        nextRun: enabled ? getNextRunTime(frequency, time, selectedDays) : undefined,
      }

      await apiService.updateSchedule(source.id, schedule)
      onSave(schedule)
      onClose()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getNextRunTime = (freq: string, time: string, days: string[]) => {
    switch (freq) {
      case "hourly":
        return "In 1 hour"
      case "daily":
        return `Tomorrow at ${time}`
      case "weekly":
        return `Next ${days[0]} at ${time}`
      case "monthly":
        return `Next month at ${time}`
      default:
        return "Not scheduled"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="enabled">Enable Schedule</Label>
        <Button variant={enabled ? "default" : "outline"} size="sm" onClick={() => setEnabled(!enabled)}>
          {enabled ? "Enabled" : "Disabled"}
        </Button>
      </div>

      {enabled && (
        <>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency !== "hourly" && (
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          )}

          {frequency === "weekly" && (
            <div>
              <Label>Days of Week</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
                    }}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </Button>
      </div>
    </div>
  )
}

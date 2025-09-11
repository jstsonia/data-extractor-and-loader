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
import { Tabs, TabsContent } from "@/components/ui/tabs"
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
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "api" | "folder" | "sharepoint"
  status: "active" | "inactive" | "error"
  lastSync: string
  recordsCount: number
  config: Record<string, any>
}

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "ds-001",
      name: "Sales API",
      type: "api",
      status: "active",
      lastSync: "2 minutes ago",
      recordsCount: 15420,
      config: { endpoint: "https://api.company.com/sales", method: "GET" },
    },
    {
      id: "ds-002",
      name: "Customer Files",
      type: "folder",
      status: "active",
      lastSync: "15 minutes ago",
      recordsCount: 8934,
      config: { path: "/data/customers", watchMode: true },
    },
    {
      id: "ds-003",
      name: "SharePoint Reports",
      type: "sharepoint",
      status: "error",
      lastSync: "2 hours ago",
      recordsCount: 0,
      config: { siteUrl: "https://company.sharepoint.com/sites/reports", library: "Documents" },
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)

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
        {dataSources.map((source) => {
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
                  <span className="text-sm font-medium">{source.recordsCount.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <TestTube className="mr-2 h-3 w-3" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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

  return (
    <div className="space-y-6">
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
                <Input id="api-name" placeholder="e.g., Sales API" />
              </div>
              <div>
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" placeholder="https://api.example.com/data" />
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
                <Input id="folder-name" placeholder="e.g., Customer Files" />
              </div>
              <div>
                <Label htmlFor="folder-path">Folder Path</Label>
                <Input id="folder-path" placeholder="/data/customers" />
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
                <Input id="sp-name" placeholder="e.g., SharePoint Reports" />
              </div>
              <div>
                <Label htmlFor="sp-site">Site URL</Label>
                <Input id="sp-site" placeholder="https://company.sharepoint.com/sites/reports" />
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
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button>
          <TestTube className="mr-2 h-4 w-4" />
          Test Connection
        </Button>
        <Button>Create Source</Button>
      </div>
    </div>
  )
}

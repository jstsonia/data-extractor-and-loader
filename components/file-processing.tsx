"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Archive,
  FileSpreadsheet,
  FileJson,
  Package,
} from "lucide-react"
import { useProcessingJobs } from "@/hooks/use-api"
import { apiService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { mutate } from "swr"

interface ProcessingJob {
  id: string
  fileName: string
  fileType: "csv" | "json" | "excel" | "parquet" | "zip"
  size: string
  status: "pending" | "processing" | "completed" | "error" | "paused"
  progress: number
  recordsProcessed: number
  totalRecords: number
  startTime: string
  duration: string
  errors: number
  source: string
}

export function FileProcessing() {
  const { data: jobsResponse, error, isLoading } = useProcessingJobs()
  const processingJobs = jobsResponse?.data || []

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "csv":
        return FileText
      case "json":
        return FileJson
      case "excel":
        return FileSpreadsheet
      case "parquet":
        return FileText
      case "zip":
        return Package
      default:
        return FileText
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-secondary text-secondary-foreground">Completed</Badge>
      case "processing":
        return <Badge className="bg-primary text-primary-foreground">Processing</Badge>
      case "error":
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "paused":
        return <Badge className="bg-muted text-muted-foreground">Paused</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "processing":
        return <Clock className="h-4 w-4 text-primary animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "paused":
        return <Pause className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const supportedFormats = [
    { type: "CSV", description: "Comma-separated values", icon: FileText, color: "text-blue-600" },
    { type: "JSON", description: "JavaScript Object Notation", icon: FileJson, color: "text-green-600" },
    {
      type: "Excel",
      description: "Microsoft Excel files (.xlsx, .xls)",
      icon: FileSpreadsheet,
      color: "text-emerald-600",
    },
    { type: "Parquet", description: "Apache Parquet columnar format", icon: FileText, color: "text-purple-600" },
    { type: "ZIP", description: "Compressed archive files", icon: Package, color: "text-orange-600" },
  ]

  const handleJobAction = async (jobId: string, action: "pause" | "resume" | "retry") => {
    try {
      switch (action) {
        case "pause":
          await apiService.pauseJob(jobId)
          break
        case "resume":
          await apiService.resumeJob(jobId)
          break
        case "retry":
          await apiService.retryJob(jobId)
          break
      }
      mutate("/api/processing/jobs") // Refresh data
      toast({
        title: "Action Completed",
        description: `Job ${action} completed successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} job. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Processing</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage file processing jobs</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files for Processing</DialogTitle>
                <DialogDescription>Select files to upload and process</DialogDescription>
              </DialogHeader>
              <FileUploadForm onClose={() => setIsUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Processing Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{processingJobs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {processingJobs.filter((job: any) => job.status === "processing").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {processingJobs.filter((job: any) => job.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Success rate: 95%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {processingJobs.filter((job: any) => job.status === "error").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Jobs</CardTitle>
          <CardDescription>Current and recent file processing activities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-2 w-24" />
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Jobs</h3>
              <p className="text-muted-foreground">Unable to fetch processing jobs. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingJobs.map((job: any) => {
                  const FileIcon = getFileIcon(job.fileType)
                  return (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-foreground">{job.fileName}</div>
                            <div className="text-sm text-muted-foreground">{job.size}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {job.fileType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          {getStatusBadge(job.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={job.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">{job.progress}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{job.recordsProcessed?.toLocaleString() || 0}</div>
                          <div className="text-muted-foreground">of {job.totalRecords?.toLocaleString() || 0}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{job.duration}</div>
                          <div className="text-muted-foreground">{job.startTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.errors > 0 ? (
                          <Badge className="bg-destructive text-destructive-foreground">{job.errors}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {job.status === "processing" && (
                            <Button variant="outline" size="sm" onClick={() => handleJobAction(job.id, "pause")}>
                              <Pause className="h-3 w-3" />
                            </Button>
                          )}
                          {job.status === "paused" && (
                            <Button variant="outline" size="sm" onClick={() => handleJobAction(job.id, "resume")}>
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          {job.status === "error" && (
                            <Button variant="outline" size="sm" onClick={() => handleJobAction(job.id, "retry")}>
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
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

      {/* Supported File Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            Supported File Formats
          </CardTitle>
          <CardDescription>File types that can be automatically detected and processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportedFormats.map((format) => (
              <div key={format.type} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <format.icon className={`h-6 w-6 ${format.color}`} />
                <div>
                  <div className="font-medium text-foreground">{format.type}</div>
                  <div className="text-sm text-muted-foreground">{format.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FileUploadForm({ onClose }: { onClose: () => void }) {
  const [targetSink, setTargetSink] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFiles || !targetSink) {
      toast({
        title: "Missing Information",
        description: "Please select files and specify a target data sink.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      await apiService.uploadFiles(selectedFiles, targetSink)
      mutate("/api/processing/jobs") // Refresh jobs list
      toast({
        title: "Upload Started",
        description: "Files have been uploaded and processing has begun.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="text-lg font-medium text-foreground mb-2">Drop files here or click to browse</div>
        <div className="text-sm text-muted-foreground mb-4">
          Supports CSV, JSON, Excel, Parquet, and ZIP files up to 100MB
        </div>
        <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".csv,.json,.xlsx,.xls,.parquet,.zip"
          className="hidden"
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
        {selectedFiles && (
          <div className="mt-4 text-sm text-muted-foreground">{selectedFiles.length} file(s) selected</div>
        )}
      </div>

      <div>
        <Label htmlFor="target-sink">Target Data Sink</Label>
        <Input
          id="target-sink"
          placeholder="Select destination for processed data"
          value={targetSink}
          onChange={(e) => setTargetSink(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Start Processing"}
        </Button>
      </div>
    </div>
  )
}

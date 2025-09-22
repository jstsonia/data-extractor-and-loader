interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request<{
      totalSources: number
      filesProcessedToday: number
      activeErrors: number
      successRate: number
    }>("/api/dashboard/stats")
  }

  async getRecentJobs(limit = 10) {
    return this.request<any[]>(`/api/jobs/recent?limit=${limit}`)
  }

  async getScheduledPipelines() {
    return this.request<any[]>("/api/pipelines/scheduled")
  }

  async getSystemHealth() {
    return this.request<{
      cpu: number
      memory: number
      storage: number
      network: number
    }>("/api/system/health")
  }

  // Data Sources API
  async getDataSources() {
    return this.request<any[]>("/api/data-sources")
  }

  async createDataSource(source: any) {
    return this.request<any>("/api/data-sources", {
      method: "POST",
      body: JSON.stringify(source),
    })
  }

  async updateDataSource(id: string, source: any) {
    return this.request<any>(`/api/data-sources/${id}`, {
      method: "PUT",
      body: JSON.stringify(source),
    })
  }

  async deleteDataSource(id: string) {
    return this.request<any>(`/api/data-sources/${id}`, {
      method: "DELETE",
    })
  }

  async testDataSource(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/data-sources/${id}/test`, {
      method: "POST",
    })
  }

  async updateSchedule(id: string, schedule: any) {
    return this.request<any>(`/api/data-sources/${id}/schedule`, {
      method: "PUT",
      body: JSON.stringify(schedule),
    })
  }

  async toggleSchedule(id: string) {
    return this.request<any>(`/api/data-sources/${id}/schedule/toggle`, {
      method: "POST",
    })
  }

  // File Processing API
  async getProcessingJobs() {
    return this.request<any[]>("/api/processing/jobs")
  }

  async uploadFiles(files: FileList, targetSink: string) {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("files", file))
    formData.append("target_sink", targetSink)

    return this.request<any>("/api/processing/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }

  async pauseJob(jobId: string) {
    return this.request<any>(`/api/processing/jobs/${jobId}/pause`, {
      method: "POST",
    })
  }

  async resumeJob(jobId: string) {
    return this.request<any>(`/api/processing/jobs/${jobId}/resume`, {
      method: "POST",
    })
  }

  async retryJob(jobId: string) {
    return this.request<any>(`/api/processing/jobs/${jobId}/retry`, {
      method: "POST",
    })
  }

  // Error Detection API
  async getDataErrors(page = 1, limit = 10) {
    return this.request<PaginatedResponse<any>>(`/api/errors?page=${page}&limit=${limit}`)
  }

  async getCorrectionRules() {
    return this.request<any[]>("/api/errors/rules")
  }

  async createCorrectionRule(rule: any) {
    return this.request<any>("/api/errors/rules", {
      method: "POST",
      body: JSON.stringify(rule),
    })
  }

  async applyCorrectionRule(ruleId: string, errorIds: string[]) {
    return this.request<any>(`/api/errors/rules/${ruleId}/apply`, {
      method: "POST",
      body: JSON.stringify({ error_ids: errorIds }),
    })
  }

  async ignoreError(errorId: string) {
    return this.request<any>(`/api/errors/${errorId}/ignore`, {
      method: "POST",
    })
  }

  // Anomaly Detection API
  async getAnomalies() {
    return this.request<any[]>("/api/anomalies")
  }

  async getAnomalyRules() {
    return this.request<any[]>("/api/anomalies/rules")
  }

  async createAnomalyRule(rule: any) {
    return this.request<any>("/api/anomalies/rules", {
      method: "POST",
      body: JSON.stringify(rule),
    })
  }

  async acknowledgeAnomaly(anomalyId: string) {
    return this.request<any>(`/api/anomalies/${anomalyId}/acknowledge`, {
      method: "POST",
    })
  }

  // Performance Monitoring API
  async getPerformanceMetrics(timeRange = "24h") {
    return this.request<any>(`/api/performance/metrics?range=${timeRange}`)
  }

  async getJobPerformance() {
    return this.request<any[]>("/api/performance/jobs")
  }

  async getScheduledJobsPerformance() {
    return this.request<any[]>("/api/performance/scheduled-jobs")
  }

  async getResourceUsage() {
    return this.request<any>("/api/performance/resources")
  }
}

export const apiService = new ApiService()
export default apiService

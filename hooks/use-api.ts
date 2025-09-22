import useSWR from "swr"
import { apiService } from "@/lib/api"

// Dashboard hooks
export function useDashboardStats() {
  return useSWR("/api/dashboard/stats", () => apiService.getDashboardStats())
}

export function useRecentJobs(limit = 10) {
  return useSWR(`/api/jobs/recent?limit=${limit}`, () => apiService.getRecentJobs(limit))
}

export function useScheduledPipelines() {
  return useSWR("/api/pipelines/scheduled", () => apiService.getScheduledPipelines())
}

export function useSystemHealth() {
  return useSWR("/api/system/health", () => apiService.getSystemHealth(), {
    refreshInterval: 30000, // Refresh every 30 seconds
  })
}

// Data Sources hooks
export function useDataSources() {
  return useSWR("/api/data-sources", () => apiService.getDataSources())
}

// File Processing hooks
export function useProcessingJobs() {
  return useSWR("/api/processing/jobs", () => apiService.getProcessingJobs(), {
    refreshInterval: 5000, // Refresh every 5 seconds for real-time updates
  })
}

// Error Detection hooks
export function useDataErrors(page = 1, limit = 10) {
  return useSWR(`/api/errors?page=${page}&limit=${limit}`, () => apiService.getDataErrors(page, limit))
}

export function useCorrectionRules() {
  return useSWR("/api/errors/rules", () => apiService.getCorrectionRules())
}

// Anomaly Detection hooks
export function useAnomalies() {
  return useSWR("/api/anomalies", () => apiService.getAnomalies())
}

export function useAnomalyRules() {
  return useSWR("/api/anomalies/rules", () => apiService.getAnomalyRules())
}

// Performance Monitoring hooks
export function usePerformanceMetrics(timeRange = "24h") {
  return useSWR(`/api/performance/metrics?range=${timeRange}`, () => apiService.getPerformanceMetrics(timeRange))
}

export function useJobPerformance() {
  return useSWR("/api/performance/jobs", () => apiService.getJobPerformance())
}

export function useScheduledJobsPerformance() {
  return useSWR("/api/performance/scheduled-jobs", () => apiService.getScheduledJobsPerformance())
}

export function useResourceUsage() {
  return useSWR("/api/performance/resources", () => apiService.getResourceUsage(), {
    refreshInterval: 10000, // Refresh every 10 seconds
  })
}

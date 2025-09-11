"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, FileText, Settings, Activity, AlertTriangle, BarChart3, Menu, X, Bell, User } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Overview", icon: BarChart3, href: "/", current: pathname === "/" },
    { name: "Data Sources", icon: Database, href: "/data-sources", current: pathname === "/data-sources" },
    { name: "File Processing", icon: FileText, href: "/file-processing", current: pathname === "/file-processing" },
    {
      name: "Error Detection",
      icon: AlertTriangle,
      href: "/error-detection",
      current: pathname === "/error-detection",
    },
    {
      name: "Anomaly Detection",
      icon: Activity,
      href: "/anomaly-detection",
      current: pathname === "/anomaly-detection",
    },
    { name: "Performance", icon: BarChart3, href: "/performance", current: pathname === "/performance" },
    { name: "Settings", icon: Settings, href: "/settings", current: pathname === "/settings" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground">DataFlow</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center px-6">
            <Link href="/">
              <h1 className="text-xl font-bold text-sidebar-foreground cursor-pointer hover:text-sidebar-accent-foreground transition-colors">
                DataFlow
              </h1>
            </Link>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-foreground">Data Extraction Platform</h2>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs">3</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

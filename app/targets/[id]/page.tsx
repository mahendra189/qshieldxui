"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  Building2, Globe, Activity, Server, Settings2, Plus, Play, Pause, AlertTriangle 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { targetsData } from "@/lib/mock-data"

export default function TargetDetailPage() {
  const params = useParams()
  const targetId = params.id as string

  // Assume fetching mockTargetDetail dynamically based on targetId
  const target = targetsData.find(t => t.id === targetId)

  if (!target) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Target Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">The monitoring scope mapped to ID {targetId} could not be located.</p>
          <Button asChild><Link href="/targets">Return to Targets List</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header Profile */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="p-4 bg-primary/10 rounded-xl">
            <Building2 className="size-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{target.organizationName}</h1>
              {target.status === "Scanning" && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 gap-1 animate-pulse">
                  <Activity className="size-3" /> Scanning Active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Globe className="size-4" /> {target.primaryDomain}</span>
              <span className="flex items-center gap-1.5"><Server className="size-4" /> {target.assetsDiscovered} Assets Mapped</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Pause className="size-4" /> Pause Engine
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/assets">
              <Server className="size-4" /> View Asset Logs
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scope" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scope">Discovery Scope</TabsTrigger>
          <TabsTrigger value="configuration">Engine Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="scope" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>In-Scope Domains</CardTitle>
                  <CardDescription>All authorized domains for the discovery agent.</CardDescription>
                </div>
                <Button size="sm" variant="secondary" className="gap-1 h-8"><Plus className="size-3"/> Add</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-muted/30 p-2 border rounded text-sm font-medium">
                    <span className="flex items-center gap-2"><Globe className="size-4 text-primary" /> {target.primaryDomain}</span>
                    <Badge>Primary</Badge>
                  </div>
                  {target.scope.domains.map((domain) => (
                    <div key={domain} className="flex justify-between items-center bg-muted/30 p-2 border rounded text-sm">
                      <span>{domain}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:text-destructive">Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Whitelisted IP Ranges</CardTitle>
                  <CardDescription>Authorized CIDRs for port expansion tracking.</CardDescription>
                </div>
                <Button size="sm" variant="secondary" className="gap-1 h-8"><Plus className="size-3"/> Add</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  {target.scope.ips.map((ip) => (
                    <div key={ip} className="flex justify-between items-center bg-muted/30 p-2 border rounded text-sm font-mono">
                      <span>{ip}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:text-destructive">Remove</Button>
                    </div>
                  ))}
                  <div className="p-3 border rounded-lg bg-amber-500/10 border-amber-500/20 text-amber-500 text-sm flex items-start gap-3 mt-4">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Wide Subnet Risk</p>
                      <p className="text-xs opacity-90 mt-0.5">The block 10.42.0.0/16 contains 65k addresses. Discovery queries may cause compute spikes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Configuration</CardTitle>
              <CardDescription>Modify automated actions generated specifically toward {target.organizationName}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Discovery Frequency</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Continuous / Real-Time Mapping</option>
                    <option selected={target.config.frequency === "Daily"}>Daily Execution</option>
                    <option>Weekly on Sundays</option>
                    <option>Manual Trigger Only</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Governs how frequently the agent attempts external recon.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Assigned Industry Profile</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option selected={target.metadata.industry === "Financial Services"}>Financial Services (Strict)</option>
                    <option>Technology (Standard)</option>
                    <option>Healthcare (HIPAA Mode)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Assigns compliance benchmarks against discovered assets automatically.</p>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2"><Settings2 className="size-4"/> Active Agent Tools</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {target.config.tools.map((tool) => (
                    <div key={tool} className="flex items-center space-x-3 border rounded-md p-3 bg-muted/10">
                      <input type="checkbox" className="h-4 w-4 bg-background border-primary" defaultChecked />
                      <span className="text-sm font-medium font-mono">{tool}</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3 border rounded-md p-3 opacity-50 cursor-not-allowed">
                    <input type="checkbox" className="h-4 w-4 bg-background border-primary" disabled />
                    <span className="text-sm font-medium font-mono">Bruteforce_Directory (Disabled per Policy)</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  )
}

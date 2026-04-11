"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Activity, ShieldCheck, FileText } from "lucide-react"
import { useGlobalData } from "@/app/context/GlobalDataContext"

export default function Page() {
  const { data } = useGlobalData();

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1 text-sm">Security posture and scanning metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">View Reports</Button>
            <Button>Run New Scan</Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Optimal</div>
              <p className="text-xs text-muted-foreground mt-1">All services operational</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.assets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Globally synced assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">Low</div>
                <Badge variant="outline" className="text-green-600 bg-green-500/10 border-green-500/20">Secure</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last scan 2 hours ago</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest scanning operations across your infrastructure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Automated Quantum-Safe Scan", target: "Internal network block 10.0.0.0/24", time: "1h ago" },
              { title: "Asset Discovery Sync", target: "Cloud Provider Subnets", time: "3h ago" },
              { title: "TLS Configuration Verification", target: "External Load Balancers", time: "5h ago" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="p-2 border rounded-md bg-muted/50">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-muted-foreground">{activity.target}</p>
                </div>
                <div className="text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

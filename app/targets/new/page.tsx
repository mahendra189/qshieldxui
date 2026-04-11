"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, Globe, Server, Settings2, ShieldCheck, Cpu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useGlobalData } from "@/app/context/GlobalDataContext"

export default function NewTargetPage() {
  const router = useRouter()
  const { data, setTargets } = useGlobalData()
  
  const [orgName, setOrgName] = React.useState("")
  const [domain, setDomain] = React.useState("")
  const [industry, setIndustry] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/targets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationName: orgName,
          domain: domain,
          industry: industry,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Immediately inject into context so when they land on /targets, it's already there
          setTargets([...data.targets, result.target])
          router.push("/targets")
        }
      } else {
        console.error("Failed to onboard target:", await response.text())
        alert("Failed to onboard target on the server.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("Error reaching the API.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/targets">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Onboard New Target</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define organizational scope to deploy the discovery pipeline.
          </p>
        </div>
      </div>

      <form onSubmit={handleOnboard} className="space-y-6">
        
        {/* Core Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="size-4 text-primary"/> Organization Identity</CardTitle>
            <CardDescription>Primary identification mapping for the target.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name <span className="text-destructive">*</span></label>
              <Input 
                required 
                placeholder="e.g. Acme Corp" 
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Domain <span className="text-destructive">*</span></label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  required 
                  placeholder="e.g. acme.com" 
                  className="pl-9" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Industry Profile</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Select an industry (Optional)</option>
                <option value="Financial Services (Strict)">Financial Services (Strict)</option>
                <option value="Technology (Standard)">Technology (Standard)</option>
                <option value="Healthcare (HIPAA Mode)">Healthcare (HIPAA Mode)</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Scope Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="size-4 text-primary"/> Discovery Bounds</CardTitle>
            <CardDescription>Explicitly whitelist infrastructure for automated crawling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Subdomains (Comma separated)</label>
              <Textarea 
                placeholder="api.acme.com, internal.acme.io"
                className="resize-none h-20"
              />
              <p className="text-xs text-muted-foreground">The agent will strictly stick to these defined bounds if provided.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Whitelisted CIDR IP Ranges</label>
              <Textarea 
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                className="resize-none h-20"
              />
              <p className="text-xs text-muted-foreground">Required for deep port map scanning across physical networks.</p>
            </div>
          </CardContent>
        </Card>

        {/* Engine Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="size-4 text-primary"/> Agent Configuration</CardTitle>
            <CardDescription>Configure how aggressively the backend system parses this target.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduled Execution</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Continuous / Real-Time Mapping</option>
                <option>Daily Execution (Recommended)</option>
                <option>Weekly on Sundays</option>
                <option>Manual Trigger Only</option>
              </select>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-sm font-medium flex items-center gap-2"><Settings2 className="size-4 text-muted-foreground" /> Pre-Flight Tooling Activation</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <input type="checkbox" defaultChecked className="mt-1 size-4 bg-background border-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Subdomain Enumeration</p>
                    <p className="text-xs text-muted-foreground">Uses passive sources to discover unmapped web endpoints.</p>
                  </div>
                </div>
                <div className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <input type="checkbox" defaultChecked className="mt-1 size-4 bg-background border-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Deep Port Scan (Nmap)</p>
                    <p className="text-xs text-muted-foreground">Actively queries all 65,535 TCP/UDP ports against whitelisted IPs.</p>
                  </div>
                </div>
                <div className="flex flex-row items-start space-x-3 rounded-md border p-4">
                  <input type="checkbox" defaultChecked className="mt-1 size-4 bg-background border-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">CVE Signature Crawler</p>
                    <p className="text-xs text-muted-foreground">Cross-references services metadata with NIST databases.</p>
                  </div>
                </div>
                <div className="flex flex-row items-start space-x-3 rounded-md border p-4 bg-muted/20">
                  <input type="checkbox" className="mt-1 size-4 bg-background border-primary" disabled />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">Aggressive Bruteforce</p>
                    <p className="text-xs text-muted-foreground">Disabled by default due to strict global rate-limit policies.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t items-center justify-between py-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="size-4" /> Secure Pipeline Initialization</span>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" className="text-muted-foreground" onClick={() => router.push("/targets")} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Deploying..." : "Deploy Target Agent"}
              </Button>
            </div>
          </CardFooter>
        </Card>

      </form>
    </div>
  )
}


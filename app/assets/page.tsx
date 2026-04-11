"use client"

import * as React from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search } from "lucide-react"

import { assets, targetsData } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"

export default function AssetsPage() {
  const [selectedTarget, setSelectedTarget] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredAssets = React.useMemo(() => {
    return assets.filter((a) => {
      const matchesTarget = selectedTarget === "all" || a.targetId === selectedTarget
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.type.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTarget && matchesSearch
    })
  }, [selectedTarget, searchQuery])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assets Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A comprehensive list of all discovered external and internal assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            <option value="all">Global View (All Targets)</option>
            {targetsData.map(t => (
              <option key={t.id} value={t.id}>{t.organizationName}</option>
            ))}
          </select>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="w-full bg-background pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Scanned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No assets found matching the current filtering bounds.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {asset.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {asset.lastScanned}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        asset.status === "Active"
                          ? "default"
                          : asset.status === "Inactive"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight, Search } from "lucide-react"

import { assets } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"

export default function AssetsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assets Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A comprehensive list of all discovered external and internal assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none">
            <option value="all">Global View (All Targets)</option>
            <option value="TGT-001">Acme Corp</option>
            <option value="TGT-002">Globex Logistics</option>
            <option value="TGT-003">Stark Industries</option>
          </select>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="w-full bg-background pl-8 h-9"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Asset ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Scanned</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium font-mono text-xs">{asset.id}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell className="text-muted-foreground">{asset.type}</TableCell>
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
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {asset.lastScanned}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/assets/${asset.id}`}>
                      <ArrowRight className="size-4" />
                      <span className="sr-only">View Details</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

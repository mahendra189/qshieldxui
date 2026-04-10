"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Map,
  Settings2,
  SquareTerminal,
  Network,
  Target
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "cyb",
    email: "cyb@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Network,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Targets",
      url: "/targets",
      icon: Target,
      isActive: true,
    },
    {
      title: "Topology",
      url: "/topology",
      icon: Network,
    },
    {
      title: "Assets",
      url: "/assets",
      icon: SquareTerminal,
    },
    {
      title: "Services",
      url: "/services",
      icon: Bot,
    },
    {
      title: "Ports",
      url: "/ports",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

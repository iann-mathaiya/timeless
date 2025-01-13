"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "./link";
import { useAtom } from "jotai";
import type { LucideIcon } from "lucide-react"
import { currentPathAtom } from "@/lib/store";

type NavMainProps = {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}

export function NavMain({ items}: NavMainProps) {
    const [currentPath] = useAtom(currentPathAtom);
  
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={currentPath === item.url}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

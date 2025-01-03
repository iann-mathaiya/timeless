import { Link as LinkIcon, ArrowUpRight, MoreHorizontal, StarOff, Trash2 } from "lucide-react"

import Link from "./link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import type { Post } from "@/db/schema";
import type { User } from "better-auth";
import { actions } from "astro:actions";

type NavTimelineProps = {
  userId: string,
}

export function NavTimeline({ userId }: NavTimelineProps) {
  const { isMobile } = useSidebar()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await actions.posts.getPosts({userId: userId})
      if(data?.success) return  setPosts(data.postData)
    }

    fetchPosts()
  }, [userId])

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Timeline</SidebarGroupLabel>
      <SidebarMenu>
        {posts.map((post) => (
          <SidebarMenuItem key={post.id}>
            <SidebarMenuButton asChild>
              {/* <Link href={item.url} title={item.name}>
               <span>{item.emoji}</span>
               <span>{item.name}</span>
              </Link> */}
              <p>{post.title}</p>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}

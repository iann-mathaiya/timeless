import { Link as LinkIcon, ArrowUpRight, MoreHorizontal, StarOff, Trash2, DotIcon } from "lucide-react";

import Link from "./link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import type { Post } from "@/db/schema";
import type { User } from "better-auth";
import { actions } from "astro:actions";
import { format } from "date-fns";

type NavTimelineProps = {
  userId: string,
};

type Timeline = { createdAt: string; posts: Post[]; };

export function NavTimeline({ userId }: NavTimelineProps) {
  const { isMobile } = useSidebar();
  const [timeline, setTimeline] = useState<Timeline[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await actions.posts.getPosts({ userId: userId });
      if (data?.success) {

        const newPosts = data.postData.reduce(
          (acc, post) => {
            const date = post.createdAt.split(" ")[0]; // Extract the date portion
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(post);
            return acc;
          },
          {} as Record<string, typeof data.postData>,
        );

        const timelineEntries = Object.entries(newPosts).map(([date, posts]) => ({
          createdAt: date,
          posts,
        }));

        return setTimeline(timelineEntries);
      }
    }

    fetchPosts();
  }, [userId]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Timeline</SidebarGroupLabel>
      <SidebarMenu>
        {timeline?.map((entry) => (
          <SidebarMenuItem key={entry.createdAt}>
            <SidebarMenuButton className="max-h-7 group flex items-center justify-between">
                <span className="text-xs text-gray-600 group-hover:text-gray-900">{format(entry.createdAt, 'ccc do MMM')}</span>
                <div className="flex items-center gap-x-0.5">
                  {entry.posts.map(dot =>
                    // <DotIcon key={dot.id} className="size-4" />
                    <span key={dot.id} className="text-lg font-semibold text-gray-600">&middot;</span>
                  )}
                </div>
            </SidebarMenuButton>
            {/* <DropdownMenu>
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
            </DropdownMenu> */}
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
  );
}

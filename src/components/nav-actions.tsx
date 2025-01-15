import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  Settings2,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "./link";
import SearchFriendInput from "./search-friend-input";
import { currentPathAtom, userIdAtom } from "@/lib/store";
import { useAtom } from "jotai";
import { actions } from "astro:actions";
import type { Friend } from "@/lib/types";

const data = [
  [
    {
      label: "Customize Page",
      icon: Settings2,
    },
    {
      label: "Turn into wiki",
      icon: FileText,
    },
  ],
  [
    {
      label: "Copy Link",
      icon: LinkIcon,
    },
    {
      label: "Duplicate",
      icon: Copy,
    },
    {
      label: "Move to",
      icon: CornerUpRight,
    },
    {
      label: "Move to Trash",
      icon: Trash2,
    },
  ],
  [
    {
      label: "Undo",
      icon: CornerUpLeft,
    },
    {
      label: "View analytics",
      icon: LineChart,
    },
    {
      label: "Version History",
      icon: GalleryVerticalEnd,
    },
    {
      label: "Show delete pages",
      icon: Trash,
    },
    {
      label: "Notifications",
      icon: Bell,
    },
  ],
  [
    {
      label: "Import",
      icon: ArrowUp,
    },
    {
      label: "Export",
      icon: ArrowDown,
    },
  ],
];


export function NavActions() {
  const [userId] = useAtom(userIdAtom);
  const [currentPath] = useAtom(currentPathAtom);

  const [isOpen, setIsOpen] = useState(true);
  const [pendingRequests, setPendingRequest] = useState<Friend[]>([]);

  useEffect(() => {
    async function fetchPendingRequests() {
      const { data, error } = await actions.friends.getFriendReqests({ userId: userId });

      if (data?.success) {
        setPendingRequest(data.pendingRequests);
      }
    }
    fetchPendingRequests();
    
  }, [userId]);
  
  console.log(pendingRequests)

  return (
    <div className="flex items-center gap-2 text-sm">
      <SearchFriendInput />

      {currentPath !== '/create-post' &&
        <Link href="/create-post" className="pl-2 pr-3 py-1 h-7 w-fit flex items-center gap-2 text-gray-900 bg-transparent hover:bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-gray-900 transition-all duration-300 ease-in-out">
          <Plus className="size-4" />
          <span>Add Post</span>
        </Link>
      }
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-2 w-72 sm:w-96 overflow-hidden rounded-lg"
          align="end"
        >
          <span className="text-sm text-gray-600">Friend Requests</span>

          <pre>{JSON.stringify(pendingRequests, null, 2)}</pre>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { useAtom } from "jotai";
import { Bell } from "lucide-react";
import { actions } from "astro:actions";
import { userIdAtom } from "@/lib/store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { PendingFriendRequest } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(true);
  const [userId] = useAtom(userIdAtom);

  const [pendingRequests, setPendingRequest] = useState<PendingFriendRequest[]>([]);

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
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 relative data-[state=open]:bg-accent overflow-visible"
                >
                    <Bell />
                    {pendingRequests.length > 0 &&
                        <div className="min-w-1.5 h-1.5 absolute top-0.5 right-0.5 bg-red-500 rounded-full" />
                    }
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
    );
}

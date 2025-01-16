import { useAtom } from "jotai";
import { Bell } from "lucide-react";
import { actions } from "astro:actions";
import { userIdAtom } from "@/lib/store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { PendingFriendRequest } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Notifications() {
    const [userId] = useAtom(userIdAtom);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  async function acceptFriendRequest(event: React.MouseEvent<HTMLButtonElement>, respondentId: string) {
    event.preventDefault();

    // action to accept friend request

}

  
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
                <span className="text-xs text-gray-600">Friend Requests</span>

                <ul className="mt-1 space-y-1">
                    {pendingRequests.map(pendingRequest => 
                        <li  key={pendingRequest.id} className="p-2 w-full group flex gap-2 bg-transparent rounded-md">
                        {pendingRequest.requester.image ?
                            <img src={pendingRequest.requester.image} alt={`${pendingRequest.requester.name} profile`} className="mt-0.5 size-5 sm:size-7 rounded-full" />
                            :
                            <div className="mt-0.5 py-4 pl-6 size-5 sm:size-7 rounded-full" />
                        }

                        <div className="w-full flex items-center justify-between">
                            <div className="pr-6 w-full h-full space-y-0 text-xs">
                                <h2 className="text-gray-900 font-medium">{pendingRequest.requester.name}</h2>
                                <p className="text-gray-600 text-pretty lowercase">{pendingRequest.requester.email}</p>
                            </div>

                                <Button
                                    variant='ghost' size='sm'
                                    disabled={isLoading}
                                    onClick={(event) => acceptFriendRequest(event, pendingRequest.requester.id)}
                                    className="h-7 w-fit text-gray-600 group-hover:text-orange-600 group-hover:bg-orange-200/30 border border-transparent hover:border-orange-600/50"
                                >
                                    {isLoading ? 'Processing...' : 'Accept'}
                                </Button>
                        </div>
                    </li>
                    )}
                </ul>

            </PopoverContent>
        </Popover>
    );
}

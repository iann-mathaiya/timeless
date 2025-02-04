import { useAtom } from "jotai";
import { actions } from "astro:actions";
import { userIdAtom } from "@/lib/store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, UserSearch } from "lucide-react";
import type { PendingFriendRequest } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RiNotification3Line } from "@remixicon/react";
import { Penguin } from "./icons";

export default function Notifications() {
    const [userId] = useAtom(userIdAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [pendingRequests, setPendingRequest] = useState<PendingFriendRequest[]>([]);

    useEffect(() => {
        // first check user id is not falsy so it doesn't 
        // hit the db twice while the user id atom has being set
        if (userId) {
            fetchPendingRequests(userId);
        }
    }, [userId]);

    async function fetchPendingRequests(id: string) {
        const { data, error } = await actions.friends.getFriendReqests({ userId: id });

        if (data?.success) {
            setPendingRequest(data.pendingRequests);
        }
    }

    async function acceptFriendRequest(event: React.MouseEvent<HTMLButtonElement>, requesterId: string) {
        event.preventDefault();
        setIsLoading(true);
        const { data, error } = await actions.friends.acceptFriendRequest({ respondentId: userId, requesterId: requesterId });

        if (data?.success) {
            fetchPendingRequests(userId);
            setIsLoading(false);
        }
    }


    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 relative data-[state=open]:bg-accent overflow-visible"
                >
                    <RiNotification3Line />
                    {pendingRequests.length > 0 &&
                        <div className="min-w-1.5 h-1.5 absolute top-0.5 right-0.5 bg-red-500 rounded-full" />
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-2 w-72 sm:w-96 overflow-hidden rounded-lg"
                align="end"
            >
                <span className="text-xs text-gray-600">{pendingRequests.length > 0 && 'Friend Requests'}</span>

                {pendingRequests.length === 0 &&
                    <div className="my-10 flex flex-col items-center justify-center">
                        <Penguin width={80} height={80} />
                        <h2 className="mt-4 text-gray-900 text-sm text-center font-medium">No Friend Requests</h2>
                        <p className="mt-0.5 text-xs text-gray-600 text-center text-balance">
                            Try searching for your friends instead or you can just chill with <span className="italic font-medium">Tux</span>
                        </p>
                    </div>
                }

                <ul className="mt-1 space-y-1">
                    {pendingRequests.map(pendingRequest =>
                        <li key={pendingRequest.id} className="p-2 w-full group flex gap-2 bg-transparent rounded-md">
                            {pendingRequest.requester.profilePicture ?
                                <img src={pendingRequest.requester.profilePicture} alt={`${pendingRequest.requester.name} profile`} className="mt-0.5 size-5 sm:size-7 rounded-full" />
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

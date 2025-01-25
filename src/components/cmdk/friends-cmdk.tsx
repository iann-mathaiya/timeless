import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { twMerge } from 'tailwind-merge';
import { actions } from 'astro:actions';
import type { MatchingUser } from '@/lib/types';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { userIdAtom } from '@/lib/store';
import { useAtom } from 'jotai';

type CommandPalette = {
    isOpen: boolean;
    onClose: () => void;
    searchedUser: string;
    users: MatchingUser[] | null | undefined;
};

export default function SearchFriednCmdK({ users, searchedUser, isOpen, onClose }: CommandPalette) {
    const [userId] = useAtom(userIdAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [relevantUsers, setRelevantUsers] = useState<MatchingUser[] | null | undefined>([]);

    const [searchValue, setSearchValue] = useState('');


    useEffect(() => {
        setSearchValue(searchedUser);
        setRelevantUsers(users)
    }, [searchedUser, users]);

    async function sendFriendRequest(event: React.MouseEvent<HTMLButtonElement>, requestedfriendId: string) {
        event.preventDefault();

        setIsLoading(true);

        const { data, error } = await actions.friends.sendFriendRequest({ userId: userId, requestedfriendId: requestedfriendId });

        if (data?.success) {
            const { data: newUsersData, error } = await actions.friends.searchUser({ userId: userId, keyword: searchValue.trim() });
            setRelevantUsers(newUsersData?.matchingUsers)
            setIsLoading(false);
        }

        console.log(data);
    }

    async function acceptFriendRequest(event: React.MouseEvent<HTMLButtonElement>, respondentId: string) {
        event.preventDefault();

        // action to accept friend request

    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput value={searchValue} onValueChange={setSearchValue} placeholder="Search user..." />
            <CommandList>
                <CommandEmpty>
                    <span className='text-gray-600'>No user named </span>
                    <span className='text-gray-900 font-medium'>{searchValue} </span>
                    <span className='text-gray-600'>found.</span>
                </CommandEmpty>
                <CommandGroup heading="Users found:">
                    {relevantUsers?.map(user =>
                        <CommandItem key={user.id} asChild className='group data-[selected=true]:bg--transparent hover:bg-transparent hover:cursor-pointer'>
                            <div className="pl-1 w-full flex gap-2 sm:gap-3 bg-transparent">
                                {user.profilePicture ?
                                    <img src={user.profilePicture} alt={`${user.name} profile`} className="mt-0.5 size-5 sm:size-7 rounded-full" />
                                    :
                                    <div className="mt-0.5 py-4 pl-6 size-5 sm:size-7 rounded-full" />
                                }

                                <div className="w-full flex items-center justify-between">
                                    <div className="pr-6 w-full h-full space-y-0 text-xs">
                                        <h2 className="text-gray-900 font-medium">{user.name}</h2>
                                        <p className="text-gray-600 text-pretty">{user.email}</p>
                                    </div>

                                    {(user.friendshipStatus !== 'accepted' && user.friendshipStatus !== 'pending') &&
                                        <Button
                                            variant='ghost' size='sm'
                                            disabled={isLoading}
                                            onClick={(event) => sendFriendRequest(event, user.id)}
                                            className="h-7 w-fit text-gray-600 group-hover:text-orange-600 group-hover:bg-orange-200/30 border border-transparent hover:border-orange-600/50"
                                        >
                                            {(user.friendshipStatus === 'rejected' || user.friendshipStatus === null) && 'Add friend'}
                                            {isLoading && 'Sending request'}
                                        </Button>
                                    }
                                    {
                                        user.friendshipStatus === 'pending' &&
                                        <Button
                                            variant='ghost' size='sm'
                                            onClick={(event) => acceptFriendRequest(event, user.id)}
                                            disabled={(user.isRequester as unknown as number) === 1}
                                            className={twMerge(
                                                "h-7 w-fit text-gray-600 group-hover:text-orange-600 group-hover:bg-orange-200/30 border border-transparent hover:border-orange-600/50",
                                                (user.isRequester as unknown as number) === 1 && 'group-hover:text-gray-900 group-hover:bg-gray-200'
                                            )}
                                        >
                                            {!user.isRequester ? 'Accept request' : 'Pending'}
                                        </Button>
                                    }
                                </div>
                            </div>
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
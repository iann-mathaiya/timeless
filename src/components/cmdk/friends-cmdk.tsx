import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { twMerge } from 'tailwind-merge';
import { actions } from 'astro:actions';
import type { MatchingUser } from '@/lib/types';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

type CommandPalette = {
    isOpen: boolean;
    userId: string;
    onClose: () => void;
    searchedUser: string;
    users: MatchingUser[] | null | undefined;
};

export default function SearchFriednCmdK({ users, userId, searchedUser, isOpen, onClose }: CommandPalette) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        setSearch(searchedUser)
    }, [searchedUser])

    async function handleAddFriend(event: React.MouseEvent<HTMLButtonElement>, friendId: string) {
        event.preventDefault();

        const { data, error } = await actions.friends.sendFriendRequest({ userId: userId, friendId: friendId });

        console.log(data);
        // onClose();
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Search user..." />
            <CommandList>
                <CommandEmpty>
                    <span className='text-gray-600'>No user named </span>
                    <span className='text-gray-900 font-medium'>{search} </span>
                    <span className='text-gray-600'>found.</span>
                </CommandEmpty>
                <CommandGroup heading="Users found:">
                    {users?.map(user =>
                        <CommandItem key={user.id} asChild className='group data-[selected=true]:bg--transparent hover:bg-transparent hover:cursor-pointer'>
                            <div className="pl-1 w-full flex gap-2 sm:gap-3 bg-transparent hover:bg-gray-100/85 hover:cursor-pointer">
                                {user.image ?
                                    <img src={user.image} alt={`${user.name} profile`} className="mt-0.5 size-5 sm:size-7 rounded-full" />
                                    :
                                    <div className="mt-0.5 py-4 pl-6 size-5 sm:size-7 rounded-full" />
                                }

                                <div className="w-full flex items-center justify-between">
                                    <div className="pr-6 w-full h-full space-y-0 text-xs">
                                        <h2 className="text-gray-900 font-medium">{user.name}</h2>
                                        <p className="text-gray-600 text-pretty">{user.email}</p>
                                    </div>

                                    {user.friendshipStatus !== 'accepted' &&
                                        <Button
                                            variant='ghost' size='sm'
                                            disabled={user.friendshipStatus === 'pending'}
                                            onClick={(event) => handleAddFriend(event, user.id)}
                                            className="h-7 w-fit text-gray-600 group-hover:text-orange-600 group-hover:bg-orange-200/30"
                                        >
                                            {user.friendshipStatus === 'pending' && 'Pending'}
                                            {(user.friendshipStatus === 'rejected' || user.friendshipStatus === null) && 'Add friend'}
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
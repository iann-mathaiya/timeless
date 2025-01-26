import { Drawer } from 'vaul';
import { useAtom } from 'jotai';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { actions } from 'astro:actions';
import { useRef, useState } from 'react';
import { userIdAtom } from '@/lib/store';
import { twMerge } from 'tailwind-merge';
import { SmilePlus, X } from 'lucide-react';
import type { MatchingUser } from '@/lib/types';
import { RiPokerHeartsFill, RiUserHeartLine } from '@remixicon/react';
import CopyLinkButton from '../copy-link-button';
import { UserNotFound } from '../icons';

export default function SearchFriendDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId] = useAtom(userIdAtom);

    const [showInput, setShowInput] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchingFriend, setIsSearchingFriend] = useState<boolean | undefined>(undefined);
    const [searchedUsers, setSearchedUsers] = useState<MatchingUser[] | null | undefined>([]);

    function handleBlur() {
        if (!searchValue) {
            setShowInput(false);
        }
    }

    function focusInput() {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    function clearInput() {
        setSearchValue('');
        focusInput();
        setSearchedUsers([]);
        setIsSearchingFriend(undefined);
    }

    async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            setIsSearchingFriend(true);
            const { data, error } = await actions.friends.searchUser({ userId: userId, keyword: searchValue.trim() });

            if (data?.success) {
                setSearchedUsers(data?.matchingUsers);
                setIsSearchingFriend(false);
                console.log(searchedUsers);
            }
        }
    };

    async function sendFriendRequest(event: React.MouseEvent<HTMLButtonElement>, requestedfriendId: string) {
        event.preventDefault();

        setIsLoading(true);

        const { data, error } = await actions.friends.sendFriendRequest({ userId: userId, requestedfriendId: requestedfriendId });

        if (data?.success) {
            const { data: newUsersData, error } = await actions.friends.searchUser({ userId: userId, keyword: searchValue.trim() });
            setSearchedUsers(newUsersData?.matchingUsers);
            setIsLoading(false);
        }

        console.log(data);
    }

    async function acceptFriendRequest(event: React.MouseEvent<HTMLButtonElement>, friendId: string) {
        event.preventDefault();
        setIsLoading(true)
        const { data, error } = await actions.friends.acceptFriendRequest({respondentId: userId, requesterId: friendId})

        if (data?.success) {
            const { data: newUsersData, error } = await actions.friends.searchUser({ userId: userId, keyword: searchValue.trim() });
            setSearchedUsers(newUsersData?.matchingUsers);
            setIsLoading(false);
        }
    }

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen} repositionInputs={false}>
            <Drawer.Trigger asChild className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900">
                <Button variant='ghost' size='sm' className='hover:bg-transparent text-sm text-gray-900 hover:text-orange-600 transition-all duration-300 ease-in-out'>
                    <RiUserHeartLine className="size-5" aria-hidden />
                    <span className='text-sm'>Search friend</span>
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="sm:ml-16 fixed inset-0 bg-black/40 z-40" />
                <Drawer.Content className="pt-2 mt- sm:ml-16 h-[84vh] sm:h-[96vh] bg-white space-y-4 fixed bottom-0 left-0 right-0 z-50 outline-none rounded-t-2xl sm:rounded-none sm:rounded-tl-2xl">
                    <Drawer.Handle />
                    <Drawer.Title className="sr-only">Create a new post</Drawer.Title>
                    <Drawer.Description className="sr-only">Alter the timeline</Drawer.Description>

                    <div className='relative h-8 w-full px-4'>
                        <Input
                            type="text"
                            ref={inputRef}
                            value={searchValue}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder="Search friend"
                            onChange={e => setSearchValue(e.target.value)}
                            className="peer ps-9 h-8 w-full border-none shadow-none" />

                        <div className="pointer-events-none absolute inset-y-0 start-0 left-4 sm:left-3 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <SmilePlus size={16} strokeWidth={2} aria-hidden="true" />
                        </div>

                        {searchValue &&
                            <button type='button' onClick={clearInput} className="ps-3 absolute inset-y-0 right-6 flex items-center justify-center text-muted-foreground/80 hover:text-gray-900 peer-disabled:opacity-50">
                                <X size={16} strokeWidth={2} aria-hidden="true" />
                            </button>
                        }
                    </div>

                    <div>
                        {searchedUsers?.length === 0 && searchValue && isSearchingFriend === false &&
                            <div className='mt-12 p-4 flex flex-col items-center justify-center gap-2'>
                                <UserNotFound width={80} height={80} />
                                <p className='text-sm text-gray-600 text-center text-balance'>
                                    <span>Your friend called {' '}</span>
                                    <span className='text-gray-900 font-medium'>{`${searchValue}`}</span>
                                     <span>{' '}isn't on pocket yet, share your pocket link with them</span>
                                </p>
                                <CopyLinkButton />
                            </div>
                        }

                        {searchedUsers?.map(user =>
                            <div key={user.id} className="p-4 w-full flex gap-2 sm:gap-3 bg-transparent group">
                                {user.profilePicture ?
                                    <img src={user.profilePicture} alt={`${user.name} profile`} className="mt-0.5 size-7 rounded-full" />
                                    :
                                    <div className="mt-0.5 py-4 pl-6 size-7 rounded-full" />
                                }

                                <div className="w-full flex items-center justify-between">
                                    <div className="pr-6 w-full h-full space-y-0 text-sm">
                                        <h2 className="text-gray-900 font-medium flex items-center gap-1">
                                            <span>{user.name}</span>
                                            {user.friendshipStatus === 'accepted' && 
                                                <RiPokerHeartsFill className='size-4 text-orange-600' aria-hidden />
                                            }
                                            </h2>
                                        <p className="text-gray-600 text-pretty">{user.email}</p>
                                    </div>

                                    {(user.friendshipStatus !== 'accepted' && user.friendshipStatus !== 'pending') &&
                                        <Button
                                            variant='ghost' size='sm'
                                            disabled={isLoading}
                                            onClick={(event) => sendFriendRequest(event, user.id)}
                                            className="h-7 w-fit text-gray-600 group-hover:text-orange-600 group-hover:bg-orange-100/60 border border-transparent group-hover:border-orange-600/50"
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
                        )}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
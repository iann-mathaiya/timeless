import { useState, type FormEvent } from 'react';
import type { User } from '@/db/schema';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Button } from '../ui/button';

type CommandPalette = {
    isOpen: boolean;
    onClose: () => void;
    searchedUser: string;
    users: User[] | null | undefined;
};

export default function SearchFriednCmdK({ users, searchedUser, isOpen, onClose }: CommandPalette) {
    const [search, setSearch] = useState(searchedUser);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        onClose();

    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput defaultValue={searchedUser} value={search} onValueChange={setSearch} placeholder="Search user..." />
            <CommandList>
                <CommandEmpty>
                    <span className='text-gray-600'>No user named </span>
                    <span className='text-gray-900 font-medium'>{search} </span>
                    <span className='text-gray-600'>found.</span>
                </CommandEmpty>
                <CommandGroup heading="Users found:">
                    {users?.map(user =>
                        <CommandItem key={user.id} asChild className='hover:cursor-pointer'>
                            <form onSubmit={handleSubmit}>
                                <div className="w-full flex gap-2 sm:gap-3 bg-transparent hover:bg-gray-100/85 hover:cursor-pointer">
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

                                        <Button variant='ghost' size='sm' className='h-7 w-fit hover:bg-gray-300/50'>
                                            Add as friend
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
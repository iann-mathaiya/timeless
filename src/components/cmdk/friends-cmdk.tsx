import type { FormEvent } from 'react';
import type { User } from '@/db/schema';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

type CommandPalette = {
    isOpen: boolean;
    onClose: () => void;
    users: User[] | null | undefined;
};

export default function SearchFriednCmdK({ users, isOpen, onClose }: CommandPalette) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        onClose();

    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder="Type a subject or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Users">
                    {users?.map(user =>
                        <CommandItem key={user.id} asChild className='hover:cursor-pointer'>
                            <form onSubmit={handleSubmit}>
                                <h2>{user.name}</h2>
                                <p>{user.email}</p>
                            </form>
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
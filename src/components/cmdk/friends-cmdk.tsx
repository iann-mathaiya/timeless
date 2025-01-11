import type { FormEvent } from 'react';
import type { User } from '@/db/schema';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

type CommandPalette = {
    users: User[];
    isOpen: boolean;
    onClose: () => void;
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
                    <CommandItem asChild className='hover:cursor-pointer'>
                        <form className='w-full'>

                        </form>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
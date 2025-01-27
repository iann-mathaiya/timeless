import { Drawer } from 'vaul';
import { useState } from 'react';
import CreatePostForm from '../create-post-form';
import { RiAddCircleFill, RiAddCircleLine } from '@remixicon/react';

export default function CreatePostDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen} repositionInputs={false}>
            <Drawer.Trigger className="size-9 sm:size-8 flex items-center justify-center">
                {isOpen ? <RiAddCircleFill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiAddCircleLine className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="sm:ml-16 fixed inset-0 bg-black/40 z-40" />
                <Drawer.Content className="pt-2 mt- sm:ml-16 h-[84vh] sm:h-[96vh] bg-white space-y-4 fixed bottom-0 left-0 right-0 z-50 outline-none rounded-t-2xl sm:rounded-none sm:rounded-tl-2xl">
                    <Drawer.Handle />
                    <Drawer.Title className="sr-only">Create a new post</Drawer.Title>
                    <Drawer.Description className="sr-only">Alter the timeline</Drawer.Description>

                    <CreatePostForm />
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

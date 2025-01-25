import Link from "./link";
import { Drawer } from "vaul";
import { useAtom } from "jotai";
import { useState } from "react";
import { currentPathAtom } from "@/lib/store";
import CreatePostForm from "./create-post-form";
import { RiAddCircleFill, RiAddCircleLine, RiGalleryFill, RiGalleryLine, RiHome6Fill, RiHome6Line, RiUser6Fill, RiUser6Line, RiUserSmileFill, RiUserSmileLine } from "@remixicon/react";

export default function Navigation() {
    const [currentPath] = useAtom(currentPathAtom);
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='w-full sm:w-16 h-16 sm:h-full fixed bottom-0 z-50 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-4 bg-gray-950'>
            <Link href="/home" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/home' && !isOpen) ? <RiHome6Fill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiHome6Line className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>

            <Link href="/friends" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/friends' && !isOpen) ? <RiUserSmileFill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiUserSmileLine className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>

            <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Trigger className="size-9 sm:size-8 flex items-center justify-center">
                    {isOpen ? <RiAddCircleFill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiAddCircleLine className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="sm:ml-16 fixed inset-0 bg-black/40 z-40" />
                    <Drawer.Content className="pt-2 sm:ml-16 h-fit min-h-[96vh] bg-white space-y-4 fixed bottom-0 left-0 right-0 z-50 outline-none rounded-t-2xl sm:rounded-none sm:rounded-tl-2xl">
                        <Drawer.Handle />
                        <Drawer.Title className="sr-only">Create a new post</Drawer.Title>
                        <Drawer.Description className="sr-only">Alter the timeline</Drawer.Description>

                        <CreatePostForm />
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            <Link href="/gallery" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/gallery' && !isOpen) ? <RiGalleryFill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiGalleryLine className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>

            <Link href="/profile" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/profile' && !isOpen) ? <RiUser6Fill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiUser6Line className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>
        </div>
    );
}

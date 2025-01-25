import Link from "./link";
import { useAtom } from "jotai";
import { twMerge } from "tailwind-merge";
import { RiAddCircleFill, RiAddCircleLine, RiHome6Fill, RiHome6Line, RiNotification3Fill, RiNotification3Line, RiUser6Fill, RiUser6Line, RiUserSmileFill, RiUserSmileLine } from "@remixicon/react";
import { currentPathAtom } from "@/lib/store";
// import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Drawer } from "vaul";
import CreatePostForm from "./create-post-form";
import { useState } from "react";

export default function Navigation() {
    const [currentPath] = useAtom(currentPathAtom);
    const [isOpen, setIsOpen] = useState(false)

    console.log(isOpen)

    return (
        <div className='w-full sm:w-16 h-16 sm:h-full fixed bottom-0 z-50 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-4 bg-gray-950'>
            <Link href="/home" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/home' && !isOpen) ? <RiHome6Fill className="fill-white size-7 sm:size-6" /> : <RiHome6Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/friends" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/friends' && !isOpen) ? <RiUserSmileFill className="fill-white size-7 sm:size-6" /> : <RiUserSmileLine className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Trigger className="size-9 sm:size-8 flex items-center justify-center">
                    {isOpen ? <RiAddCircleFill className="fill-white size-7 sm:size-6" /> : <RiAddCircleLine className="fill-gray-400 size-7 sm:size-6" />}
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                    <Drawer.Content className="pt-2 sm:ml-16 h-fit min-h-[96vh] bg-white space-y-4 fixed bottom-0 left-0 right-0 z-50 outline-none rounded-t-2xl sm:rounded-none sm:rounded-tl-2xl">
                        <Drawer.Handle />
                        <CreatePostForm />
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            <Link href="/notifications" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/notifications' && !isOpen) ? <RiNotification3Fill className="fill-white size-7 sm:size-6" /> : <RiNotification3Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/profile" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/profile' && !isOpen) ? <RiUser6Fill className="fill-white size-7 sm:size-6" /> : <RiUser6Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>
        </div>
    );
}

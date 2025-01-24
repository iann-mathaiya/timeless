import Link from "./link";
import { useAtom } from "jotai";
import { twMerge } from "tailwind-merge";
import { RiAddCircleLine, RiHome6Line, RiNotification3Line, RiUser6Line, RiUserSmileLine } from "@remixicon/react";
import { currentPathAtom } from "@/lib/store";

export default function NobileNavigation() {
        const [currentPath] = useAtom(currentPathAtom);
    

    return (
        <div className='w-full sm:w-16 h-16 sm:h-full fixed bottom-0 z-50 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-4 bg-gray-950'>
            <Link href="/home" className="size-9 sm:size-8 flex items-center justify-center">
                <RiHome6Line className={twMerge("fill-gray-400 size-7 sm:size-6", currentPath === '/home' && 'fill-white')} />
            </Link>

            <Link href="/friends" className="size-9 sm:size-8 flex items-center justify-center">
                <RiUserSmileLine className={twMerge("fill-gray-400 size-7 sm:size-6", currentPath === '/friends' && 'fill-white')} />
            </Link>

            <Link href="/create-post" className="size-9 sm:size-8 flex items-center justify-center">
                <RiAddCircleLine className={twMerge("fill-gray-400 size-7 sm:size-6", currentPath === '/create-post' && 'fill-white')} />
            </Link>

            <Link href="/notifications" className="size-9 sm:size-8 flex items-center justify-center">
                <RiNotification3Line className={twMerge("fill-gray-400 size-7 sm:size-6", currentPath === '/notifications' && 'fill-white')} />
            </Link>

            <Link href="/profile" className="size-9 sm:size-8 flex items-center justify-center">
                <RiUser6Line className={twMerge("fill-gray-400 size-7 sm:size-6", currentPath === '/profile' && 'fill-white')} />
            </Link>
        </div>
    );
}

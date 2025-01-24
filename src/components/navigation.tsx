import Link from "./link";
import { useAtom } from "jotai";
import { twMerge } from "tailwind-merge";
import { RiAddCircleFill, RiAddCircleLine, RiHome6Fill, RiHome6Line, RiNotification3Fill, RiNotification3Line, RiUser6Fill, RiUser6Line, RiUserSmileFill, RiUserSmileLine } from "@remixicon/react";
import { currentPathAtom } from "@/lib/store";

export default function Navigation() {
        const [currentPath] = useAtom(currentPathAtom);
    

    return (
        <div className='w-full sm:w-16 h-16 sm:h-full fixed bottom-0 z-50 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-4 bg-gray-950'>
            <Link href="/home" className="size-9 sm:size-8 flex items-center justify-center">
                {currentPath === '/home' ? <RiHome6Fill className="fill-white size-7 sm:size-6" /> : <RiHome6Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/friends" className="size-9 sm:size-8 flex items-center justify-center">
                {currentPath === '/friends' ? <RiUserSmileFill className="fill-white size-7 sm:size-6" /> : <RiUserSmileLine className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/create-post" className="size-9 sm:size-8 flex items-center justify-center">
                {currentPath === '/create-post' ? <RiAddCircleFill className="fill-white size-7 sm:size-6" /> : <RiAddCircleLine className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/notifications" className="size-9 sm:size-8 flex items-center justify-center">
                {currentPath === '/notifications' ? <RiNotification3Fill className="fill-white size-7 sm:size-6" /> : <RiNotification3Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>

            <Link href="/profile" className="size-9 sm:size-8 flex items-center justify-center">
                {currentPath === '/profile' ? <RiUser6Fill className="fill-white size-7 sm:size-6" /> : <RiUser6Line className="fill-gray-400 size-7 sm:size-6" />}
            </Link>
        </div>
    );
}

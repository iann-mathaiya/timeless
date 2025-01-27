import Link from "./link";
import { useAtom } from "jotai";
import { currentPathAtom } from "@/lib/store";
import CreatePostDrawer from "./drawers/create-post-drawer";
import { RiGalleryFill, RiGalleryLine, RiHome6Fill, RiHome6Line, RiUser6Fill, RiUser6Line, RiUserSmileFill, RiUserSmileLine } from "@remixicon/react";

export default function Navigation() {
    const [currentPath] = useAtom(currentPathAtom);

    return (
        <div className='w-full sm:w-16 h-16 sm:h-full fixed bottom-0 z-50 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-4 bg-gray-950'>
            <Link href="/home" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/home') ? <RiHome6Fill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiHome6Line className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>

            <Link href="/friends" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/friends') ? <RiUserSmileFill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiUserSmileLine className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>

            <CreatePostDrawer />

            <Link href="/gallery" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/gallery') ? <RiGalleryFill className="fill-white size-6 sm:size-5" aria-hidden /> : <RiGalleryLine className="fill-gray-400 size-6 sm:size-5" aria-hidden />}
            </Link>

            <Link href="/profile" className="size-9 sm:size-8 flex items-center justify-center">
                {(currentPath === '/profile') ? <RiUser6Fill className="fill-white size-7 sm:size-6" aria-hidden /> : <RiUser6Line className="fill-gray-400 size-7 sm:size-6" aria-hidden />}
            </Link>
        </div>
    );
}

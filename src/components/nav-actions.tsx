import Link from "./link";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import Notifications from "./notifications";
import { currentPathAtom } from "@/lib/store";
import SearchFriendInput from "./search-friend-input";

export function NavActions() {
  const [currentPath] = useAtom(currentPathAtom);

  return (
    <div className="flex items-center gap-2 text-sm">
      <SearchFriendInput />

      {currentPath !== '/create-post' &&
        <Link href="/create-post" className="pl-2 pr-3 py-1 h-7 w-fit flex items-center gap-2 text-gray-900 bg-transparent hover:bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-gray-900 transition-all duration-300 ease-in-out">
          <Plus className="size-4" />
          <span>Add Post</span>
        </Link>
      }

      <Notifications />

    </div>
  );
}

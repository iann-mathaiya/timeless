import { navigate } from "astro:transitions/client";
import { ChevronDown, CircleHelp, LightbulbIcon, LogOutIcon, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "./link";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";

export function Profile() {
  const [user] = useAtom(userAtom);

  if(!user) {
    return 
  }

  return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
              <div className="flex aspect-square size-5 sm:size-6 items-center justify-center rounded-md bg-transparent overflow-hidden">
                {
                  user.profilePicture ?
                    <img className="size-5 sm:size-6" src={user.profilePicture} alt={`${user.name} profile`} />
                    :
                    <div className="size-5 sm:size-6 bg-gradient-to-br from-[#08203e] to-[#557c93]" />
                }
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 mr-2 rounded-lg space-y-1"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem
              asChild
              className="gap-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <Link href="/profile">
                <User className="size-4 shrink-0" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => console.log(name)}
              className="gap-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <Settings className="size-4 shrink-0" />
              <span>Settings</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => console.log(name)} disabled
              className="gap-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <CircleHelp className="size-4 shrink-0" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log(name)} disabled
              className="gap-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <LightbulbIcon className="size-4 shrink-0" />
              <span>Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 rounded-md text-gray-600 hover:text-gray-900">
                <Link href="/api/auth/logout" className="flex gap-2">
              <LogOutIcon className="size-4 rotate-180" />
              <span>Sign Out</span>
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  );
}

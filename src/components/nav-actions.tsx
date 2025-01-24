import Notifications from "./notifications";
import SearchFriendInput from "./search-friend-input";
import { Profile } from "./profile";

export function NavActions() {

  return (
    <div className="flex items-center gap-2 text-sm">
      <SearchFriendInput />

      <Notifications />

      <Profile />

    </div>
  );
}

import Notifications from "./notifications";
import { Profile } from "./profile";
import SearchFriendDrawer from "./drawers/search-friend-drawer";

export function NavActions() {

  return (
    <div className="flex items-center gap-2 text-sm">
      <SearchFriendDrawer />

      <Notifications />

      <Profile />

    </div>
  );
}

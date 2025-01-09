import type { User } from "@/db/schema";
import { NavMain } from "@/components/nav-main";
import { Profile } from "@/components/profile";
import { NavSecondary } from "./nav-secondary";
import { NavTimeline } from "@/components/nav-timeline";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { HomeIcon, ImagesIcon, ShieldCheckIcon, UserRoundPlusIcon, UsersIcon } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Friends",
      url: "/friends",
      icon: UserRoundPlusIcon,
    },
    {
      title: "Gallery",
      url: "/gallery",
      icon: ImagesIcon,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Users",
      url: "#",
      icon: UsersIcon,
      isAdminOnly: true,
    },
    {
      title: "Permissions",
      url: "#",
      icon: ShieldCheckIcon,
      isAdminOnly: true,
    },
  ],
  timeline: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
  ],
  collections: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
  currentPath: string
};

export function AppSidebar({ user, currentPath, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <Profile name={user.name} imageSrc={user.image} />
        <NavMain items={data.navMain} currentPath={currentPath} />
      </SidebarHeader>
      <SidebarContent>
        <NavTimeline userId={user.id} />
        {/* <NavCollections collections={data.collections} /> */}
        <NavSecondary user={user} items={data.navSecondary} currentPath={currentPath} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

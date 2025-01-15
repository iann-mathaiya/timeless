import { useAtom } from "jotai";
import { Profile } from "@/components/profile";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "@/components/nav-main";
import { NavTimeline } from "@/components/nav-timeline";
import { currentPathAtom, userAtom } from "@/lib/store";
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

export function AppSidebar() {

  return (
    <Sidebar className="border-r-0" >
      <SidebarHeader>
        <Profile />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavTimeline userId={user.id} /> */}
        {/* <NavCollections collections={data.collections} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

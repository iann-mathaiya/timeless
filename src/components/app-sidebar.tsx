import type { User } from "better-auth";
import { NavMain } from "@/components/nav-main";
import { Profile } from "@/components/profile";
import { NavSecondary } from "./nav-secondary";
import { NavTimeline } from "@/components/nav-timeline";
import { NavCollections } from "@/components/nav-collections";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { AudioWaveform, CalendarClock, CircleHelp, Command, Home, Images, LightbulbIcon, Search, Zap } from "lucide-react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Timeline",
      url: "/timeline",
      icon: CalendarClock,
    },
    {
      title: "Gallery",
      url: "/gallery",
      icon: Images,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: CircleHelp,
      isAdminOnly: false,
    },
    {
      title: "Feedback",
      url: "#",
      icon: LightbulbIcon,
      isAdminOnly: false,
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
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <Profile name={user.name} imageSrc={user.image} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavTimeline timeline={data.timeline} />
        {/* <NavCollections collections={data.collections} /> */}
        <NavSecondary user={user} items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

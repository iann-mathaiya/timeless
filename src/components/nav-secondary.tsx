import type React from "react";
import type { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAtom } from "jotai";
import { userAtom, currentPathAtom } from "@/lib/store";

type NavSecondaryProps = React.ComponentPropsWithoutRef<typeof SidebarGroup> & {
} & {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isAdminOnly: boolean;
    badge?: React.ReactNode;
  }[];
};

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
    const [user] = useAtom(userAtom);
    const [currentPath] = useAtom(currentPathAtom);

  const userLinks = items.filter(item => item.isAdminOnly === false)
  const links = user && user.role === 'admin' ? items : userLinks

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={currentPath === item.url}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
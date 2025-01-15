import { AppSidebar } from "@/components/app-sidebar"
import { NavActions } from "@/components/nav-actions"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import type { User } from "@/db/schema";
import { currentPathAtom, userAtom, userIdAtom } from "@/lib/store";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

type SidebarProps = {
    user: User
    pageTitle: string
    currentPath: string
    children: React.ReactNode
}

export function Sidebar({ user, currentPath, pageTitle, children }: SidebarProps) {
    const setUser = useSetAtom(userAtom);
    const setUserId = useSetAtom(userIdAtom);
    const setCurrentPath = useSetAtom(currentPathAtom);

    useEffect(() => {
        setUser(user);
        setUserId(user.id)
        setCurrentPath(currentPath);
    }, [user, currentPath, setUser, setUserId, setCurrentPath]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1 capitalize transition-all duration-300 ease-in-out">
                                        {pageTitle}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <NavActions />
                    </div>
                </header>

                <section>
                    {children}
                </section>
            </SidebarInset>
        </SidebarProvider>
    )
}
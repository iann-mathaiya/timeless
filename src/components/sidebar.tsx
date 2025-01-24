import { Toaster } from "sonner";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import type { User } from "@/db/schema";
import { NavActions } from "@/components/nav-actions";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentPathAtom, userAtom, userIdAtom } from "@/lib/store";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import MobileNavigation from "./mobile-navigation";

type SidebarProps = {
    user: User;
    pageTitle: string;
    currentPath: string;
    children: React.ReactNode;
};

export function Sidebar({ user, currentPath, pageTitle, children }: SidebarProps) {
    const setUser = useSetAtom(userAtom);
    const setUserId = useSetAtom(userIdAtom);
    const setCurrentPath = useSetAtom(currentPathAtom);

    useEffect(() => {
        setUser(user);
        setUserId(user.id);
        setCurrentPath(currentPath);
    }, [user, currentPath, setUser, setUserId, setCurrentPath]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-screen flex flex-col">
                <header className="flex h-14 shrink-0 items-center gap-2 bg-white">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Toaster richColors />
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

                <section className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto pb-16 bg-white rounded-b-xl">
                        {children}
                    </div>
                </section>

                <div className="min-w-[17px] h-[17px] fixed z-20 bottom-16 sm:bottom-auto sm:top-0 left-0 sm:left-16 bg-white rounded-bl-full sm:rounded-none sm:rounded-tl-full" />
                <div className="min-w-4 h-4 fixed z-10 bottom-16 sm:bottom-auto sm:top-0 left-0 sm:left-16 bg-gray-950" />

                <div className="min-w-[17px] h-[17px] fixed z-20 bottom-16 sm:bottom-0 right-0 sm:right-auto sm:left-16 bg-white rounded-br-full sm:rounded-none sm:rounded-bl-full" />
                <div className="min-w-4 h-4 fixed z-10 bottom-16 sm:bottom-0 right-0 sm:right-auto sm:left-16 bg-gray-950" />

                <MobileNavigation />
            </SidebarInset>
        </SidebarProvider>
    );
}
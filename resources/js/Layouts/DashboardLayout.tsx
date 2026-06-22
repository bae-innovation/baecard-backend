import { Link, usePage } from '@inertiajs/react';
import * as React from 'react';

import { AppHead } from '@/components/shared/app-head';
import { AppSettingsSync } from '@/components/shared/app-settings-sync';
import { AppSidebar } from '@/components/shared/sidebar/app-sidebar';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

function DashboardBreadcrumb() {
    const { url } = usePage();
    const breadcrumbItems = React.useMemo(
        () => url.split('?')[0].split('/').filter(Boolean),
        [url],
    );

    return (
        <Breadcrumb className="min-w-0">
            <BreadcrumbList>
                {breadcrumbItems.length === 0 ? (
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                ) : (
                    breadcrumbItems.map((item, index) => (
                        <React.Fragment key={`${item}-${index}`}>
                            <BreadcrumbItem>
                                {index === breadcrumbItems.length - 1 ? (
                                    <BreadcrumbPage className="capitalize">
                                        {item.replace(/-/g, ' ')}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={`/${breadcrumbItems.slice(0, index + 1).join('/')}`}
                                            className="capitalize"
                                        >
                                            {item.replace(/-/g, ' ')}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbItems.length - 1 ? (
                                <BreadcrumbSeparator className="hidden md:block" />
                            ) : null}
                        </React.Fragment>
                    ))
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHead />
            <AppSettingsSync />
            <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1 size-9" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <DashboardBreadcrumb />
                    <div className="ml-auto flex items-center gap-1">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
        </>
    );
}

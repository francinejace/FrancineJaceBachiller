import { Link } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    ExternalLink,
    Folder,
    Image,
    Inbox,
    LayoutGrid,
    Settings,
    Star,
    Trophy,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/admin/content/projects',
        icon: Folder,
    },
    {
        title: 'Skills',
        href: '/admin/content/skills',
        icon: Star,
    },
    {
        title: 'Experience',
        href: '/admin/content/experiences',
        icon: Briefcase,
    },
    {
        title: 'Leadership',
        href: '/admin/content/leaderships',
        icon: Users,
    },
    {
        title: 'Awards',
        href: '/admin/content/awards',
        icon: Trophy,
    },
    {
        title: 'Certifications',
        href: '/admin/content/certifications',
        icon: Award,
    },
    {
        title: 'Gallery',
        href: '/admin/content/gallery',
        icon: Image,
    },
    {
        title: 'Messages',
        href: '/admin/messages',
        icon: Inbox,
    },
    {
        title: 'Settings',
        href: '/admin/content/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Public Portfolio',
        href: '/',
        icon: ExternalLink,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

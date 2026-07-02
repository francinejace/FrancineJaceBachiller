import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Briefcase,
    CircleAlert,
    CircleCheck,
    ExternalLink,
    Folder,
    Image,
    Inbox,
    Layers,
    Mail,
    MessageSquare,
    Settings,
    Star,
    Trophy,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

type DashboardStat = {
    label: string;
    value: number | string;
};

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    source: string | null;
    read_at: string | null;
    created_at: string;
};

type ProjectImage = {
    id: number;
    path: string;
    alt: string;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    status: string;
    featured: boolean;
    published_at: string | null;
    created_at: string;
    images?: ProjectImage[];
};

type ContentModule = {
    name: string;
    resource: string;
    count: number;
};

type DashboardProps = {
    stats: DashboardStat[];
    recentMessages: ContactMessage[];
    recentProjects: Project[];
    modules: ContentModule[];
};

const statIcons: Record<string, LucideIcon> = {
    Awards: Trophy,
    Certifications: Award,
    Messages: Mail,
    Projects: Folder,
    Skills: Star,
    Unread: CircleAlert,
};

const moduleIcons: Record<string, LucideIcon> = {
    awards: Trophy,
    certifications: Award,
    experiences: Briefcase,
    gallery: Image,
    leaderships: Users,
    projects: Folder,
    settings: Settings,
    skills: Star,
    'social-links': ExternalLink,
};

function formatDate(value: string | null | undefined) {
    if (!value) {
        return 'Draft';
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function preview(value: string, length = 92) {
    if (value.length <= length) {
        return value;
    }

    return `${value.slice(0, length).trim()}...`;
}

export default function Dashboard({
    stats = [],
    recentMessages = [],
    recentProjects = [],
    modules = [],
}: DashboardProps) {
    const unreadCount =
        stats.find((stat) => stat.label.toLowerCase() === 'unread')?.value ?? 0;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Portfolio admin
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-normal">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/messages">
                                <Inbox />
                                Inbox
                                {Number(unreadCount) > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-1"
                                    >
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/">
                                View portfolio
                                <ExternalLink />
                            </Link>
                        </Button>
                    </div>
                </div>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    {stats.map((stat) => {
                        const Icon = statIcons[stat.label] ?? Layers;

                        return (
                            <Card
                                key={stat.label}
                                className="gap-3 rounded-lg py-4 shadow-none"
                            >
                                <CardContent className="flex items-center justify-between gap-4 px-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-semibold">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                        <Icon className="size-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                    <Card className="rounded-lg shadow-none">
                        <CardHeader className="flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle>Recent messages</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Latest contact form submissions
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/messages">
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-border">
                                {recentMessages.length > 0 ? (
                                    recentMessages.map((message) => (
                                        <article
                                            key={message.id}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                                {message.read_at ? (
                                                    <CircleCheck className="size-4" />
                                                ) : (
                                                    <MessageSquare className="size-4" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="truncate text-sm font-semibold">
                                                        {message.subject ??
                                                            'Portfolio inquiry'}
                                                    </h2>
                                                    {!message.read_at && (
                                                        <Badge variant="outline">
                                                            Unread
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                                    {message.name} ·{' '}
                                                    {message.email}
                                                </p>
                                                <p className="mt-2 text-sm leading-6">
                                                    {preview(message.message)}
                                                </p>
                                            </div>
                                            <time className="hidden shrink-0 text-sm text-muted-foreground md:block">
                                                {formatDate(
                                                    message.created_at,
                                                )}
                                            </time>
                                        </article>
                                    ))
                                ) : (
                                    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                        No messages yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg shadow-none">
                        <CardHeader>
                            <CardTitle>Content modules</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Portfolio records by section
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                                {modules.map((module) => {
                                    const Icon =
                                        moduleIcons[module.resource] ?? Layers;

                                    return (
                                        <Link
                                            key={module.resource}
                                            href={`/admin/content/${module.resource}`}
                                            className="flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <Icon className="size-4 shrink-0" />
                                                <span className="truncate font-medium">
                                                    {module.name}
                                                </span>
                                            </span>
                                            <Badge variant="secondary">
                                                {module.count}
                                            </Badge>
                                        </Link>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-lg shadow-none">
                    <CardHeader className="flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Recent projects</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Latest portfolio work
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/content/projects">
                                Manage projects
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 lg:grid-cols-5">
                            {recentProjects.length > 0 ? (
                                recentProjects.map((project) => {
                                    const image = project.images?.[0];

                                    return (
                                        <article
                                            key={project.id}
                                            className="overflow-hidden rounded-lg border"
                                        >
                                            <div className="aspect-video bg-secondary">
                                                {image ? (
                                                    <img
                                                        src={image.path}
                                                        alt={image.alt}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-muted-foreground">
                                                        <Image className="size-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3 p-3">
                                                <div className="space-y-1">
                                                    <h2 className="line-clamp-2 text-sm font-semibold">
                                                        {project.title}
                                                    </h2>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {project.summary}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">
                                                        {project.status}
                                                    </Badge>
                                                    {project.featured && (
                                                        <Badge variant="secondary">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {formatDate(
                                                            project.published_at ??
                                                                project.created_at,
                                                        )}
                                                    </span>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                                                    >
                                                        Open
                                                        <ExternalLink className="size-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="col-span-full flex min-h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                    No projects yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

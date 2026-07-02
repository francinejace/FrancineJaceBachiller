import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Briefcase,
    ExternalLink,
    Folder,
    Image,
    Layers,
    Settings,
    Star,
    Trophy,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

type ContentRecord = {
    id: number;
    [key: string]: unknown;
};

type ContentModule = {
    name: string;
    resource: string;
    count: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedRecords = {
    data: ContentRecord[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    to: number | null;
    total: number;
};

type Column = {
    key: string;
    label: string;
    render?: (record: ContentRecord) => ReactNode;
};

type ContentPageProps = {
    resource: string;
    resourceLabel: string;
    records: PaginatedRecords;
    modules: ContentModule[];
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
};

const columnsByResource: Record<string, Column[]> = {
    awards: [
        { key: 'title', label: 'Award', render: renderTitle },
        { key: 'issuer', label: 'Issuer' },
        { key: 'year', label: 'Year' },
        { key: 'featured', label: 'Featured', render: renderBoolean },
    ],
    certifications: [
        { key: 'title', label: 'Certification', render: renderTitle },
        { key: 'issuer', label: 'Issuer' },
        { key: 'status', label: 'Status', render: renderStatus },
        { key: 'issued_at', label: 'Issued', render: renderDate },
    ],
    experiences: [
        { key: 'title', label: 'Experience', render: renderTitle },
        { key: 'organization', label: 'Organization' },
        { key: 'period', label: 'Period' },
        { key: 'featured', label: 'Featured', render: renderBoolean },
    ],
    gallery: [
        { key: 'title', label: 'Item', render: renderTitle },
        { key: 'category', label: 'Category' },
        { key: 'media_type', label: 'Media' },
        { key: 'featured', label: 'Featured', render: renderBoolean },
    ],
    leaderships: [
        { key: 'title', label: 'Leadership', render: renderTitle },
        { key: 'organization', label: 'Organization' },
        { key: 'period', label: 'Period' },
        { key: 'featured', label: 'Featured', render: renderBoolean },
    ],
    projects: [
        { key: 'title', label: 'Project', render: renderTitle },
        { key: 'status', label: 'Status', render: renderStatus },
        { key: 'featured', label: 'Featured', render: renderBoolean },
        { key: 'published_at', label: 'Published', render: renderDate },
    ],
    settings: [
        { key: 'setting_key', label: 'Setting', render: renderTitle },
        { key: 'setting_group', label: 'Group' },
        { key: 'type', label: 'Type' },
        { key: 'is_public', label: 'Public', render: renderBoolean },
    ],
    'skill-categories': [
        { key: 'name', label: 'Category', render: renderTitle },
        { key: 'slug', label: 'Slug' },
        { key: 'sort_order', label: 'Order' },
    ],
    skills: [
        { key: 'name', label: 'Skill', render: renderTitle },
        { key: 'proficiency', label: 'Proficiency', render: renderPercent },
        { key: 'featured', label: 'Featured', render: renderBoolean },
        { key: 'sort_order', label: 'Order' },
    ],
    'social-links': [
        { key: 'platform', label: 'Platform', render: renderTitle },
        { key: 'url', label: 'URL', render: renderUrl },
        { key: 'featured', label: 'Featured', render: renderBoolean },
        { key: 'sort_order', label: 'Order' },
    ],
};

function stringValue(record: ContentRecord, key: string) {
    const value = record[key];

    return typeof value === 'string' ? value : null;
}

function recordTitle(record: ContentRecord) {
    return (
        stringValue(record, 'title') ??
        stringValue(record, 'name') ??
        stringValue(record, 'platform') ??
        stringValue(record, 'setting_key') ??
        `Record #${record.id}`
    );
}

function recordSubtitle(record: ContentRecord) {
    return (
        stringValue(record, 'summary') ??
        stringValue(record, 'description') ??
        stringValue(record, 'slug') ??
        stringValue(record, 'organization')
    );
}

function formatDate(value: unknown) {
    if (typeof value !== 'string' || value.length === 0) {
        return 'None';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

function renderText(value: unknown) {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">None</span>;
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (Array.isArray(value)) {
        return value.join(', ');
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function renderTitle(record: ContentRecord) {
    const subtitle = recordSubtitle(record);

    return (
        <div className="min-w-52">
            <p className="font-medium">{recordTitle(record)}</p>
            {subtitle && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

function renderBoolean(record: ContentRecord) {
    const value = Boolean(record.featured ?? record.is_public);

    return (
        <Badge variant={value ? 'secondary' : 'outline'}>
            {value ? 'Yes' : 'No'}
        </Badge>
    );
}

function renderDate(record: ContentRecord) {
    return formatDate(record.published_at ?? record.issued_at ?? record.created_at);
}

function renderPercent(record: ContentRecord) {
    const value = Number(record.proficiency ?? 0);

    return (
        <div className="flex min-w-32 items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                />
            </div>
            <span className="w-10 text-right text-sm text-muted-foreground">
                {value}%
            </span>
        </div>
    );
}

function renderStatus(record: ContentRecord) {
    return <Badge variant="outline">{renderText(record.status)}</Badge>;
}

function renderUrl(record: ContentRecord) {
    const url = stringValue(record, 'url');

    if (!url) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-64 items-center gap-1 truncate font-medium hover:underline"
        >
            <span className="truncate">{url}</span>
            <ExternalLink className="size-3 shrink-0" />
        </a>
    );
}

function columnsFor(resource: string): Column[] {
    return (
        columnsByResource[resource] ?? [
            { key: 'title', label: 'Record', render: renderTitle },
            { key: 'created_at', label: 'Created', render: renderDate },
            { key: 'updated_at', label: 'Updated', render: renderDate },
        ]
    );
}

function pageLabel(label: string) {
    return label.replace('&laquo;', '').replace('&raquo;', '').trim();
}

function publicPathFor(resource: string, record?: ContentRecord) {
    if (resource === 'projects' && record) {
        const slug = stringValue(record, 'slug');

        return slug ? `/projects/${slug}` : '/projects';
    }

    return (
        {
            awards: '/awards',
            certifications: '/certifications',
            experiences: '/experience',
            leaderships: '/experience',
            projects: '/projects',
            skills: '/skills',
        }[resource] ?? null
    );
}

export default function ContentPage({
    resource,
    resourceLabel,
    records,
    modules,
}: ContentPageProps) {
    const columns = columnsFor(resource);
    const ModuleIcon = moduleIcons[resource] ?? Layers;
    const sectionPath = publicPathFor(resource);

    return (
        <>
            <Head title={resourceLabel} />

            <div className="flex flex-1 flex-col gap-6 overflow-x-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={dashboard()}>
                                <ArrowLeft />
                                Dashboard
                            </Link>
                        </Button>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <ModuleIcon className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-semibold tracking-normal">
                                    {resourceLabel}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {records.total} records
                                </p>
                            </div>
                        </div>
                    </div>

                    {sectionPath && (
                        <Button variant="outline" asChild>
                            <Link href={sectionPath}>
                                View public section
                                <ExternalLink />
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {modules.map((module) => {
                        const Icon = moduleIcons[module.resource] ?? Layers;

                        return (
                            <Link
                                key={module.resource}
                                href={`/admin/content/${module.resource}`}
                                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors ${
                                    module.resource === resource
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                            >
                                <Icon className="size-4" />
                                {module.name}
                                <Badge variant="secondary">
                                    {module.count}
                                </Badge>
                            </Link>
                        );
                    })}
                </div>

                <Card className="rounded-lg shadow-none">
                    <CardHeader className="flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>{resourceLabel}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Showing {records.from ?? 0}-{records.to ?? 0} of{' '}
                                {records.total}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {records.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="border-y bg-muted/40 text-muted-foreground">
                                        <tr>
                                            {columns.map((column) => (
                                                <th
                                                    key={column.key}
                                                    className="px-6 py-3 font-medium"
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-right font-medium">
                                                Open
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {records.data.map((record) => {
                                            const recordPath = publicPathFor(
                                                resource,
                                                record,
                                            );

                                            return (
                                                <tr key={record.id}>
                                                    {columns.map((column) => (
                                                        <td
                                                            key={column.key}
                                                            className="max-w-80 px-6 py-4 align-top"
                                                        >
                                                            {column.render
                                                                ? column.render(
                                                                      record,
                                                                  )
                                                                : renderText(
                                                                      record[
                                                                          column
                                                                              .key
                                                                      ],
                                                                  )}
                                                        </td>
                                                    ))}
                                                    <td className="px-6 py-4 text-right align-top">
                                                        {recordPath ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        recordPath
                                                                    }
                                                                >
                                                                    <ArrowRight />
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                None
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex min-h-64 items-center justify-center border-t text-sm text-muted-foreground">
                                No records yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {records.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {records.links.map((link) =>
                            link.url ? (
                                <Button
                                    key={`${link.label}-${link.url}`}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={link.url}>
                                        {pageLabel(link.label)}
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    key={link.label}
                                    variant="outline"
                                    size="sm"
                                    disabled
                                >
                                    {pageLabel(link.label)}
                                </Button>
                            ),
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

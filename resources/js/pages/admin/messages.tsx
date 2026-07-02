import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Inbox,
    Mail,
    MailOpen,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedMessages = {
    data: ContactMessage[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    to: number | null;
    total: number;
};

type MessagesPageProps = {
    messages: PaginatedMessages;
    unreadCount: number;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function pageLabel(label: string) {
    return label.replace('&laquo;', '').replace('&raquo;', '').trim();
}

function markRead(message: ContactMessage) {
    router.post(
        `/admin/messages/${message.id}/read`,
        {},
        {
            preserveScroll: true,
        },
    );
}

function deleteMessage(message: ContactMessage) {
    router.delete(`/admin/messages/${message.id}`, {
        preserveScroll: true,
    });
}

export default function MessagesPage({
    messages,
    unreadCount,
}: MessagesPageProps) {
    return (
        <>
            <Head title="Messages" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-hidden p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={dashboard()}>
                                <ArrowLeft />
                                Dashboard
                            </Link>
                        </Button>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                <Inbox className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-normal">
                                    Messages
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {messages.total} total, {unreadCount} unread
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="rounded-lg shadow-none">
                    <CardHeader className="flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Inbox</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Showing {messages.from ?? 0}-{messages.to ?? 0}{' '}
                                of {messages.total}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Badge variant="secondary">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {messages.data.length > 0 ? (
                            <div className="divide-y border-t">
                                {messages.data.map((message) => (
                                    <article
                                        key={message.id}
                                        className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto]"
                                    >
                                        <div className="flex min-w-0 gap-4">
                                            <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                                {message.read_at ? (
                                                    <MailOpen className="size-5" />
                                                ) : (
                                                    <Mail className="size-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-base font-semibold">
                                                        {message.subject ??
                                                            'Portfolio inquiry'}
                                                    </h2>
                                                    {!message.read_at && (
                                                        <Badge variant="outline">
                                                            Unread
                                                        </Badge>
                                                    )}
                                                    {message.source && (
                                                        <Badge variant="secondary">
                                                            {message.source}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {message.name} -{' '}
                                                    <a
                                                        href={`mailto:${message.email}`}
                                                        className="font-medium text-foreground hover:underline"
                                                    >
                                                        {message.email}
                                                    </a>
                                                </p>
                                                <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-6">
                                                    {message.message}
                                                </p>
                                                <time className="mt-3 block text-xs text-muted-foreground">
                                                    {formatDate(
                                                        message.created_at,
                                                    )}
                                                </time>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 lg:justify-end">
                                            {!message.read_at && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        markRead(message)
                                                    }
                                                >
                                                    <Check />
                                                    Mark read
                                                </Button>
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    deleteMessage(message)
                                                }
                                            >
                                                <Trash2 />
                                                Delete
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-64 items-center justify-center border-t text-sm text-muted-foreground">
                                No messages yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {messages.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {messages.links.map((link) =>
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

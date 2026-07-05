import { Form, Head, Link, usePage } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BadgeCheck,
    BriefcaseBusiness,
    Code2,
    Download,
    ExternalLink,
    Facebook,
    Github,
    GraduationCap,
    Instagram,
    LayoutDashboard,
    Linkedin,
    LogIn,
    Mail,
    MapPin,
    Medal,
    Send,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
    about,
    contact as contactRoute,
    dashboard,
    experience as experienceRoute,
    home,
    login,
    projects as projectsRoute,
    skills as skillsRoute,
} from '@/routes';
import { store as storeContact } from '@/routes/contact';

type LinkHref = NonNullable<InertiaLinkProps['href']>;

type PageName =
    | 'home'
    | 'about'
    | 'skills'
    | 'experience'
    | 'projects'
    | 'certifications'
    | 'awards'
    | 'resume'
    | 'contact'
    | string;

type Hero = {
    eyebrow?: string;
    name?: string;
    title?: string;
    subtitle?: string;
    summary?: string;
    badges?: string[];
    image?: string;
};

type Profile = {
    image?: string;
    bio?: string;
    objective?: string;
    summary?: string;
};

type Education = {
    school?: string;
    program?: string;
    period?: string;
};

type Stat = {
    label: string;
    value: number | string;
};

type ProjectImage = {
    path?: string | null;
    alt?: string | null;
};

type Project = {
    id?: number;
    title: string;
    slug?: string;
    summary?: string;
    description?: string | null;
    role?: string | null;
    problem?: string | null;
    solution?: string | null;
    architecture?: string | null;
    challenges?: string[] | null;
    lessons_learned?: string[] | null;
    tech_stack?: string[] | null;
    github_url?: string | null;
    live_url?: string | null;
    case_study_url?: string | null;
    status?: string | null;
    featured?: boolean;
    images?: ProjectImage[];
};

type Skill = {
    id?: number;
    name: string;
    proficiency?: number | null;
    featured?: boolean;
};

type SkillCategory = {
    id?: number;
    name: string;
    description?: string | null;
    skills?: Skill[];
};

type RoleItem = {
    id?: number;
    title: string;
    organization?: string | null;
    period?: string | null;
    summary?: string | null;
    highlights?: string[] | null;
    type?: string | null;
};

type AwardItem = {
    id?: number;
    title: string;
    issuer?: string | null;
    year?: string | null;
    description?: string | null;
};

type Certification = {
    id?: number;
    title: string;
    issuer?: string | null;
    status?: string | null;
    credential_url?: string | null;
};

type SocialLink = {
    id?: number;
    platform: string;
    url: string;
};

type GalleryItem = {
    id?: number;
    title: string;
    category?: string | null;
    media_type?: string | null;
    path?: string | null;
    external_url?: string | null;
    description?: string | null;
};

type ContactInfo = {
    email?: string;
    location?: string;
};

type ResumeInfo = {
    download_url?: string | null;
    preview_url?: string | null;
};

type FlashMessages = {
    success?: string | null;
    error?: string | null;
};

type SharedProps = {
    auth?: {
        user?: {
            name?: string;
        } | null;
    };
    flash?: FlashMessages;
};

type PortfolioProps = {
    page: PageName;
    hero: Hero;
    profile: Profile;
    education: Education[];
    stats: Stat[];
    featuredTechnologies: string[];
    projects: Project[];
    featuredProjects: Project[];
    skillCategories: SkillCategory[];
    featuredSkills: Skill[];
    experiences: RoleItem[];
    leaderships: RoleItem[];
    awards: AwardItem[];
    certifications: Certification[];
    socialLinks: SocialLink[];
    gallery: GalleryItem[];
    contact: ContactInfo;
    resume: ResumeInfo;
};

type NavItem = {
    label: string;
    page: string;
    href: LinkHref;
};

const fallbackImage = '/images/portfolio-workspace.png';

const pageTitles: Record<string, string> = {
    home: 'Portfolio',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    awards: 'Awards',
    resume: 'Resume',
    contact: 'Contact',
};

const navItems: NavItem[] = [
    { label: 'Home', page: 'home', href: home() },
    { label: 'About', page: 'about', href: about() },
    { label: 'Skills', page: 'skills', href: skillsRoute() },
    { label: 'Experience', page: 'experience', href: experienceRoute() },
    { label: 'Projects', page: 'projects', href: projectsRoute() },
    { label: 'Contact', page: 'contact', href: contactRoute() },
];

function asStringArray(value: string[] | null | undefined): string[] {
    return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

function firstProjectImage(project: Project): ProjectImage {
    return project.images?.[0] ?? {};
}

function SocialIcon({ platform }: { platform: string }) {
    const lowerPlatform = platform.toLowerCase();
    let Icon: LucideIcon = ExternalLink;

    if (lowerPlatform.includes('github')) {
        Icon = Github;
    } else if (lowerPlatform.includes('linkedin')) {
        Icon = Linkedin;
    } else if (lowerPlatform.includes('facebook')) {
        Icon = Facebook;
    } else if (lowerPlatform.includes('instagram')) {
        Icon = Instagram;
    } else if (
        lowerPlatform.includes('mail') ||
        lowerPlatform.includes('email')
    ) {
        Icon = Mail;
    }

    return <Icon className="size-4" aria-hidden="true" />;
}

function SectionHeading({
    eyebrow,
    title,
    summary,
    inverse = false,
}: {
    eyebrow: string;
    title: string;
    summary?: string;
    inverse?: boolean;
}) {
    return (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            <p
                className={cn(
                    'text-sm font-semibold tracking-normal uppercase',
                    inverse ? 'text-emerald-300' : 'text-emerald-700',
                )}
            >
                {eyebrow}
            </p>
            <h2
                className={cn(
                    'mt-3 text-3xl font-semibold sm:text-4xl',
                    inverse ? 'text-white' : 'text-zinc-950',
                )}
            >
                {title}
            </h2>
            {summary && (
                <p
                    className={cn(
                        'mt-4 text-base leading-7',
                        inverse ? 'text-zinc-300' : 'text-zinc-600',
                    )}
                >
                    {summary}
                </p>
            )}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500">
            {label}
        </div>
    );
}

export default function Portfolio({
    page,
    hero,
    profile,
    education,
    stats,
    featuredTechnologies,
    projects,
    featuredProjects,
    skillCategories,
    featuredSkills,
    experiences,
    leaderships,
    awards,
    certifications,
    socialLinks,
    gallery,
    contact,
    resume,
}: PortfolioProps) {
    const shared = usePage().props as SharedProps;
    const name = hero.name ?? 'Francine Jace Bachiller';
    const activeTitle = pageTitles[page] ?? 'Portfolio';
    const pageTitle = page === 'home' ? name : `${activeTitle} | ${name}`;
    const heroImage = hero.image ?? profile.image ?? fallbackImage;
    const heroBadges = asStringArray(hero.badges);
    const featured =
        featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);
    const contactEmail = contact.email ?? 'hello@francine.dev';
    const contactLocation = contact.location ?? 'Marikina City';
    const isLoggedIn = Boolean(shared.auth?.user);
    const flash = shared.flash;

    return (
        <>
            <Head title={pageTitle} />

            <div className="min-h-screen bg-zinc-50 text-zinc-950">
                <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
                    <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <Link
                            href={home()}
                            className="flex min-w-0 items-center gap-3"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-sm font-semibold text-white">
                                {getInitials(name)}
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">
                                    {name}
                                </span>
                                <span className="block truncate text-xs text-zinc-500">
                                    {hero.title ?? 'Full-Stack Developer'}
                                </span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-1 lg:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    className={cn(
                                        'rounded-md px-3 py-2 text-sm font-medium transition',
                                        page === item.page
                                            ? 'bg-emerald-50 text-emerald-800'
                                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {isLoggedIn ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        <LayoutDashboard className="size-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="sm" variant="outline">
                                    <Link href={login()}>
                                        <LogIn className="size-4" />
                                        Admin
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </nav>

                    <div className="border-t border-zinc-100 px-4 py-2 lg:hidden">
                        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    className={cn(
                                        'rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap',
                                        page === item.page
                                            ? 'bg-emerald-50 text-emerald-800'
                                            : 'text-zinc-600',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
                        <img
                            src={heroImage}
                            alt=""
                            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
                        />
                        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,11,0.92),rgba(9,9,11,0.72),rgba(9,9,11,0.34))]" />
                        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
                            <div className="max-w-4xl">
                                <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-emerald-200 ring-1 ring-white/15">
                                    <Sparkles className="size-4" />
                                    {hero.eyebrow ?? "Hi, I'm"}
                                </p>
                                <h1 className="mt-6 max-w-5xl text-5xl leading-tight font-semibold sm:text-6xl lg:text-7xl">
                                    {name}
                                </h1>
                                <p className="mt-5 max-w-3xl text-2xl font-medium text-white/90 sm:text-3xl">
                                    {hero.title ?? 'Full-Stack Developer'}
                                </p>
                                <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-200 sm:text-lg">
                                    {hero.summary ??
                                        profile.summary ??
                                        'Building useful Laravel and React experiences with clean interfaces, practical systems, and steady delivery.'}
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {heroBadges.map((badge) => (
                                        <Badge
                                            key={badge}
                                            className="border-white/15 bg-white/10 px-3 py-1 text-white"
                                            variant="outline"
                                        >
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="mt-10 flex flex-wrap gap-3">
                                    <Button asChild size="lg">
                                        <Link href={projectsRoute()}>
                                            View Projects
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-zinc-950"
                                    >
                                        <Link href={contactRoute()}>
                                            Contact
                                            <Mail className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white py-16 sm:py-20">
                        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
                            <div>
                                <p className="text-sm font-semibold tracking-normal text-emerald-700 uppercase">
                                    About
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                    {hero.subtitle ??
                                        'Web and mobile application student'}
                                </h2>
                                <div className="mt-6 space-y-5 text-base leading-8 text-zinc-600">
                                    <p>{profile.bio}</p>
                                    <p>{profile.objective}</p>
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {education.map((item, index) => (
                                        <div
                                            key={`${item.school}-${index}`}
                                            className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
                                        >
                                            <GraduationCap className="mb-4 size-5 text-emerald-700" />
                                            <h3 className="font-semibold">
                                                {item.school}
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                                {item.program}
                                            </p>
                                            <p className="mt-3 text-xs font-medium tracking-normal text-zinc-500 uppercase">
                                                {item.period}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
                                    >
                                        <p className="text-3xl font-semibold text-zinc-950">
                                            {stat.value}
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-zinc-950 py-16 text-white sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Skills"
                                title="Tools and strengths"
                                summary="A practical stack for full-stack web work, UI implementation, data modeling, and team delivery."
                                inverse
                            />

                            <div className="mb-10 flex flex-wrap justify-center gap-3">
                                {(featuredTechnologies.length > 0
                                    ? featuredTechnologies
                                    : featuredSkills.map((skill) => skill.name)
                                ).map((technology) => (
                                    <span
                                        key={technology}
                                        className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-zinc-100"
                                    >
                                        {technology}
                                    </span>
                                ))}
                            </div>

                            {skillCategories.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {skillCategories.map((category) => (
                                        <div
                                            key={category.id ?? category.name}
                                            className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-200">
                                                    <Code2 className="size-5" />
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {category.name}
                                                    </h3>
                                                    {category.description && (
                                                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                                                            {
                                                                category.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-5 space-y-4">
                                                {(category.skills ?? []).map(
                                                    (skill) => (
                                                        <div
                                                            key={
                                                                skill.id ??
                                                                skill.name
                                                            }
                                                        >
                                                            <div className="flex items-center justify-between gap-3 text-sm">
                                                                <span>
                                                                    {skill.name}
                                                                </span>
                                                                <span className="text-zinc-400">
                                                                    {skill.proficiency ??
                                                                        75}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                                                <div
                                                                    className="h-full rounded-full bg-emerald-400"
                                                                    style={{
                                                                        width: `${skill.proficiency ?? 75}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState label="Skills will appear after seeding the database." />
                            )}
                        </div>
                    </section>

                    <section className="bg-white py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Projects"
                                title="Selected software and creative work"
                                summary="Project cards pull from the database and can be managed from the admin dashboard."
                            />

                            {featured.length > 0 ? (
                                <div className="grid gap-6 lg:grid-cols-3">
                                    {featured.map((project) => {
                                        const image =
                                            firstProjectImage(project);
                                        const techStack = asStringArray(
                                            project.tech_stack,
                                        );

                                        return (
                                            <article
                                                key={
                                                    project.id ?? project.title
                                                }
                                                className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                                            >
                                                <img
                                                    src={
                                                        image.path ??
                                                        fallbackImage
                                                    }
                                                    alt={
                                                        image.alt ??
                                                        `${project.title} preview`
                                                    }
                                                    className="aspect-[16/10] w-full object-cover"
                                                />
                                                <div className="p-5">
                                                    <div className="mb-4 flex items-center justify-between gap-3">
                                                        <Badge variant="secondary">
                                                            {project.status ??
                                                                'In progress'}
                                                        </Badge>
                                                        {project.role && (
                                                            <span className="text-xs font-medium text-zinc-500">
                                                                {project.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-semibold">
                                                        {project.title}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                                                        {project.summary ??
                                                            project.description}
                                                    </p>
                                                    <div className="mt-5 flex flex-wrap gap-2">
                                                        {techStack
                                                            .slice(0, 5)
                                                            .map((tech) => (
                                                                <span
                                                                    key={tech}
                                                                    className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                    </div>
                                                    <div className="mt-5 flex gap-2">
                                                        {project.github_url && (
                                                            <Button
                                                                asChild
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <a
                                                                    href={
                                                                        project.github_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <Github className="size-4" />
                                                                    Code
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {project.live_url && (
                                                            <Button
                                                                asChild
                                                                size="sm"
                                                            >
                                                                <a
                                                                    href={
                                                                        project.live_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <ExternalLink className="size-4" />
                                                                    Live
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState label="Projects will appear after seeding the database." />
                            )}
                        </div>
                    </section>

                    <section className="bg-zinc-100 py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Experience"
                                title="Work, leadership, and execution"
                                summary="A combined view of professional experience and student leadership roles."
                            />

                            <div className="grid gap-6 lg:grid-cols-2">
                                <RoleList
                                    icon={BriefcaseBusiness}
                                    title="Experience"
                                    items={experiences}
                                />
                                <RoleList
                                    icon={Medal}
                                    title="Leadership"
                                    items={leaderships}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Credentials"
                                title="Certifications and awards"
                                summary="Recognitions, completed credentials, and planned learning milestones."
                            />

                            <div className="grid gap-6 lg:grid-cols-2">
                                <CredentialPanel
                                    icon={BadgeCheck}
                                    title="Certifications"
                                    items={certifications}
                                />
                                <AwardPanel items={awards} />
                            </div>
                        </div>
                    </section>

                    <section className="bg-zinc-950 py-16 text-white sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Gallery"
                                title="Publication and creative archive"
                                summary="Visual work from organizations, campaigns, posters, branding, and videos."
                                inverse
                            />

                            {gallery.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {gallery.map((item) => (
                                        <article
                                            key={item.id ?? item.title}
                                            className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"
                                        >
                                            <img
                                                src={item.path ?? fallbackImage}
                                                alt={item.title}
                                                className="aspect-[4/3] w-full object-cover"
                                            />
                                            <div className="p-5">
                                                <div className="mb-3 flex flex-wrap gap-2">
                                                    {item.category && (
                                                        <Badge
                                                            className="border-white/15 bg-white/10 text-white"
                                                            variant="outline"
                                                        >
                                                            {item.category}
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        className="border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                                                        variant="outline"
                                                    >
                                                        {item.media_type ??
                                                            'image'}
                                                    </Badge>
                                                </div>
                                                <h3 className="font-semibold">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState label="Gallery items will appear after seeding the database." />
                            )}
                        </div>
                    </section>

                    <section className="bg-white py-16 sm:py-20">
                        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                            <div>
                                <p className="text-sm font-semibold tracking-normal text-emerald-700 uppercase">
                                    Contact
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                    Let's build something useful.
                                </h2>
                                <p className="mt-4 text-base leading-8 text-zinc-600">
                                    Send a message from the portfolio and it
                                    will be stored in the admin dashboard.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="flex items-center gap-3 text-sm font-medium text-zinc-700 hover:text-emerald-700"
                                    >
                                        <Mail className="size-5 text-emerald-700" />
                                        {contactEmail}
                                    </a>
                                    <p className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                                        <MapPin className="size-5 text-emerald-700" />
                                        {contactLocation}
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {socialLinks.map((link) => (
                                        <Button
                                            key={link.id ?? link.platform}
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <SocialIcon
                                                    platform={link.platform}
                                                />
                                                {link.platform}
                                            </a>
                                        </Button>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    {resume.download_url ? (
                                        <Button asChild>
                                            <a
                                                href={resume.download_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Download className="size-4" />
                                                Download Resume
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="secondary">
                                            <Download className="size-4" />
                                            Resume Pending
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
                                {flash?.success && (
                                    <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                                        {flash.success}
                                    </div>
                                )}

                                {flash?.error && (
                                    <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {flash.error}
                                    </div>
                                )}

                                <Form
                                    {...storeContact.form()}
                                    resetOnSuccess={[
                                        'name',
                                        'email',
                                        'subject',
                                        'message',
                                    ]}
                                    className="grid gap-5"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your name"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="subject">
                                                    Subject
                                                </Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder="Project, internship, or collaboration"
                                                />
                                                <InputError
                                                    message={errors.subject}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="message">
                                                    Message
                                                </Label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    required
                                                    minLength={10}
                                                    rows={6}
                                                    placeholder="Tell me what you want to build."
                                                    className="min-h-36 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                />
                                                <InputError
                                                    message={errors.message}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <Spinner />
                                                ) : (
                                                    <Send className="size-4" />
                                                )}
                                                Send Message
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

function RoleList({
    icon: Icon,
    title,
    items,
}: {
    icon: LucideIcon;
    title: string;
    items: RoleItem[];
}) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" />
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>

            {items.length > 0 ? (
                <div className="space-y-5">
                    {items.map((item) => (
                        <article
                            key={
                                item.id ?? `${item.title}-${item.organization}`
                            }
                            className="border-l-2 border-emerald-200 pl-4"
                        >
                            <p className="text-sm font-medium text-emerald-700">
                                {item.period ?? item.type ?? 'Current'}
                            </p>
                            <h4 className="mt-1 font-semibold">{item.title}</h4>
                            {item.organization && (
                                <p className="mt-1 text-sm text-zinc-500">
                                    {item.organization}
                                </p>
                            )}
                            {item.summary && (
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    {item.summary}
                                </p>
                            )}
                            {asStringArray(item.highlights).length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {asStringArray(item.highlights)
                                        .slice(0, 3)
                                        .map((highlight) => (
                                            <span
                                                key={highlight}
                                                className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <EmptyState
                    label={`${title} items will appear after seeding the database.`}
                />
            )}
        </div>
    );
}

function CredentialPanel({
    icon: Icon,
    title,
    items,
}: {
    icon: LucideIcon;
    title: string;
    items: Certification[];
}) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                    <Icon className="size-5" />
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>

            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((item) => (
                        <article
                            key={item.id ?? item.title}
                            className="rounded-lg border border-zinc-200 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="font-semibold">
                                        {item.title}
                                    </h4>
                                    {item.issuer && (
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {item.issuer}
                                        </p>
                                    )}
                                </div>
                                <Badge variant="secondary">
                                    {item.status ?? 'Completed'}
                                </Badge>
                            </div>
                            {item.credential_url && (
                                <a
                                    href={item.credential_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700"
                                >
                                    Verify
                                    <ExternalLink className="size-4" />
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <EmptyState
                    label={`${title} will appear after seeding the database.`}
                />
            )}
        </div>
    );
}

function AwardPanel({ items }: { items: AwardItem[] }) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                    <Award className="size-5" />
                </span>
                <h3 className="text-xl font-semibold">Awards</h3>
            </div>

            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((item) => (
                        <article
                            key={item.id ?? item.title}
                            className="rounded-lg border border-zinc-200 p-4"
                        >
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="mt-1 text-sm text-zinc-500">
                                {[item.issuer, item.year]
                                    .filter(Boolean)
                                    .join(' | ')}
                            </p>
                            {item.description && (
                                <p className="mt-3 text-sm leading-6 text-zinc-600">
                                    {item.description}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <EmptyState label="Awards will appear after seeding the database." />
            )}
        </div>
    );
}

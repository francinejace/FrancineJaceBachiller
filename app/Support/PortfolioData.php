<?php

namespace App\Support;

use App\Models\Award;
use App\Models\Certification;
use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\GalleryItem;
use App\Models\Leadership;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\SocialLink;

class PortfolioData
{
    /**
     * Shared public payload used by Inertia pages and API endpoints.
     *
     * @return array<string, mixed>
     */
    public function publicPayload(string $page = 'home'): array
    {
        $settings = $this->settings();
        $projects = Project::with('images')->ordered()->get();
        $skillCategories = SkillCategory::with('skills')->ordered()->get();

        return [
            'page' => $page,
            'hero' => $settings['hero'] ?? $this->defaultHero(),
            'profile' => $settings['profile'] ?? $this->defaultProfile(),
            'education' => $settings['education'] ?? $this->defaultEducation(),
            'stats' => $settings['stats'] ?? $this->stats(),
            'featuredTechnologies' => $settings['featured_technologies'] ?? $this->featuredTechnologies(),
            'projects' => $projects,
            'featuredProjects' => $projects->where('featured', true)->values(),
            'skillCategories' => $skillCategories,
            'featuredSkills' => Skill::featured()->ordered()->limit(12)->get(),
            'experiences' => Experience::ordered()->get(),
            'leaderships' => Leadership::ordered()->get(),
            'awards' => Award::ordered()->get(),
            'certifications' => Certification::ordered()->get(),
            'socialLinks' => SocialLink::ordered()->get(),
            'gallery' => GalleryItem::ordered()->get(),
            'contact' => $settings['contact'] ?? $this->defaultContact(),
            'resume' => $settings['resume'] ?? $this->defaultResume(),
            'settings' => $settings,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function dashboardPayload(): array
    {
        return [
            'stats' => [
                ['label' => 'Projects', 'value' => Project::count()],
                ['label' => 'Messages', 'value' => ContactMessage::count()],
                ['label' => 'Unread', 'value' => ContactMessage::unread()->count()],
                ['label' => 'Skills', 'value' => Skill::count()],
                ['label' => 'Certifications', 'value' => Certification::count()],
                ['label' => 'Awards', 'value' => Award::count()],
            ],
            'recentMessages' => ContactMessage::latest()->limit(6)->get(),
            'recentProjects' => Project::with('images')->latest()->limit(5)->get(),
            'modules' => [
                ['name' => 'Projects', 'resource' => 'projects', 'count' => Project::count()],
                ['name' => 'Skills', 'resource' => 'skills', 'count' => Skill::count()],
                ['name' => 'Experience', 'resource' => 'experiences', 'count' => Experience::count()],
                ['name' => 'Leadership', 'resource' => 'leaderships', 'count' => Leadership::count()],
                ['name' => 'Awards', 'resource' => 'awards', 'count' => Award::count()],
                ['name' => 'Certifications', 'resource' => 'certifications', 'count' => Certification::count()],
                ['name' => 'Gallery', 'resource' => 'gallery', 'count' => GalleryItem::count()],
                ['name' => 'Social Links', 'resource' => 'social-links', 'count' => SocialLink::count()],
                ['name' => 'Settings', 'resource' => 'settings', 'count' => Setting::count()],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function settings(): array
    {
        return Setting::public()
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (Setting $setting): array => [
                $setting->setting_key => $setting->setting_value,
            ])
            ->all();
    }

    /**
     * @return array<int, array{label: string, value: int|string}>
     */
    private function stats(): array
    {
        return [
            ['label' => 'Projects', 'value' => Project::count()],
            ['label' => 'Leadership Roles', 'value' => Leadership::count()],
            ['label' => 'Certifications', 'value' => Certification::count()],
            ['label' => 'Awards', 'value' => Award::count()],
            ['label' => 'Years of Experience', 'value' => max(1, (int) now()->year - 2023)],
        ];
    }

    /**
     * @return array<int, string>
     */
    private function featuredTechnologies(): array
    {
        return Skill::featured()->ordered()->pluck('name')->take(10)->values()->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultHero(): array
    {
        return [
            'eyebrow' => "Hi, I'm",
            'name' => 'Francine Jace Bachiller',
            'title' => 'Full-Stack Developer',
            'subtitle' => 'BS Information Technology, specializing in Web and Mobile Application',
            'summary' => 'A software engineer in training who blends Laravel, React, interface design, and student leadership into production-minded web experiences.',
            'badges' => ['Full-Stack Developer', 'Student Leader', 'Eagle Scout', 'UI Designer'],
            'image' => '/images/portfolio-workspace.png',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultProfile(): array
    {
        return [
            'image' => '/images/portfolio-workspace.png',
            'bio' => 'Francine Jace Bachiller is an Information Technology student focused on full-stack web development, clean interfaces, and practical systems that help teams move faster.',
            'objective' => 'To contribute to software engineering teams through thoughtful UI, reliable Laravel and React implementation, and a disciplined approach to learning production systems.',
            'summary' => 'Full-stack developer, UI-conscious builder, and student leader with experience across project delivery, academic organizations, publication design, and scout leadership.',
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function defaultEducation(): array
    {
        return [
            [
                'school' => 'FEU Institute of Technology',
                'program' => 'BS Information Technology, Web and Mobile Application',
                'period' => 'Expected Graduation 2027',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    private function defaultContact(): array
    {
        return [
            'email' => 'hello@francine.dev',
            'location' => 'Marikina City',
        ];
    }

    /**
     * @return array<string, string|null>
     */
    private function defaultResume(): array
    {
        return [
            'download_url' => null,
            'preview_url' => null,
        ];
    }
}

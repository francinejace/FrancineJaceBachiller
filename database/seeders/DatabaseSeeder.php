<?php

namespace Database\Seeders;

use App\Models\Award;
use App\Models\Certification;
use App\Models\Experience;
use App\Models\GalleryItem;
use App\Models\Leadership;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\SocialLink;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('PORTFOLIO_ADMIN_EMAIL', 'admin@francine.dev')],
            [
                'name' => 'Francine Jace Bachiller',
                'password' => Hash::make(env('PORTFOLIO_ADMIN_PASSWORD', 'password')),
                'email_verified_at' => now(),
                'is_admin' => true,
            ],
        );

        $this->seedSettings();
        $this->seedSkills();
        $this->seedProjects();
        $this->seedExperience();
        $this->seedLeadership();
        $this->seedCredentials();
        $this->seedSocialLinks();
        $this->seedGallery();
    }

    private function seedSettings(): void
    {
        $settings = [
            'hero' => [
                'eyebrow' => "Hi, I'm",
                'name' => 'Francine Jace Bachiller',
                'title' => 'Full-Stack Developer',
                'subtitle' => 'BS Information Technology, specialization in Web and Mobile Application',
                'summary' => 'Software engineer in training, UI-conscious full-stack developer, student leader, and Eagle Scout building clean, useful systems with Laravel and React.',
                'badges' => ['Full-Stack Developer', 'Student Leader', 'Eagle Scout', 'UI Designer'],
                'image' => '/images/portfolio-workspace.png',
            ],
            'profile' => [
                'image' => '/images/portfolio-workspace.png',
                'bio' => 'Francine Jace Bachiller is an Information Technology student focused on full-stack web development, clean interfaces, and practical systems that support real users.',
                'objective' => 'To contribute to software engineering teams through thoughtful UI, reliable Laravel and React implementation, and a disciplined approach to learning production systems.',
                'summary' => 'Full-stack developer, UI designer, and student leader with experience across project delivery, publication work, academic organizations, and scout leadership.',
            ],
            'education' => [
                [
                    'school' => 'FEU Institute of Technology',
                    'program' => 'BS Information Technology, Web and Mobile Application',
                    'period' => 'Expected Graduation 2027',
                ],
                [
                    'school' => 'Previous Schools',
                    'program' => 'Academic and leadership foundation',
                    'period' => 'Before FEU Tech',
                ],
            ],
            'stats' => [
                ['label' => 'Projects', 'value' => 4],
                ['label' => 'Leadership Roles', 'value' => 6],
                ['label' => 'Certifications', 'value' => 3],
                ['label' => 'Awards', 'value' => 4],
                ['label' => 'Years of Experience', 'value' => 2],
            ],
            'featured_technologies' => ['React', 'Laravel', 'PHP', 'Java', 'Python', 'MySQL', 'AWS', 'Git', 'GitHub', 'Figma'],
            'contact' => [
                'email' => 'hello@francine.dev',
                'location' => 'Marikina City',
            ],
            'resume' => [
                'download_url' => null,
                'preview_url' => null,
            ],
        ];

        foreach ($settings as $key => $value) {
            Setting::query()->updateOrCreate(
                ['setting_key' => $key],
                [
                    'setting_value' => $value,
                    'setting_group' => 'portfolio',
                    'type' => 'json',
                    'is_public' => true,
                    'sort_order' => array_search($key, array_keys($settings), true),
                ],
            );
        }
    }

    private function seedSkills(): void
    {
        $categories = [
            ['name' => 'Programming', 'slug' => 'programming', 'description' => 'Core languages used for application logic and problem solving.'],
            ['name' => 'Frontend', 'slug' => 'frontend', 'description' => 'Modern interface development and responsive UI implementation.'],
            ['name' => 'Backend', 'slug' => 'backend', 'description' => 'APIs, authentication, persistence, and server-side application design.'],
            ['name' => 'Database', 'slug' => 'database', 'description' => 'Relational storage, schema design, and data modeling.'],
            ['name' => 'Cloud', 'slug' => 'cloud', 'description' => 'Deployment foundations for scalable applications.'],
            ['name' => 'DevOps', 'slug' => 'devops', 'description' => 'Version control, delivery workflows, and automation basics.'],
            ['name' => 'Design', 'slug' => 'design', 'description' => 'UI composition, visual systems, and prototyping.'],
            ['name' => 'Operating Systems', 'slug' => 'operating-systems', 'description' => 'Everyday development environments and troubleshooting.'],
            ['name' => 'Networking', 'slug' => 'networking', 'description' => 'Networking fundamentals and enterprise concepts.'],
            ['name' => 'Soft Skills', 'slug' => 'soft-skills', 'description' => 'Leadership, communication, and execution habits.'],
        ];

        $categoryMap = [];

        foreach ($categories as $index => $category) {
            $categoryMap[$category['slug']] = SkillCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'sort_order' => $index],
            );
        }

        $skills = [
            ['Programming', 'Java', 'programming', 82, true],
            ['Programming', 'Python', 'programming', 80, true],
            ['Programming', 'PHP', 'programming', 84, true],
            ['Frontend', 'React', 'frontend', 86, true],
            ['Frontend', 'TypeScript', 'frontend', 78, true],
            ['Frontend', 'Tailwind CSS', 'frontend', 88, true],
            ['Backend', 'Laravel', 'backend', 86, true],
            ['Backend', 'REST API Design', 'backend', 78, true],
            ['Backend', 'Firebase', 'backend', 72, false],
            ['Database', 'MySQL', 'database', 82, true],
            ['Cloud', 'AWS', 'cloud', 68, true],
            ['DevOps', 'Git', 'devops', 84, true],
            ['DevOps', 'GitHub', 'devops', 84, true],
            ['Design', 'Figma', 'design', 88, true],
            ['Operating Systems', 'Windows', 'operating-systems', 86, false],
            ['Networking', 'CCNA Fundamentals', 'networking', 76, false],
            ['Soft Skills', 'Leadership', 'soft-skills', 92, true],
            ['Soft Skills', 'Publicity Strategy', 'soft-skills', 90, false],
            ['Soft Skills', 'Team Coordination', 'soft-skills', 88, false],
        ];

        foreach ($skills as $index => [$categoryName, $name, $categorySlug, $proficiency, $featured]) {
            Skill::query()->updateOrCreate(
                ['slug' => str($name)->slug()->toString()],
                [
                    'skill_category_id' => $categoryMap[$categorySlug]->id,
                    'name' => $name,
                    'icon' => $categoryName,
                    'proficiency' => $proficiency,
                    'featured' => $featured,
                    'sort_order' => $index,
                ],
            );
        }
    }

    private function seedProjects(): void
    {
        $projects = [
            [
                'title' => 'SolMate',
                'slug' => 'solmate',
                'summary' => 'Capstone solution built with Laravel, Firebase, Android Studio, and UI prototypes.',
                'description' => 'A capstone project focused on solving a practical user problem through a mobile and backend architecture.',
                'role' => 'Backend Developer',
                'problem' => 'Users need a dependable system that connects mobile workflows with secure backend services.',
                'solution' => 'Laravel APIs, Firebase-backed mobile integrations, and structured UI planning in Figma.',
                'architecture' => 'Laravel API layer, Firebase services, Android client, and supporting web assets.',
                'challenges' => ['Coordinating mobile and backend data flow', 'Keeping the API predictable for Android integration', 'Documenting technical decisions for the capstone team'],
                'lessons_learned' => ['Design the API contract early', 'Keep backend responsibilities explicit', 'Prototype UI behavior before implementation'],
                'tech_stack' => ['Laravel', 'PHP', 'Firebase', 'Android Studio', 'HTML', 'CSS', 'Figma'],
                'status' => 'Capstone',
                'featured' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'IT Launchpad Platform',
                'slug' => 'it-launchpad-platform',
                'summary' => 'Frontend and UI design work for an IT learning and launch platform.',
                'description' => 'A platform concept centered on helping IT students discover skills, paths, and project opportunities.',
                'role' => 'Frontend Developer and UI Designer',
                'problem' => 'Students need a clear starting point for exploring IT tracks and practical next steps.',
                'solution' => 'A responsive interface that organizes learning tracks, project prompts, and student resources.',
                'architecture' => 'React interface, reusable UI components, and design-first page flows.',
                'challenges' => ['Balancing dense information with readability', 'Making the interface useful for repeated visits'],
                'lessons_learned' => ['Information architecture matters as much as visual style', 'Good UI reduces decision fatigue'],
                'tech_stack' => ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
                'status' => 'In progress',
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Creative Publication Portfolio',
                'slug' => 'creative-publication-portfolio',
                'summary' => 'A gallery of publication materials across AITS, BSP, JDPNHS, posters, videos, and branding.',
                'description' => 'A publication-focused archive demonstrating layout discipline, brand consistency, and event communication.',
                'role' => 'Publication Designer',
                'problem' => 'Organizations need clear visual communication for events, announcements, and campaigns.',
                'solution' => 'A curated creative archive for posters, videos, and branding systems.',
                'architecture' => 'Gallery collections grouped by organization and media type.',
                'challenges' => ['Maintaining consistency across campaigns', 'Designing for fast social media consumption'],
                'lessons_learned' => ['Visual hierarchy is an operational tool', 'Good templates speed up teams'],
                'tech_stack' => ['Figma', 'Branding', 'Publication Design', 'Video'],
                'status' => 'Ongoing',
                'featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Personal Portfolio',
                'slug' => 'personal-portfolio',
                'summary' => 'This Laravel, React, TypeScript, Tailwind, and MySQL-ready portfolio application.',
                'description' => 'A full-stack portfolio application with authentication, database-backed content, APIs, contact storage, and an admin dashboard foundation.',
                'role' => 'Full-Stack Developer',
                'problem' => 'A static portfolio does not show enough production judgment or backend capability.',
                'solution' => 'A production-shaped app with content models, protected admin access, REST APIs, and polished React pages.',
                'architecture' => 'Laravel backend, Inertia React frontend, Tailwind UI, REST API routes, and deploy-ready AWS configuration points.',
                'challenges' => ['Turning a large roadmap into a useful first version', 'Keeping the UI polished while preserving backend depth'],
                'lessons_learned' => ['Scope the first version around working data flows', 'A portfolio can be a product, not just a page'],
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL', 'AWS'],
                'status' => 'Current Project',
                'featured' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Future Project',
                'slug' => 'future-project',
                'summary' => 'Reserved space for the next shipped software project.',
                'description' => 'A placeholder card for upcoming internship, open-source, or product work.',
                'role' => 'Developer',
                'tech_stack' => ['React', 'Laravel'],
                'status' => 'Planned',
                'featured' => false,
                'sort_order' => 4,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::query()->updateOrCreate(
                ['slug' => $projectData['slug']],
                [...$projectData, 'published_at' => now()],
            );

            $project->images()->updateOrCreate(
                ['path' => '/images/portfolio-workspace.png'],
                [
                    'alt' => $project->title.' project workspace',
                    'caption' => 'Portfolio workspace visual',
                    'sort_order' => 0,
                ],
            );
        }
    }

    private function seedExperience(): void
    {
        Experience::query()->updateOrCreate(
            ['title' => 'Part-time HR Personnel', 'organization' => 'Exponent General Services Inc.'],
            [
                'location' => null,
                'type' => 'Work Experience',
                'period' => '2023 - 2024',
                'start_date' => '2023-01-01',
                'end_date' => '2024-12-31',
                'summary' => 'Supported human resources operations while balancing academic and leadership commitments.',
                'highlights' => ['Administrative coordination', 'Document organization', 'Professional workplace communication'],
                'featured' => true,
                'sort_order' => 0,
            ],
        );
    }

    private function seedLeadership(): void
    {
        $roles = [
            [
                'title' => 'Director for Publicity',
                'organization' => 'Alliance of Information Technology Students',
                'period' => 'April 2026 - July 2026',
                'start_date' => '2026-04-01',
                'end_date' => '2026-07-31',
                'summary' => 'Led publicity direction for organizational campaigns, announcements, and event communication.',
            ],
            [
                'title' => 'Junior Officer for Publicity',
                'organization' => 'Alliance of Information Technology Students',
                'period' => 'Previous Term',
                'start_date' => null,
                'end_date' => null,
                'summary' => 'Supported publicity assets, communication workflows, and creative execution.',
            ],
            [
                'title' => 'Director for Academics',
                'organization' => 'Alliance of Information Technology Students',
                'period' => 'Previous Term',
                'start_date' => null,
                'end_date' => null,
                'summary' => 'Helped plan academic initiatives and student-centered activities.',
            ],
            [
                'title' => 'Committee Head',
                'organization' => 'Alliance of Information Technology Students',
                'period' => 'Previous Term',
                'start_date' => null,
                'end_date' => null,
                'summary' => 'Coordinated committee work and event execution.',
            ],
            [
                'title' => 'Council Scout Representative',
                'organization' => 'Boy Scouts',
                'period' => 'Scout Leadership',
                'start_date' => null,
                'end_date' => null,
                'summary' => 'Represented scouts in council-level leadership and service initiatives.',
            ],
        ];

        foreach ($roles as $index => $role) {
            Leadership::query()->updateOrCreate(
                ['title' => $role['title'], 'organization' => $role['organization']],
                [
                    ...$role,
                    'location' => null,
                    'highlights' => ['Team coordination', 'Public-facing communication', 'Service-oriented leadership'],
                    'featured' => $index < 2,
                    'sort_order' => $index,
                ],
            );
        }
    }

    private function seedCredentials(): void
    {
        $certifications = [
            ['Cisco Certified Support Technician', 'Cisco', 'Completed', true],
            ['Information Technology Specialist (Python)', 'Certiport', 'Completed', true],
            ['CCNA Enterprise Networking Security and Automation', 'Cisco', 'Completed', true],
            ['AWS Cloud Practitioner', 'Amazon Web Services', 'Future', false],
            ['GitHub Foundations', 'GitHub', 'Future', false],
            ['Oracle Certification', 'Oracle', 'Future', false],
        ];

        foreach ($certifications as $index => [$title, $issuer, $status, $featured]) {
            Certification::query()->updateOrCreate(
                ['title' => $title],
                [
                    'issuer' => $issuer,
                    'status' => $status,
                    'featured' => $featured,
                    'sort_order' => $index,
                ],
            );
        }

        $awards = [
            ['Silver Anahaw Award', 'Boy Scouts', null, 'Recognition for scout achievement and service.'],
            ['Eagle Scout', 'Boy Scouts', null, 'Highest-rank scout achievement reflecting leadership, discipline, and service.'],
            ['College Quiz Bee Champion', 'FEU Institute of Technology', null, 'Academic competition recognition.'],
            ['National Academic Meet 1st Runner-Up', null, null, 'National-level academic competition achievement.'],
        ];

        foreach ($awards as $index => [$title, $issuer, $year, $description]) {
            Award::query()->updateOrCreate(
                ['title' => $title],
                [
                    'issuer' => $issuer,
                    'year' => $year,
                    'description' => $description,
                    'featured' => true,
                    'sort_order' => $index,
                ],
            );
        }
    }

    private function seedSocialLinks(): void
    {
        $links = [
            ['Email', 'mailto:hello@francine.dev', 'Mail'],
            ['LinkedIn', 'https://www.linkedin.com/', 'Linkedin'],
            ['GitHub', 'https://github.com/', 'Github'],
            ['Facebook', 'https://www.facebook.com/', 'Facebook'],
            ['Instagram', 'https://www.instagram.com/', 'Instagram'],
        ];

        foreach ($links as $index => [$platform, $url, $icon]) {
            SocialLink::query()->updateOrCreate(
                ['platform' => $platform],
                [
                    'url' => $url,
                    'icon' => $icon,
                    'featured' => true,
                    'sort_order' => $index,
                ],
            );
        }
    }

    private function seedGallery(): void
    {
        $items = [
            ['AITS Publications', 'AITS', 'Publication work for student organization campaigns.'],
            ['BSP Creative Work', 'BSP', 'Scout-related publication and leadership materials.'],
            ['JDPNHS Materials', 'JDPNHS', 'School publication and event communication assets.'],
            ['Posters and Branding', 'Branding', 'Poster systems, social media layouts, and visual identity explorations.'],
            ['Videos', 'Video', 'Motion and video communication pieces.'],
        ];

        foreach ($items as $index => [$title, $category, $description]) {
            GalleryItem::query()->updateOrCreate(
                ['title' => $title],
                [
                    'category' => $category,
                    'media_type' => $category === 'Video' ? 'video' : 'image',
                    'path' => '/images/portfolio-workspace.png',
                    'description' => $description,
                    'featured' => $index < 3,
                    'sort_order' => $index,
                ],
            );
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PortfolioContentController extends Controller
{
    /**
     * @var array<string, class-string<Model>>
     */
    private array $resources = [
        'projects' => Project::class,
        'skills' => Skill::class,
        'skill-categories' => SkillCategory::class,
        'experiences' => Experience::class,
        'leaderships' => Leadership::class,
        'awards' => Award::class,
        'certifications' => Certification::class,
        'gallery' => GalleryItem::class,
        'social-links' => SocialLink::class,
        'settings' => Setting::class,
    ];

    public function index(Request $request, string $resource): JsonResponse|InertiaResponse
    {
        $model = $this->modelFor($resource);

        $query = $model::query();

        if ($resource === 'projects') {
            $query->with('images');
        }

        if (method_exists($model, 'scopeOrdered')) {
            $query->ordered();
        } else {
            $query->latest();
        }

        $records = $query->paginate(20)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($records);
        }

        return Inertia::render('admin/content', [
            'resource' => $resource,
            'resourceLabel' => $this->labelFor($resource),
            'records' => $records,
            'modules' => $this->modules(),
        ]);
    }

    public function store(Request $request, string $resource): JsonResponse|RedirectResponse
    {
        $model = $this->modelFor($resource);
        $data = $request->validate($this->rulesFor($resource));
        $record = $model::create($data);

        if ($request->expectsJson()) {
            return response()->json($record, 201);
        }

        return back()->with('success', $this->labelFor($resource).' created.');
    }

    public function update(Request $request, string $resource, int $id): JsonResponse|RedirectResponse
    {
        $model = $this->modelFor($resource)::query()->findOrFail($id);
        $rules = collect($this->rulesFor($resource))
            ->mapWithKeys(fn (array|string $rules, string $field): array => [
                $field => ['sometimes', ...Arr::wrap($rules)],
            ])
            ->all();

        $model->update($request->validate($rules));

        if ($request->expectsJson()) {
            return response()->json($model->fresh());
        }

        return back()->with('success', $this->labelFor($resource).' updated.');
    }

    public function destroy(Request $request, string $resource, int $id): JsonResponse|RedirectResponse
    {
        $model = $this->modelFor($resource)::query()->findOrFail($id);
        $model->delete();

        if ($request->expectsJson()) {
            return response()->json(status: 204);
        }

        return back()->with('success', $this->labelFor($resource).' deleted.');
    }

    /**
     * @return class-string<Model>
     */
    private function modelFor(string $resource): string
    {
        abort_unless(isset($this->resources[$resource]), 404);

        return $this->resources[$resource];
    }

    /**
     * @return array<int, array{name: string, resource: string, count: int}>
     */
    private function modules(): array
    {
        return collect($this->resources)
            ->map(fn (string $model, string $resource): array => [
                'name' => $this->labelFor($resource),
                'resource' => $resource,
                'count' => $model::count(),
            ])
            ->values()
            ->all();
    }

    private function labelFor(string $resource): string
    {
        return [
            'projects' => 'Projects',
            'skills' => 'Skills',
            'skill-categories' => 'Skill Categories',
            'experiences' => 'Experience',
            'leaderships' => 'Leadership',
            'awards' => 'Awards',
            'certifications' => 'Certifications',
            'gallery' => 'Gallery',
            'social-links' => 'Social Links',
            'settings' => 'Settings',
        ][$resource] ?? (string) str($resource)->replace('-', ' ')->title();
    }

    /**
     * @return array<string, mixed>
     */
    private function rulesFor(string $resource): array
    {
        return match ($resource) {
            'projects' => [
                'title' => ['required', 'string', 'max:160'],
                'slug' => ['required', 'string', 'max:180'],
                'summary' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'role' => ['nullable', 'string', 'max:120'],
                'problem' => ['nullable', 'string'],
                'solution' => ['nullable', 'string'],
                'architecture' => ['nullable', 'string'],
                'challenges' => ['nullable', 'array'],
                'lessons_learned' => ['nullable', 'array'],
                'tech_stack' => ['nullable', 'array'],
                'github_url' => ['nullable', 'url', 'max:255'],
                'live_url' => ['nullable', 'url', 'max:255'],
                'case_study_url' => ['nullable', 'url', 'max:255'],
                'status' => ['required', 'string', 'max:80'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
                'published_at' => ['nullable', 'date'],
            ],
            'skills' => [
                'skill_category_id' => ['nullable', Rule::exists('skill_categories', 'id')],
                'name' => ['required', 'string', 'max:120'],
                'slug' => ['required', 'string', 'max:140'],
                'icon' => ['nullable', 'string', 'max:80'],
                'proficiency' => ['required', 'integer', 'min:1', 'max:100'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'skill-categories' => [
                'name' => ['required', 'string', 'max:120'],
                'slug' => ['required', 'string', 'max:140'],
                'description' => ['nullable', 'string'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'experiences', 'leaderships' => [
                'title' => ['required', 'string', 'max:160'],
                'organization' => ['required', 'string', 'max:180'],
                'location' => ['nullable', 'string', 'max:160'],
                'type' => ['nullable', 'string', 'max:80'],
                'period' => ['nullable', 'string', 'max:120'],
                'start_date' => ['nullable', 'date'],
                'end_date' => ['nullable', 'date'],
                'summary' => ['nullable', 'string'],
                'highlights' => ['nullable', 'array'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'awards' => [
                'title' => ['required', 'string', 'max:180'],
                'issuer' => ['nullable', 'string', 'max:180'],
                'year' => ['nullable', 'string', 'max:20'],
                'description' => ['nullable', 'string'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'certifications' => [
                'title' => ['required', 'string', 'max:180'],
                'issuer' => ['nullable', 'string', 'max:180'],
                'status' => ['required', 'string', 'max:80'],
                'issued_at' => ['nullable', 'date'],
                'expires_at' => ['nullable', 'date'],
                'credential_url' => ['nullable', 'url', 'max:255'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'gallery' => [
                'title' => ['required', 'string', 'max:180'],
                'category' => ['nullable', 'string', 'max:120'],
                'media_type' => ['required', 'string', 'max:40'],
                'path' => ['nullable', 'string', 'max:255'],
                'external_url' => ['nullable', 'url', 'max:255'],
                'description' => ['nullable', 'string'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'social-links' => [
                'platform' => ['required', 'string', 'max:80'],
                'url' => ['required', 'string', 'max:255'],
                'icon' => ['nullable', 'string', 'max:80'],
                'featured' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            'settings' => [
                'setting_key' => ['required', 'string', 'max:120'],
                'setting_value' => ['nullable', 'array'],
                'setting_group' => ['required', 'string', 'max:80'],
                'type' => ['required', 'string', 'max:80'],
                'is_public' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
            default => [],
        };
    }
}

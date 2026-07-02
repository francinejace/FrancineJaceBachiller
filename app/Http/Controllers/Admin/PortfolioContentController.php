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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

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

    public function index(string $resource): JsonResponse
    {
        $model = $this->modelFor($resource);

        $query = $model::query();

        if (method_exists($model, 'scopeOrdered')) {
            $query->ordered();
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $model = $this->modelFor($resource);
        $data = $request->validate($this->rulesFor($resource));

        return response()->json($model::create($data), 201);
    }

    public function update(Request $request, string $resource, int $id): JsonResponse
    {
        $model = $this->modelFor($resource)::query()->findOrFail($id);
        $rules = collect($this->rulesFor($resource))
            ->mapWithKeys(fn (array|string $rules, string $field): array => [
                $field => ['sometimes', ...Arr::wrap($rules)],
            ])
            ->all();

        $model->update($request->validate($rules));

        return response()->json($model->fresh());
    }

    public function destroy(string $resource, int $id): JsonResponse
    {
        $model = $this->modelFor($resource)::query()->findOrFail($id);
        $model->delete();

        return response()->json(status: 204);
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

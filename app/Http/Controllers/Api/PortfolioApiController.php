<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Award;
use App\Models\Certification;
use App\Models\Experience;
use App\Models\GalleryItem;
use App\Models\Leadership;
use App\Models\Project;
use App\Models\Setting;
use App\Models\SkillCategory;
use App\Models\SocialLink;
use App\Support\PortfolioData;
use Illuminate\Http\JsonResponse;

class PortfolioApiController extends Controller
{
    public function overview(PortfolioData $portfolioData): JsonResponse
    {
        return response()->json($portfolioData->publicPayload());
    }

    public function projects(): JsonResponse
    {
        return response()->json(Project::with('images')->ordered()->get());
    }

    public function featuredProjects(): JsonResponse
    {
        return response()->json(Project::with('images')->featured()->ordered()->get());
    }

    public function skills(): JsonResponse
    {
        return response()->json(SkillCategory::with('skills')->ordered()->get());
    }

    public function experiences(): JsonResponse
    {
        return response()->json(Experience::ordered()->get());
    }

    public function leaderships(): JsonResponse
    {
        return response()->json(Leadership::ordered()->get());
    }

    public function awards(): JsonResponse
    {
        return response()->json(Award::ordered()->get());
    }

    public function certifications(): JsonResponse
    {
        return response()->json(Certification::ordered()->get());
    }

    public function socialLinks(): JsonResponse
    {
        return response()->json(SocialLink::ordered()->get());
    }

    public function gallery(): JsonResponse
    {
        return response()->json(GalleryItem::ordered()->get());
    }

    public function settings(): JsonResponse
    {
        return response()->json(Setting::public()->orderBy('sort_order')->get());
    }
}

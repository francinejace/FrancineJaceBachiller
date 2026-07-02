<?php

namespace App\Http\Controllers;

use App\Support\PortfolioData;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(PortfolioData $portfolioData): Response
    {
        return Inertia::render('dashboard', $portfolioData->dashboardPayload());
    }
}

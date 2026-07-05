<?php

namespace App\Http\Controllers;

use App\Support\PortfolioData;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __construct(private readonly PortfolioData $portfolioData) {}

    public function home(): Response
    {
        return Inertia::render('portfolio', $this->portfolioData->publicPayload('home'));
    }

    public function about(): Response
    {
        return $this->page('about');
    }

    public function skills(): Response
    {
        return $this->page('skills');
    }

    public function experience(): Response
    {
        return $this->page('experience');
    }

    public function projects(): Response
    {
        return $this->page('projects');
    }

    public function certifications(): Response
    {
        return $this->page('certifications');
    }

    public function awards(): Response
    {
        return $this->page('awards');
    }

    public function resume(): Response
    {
        return $this->page('resume');
    }

    public function contact(): Response
    {
        return $this->page('contact');
    }

    private function page(string $page): Response
    {
        return Inertia::render('portfolio', $this->portfolioData->publicPayload($page));
    }
}

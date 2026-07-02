<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Leadership extends Model
{
    protected $fillable = [
        'title',
        'organization',
        'location',
        'period',
        'start_date',
        'end_date',
        'summary',
        'highlights',
        'featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'highlights' => 'array',
            'featured' => 'boolean',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('start_date');
    }
}

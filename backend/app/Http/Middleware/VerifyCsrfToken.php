<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/tickets',
        '/api/session-seats',
        '/api/seat-types/hall/update-price',
        '/api/seat-types/hall/*',
        '/api/hall-seats/hall/*',
        '/api/session/add-film',
        '/api/session-remove/*',
        '/api/films',
        '/api/films/add',
        '/administrator/cinema-halls/add',
        '/administrator/cinema-halls/configure',
        '/administrator/cinema-halls/del/*'
    ];
}


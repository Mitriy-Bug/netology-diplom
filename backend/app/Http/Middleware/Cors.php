<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*') // Разрешить запросы с любого источника
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Разрешить указанные методы
            ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization') // Разрешить указанные заголовки
            ->header('Access-Control-Max-Age', '3600'); // Кеширование предзапросов на 60 минут
    }
}

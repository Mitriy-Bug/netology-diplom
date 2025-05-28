<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;

class FilmsController extends Controller
{
    public function index()
    {
        // Загрузка всех фильмов с сессиями и залами
        $films = Film::with('sessions.cinemaHall')->get();
        
        // Возвращаем массив фильмов с новой структурой
        return response()->json($films);
    }

    public function show($id)
    {
        // Получение конкретного фильма с сессиями и залами
        $film = Film::with('sessions.cinemaHall')->findOrFail($id);
        
        // Возвращаем конкретный фильм с новой структурой
        return response()->json($film);
    }
}
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
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,bmp,webp|max:20048',
        ]);

        // Обработка загрузки постера
        if ($request->hasFile('poster')) {
            $file = $request->file('poster');

            // Определяем путь к папке public/api/images
            $publicPath = public_path('api/images');

            // Создаем папку если она не существует
            if (!file_exists($publicPath)) {
                mkdir($publicPath, 0755, true);
            }
             $filename = time() . '_' . $file->getClientOriginalName();

            // Сохраняем файл напрямую в папку public/api/images
            $file->move($publicPath, $filename);

            // Формируем полный URL
            $validatedData['poster'] = url('api/images/' . $filename);
        }

        $film = Film::create($validatedData);

        return response()->json($film, 201);
    }
}

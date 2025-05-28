<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator; // Добавлен импорт Validator
use Illuminate\Http\Request;
use App\Models\CinemaHall;

class CinemaHallController extends Controller
{
    // Метод для получения всех залов
    public function index()
    {
        $halls = CinemaHall::all();
        return response()->json($halls);
    }

    // Метод для получения конкретного зала по ID
    public function show(CinemaHall $cinemaHall)
    {
        return response()->json($cinemaHall);
    }

// Метод для создания нового зала
public function store(Request $request)
{
    $validatedData = $request->validate([
        'name'              => 'required|string|max:255',
        'total_rows'        => 'required|integer|min:1',
        'total_seats_per_row'=> 'required|integer|min:1',
    ]);

    $hall = CinemaHall::create($validatedData);
    return response()->json(['message' => 'Cinema hall created successfully!', 'data' => $hall], 201);
}



    // Метод для обновления существующего зала
    public function update(Request $request, CinemaHall $cinemaHall)
    {
        $validatedData = $request->validate([
            'name'              => 'sometimes|string|max:255',
            'total_rows'        => 'sometimes|integer|min:1',
            'total_seats_per_row'=> 'sometimes|integer|min:1',
        ]);

        $cinemaHall->update($validatedData);
        return response()->json(['message' => 'Cinema hall updated successfully!']);
    }

    // Метод для удаления зала по его ID
public function destroyById($id)
{
    // Находим зал по его ID
    $cinemaHall = CinemaHall::find($id);

    if ($cinemaHall) {
        // Удаляем зал
        $cinemaHall->delete();
        // Возвращаем ответ клиенту
        return response()->json(['message' => 'Cinema hall deleted successfully!'], 200);
    } else {
        // Если зал не найден, возвращаем ошибку
        return response()->json(['message' => 'Cinema hall not found!'], 404);
    }
}
}
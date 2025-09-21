<?php

namespace App\Http\Controllers;
use App\Models\HallSeat;
use App\Models\SeatType;
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
    SeatType::create([
        'id_hall' => $hall->id,
        'type'    => 'Стандарт',
        'price'   => 100,
    ]);
    SeatType::create([
        'id_hall' => $hall->id,
        'type'    => 'VIP',
        'price'   => 200,
    ]);
    return response()->json(['message' => 'Cinema hall created successfully!', 'data' => $hall], 201);
}
// Метод для конфигурации зала
    public function configure(Request $request)
    {
        // Валидация входных данных
        $validatedData = $request->validate([
            '*.hall_id' => 'required|integer|min:1',
            '*.row' => 'required|integer|min:1',
            '*.seat' => 'required|integer|min:1',
            '*.type' => 'required|string',
        ]);

        try {
            $createdSeats = [];

            foreach ($validatedData as $seatData) {
                // Преобразуем тип в ID
                $seatTypeId = $this->getSeatTypeId($seatData['type']);

                // Используем updateOrCreate для обновления существующих или создания новых записей
                $seat = HallSeat::updateOrCreate(
                    [
                        'cinema_hall_id' => $seatData['hall_id'],
                        'row_number' => $seatData['row'],
                        'seat_number' => $seatData['seat']
                    ],
                    [
                        'seat_type_id' => $seatTypeId
                    ]
                );

                $createdSeats[] = $seat;
            }

            return response()->json([
                'message' => 'Cinema hall seats configured successfully!',
                'data' => $createdSeats,
                'count' => count($createdSeats)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error configuring cinema hall seats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getSeatTypeId($typeName)
    {
        $typeMap = [
            'standart' => 1,
            'standard' => 1,
            'vip' => 2,
            'disabled' => 3,
            'blocked' => 3
        ];

        return $typeMap[strtolower($typeName)] ?? 1;
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

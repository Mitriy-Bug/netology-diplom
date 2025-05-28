<?php

namespace App\Http\Controllers;

use App\Models\SeatType;
use Illuminate\Http\Request;

class SeatTypeController extends Controller
{
    // Метод для получения списка всех типов кресел
    public function index()
    {
        $seatTypes = SeatType::all();
        return response()->json($seatTypes);
    }

    // Метод для получения конкретного типа кресла по ID
    public function show($id)
    {
        $seatType = SeatType::findOrFail($id);
        return response()->json($seatType);
    }

    // Метод для создания нового типа кресла
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:0'
        ]);

        $seatType = SeatType::create($validatedData);
        return response()->json($seatType, 201);
    }

    // Метод для обновления типа кресла
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'type' => 'string|max:255',
            'price' => 'numeric|min:0'
        ]);

        $seatType = SeatType::findOrFail($id);
        $seatType->update($validatedData);
        return response()->json($seatType);
    }

    // Метод для удаления типа кресла
    public function destroy($id)
    {
        $seatType = SeatType::findOrFail($id);
        $seatType->delete();
        return response()->json([], 204);
    }
}
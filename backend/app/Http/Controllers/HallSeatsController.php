<?php

namespace App\Http\Controllers;

use App\Models\HallSeat;
use Illuminate\Http\Request;

class HallSeatsController extends Controller
{
    // Метод для получения списка всех типов кресел
    public function index()
    {
        $seatTypes = HallSeat::all();
        return response()->json($seatTypes);
    }
    // Метод для получения типов кресел по ID зала
    public function getByHall($hallId)
    {
        $seatTypes = HallSeat::where('cinema_hall_id', $hallId)->get();
        return response()->json($seatTypes);
    }

    public function destroy($id)
    {
        $seatType = HallSeat::findOrFail($id);
        $seatType->delete();
        return response()->json([], 204);
    }
}

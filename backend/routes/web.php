<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\SessionsController;
use App\Http\Controllers\SessionSeatController;
use App\Http\Controllers\SeatTypeController;
use App\Http\Controllers\CinemaHallController;

Route::group(['prefix' => 'api'], function () {
    Route::resource('films', 'App\Http\Controllers\FilmsController');
    Route::resource('sessions', 'App\Http\Controllers\SessionsController');//сессии показа фильмов
    Route::post('tickets', 'App\Http\Controllers\TicketsController@store');
    Route::get('/images/{filename}', [ImageController::class, 'show']); //получить линк ссылку на картинку к фильму
    Route::get('/sessions/hall-seats/{sessionId}', [SessionsController::class, 'getHallSeats']);//получить все кресла в зале по сессии
    Route::resource('seat-types', SeatTypeController::class);// типы кресел
    Route::resource('/session-seats', SessionSeatController::class);// занятые кресла
    Route::get('/session-seats-is_booked', [SessionSeatController::class, 'getSessionSeatsIs_booked']);//получить занятые кресла в зале по сессии

});

Route::group(['prefix' => 'administrator'], function () {
    Route::resource('/cinema-halls', CinemaHallController::class);
    Route::post('/cinema-halls/add', [CinemaHallController::class,'show']);
    Route::delete('/cinema-halls/del/{id}', [CinemaHallController::class, 'destroyById'])->name('cinema-halls.destroy-by-id');
});



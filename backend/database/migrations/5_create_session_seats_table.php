<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionSeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_seats', function (Blueprint $table) {
            $table->id(); // Идентификатор забронированного места
            $table->unsignedBigInteger('session_id'); // Связь с сеансом
            $table->foreign('session_id') // Внешний ключ на таблицу sessions
                ->references('id')
                ->on('sessions')
                ->onDelete('cascade'); // Удаляем бронь при удалении сеанса

            $table->unsignedBigInteger('hall_seat_id'); // Связь с местом в зале
            $table->foreign('hall_seat_id') // Внешний ключ на таблицу hall_seats
                ->references('id')
                ->on('hall_seats')
                ->onDelete('restrict'); // Ограничиваем удаление, если есть связи

            $table->unsignedTinyInteger('row_number'); // Номер ряда
            $table->unsignedSmallInteger('seat_number'); // Номер места в ряду    
            $table->boolean('is_booked')->default(false); // Флаг, является ли место забронированным
            $table->timestamps(); // Поля created_at и updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('session_seats');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHallSeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hall_seats', function (Blueprint $table) {
            $table->id(); // Идентификатор кресла
            $table->unsignedBigInteger('cinema_hall_id'); // Связь с залом
            $table->foreign('cinema_hall_id') // Внешний ключ на таблицу cinema_halls
                ->references('id')
                ->on('cinema_halls')
                ->onDelete('cascade'); // Удаление связанных записей при удалении зала

            $table->unsignedTinyInteger('row_number'); // Номер ряда
            $table->unsignedSmallInteger('seat_number'); // Номер места в ряду
            $table->unsignedBigInteger('seat_type_id'); // Тип кресла
            $table->foreign('seat_type_id') // Внешний ключ на таблицу seat_types
                ->references('id')
                ->on('seat_types')
                ->onDelete('restrict'); // Ограничиваем удаление, если есть связи

            $table->unique(['cinema_hall_id', 'row_number', 'seat_number']); // Уникальность комбинации зала/ряда/места
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
        Schema::dropIfExists('hall_seats');
    }
}

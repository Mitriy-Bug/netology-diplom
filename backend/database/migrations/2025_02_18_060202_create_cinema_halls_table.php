<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCinemaHallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cinema_halls', function (Blueprint $table) {
            $table->id(); // Идентификатор зала
            $table->string('name'); // Название зала
            $table->unsignedInteger('total_rows')->nullable(); // Общее количество рядов
            $table->unsignedInteger('total_seats_per_row')->nullable(); // Количество мест в одном ряду
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
        Schema::dropIfExists('cinema_halls');
    }
}

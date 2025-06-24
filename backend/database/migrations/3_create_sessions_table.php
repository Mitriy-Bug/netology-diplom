<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id(); // Идентификатор сеанса
            $table->unsignedBigInteger('film_id'); // Связь с фильмом
            $table->foreign('film_id') // Внешний ключ на таблицу films
                ->references('id')
                ->on('films');
            $table->datetime('start_time'); // Время начала сеанса
            $table->datetime('end_time'); // Время окончания сеанса
            $table->unsignedBigInteger('cinema_hall_id'); // Связь с залом
            $table->foreign('cinema_hall_id') // Внешний ключ на таблицу cinema_halls
                ->references('id')
                ->on('cinema_halls')
                ->onDelete('cascade'); // Добавляем каскадное удаление
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
        Schema::dropIfExists('sessions');
    }
}

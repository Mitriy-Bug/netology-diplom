<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeatTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seat_types', function (Blueprint $table) {
            $table->id(); // Идентификатор типа кресла
            $table->string('type'); // Тип кресла ('Standard', 'VIP', 'Blocked', 'Occupied')
            $table->decimal('price', 8, 2); // Цена за кресло данного типа
            $table->integer('id_hall'); // ID зала
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
        Schema::dropIfExists('seat_types');
    }
}

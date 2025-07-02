<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Only add the column if it does not exist
        if (!Schema::hasColumn('waitlist_entries', 'status')) {
            Schema::table('waitlist_entries', function (Blueprint $table) {
                $table->string('status')->default('pending');
            });
        }
    }

    public function down()
    {
        // Only drop the column if it exists
        if (Schema::hasColumn('waitlist_entries', 'status')) {
            Schema::table('waitlist_entries', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};

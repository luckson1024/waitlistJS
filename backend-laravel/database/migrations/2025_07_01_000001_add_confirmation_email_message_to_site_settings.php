<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConfirmationEmailMessageToSiteSettings extends Migration
{
    public function up()
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->text('confirmation_email_message')->nullable();
        });
    }

    public function down()
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('confirmation_email_message');
        });
    }
}

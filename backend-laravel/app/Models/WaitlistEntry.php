<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaitlistEntry extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */ 
    protected $table = 'waitlist_entries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'full_name',
        'phone_number',
        'type_of_business',
        'custom_business_types',
        'country',
        'custom_country',
        'city',
        'has_run_store_before',
        'wants_tutorial_book',
        'ip_address',
        'user_agent',
        'referrer',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'status',
        'email_verified',
        'email_verification_token',
        'email_verification_sent_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'has_run_store_before' => 'boolean',
        'wants_tutorial_book' => 'boolean',
        'email_verified' => 'boolean',
        'email_verification_sent_at' => 'datetime',
    ];
}

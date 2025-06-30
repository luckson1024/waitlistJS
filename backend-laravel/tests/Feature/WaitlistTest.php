<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaitlistTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can be added to the waitlist.
     */
    public function test_user_can_capture_email(): void
    {
        $response = $this->postJson('/api/v1/waitlist/email-capture', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'email',
                    'created_at',
                    'updated_at',
                ]
            ]);

        $this->assertDatabaseHas('waitlist_entries', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_user_can_update_waitlist_entry(): void
    {
        $entry = \App\Models\WaitlistEntry::create(['email' => 'test@example.com']);

        $response = $this->putJson('/api/v1/waitlist/' . $entry->id, [
            'full_name' => 'Test User',
            'phone_number' => '1234567890',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'email',
                    'full_name',
                    'phone_number',
                ]
            ]);

        $this->assertDatabaseHas('waitlist_entries', [
            'id' => $entry->id,
            'full_name' => 'Test User',
        ]);
    }
}
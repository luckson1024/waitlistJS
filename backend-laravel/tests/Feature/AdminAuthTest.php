<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'username' => 'admin',
            'password_hash' => Hash::make('password'),
            'email' => 'admin@example.com',
            'full_name' => 'Admin User',
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'admin',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'token',
                ]
            ]);
    }

    public function test_admin_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'admin',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_CREDENTIALS',
                    'message' => 'Invalid username or password.'
                ]
            ]);
    }
}
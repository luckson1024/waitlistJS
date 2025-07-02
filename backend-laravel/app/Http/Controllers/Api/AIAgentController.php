<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use App\Models\WaitlistEntry;

class AIAgentController extends Controller
{
    public function security(Request $request)
    {
        $validated = $request->validate([
            'model' => 'required|string',
            'messages' => 'required|array',
            'systemInstruction' => 'nullable|string',
        ]);

        // Example: Forward to Gemini API (replace with real integration)
        // Here, just echo back the last user message and system instruction for demo
        $lastUserMsg = collect($validated['messages'])->last()['content'] ?? '';
        $systemInstruction = $validated['systemInstruction'] ?? '';

        // TODO: Replace with real Gemini API call and error handling
        if (str_contains(strtolower($lastUserMsg), 'tokenfail')) {
            return response()->json(['error' => 'Gemini API token expired or invalid.'], 401);
        }

        // Check for email count question
        if (preg_match('/how many (emails|users|registrations|people) (registered|signed up|on (the )?waitlist)/i', $lastUserMsg)) {
            $count = WaitlistEntry::count();
            return response()->json([
                'reply' => "There are currently $count emails registered on the waitlist."
            ]);
        }

        $apiKey = config('services.gemini.key');
        $systemInstruction = $validated['systemInstruction'] ?? '';
        $messages = $validated['messages'];

        // Format messages for Gemini
        $aiMessages = [];
        if ($systemInstruction) {
            $aiMessages[] = ['role' => 'system', 'content' => $systemInstruction];
        }
        foreach ($messages as $msg) {
            $aiMessages[] = ['role' => $msg['role'], 'content' => $msg['content']];
        }

        // Call Gemini API (replace URL with actual Gemini endpoint)
        $response = Http::withToken($apiKey)
            ->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', [
                'model' => $validated['model'],
                'contents' => $aiMessages,
            ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Gemini API error: ' . $response->body()], $response->status());
        }

        $reply = $response->json('candidates.0.content.parts.0.text') ?? 'No response from Gemini.';
        return response()->json(['reply' => $reply]);
    }
}

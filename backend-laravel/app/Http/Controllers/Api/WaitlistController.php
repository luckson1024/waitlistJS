<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitlistEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WaitlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['success' => true, 'data' => WaitlistEntry::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // This method is not used, email capture is handled by captureEmail
    }

    /**
     * Capture the user's email address.
     */
    public function captureEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:waitlist_entries,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input.',
                'details' => $validator->errors()
            ]], 422);
        }

        $entry = WaitlistEntry::create($request->only('email'));

        return response()->json(['success' => true, 'data' => $entry], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $entry = WaitlistEntry::find($id);

        if (!$entry) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Waitlist entry not found.'
            ]], 404);
        }

        return response()->json(['success' => true, 'data' => $entry]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $entry = WaitlistEntry::find($id);

        if (!$entry) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Waitlist entry not found.'
            ]], 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|string|max:50',
            'type_of_business' => 'sometimes|string|max:100',
            'custom_business_types' => 'sometimes|string',
            'country' => 'sometimes|string|max:100',
            'custom_country' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'has_run_store_before' => 'sometimes|boolean',
            'wants_tutorial_book' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input.',
                'details' => $validator->errors()
            ]], 422);
        }

        $entry->update($request->all());

        return response()->json(['success' => true, 'data' => $entry]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $entry = WaitlistEntry::find($id);

        if (!$entry) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Waitlist entry not found.'
            ]], 404);
        }

        $entry->delete();

        return response()->json(['success' => true, 'data' => null]);
    }
}

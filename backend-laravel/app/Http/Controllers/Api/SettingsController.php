<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['success' => true, 'data' => SiteSetting::where('is_sensitive', false)->get()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:site_settings,key',
            'settings.*.value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input.',
                'details' => $validator->errors()
            ]], 422);
        }

        foreach ($request->settings as $setting) {
            SiteSetting::where('key', $setting['key'])->update(['value' => $setting['value']]);
        }

        return response()->json(['success' => true, 'data' => null]);
    }
}

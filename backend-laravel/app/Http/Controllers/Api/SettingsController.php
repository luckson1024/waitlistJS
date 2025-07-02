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
     * Helper to update .env value
     */
    protected function setEnvValue($key, $value)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            file_put_contents($path, preg_replace(
                "/^{$key}=.*/m",
                "{$key}=\"{$value}\"",
                file_get_contents($path)
            ));
        }
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
            if ($setting['key'] === 'geminiApiKey') {
                $this->setEnvValue('GEMINI_API_KEY', $setting['value']);
            }
        }

        return response()->json(['success' => true, 'data' => null]);
    }

    /**
     * Upload logo file and return public URL.
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $file = $request->file('logo');
        $path = $file->store('public/logos');
        $url = asset(str_replace('public/', 'storage/', $path));

        // Optionally: Save $url to your settings table/model
        // SiteSetting::where('key', 'logoUrl')->update(['value' => $url]);

        return response()->json(['success' => true, 'url' => $url]);
    }
}

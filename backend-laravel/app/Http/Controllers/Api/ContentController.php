<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['success' => true, 'data' => SiteContent::where('is_active', true)->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|unique:site_content,key',
            'value' => 'required|string',
            'type' => 'sometimes|string',
            'category' => 'sometimes|string',
            'description' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input.',
                'details' => $validator->errors()
            ]], 422);
        }

        $content = SiteContent::create($request->all());

        return response()->json(['success' => true, 'data' => $content], 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WaitlistEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input.',
                'details' => $validator->errors()
            ]], 422);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['success' => false, 'error' => [
                'code' => 'INVALID_CREDENTIALS',
                'message' => 'Invalid username or password.'
            ]], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['success' => true, 'data' => ['token' => $token]]);
    }

    public function stats()
    {
        $stats = [
            'total_entries' => WaitlistEntry::count(),
            'verified_emails' => WaitlistEntry::where('email_verified', true)->count(),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function export()
    {
        $entries = WaitlistEntry::all();
        $csv = \League\Csv\Writer::createFromFileObject(new \SplTempFileObject());

        $csv->insertOne([
            'ID', 'Email', 'Full Name', 'Phone Number', 'Type of Business',
            'Custom Business Types', 'Country', 'Custom Country', 'City',
            'Has Run Store Before', 'Wants Tutorial Book', 'IP Address',
            'User Agent', 'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign',
            'Status', 'Email Verified', 'Email Verification Sent At', 'Created At', 'Updated At'
        ]);

        foreach ($entries as $entry) {
            $csv->insertOne($entry->toArray());
        }

        $csv->output('waitlist.csv');

        return response('', 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="waitlist.csv"',
        ]);
    }
}

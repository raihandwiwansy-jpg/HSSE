<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\OtpMail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                    'user' => [
                        'id' => $user->id,
                        'username' => $user->username,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'tempat_lahir' => $user->tempat_lahir,
                        'tanggal_lahir' => $user->tanggal_lahir,
                        'no_hp' => $user->no_hp,
                        'departemen' => $user->departemen,
                        'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                        'photo_url' => $user->photo_url ? asset('storage/' . $user->photo_url) : null,
                        'require_otp_forgot_password' => (bool)$user->require_otp_forgot_password,
                    ],
                'token' => $token,
            ],
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->require_otp_forgot_password) {
            $resetToken = Str::random(60);
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                ['token' => $resetToken, 'created_at' => now()]
            );

            return response()->json([
                'success' => true,
                'message' => 'Verifikasi email dinonaktifkan. Anda dapat langsung mereset password.',
                'data' => [
                    'bypass' => true,
                    'reset_token' => $resetToken,
                    'email' => $request->email,
                ],
            ]);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => Hash::make($otp), 'created_at' => now()]
        );

        try {
            Mail::to($request->email)->send(new OtpMail($otp));
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim email OTP: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP telah dikirim ke email Anda',
            'data' => [
                'otp' => $otp, // Remove in production
                'email' => $request->email,
            ],
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid',
            ], 400);
        }

        if (now()->diffInMinutes($record->created_at) > 10) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP sudah kadaluarsa',
            ], 400);
        }

        if (!Hash::check($request->otp, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP salah',
            ], 400);
        }

        $resetToken = Str::random(60);
        DB::table('password_resets')
            ->where('email', $request->email)
            ->update(['token' => $resetToken, 'created_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP valid',
            'data' => [
                'reset_token' => $resetToken,
                'email' => $request->email,
            ],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$record || $record->token !== $request->reset_token) {
            return response()->json([
                'success' => false,
                'message' => 'Token reset tidak valid',
            ], 400);
        }

        if (now()->diffInMinutes($record->created_at) > 10) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Token reset sudah kadaluarsa',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        $user->tokens()->delete();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login dengan password baru.',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $user->avatar = $user->avatar ? asset('storage/' . $user->avatar) : null;
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'no_hp' => 'nullable|string|max:20',
            'departemen' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'no_hp' => $validated['no_hp'] ?? null,
            'departemen' => $validated['departemen'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Register berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ], 201);
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        $user->avatar = $user->avatar ? asset('storage/' . $user->avatar) : null;
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'no_hp' => 'nullable|string|max:20',
            'departemen' => 'nullable|string|max:100',
        ]);

        $user->update($validated);
        $user->avatar = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diupdate',
            'data' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama salah',
            ], 422);
        }

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ]);
    }

    public function changeEmail(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'required',
        ]);

        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password salah',
            ], 422);
        }

        $user->update([
            'email' => $validated['email'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email berhasil diubah',
            'data' => [
                'email' => $user->email,
            ],
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $path]);
        }

        $avatarUrl = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil diperbarui',
            'data' => [
                'avatar' => $avatarUrl,
                'foto' => $avatarUrl,
            ],
        ]);
    }

    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        if ($user->photo_url) {
            Storage::disk('public')->delete($user->photo_url);
        }

        $path = $request->file('photo')->store('profiles', 'public');
        $user->update(['photo_url' => $path]);

        $fullUrl = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'data' => [
                'photo_url' => $fullUrl,
            ],
        ]);
    }

    public function toggleOtpForgot(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'require_otp_forgot_password' => 'required|boolean',
        ]);

        $user->update([
            'require_otp_forgot_password' => $validated['require_otp_forgot_password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Preferensi verifikasi keamanan berhasil diperbarui',
            'data' => [
                'require_otp_forgot_password' => (bool)$user->require_otp_forgot_password,
            ],
        ]);
    }
}

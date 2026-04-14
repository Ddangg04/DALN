<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified manually.
     * This handles requests outside the 'auth' middleware to prevent 403 errors.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        // 1. Tìm người dùng theo ID
        $user = User::findOrFail($id);

        // 2. Kiểm tra xem người dùng đã xác thực chưa
        if ($user->hasVerifiedEmail()) {
            // Tự động login nếu chưa login
            if (!Auth::check()) {
                Auth::login($user);
            }
            return redirect()->intended(route('home', absolute: false).'?verified=1');
        }

        // 3. Kiểm tra tính hợp lệ của Hash (Chữ ký email)
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->route('login')->withErrors([
                'email' => 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.',
            ]);
        }

        // 4. Đánh dấu đã xác thực
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 5. Tự động đăng nhập sau khi xác thực thành công
        Auth::login($user);

        return redirect()->intended(route('home', absolute: false).'?verified=1');
    }
}

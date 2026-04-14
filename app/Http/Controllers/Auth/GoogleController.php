<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    /**
     * Redirect to Google login.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle callback from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Lấy email người dùng
            $email = $googleUser->getEmail();

            // Tìm hoặc tạo user mới
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $googleUser->getName(),
                    'password' => bcrypt(Str::random(16)), // tạo mật khẩu random
                    'email_verified_at' => now(), // Tự động xác thực vì Google đã xác nhận
                    'avatar' => $googleUser->getAvatar(), // Lưu ảnh đại diện
                ]
            );

            // Đảm bảo user cũ cũng được verify và update avatar nếu login qua Google
            $updateData = [];
            if (!$user->email_verified_at) {
                $updateData['email_verified_at'] = now();
            }
            if (!$user->avatar || $user->avatar !== $googleUser->getAvatar()) {
                $updateData['avatar'] = $googleUser->getAvatar();
            }

            if (!empty($updateData)) {
                $user->update($updateData);
            }

            // Đăng nhập
            Auth::login($user);

            return redirect()->route('home');
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Đăng nhập Google thất bại. Vui lòng thử lại.',
            ]);
        }
    }
}

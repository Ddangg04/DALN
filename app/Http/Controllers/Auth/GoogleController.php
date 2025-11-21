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

            // ✅ Chỉ cho phép email @st.phenikaa-uni.edu.vn
            if (!Str::endsWith($email, '@st.phenikaa-uni.edu.vn')) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Chỉ chấp nhận tài khoản email trường (@st.phenikaa-uni.edu.vn).',
                ]);
            }

            // Tìm hoặc tạo user mới
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $googleUser->getName(),
                    'password' => bcrypt(Str::random(16)), // tạo mật khẩu random
                ]
            );

            // Đăng nhập
            Auth::login($user);

            return redirect()->route('student.dashboard');
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Đăng nhập Google thất bại. Vui lòng thử lại.',
            ]);
        }
    }
}

<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ProfileController extends Controller
{
    public function index()
    {
        $student = User::with('roles')->find(Auth::id());
        
        return Inertia::render('Student/Profile/Index', [
            'student' => $student,
        ]);
    }

    public function update(Request $request)
    {
        $student = User::findOrFail(Auth::id());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ]);

        $student->update($validated);

        return back()->with('success', 'Cập nhật thông tin thành công!');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

         /** @var User $student */
         $student = Auth::user();

        if (!Hash::check($validated['current_password'], $student->password)) {
            return back()->withErrors(['current_password' => 'Mật khẩu hiện tại không đúng']);
        }
        $student->password = Hash::make($validated['password']);
        $student->save();

        return back()->with('success', 'Đổi mật khẩu thành công!');
    }
}

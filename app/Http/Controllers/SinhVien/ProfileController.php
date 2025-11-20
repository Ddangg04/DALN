<?php
namespace App\Http\Controllers\SinhVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return Inertia::render('SinhVien/Profile/Show', compact('user'));
    }
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $data = $request->validate(['name'=>'required','phone'=>'nullable']);
        $user->update($data);
        return redirect()->back()->with('success','Profile updated');
    }
}

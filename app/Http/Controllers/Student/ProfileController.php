<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Student/Profile', compact('user'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|string|max:255',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (! $user) {
            abort(403);
        }
        $user->name = $data['name'];
        $user->save();

        return back()->with('success','Cập nhật thông tin thành công.');
    }
}

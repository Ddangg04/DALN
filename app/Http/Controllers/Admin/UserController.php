<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Mail\TemporaryPasswordMail; // sẽ tạo phía dưới
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name','like',"%{$search}%")
                  ->orWhere('email','like',"%{$search}%");
            });
        }

        $users = $query->with('roles')->orderByDesc('id')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => Role::pluck('name'),
            'filters' => $request->only('search', 'page'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email','max:255','unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'roles' => ['nullable','array'],
            'roles.*' => ['string', Rule::in(Role::pluck('name')->toArray())],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (!empty($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('admin.users.index')->with('success','Tạo tài khoản thành công.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::pluck('name'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($user->id)],
            'roles' => ['nullable','array'],
            'roles.*' => ['string', Rule::in(Role::pluck('name')->toArray())],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        $user->syncRoles($data['roles'] ?? []);

        return redirect()->route('admin.users.index')->with('success','Cập nhật tài khoản thành công.');
    }

    public function destroy(User $user)
    {
        // prevent deleting self
        if (Auth::id() === $user->id) {
            return back()->with('error','Bạn không thể xoá chính mình.');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success','Xoá tài khoản thành công.');
    }

    public function resetPassword(User $user)
    {
        // generate temporary password
        $temp = Str::random(10) . 'aA1'; // ensure complexity
        $user->password = Hash::make($temp);
        $user->save();

        // send email with temporary password (you can customize)
        Mail::to($user->email)->send(new TemporaryPasswordMail($user, $temp));

        return back()->with('success','Đã đặt lại mật khẩu và gửi email cho người dùng.');
    }

    public function assignRoles(Request $request, User $user)
    {
        $data = $request->validate([
            'roles' => ['nullable','array'],
            'roles.*' => ['string', Rule::in(Role::pluck('name')->toArray())],
        ]);

        $user->syncRoles($data['roles'] ?? []);
        return back()->with('success','Cập nhật vai trò thành công.');
    }
}

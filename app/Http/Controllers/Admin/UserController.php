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
        } else {
            $user->assignRole('user');
        }

        return redirect()->route('admin.users.index')->with('success','Thêm người dùng thành công.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load(['roles', 'activityAreas']),
            'roles' => Role::pluck('name'),
            'activityAreas' => \App\Models\ActivityArea::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $availableRoles = Role::pluck('name')->toArray();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($user->id)],
            'roles' => ['nullable','array'],
            'roles.*' => ['string', Rule::in($availableRoles)],
            'activity_areas' => ['nullable','array'],
            'activity_areas.*' => ['exists:activity_areas,id'],
            'phone' => ['nullable','string','max:30'],
            'address' => ['nullable','string','max:1000'],
            'is_active' => ['nullable','boolean'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? $user->phone,
            'address' => $data['address'] ?? $user->address,
            'is_active' => $data['is_active'] ?? $user->is_active,
        ]);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        if (isset($data['activity_areas'])) {
            $user->activityAreas()->sync($data['activity_areas']);
        }

        return redirect()->route('admin.users.index')->with('success','Cập nhật người dùng thành công.');
    }

    public function destroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return back()->with('error','Bạn không thể xoá chính mình.');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success','Xoá tài khoản thành công.');
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

    public function assignAreas(Request $request, User $user)
    {
        $data = $request->validate([
            'activity_areas' => ['nullable','array'],
            'activity_areas.*' => ['exists:activity_areas,id'],
        ]);

        $user->activityAreas()->sync($data['activity_areas'] ?? []);
        return back()->with('success','Cập nhật khu vực quản lý thành công.');
    }
}

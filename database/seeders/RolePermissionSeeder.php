<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Ví dụ permissions (bạn mở rộng theo bảng chức năng)
        $perms = [
            'manage users',
            'manage academics',
            'manage courses',
            'manage news',
            'view reports',
            'manage class',
            'manage grades',
            'view schedule',
            'register subjects',
            'view scores',
        ];

        foreach ($perms as $p) {
            Permission::firstOrCreate(['name' => $p]);
        }

        // Roles & gán permission
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'manage users',
            'manage academics',
            'manage courses',
            'manage news',
            'view reports',
        ]);

        $teacher = Role::firstOrCreate(['name' => 'teacher']);
        $teacher->givePermissionTo([
            'manage class',
            'manage grades',
            'view schedule',
        ]);

        $head = Role::firstOrCreate(['name' => 'head']);
        $head->givePermissionTo([
            'manage class',
            'manage grades',
            'view schedule',
            'view reports',
        ]);

        $student = Role::firstOrCreate(['name' => 'student']);
        $student->givePermissionTo([
            'register subjects',
            'view schedule',
            'view scores',
        ]);

        $leader = Role::firstOrCreate(['name' => 'leader']);
        $leader->givePermissionTo([
            'view schedule',
            'view scores',
        ]);
    }
}

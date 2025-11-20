<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // load teaching assignments, classes...
        return Inertia::render('Dashboard/Teacher', [
            'user' => $user,
            // 'assignments' => ...
        ]);
    }
}

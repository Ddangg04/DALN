<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    public function requests()
    {
        // load requests pending approval
        return Inertia::render('GiangVien/Faculty/Requests');
    }

    public function reports()
    {
        return Inertia::render('GiangVien/Faculty/Reports');
    }
}

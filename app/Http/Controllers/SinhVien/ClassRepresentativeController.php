<?php
namespace App\Http\Controllers\SinhVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Classroom;
use Illuminate\Support\Facades\Auth;

class ClassRepresentativeController extends Controller
{
    public function roster()
    {
        return Inertia::render('SinhVien/Class/Roster', compact('class'));
    }

    public function notify(Request $request)
    {
        $request->validate(['title'=>'required','body'=>'required']);
        // TODO: save notification to class
        return redirect()->back()->with('success','Notified class');
    }

    public function requests()
    {
        // handle requests from students
        return Inertia::render('SinhVien/Class/Requests');
    }
}

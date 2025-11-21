<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notes = Notification::where('target_type','student')
            ->orWhere('target_id', Auth::id())
            ->latest()->paginate(20);

        return Inertia::render('Student/Notifications/Index', compact('notes'));
    }
}

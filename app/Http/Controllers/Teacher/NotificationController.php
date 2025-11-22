<?php
namespace App\Http\Controllers\GiangVien;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Notification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function index()
    {
        $notifications = Notification::where('sender_id', Auth::id())->latest()->paginate(20);
        return Inertia::render('GiangVien/Notifications/Index', compact('notifications'));
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'title'=>'required|string',
            'body'=>'required|string',
            'target' => 'nullable|array', // e.g. class id or student ids
        ]);
        // TODO: create notification logic (broadcast/email/persist)
        Notification::create(array_merge($data, ['sender_id'=>Auth::id()]));
        return redirect()->back()->with('success','Notification sent');
        return redirect()->back()->with('success','Notification sent');
    }

    public function toClass($classId, Request $request)
    {
        // send to class
        return $this->send($request);
    }
}

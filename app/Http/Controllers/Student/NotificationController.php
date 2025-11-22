<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user();

        $query = Notification::where('user_id', $student->id);

        // Filter by read status
        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->unread();
            } elseif ($request->status === 'read') {
                $query->where('is_read', true);
            }
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $notifications = $query->orderByDesc('created_at')
                              ->paginate(20)
                              ->withQueryString();

        return Inertia::render('Student/Notification/Index', [
            'notifications' => $notifications,
            'filters' => $request->only(['status', 'type']),
            'unreadCount' => Notification::where('user_id', $student->id)->unread()->count(),
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $student = Auth::user();

        if ($notification->user_id !== $student->id) {
            abort(403);
        }

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        $student = Auth::user();

        Notification::where('user_id', $student->id)
                   ->unread()
                   ->update([
                       'is_read' => true,
                       'read_at' => now(),
                   ]);

        return back()->with('success', 'Đã đánh dấu tất cả là đã đọc');
    }
}
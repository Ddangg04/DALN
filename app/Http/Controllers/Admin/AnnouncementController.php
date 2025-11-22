<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Filter by priority
        if ($priority = $request->input('priority')) {
            $query->where('priority', $priority);
        }

        // Filter by pinned
        if ($request->has('is_pinned')) {
            $query->where('is_pinned', $request->boolean('is_pinned'));
        }

        $announcements = $query->with('author')
                              ->orderByDesc('is_pinned')
                              ->orderByDesc('created_at')
                              ->paginate(10)
                              ->withQueryString();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'priority', 'is_pinned']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'priority' => $validated['priority'],
            'is_pinned' => $validated['is_pinned'] ?? false,
            'author_id' => $request->user()->id,
            'published_at' => $validated['published_at'] ?? now(),
        ]);

        return redirect()->route('admin.announcements.index')
                        ->with('success', 'Thông báo đã được tạo thành công!');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement->load('author'),
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $announcement->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'priority' => $validated['priority'],
            'is_pinned' => $validated['is_pinned'] ?? false,
            'published_at' => $validated['published_at'] ?? $announcement->published_at,
        ]);

        return redirect()->route('admin.announcements.index')
                        ->with('success', 'Thông báo đã được cập nhật!');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->route('admin.announcements.index')
                        ->with('success', 'Thông báo đã được xóa!');
    }

    // Toggle pin status
    public function togglePin(Announcement $announcement)
    {
        $announcement->update([
            'is_pinned' => !$announcement->is_pinned,
        ]);

        return back()->with('success', 'Đã cập nhật trạng thái ghim!');
    }
}

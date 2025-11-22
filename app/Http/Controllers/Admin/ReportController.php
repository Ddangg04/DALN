<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::query()->orderByDesc('created_at');

        // Filters
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // paginate, 10 per page (thay nếu cần)
        $reports = $query->paginate(10)->withQueryString();

        // Inertia trả paginator object — frontend đã xử lý được
        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['type','date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Reports/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'notes' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);

        $report = Report::create([
            'type' => $data['type'],
            'data' => [
                'title' => $data['title'],
                'content' => $data['content'] ?? null,
                'notes' => $data['notes'] ?? null,
                'meta' => $data['meta'] ?? [],
            ],
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('admin.reports.index')->with('success','Báo cáo đã được tạo');
    }

    public function show(Report $report)
    {
        return Inertia::render('Admin/Reports/Show', [
            'report' => $report,
        ]);
    }

    public function edit(Report $report)
    {
        return Inertia::render('Admin/Reports/Edit', [
            'report' => $report,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'notes' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);

        $report->update([
            'type' => $data['type'],
            'data' => [
                'title' => $data['title'],
                'content' => $data['content'] ?? null,
                'notes' => $data['notes'] ?? null,
                'meta' => $data['meta'] ?? [],
            ],
        ]);

        return redirect()->route('admin.reports.index')->with('success','Báo cáo đã được cập nhật');
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return back()->with('success','Đã xóa báo cáo');
    }

    // Placeholder: download as PDF
    public function download(Report $report)
    {
        // implement tùy yêu cầu (vd: generate pdf bằng dompdf)
        return back()->with('info','Tính năng download chưa triển khai');
    }

    // Placeholder: export as Excel
    public function export(Report $report)
    {
        // implement export Excel nếu cần
        return back()->with('info','Tính năng export chưa triển khai');
    }
}

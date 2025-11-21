<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Display a listing of reports.
     */
    public function index(Request $request)
    {
        $query = Report::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['type', 'date']),
        ]);
    }

    /**
     * Show the form for creating a new report.
     */
    public function create()
    {
        // Nếu cần dữ liệu phụ (khoa, loại report...) lấy ở đây và truyền sang view
        $types = [
            'users' => 'Người dùng',
            'courses' => 'Học phần',
            'departments' => 'Khoa',
            'statistics' => 'Thống kê hệ thống',
        ];

        return Inertia::render('Admin/Reports/Create', [
            'types' => $types,
        ]);
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:users,courses,departments,statistics',
            'notes' => 'nullable|string',
            // optionally filters for report generation
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        // create DB record
        $report = Report::create([
            'title' => $data['title'],
            'type' => $data['type'],
            'notes' => $data['notes'] ?? null,
            'meta' => $request->only(['date_from','date_to']),
        ]);

        // Generate a simple CSV file as example and store it
        // In real app you'd generate real PDF / Excel using libraries
        $filename = 'reports/' . now()->format('Ymd_His') . '_' . Str::slug($report->title) . '.csv';
        $content = $this->generateReportCsvContent($report);
        Storage::disk('local')->put($filename, $content);

        // save filename to report record
        $report->file_path = $filename;
        $report->save();

        return redirect()->route('admin.reports.index')->with('success', 'Báo cáo đã được tạo.');
    }

    /**
     * Display the specified report.
     */
    public function show(Report $report)
    {
        // return report detail page (also preview)
        return Inertia::render('Admin/Reports/Show', [
            'report' => $report,
        ]);
    }

    /**
     * Download report file (CSV/PDF) from storage.
     */
    public function download(Report $report)
    {
        if (! $report->file_path || ! Storage::exists($report->file_path)) {
            return redirect()->back()->with('error', 'File báo cáo không tồn tại.');
        }

        return Storage::download($report->file_path, basename($report->file_path));
    }

    /**
     * Export as Excel (simple CSV streamed response).
     * You can replace with real Excel generation (Maatwebsite\Excel) if needed.
     */
    public function export(Report $report)
    {
        // If file exists, stream it. Otherwise generate on the fly.
        $filename = $report->file_path ?? ('reports/' . Str::slug($report->title) . '.csv');

        if (Storage::exists($filename)) {
            $stream = Storage::readStream($filename);
            return response()->stream(function () use ($stream) {
                fpassthru($stream);
            }, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="'.basename($filename).'"',
            ]);
        }

        // fallback: generate CSV string
        $content = $this->generateReportCsvContent($report);

        return response($content, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.Str::slug($report->title).'.csv"',
        ]);
    }

    /**
     * Show the form for editing the specified report.
     */
    public function edit(Report $report)
    {
        $types = [
            'users' => 'Người dùng',
            'courses' => 'Học phần',
            'departments' => 'Khoa',
            'statistics' => 'Thống kê hệ thống',
        ];

        return Inertia::render('Admin/Reports/Edit', [
            'report' => $report,
            'types' => $types,
        ]);
    }

    /**
     * Update the specified report in storage.
     */
    public function update(Request $request, Report $report)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:users,courses,departments,statistics',
            'notes' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $report->update([
            'title' => $data['title'],
            'type' => $data['type'],
            'notes' => $data['notes'] ?? null,
            'meta' => $request->only(['date_from','date_to']),
        ]);

        // optionally regenerate file if needed
        if ($request->boolean('regenerate_file')) {
            if ($report->file_path && Storage::exists($report->file_path)) {
                Storage::delete($report->file_path);
            }
            $filename = 'reports/' . now()->format('Ymd_His') . '_' . Str::slug($report->title) . '.csv';
            Storage::put($filename, $this->generateReportCsvContent($report));
            $report->file_path = $filename;
            $report->save();
        }

        return redirect()->route('admin.reports.index')->with('success', 'Cập nhật báo cáo thành công.');
    }

    /**
     * Remove the specified report from storage.
     */
    public function destroy(Report $report)
    {
        // remove stored file if any
        if ($report->file_path && Storage::exists($report->file_path)) {
            Storage::delete($report->file_path);
        }

        $report->delete();

        return redirect()->route('admin.reports.index')->with('success', 'Xóa báo cáo thành công.');
    }

    /**
     * A simple helper to build CSV content for the sample report.
     * Replace with real data generation logic.
     */
    protected function generateReportCsvContent(Report $report): string
    {
        // Simple header + single row demo. In real app, query & build rows.
        $headers = ['ID', 'Title', 'Type', 'Notes', 'Created At'];
        $rows = [
            [
                $report->id ?? 'n/a',
                $report->title ?? '',
                $report->type ?? '',
                $report->notes ?? '',
                now()->toDateTimeString(),
            ],
        ];

        $out = fopen('php://memory', 'r+');
        fputcsv($out, $headers);
        foreach ($rows as $row) {
            fputcsv($out, $row);
        }
        rewind($out);
        $csv = stream_get_contents($out);
        fclose($out);

        return $csv;
    }
}

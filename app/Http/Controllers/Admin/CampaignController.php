<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $query = Campaign::query()->withCount('donations');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $campaigns = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Campaigns/Index', [
            'campaigns' => $campaigns,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Campaigns/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'target_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,completed,closed',
            'image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        $validated['raised_amount'] = 0;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('campaigns', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        Campaign::create($validated);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Chiến dịch đã được tạo thành công.');
    }

    public function edit(Campaign $campaign)
    {
        return Inertia::render('Admin/Campaigns/Edit', [
            'campaign' => $campaign
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'target_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,completed,closed',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($campaign->image_url && !Str::startsWith($campaign->image_url, 'http')) {
                $oldPath = str_replace('/storage/', '', $campaign->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('image')->store('campaigns', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $campaign->update($validated);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Chiến dịch đã được cập nhật.');
    }

    public function destroy(Campaign $campaign)
    {
        if ($campaign->image_url && !Str::startsWith($campaign->image_url, 'http')) {
            $oldPath = str_replace('/storage/', '', $campaign->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $campaign->delete();

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Chiến dịch đã được xóa.');
    }
}

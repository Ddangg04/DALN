<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Statement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $query = Campaign::query()->withCount('donations')->withSum('donations', 'amount');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $campaigns = $query->orderByDesc('id')->paginate(9)->withQueryString();

        return Inertia::render('Campaigns/Index', [
            'campaigns' => $campaigns,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function show(Campaign $campaign)
    {
        $campaign->load(['donations' => function ($q) {
            $q->where('status', 'completed')
              ->latest()
              ->with('user:id,name')
              ->limit(10);
        }, 'statements' => function($q) {
            $q->latest()->limit(20);
        }]);

        $campaign->loadCount('donations');
        $campaign->loadSum(['donations' => fn($q) => $q->where('status', 'completed')], 'amount');

        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign,
        ]);
    }

    public function donate(Request $request, Campaign $campaign)
    {
        $request->validate([
            'amount' => 'required|integer|min:10000',
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'required|email',
            'message' => 'nullable|string|max:1000',
            'is_anonymous' => 'boolean',
            'payment_method' => 'required|in:bank_transfer,momo,vnpay',
        ]);

        $donation = Donation::create([
            'campaign_id' => $campaign->id,
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'donor_name' => $request->is_anonymous ? 'Nhà hảo tâm ẩn danh' : $request->donor_name,
            'donor_email' => $request->donor_email,
            'message' => $request->message,
            'is_anonymous' => $request->boolean('is_anonymous'),
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'transaction_id' => 'VNH-' . strtoupper(uniqid()),
        ]);

        // Simulate auto-completion for demo
        $donation->update(['status' => 'completed']);

        // Update raised amount
        $campaign->update([
            'raised_amount' => $campaign->donations()->where('status', 'completed')->sum('amount'),
        ]);

        // Create a transparency statement record
        Statement::create([
            'transaction_date' => now(),
            'amount' => $donation->amount,
            'content' => "Ủng hộ từ " . ($donation->is_anonymous ? "Nhà hảo tâm ẩn danh" : $donation->donor_name),
            'account_name' => $donation->is_anonymous ? "NHA HAO TAM AN DANH" : strtoupper($donation->donor_name),
            'type' => 'in',
            'campaign_id' => $campaign->id,
            'transaction_id' => $donation->transaction_id
        ]);

        return redirect()->route('campaigns.show', $campaign)
            ->with('success', 'Cảm ơn bạn đã quyên góp! Hành động nhỏ của bạn tạo ra sự thay đổi lớn.');
    }
}

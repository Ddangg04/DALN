<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\News;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // ========== BASIC STATISTICS ==========
        $totalUsers = User::count();
        $adminCount = User::role('admin')->count();
        $donorCount = User::role('donor')->count();
        $volunteerCount = User::role('volunteer')->count();
        $requesterCount = User::role('requester')->count();
        $managerCount = User::role('area_manager')->count();

        $totalCampaigns = Campaign::count();
        $totalDonationsCount = Donation::count();
        $totalRaised = Campaign::sum('raised_amount');
        $totalNews = News::count();

        // ========== DONATION TREND (Last 15 days) ==========
        $donationTrend = Donation::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as total')
            )
            ->where('created_at', '>=', now()->subDays(15))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // ========== TOP CAMPAIGNS ==========
        $topCampaigns = Campaign::orderByDesc('raised_amount')
            ->take(5)
            ->get()
            ->map(function($c) {
                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'raised' => (float)$c->raised_amount,
                    'target' => (float)$c->target_amount,
                    'progress' => $c->target_amount > 0 ? round(($c->raised_amount / $c->target_amount) * 100, 1) : 0,
                ];
            });

        // ========== RECENT DONATIONS ==========
        $recentDonations = Donation::with(['user', 'campaign'])
            ->orderByDesc('created_at')
            ->take(6)
            ->get()
            ->map(function($d) {
                return [
                    'id' => $d->id,
                    'donor' => $d->donor_name ?: ($d->user ? $d->user->name : 'Ẩn danh'),
                    'campaign' => $d->campaign ? $d->campaign->title : 'Chiến dịch đã xóa',
                    'amount' => (float)$d->amount,
                    'time' => $d->created_at->diffForHumans(),
                    'method' => $d->payment_method,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'admins' => $adminCount,
                'donors' => $donorCount,
                'volunteers' => $volunteerCount,
                'requesters' => $requesterCount,
                'managers' => $managerCount,
                'campaigns' => $totalCampaigns,
                'donations' => $totalDonationsCount,
                'total_raised' => (float)$totalRaised,
                'news' => $totalNews,
            ],
            'donationTrend' => $donationTrend,
            'topCampaigns' => $topCampaigns,
            'recentDonations' => $recentDonations,
            'recentUsers' => User::orderByDesc('created_at')->take(5)->get(),
        ]);
    }
}

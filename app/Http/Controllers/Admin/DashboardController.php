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
        // ========== USER STATISTICS BY ROLE ==========
        $adminCount = User::role('admin')->count();
        $donorCount = User::role('donor')->count();
        $volunteerCount = User::role('volunteer')->count();
        $requesterCount = User::role('requester')->count();
        $totalUsers = User::count();

        // ========== CHARITY STATISTICS ==========
        $totalCampaigns = Campaign::count();
        $totalDonations = Donation::count();
        $totalNews = News::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'admins' => $adminCount,
                'donors' => $donorCount,
                'volunteers' => $volunteerCount,
                'requesters' => $requesterCount,
                
                'campaigns' => $totalCampaigns,
                'donations' => $totalDonations,
                'news' => $totalNews,
            ],
            'recentUsers' => User::orderByDesc('created_at')->take(5)->get(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $query = Donation::query()->with(['user:id,name,email', 'campaign:id,title']);

        if ($search = $request->input('search')) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('campaign', function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $donations = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Donations/Index', [
            'donations' => $donations,
            'filters' => $request->only('search', 'status'),
        ]);
    }
}

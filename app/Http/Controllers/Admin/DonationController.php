<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Statement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $query = Donation::query()->with(['user:id,name,email', 'campaign:id,title']);

        // Handle Trashed status
        if ($request->input('status') === 'trashed') {
            $query->onlyTrashed();
        }

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('campaign', function($sq) use ($search) {
                    $sq->where('title', 'like', "%{$search}%");
                })->orWhere('transaction_id', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status !== 'trashed') {
                $query->where('status', $status);
            }
        }

        $donations = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Donations/Index', [
            'donations' => $donations,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function destroy(Donation $donation)
    {
        if ($donation->status === 'completed' && $donation->campaign) {
            $donation->campaign->decrement('raised_amount', $donation->amount);
        }

        // Sync with Statement
        if ($donation->transaction_id) {
            Statement::where('transaction_id', $donation->transaction_id)->delete();
        }

        $donation->delete();

        return redirect()->back()->with('success', 'Đã chuyển quyên góp vào thùng rác.');
    }

    public function restore($id)
    {
        $donation = Donation::withTrashed()->findOrFail($id);
        
        if ($donation->status === 'completed' && $donation->campaign) {
            $donation->campaign->increment('raised_amount', $donation->amount);
        }

        // Sync with Statement
        if ($donation->transaction_id) {
            Statement::withTrashed()->where('transaction_id', $donation->transaction_id)->restore();
        }

        $donation->restore();

        return redirect()->back()->with('success', 'Đã khôi phục quyên góp thành công.');
    }

    public function forceDelete($id)
    {
        $donation = Donation::withTrashed()->findOrFail($id);
        
        // Sync with Statement (Force Delete)
        if ($donation->transaction_id) {
            Statement::withTrashed()->where('transaction_id', $donation->transaction_id)->forceDelete();
        }

        $donation->forceDelete();

        return redirect()->back()->with('success', 'Đã xóa vĩnh viễn quyên góp.');
    }
}

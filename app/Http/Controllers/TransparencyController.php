<?php

namespace App\Http\Controllers;

use App\Models\Statement;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransparencyController extends Controller
{
    public function index(Request $request)
    {
        $query = Statement::query()->with('campaign:id,title');

        if ($campaignId = $request->input('campaign_id')) {
            $query->where('campaign_id', $campaignId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                  ->orWhere('account_name', 'like', "%{$search}%")
                  ->orWhere('transaction_id', 'like', "%{$search}%");
            });
        }

        $statements = $query->orderByDesc('transaction_date')->paginate(20)->withQueryString();

        $campaigns = Campaign::select('id', 'title')->get();

        // Statistics for the top of the page
        $totalIn = Statement::where('type', 'in')->sum('amount');
        $totalOut = abs(Statement::where('type', 'out')->sum('amount'));
        $balance = $totalIn - $totalOut;

        return Inertia::render('Transparency/Index', [
            'statements' => $statements,
            'campaigns' => $campaigns,
            'filters' => $request->only('campaign_id', 'type', 'search'),
            'stats' => [
                'total_in' => $totalIn,
                'total_out' => $totalOut,
                'balance' => $balance
            ]
        ]);
    }
}

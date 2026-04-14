<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::where('status', 'published')->latest()->paginate(9);
        return Inertia::render('News/Index', [
            'news' => $news
        ]);
    }

    public function show(News $news)
    {
        if ($news->status !== 'published') {
            abort(404);
        }
        return Inertia::render('News/Show', [
            'news' => $news
        ]);
    }
}

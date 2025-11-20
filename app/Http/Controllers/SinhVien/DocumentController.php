<?php
namespace App\Http\Controllers\SinhVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $docs = Document::paginate(20);
        return Inertia::render('SinhVien/Documents/Index', compact('docs'));
    }

    public function download($id)
    {
        $doc = Document::findOrFail($id);
        return response()->download(storage_path("app/{$doc->path}"), $doc->title);
    }
}

<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function index()
    {
        $docs = Document::where('owner_type','giang-vien')->paginate(20);
        return Inertia::render('GiangVien/Documents/Index', compact('docs'));
    }

    public function upload(Request $request)
    {
        $request->validate(['file'=>'required|file']);
        $path = $request->file('file')->store('documents');
        $doc = Document::create([
            'title' => $request->input('title') ?? $request->file('file')->getClientOriginalName(),
            'path' => $path,
            'owner_id' => Auth::id(),
            'owner_type' => 'giang-vien'
        ]);
        return redirect()->back()->with('success','Uploaded');
    }

    public function destroy($id)
    {
        $doc = Document::findOrFail($id);
        Storage::delete($doc->path);
        $doc->delete();
        return redirect()->back()->with('success','Deleted');
    }
}

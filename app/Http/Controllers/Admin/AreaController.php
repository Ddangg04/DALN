<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityArea;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index()
    {
        $areas = ActivityArea::with('ward.district.province')->latest()->get();
        return Inertia::render('Admin/Areas/Index', [
            'areas' => $areas,
        ]);
    }

    public function create()
    {
        $provinces = Province::orderBy('name')->get();
        return Inertia::render('Admin/Areas/Form', [
            'provinces' => $provinces,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ward_id' => 'required|exists:wards,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        ActivityArea::create($validated);

        return redirect()->route('admin.areas.index')->with('success', 'Khu vực đã được tạo thành công.');
    }

    public function edit(ActivityArea $area)
    {
        $area->load('ward.district.province');
        $provinces = Province::orderBy('name')->get();
        
        // Load districts of the current province
        $districts = District::where('province_id', $area->ward->district->province_id)->orderBy('name')->get();
        
        // Load wards of the current district
        $wards = Ward::where('district_id', $area->ward->district_id)->orderBy('name')->get();

        return Inertia::render('Admin/Areas/Form', [
            'area' => $area,
            'provinces' => $provinces,
            'districts' => $districts,
            'wards' => $wards,
        ]);
    }

    public function update(Request $request, ActivityArea $area)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ward_id' => 'required|exists:wards,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $area->update($validated);

        return redirect()->route('admin.areas.index')->with('success', 'Cập nhật khu vực thành công.');
    }

    public function destroy(ActivityArea $area)
    {
        $area->delete();
        return redirect()->back()->with('success', 'Xóa khu vực thành công.');
    }

    // API methods for dynamic selection
    public function getDistricts(Province $province)
    {
        return response()->json($province->districts()->orderBy('name')->get());
    }

    public function getWards(District $district)
    {
        return response()->json($district->wards()->orderBy('name')->get());
    }
}

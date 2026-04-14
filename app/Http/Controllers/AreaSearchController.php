<?php

namespace App\Http\Controllers;

use App\Models\ActivityArea;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;
use App\Models\User;
use Illuminate\Http\Request;

class AreaSearchController extends Controller
{
    /**
     * Search for area managers based on the location.
     */
    public function searchManagers(Request $request)
    {
        $wardId = $request->query('ward_id');
        $districtId = $request->query('district_id');
        $provinceId = $request->query('province_id');

        $query = ActivityArea::query();

        if ($wardId) {
            // If ward is selected, show all managers in the same district as similarity
            $ward = Ward::find($wardId);
            if ($ward) {
                $query->whereHas('ward', function($q) use ($ward) {
                    $q->where('district_id', $ward->district_id);
                });
            }
        } elseif ($districtId) {
            // Show all managers in the district
            $query->whereHas('ward', function($q) use ($districtId) {
                $q->where('district_id', $districtId);
            });
        } elseif ($provinceId) {
            // Show all managers in the province
            $query->whereHas('ward.district', function($q) use ($provinceId) {
                $q->where('province_id', $provinceId);
            });
        }

        $areas = $query->with(['managers' => function($q) {
            $q->where('is_active', true);
        }, 'ward.district.province'])->get();

        // Extract and flatten managers
        $managers = $areas->flatMap(function($area) {
            return $area->managers->map(function($user) use ($area) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'area_name' => $area->name,
                    'location' => "{$area->ward->name}, {$area->ward->district->name}, {$area->ward->district->province->name}",
                ];
            });
        })->unique('id')->values();

        return response()->json([
            'managers' => $managers,
            'areas' => $areas->map(fn($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'lat' => $a->latitude,
                'lng' => $a->longitude,
            ])
        ]);
    }

    public function getProvinces()
    {
        return response()->json(Province::orderBy('name')->get());
    }

    public function getDistricts(Province $province)
    {
        return response()->json($province->districts()->orderBy('name')->get());
    }

    public function getWards(District $district)
    {
        return response()->json($district->wards()->orderBy('name')->get());
    }
}

import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Save, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} draggable={true} eventHandlers={{
            dragend: (e) => {
                setPosition(e.target.getLatLng());
            }
        }} />
    );
}

// Helper component to center map when position changes from outside
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function AreaForm({ provinces, districts: initialDistricts, wards: initialWards, area = null }) {
    const isEditing = !!area;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: area?.name || "",
        province_id: area?.ward?.district?.province_id || "",
        district_id: area?.ward?.district_id || "",
        ward_id: area?.ward_id || "",
        latitude: area?.latitude || 21.0285, // Default to Hanoi
        longitude: area?.longitude || 105.8542,
        description: area?.description || "",
    });

    const [districts, setDistricts] = useState(initialDistricts || []);
    const [wards, setWards] = useState(initialWards || []);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [mapPosition, setMapPosition] = useState({ lat: data.latitude, lng: data.longitude });

    const handleProvinceChange = async (e) => {
        const id = e.target.value;
        setData({ ...data, province_id: id, district_id: "", ward_id: "" });
        setDistricts([]);
        setWards([]);
        
        if (id) {
            setLoadingDistricts(true);
            try {
                const response = await axios.get(route('admin.provinces.districts', id));
                setDistricts(response.data);
            } catch (error) {
                console.error("Error fetching districts", error);
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const id = e.target.value;
        setData({ ...data, district_id: id, ward_id: "" });
        setWards([]);

        if (id) {
            setLoadingWards(true);
            try {
                const response = await axios.get(route('admin.districts.wards', id));
                setWards(response.data);
            } catch (error) {
                console.error("Error fetching wards", error);
            } finally {
                setLoadingWards(false);
            }
        }
    };

    const handlePositionChange = (latlng) => {
        setMapPosition(latlng);
        setData(prev => ({
            ...prev,
            latitude: latlng.lat,
            longitude: latlng.lng
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.areas.update", area.id));
        } else {
            post(route("admin.areas.store"));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("admin.areas.index")} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditing ? `✏️ Chỉnh sửa: ${area.name}` : "🆕 Thêm Khu vực mới"}
                    </h2>
                </div>
            }
        >
            <Head title={isEditing ? "Sửa khu vực" : "Thêm khu vực"} />

            <div className="py-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Form Fields */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Thông tin cơ bản</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Điểm hoạt động / Khu vực <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Ví dụ: Điểm hỗ trợ Kim Mã"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                                    placeholder="Mô tả vị trí hoặc mục đích hoạt động..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Vị trí Hành chính</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                                    <select
                                        value={data.province_id}
                                        onChange={handleProvinceChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                    >
                                        <option value="">Chọn Tỉnh</option>
                                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        Quận/Huyện {loadingDistricts && <Loader2 size={14} className="animate-spin text-rose-500" />}
                                    </label>
                                    <select
                                        value={data.district_id}
                                        onChange={handleDistrictChange}
                                        disabled={!data.province_id || loadingDistricts}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                    >
                                        <option value="">Chọn Huyện</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        Xã/Phường {loadingWards && <Loader2 size={14} className="animate-spin text-rose-500" />}
                                    </label>
                                    <select
                                        value={data.ward_id}
                                        onChange={e => setData('ward_id', e.target.value)}
                                        disabled={!data.district_id || loadingWards}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 ${errors.ward_id ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <option value="">Chọn Xã</option>
                                        {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                    {errors.ward_id && <p className="mt-1 text-xs text-red-500">{errors.ward_id}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-rose-200 flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {isEditing ? "Cập nhật Khu vực" : "Lưu Khu vực"}
                            </button>
                            <Link
                                href={route("admin.areas.index")}
                                className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Hủy bỏ
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Map Selection */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <MapPin className="text-rose-500" /> Xác định vị trí trên Bản đồ
                            </h3>
                            
                            <div className="h-[430px] rounded-lg overflow-hidden border border-gray-200 z-0">
                                <MapContainer center={[data.latitude, data.longitude]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <ChangeView center={mapPosition} />
                                    <LocationMarker position={mapPosition} setPosition={handlePositionChange} />
                                </MapContainer>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Vĩ độ (Latitude)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={e => handlePositionChange({ lat: parseFloat(e.target.value), lng: data.longitude })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Kinh độ (Longitude)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={e => handlePositionChange({ lat: data.latitude, lng: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2 italic">* Click vào bản đồ hoặc kéo thả Ghim để lấy tọa độ chính xác.</p>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

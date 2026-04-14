import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MapPin, Plus, Edit, Trash2, Search, Map as MapIcon } from "lucide-react";

export default function AreasIndex({ areas }) {
    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa khu vực này? Tất cả liên kết với chiến dịch sẽ bị gỡ bỏ.")) {
            router.delete(route("admin.areas.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MapIcon className="text-rose-500" /> Quản lý Khu vực Hoạt động
                    </h2>
                    <Link
                        href={route("admin.areas.create")}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-rose-200"
                    >
                        <Plus size={20} /> Thêm khu vực mới
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý khu vực" />

            <div className="py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Tên khu vực
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Vị trí hành chính
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Tọa độ
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {areas.length > 0 ? (
                                    areas.map((area) => (
                                        <tr key={area.id} className="hover:bg-rose-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{area.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-xs">{area.description || 'Không có mô tả'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">
                                                    {area.ward.name}
                                                </div>
                                                <div className="text-xs text-gray-500 italic">
                                                    {area.ward.district.name}, {area.ward.district.province.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {area.latitude && area.longitude ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {parseFloat(area.latitude).toFixed(4)}, {parseFloat(area.longitude).toFixed(4)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Chưa đặt tọa độ</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={route("admin.areas.edit", area.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(area.id)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                            Chưa có khu vực nào được tạo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

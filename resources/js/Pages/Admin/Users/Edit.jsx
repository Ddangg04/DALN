import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EditUser({ user, roles, activityAreas }) {
    // Collect user's assigned roles (names)
    const currentRoles = user.roles ? user.roles.map(r => r.name) : [];
    const currentAreas = user.activity_areas ? user.activity_areas.map(a => a.id) : [];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        roles: currentRoles,
        activity_areas: currentAreas,
        phone: user.phone || "",
        address: user.address || "",
        is_active: user.is_active === undefined ? true : !!user.is_active,
    });

    const handleRoleToggle = (roleName) => {
        if (data.roles.includes(roleName)) {
            setData("roles", data.roles.filter(r => r !== roleName));
        } else {
            setData("roles", [...data.roles, roleName]);
        }
    };

    const handleAreaToggle = (areaId) => {
        if (data.activity_areas.includes(areaId)) {
            setData("activity_areas", data.activity_areas.filter(id => id !== areaId));
        } else {
            setData("activity_areas", [...data.activity_areas, areaId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", user.id), {
            preserveScroll: true,
        });
    };

    // Role mapping for display
    const translateRole = (r) => {
        const map = {
            admin: "Quản trị viên",
            user: "Người dùng (Cơ bản)",
            donor: "Nhà hảo tâm",
            volunteer: "Tình nguyện viên",
            requester: "Người kêu gọi",
            area_manager: "Quản lý khu vực"
        };
        return map[r] || r;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Sửa thông tin tài khoản
                    </h2>
                    <Link
                        href={route("admin.users.index")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Sửa người dùng" />

            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Thông tin cơ bản */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Thông tin tài khoản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block mt-8 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                            className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                                        />
                                        <span className="ml-2 font-medium text-gray-700">Kích hoạt tài khoản</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    rows={2}
                                    className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                ></textarea>
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Phân quyền */}
                        <div className="pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Cấp quyền đặc biệt (Role)
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Một người dùng có thể nhận nhiều quyền cùng lúc.</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {roles.map(role => (
                                    <label key={role} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${data.roles.includes(role) ? 'bg-rose-50 border-rose-200' : 'hover:bg-gray-50'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.roles.includes(role)}
                                            onChange={() => handleRoleToggle(role)}
                                            className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                                        />
                                        <span className="ml-3 font-medium text-gray-800">
                                            {translateRole(role)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <p className="mt-2 text-sm text-red-600">{errors.roles}</p>}
                        </div>

                        {/* Quản lý Khu vực (Chỉ hiện nếu là Area Manager) */}
                        {data.roles.includes('area_manager') && (
                            <div className="pt-4 animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                    Khu vực Quản lý
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 text-rose-600 font-medium">⚠️ Tài khoản này là Quản lý khu vực. Vui lòng chọn địa bàn phụ trách:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activityAreas && activityAreas.map(area => (
                                        <label key={area.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${data.activity_areas.includes(area.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                                            <input
                                                type="checkbox"
                                                checked={data.activity_areas.includes(area.id)}
                                                onChange={() => handleAreaToggle(area.id)}
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <div className="font-bold text-gray-800">{area.name}</div>
                                                <div className="text-xs text-gray-500 italic">{area.description || 'Không có mô tả'}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {activityAreas && activityAreas.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">Chưa có khu vực hoạt động nào được tạo trong hệ thống.</p>
                                )}
                                {errors.activity_areas && <p className="mt-2 text-sm text-red-600">{errors.activity_areas}</p>}
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route("admin.users.index")}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                            >
                                Hủy bỏ
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-lg font-semibold shadow"
                            >
                                {processing ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CreateUser({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: ["user"], // Default to base user role
    });

    const handleRoleToggle = (roleName) => {
        if (data.roles.includes(roleName)) {
            setData("roles", data.roles.filter(r => r !== roleName));
        } else {
            setData("roles", [...data.roles, roleName]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.users.store"), {
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
                    <h2 className="text-xl font-bold text-gray-800">
                        Thêm tài khoản mới
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
            <Head title="Thêm tài khoản" />

            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Thông tin cơ bản */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Thông tin đăng nhập
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
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhập lại mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phân quyền */}
                        <div className="pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Thiết lập Vai trò (Role)
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
                                {processing ? "Đang tạo..." : "Tạo tài khoản"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

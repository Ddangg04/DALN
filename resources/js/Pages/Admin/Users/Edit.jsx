import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EditUser({ user, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        user_code: user.user_code || "",
        role: user.role || "student",
        department_id: user.department_id || "",
        phone: user.phone || "",
        address: user.address || "",
        is_active: user.is_active || false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chỉnh sửa Người dùng
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
            <Head title="Chỉnh sửa người dùng" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Thông tin cơ bản */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin cơ bản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        placeholder="Nhập họ và tên"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã số{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.user_code}
                                        onChange={(e) =>
                                            setData("user_code", e.target.value)
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.user_code
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        placeholder="Mã sinh viên / Mã giảng viên"
                                    />
                                    {errors.user_code && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.user_code}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.phone
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        placeholder="0123456789"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vai trò và phân quyền */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Vai trò và phân quyền
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vai trò{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.role
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    >
                                        <option value="student">
                                            Sinh viên
                                        </option>
                                        <option value="teacher">
                                            Giảng viên
                                        </option>
                                        <option value="admin">
                                            Quản trị viên
                                        </option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Khoa
                                    </label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) =>
                                            setData(
                                                "department_id",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 border ${
                                            errors.department_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    >
                                        <option value="">
                                            -- Chọn khoa --
                                        </option>
                                        {departments?.map((dept) => (
                                            <option
                                                key={dept.id}
                                                value={dept.id}
                                            >
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.department_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin khác
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    rows={3}
                                    className={`w-full px-4 py-2 border ${
                                        errors.address
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    placeholder="Nhập địa chỉ"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Kích hoạt tài khoản
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Note about password */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-yellow-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Để thay đổi mật khẩu, vui lòng sử dụng
                                        chức năng "Reset mật khẩu" trong danh
                                        sách người dùng.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route("admin.users.index")}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            >
                                Hủy
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {processing ? "Đang xử lý..." : "Cập nhật"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

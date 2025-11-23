import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CreateDepartment() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.departments.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Thêm Khoa Mới
                    </h2>
                    <Link
                        href={route("admin.departments.index")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Thêm khoa" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên khoa <span className="text-red-500">*</span>
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
                                placeholder="Ví dụ: Công nghệ thông tin"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã khoa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className={`w-full px-4 py-2 border ${
                                    errors.code
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Ví dụ: CNTT"
                            />
                            {errors.code && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className={`w-full px-4 py-2 border ${
                                    errors.description
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Mô tả về khoa..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Kích hoạt khoa
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route("admin.departments.index")}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            >
                                Hủy
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {processing ? "Đang xử lý..." : "Tạo khoa"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

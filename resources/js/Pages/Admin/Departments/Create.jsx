import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CoursesCreate({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        name: "",
        description: "",
        credits: 3,
        type: "elective",
        is_active: true,
        department_id: "",
        max_students: "",
        semester: "",
        year: new Date().getFullYear(),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.courses.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Thêm Học phần mới
                    </h2>
                    <Link
                        href={route("admin.courses.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Thêm học phần" />

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            📚 Thông tin cơ bản
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã học phần{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData(
                                            "code",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
                                    placeholder="VD: CS101"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            {/* Credits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số tín chỉ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.credits}
                                    onChange={(e) =>
                                        setData(
                                            "credits",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    min="1"
                                    max="10"
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.credits && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.credits}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên học phần{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="VD: Lập trình hướng đối tượng"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập mô tả về học phần..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Classification Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            🏷️ Phân loại
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Khoa
                                </label>
                                <select
                                    value={data.department_id}
                                    onChange={(e) =>
                                        setData("department_id", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Chọn khoa --</option>
                                    {departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
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

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại học phần{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="elective">Tự chọn</option>
                                    <option value="required">Bắt buộc</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.type}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Capacity Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            📅 Lịch học & Sức chứa
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Học kỳ
                                </label>
                                <select
                                    value={data.semester}
                                    onChange={(e) =>
                                        setData("semester", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Chọn học kỳ --</option>
                                    <option value="Fall">Fall (Mùa thu)</option>
                                    <option value="Spring">
                                        Spring (Mùa xuân)
                                    </option>
                                    <option value="Summer">
                                        Summer (Mùa hè)
                                    </option>
                                </select>
                                {errors.semester && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.semester}
                                    </p>
                                )}
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Năm học
                                </label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={(e) =>
                                        setData(
                                            "year",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    min="2020"
                                    max="2100"
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.year && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.year}
                                    </p>
                                )}
                            </div>

                            {/* Max Students */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số SV tối đa
                                </label>
                                <input
                                    type="number"
                                    value={data.max_students}
                                    onChange={(e) =>
                                        setData("max_students", e.target.value)
                                    }
                                    min="1"
                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="VD: 50"
                                />
                                {errors.max_students && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.max_students}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            ⚙️ Trạng thái
                        </h3>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="is_active"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Kích hoạt học phần (sinh viên có thể đăng ký)
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Link
                            href={route("admin.courses.index")}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {processing ? "Đang lưu..." : "Tạo học phần"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

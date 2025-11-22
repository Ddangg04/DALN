import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CoursesIndex({ courses, departments, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? "");
    const [departmentId, setDepartmentId] = useState(
        filters?.department_id ?? ""
    );
    const [type, setType] = useState(filters?.type ?? "");
    const [isActive, setIsActive] = useState(filters?.is_active ?? "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.courses.index"),
            {
                search,
                department_id: departmentId,
                type,
                is_active: isActive,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setDepartmentId("");
        setType("");
        setIsActive("");
        router.get(route("admin.courses.index"));
    };

    const handleDelete = (courseId, courseName) => {
        if (confirm(`Bạn có chắc chắn muốn xóa học phần "${courseName}"?`)) {
            router.delete(route("admin.courses.destroy", courseId), {
                preserveScroll: true,
            });
        }
    };

    const toggleActive = (courseId) => {
        router.post(
            route("admin.courses.toggle-active", courseId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const rows = Array.isArray(courses?.data) ? courses.data : [];

    const hasFilters = search || departmentId || type || isActive;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Quản lý Học phần
                    </h2>
                    <Link
                        href={route("admin.courses.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Thêm học phần
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý học phần" />

            {/* Success Message */}
            {flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {flash.success}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tên học phần, mã học phần..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khoa
                            </label>
                            <select
                                value={departmentId}
                                onChange={(e) =>
                                    setDepartmentId(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tất cả khoa</option>
                                {Array.isArray(departments) &&
                                    departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tất cả</option>
                                <option value="required">Bắt buộc</option>
                                <option value="elective">Tự chọn</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Status Filter */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">
                                Trạng thái:
                            </label>
                            <select
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tất cả</option>
                                <option value="1">Hoạt động</option>
                                <option value="0">Ngừng</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                🔍 Tìm kiếm
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Tổng học phần</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {courses?.total || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Đang hiển thị</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {rows.length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Bắt buộc</div>
                    <div className="text-2xl font-bold text-red-600">
                        {rows.filter((c) => c.type === "required").length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Tự chọn</div>
                    <div className="text-2xl font-bold text-green-600">
                        {rows.filter((c) => c.type === "elective").length}
                    </div>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Học phần
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã HP
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khoa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tín chỉ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="py-12 text-center text-gray-500"
                                    >
                                        <div className="text-4xl mb-2">📚</div>
                                        <div className="text-lg">
                                            Chưa có học phần
                                        </div>
                                        {hasFilters && (
                                            <button
                                                onClick={handleReset}
                                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                Xóa bộ lọc để xem tất cả
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                rows.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {course.name}
                                            </div>
                                            {course.description && (
                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                    {course.description}
                                                </div>
                                            )}
                                            {course.semester && course.year && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {course.semester}{" "}
                                                    {course.year}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-mono font-semibold">
                                                {course.code}
                                            </div>
                                            {course.max_students && (
                                                <div className="text-xs text-gray-500">
                                                    Max: {course.max_students}{" "}
                                                    SV
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {course.department?.name ?? (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-semibold">
                                                {course.credits ?? "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    course.type === "required"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {course.type === "required"
                                                    ? "Bắt buộc"
                                                    : "Tự chọn"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    toggleActive(course.id)
                                                }
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                                                    course.is_active
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                }`}
                                            >
                                                {course.is_active
                                                    ? "Hoạt động"
                                                    : "Ngừng"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.courses.edit",
                                                        course.id
                                                    )}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            course.id,
                                                            course.name
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {courses?.links && courses.links.length > 3 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị{" "}
                                    <span className="font-medium">
                                        {courses.from}
                                    </span>{" "}
                                    đến{" "}
                                    <span className="font-medium">
                                        {courses.to}
                                    </span>{" "}
                                    trong tổng số{" "}
                                    <span className="font-medium">
                                        {courses.total}
                                    </span>{" "}
                                    kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    {courses.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            preserveState
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                            } ${
                                                index === 0
                                                    ? "rounded-l-md"
                                                    : ""
                                            } ${
                                                index ===
                                                courses.links.length - 1
                                                    ? "rounded-r-md"
                                                    : ""
                                            } ${
                                                !link.url
                                                    ? "cursor-not-allowed opacity-50"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Mobile pagination */}
                        <div className="flex-1 flex justify-between sm:hidden">
                            {courses.prev_page_url && (
                                <Link
                                    href={courses.prev_page_url}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Trước
                                </Link>
                            )}
                            {courses.next_page_url && (
                                <Link
                                    href={courses.next_page_url}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Sau
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

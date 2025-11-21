// resources/js/Pages/Admin/Courses/Index.jsx
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CoursesIndex({
    courses = { data: [], links: [], from: 0, to: 0, total: 0 },
    departments = [],
    filters = {},
}) {
    // safe defaults nếu server không gửi filters
    const [search, setSearch] = useState(filters?.search ?? "");
    const [departmentId, setDepartmentId] = useState(
        filters?.department_id ?? ""
    );

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.courses.index"),
            { search, department_id: departmentId },
            { preserveState: true }
        );
    };

    const handleDelete = (courseId) => {
        if (confirm("Bạn có chắc chắn muốn xóa học phần này?")) {
            router.delete(route("admin.courses.destroy", courseId));
        }
    };

    // helper: safely map courses.data
    const rows = Array.isArray(courses?.data) ? courses.data : [];

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

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
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

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </form>
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
                                        className="py-6 text-center text-gray-500"
                                    >
                                        Chưa có học phần
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
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-mono">
                                                {course.code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {course.department?.name ?? "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
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
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    course.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {course.is_active
                                                    ? "Hoạt động"
                                                    : "Ngừng"}
                                            </span>
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
                                                        handleDelete(course.id)
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
                {courses?.links && Array.isArray(courses.links) && (
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
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* mobile simple prev/next */}
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

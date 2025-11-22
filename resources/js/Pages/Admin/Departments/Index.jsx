import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function DepartmentsIndex({ departments, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.departments.index"),
            { search, status },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDelete = (deptId, deptName) => {
        if (
            confirm(
                `Bạn có chắc chắn muốn xóa khoa "${deptName}"? Hành động này không thể hoàn tác!`
            )
        ) {
            router.delete(route("admin.departments.destroy", deptId), {
                onSuccess: () => {
                    alert("Xóa khoa thành công!");
                },
                onError: () => {
                    alert("Có lỗi xảy ra khi xóa khoa!");
                },
            });
        }
    };

    const toggleStatus = (deptId, currentStatus) => {
        if (
            confirm(
                `Bạn có muốn ${
                    currentStatus ? "vô hiệu hóa" : "kích hoạt"
                } khoa này?`
            )
        ) {
            router.patch(
                route("admin.departments.toggle-status", deptId),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        router.get(route("admin.departments.index"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Quản lý Khoa
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Quản lý thông tin các khoa trong trường
                        </p>
                    </div>
                    <Link
                        href={route("admin.departments.create")}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Thêm khoa
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý khoa" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">
                                Tổng số khoa
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments?.total || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">
                                Đang hoạt động
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments?.data?.filter((d) => d.is_active)
                                    .length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Tạm ngừng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments?.data?.filter((d) => !d.is_active)
                                    .length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">
                                Tổng giảng viên
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments?.data?.reduce(
                                    (sum, d) => sum + (d.teachers_count || 0),
                                    0
                                ) || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm theo tên khoa, mã khoa..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tất cả</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ngừng</option>
                            </select>
                        </div>

                        <div className="flex items-end space-x-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Departments Grid */}
            {departments.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {departments.data.map((dept) => (
                            <div
                                key={dept.id}
                                className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                                                    {dept.code}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                toggleStatus(
                                                    dept.id,
                                                    dept.is_active
                                                )
                                            }
                                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                                dept.is_active
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                            }`}
                                        >
                                            {dept.is_active
                                                ? "Hoạt động"
                                                : "Tạm ngừng"}
                                        </button>
                                    </div>

                                    {/* Department Name */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                                        {dept.name}
                                    </h3>

                                    {/* Description */}
                                    {dept.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                                            {dept.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Giảng viên
                                            </p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {dept.teachers_count || 0}
                                            </p>
                                        </div>
                                        <div className="text-center border-x border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Sinh viên
                                            </p>
                                            <p className="text-lg font-bold text-green-600">
                                                {dept.students_count || 0}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Học phần
                                            </p>
                                            <p className="text-lg font-bold text-purple-600">
                                                {dept.courses_count || 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Department Head */}
                                    {dept.head && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Trưởng khoa
                                            </p>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                                                    {dept.head.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {dept.head.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {dept.head.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Meta Info */}
                                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Ngày tạo:{" "}
                                            {new Date(
                                                dept.created_at
                                            ).toLocaleDateString("vi-VN")}
                                        </div>
                                        {dept.updated_at &&
                                            dept.created_at !==
                                                dept.updated_at && (
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                    Cập nhật:{" "}
                                                    {new Date(
                                                        dept.updated_at
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between space-x-2 pt-4 border-t border-gray-100">
                                        <Link
                                            href={route(
                                                "admin.departments.index",
                                                dept.id
                                            )}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            Xem
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.departments.edit",
                                                dept.id
                                            )}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(dept.id, dept.name)
                                            }
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            title="Xóa"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {departments.links && departments.links.length > 3 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {departments.prev_page_url && (
                                        <Link
                                            href={departments.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Trước
                                        </Link>
                                    )}
                                    {departments.next_page_url && (
                                        <Link
                                            href={departments.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Sau
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Hiển thị{" "}
                                            <span className="font-medium">
                                                {departments.from}
                                            </span>{" "}
                                            -{" "}
                                            <span className="font-medium">
                                                {departments.to}
                                            </span>{" "}
                                            trong tổng số{" "}
                                            <span className="font-medium">
                                                {departments.total}
                                            </span>{" "}
                                            khoa
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {departments.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        preserveScroll
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
                                                            departments.links
                                                                .length -
                                                                1
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
                                                )
                                            )}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy khoa nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {search || status
                            ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn"
                            : "Chưa có khoa nào được tạo"}
                    </p>
                    {search || status ? (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    ) : (
                        <Link
                            href={route("admin.departments.create")}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Thêm khoa đầu tiên
                        </Link>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}

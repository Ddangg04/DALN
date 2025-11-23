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
            { search, department_id: departmentId, type, is_active: isActive },
            { preserveState: true, replace: true }
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
        if (!confirm(`Bạn có chắc chắn muốn xóa học phần "${courseName}"?`))
            return;
        router.delete(route("admin.courses.destroy", courseId), {
            preserveScroll: true,
        });
    };

    const toggleActive = (courseId) => {
        router.post(
            route("admin.courses.toggle-active", courseId),
            {},
            { preserveScroll: true }
        );
    };

    const rows = Array.isArray(courses?.data) ? courses.data : [];
    const hasFilters = Boolean(search || departmentId || type || isActive);

    const formatMoney = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        try {
            return new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
        } catch {
            return value;
        }
    };

    const getDayAbbreviation = (day) => {
        const map = {
            Monday: "T2",
            Tuesday: "T3",
            Wednesday: "T4",
            Thursday: "T5",
            Friday: "T6",
            Saturday: "T7",
            Sunday: "CN",
        };
        return map[day] || day;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            📚 Quản lý Học phần
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Quản lý thông tin học phần, lớp học và lịch giảng
                            dạy
                        </p>
                    </div>
                    <Link
                        href={route("admin.courses.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        ➕ Thêm học phần
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý học phần" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-green-500 text-2xl mr-3">✅</div>
                        <p className="text-green-800 font-medium">
                            {flash.success}
                        </p>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="text-red-500 text-2xl mr-3">❌</div>
                        <p className="text-red-800 font-medium">
                            {flash.error}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <form onSubmit={handleSearch} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="🔍 Tìm kiếm tên, mã học phần..."
                                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
                            />
                        </div>

                        {/* Department */}
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
                        >
                            <option value="">Tất cả khoa</option>
                            {Array.isArray(departments) &&
                                departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                        </select>

                        {/* Type */}
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
                        >
                            <option value="">Tất cả loại</option>
                            <option value="required">Bắt buộc</option>
                            <option value="elective">Tự chọn</option>
                        </select>

                        {/* Status */}
                        <select
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value)}
                            className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="0">Ngừng</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                🔍 Tìm kiếm
                            </button>
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    ✖️ Xóa bộ lọc
                                </button>
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            Hiển thị{" "}
                            <span className="font-semibold">
                                {courses?.from ?? 0}
                            </span>{" "}
                            -{" "}
                            <span className="font-semibold">
                                {courses?.to ?? 0}
                            </span>{" "}
                            /{" "}
                            <span className="font-semibold">
                                {courses?.total ?? 0}
                            </span>{" "}
                            kết quả
                        </div>
                    </div>
                </form>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Tổng học phần</div>
                    <div className="text-3xl font-bold">
                        {courses?.total ?? 0}
                    </div>
                    <div className="text-xs opacity-75 mt-2">
                        📚 Toàn hệ thống
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Đang hiển thị</div>
                    <div className="text-3xl font-bold">{rows.length}</div>
                    <div className="text-xs opacity-75 mt-2">
                        📋 Trang hiện tại
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Bắt buộc</div>
                    <div className="text-3xl font-bold">
                        {rows.filter((c) => c.type === "required").length}
                    </div>
                    <div className="text-xs opacity-75 mt-2">⚠️ Required</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Tự chọn</div>
                    <div className="text-3xl font-bold">
                        {rows.filter((c) => c.type === "elective").length}
                    </div>
                    <div className="text-xs opacity-75 mt-2">🎯 Elective</div>
                </div>
            </div>

            {/* Courses List */}
            <div className="space-y-6">
                {rows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Không tìm thấy học phần nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {hasFilters
                                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                                : "Hãy thêm học phần đầu tiên"}
                        </p>
                        {hasFilters ? (
                            <button
                                onClick={handleReset}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        ) : (
                            <Link
                                href={route("admin.courses.create")}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                ➕ Thêm học phần mới
                            </Link>
                        )}
                    </div>
                ) : (
                    rows.map((course) => {
                        const sessions = Array.isArray(course.class_sessions)
                            ? course.class_sessions
                            : Array.isArray(course.classSessions)
                            ? course.classSessions
                            : [];

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-6">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {course.name}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        course.type ===
                                                        "required"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }`}
                                                >
                                                    {course.type === "required"
                                                        ? "⚠️ Bắt buộc"
                                                        : "🎯 Tự chọn"}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        course.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {course.is_active
                                                        ? "✅ Hoạt động"
                                                        : "⏸️ Ngừng"}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                <div>{course.code}</div>
                                                <div>•</div>
                                                <div>
                                                    {course.credits ?? "-"} tín
                                                    chỉ
                                                </div>
                                                {course.department?.name && (
                                                    <>
                                                        <div>•</div>
                                                        <div>
                                                            {
                                                                course
                                                                    .department
                                                                    .name
                                                            }
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {course.description && (
                                                <p className="mt-3 text-sm text-gray-700">
                                                    {course.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-sm text-gray-500">
                                                Học phí
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {formatMoney(course.tuition)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {course.semester
                                                    ? `${course.semester} ${
                                                          course.year ?? ""
                                                      }`
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Left: Class sessions */}
                                        <div className="md:col-span-2">
                                            <div className="text-sm font-medium text-gray-700 mb-3">
                                                Lớp (Class sessions)
                                            </div>

                                            {sessions.length === 0 ? (
                                                <div className="text-sm text-gray-500">
                                                    Chưa có lớp (class session)
                                                    cho học phần này.
                                                </div>
                                            ) : (
                                                sessions.map((session) => {
                                                    const teacherName =
                                                        session?.teacher
                                                            ?.name ??
                                                        session?.teacher_name ??
                                                        "Chưa phân công";
                                                    const enrolledCount =
                                                        session?.enrolled_count ??
                                                        session?.active_enrollments_count ??
                                                        0;
                                                    const maxStudents =
                                                        session?.max_students ??
                                                        course?.max_students ??
                                                        "—";
                                                    const schedules =
                                                        Array.isArray(
                                                            session?.schedules
                                                        )
                                                            ? session.schedules
                                                            : [];

                                                    return (
                                                        <div
                                                            key={
                                                                session.id ??
                                                                `${
                                                                    course.id
                                                                }-sess-${Math.random()}`
                                                            }
                                                            className="p-4 border rounded-lg mb-4"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="text-sm font-semibold">
                                                                            {session?.class_code ??
                                                                                "—"}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            GV:{" "}
                                                                            {
                                                                                teacherName
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            Sĩ
                                                                            số:{" "}
                                                                            {
                                                                                enrolledCount
                                                                            }
                                                                            /
                                                                            {
                                                                                maxStudents
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-3 text-sm text-gray-600 space-y-2">
                                                                        {schedules.length ===
                                                                        0 ? (
                                                                            <div className="text-sm text-gray-500">
                                                                                Chưa
                                                                                có
                                                                                lịch
                                                                                dạy
                                                                                cho
                                                                                lớp
                                                                                này.
                                                                            </div>
                                                                        ) : (
                                                                            schedules.map(
                                                                                (
                                                                                    sch
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            sch.id ??
                                                                                            `${session.id}-${sch.day_of_week}-${sch.start_time}`
                                                                                        }
                                                                                        className="flex items-center space-x-3"
                                                                                    >
                                                                                        <div className="text-xs text-gray-500 w-20">
                                                                                            {getDayAbbreviation(
                                                                                                sch.day_of_week
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="text-xs">
                                                                                            {(
                                                                                                sch.start_time ||
                                                                                                ""
                                                                                            ).substring(
                                                                                                0,
                                                                                                5
                                                                                            )}{" "}
                                                                                            -{" "}
                                                                                            {(
                                                                                                sch.end_time ||
                                                                                                ""
                                                                                            ).substring(
                                                                                                0,
                                                                                                5
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-400 ml-2">
                                                                                            {sch.room ??
                                                                                                ""}
                                                                                            {sch.building
                                                                                                ? ` • ${sch.building}`
                                                                                                : ""}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="text-right">
                                                                    <div className="text-xs text-gray-400">
                                                                        Trạng
                                                                        thái lớp
                                                                    </div>
                                                                    <div className="text-sm font-medium">
                                                                        {session?.status ===
                                                                        "active"
                                                                            ? "Hoạt động"
                                                                            : session?.status ??
                                                                              "—"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Right: Actions & meta */}
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 border border-gray-100 p-4 rounded">
                                                <div className="text-sm text-gray-600">
                                                    Sĩ số mặc định
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {course.max_students ?? "—"}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-4 rounded">
                                                <div className="text-sm text-gray-600">
                                                    Ngày tạo
                                                </div>
                                                <div className="text-sm">
                                                    {course.created_at
                                                        ? new Date(
                                                              course.created_at
                                                          ).toLocaleString()
                                                        : "—"}
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() =>
                                                        toggleActive(course.id)
                                                    }
                                                    className={`w-full px-4 py-2 rounded text-sm font-semibold ${
                                                        course.is_active
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {course.is_active
                                                        ? "✅ Hoạt động"
                                                        : "⏸️ Ngừng"}
                                                </button>

                                                <Link
                                                    href={route(
                                                        "admin.courses.edit",
                                                        course.id
                                                    )}
                                                    className="w-full text-center text-blue-600 hover:text-blue-900 block px-4 py-2 border rounded"
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
                                                    className="w-full text-center text-red-600 hover:text-red-900 block px-4 py-2 border rounded"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                {courses?.links && courses.links.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-md shadow">
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
                )}
            </div>
        </AuthenticatedLayout>
    );
}

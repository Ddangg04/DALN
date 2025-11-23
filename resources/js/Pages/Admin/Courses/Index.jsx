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
        if (!value && value !== 0) return "—";
        try {
            return new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
        } catch {
            return value;
        }
    };

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

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {flash.error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tên học phần, mã học phần..."
                            className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                        />
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                        >
                            <option value="">Tất cả khoa</option>
                            {Array.isArray(departments) &&
                                departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                        </select>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                        >
                            <option value="">Tất cả loại</option>
                            <option value="required">Bắt buộc</option>
                            <option value="elective">Tự chọn</option>
                        </select>
                        <div className="flex items-center space-x-2">
                            <select
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="1">Hoạt động</option>
                                <option value="0">Ngừng</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                                🔍 Tìm kiếm
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-sm text-gray-600 underline"
                            >
                                Xóa bộ lọc
                            </button>
                        ) : (
                            <div />
                        )}
                        <div className="text-sm text-gray-500">
                            Hiển thị {courses?.from ?? 0} - {courses?.to ?? 0} /{" "}
                            {courses?.total ?? 0}
                        </div>
                    </div>
                </form>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Tổng học phần</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {courses?.total ?? 0}
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

            {/* Courses list */}
            <div className="grid grid-cols-1 gap-6">
                {rows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        <div className="text-4xl mb-2">📚</div>
                        <div className="text-lg">Chưa có học phần</div>
                    </div>
                ) : (
                    rows.map((course) => {
                        // Accept both snake_case and camelCase from backend
                        const sessions = Array.isArray(course.class_sessions)
                            ? course.class_sessions
                            : Array.isArray(course.classSessions)
                            ? course.classSessions
                            : [];

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 pr-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xl font-semibold text-gray-900">
                                                    {course.name}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {course.code} •{" "}
                                                    {course.credits ?? "-"} tín
                                                    chỉ
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">
                                                    Học phí
                                                </div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {formatMoney(
                                                        course.tuition
                                                    )}
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

                                        {course.description && (
                                            <p className="mt-4 text-sm text-gray-600">
                                                {course.description}
                                            </p>
                                        )}

                                        <div className="mt-4">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                Lớp (Class sessions)
                                            </div>

                                            {sessions.length === 0 ? (
                                                <div className="text-sm text-gray-500">
                                                    Chưa có lớp (class session)
                                                    cho học phần này.
                                                </div>
                                            ) : (
                                                sessions.map((session) => {
                                                    // protect missing nested objects
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
                                                                }-${Math.random()}`
                                                            }
                                                            className="p-3 border rounded flex items-start justify-between mb-3"
                                                        >
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
                                                                        Sĩ số:{" "}
                                                                        {
                                                                            enrolledCount
                                                                        }
                                                                        /
                                                                        {
                                                                            maxStudents
                                                                        }
                                                                    </div>
                                                                </div>

                                                                {schedules.length >
                                                                    0 && (
                                                                    <div className="mt-2 text-sm text-gray-600">
                                                                        {schedules.map(
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
                                                                                    <div className="text-xs text-gray-500 w-28">
                                                                                        {
                                                                                            sch.day_of_week
                                                                                        }
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
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="text-xs text-gray-400">
                                                                    Trạng thái
                                                                    lớp
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
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-48 flex flex-col items-end space-y-3">
                                        <button
                                            onClick={() =>
                                                toggleActive(course.id)
                                            }
                                            className={`px-3 py-2 rounded text-sm font-semibold ${
                                                course.is_active
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {course.is_active
                                                ? "Hoạt động"
                                                : "Ngừng"}
                                        </button>

                                        <div className="text-right">
                                            <Link
                                                href={route(
                                                    "admin.courses.edit",
                                                    course.id
                                                )}
                                                className="text-blue-600 hover:text-blue-900 block mb-2"
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

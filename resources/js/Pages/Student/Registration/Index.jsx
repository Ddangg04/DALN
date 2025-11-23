import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

/**
 * Student Registration Index Page (Inertia + React)
 * - Bảo vệ null checks (tránh crash khi relation bị null)
 * - Hiển thị lại course khi enrollment status = 'dropped' (backend phải filter đúng)
 * - Xử lý tìm kiếm / filter / pagination
 */

export default function RegistrationIndex({
    availableCourses,
    myEnrollments,
    departments,
    filters,
}) {
    const { flash } = usePage().props;

    // Filters state
    const [search, setSearch] = useState(filters?.search || "");
    const [departmentId, setDepartmentId] = useState(
        filters?.department_id || ""
    );
    const [type, setType] = useState(filters?.type || "");
    const [activeTab, setActiveTab] = useState("available");

    // Tìm kiếm / lọc
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("student.registration.index"),
            { search, department_id: departmentId, type },
            { preserveState: true, replace: true }
        );
    };

    // Đăng ký học phần
    const handleEnroll = (courseId) => {
        if (!confirm("Bạn có chắc chắn muốn đăng ký học phần này?")) return;

        // Gọi API tạo enrollment
        router.post(
            route("student.registration.store"),
            { course_id: courseId },
            {
                onError: (errors) => {
                    // optional: bạn có thể xử lý error cụ thể ở đây
                    console.error(errors);
                },
            }
        );
    };

    // Hủy đăng ký
    const handleDrop = (enrollmentId) => {
        if (!confirm("Bạn có chắc chắn muốn hủy đăng ký?")) return;

        router.delete(route("student.registration.destroy", enrollmentId), {
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    // Badge cho trạng thái enrollment
    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                class: "bg-yellow-100 text-yellow-800",
                label: "Chờ duyệt",
            },
            approved: {
                class: "bg-green-100 text-green-800",
                label: "Đã duyệt",
            },
            rejected: { class: "bg-red-100 text-red-800", label: "Từ chối" },
            dropped: { class: "bg-gray-100 text-gray-800", label: "Đã hủy" },
        };
        return badges[status] || badges.pending;
    };

    // Helper safe: trả về mảng courses nếu có, hoặc []
    const availableList = availableCourses?.data || [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    📝 Đăng ký Học phần
                </h2>
            }
        >
            <Head title="Đăng ký học phần" />

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

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("available")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "available"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Học phần có thể đăng ký
                    </button>
                    <button
                        onClick={() => setActiveTab("enrolled")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "enrolled"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Học phần đã đăng ký ({myEnrollments?.length || 0})
                    </button>
                </nav>
            </div>

            {/* Available Courses Tab */}
            {activeTab === "available" && (
                <>
                    {/* Search & Filters */}
                    <div className="bg-white rounded-lg shadow mb-6 p-6">
                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm kiếm học phần..."
                                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                />
                                <select
                                    value={departmentId}
                                    onChange={(e) =>
                                        setDepartmentId(e.target.value)
                                    }
                                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                >
                                    <option value="">Tất cả khoa</option>
                                    {departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                >
                                    <option value="">Tất cả loại</option>
                                    <option value="required">Bắt buộc</option>
                                    <option value="elective">Tự chọn</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableList.length === 0 ? (
                            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Không có học phần phù hợp.
                            </div>
                        ) : (
                            availableList.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-mono text-sm font-bold text-gray-700">
                                                {course.code || "—"}
                                            </span>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    course.type === "required"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {course.type === "required"
                                                    ? "Bắt buộc"
                                                    : "Tự chọn"}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {course.name || "—"}
                                        </h3>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Khoa:
                                                </span>
                                                <span>
                                                    {course.department?.name ||
                                                        "—"}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Tín chỉ:
                                                </span>
                                                <span>
                                                    {course.credits ?? "—"}
                                                </span>
                                            </div>
                                            {course.max_students && (
                                                <div className="flex items-center">
                                                    <span className="font-medium w-24">
                                                        Sĩ số:
                                                    </span>
                                                    <span>
                                                        {course.enrolled_students_count ??
                                                            0}
                                                        /{course.max_students}
                                                    </span>
                                                </div>
                                            )}
                                            {course.schedules &&
                                                course.schedules.length > 0 && (
                                                    <div className="flex items-center">
                                                        <span className="font-medium w-24">
                                                            Lịch học:
                                                        </span>
                                                        <span className="text-xs">
                                                            {
                                                                course
                                                                    .schedules[0]
                                                                    .day_of_week
                                                            }
                                                            ,{" "}
                                                            {
                                                                course
                                                                    .schedules[0]
                                                                    .start_time
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleEnroll(course.id)
                                            }
                                            disabled={course.is_full}
                                            className={`w-full py-2 rounded-lg font-medium transition-colors ${
                                                course.is_full
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                        >
                                            {course.is_full
                                                ? "Đã đầy"
                                                : "Đăng ký"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {availableCourses?.links &&
                        Array.isArray(availableCourses.links) &&
                        availableCourses.links.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    {availableCourses.links.map(
                                        (link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                preserveState
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )
                                    )}
                                </nav>
                            </div>
                        )}
                </>
            )}

            {/* Enrolled Courses Tab */}
            {activeTab === "enrolled" && (
                <div className="space-y-4">
                    {!myEnrollments || myEnrollments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                            <div className="text-4xl mb-4">📚</div>
                            <p className="text-lg">
                                Bạn chưa đăng ký học phần nào
                            </p>
                        </div>
                    ) : (
                        myEnrollments.map((enrollment) => {
                            // Kiểm tra an toàn relation course
                            const course = enrollment?.course || null;
                            const badge = getStatusBadge(enrollment.status);

                            return (
                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="font-mono text-sm font-bold text-gray-700">
                                                        {course ? (
                                                            course.code
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                [Khoá học đã
                                                                xóa]
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {course ? course.name : "—"}
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        Khoa:{" "}
                                                        {course?.department
                                                            ?.name || "—"}
                                                    </div>
                                                    <div>
                                                        Tín chỉ:{" "}
                                                        {course?.credits ?? "—"}
                                                    </div>
                                                    {course?.schedules &&
                                                        course.schedules
                                                            .length > 0 && (
                                                            <>
                                                                <div>
                                                                    Lịch:{" "}
                                                                    {
                                                                        course
                                                                            .schedules[0]
                                                                            .day_of_week
                                                                    }
                                                                </div>
                                                                <div>
                                                                    Phòng:{" "}
                                                                    {course
                                                                        .schedules[0]
                                                                        .room ||
                                                                        "—"}
                                                                </div>
                                                            </>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                {/* Chỉ hiển thị nút hủy khi course tồn tại và trạng thái phù hợp */}
                                                {(enrollment.status ===
                                                    "pending" ||
                                                    enrollment.status ===
                                                        "approved") &&
                                                    course && (
                                                        <button
                                                            onClick={() =>
                                                                handleDrop(
                                                                    enrollment.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                        >
                                                            Hủy đăng ký
                                                        </button>
                                                    )}

                                                {/* Nếu course đã bị xóa, show note */}
                                                {!course && (
                                                    <div className="text-sm text-gray-500">
                                                        Khoá học không còn tồn
                                                        tại
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}

import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AttendanceClassList({ classes, filters }) {
    const [status, setStatus] = useState(filters?.status || "");
    const [semester, setSemester] = useState(filters?.semester || "");

    const handleFilter = () => {
        router.get(
            route("teacher.attendance.list"),
            { status, semester },
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            open: { class: "bg-blue-100 text-blue-800", label: "Mở" },
            in_progress: {
                class: "bg-green-100 text-green-800",
                label: "Đang dạy",
            },
        };
        return badges[status] || badges.open;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    📋 Điểm danh - Chọn lớp
                </h2>
            }
        >
            <Head title="Điểm danh" />

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex items-center">
                    <div className="text-blue-700 mr-3">ℹ️</div>
                    <div className="text-sm text-blue-700">
                        Chọn lớp học để bắt đầu điểm danh sinh viên
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="open">Mở</option>
                        <option value="in_progress">Đang dạy</option>
                    </select>

                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả học kỳ</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!classes?.data || classes.data.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-lg">
                            Không có lớp nào đang hoạt động
                        </p>
                    </div>
                ) : (
                    classes.data.map((classSession) => {
                        const badge = getStatusBadge(classSession.status);

                        return (
                            <div
                                key={classSession.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {classSession.class_code}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {classSession.course.name}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Mã môn:
                                            </span>
                                            <span className="font-semibold font-mono">
                                                {classSession.course.code}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Khoa:
                                            </span>
                                            <span className="font-semibold">
                                                {classSession.course.department
                                                    ?.name || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Sinh viên:
                                            </span>
                                            <span className="font-semibold text-blue-600">
                                                {classSession.enrolled_count}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Học kỳ:
                                            </span>
                                            <span className="font-semibold">
                                                {classSession.semester}{" "}
                                                {classSession.year}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route(
                                            "teacher.attendance.index",
                                            classSession.id
                                        )}
                                        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-4 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        ✅ Điểm danh lớp này
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {classes?.links && classes.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        {classes.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                className={`px-4 py-2 border text-sm ${
                                    link.active
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } ${index === 0 ? "rounded-l-md" : ""} ${
                                    index === classes.links.length - 1
                                        ? "rounded-r-md"
                                        : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">
                        Tổng số lớp
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                        {classes?.total || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">
                        Đang hiển thị
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                        {classes?.data?.length || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">
                        Ngày hôm nay
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                        {new Date().toLocaleDateString("vi-VN")}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

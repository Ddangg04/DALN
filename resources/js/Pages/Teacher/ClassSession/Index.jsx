// resources/js/Pages/Teacher/ClassSession/Index.jsx
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ClassSessionIndex({ classes, filters }) {
    const [status, setStatus] = useState(filters?.status || "");
    const [semester, setSemester] = useState(filters?.semester || "");

    const handleFilter = () => {
        router.get(
            route("teacher.classes.index"),
            { status, semester },
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            open: { class: "bg-blue-100 text-blue-800", label: "Mở" },
            closed: { class: "bg-gray-100 text-gray-800", label: "Đóng" },
            in_progress: {
                class: "bg-green-100 text-green-800",
                label: "Đang dạy",
            },
            completed: {
                class: "bg-purple-100 text-purple-800",
                label: "Hoàn thành",
            },
        };
        return badges[status] || badges.open;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold">📚 Quản lý Lớp học phần</h2>
            }
        >
            <Head title="Quản lý lớp" />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border-gray-300 rounded-lg"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="open">Mở</option>
                        <option value="in_progress">Đang dạy</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="closed">Đóng</option>
                    </select>

                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="border-gray-300 rounded-lg"
                    >
                        <option value="">Tất cả học kỳ</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes?.data?.map((classSession) => {
                    const badge = getStatusBadge(classSession.status);
                    const progress =
                        (classSession.enrolled_count /
                            classSession.max_students) *
                        100;

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

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Sinh viên:
                                        </span>
                                        <span className="font-semibold">
                                            {classSession.enrolled_count}/
                                            {classSession.max_students}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Học kỳ:
                                        </span>
                                        <span className="font-semibold">
                                            {classSession.semester}{" "}
                                            {classSession.year}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={route(
                                            "teacher.classes.show",
                                            classSession.id
                                        )}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-center px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Chi tiết
                                    </Link>
                                    <Link
                                        href={route(
                                            "teacher.classes.students",
                                            classSession.id
                                        )}
                                        className="bg-green-600 hover:bg-green-700 text-white text-center px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Sinh viên
                                    </Link>
                                    <Link
                                        href={route(
                                            "teacher.attendance.index",
                                            classSession.id
                                        )}
                                        className="bg-purple-600 hover:bg-purple-700 text-white text-center px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Điểm danh
                                    </Link>
                                    <Link
                                        href={route(
                                            "teacher.grades.index",
                                            classSession.id
                                        )}
                                        className="bg-orange-600 hover:bg-orange-700 text-white text-center px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Nhập điểm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
                                        : "bg-white border-gray-300 text-gray-500"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

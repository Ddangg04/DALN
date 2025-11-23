import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ClassSessionShow({ classSession, students }) {
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

    const badge = getStatusBadge(classSession.status);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chi tiết Lớp - {classSession.class_code}
                    </h2>
                    <Link
                        href={route("teacher.classes.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title={`Lớp ${classSession.class_code}`} />

            {/* Class Info Card */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {classSession.class_code}
                        </h3>
                        <p className="text-lg text-gray-600">
                            {classSession.course.name}
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${badge.class}`}
                    >
                        {badge.label}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">
                            Mã học phần
                        </div>
                        <div className="font-semibold font-mono">
                            {classSession.course.code}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Khoa</div>
                        <div className="font-semibold">
                            {classSession.course.department?.name || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Học kỳ</div>
                        <div className="font-semibold">
                            {classSession.semester} {classSession.year}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">
                            Tín chỉ
                        </div>
                        <div className="font-semibold">
                            {classSession.course.credits}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            Tỷ lệ lấp đầy lớp:
                        </span>
                        <span className="font-semibold">
                            {classSession.enrolled_count}/
                            {classSession.max_students}
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{
                                width: `${
                                    (classSession.enrolled_count /
                                        classSession.max_students) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Schedule */}
            {classSession.schedules && classSession.schedules.length > 0 && (
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        📅 Lịch học
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {classSession.schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded"
                            >
                                <div className="font-semibold text-gray-900">
                                    {schedule.day_of_week}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {schedule.start_time} - {schedule.end_time}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    📍 Phòng: {schedule.room}
                                    {schedule.building &&
                                        ` - ${schedule.building}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link
                    href={route("teacher.classes.students", classSession.id)}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all text-center"
                >
                    <div className="text-4xl mb-2">👥</div>
                    <div className="font-semibold">Danh sách sinh viên</div>
                    <div className="text-sm text-blue-100 mt-1">
                        {classSession.enrolled_count} sinh viên
                    </div>
                </Link>

                <Link
                    href={route("teacher.attendance.index", classSession.id)}
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all text-center"
                >
                    <div className="text-4xl mb-2">✅</div>
                    <div className="font-semibold">Điểm danh</div>
                    <div className="text-sm text-green-100 mt-1">
                        Ghi nhận điểm danh
                    </div>
                </Link>

                <Link
                    href={route("teacher.grades.index", classSession.id)}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all text-center"
                >
                    <div className="text-4xl mb-2">📊</div>
                    <div className="font-semibold">Quản lý điểm</div>
                    <div className="text-sm text-orange-100 mt-1">
                        Nhập và xuất điểm
                    </div>
                </Link>

                <Link
                    href={route("teacher.assignments.index", {
                        course_id: classSession.course_id,
                    })}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all text-center"
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="font-semibold">Bài tập</div>
                    <div className="text-sm text-purple-100 mt-1">
                        Quản lý bài tập
                    </div>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

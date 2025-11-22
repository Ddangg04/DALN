import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function TeacherDashboard({
    stats,
    todaySchedule,
    recentClasses,
    pendingGrading,
}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        👨‍🏫 Dashboard - Giảng viên
                    </h2>
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Teacher Dashboard" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Link
                    href={route("teacher.classes.index")}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.totalClasses || 0}
                    </div>
                    <div className="text-blue-100">Tổng số lớp</div>
                </Link>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.activeClasses || 0}
                    </div>
                    <div className="text-green-100">Lớp đang dạy</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.totalStudents || 0}
                    </div>
                    <div className="text-purple-100">Tổng sinh viên</div>
                </div>

                <Link
                    href={route("teacher.assignments.index")}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.pendingAssignments || 0}
                    </div>
                    <div className="text-orange-100">Bài chờ chấm</div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Today's Classes */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📅 Lịch dạy hôm nay
                        </h3>
                        <Link
                            href={route("teacher.schedule.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tuần →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!todaySchedule || todaySchedule.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🎉</div>
                                <p>Hôm nay không có lịch dạy!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todaySchedule.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="border-l-4 border-green-500 bg-green-50 p-4 rounded"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {schedule.course.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {schedule.course.code} •{" "}
                                                    {schedule.room}
                                                </p>
                                                {schedule.class_session && (
                                                    <p className="text-sm text-gray-500">
                                                        Lớp:{" "}
                                                        {
                                                            schedule
                                                                .class_session
                                                                .class_code
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {schedule.start_time} -{" "}
                                                    {schedule.end_time}
                                                </div>
                                                {schedule.class_session && (
                                                    <Link
                                                        href={route(
                                                            "teacher.classes.show",
                                                            schedule
                                                                .class_session
                                                                .id
                                                        )}
                                                        className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                                                    >
                                                        Vào lớp →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Classes */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📚 Lớp học gần đây
                        </h3>
                        <Link
                            href={route("teacher.classes.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!recentClasses || recentClasses.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có lớp học
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentClasses.map((classSession) => (
                                    <Link
                                        key={classSession.id}
                                        href={route(
                                            "teacher.classes.show",
                                            classSession.id
                                        )}
                                        className="block border-l-4 border-blue-500 bg-blue-50 p-4 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {classSession.class_code}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {classSession.course.name}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                                    <span>
                                                        👥{" "}
                                                        {
                                                            classSession.enrolled_count
                                                        }
                                                        /
                                                        {
                                                            classSession.max_students
                                                        }
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {classSession.semester}{" "}
                                                        {classSession.year}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    classSession.status ===
                                                    "in_progress"
                                                        ? "bg-green-100 text-green-800"
                                                        : classSession.status ===
                                                          "open"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {classSession.status ===
                                                "in_progress"
                                                    ? "Đang dạy"
                                                    : classSession.status ===
                                                      "open"
                                                    ? "Mở"
                                                    : classSession.status ===
                                                      "completed"
                                                    ? "Hoàn thành"
                                                    : "Đóng"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pending Grading */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        📝 Bài tập chờ chấm
                    </h3>
                    <Link
                        href={route("teacher.assignments.index")}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Xem tất cả →
                    </Link>
                </div>
                <div className="p-6">
                    {!pendingGrading || pendingGrading.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">✅</div>
                            <p>Không có bài tập chờ chấm</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingGrading.map((assignment) => {
                                const pendingCount =
                                    assignment.submissions?.filter(
                                        (s) => s.status === "submitted"
                                    ).length || 0;

                                return (
                                    <Link
                                        key={assignment.id}
                                        href={route(
                                            "teacher.assignments.show",
                                            assignment.id
                                        )}
                                        className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {assignment.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {assignment.course.name}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                                    <span>
                                                        📝 {pendingCount} bài
                                                        chờ chấm
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Hạn:{" "}
                                                        {new Date(
                                                            assignment.due_date
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                {pendingCount}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Link
                    href={route("teacher.classes.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm font-medium text-gray-700">
                        Quản lý lớp
                    </div>
                </Link>

                <Link
                    href={route("teacher.assignments.create")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-700">
                        Tạo bài tập
                    </div>
                </Link>

                <Link
                    href={route("teacher.schedule.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📅</div>
                    <div className="text-sm font-medium text-gray-700">
                        Xem lịch dạy
                    </div>
                </Link>

                <Link
                    href={route("teacher.assignments.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-sm font-medium text-gray-700">
                        Chấm bài
                    </div>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudentDashboard({
    stats,
    schedule,
    announcements,
    upcomingExams,
    recentGrades,
}) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Dashboard - Sinh viên
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Chào mừng bạn trở lại học tập!
                    </p>
                </div>
            }
        >
            <Head title="Student Dashboard" />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">
                                Học phần đang học
                            </p>
                            <p className="text-3xl font-bold">
                                {stats?.current_courses || 0}
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm mb-1">
                                Điểm trung bình
                            </p>
                            <p className="text-3xl font-bold">
                                {stats?.gpa ? stats.gpa.toFixed(2) : "0.00"}
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm mb-1">
                                Tín chỉ tích lũy
                            </p>
                            <p className="text-3xl font-bold">
                                {stats?.total_credits || 0}
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm mb-1">
                                Học phí còn nợ
                            </p>
                            <p className="text-3xl font-bold">
                                {new Intl.NumberFormat("vi-VN").format(
                                    stats?.outstanding_tuition || 0
                                )}
                                đ
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Lịch học hôm nay
                            </h3>
                            <Link
                                href={route("student.schedule")}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {schedule && schedule.length > 0 ? (
                            <div className="space-y-4">
                                {schedule.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                                                <span className="text-xs text-blue-600 font-medium">
                                                    {item.start_time}
                                                </span>
                                                <span className="text-xs text-blue-500">
                                                    {item.end_time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {item.course_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.teacher_name}
                                            </p>
                                            <div className="flex items-center mt-1 text-xs text-gray-500">
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
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                {item.room}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {item.session_type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
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
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-gray-500">
                                    Không có lịch học hôm nay
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Announcements & Exams */}
                <div className="space-y-6">
                    {/* Announcements */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Thông báo mới
                            </h3>
                        </div>
                        <div className="p-6">
                            {announcements && announcements.length > 0 ? (
                                <div className="space-y-4">
                                    {announcements
                                        .slice(0, 5)
                                        .map((announcement) => (
                                            <div
                                                key={announcement.id}
                                                className="border-l-4 border-blue-500 pl-4 py-2"
                                            >
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {announcement.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        announcement.created_at
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Không có thông báo mới
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Lịch thi sắp tới
                            </h3>
                        </div>
                        <div className="p-6">
                            {upcomingExams && upcomingExams.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingExams.map((exam, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="w-6 h-6 text-red-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {exam.course_name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {new Date(
                                                        exam.exam_date
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    - {exam.room}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Không có lịch thi sắp tới
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Grades */}
            <div className="mt-6 bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Điểm mới nhất
                        </h3>
                        <Link
                            href={route("student.grades")}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Học phần
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điểm CC
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điểm GK
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điểm CK
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điểm TB
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Xếp loại
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentGrades && recentGrades.length > 0 ? (
                                recentGrades.map((grade, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {grade.course_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {grade.course_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {grade.attendance_score || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {grade.midterm_score || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {grade.final_score || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`text-sm font-bold ${
                                                    grade.average_score >= 8
                                                        ? "text-green-600"
                                                        : grade.average_score >=
                                                          6.5
                                                        ? "text-blue-600"
                                                        : grade.average_score >=
                                                          5
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {grade.average_score
                                                    ? grade.average_score.toFixed(
                                                          1
                                                      )
                                                    : "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    grade.grade === "A" ||
                                                    grade.grade === "A+"
                                                        ? "bg-green-100 text-green-800"
                                                        : grade.grade === "B" ||
                                                          grade.grade === "B+"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : grade.grade === "C" ||
                                                          grade.grade === "C+"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : grade.grade === "D" ||
                                                          grade.grade === "D+"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {grade.grade || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        Chưa có điểm nào được cập nhật
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                    href={route("student.register")}
                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <svg
                            className="w-6 h-6 text-blue-600"
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
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        Đăng ký học phần
                    </span>
                </Link>

                <Link
                    href={route("student.schedule")}
                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                        <svg
                            className="w-6 h-6 text-green-600"
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
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        Thời khóa biểu
                    </span>
                </Link>

                <Link
                    href={route("student.grades")}
                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                        <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        Xem điểm
                    </span>
                </Link>

                <Link
                    href={route("student.tuition")}
                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                        <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        Học phí
                    </span>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

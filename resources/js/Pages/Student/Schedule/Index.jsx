import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ScheduleIndex({ schedules }) {
    const timeSlots = [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const dayLabels = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    📅 Lịch học Tuần
                </h2>
            }
        >
            <Head title="Lịch học" />

            {/* Calendar View */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Giờ
                            </th>
                            {days.map((day) => (
                                <th
                                    key={day}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]"
                                >
                                    {dayLabels[day]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map((time) => (
                            <tr key={time}>
                                <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                    {time}
                                </td>
                                {days.map((day) => {
                                    const daySchedules = schedules?.[day] || [];
                                    const classAtTime = daySchedules.find(
                                        (s) =>
                                            s.start_time <= time &&
                                            s.end_time > time
                                    );

                                    return (
                                        <td key={day} className="px-2 py-2">
                                            {classAtTime && (
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded hover:bg-blue-100 transition-colors">
                                                    <div className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                        {
                                                            classAtTime.course
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        {
                                                            classAtTime.course
                                                                .code
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        📍 {classAtTime.room}
                                                    </div>
                                                    {classAtTime.instructor && (
                                                        <div className="text-xs text-gray-500">
                                                            👤{" "}
                                                            {
                                                                classAtTime
                                                                    .instructor
                                                                    .name
                                                            }
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-blue-600 font-semibold mt-1">
                                                        {classAtTime.start_time}{" "}
                                                        - {classAtTime.end_time}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* List View */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => {
                    const daySchedules = schedules?.[day] || [];

                    if (daySchedules.length === 0) return null;

                    return (
                        <div key={day} className="bg-white rounded-lg shadow">
                            <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
                                <h3 className="font-semibold">
                                    {dayLabels[day]}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {daySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded"
                                    >
                                        <div className="font-semibold text-gray-900">
                                            {schedule.course.name}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {schedule.course.code}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>📍 {schedule.room}</span>
                                            <span className="font-semibold text-blue-600">
                                                {schedule.start_time} -{" "}
                                                {schedule.end_time}
                                            </span>
                                        </div>
                                        {schedule.instructor && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                👤 {schedule.instructor.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}

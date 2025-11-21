import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Schedule({ schedule = [] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Thời khóa biểu</h2>}
        >
            <Head title="Thời khóa biểu" />
            <div className="bg-white p-4 rounded shadow">
                {schedule.length ? (
                    schedule.map((s, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 border-b"
                        >
                            <div>
                                <div className="font-medium">
                                    {s.course_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {s.teacher_name} • {s.room}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                {s.day ?? ""} {s.start_time} - {s.end_time}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Chưa có thời khóa biểu
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

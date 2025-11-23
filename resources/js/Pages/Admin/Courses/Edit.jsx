import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

export default function CoursesEdit({ course, departments, teachers }) {
    const { data, setData, put, processing, errors } = useForm({
        id: course.id,
        code: course.code || "",
        name: course.name || "",
        description: course.description || "",
        credits: course.credits || 3,
        type: course.type || "elective",
        is_active: course.is_active ?? true,
        department_id: course.department_id || "",
        max_students: course.max_students || "",
        semester: course.semester || "",
        year: course.year || new Date().getFullYear(),
        tuition: course.tuition || "",
        class_sessions: (
            course.class_sessions ||
            course.classSessions ||
            []
        ).map((s) => ({
            id: s.id,
            class_code: s.class_code,
            teacher_id: s.teacher_id,
            max_students: s.max_students,
            schedules: (s.schedules || []).map((sc) => ({
                id: sc.id,
                day_of_week: sc.day_of_week,
                start_time: sc.start_time
                    ? sc.start_time.substring(0, 5)
                    : "08:00",
                end_time: sc.end_time ? sc.end_time.substring(0, 5) : "10:00",
                room: sc.room || "",
            })),
        })),
    });

    const addSession = () => {
        setData("class_sessions", [
            ...data.class_sessions,
            { class_code: "", teacher_id: "", max_students: "", schedules: [] },
        ]);
    };

    const removeSession = (idx) => {
        const s = [...data.class_sessions];
        s.splice(idx, 1);
        setData("class_sessions", s);
    };

    const updateSessionField = (idx, field, value) => {
        const s = [...data.class_sessions];
        s[idx][field] = value;
        setData("class_sessions", s);
    };

    const addSchedule = (sessionIdx) => {
        const s = [...data.class_sessions];
        s[sessionIdx].schedules = s[sessionIdx].schedules || [];
        s[sessionIdx].schedules.push({
            day_of_week: "Monday",
            start_time: "08:00",
            end_time: "10:00",
            room: "",
        });
        setData("class_sessions", s);
    };

    const removeSchedule = (sessionIdx, schIdx) => {
        const s = [...data.class_sessions];
        s[sessionIdx].schedules.splice(schIdx, 1);
        setData("class_sessions", s);
    };

    const updateScheduleField = (sessionIdx, schIdx, field, value) => {
        const s = [...data.class_sessions];
        s[sessionIdx].schedules[schIdx][field] = value;
        setData("class_sessions", s);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.courses.update", course.id));
    };

    const handleDuplicate = () => {
        if (confirm("Bạn có muốn sao chép học phần này?")) {
            router.post(route("admin.courses.duplicate", course.id));
        }
    };

    const handleToggleActive = () => {
        router.post(
            route("admin.courses.toggle-active", course.id),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Chỉnh sửa Học phần</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleToggleActive}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            {course.is_active ? "⏸️ Tạm ngừng" : "▶️ Kích hoạt"}
                        </button>
                        <button
                            onClick={handleDuplicate}
                            className="bg-purple-500 text-white px-4 py-2 rounded"
                        >
                            📋 Sao chép
                        </button>
                        <Link
                            href={route("admin.courses.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            ← Quay lại
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Chỉnh sửa học phần" />

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* basic */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            📚 Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm mb-1">
                                    Mã học phần
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData(
                                            "code",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    className="w-full border rounded"
                                />
                                {errors.code && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.code}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">
                                    Số tín chỉ
                                </label>
                                <input
                                    type="number"
                                    value={data.credits}
                                    onChange={(e) =>
                                        setData(
                                            "credits",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm mb-1">Tên</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border rounded"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm mb-1">Mô tả</label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className="w-full border rounded"
                            />
                        </div>
                    </div>

                    {/* classification & tuition */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            🏷️ Phân loại & Học phí
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                value={data.department_id}
                                onChange={(e) =>
                                    setData("department_id", e.target.value)
                                }
                                className="border rounded p-2"
                            >
                                <option value="">-- Khoa --</option>
                                {departments?.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="border rounded p-2"
                            >
                                <option value="elective">Tự chọn</option>
                                <option value="required">Bắt buộc</option>
                            </select>
                            <input
                                type="number"
                                value={data.tuition}
                                onChange={(e) =>
                                    setData("tuition", e.target.value)
                                }
                                placeholder="Học phí (VNĐ)"
                                className="border rounded p-2"
                            />
                        </div>
                    </div>

                    {/* sessions */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            📚 Lớp (Class Sessions)
                        </h3>
                        <div className="space-y-3">
                            {data.class_sessions.map((s, idx) => (
                                <div key={idx} className="p-3 border rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-semibold">
                                            Lớp {s.class_code || idx + 1}
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => addSchedule(idx)}
                                                className="px-2 py-1 bg-blue-50 rounded"
                                            >
                                                + Lịch
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSession(idx)
                                                }
                                                className="px-2 py-1 bg-red-50 rounded"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                        <input
                                            value={s.class_code}
                                            onChange={(e) =>
                                                updateSessionField(
                                                    idx,
                                                    "class_code",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Mã lớp"
                                            className="border rounded p-2"
                                        />
                                        <select
                                            value={s.teacher_id}
                                            onChange={(e) =>
                                                updateSessionField(
                                                    idx,
                                                    "teacher_id",
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded p-2"
                                        >
                                            <option value="">
                                                -- Giảng viên --
                                            </option>
                                            {teachers?.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={s.max_students}
                                            onChange={(e) =>
                                                updateSessionField(
                                                    idx,
                                                    "max_students",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Sĩ số tối đa"
                                            className="border rounded p-2"
                                        />
                                        <div className="text-sm text-gray-500 p-2">
                                            Trạng thái: active
                                        </div>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        {s.schedules &&
                                            s.schedules.map((sch, si) => (
                                                <div
                                                    key={si}
                                                    className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center"
                                                >
                                                    <select
                                                        value={sch.day_of_week}
                                                        onChange={(e) =>
                                                            updateScheduleField(
                                                                idx,
                                                                si,
                                                                "day_of_week",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border rounded p-2"
                                                    >
                                                        <option>Monday</option>
                                                        <option>Tuesday</option>
                                                        <option>
                                                            Wednesday
                                                        </option>
                                                        <option>
                                                            Thursday
                                                        </option>
                                                        <option>Friday</option>
                                                        <option>
                                                            Saturday
                                                        </option>
                                                        <option>Sunday</option>
                                                    </select>
                                                    <input
                                                        type="time"
                                                        value={sch.start_time}
                                                        onChange={(e) =>
                                                            updateScheduleField(
                                                                idx,
                                                                si,
                                                                "start_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border rounded p-2"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={sch.end_time}
                                                        onChange={(e) =>
                                                            updateScheduleField(
                                                                idx,
                                                                si,
                                                                "end_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border rounded p-2"
                                                    />
                                                    <input
                                                        value={sch.room}
                                                        onChange={(e) =>
                                                            updateScheduleField(
                                                                idx,
                                                                si,
                                                                "room",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Phòng"
                                                        className="border rounded p-2"
                                                    />
                                                    <div className="md:col-span-2 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSchedule(
                                                                    idx,
                                                                    si
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            Xóa lịch
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={addSession}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                + Thêm lớp
                            </button>
                        </div>
                    </div>

                    {/* meta & actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={data.semester}
                            onChange={(e) =>
                                setData("semester", e.target.value)
                            }
                            className="border rounded p-2"
                        >
                            <option value="">-- Học kỳ --</option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </select>
                        <input
                            type="number"
                            value={data.year}
                            onChange={(e) =>
                                setData("year", parseInt(e.target.value))
                            }
                            className="border rounded p-2"
                        />
                        <input
                            type="number"
                            value={data.max_students}
                            onChange={(e) =>
                                setData("max_students", e.target.value)
                            }
                            placeholder="Sĩ số mặc định"
                            className="border rounded p-2"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Link
                            href={route("admin.courses.index")}
                            className="px-4 py-2 border rounded"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            {processing ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

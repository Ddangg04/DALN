import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

export default function CoursesEdit({ course, departments, teachers }) {
    const { data, setData, put, processing, errors } = useForm({
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
        class_sessions: (course.class_sessions || []).map((s) => ({
            id: s.id,
            class_code: s.class_code || "",
            teacher_id: s.teacher_id || "",
            max_students: s.max_students || "",
            status: s.status || "active",
            schedules: (s.schedules || []).map((sch) => ({
                id: sch.id,
                day_of_week: sch.day_of_week,
                start_time: sch.start_time,
                end_time: sch.end_time,
                room: sch.room || "",
                building: sch.building || "",
            })),
        })),
    });

    // ------------------------
    // SESSION HANDLERS
    // ------------------------
    const addSession = () => {
        setData("class_sessions", [
            ...data.class_sessions,
            {
                id: null,
                class_code: "",
                teacher_id: "",
                max_students: "",
                status: "active",
                schedules: [],
            },
        ]);
    };

    const removeSession = (index) => {
        const list = [...data.class_sessions];
        list.splice(index, 1);
        setData("class_sessions", list);
    };

    const updateSessionField = (index, field, value) => {
        const list = [...data.class_sessions];
        list[index] = { ...list[index], [field]: value };
        setData("class_sessions", list);
    };

    // ------------------------
    // SCHEDULE HANDLERS
    // ------------------------
    const addSchedule = (sIdx) => {
        const copy = [...data.class_sessions];
        copy[sIdx].schedules.push({
            id: null,
            day_of_week: "Monday",
            start_time: "08:00",
            end_time: "10:00",
            room: "",
            building: "",
        });
        setData("class_sessions", copy);
    };

    const removeSchedule = (sIdx, scIdx) => {
        const copy = [...data.class_sessions];
        copy[sIdx].schedules.splice(scIdx, 1);
        setData("class_sessions", copy);
    };

    const updateScheduleField = (sIdx, scIdx, field, value) => {
        const copy = [...data.class_sessions];
        copy[sIdx].schedules[scIdx][field] = value;
        setData("class_sessions", copy);
    };

    // ------------------------
    // SUBMIT
    // ------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.courses.update", course.id));
    };

    const handleToggleActive = () => {
        window.location.href = route("admin.courses.toggle-active", course.id);
    };

    const handleDuplicate = () => {
        window.location.href = route("admin.courses.duplicate", course.id);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    ✏️ Chỉnh sửa Học phần
                </h2>
            }
        >
            <Head title="Chỉnh sửa học phần" />

            <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ====================== BASIC INFO ====================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">Mã học phần</label>
                            <input
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                            {errors.code && (
                                <div className="text-red-600 text-sm">
                                    {errors.code}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="font-medium">Số tín chỉ</label>
                            <input
                                type="number"
                                value={data.credits}
                                onChange={(e) =>
                                    setData("credits", e.target.value)
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-medium">Tên học phần</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="font-medium">Mô tả</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        ></textarea>
                    </div>

                    {/* ====================== COURSE PROPERTIES ====================== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="font-medium">Khoa</label>
                            <select
                                value={data.department_id}
                                onChange={(e) =>
                                    setData("department_id", e.target.value)
                                }
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">-- Chọn khoa --</option>
                                {departments?.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-medium">Loại</label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="required">Bắt buộc</option>
                                <option value="elective">Tự chọn</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-medium">Học phí</label>
                            <input
                                type="number"
                                value={data.tuition}
                                onChange={(e) =>
                                    setData("tuition", e.target.value)
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                    </div>

                    {/* ====================== CLASS SESSIONS ====================== */}
                    <hr className="my-4" />
                    <h3 className="text-xl font-bold mb-2">
                        👥 Lớp học phần (Class Sessions)
                    </h3>

                    {data.class_sessions.map((session, sIdx) => (
                        <div
                            key={sIdx}
                            className="p-4 border rounded-lg mb-4 bg-gray-50"
                        >
                            <div className="flex justify-between mb-3">
                                <strong>Lớp #{sIdx + 1}</strong>
                                <button
                                    type="button"
                                    onClick={() => removeSession(sIdx)}
                                    className="text-red-600"
                                >
                                    Xóa lớp
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    placeholder="Mã lớp"
                                    value={session.class_code}
                                    onChange={(e) =>
                                        updateSessionField(
                                            sIdx,
                                            "class_code",
                                            e.target.value
                                        )
                                    }
                                    className="border px-3 py-2 rounded"
                                />

                                <select
                                    value={session.teacher_id}
                                    onChange={(e) =>
                                        updateSessionField(
                                            sIdx,
                                            "teacher_id",
                                            e.target.value
                                        )
                                    }
                                    className="border px-3 py-2 rounded"
                                >
                                    <option value="">-- Giảng viên --</option>
                                    {teachers?.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    placeholder="Sĩ số tối đa"
                                    value={session.max_students}
                                    onChange={(e) =>
                                        updateSessionField(
                                            sIdx,
                                            "max_students",
                                            e.target.value
                                        )
                                    }
                                    className="border px-3 py-2 rounded"
                                />

                                <select
                                    value={session.status}
                                    onChange={(e) =>
                                        updateSessionField(
                                            sIdx,
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="border px-3 py-2 rounded"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Ngừng</option>
                                </select>
                            </div>

                            {/* ====================== SCHEDULES ====================== */}
                            <h4 className="font-semibold mt-4 mb-2">
                                🕒 Lịch học
                            </h4>

                            {session.schedules.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Chưa có lịch học
                                </p>
                            )}

                            {session.schedules.map((sch, scIdx) => (
                                <div
                                    key={scIdx}
                                    className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center mb-2"
                                >
                                    <select
                                        value={sch.day_of_week}
                                        onChange={(e) =>
                                            updateScheduleField(
                                                sIdx,
                                                scIdx,
                                                "day_of_week",
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded"
                                    >
                                        <option>Monday</option>
                                        <option>Tuesday</option>
                                        <option>Wednesday</option>
                                        <option>Thursday</option>
                                        <option>Friday</option>
                                        <option>Saturday</option>
                                        <option>Sunday</option>
                                    </select>

                                    <input
                                        type="time"
                                        value={sch.start_time}
                                        onChange={(e) =>
                                            updateScheduleField(
                                                sIdx,
                                                scIdx,
                                                "start_time",
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded"
                                    />

                                    <input
                                        type="time"
                                        value={sch.end_time}
                                        onChange={(e) =>
                                            updateScheduleField(
                                                sIdx,
                                                scIdx,
                                                "end_time",
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded"
                                    />

                                    <input
                                        placeholder="Phòng"
                                        value={sch.room}
                                        onChange={(e) =>
                                            updateScheduleField(
                                                sIdx,
                                                scIdx,
                                                "room",
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded"
                                    />

                                    <input
                                        placeholder="Tòa"
                                        value={sch.building}
                                        onChange={(e) =>
                                            updateScheduleField(
                                                sIdx,
                                                scIdx,
                                                "building",
                                                e.target.value
                                            )
                                        }
                                        className="border px-3 py-2 rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSchedule(sIdx, scIdx)
                                        }
                                        className="text-red-600"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addSchedule(sIdx)}
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                + Thêm lịch
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addSession}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        + Thêm lớp mới
                    </button>

                    {/* ====================== ACTION BUTTONS ====================== */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleToggleActive}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            🔄 Kích hoạt / Ngừng
                        </button>

                        <button
                            type="button"
                            onClick={handleDuplicate}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            📋 Sao chép
                        </button>

                        <Link
                            href={route("admin.courses.index")}
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            ← Quay lại
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

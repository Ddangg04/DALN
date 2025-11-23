import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

export default function CoursesCreate({ departments, teachers }) {
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        name: "",
        description: "",
        credits: 3,
        type: "elective",
        is_active: true,
        department_id: "",
        max_students: "",
        semester: "",
        year: new Date().getFullYear(),
        tuition: "",
        class_sessions: [
            {
                class_code: "A",
                teacher_id: "",
                max_students: "",
                schedules: [
                    {
                        day_of_week: "Monday",
                        start_time: "08:00",
                        end_time: "10:00",
                        room: "",
                    },
                ],
            },
        ],
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
        s[idx] = { ...s[idx], [field]: value };
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
        s[sessionIdx].schedules = [...(s[sessionIdx].schedules || [])];
        s[sessionIdx].schedules.splice(schIdx, 1);
        setData("class_sessions", s);
    };

    const updateScheduleField = (sessionIdx, schIdx, field, value) => {
        const s = [...data.class_sessions];
        s[sessionIdx].schedules = [...(s[sessionIdx].schedules || [])];
        s[sessionIdx].schedules[schIdx] = {
            ...s[sessionIdx].schedules[schIdx],
            [field]: value,
        };
        setData("class_sessions", s);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("=== FORM DATA ===", data);

        post(route("admin.courses.store"), {
            onSuccess: () => alert("✅ Thành công!"),
            onError: (errors) => {
                console.error("❌ LỖI:", errors);
                alert("Có lỗi! Xem Console");
            },
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Thêm Học phần mới
                    </h2>
                    <Link
                        href={route("admin.courses.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Thêm học phần" />

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            📚 Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Mã học phần{" "}
                                    <span className="text-red-500">*</span>
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
                                    className="w-full border-gray-300 rounded-lg"
                                    placeholder="VD: CS101"
                                />
                                {errors.code && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Số tín chỉ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.credits}
                                    onChange={(e) =>
                                        setData(
                                            "credits",
                                            parseInt(e.target.value || 0)
                                        )
                                    }
                                    min="1"
                                    max="10"
                                    className="w-full border-gray-300 rounded-lg"
                                />
                                {errors.credits && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.credits}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">
                                Tên học phần{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="VD: Lập trình hướng đối tượng"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="Mô tả..."
                            />
                        </div>
                    </div>

                    {/* Classification */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            🏷️ Phân loại & Học phí
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Khoa
                                </label>
                                <select
                                    value={data.department_id}
                                    onChange={(e) =>
                                        setData("department_id", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg"
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
                                <label className="block text-sm font-medium mb-2">
                                    Loại
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg"
                                >
                                    <option value="elective">Tự chọn</option>
                                    <option value="required">Bắt buộc</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Học phí (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={data.tuition}
                                    onChange={(e) =>
                                        setData("tuition", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg"
                                    placeholder="Ví dụ: 1500000"
                                />
                                {errors.tuition && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.tuition}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sessions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            📚 Lớp (Class Sessions)
                        </h3>
                        <div className="space-y-4">
                            {data.class_sessions.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 border rounded-lg"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="font-semibold">
                                            Lớp {idx + 1}
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => addSchedule(idx)}
                                                className="text-sm px-3 py-1 bg-blue-50 rounded"
                                            >
                                                + Lịch
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSession(idx)
                                                }
                                                className="text-sm px-3 py-1 bg-red-50 rounded"
                                            >
                                                Xóa lớp
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-sm mb-1">
                                                Mã lớp
                                            </label>
                                            <input
                                                value={s.class_code}
                                                onChange={(e) =>
                                                    updateSessionField(
                                                        idx,
                                                        "class_code",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded"
                                                placeholder="A/B/01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm mb-1">
                                                Giảng viên
                                            </label>
                                            <select
                                                value={s.teacher_id}
                                                onChange={(e) =>
                                                    updateSessionField(
                                                        idx,
                                                        "teacher_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded"
                                            >
                                                <option value="">
                                                    -- Chọn giảng viên --
                                                </option>
                                                {(teachers || []).map((t) => (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm mb-1">
                                                Sĩ số tối đa
                                            </label>
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
                                                className="w-full border rounded"
                                                placeholder="Số SV"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm mb-1">
                                                Trạng thái
                                            </label>
                                            <div className="text-sm text-gray-500">
                                                {s.status || "active"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* schedules list */}
                                    <div className="mt-3 space-y-2">
                                        {s.schedules &&
                                        s.schedules.length > 0 ? (
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
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500">
                                                Chưa có lịch cho lớp này. Thêm
                                                lịch để sinh viên thấy lịch.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={addSession}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                + Thêm lớp
                            </button>
                        </div>
                    </div>

                    {/* meta */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Học kỳ</label>
                            <select
                                value={data.semester}
                                onChange={(e) =>
                                    setData("semester", e.target.value)
                                }
                                className="w-full border rounded"
                            >
                                <option value="">-- Chọn --</option>
                                <option value="Fall">Fall</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Năm</label>
                            <input
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData(
                                        "year",
                                        parseInt(e.target.value || 0)
                                    )
                                }
                                className="w-full border rounded"
                                min="2020"
                                max="2100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Sĩ số mặc định (course.max_students)
                            </label>
                            <input
                                type="number"
                                value={data.max_students}
                                onChange={(e) =>
                                    setData("max_students", e.target.value)
                                }
                                className="w-full border rounded"
                            />
                        </div>
                    </div>

                    {/* submit */}
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
                            {processing ? "Đang lưu..." : "Tạo học phần"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

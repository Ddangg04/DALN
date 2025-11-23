import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ScheduleIndex({ schedules = {} }) {
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

    // normalize "HH:MM" from "HH:MM:SS" or "H:MM"
    const normalizeTime = (t) => {
        if (!t || typeof t !== "string") return null;
        const m = t.match(/^(\d{1,2}):(\d{2})/);
        if (!m) return null;
        const hh = m[1].padStart(2, "0");
        const mm = m[2];
        return `${hh}:${mm}`;
    };

    // minutes since 00:00
    const minutes = (hhmm) => {
        if (!hhmm) return 0;
        const parts = hhmm.split(":");
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };

    // how many slots (rows) an event spans
    // assume each slot is 60 minutes and slots[] are hourly anchors
    const spanSlots = (startRaw, endRaw, slots) => {
        const start = normalizeTime(startRaw);
        const end = normalizeTime(endRaw);
        if (!start || !end) return 1;
        const startMin = minutes(start);
        const endMin = minutes(end);
        if (endMin <= startMin) return 1;
        // find index of slot where start falls (first slot with time <= start)
        const slotMinutes = slots.map((s) => minutes(s));
        // determine start index: the slot that has time == start or the nearest earlier slot
        let startIdx = slotMinutes.findIndex((sm) => sm === startMin);
        if (startIdx === -1) {
            // if start isn't exactly on a slot (rare), find nearest earlier slot
            startIdx = slotMinutes.reduce(
                (acc, sm, i) => (sm <= startMin ? i : acc),
                0
            );
        }
        // determine how many full 60-min slots the event covers from startIdx
        const totalMinutesFromSlotStartToEnd = endMin - slotMinutes[startIdx];
        const rows = Math.ceil(totalMinutesFromSlotStartToEnd / 60);
        return Math.max(1, rows);
    };

    // prepare safeSchedules (ensure arrays exist)
    const safeSchedules = {};
    days.forEach((d) => {
        const arr = schedules?.[d] ?? [];
        // normalize start/end times
        safeSchedules[d] = Array.isArray(arr)
            ? arr.map((it) => ({
                  ...it,
                  start_time: normalizeTime(it?.start_time) ?? "00:00",
                  end_time: normalizeTime(it?.end_time) ?? "00:00",
                  room: it?.room ?? "—",
                  id: it?.id ?? Math.random().toString(36).slice(2, 9),
                  course: it?.course ?? null,
                  instructor: it?.instructor ?? null,
                  class_session: it?.class_session ?? null,
              }))
            : [];
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    📅 Lịch học Tuần
                </h2>
            }
        >
            <Head title="Lịch học" />

            {/* Calendar View (table with rowSpan) */}
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
                        {timeSlots.map((time, rowIndex) => {
                            // For each day we need to know if an event started at this slot,
                            // and skip if the slot is covered by previous event (we track covered)
                            const covered = {}; // day => how many more rows to skip for that day

                            return (
                                <tr key={time}>
                                    <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                        {time}
                                    </td>

                                    {days.map((day) => {
                                        // initialize covered counter somewhere persistent across rows:
                                        // We'll attach to window._coveredMap to persist between rows for simplicity
                                        if (!window._coveredMap)
                                            window._coveredMap = {};
                                        if (
                                            window._coveredMap[day] ===
                                            undefined
                                        )
                                            window._coveredMap[day] = 0;

                                        // If this day is currently covered by earlier rowspan, decrement and return empty cell
                                        if (window._coveredMap[day] > 0) {
                                            window._coveredMap[day] =
                                                window._coveredMap[day] - 1;
                                            // return null cell (we must return nothing because outer table has that cell consumed by rowspan)
                                            return null;
                                        }

                                        // find any schedule that starts at this slot
                                        const daySchedules =
                                            safeSchedules[day] || [];
                                        // try to find an event whose start_time equals this slot
                                        const eventAtStart = daySchedules.find(
                                            (s) => s.start_time === time
                                        );

                                        if (eventAtStart) {
                                            // compute how many slots it spans
                                            const span = spanSlots(
                                                eventAtStart.start_time,
                                                eventAtStart.end_time,
                                                timeSlots
                                            );

                                            // mark covered for next (span-1) rows
                                            window._coveredMap[day] = span - 1;

                                            return (
                                                <td
                                                    key={day}
                                                    className="px-2 py-2"
                                                    rowSpan={span}
                                                >
                                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded hover:bg-blue-100 transition-colors">
                                                        <div className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                            {eventAtStart.course
                                                                ?.name ??
                                                                eventAtStart
                                                                    .class_session
                                                                    ?.class_code ??
                                                                "Không tên"}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {eventAtStart.course
                                                                ?.code ?? "—"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            📍{" "}
                                                            {eventAtStart.room ??
                                                                "—"}
                                                        </div>
                                                        {eventAtStart.instructor && (
                                                            <div className="text-xs text-gray-500">
                                                                👤{" "}
                                                                {
                                                                    eventAtStart
                                                                        .instructor
                                                                        .name
                                                                }
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-blue-600 font-semibold mt-1">
                                                            {
                                                                eventAtStart.start_time
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                eventAtStart.end_time
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // If no event starts exactly at this slot, there might be an ongoing event that started earlier but not on exact hour.
                                        // Find any event that covers the slot (start < time < end) but we didn't render because it didn't exactly match a slot start.
                                        // In that case, prefer to render it only if it's the first visible slot (we already skip covered ones), but to avoid duplicates we won't render it here.
                                        return (
                                            <td
                                                key={day}
                                                className="px-2 py-2"
                                            ></td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* List View (unchanged) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => {
                    const daySchedules = safeSchedules[day] || [];

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
                                            {schedule.course?.name ??
                                                schedule.class_session
                                                    ?.class_code ??
                                                "Không tên"}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {schedule.course?.code ?? "—"}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>
                                                📍 {schedule.room ?? "—"}
                                            </span>
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

import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AssignmentShow({ assignment }) {
    const { flash } = usePage().props;

    const handleGradeSubmission = (submissionId) => {
        const score = prompt("Nhập điểm (0-" + assignment.max_score + "):");
        const feedback = prompt("Nhận xét (tùy chọn):");

        if (score !== null && !isNaN(score)) {
            const form = useForm({
                score: parseFloat(score),
                feedback: feedback || "",
            });

            form.post(route("teacher.submissions.grade", submissionId), {
                preserveScroll: true,
            });
        }
    };

    const getSubmissionStatusBadge = (status) => {
        const badges = {
            pending: { class: "bg-gray-100 text-gray-800", label: "Chưa nộp" },
            submitted: { class: "bg-blue-100 text-blue-800", label: "Đã nộp" },
            graded: { class: "bg-green-100 text-green-800", label: "Đã chấm" },
            late: { class: "bg-orange-100 text-orange-800", label: "Nộp muộn" },
        };
        return badges[status] || badges.pending;
    };

    const isOverdue = new Date(assignment.due_date) < new Date();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chi tiết Bài tập
                    </h2>
                    <Link
                        href={route("teacher.assignments.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title={assignment.title} />

            {flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {flash.success}
                </div>
            )}

            {/* Assignment Info */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {assignment.title}
                        </h3>
                        <p className="text-gray-600">
                            {assignment.course.name}
                        </p>
                    </div>
                    {isOverdue && (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                            Đã quá hạn
                        </span>
                    )}
                </div>

                <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {assignment.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                        <div className="text-sm text-gray-600">Hạn nộp</div>
                        <div className="font-semibold">
                            {new Date(assignment.due_date).toLocaleString(
                                "vi-VN"
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Điểm tối đa</div>
                        <div className="font-semibold">
                            {assignment.max_score}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Số bài nộp</div>
                        <div className="font-semibold">
                            {assignment.submissions?.length || 0}
                        </div>
                    </div>
                </div>

                {assignment.file_path && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-600 mb-2">
                            File đính kèm:
                        </div>
                        <a
                            href={`/storage/${assignment.file_path}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700"
                        >
                            📎 Tải file
                        </a>
                    </div>
                )}
            </div>

            {/* Submissions */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Danh sách bài nộp ({assignment.submissions?.length || 0}
                        )
                    </h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {!assignment.submissions ||
                    assignment.submissions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="text-4xl mb-2">📭</div>
                            <p>Chưa có bài nộp nào</p>
                        </div>
                    ) : (
                        assignment.submissions.map((submission) => {
                            const badge = getSubmissionStatusBadge(
                                submission.status
                            );

                            return (
                                <div
                                    key={submission.id}
                                    className="p-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="font-semibold text-gray-900">
                                                    {submission.student.name}
                                                </h4>
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                {submission.is_late && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                                        Muộn
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    {submission.student.email}
                                                </p>
                                                {submission.submitted_at && (
                                                    <p>
                                                        Nộp lúc:{" "}
                                                        {new Date(
                                                            submission.submitted_at
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                    </p>
                                                )}
                                                {submission.content && (
                                                    <p className="mt-2 text-gray-700">
                                                        {submission.content}
                                                    </p>
                                                )}
                                                {submission.file_path && (
                                                    <a
                                                        href={`/storage/${submission.file_path}`}
                                                        target="_blank"
                                                        className="inline-block mt-2 text-blue-600 hover:text-blue-700"
                                                    >
                                                        📎 Tải bài làm
                                                    </a>
                                                )}
                                            </div>

                                            {submission.score !== null && (
                                                <div className="mt-3 p-3 bg-green-50 rounded">
                                                    <div className="flex items-center space-x-4">
                                                        <div>
                                                            <span className="text-sm text-gray-600">
                                                                Điểm:{" "}
                                                            </span>
                                                            <span className="font-bold text-green-700">
                                                                {
                                                                    submission.score
                                                                }
                                                                /
                                                                {
                                                                    assignment.max_score
                                                                }
                                                            </span>
                                                        </div>
                                                        {submission.feedback && (
                                                            <div>
                                                                <span className="text-sm text-gray-600">
                                                                    Nhận xét:{" "}
                                                                </span>
                                                                <span className="text-sm">
                                                                    {
                                                                        submission.feedback
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {submission.status === "submitted" && (
                                            <button
                                                onClick={() =>
                                                    handleGradeSubmission(
                                                        submission.id
                                                    )
                                                }
                                                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Chấm điểm
                                            </button>
                                        )}

                                        {submission.status === "graded" && (
                                            <button
                                                onClick={() =>
                                                    handleGradeSubmission(
                                                        submission.id
                                                    )
                                                }
                                                className="ml-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Sửa điểm
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

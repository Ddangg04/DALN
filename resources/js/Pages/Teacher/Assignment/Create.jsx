import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AssignmentCreate({ courses }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: "",
        title: "",
        description: "",
        due_date: "",
        max_score: 100,
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("teacher.assignments.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Tạo Bài tập mới
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
            <Head title="Tạo bài tập" />

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Học phần <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.course_id}
                            onChange={(e) =>
                                setData("course_id", e.target.value)
                            }
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Chọn học phần --</option>
                            {courses?.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.name}
                                </option>
                            ))}
                        </select>
                        {errors.course_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.course_id}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="VD: Bài tập tuần 1 - Lập trình cơ bản"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={6}
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập yêu cầu, hướng dẫn làm bài..."
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hạn nộp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.due_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>

                        {/* Max Score */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm tối đa{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.max_score}
                                onChange={(e) =>
                                    setData(
                                        "max_score",
                                        parseInt(e.target.value)
                                    )
                                }
                                min="1"
                                max="100"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.max_score && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.max_score}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            File đính kèm (tùy chọn)
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setData("file", e.target.files[0])}
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Hỗ trợ: PDF, Word, PowerPoint, ZIP (Tối đa 10MB)
                        </p>
                        {errors.file && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Link
                            href={route("teacher.assignments.index")}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {processing ? "Đang tạo..." : "Tạo bài tập"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

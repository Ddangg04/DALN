import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Registration({ courses = [] }) {
    const { data, setData, post, processing } = useForm({ course_id: "" });

    function submit(e) {
        e.preventDefault();
        post(route("student.register.store"));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Đăng ký học phần</h2>}
        >
            <Head title="Đăng ký học phần" />
            <div className="bg-white p-4 rounded shadow">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Chọn học phần
                        </label>
                        <select
                            value={data.course_id}
                            onChange={(e) =>
                                setData("course_id", e.target.value)
                            }
                            className="mt-1 block w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- Chọn --</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.code} — {c.name} ({c.credits} tín chỉ)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Profile({ user }) {
    const { data, setData, post, processing } = useForm({
        name: user?.name ?? "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("student.profile"));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Thông tin cá nhân</h2>}
        >
            <Head title="Thông tin cá nhân" />
            <div className="bg-white p-4 rounded shadow max-w-xl">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600">
                            Họ và tên
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Requests({ requests = [] }) {
    const { data, setData, post, processing } = useForm({
        type: "",
        message: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("student.requests.store"));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Yêu cầu</h2>}
        >
            <Head title="Yêu cầu" />
            <div className="bg-white p-4 rounded shadow">
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label>Loại yêu cầu</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="password_reset">
                                Yêu cầu Reset mật khẩu
                            </option>
                            <option value="document">Yêu cầu giấy tờ</option>
                        </select>
                    </div>
                    <div>
                        <label>Nội dung</label>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            className="w-full border p-2 rounded"
                        ></textarea>
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Gửi yêu cầu
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Lịch sử yêu cầu</h3>
                    {requests.length ? (
                        requests.map((r, i) => (
                            <div key={i} className="p-3 border rounded mb-2">
                                <div className="text-sm">
                                    {r.type} • {r.status}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {r.message}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">Chưa có yêu cầu</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

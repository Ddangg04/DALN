import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Xác minh email" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    {/* Logo / Title */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg
                                className="w-7 h-7 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-700">
                            XÁC MINH EMAIL
                        </h1>
                    </div>

                    {/* Info */}
                    <div className="mb-4 text-sm text-gray-600">
                        Cảm ơn bạn đã đăng ký! Trước khi bắt đầu, vui lòng xác
                        minh địa chỉ email bằng cách nhấn vào link chúng tôi đã
                        gửi đến hộp thư của bạn. Nếu bạn chưa nhận được email,
                        bạn có thể yêu cầu gửi lại.
                    </div>

                    {/* Success message */}
                    {status === "verification-link-sent" && (
                        <div className="mb-4 text-sm font-semibold text-green-600 bg-green-100 border border-green-300 p-3 rounded">
                            ✅ Link xác minh mới đã được gửi đến địa chỉ email
                            bạn đăng ký.
                        </div>
                    )}

                    {/* Actions */}
                    <form onSubmit={submit} className="space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
                        >
                            {processing
                                ? "Đang gửi lại..."
                                : "Gửi lại email xác minh"}
                        </button>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full text-center py-3 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Đăng xuất
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
}

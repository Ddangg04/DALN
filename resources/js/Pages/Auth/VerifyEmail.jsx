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

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">
                    {/* Header with Icon */}
                    <div className="bg-gradient-to-br from-rose-600 to-red-600 p-12 text-center text-white relative">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <span className="text-4xl">✉️</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">
                            Xác minh Email
                        </h1>
                        <p className="text-rose-100 text-sm font-bold mt-2 uppercase tracking-widest opacity-80">
                            Bảo mật tài khoản VNHeart
                        </p>
                    </div>

                    <div className="p-10 lg:p-14">
                        {/* Info */}
                        <div className="mb-10 text-center">
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Tuyệt vời! Bạn đã gần hoàn tất thủ tục đăng ký. 
                                Vui lòng nhấn vào liên kết chúng tôi vừa gửi tới hộp thư của bạn để kích hoạt tài khoản.
                            </p>
                        </div>

                        {/* Success message */}
                        {status === "verification-link-sent" && (
                            <div className="mb-8 p-5 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4 animate-fade-in">
                                <span className="text-2xl">✅</span>
                                <p className="text-sm font-black text-green-700">
                                    Link xác minh mới đã được gửi thành công!
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl shadow-xl shadow-rose-100 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
                            >
                                {processing
                                    ? "⏳ Đang gửi lại..."
                                    : "Gửi lại email xác minh"}
                            </button>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full text-center py-4 text-xs font-black text-gray-400 hover:text-rose-600 transition-colors uppercase tracking-[0.2em]"
                            >
                                Đăng xuất công việc
                            </Link>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modal-in { 0% { transform: translateY(30px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
                .animate-modal-in { animation: modal-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            `}</style>
        </>
    );
}

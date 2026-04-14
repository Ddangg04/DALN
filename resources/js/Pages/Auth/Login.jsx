import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ auth }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            <Head title="Đăng nhập - VNHeart Charity" />

            {/* Background Blobs for Atmosphere */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full overflow-y-auto">
                {/* Left Side: Visual Inspiration (60% on Desktop) */}
                <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-gray-900">
                    <img 
                        src="/images/auth/login_hero.png" 
                        alt="VNHeart Inspiration" 
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${isLoaded ? 'opacity-70 scale-100' : 'opacity-0 scale-110'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Floating Branding Overlay */}
                    <div className="absolute top-12 left-12 flex items-center space-x-4 animate-fade-in">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                            <span className="text-white text-3xl font-black">♥</span>
                        </div>
                        <span className="text-white text-3xl font-black tracking-tighter">VNHeart</span>
                    </div>

                    <div className={`absolute bottom-20 left-16 max-w-xl transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="text-rose-400 font-black uppercase tracking-[0.4em] text-xs mb-4">Mỗi tấm lòng - Một hy vọng</p>
                        <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">Kết nối những <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500">trái tim vàng</span></h2>
                        <div className="flex items-center space-x-6 text-white/60">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white/10 bg-gray-800 flex items-center justify-center text-[10px] font-bold">👤</div>
                                ))}
                            </div>
                            <p className="text-sm font-bold italic">Cùng 12,000+ thành viên tham gia thiện nguyện</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form (40% on Desktop, 100% on Mobile) */}
                <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 lg:p-16">
                    <div className={`w-full max-w-md transition-all duration-800 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-10">
                            <div className="text-center">
                                <span className="text-4xl font-black text-rose-600">VNHeart</span>
                                <div className="h-1 w-12 bg-rose-600 mx-auto mt-2 rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-white p-10 lg:p-12">
                            <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none">Chào mừng trở lại</h3>
                            <p className="text-gray-400 font-bold text-sm mb-10 uppercase tracking-widest">Đăng nhập để tiếp tục</p>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tài khoản / Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className={`w-full bg-gray-50/50 border-2 ${errors.email ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-14 pr-6 font-bold text-gray-900 transition-all placeholder:text-gray-300`}
                                            placeholder="anhdang@example.com"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 mt-2">⚠️ {errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mật khẩu</label>
                                        <Link href={route("password.request")} className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-wider transition">Quên?</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            className={`w-full bg-gray-50/50 border-2 ${errors.password ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-14 pr-14 font-bold text-gray-900 transition-all placeholder:text-gray-300`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-6 flex items-center text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            {showPassword ? <span className="text-xl">👁️</span> : <span className="text-xl">🔒</span>}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 mt-2">⚠️ {errors.password}</p>}
                                </div>

                                {/* Remember Me */}
                                <label className="flex items-center cursor-pointer group select-none ml-2">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="w-5 h-5 text-rose-600 rounded-lg border-gray-200 focus:ring-rose-500 transition"
                                    />
                                    <span className="ml-3 text-xs font-bold text-gray-500 group-hover:text-rose-600 transition">Duy trì đăng nhập</span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black rounded-2xl shadow-xl shadow-rose-100 hover:shadow-rose-400/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-sm"
                                >
                                    {processing ? "⏳ Đang kết nối..." : "Đăng nhập ngay"}
                                </button>

                                {/* Google Login */}
                                <div className="space-y-4 pt-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center px-6"><div className="w-full border-t border-gray-100"></div></div>
                                        <div className="relative flex justify-center"><span className="bg-white/70 backdrop-blur px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Hoặc với</span></div>
                                    </div>
                                    <a
                                        href={route("auth.google")}
                                        className="w-full flex items-center justify-center gap-4 py-4 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all group"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24"><path d="M21.35 11.1h-9.17v2.92h5.37c-.23 1.24-.92 2.29-1.97 2.99v2.49h3.18c1.86-1.71 2.93-4.24 2.93-7.24 0-.7-.06-1.37-.17-2.02z" fill="#EA4335"/><path d="M12.18 22c2.66 0 4.89-.88 6.52-2.39l-3.18-2.49c-.89.6-2.01.96-3.34.96-2.57 0-4.75-1.73-5.53-4.06H3.3v2.55C4.91 19.98 8.27 22 12.18 22z" fill="#34A853"/><path d="M6.65 13.99c-.2-.6-.31-1.25-.31-1.92s.11-1.32.31-1.92V7.6H3.3A9.74 9.74 0 0 0 2 12.07c0 1.57.38 3.05 1.3 4.47l3.35-2.55z" fill="#FBBC05"/><path d="M12.18 4.92c1.45 0 2.75.5 3.78 1.48l2.82-2.82C16.92 1.86 14.7 1 12.18 1 8.27 1 4.91 3.01 3.3 6.14l3.35 2.55c.78-2.34 2.96-4.07 5.53-4.07z" fill="#4285F4"/></svg>
                                        <span className="text-xs font-black text-gray-500 group-hover:text-rose-600 uppercase tracking-widest transition">Tiếp tục bằng Google</span>
                                    </a>
                                </div>
                            </form>

                            <div className="mt-12 text-center">
                                <p className="text-xs font-bold text-gray-400">Chưa có tài khoản?</p>
                                <Link href={route("register")} className="inline-block mt-2 text-sm font-black text-gray-900 border-b-2 border-rose-500 hover:text-rose-600 hover:border-rose-600 transition-all uppercase tracking-widest">Đăng ký thành viên ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
            `}</style>
        </div>
    );
}

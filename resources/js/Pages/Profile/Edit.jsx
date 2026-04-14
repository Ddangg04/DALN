import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ mustVerifyEmail, status, donations = [] }) {
    const user = usePage().props.auth.user;

    const { data: profileData, setData: setProfileData, post, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
        _method: 'PATCH',
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    const { data: passwordData, setData: setPasswordData, put, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        put(route('profile.password.update'), {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AppLayout>
            <Head title="Trang cá nhân - VNHeart" />

            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero Profile Header */}
                <div className="bg-gradient-to-r from-rose-600 to-red-600 pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar Large */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-1.5 shadow-2xl transition-transform group-hover:scale-105 active:scale-95 duration-500">
                                {avatarPreview ? (
                                    <img src={avatarPreview} className="w-full h-full object-cover rounded-[2.3rem]" />
                                ) : user.avatar ? (
                                    <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover rounded-[2.3rem]" />
                                ) : (
                                    <div className="w-full h-full bg-rose-50 text-rose-600 flex items-center justify-center text-5xl font-black rounded-[2.3rem]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-rose-600">
                                ⭐
                            </div>
                        </div>

                        <div className="text-center md:text-left text-white">
                            <h2 className="text-4xl md:text-5xl font-black mb-2 leading-none uppercase tracking-tighter">{user.name}</h2>
                            <p className="text-rose-100 font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center md:justify-start gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                {user.role === 'admin' ? 'Quản trị viên' : 'Nhà hảo tâm'}
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                    <p className="text-[10px] uppercase font-black opacity-60">Thành viên từ</p>
                                    <p className="text-sm font-bold">{new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                    <p className="text-[10px] uppercase font-black opacity-60">Lượt quyên góp</p>
                                    <p className="text-sm font-bold">{donations.length} lần</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Rail: History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Donation History Card */}
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-rose-100 p-8 lg:p-12 border border-rose-50">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                                <span className="text-rose-500">📋</span> Lịch sử quyên góp
                            </h3>
                            
                            {donations.length > 0 ? (
                                <div className="space-y-6">
                                    {donations.map((donation) => (
                                        <div key={donation.id} className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-rose-50 rounded-[2rem] border border-gray-100 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:border-rose-200">
                                                    🎁
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 group-hover:text-rose-700 transition">{donation.campaign.title}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        {new Date(donation.created_at).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(donation.amount)}</p>
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded-full mt-1">Hoàn tất</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Bạn chưa có lượt đóng góp nào</p>
                                    <Link href={route('campaigns.index')} className="mt-4 inline-block px-6 py-2 bg-rose-600 text-white font-black rounded-full text-xs uppercase tracking-widest hover:bg-rose-700 transition">Khám phá dực án ngay</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Rail: Settings */}
                    <div className="space-y-8">
                        {/* Information Update */}
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-rose-100 p-8 lg:p-10 border border-rose-50 h-fit">
                            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">
                                <span className="text-rose-500">⚙️</span> Cài đặt hồ sơ
                            </h3>

                            <form onSubmit={submitProfile} className="space-y-6">
                                <div className="space-y-1.5 ml-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên</label>
                                    <input 
                                        type="text" 
                                        value={profileData.name}
                                        onChange={e => setProfileData('name', e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-50 focus:border-rose-400 focus:ring-8 focus:ring-rose-500/5 rounded-2xl py-4 px-6 font-bold text-gray-900 transition-all"
                                    />
                                    {profileErrors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{profileErrors.name}</p>}
                                </div>

                                <div className="space-y-1.5 ml-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                                    <input 
                                        type="email" 
                                        value={profileData.email}
                                        readOnly={user.google_id !== null}
                                        onChange={e => setProfileData('email', e.target.value)}
                                        className={`w-full bg-gray-50 border-2 border-gray-50 focus:border-rose-400 focus:ring-8 focus:ring-rose-500/5 rounded-2xl py-4 px-6 font-bold text-gray-900 transition-all ${user.google_id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                    {user.google_id && <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic ml-2">Đã liên kết Google</p>}
                                </div>

                                <div className="space-y-1.5 ml-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ảnh đại diện</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="file" 
                                            id="avatar_upload"
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                setProfileData('avatar', file);
                                                if (file) {
                                                    setAvatarPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <label 
                                            htmlFor="avatar_upload"
                                            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-rose-400 hover:bg-rose-50 cursor-pointer rounded-2xl py-4 px-6 flex items-center justify-between transition-all"
                                        >
                                            <span className="text-gray-500 font-bold text-sm">
                                                {profileData.avatar ? profileData.avatar.name : 'Chọn ảnh từ thiết bị...'}
                                            </span>
                                            <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-rose-600 shadow-sm uppercase tracking-widest">Duyệt file</span>
                                        </label>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic ml-2 mt-1">Hỗ trợ: JPG, PNG, GIF. Max 2MB.</p>
                                    {profileErrors.avatar && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{profileErrors.avatar}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={profileProcessing}
                                    className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                                >
                                    {profileProcessing ? '⏳ Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                
                                {status === 'profile-updated' && (
                                    <p className="text-green-600 text-center font-black text-[10px] uppercase tracking-widest animate-fade-in">✅ Đã cập nhật thành công!</p>
                                )}
                            </form>
                        </div>

                        {/* Password Update Card (only for non-google users or as extra security) */}
                        {!user.google_id && (
                            <div className="bg-white rounded-[3rem] shadow-xl shadow-rose-100 p-8 lg:p-10 border border-rose-50 h-fit">
                                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">
                                    <span className="text-rose-500">🔒</span> Đổi mật khẩu
                                </h3>

                                <form onSubmit={submitPassword} className="space-y-6">
                                    <div className="space-y-1.5 ml-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Mật khẩu hiện tại</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.current_password}
                                            onChange={e => setPasswordData('current_password', e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-50 focus:border-rose-400 focus:ring-8 focus:ring-rose-500/5 rounded-2xl py-4 px-6 font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                        {passwordErrors.current_password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{passwordErrors.current_password}</p>}
                                    </div>

                                    <div className="space-y-1.5 ml-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.password}
                                            onChange={e => setPasswordData('password', e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-50 focus:border-rose-400 focus:ring-8 focus:ring-rose-500/5 rounded-2xl py-4 px-6 font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                        {passwordErrors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{passwordErrors.password}</p>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={passwordProcessing}
                                        className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-100 transition-all active:scale-95 uppercase tracking-[0.3em] text-[10px]"
                                    >
                                        Cập nhật bảo mật
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

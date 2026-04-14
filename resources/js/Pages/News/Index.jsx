import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function NewsIndex({ news }) {
    return (
        <AppLayout>
            <Head title="Tin tức & Sự kiện - VNHeart" />

            <div className="space-y-12">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Tin tức & Hoạt động</h1>
                    <p className="text-gray-500 mt-4 text-xl">
                        Cập nhật những thông tin mới nhất về các dự án đang triển khai và những dấu mốc quan trọng của VNHeart.
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.data.length > 0 ? (
                        news.data.map((item) => (
                            <Link 
                                key={item.id} 
                                href={route('news.show', item.slug)}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 group transition-all duration-300"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    {item.image_url ? (
                                        <img 
                                            src={item.image_url} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-rose-50 flex items-center justify-center text-5xl">📰</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-rose-600 shadow-sm uppercase tracking-widest">
                                            Hoạt động
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                                        {item.summary}
                                    </p>
                                    <div className="text-rose-600 font-bold text-sm flex items-center">
                                        Đọc tiếp <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold italic">Đang cập nhật tin tức mới...</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {news.links && news.data.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex gap-2">
                            {news.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                                        link.active
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-lg'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-rose-300'
                                    } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

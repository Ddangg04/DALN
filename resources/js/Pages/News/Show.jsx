import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function NewsShow({ news }) {
    return (
        <AppLayout>
            <Head title={`${news.title} - VNHeart`} />

            <article className="max-w-4xl mx-auto space-y-12 pb-20">
                {/* Breadcrumbs */}
                <nav className="flex text-sm font-bold text-gray-400 uppercase tracking-widest gap-2">
                    <Link href="/" className="hover:text-rose-600">Trang chủ</Link>
                    <span>/</span>
                    <Link href={route('news.index')} className="hover:text-rose-600">Tin tức</Link>
                </nav>

                {/* Hero Header */}
                <header className="space-y-8">
                    <div className="space-y-4">
                        <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">Hoạt động cộng đồng</span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {news.title}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">✍️</div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Ban biên tập VNHeart</p>
                            <p className="text-xs font-bold text-gray-400 uppercase mt-1">
                                Đăng ngày {new Date(news.created_at).toLocaleDateString('vi-VN', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Image */}
                {news.image_url && (
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                        <img 
                            src={news.image_url} 
                            alt={news.title} 
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                )}

                {/* Summary */}
                {news.summary && (
                    <div className="bg-rose-50/50 border-l-8 border-rose-500 p-10 rounded-tr-[3rem] rounded-br-[3rem]">
                        <p className="text-xl text-rose-900 font-bold leading-relaxed italic">
                            "{news.summary}"
                        </p>
                    </div>
                )}

                {/* Content */}
                <div 
                    className="prose prose-lg prose-rose max-w-none text-gray-700 font-medium leading-[1.8]
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-p:mb-8 prose-strong:font-black prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />

                {/* Footer Section */}
                <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400">Chia sẻ:</span>
                        <div className="flex gap-2">
                             {[1,2,3].map(i => (
                                <button key={i} className="w-10 h-10 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl flex items-center justify-center transition border border-gray-100">
                                    <div className="w-5 h-5 bg-current opacity-20 rounded-sm"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <Link 
                        href={route('news.index')}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl"
                    >
                        Quay lại tin tức
                    </Link>
                </footer>
            </article>
        </AppLayout>
    );
}

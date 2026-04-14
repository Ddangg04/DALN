<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:campaign,news',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        $title = $request->input('title');
        $type = $request->input('type');

        // Fallback demo content if API Key is missing
        if (empty($apiKey)) {
            return $this->getDemoContent($title, $type);
        }

        try {
            $prompt = $this->buildPrompt($title, $type);

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 1,
                    'maxOutputTokens' => 8192,
                ]
            ]);

            if (!$response->successful()) {
                Log::error('AI Generation Error: ' . $response->body());
                $errorDetail = $response->json();
                $errorMessage = isset($errorDetail['error']['message']) ? $errorDetail['error']['message'] : 'Máy chủ Google AI đang bận hoặc quá tải. Vui lòng thử lại sau.';
                return response()->json(['error' => 'Google AI thông báo: ' . $errorMessage], 500);
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Extract JSON from response (handling potential backticks from Gemini)
            $jsonStr = $this->extractJson($text);
            $result = json_decode($jsonStr, true);

            if ($result) {
                return response()->json($result);
            }

            return response()->json(['error' => 'AI trả về định dạng không hợp lệ. Vui lòng thử lại.'], 500);

        } catch (\Exception $e) {
            Log::error('AI Generation Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Lỗi kết nối AI: ' . $e->getMessage()], 500);
        }
    }

    private function buildPrompt($title, $type)
    {
        $roleInfo = "Bạn là chuyên gia biên tập nội dung cho nền tảng thiện nguyện VNHeart. ";
        $styleInfo = "Phong cách viết: TRANG TRỌNG, LỊCH SỰ, NHÂN VĂN, TRUYỀN CẢM HỨNG. Ngôn ngữ: Tiếng Việt. ";
        $formatInfo = "Bạn PHẢI trả về dữ liệu dưới định dạng JSON nguyên bản, không kèm văn bản giải thích. Cấu trúc JSON: { \"summary\": \"nội dung tóm tắt ngắn gọn khoảng 2-3 câu\", \"content\": \"nội dung chi tiết định dạng HTML\" }. ";
        
        if ($type === 'campaign') {
            $context = "Hãy viết nội dung cho một chiến dịch thiện nguyện có tiêu đề: \"{$title}\". Phần 'content' cần trình bày đẹp bằng các thẻ HTML như <h2>, <p>, <strong>, <ul>, <li>. Nội dung bao gồm: Hoàn cảnh khó khăn, Mục tiêu giúp đỡ, và Lời kêu gọi cộng đồng.";
        } else {
            $context = "Hãy viết một bài tin tức hoạt động cộng đồng có tiêu đề: \"{$title}\". Phần 'content' trình bày đẹp bằng HTML. Nội dung bao gồm: Sự kiện diễn ra, Các kết quả đạt được, Cảm ơn các nhà hảo tâm.";
        }

        return $roleInfo . $styleInfo . $formatInfo . $context;
    }

    private function extractJson($text)
    {
        $text = trim($text);
        if (str_starts_with($text, '```json')) {
            $text = substr($text, 7);
        }
        if (str_ends_with($text, '```')) {
            $text = substr($text, 0, -3);
        }
        return trim($text);
    }

    private function getDemoContent($title, $type)
    {
        return response()->json([
            'summary' => "⚠️ [CHẾ ĐỘ DEMO] - Bạn chưa cấu hình API Key. Đây là nội dung mẫu cho chiến dịch: \"{$title}\".",
            'content' => "<h2>⚠️ Yêu cầu kích hoạt AI</h2><p>Hệ thống nhận thấy bạn <strong>chưa nạp GEMINI_API_KEY</strong> vào tệp .env.</p><p>Để sử dụng sức mạnh thực thụ của AI để tự viết bài cho <em>\"{$title}\"</em>, bạn vui lòng:</p><ul><li>Truy cập <a href='https://aistudio.google.com/app/apikey' target='_blank' style='color: #e11d48; font-weight: bold;'>Google AI Studio</a> để lấy mã miễn phí.</li><li>Dán mã vào dòng <code>GEMINI_API_KEY=...</code> trong file <code>.env</code>.</li><li>Tải lại trang và bắt đầu sáng tạo!</li></ul>",
            'is_demo' => true
        ]);
    }
}

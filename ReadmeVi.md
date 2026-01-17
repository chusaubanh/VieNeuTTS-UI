# 🎤 VieNeu TTS Studio

> **Giao diện web hiện đại cho Text-to-Speech tiếng Việt**

---

## Giới thiệu

**VieNeu TTS Studio** là ứng dụng web được xây dựng dựa trên nền tảng **[VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)** - một dự án Text-to-Speech tiếng Việt xuất sắc của tác giả **[Phạm Nguyễn Ngọc Bảo](https://github.com/pnnbao97)**.

Chúng tôi **chỉ tạo giao diện web (UI/UX)** để dễ dàng sử dụng VieNeu-TTS. Toàn bộ công nghệ TTS, mô hình AI, voice cloning, và fine-tuning đều thuộc về dự án gốc VieNeu-TTS.

---

## 🙏 Ghi công & Cảm ơn

| Thành phần | Tác giả | Nguồn |
|------------|---------|-------|
| **VieNeu-TTS Engine** | Phạm Nguyễn Ngọc Bảo | [GitHub](https://github.com/pnnbao97/VieNeu-TTS) |
| **Model VieNeu-TTS-0.3B** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B) |
| **LoRA Ngọc Huyền** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen) |
| **Dataset VieNeu-TTS-1000h** | pnnbao-ump | [HuggingFace](https://huggingface.co/datasets/pnnbao-ump/VieNeu-TTS-1000h) |
| **Kiến trúc NeuTTS Air** | Neuphonic | [HuggingFace](https://huggingface.co/neuphonic/neutts-air) |

> ⚠️ **Lưu ý về License**: VieNeu-TTS-0.3B sử dụng license **CC BY-NC 4.0** (chỉ cho mục đích phi thương mại). Nếu bạn muốn sử dụng cho mục đích thương mại, vui lòng liên hệ tác giả gốc.

---

## ✨ Chúng tôi làm gì?

**Chúng tôi CHỈ xây dựng:**

- 🎨 Giao diện web hiện đại (Next.js 14 + Tailwind CSS)
- 🖥️ Terminal panel để theo dõi tiến trình real-time
- 📁 Giao diện quản lý LoRA adapters
- 📊 Dashboard training cho quy trình fine-tuning
- 🕐 Lịch sử audio đã tạo
- 🔌 FastAPI wrapper để kết nối frontend với VieNeu SDK

**Chúng tôi KHÔNG tạo mới hay sửa đổi:**

- ❌ Engine TTS / Mô hình AI
- ❌ Thuật toán voice cloning
- ❌ Script fine-tuning
- ❌ Audio codec

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

- Node.js 18+
- Python 3.10+
- GPU với CUDA (khuyến nghị RTX 2060 trở lên)
- eSpeak NG đã cài đặt

### Cài đặt

```bash
# 1. Clone VieNeu-TTS (core engine)
git clone https://github.com/pnnbao97/VieNeu-TTS.git
cd VieNeu-TTS && uv sync

# 2. Clone VieNeu TTS Studio (giao diện web này)
cd ..
git clone <this-repo-url> vieneu-studio
cd vieneu-studio

# 3. Cài đặt frontend
npm install

# 4. Cài đặt backend
cd backend
pip install -r requirements.txt
pip install vieneu
```

### Chạy ứng dụng

```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev
```

Mở trình duyệt tại **<http://localhost:3000>**

---

## 📁 Cấu trúc dự án

```
vieneu-studio/
├── src/
│   ├── app/           # Các trang Next.js
│   │   ├── page.tsx   # Dashboard chính
│   │   ├── tts/       # Trang tạo giọng nói
│   │   ├── training/  # Dashboard training
│   │   ├── models/    # Quản lý LoRA
│   │   └── history/   # Lịch sử audio
│   └── components/    # React components
├── backend/
│   ├── main.py        # FastAPI app
│   └── api/           # API routers
└── docs/              # Tài liệu
```

---

## 🔧 Công nghệ sử dụng

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, CSS Variables |
| **State** | Zustand |
| **Audio** | Wavesurfer.js |
| **Backend** | FastAPI, Python |
| **TTS Engine** | VieNeu SDK (từ VieNeu-TTS) |

---

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho phần **giao diện web**, vui lòng tạo issue hoặc pull request tại repository này.

Đối với các vấn đề liên quan đến **TTS engine, model, voice cloning**, vui lòng truy cập repository gốc: [VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)

---

## 📄 License

Phần giao diện web (frontend code) được phát hành dưới license **MIT**.

**Lưu ý quan trọng**: VieNeu-TTS backend và models có license riêng:

- VieNeu-TTS (0.5B): Apache 2.0
- VieNeu-TTS-0.3B: CC BY-NC 4.0 (chỉ phi thương mại)

Vui lòng tuân thủ license của từng thành phần khi sử dụng.

---

## 🙏 Lời cảm ơn đặc biệt

Xin chân thành cảm ơn **Phạm Nguyễn Ngọc Bảo** và cộng đồng VieNeu-TTS đã tạo ra công nghệ TTS tiếng Việt tuyệt vời này.

VieNeu TTS Studio chỉ là một lớp giao diện nhỏ được xây dựng dựa trên nền tảng xuất sắc của các bạn. Mọi thành tựu về công nghệ TTS, voice cloning, và fine-tuning đều thuộc về dự án gốc VieNeu-TTS.

- 🌐 **VieNeu-TTS GitHub**: [github.com/pnnbao97/VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)
- 🤗 **HuggingFace**: [huggingface.co/pnnbao-ump](https://huggingface.co/pnnbao-ump)
- 💬 **Discord**: [Tham gia cộng đồng](https://discord.gg/yJt8kzjzWZ)

---

<p align="center">Made with ❤️ cho cộng đồng TTS tiếng Việt</p>

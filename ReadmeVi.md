# 🎤 VieNeu TTS Studio

> **Giao diện web hiện đại cho Text-to-Speech tiếng Việt**

---

## Giới thiệu

**VieNeu TTS Studio** là ứng dụng web được xây dựng dựa trên **[VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)** - dự án TTS tiếng Việt xuất sắc của **[Phạm Nguyễn Ngọc Bảo](https://github.com/pnnbao97)**.

Chúng tôi **chỉ tạo giao diện web (UI/UX)**. Toàn bộ công nghệ TTS thuộc về dự án gốc VieNeu-TTS.

---

## 🙏 Ghi công

| Thành phần | Tác giả | Nguồn |
|------------|---------|-------|
| **VieNeu-TTS Engine** | Phạm Nguyễn Ngọc Bảo | [GitHub](https://github.com/pnnbao97/VieNeu-TTS) |
| **Model VieNeu-TTS-0.3B** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B) |
| **LoRA Ngọc Huyền** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen) |

> ⚠️ **License**: VieNeu-TTS-0.3B dùng **CC BY-NC 4.0** (chỉ phi thương mại).

---

## 🚀 Chạy nhanh (One-Click)

### Yêu cầu

- Node.js 18+
- Python 3.10+
- GPU với CUDA (khuyến nghị)

### Chạy ứng dụng

**Double-click vào file `start.bat`** - Xong!

Script sẽ tự động:

1. Dừng các process cũ
2. Cài dependencies nếu cần
3. Khởi động Backend (port 8000)
4. Khởi động Frontend (port 3000)
5. Mở <http://localhost:3000>

### Chạy thủ công

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
pip install vieneu  # Để có TTS thật
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm install
npm run dev
```

---

## 📁 Output

Audio được tạo sẽ lưu vào:

```
vieneu-studio/Output/VieNeuStudio-{số ngẫu nhiên}.wav
```

---

## ✨ Tính năng

- 🎨 Giao diện light theme hiện đại
- 🖥️ Terminal logs real-time
- 🎤 Chọn giọng (preset + LoRA)
- 🔊 Clone giọng từ audio 3-10s
- 📁 Tự động lưu vào folder Output
- ⬇️ Tải file một click

---

## 🙏 Lời cảm ơn

Cảm ơn **Phạm Nguyễn Ngọc Bảo** đã tạo ra VieNeu-TTS.

- 🌐 [VieNeu-TTS GitHub](https://github.com/pnnbao97/VieNeu-TTS)
- 🤗 [HuggingFace](https://huggingface.co/pnnbao-ump)
- 💬 [Discord](https://discord.gg/yJt8kzjzWZ)

---

<p align="center">Made with ❤️ cho cộng đồng TTS tiếng Việt</p>

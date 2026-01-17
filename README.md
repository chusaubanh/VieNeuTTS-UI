# 🎤 VieNeu TTS Studio

> **A modern web interface for Vietnamese Text-to-Speech**

---

## About

**VieNeu TTS Studio** is a web application built on top of **[VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)** - an excellent Vietnamese TTS project by **[Phạm Nguyễn Ngọc Bảo](https://github.com/pnnbao97)**.

We **only created the web interface (UI/UX)**. All TTS technology belongs to the original VieNeu-TTS project.

---

## 🙏 Credits

| Component | Author | Source |
|-----------|--------|--------|
| **VieNeu-TTS Engine** | Phạm Nguyễn Ngọc Bảo | [GitHub](https://github.com/pnnbao97/VieNeu-TTS) |
| **VieNeu-TTS-0.3B Model** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B) |
| **LoRA Ngọc Huyền** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen) |

> ⚠️ **License**: VieNeu-TTS-0.3B uses **CC BY-NC 4.0** (non-commercial only).

---

## 🚀 Quick Start (One-Click)

### Requirements

- Node.js 18+
- Python 3.10+
- GPU with CUDA (recommended)

### Run

**Double-click `start.bat`** - That's it!

The script will:

1. Kill any existing processes
2. Install dependencies if needed
3. Start Backend (port 8000)
4. Start Frontend (port 3000)
5. Open <http://localhost:3000>

### Manual Start

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
pip install vieneu  # For real TTS
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm install
npm run dev
```

---

## 📁 Output

Generated audio files are saved to:

```
vieneu-studio/Output/VieNeuStudio-{random}.wav
```

---

## ✨ Features

- 🎨 Modern light theme UI
- 🖥️ Real-time terminal logs
- 🎤 Voice selection (preset + LoRA)
- � Voice cloning from 3-10s audio
- 📁 Auto-save to Output folder
- ⬇️ One-click download

---

## 🙏 Special Thanks

Thanks to **Phạm Nguyễn Ngọc Bảo** for creating VieNeu-TTS.

- 🌐 [VieNeu-TTS GitHub](https://github.com/pnnbao97/VieNeu-TTS)
- 🤗 [HuggingFace](https://huggingface.co/pnnbao-ump)
- 💬 [Discord](https://discord.gg/yJt8kzjzWZ)

---

<p align="center">Made with ❤️ for Vietnamese TTS</p>

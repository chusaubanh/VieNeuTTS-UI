# 🎤 VieNeu TTS Studio

> **A modern web interface for Vietnamese Text-to-Speech**

---

## About

**VieNeu TTS Studio** is a web application built on top of **[VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)** - an excellent Vietnamese Text-to-Speech project by **[Phạm Nguyễn Ngọc Bảo](https://github.com/pnnbao97)**.

We **only created the web interface (UI/UX)** to make VieNeu-TTS easier to use. All TTS technology, AI models, voice cloning, and fine-tuning capabilities belong to the original VieNeu-TTS project.

---

## 🙏 Credits & Acknowledgements

| Component | Author | Source |
|-----------|--------|--------|
| **VieNeu-TTS Engine** | Phạm Nguyễn Ngọc Bảo | [GitHub](https://github.com/pnnbao97/VieNeu-TTS) |
| **VieNeu-TTS-0.3B Model** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B) |
| **LoRA Ngọc Huyền** | pnnbao-ump | [HuggingFace](https://huggingface.co/pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen) |
| **NeuTTS Air Architecture** | Neuphonic | [HuggingFace](https://huggingface.co/neuphonic/neutts-air) |

> ⚠️ **License Note**: VieNeu-TTS-0.3B uses **CC BY-NC 4.0** license (non-commercial use only). For commercial use, please contact the original author.

---

## ✨ What We Built

**We only created:**

- 🎨 Modern web UI (Next.js 14 + Tailwind CSS)
- 🖥️ Terminal panel for real-time progress tracking
- 📁 LoRA adapter management interface
- 📊 Training dashboard for fine-tuning workflow
- 🕐 Generation history
- 🔌 FastAPI wrapper to connect frontend with VieNeu SDK

**We did NOT create or modify:**

- ❌ TTS engine / AI model
- ❌ Voice cloning algorithm
- ❌ Fine-tuning scripts
- ❌ Audio codec

---

## � Getting Started

### Requirements

- Node.js 18+
- Python 3.10+
- GPU with CUDA (RTX 2060 or higher recommended)
- eSpeak NG installed

### Installation

```bash
# 1. Clone VieNeu-TTS (the core engine)
git clone https://github.com/pnnbao97/VieNeu-TTS.git
cd VieNeu-TTS && uv sync

# 2. Clone VieNeu TTS Studio (this UI)
cd ..
git clone <this-repo-url> vieneu-studio
cd vieneu-studio

# 3. Install frontend
npm install

# 4. Install backend
cd backend
pip install -r requirements.txt
pip install vieneu
```

### Running

```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev
```

Open **<http://localhost:3000>**

---

## 📁 Project Structure

```
vieneu-studio/
├── src/app/           # Next.js pages
├── src/components/    # React components
├── backend/           # FastAPI server
└── docs/              # Documentation
```

---

## 🤝 Contributing

For **UI/UX improvements**, please submit issues or PRs to this repository.

For **TTS engine, model, or voice cloning** issues, please visit the original repository: [VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)

---

## 📄 License

The web interface code is released under **MIT** license.

**Important**: VieNeu-TTS backend and models have their own licenses:

- VieNeu-TTS (0.5B): Apache 2.0
- VieNeu-TTS-0.3B: CC BY-NC 4.0 (non-commercial only)

---

## 🙏 Special Thanks

Sincere thanks to **Phạm Nguyễn Ngọc Bảo** and the VieNeu-TTS community for creating this amazing Vietnamese TTS technology. VieNeu TTS Studio is just a small UI layer built on top of their excellent foundation.

- 🌐 [VieNeu-TTS GitHub](https://github.com/pnnbao97/VieNeu-TTS)
- 🤗 [HuggingFace](https://huggingface.co/pnnbao-ump)
- 💬 [Discord Community](https://discord.gg/yJt8kzjzWZ)

---

<p align="center">Made with ❤️ for the Vietnamese TTS community</p>

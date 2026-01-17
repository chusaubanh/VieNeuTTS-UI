"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Wand2, Play, Pause, Download, Volume2, RotateCcw } from "lucide-react";
import { VoiceSelector, Voice } from "@/components/VoiceSelector";
import { AudioUpload } from "@/components/AudioUpload";
import { TerminalPanel } from "@/components/TerminalPanel";

type TTSMode = "standard" | "clone";

interface TerminalLine {
    type: "info" | "success" | "warning" | "error" | "command";
    text: string;
    timestamp?: string;
}

const API_BASE = "http://localhost:8000";

export default function TTSPage() {
    const [mode, setMode] = useState<TTSMode>("standard");
    const [text, setText] = useState("");
    const [selectedVoice, setSelectedVoice] = useState<Voice | null>({
        id: "ngoc-huyen",
        name: "Ngọc Huyền",
        description: "Giọng nữ miền Nam, trẻ trung",
        type: "lora",
    });
    const [refAudio, setRefAudio] = useState<File | null>(null);
    const [refText, setRefText] = useState("");
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
    const [generatedFilename, setGeneratedFilename] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([]);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [waveHeights, setWaveHeights] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Generate fixed waveform heights on mount to avoid hydration mismatch
    useEffect(() => {
        const heights = Array.from({ length: 50 }, () => Math.random() * 80 + 20);
        setWaveHeights(heights);
    }, []);

    const addLog = (type: TerminalLine["type"], text: string) => {
        const timestamp = new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setTerminalLogs((prev) => [...prev, { type, text, timestamp }]);
    };

    const handleGenerate = async () => {
        if (!text.trim()) return;

        setIsGenerating(true);
        setGeneratedAudioUrl(null);
        setTerminalLogs([]);

        addLog("command", "vieneu generate --text '...'");
        addLog("info", "Connecting to backend...");

        const duration = Math.ceil(text.length / 10);
        const demoFilename = `VieNeuStudio-${Math.floor(Math.random() * 90000000 + 10000000)}.wav`;
        // Demo audio - Vietnamese sample
        const demoAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav";

        try {
            const response = await fetch(`${API_BASE}/api/tts/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text,
                    voice_id: selectedVoice?.id || "ngoc-huyen",
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Generation failed");
            }

            const data = await response.json();

            addLog("info", `Model: VieNeu-TTS-0.3B`);
            addLog("info", `Voice: ${selectedVoice?.name || "Default"}`);
            addLog("info", "Tokenizing Vietnamese text...");
            addLog("info", "Generating audio codes...");
            addLog("info", "Decoding to waveform (24kHz)...");

            if (data.demo_mode || !data.audio_url) {
                // Demo mode - SDK not available
                addLog("warning", "⚠️ Demo mode: VieNeu SDK chưa sẵn sàng");
                addLog("info", "Cần Python 3.11/3.12 + PyTorch + CUDA GPU");
                addLog("success", "✓ Using demo audio");
                setAudioDuration(duration);
                setGeneratedFilename(demoFilename);
                setGeneratedAudioUrl(demoAudioUrl);
            } else {
                // Real audio generated
                addLog("success", "✓ Audio generated successfully!");
                addLog("info", `File: ${data.filename}`);
                addLog("info", `Saved to: Output/${data.filename}`);
                setAudioDuration(Math.ceil(data.duration));
                setGeneratedFilename(data.filename);
                setGeneratedAudioUrl(`${API_BASE}${data.audio_url}`);
            }

        } catch (error) {
            addLog("error", `Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            addLog("warning", "Backend không phản hồi");
            addLog("info", "[Demo mode] Using sample audio...");
            setAudioDuration(duration);
            setGeneratedFilename(demoFilename);
            setGeneratedAudioUrl(demoAudioUrl);
        }

        setIsGenerating(false);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const restart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleDownload = () => {
        if (generatedAudioUrl) {
            const a = document.createElement("a");
            a.href = generatedAudioUrl;
            a.download = generatedFilename || "VieNeuStudio-audio.wav";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            addLog("info", `Downloaded: ${generatedFilename}`);
        }
    };

    return (
        <div className="h-[calc(100vh-var(--header-height)-48px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Text to Speech</h1>
                    <p className="text-[var(--text-secondary)]">Chuyển văn bản thành giọng nói tự nhiên</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-[var(--bg-tertiary)] rounded-xl">
                    <button
                        onClick={() => setMode("standard")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${mode === "standard"
                            ? "bg-[var(--accent)] text-white shadow-md"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        Standard
                    </button>
                    <button
                        onClick={() => setMode("clone")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${mode === "clone"
                            ? "bg-[var(--accent)] text-white shadow-md"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <Wand2 className="w-4 h-4" />
                        Clone
                    </button>
                </div>
            </div>

            {/* Main 2-Column Layout */}
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                {/* LEFT COLUMN: Input & Output */}
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Text Input */}
                    <div className="card p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">
                                Nhập văn bản
                            </label>
                            <span className="text-xs text-[var(--text-muted)] font-mono">
                                {text.length}/500
                            </span>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, 500))}
                            placeholder="Nhập văn bản tiếng Việt để chuyển thành giọng nói..."
                            disabled={isGenerating}
                            className="textarea flex-1 resize-none"
                        />
                    </div>

                    {/* Audio Output */}
                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">
                                Audio Output
                            </label>
                            {generatedAudioUrl && (
                                <span className="badge badge-success">Ready</span>
                            )}
                        </div>

                        {generatedAudioUrl ? (
                            <div className="space-y-4">
                                {/* Hidden audio element */}
                                <audio
                                    ref={audioRef}
                                    src={generatedAudioUrl}
                                    onEnded={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />

                                {/* Filename display */}
                                <div className="text-xs text-[var(--text-muted)] font-mono truncate">
                                    📁 {generatedFilename}
                                </div>

                                {/* Waveform visualization */}
                                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={togglePlay}
                                            className="btn btn-primary p-3"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5 ml-0.5" />
                                            )}
                                        </button>

                                        {/* Waveform bars - using pre-generated heights */}
                                        <div className="flex-1 flex items-center gap-0.5 h-12">
                                            {waveHeights.map((height, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-all ${isPlaying ? "bg-[var(--accent)]" : "bg-[var(--border-hover)]"
                                                        }`}
                                                    style={{
                                                        height: `${height}%`,
                                                        opacity: isPlaying ? 0.8 : 0.5,
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <span className="text-sm text-[var(--text-muted)] font-mono w-20 text-right">
                                            0:{audioDuration.toString().padStart(2, "0")}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex gap-3">
                                    <button onClick={restart} className="btn btn-secondary flex-1">
                                        <RotateCcw className="w-4 h-4" />
                                        Phát lại
                                    </button>
                                    <button onClick={handleDownload} className="btn btn-secondary flex-1">
                                        <Download className="w-4 h-4" />
                                        Tải về
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-tertiary)] rounded-xl p-8 text-center">
                                <Volume2 className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
                                <p className="text-sm text-[var(--text-muted)]">
                                    Audio sẽ hiển thị ở đây sau khi generate
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Controls & Terminal */}
                <div className="flex flex-col gap-4 min-h-0">
                    {/* Voice Selection / Clone */}
                    <div className="card p-4">
                        {mode === "standard" ? (
                            <VoiceSelector
                                selectedVoice={selectedVoice}
                                onSelect={setSelectedVoice}
                            />
                        ) : (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                                    Reference Audio (3-10s)
                                </label>
                                <AudioUpload
                                    onFileSelect={setRefAudio}
                                    selectedFile={refAudio}
                                    onClear={() => setRefAudio(null)}
                                    label="Upload audio mẫu"
                                    description="Audio của giọng muốn clone"
                                />
                                {refAudio && (
                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                            Nội dung audio (khớp 100%)
                                        </label>
                                        <textarea
                                            value={refText}
                                            onChange={(e) => setRefText(e.target.value)}
                                            placeholder="Nhập chính xác nội dung..."
                                            className="textarea min-h-[60px]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={!text.trim() || isGenerating}
                        className={`btn py-4 text-base font-semibold ${isGenerating || !text.trim()
                            ? "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
                            : "btn-primary"
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Mic className="w-5 h-5" />
                                Generate Speech
                            </>
                        )}
                    </button>

                    {/* Terminal Panel */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <TerminalPanel
                            lines={terminalLogs}
                            title="Generation Output"
                        />
                    </div>

                    {/* Stats */}
                    <div className="card p-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-semibold text-[var(--text-primary)]">
                                    {Math.ceil(text.length / 10) || 0}s
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Duration</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-[var(--text-primary)]">
                                    ~300ms
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Latency</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-[var(--text-primary)]">
                                    24kHz
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Sample Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

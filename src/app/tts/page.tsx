"use client";

import { useState } from "react";
import { Mic, Wand2, ArrowDown, Play, Download, Volume2 } from "lucide-react";
import { TextInput } from "@/components/TextInput";
import { VoiceSelector, Voice } from "@/components/VoiceSelector";
import { AudioUpload } from "@/components/AudioUpload";
import { TerminalPanel } from "@/components/TerminalPanel";

type TTSMode = "standard" | "clone";

interface TerminalLine {
    type: "info" | "success" | "warning" | "error" | "command";
    text: string;
    timestamp?: string;
}

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([]);
    const [audioDuration, setAudioDuration] = useState<number>(0);

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
        addLog("info", "Loading model: VieNeu-TTS-0.3B");
        addLog("info", `Voice: ${selectedVoice?.name || "Default"}`);

        setTimeout(() => {
            addLog("info", "Tokenizing Vietnamese text...");
        }, 400);

        setTimeout(() => {
            addLog("info", "Generating audio codes...");
        }, 800);

        setTimeout(() => {
            addLog("info", "Decoding to waveform (24kHz)...");
        }, 1200);

        setTimeout(() => {
            addLog("success", "✓ Audio generated successfully!");
            const duration = Math.ceil(text.length / 10);
            setAudioDuration(duration);
            addLog("info", `Duration: ${duration}s | Latency: 287ms`);

            // Set a demo audio URL (in real app, this comes from API)
            setGeneratedAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
            setIsGenerating(false);
        }, 1800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Text to Speech
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Chuyển văn bản thành giọng nói tự nhiên
                    </p>
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
                        Voice Clone
                    </button>
                </div>
            </div>

            {/* STEP 1: Input */}
            <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
                        1
                    </div>
                    <div>
                        <h2 className="font-semibold text-[var(--text-primary)]">Nhập văn bản</h2>
                        <p className="text-sm text-[var(--text-muted)]">Tiếng Việt hoặc tiếng Anh, tối đa 500 ký tự</p>
                    </div>
                </div>
                <TextInput
                    value={text}
                    onChange={setText}
                    maxLength={500}
                    disabled={isGenerating}
                />
            </div>

            {/* STEP 2: Voice Selection */}
            <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
                        2
                    </div>
                    <div>
                        <h2 className="font-semibold text-[var(--text-primary)]">
                            {mode === "standard" ? "Chọn giọng nói" : "Upload audio mẫu"}
                        </h2>
                        <p className="text-sm text-[var(--text-muted)]">
                            {mode === "standard"
                                ? "Sử dụng preset hoặc LoRA adapter"
                                : "Audio 3-10 giây để clone giọng"
                            }
                        </p>
                    </div>
                </div>

                {mode === "standard" ? (
                    <VoiceSelector
                        selectedVoice={selectedVoice}
                        onSelect={setSelectedVoice}
                    />
                ) : (
                    <div className="space-y-4">
                        <AudioUpload
                            onFileSelect={setRefAudio}
                            selectedFile={refAudio}
                            onClear={() => setRefAudio(null)}
                            label="Upload Reference Audio"
                            description="Audio mẫu của giọng muốn clone"
                        />
                        {refAudio && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Nội dung audio mẫu (phải khớp 100%)
                                </label>
                                <textarea
                                    value={refText}
                                    onChange={(e) => setRefText(e.target.value)}
                                    placeholder="Nhập chính xác nội dung trong audio mẫu..."
                                    className="textarea min-h-[80px]"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
                <ArrowDown className="w-6 h-6 text-[var(--text-muted)]" />
            </div>

            {/* STEP 3: Generate */}
            <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
                        3
                    </div>
                    <div>
                        <h2 className="font-semibold text-[var(--text-primary)]">Tạo giọng nói</h2>
                        <p className="text-sm text-[var(--text-muted)]">
                            Ước tính: {Math.ceil(text.length / 10) || 0}s audio • ~300ms latency
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!text.trim() || isGenerating}
                    className={`btn w-full py-4 text-base font-semibold ${isGenerating || !text.trim()
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
            </div>

            {/* Terminal Panel - Always visible */}
            <TerminalPanel
                lines={terminalLogs}
                title="Generation Output"
            />

            {/* Arrow */}
            {generatedAudioUrl && (
                <div className="flex justify-center">
                    <ArrowDown className="w-6 h-6 text-[var(--success)]" />
                </div>
            )}

            {/* STEP 4: Output - Only show when audio is generated */}
            {generatedAudioUrl && (
                <div className="card p-5 border-[var(--success)] bg-[var(--success-muted)]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--success)] text-white flex items-center justify-center text-sm font-bold">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-[var(--text-primary)]">Audio đã sẵn sàng!</h2>
                            <p className="text-sm text-[var(--text-muted)]">
                                Thời lượng: {audioDuration}s • 24kHz WAV
                            </p>
                        </div>
                        <span className="badge badge-success">Hoàn thành</span>
                    </div>

                    {/* Audio Player */}
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-4">
                            <button className="btn btn-primary p-3">
                                <Play className="w-5 h-5" />
                            </button>

                            {/* Simple waveform visualization */}
                            <div className="flex-1 flex items-center gap-1 h-12">
                                {[...Array(40)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-[var(--accent)] rounded-full"
                                        style={{
                                            height: `${Math.random() * 80 + 20}%`,
                                            opacity: 0.6 + Math.random() * 0.4,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="text-sm text-[var(--text-muted)] font-mono">
                                0:00 / 0:{audioDuration.toString().padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="btn btn-primary flex-1">
                            <Play className="w-4 h-4" />
                            Phát lại
                        </button>
                        <button className="btn btn-secondary flex-1">
                            <Download className="w-4 h-4" />
                            Tải về
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state when no audio */}
            {!generatedAudioUrl && !isGenerating && (
                <div className="card p-8 text-center border-dashed">
                    <Volume2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--text-muted)]">
                        Audio sẽ hiển thị ở đây sau khi generate
                    </p>
                </div>
            )}
        </div>
    );
}

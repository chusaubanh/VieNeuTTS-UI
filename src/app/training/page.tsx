"use client";

import { useState } from "react";
import {
    Database,
    Upload,
    Play,
    Square,
    Settings2,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { AudioUpload } from "@/components/AudioUpload";

type TrainingStatus = "idle" | "preparing" | "training" | "completed" | "error";

interface TrainingConfig {
    baseModel: string;
    maxSteps: number;
    learningRate: string;
    batchSize: number;
}

export default function TrainingPage() {
    const [status, setStatus] = useState<TrainingStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [datasetFile, setDatasetFile] = useState<File | null>(null);
    const [metadataFile, setMetadataFile] = useState<File | null>(null);

    const [config, setConfig] = useState<TrainingConfig>({
        baseModel: "pnnbao-ump/VieNeu-TTS-0.3B",
        maxSteps: 5000,
        learningRate: "2e-4",
        batchSize: 4,
    });

    const handleStartTraining = async () => {
        if (!datasetFile) return;

        setStatus("preparing");
        setLogs(["[INFO] Preparing dataset..."]);

        // TODO: Call backend API
        setTimeout(() => {
            setStatus("training");
            setLogs((prev) => [...prev, "[INFO] Training started..."]);
        }, 2000);
    };

    const handleStopTraining = () => {
        if (confirm("Stop training? Progress will be saved.")) {
            setStatus("idle");
            setLogs((prev) => [...prev, "[WARN] Training stopped by user"]);
        }
    };

    const getStatusBadge = () => {
        switch (status) {
            case "idle":
                return <span className="badge">Ready</span>;
            case "preparing":
                return <span className="badge badge-warning">Preparing</span>;
            case "training":
                return <span className="badge badge-accent">Training</span>;
            case "completed":
                return <span className="badge badge-success">Completed</span>;
            case "error":
                return <span className="badge badge-error">Error</span>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Training Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Fine-tune VieNeu-TTS với giọng nói của bạn
                    </p>
                </div>
                {getStatusBadge()}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left: Dataset & Config */}
                <div className="col-span-2 space-y-4">
                    {/* Dataset Upload */}
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                            <Database className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-medium">Dataset</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">
                                    Audio Files (ZIP)
                                </p>
                                <AudioUpload
                                    onFileSelect={setDatasetFile}
                                    selectedFile={datasetFile}
                                    onClear={() => setDatasetFile(null)}
                                    label="Upload Audio ZIP"
                                    description="Chứa các file .wav"
                                    accept={["application/zip", "application/x-zip-compressed"]}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">
                                    Metadata CSV
                                </p>
                                <AudioUpload
                                    onFileSelect={setMetadataFile}
                                    selectedFile={metadataFile}
                                    onClear={() => setMetadataFile(null)}
                                    label="Upload metadata.csv"
                                    description="Format: file_name|text"
                                    accept={["text/csv"]}
                                />
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <p className="text-xs text-[var(--text-muted)]">
                                💡 Mỗi file audio nên dài 3-15 giây. Tổng thời lượng khuyến nghị: 2-4 giờ.
                            </p>
                        </div>
                    </div>

                    {/* Training Config */}
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                            <Settings2 className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-medium">Configuration</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                    Base Model
                                </label>
                                <select
                                    value={config.baseModel}
                                    onChange={(e) =>
                                        setConfig((c) => ({ ...c, baseModel: e.target.value }))
                                    }
                                    className="input"
                                    disabled={status !== "idle"}
                                >
                                    <option value="pnnbao-ump/VieNeu-TTS-0.3B">
                                        VieNeu-TTS-0.3B (Recommended)
                                    </option>
                                    <option value="pnnbao-ump/VieNeu-TTS">
                                        VieNeu-TTS-0.5B
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                    Max Steps
                                </label>
                                <input
                                    type="number"
                                    value={config.maxSteps}
                                    onChange={(e) =>
                                        setConfig((c) => ({
                                            ...c,
                                            maxSteps: parseInt(e.target.value) || 5000,
                                        }))
                                    }
                                    className="input"
                                    disabled={status !== "idle"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                    Learning Rate
                                </label>
                                <input
                                    type="text"
                                    value={config.learningRate}
                                    onChange={(e) =>
                                        setConfig((c) => ({ ...c, learningRate: e.target.value }))
                                    }
                                    className="input"
                                    disabled={status !== "idle"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                    Batch Size
                                </label>
                                <input
                                    type="number"
                                    value={config.batchSize}
                                    onChange={(e) =>
                                        setConfig((c) => ({
                                            ...c,
                                            batchSize: parseInt(e.target.value) || 4,
                                        }))
                                    }
                                    className="input"
                                    disabled={status !== "idle"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Training Logs */}
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-[var(--text-primary)]">
                                <FileText className="w-5 h-5 text-[var(--accent)]" />
                                <span className="font-medium">Training Logs</span>
                            </div>
                            {logs.length > 0 && (
                                <button
                                    onClick={() => setLogs([])}
                                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="bg-[var(--bg-primary)] rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs">
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={`mb-1 ${log.includes("[ERROR]")
                                                ? "text-[var(--error)]"
                                                : log.includes("[WARN]")
                                                    ? "text-[var(--warning)]"
                                                    : "text-[var(--text-muted)]"
                                            }`}
                                    >
                                        {log}
                                    </div>
                                ))
                            ) : (
                                <p className="text-[var(--text-muted)]">
                                    Training logs will appear here...
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="space-y-4">
                    {/* Progress */}
                    <div className="card p-5">
                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                            Progress
                        </p>

                        <div className="relative h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-3">
                            <div
                                className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                            <span>{progress}%</span>
                            <span>
                                {status === "training" ? `Step 0/${config.maxSteps}` : "—"}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {status === "idle" ? (
                            <button
                                onClick={handleStartTraining}
                                disabled={!datasetFile}
                                className={`btn w-full py-4 text-base font-semibold ${!datasetFile
                                        ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                                        : "btn-primary"
                                    }`}
                            >
                                <Play className="w-5 h-5" />
                                Start Training
                            </button>
                        ) : status === "training" || status === "preparing" ? (
                            <button
                                onClick={handleStopTraining}
                                className="btn btn-secondary w-full py-4 text-base font-semibold"
                            >
                                <Square className="w-5 h-5" />
                                Stop Training
                            </button>
                        ) : null}
                    </div>

                    {/* Status Card */}
                    <div className="card p-4">
                        {status === "idle" && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-[var(--text-muted)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        Ready to Train
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Upload dataset to begin
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "preparing" && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--warning-muted)] flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-[var(--warning)] animate-spin" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        Preparing...
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Processing dataset
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "training" && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        Training...
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        GPU: GTX 2060
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "completed" && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        Completed!
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Model saved
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--error-muted)] flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-[var(--error)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        Error
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Check logs for details
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="card p-4 bg-[var(--accent-muted)] border-[var(--accent)]">
                        <p className="text-sm font-medium text-[var(--accent)] mb-2">
                            💡 Tips
                        </p>
                        <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                            <li>• Audio phải sạch, không có tiếng ồn</li>
                            <li>• Văn bản phải khớp 100% với audio</li>
                            <li>• 5000 steps đủ cho giọng đơn lẻ</li>
                            <li>• GTX 2060: ~30 phút/1000 steps</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

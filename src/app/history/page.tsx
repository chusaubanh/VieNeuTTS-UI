"use client";

import { useState } from "react";
import { History as HistoryIcon, Play, Download, Trash2, Calendar, Clock, Volume2 } from "lucide-react";

interface HistoryItem {
    id: string;
    text: string;
    voice: string;
    duration: number;
    createdAt: string;
    audioUrl: string;
}

// Mock data - will be replaced with API calls
const mockHistory: HistoryItem[] = [];

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const handlePlay = (item: HistoryItem) => {
        // TODO: Play audio
        setPlayingId(item.id);
    };

    const handleDownload = (item: HistoryItem) => {
        // TODO: Download audio
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this audio?")) {
            setHistory((prev) => prev.filter((h) => h.id !== id));
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        History
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Lịch sử các audio đã generate
                    </p>
                </div>

                {history.length > 0 && (
                    <button className="btn btn-secondary">
                        <Trash2 className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* History List */}
            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item.id} className="card p-4 card-hover">
                            <div className="flex items-start gap-4">
                                {/* Play Button */}
                                <button
                                    onClick={() => handlePlay(item)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${playingId === item.id
                                            ? "bg-[var(--accent)]"
                                            : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)]"
                                        }`}
                                >
                                    {playingId === item.id ? (
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="audio-bar w-1 h-5"
                                                    style={{ animationDelay: `${i * 0.15}s` }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Play
                                            className={`w-5 h-5 ml-0.5 ${playingId === item.id
                                                    ? "text-white"
                                                    : "text-[var(--text-secondary)]"
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[var(--text-primary)] line-clamp-2 mb-2">
                                        {item.text}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <Volume2 className="w-3.5 h-3.5" />
                                            {item.voice}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDuration(item.duration)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {item.createdAt}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleDownload(item)}
                                        className="btn btn-ghost p-2"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn btn-ghost p-2 text-[var(--text-muted)] hover:text-[var(--error)]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <HistoryIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                        No History Yet
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                        Generated audio will appear here
                    </p>
                    <a href="/tts" className="btn btn-primary">
                        Generate Your First Audio
                    </a>
                </div>
            )}
        </div>
    );
}

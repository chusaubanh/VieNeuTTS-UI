"use client";

import { useState } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";

export interface Voice {
    id: string;
    name: string;
    description: string;
    type: "preset" | "lora" | "custom";
}

const defaultVoices: Voice[] = [
    {
        id: "ngoc-huyen",
        name: "Ngọc Huyền",
        description: "Giọng nữ miền Nam, trẻ trung",
        type: "lora",
    },
    {
        id: "default",
        name: "Default Voice",
        description: "Giọng mặc định VieNeu-TTS",
        type: "preset",
    },
];

interface VoiceSelectorProps {
    selectedVoice: Voice | null;
    onSelect: (voice: Voice) => void;
    voices?: Voice[];
}

export function VoiceSelector({
    selectedVoice,
    onSelect,
    voices = defaultVoices,
}: VoiceSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Voice
            </label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[var(--border-hover)] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedVoice?.type === "lora"
                                ? "bg-[var(--accent-muted)]"
                                : "bg-[var(--bg-elevated)]"
                            }`}
                    >
                        <span className="text-lg">
                            {selectedVoice?.type === "lora" ? "🎤" : "👤"}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)]">
                            {selectedVoice?.name || "Select a voice"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                            {selectedVoice?.description || "Choose voice for synthesis"}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-1 z-50 shadow-lg">
                    {voices.map((voice) => (
                        <button
                            key={voice.id}
                            onClick={() => {
                                onSelect(voice);
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${voice.type === "lora"
                                        ? "bg-[var(--accent-muted)]"
                                        : "bg-[var(--bg-tertiary)]"
                                    }`}
                            >
                                <span className="text-lg">
                                    {voice.type === "lora" ? "🎤" : "👤"}
                                </span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-[var(--text-primary)]">
                                        {voice.name}
                                    </p>
                                    {voice.type === "lora" && (
                                        <span className="badge badge-info text-[10px] py-0.5">
                                            LoRA
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">
                                    {voice.description}
                                </p>
                            </div>
                            {selectedVoice?.id === voice.id && (
                                <Check className="w-5 h-5 text-[var(--accent)]" />
                            )}
                        </button>
                    ))}

                    {/* Add Custom */}
                    <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Clone Voice...</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

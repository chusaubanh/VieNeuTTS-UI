"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    placeholder?: string;
    disabled?: boolean;
}

export function TextInput({
    value,
    onChange,
    maxLength = 500,
    placeholder = "Nhập văn bản tiếng Việt để chuyển thành giọng nói...",
    disabled = false,
}: TextInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const charCount = value.length;
    const isNearLimit = charCount > maxLength * 0.8;
    const isOverLimit = charCount > maxLength;

    const handleClear = () => {
        onChange("");
        textareaRef.current?.focus();
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
                placeholder={placeholder}
                disabled={disabled}
                className={`textarea min-h-[160px] pr-12 ${isOverLimit ? "border-[var(--error)]" : ""
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />

            {/* Clear Button */}
            {value.length > 0 && !disabled && (
                <button
                    onClick={handleClear}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Character Counter */}
            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[var(--text-muted)]">
                    Hỗ trợ tiếng Việt và tiếng Anh
                </p>
                <p
                    className={`text-xs font-mono ${isOverLimit
                            ? "text-[var(--error)]"
                            : isNearLimit
                                ? "text-[var(--warning)]"
                                : "text-[var(--text-muted)]"
                        }`}
                >
                    {charCount}/{maxLength}
                </p>
            </div>
        </div>
    );
}

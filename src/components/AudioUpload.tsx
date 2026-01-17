"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileAudio } from "lucide-react";

interface AudioUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    onClear: () => void;
    label?: string;
    description?: string;
    accept?: string[];
}

export function AudioUpload({
    onFileSelect,
    selectedFile,
    onClear,
    label = "Upload Audio",
    description = "Drop audio file here or click to browse",
    accept = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg"],
}: AudioUploadProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        maxFiles: 1,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (selectedFile) {
        return (
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center">
                        <FileAudio className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">
                            {selectedFile.name}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                            {formatFileSize(selectedFile.size)}
                        </p>
                    </div>
                    <button
                        onClick={onClear}
                        className="btn btn-ghost p-2 text-[var(--text-muted)] hover:text-[var(--error)]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`rounded-xl p-8 border-2 border-dashed cursor-pointer transition-all duration-200 ${isDragActive
                    ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)]"
                }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center">
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDragActive ? "bg-[var(--accent)]" : "bg-[var(--bg-elevated)]"
                        }`}
                >
                    <Upload className={`w-7 h-7 ${isDragActive ? "text-white" : "text-[var(--text-secondary)]"}`} />
                </div>
                <p className="font-medium text-[var(--text-primary)] mb-1">{label}</p>
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    WAV, MP3 • Max 10MB
                </p>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import {
    Layers,
    Download,
    Trash2,
    Play,
    ExternalLink,
    Plus,
    Check,
    Loader2,
} from "lucide-react";

interface LoraModel {
    id: string;
    name: string;
    description: string;
    source: "local" | "huggingface";
    repoId?: string;
    trainedAt?: string;
    isActive: boolean;
}

const mockModels: LoraModel[] = [
    {
        id: "ngoc-huyen",
        name: "Ngọc Huyền",
        description: "Giọng nữ miền Nam, trẻ trung - Vbee",
        source: "huggingface",
        repoId: "pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen",
        trainedAt: "2025-01-10",
        isActive: true,
    },
];

export default function ModelsPage() {
    const [models, setModels] = useState<LoraModel[]>(mockModels);
    const [isImporting, setIsImporting] = useState(false);
    const [importRepoId, setImportRepoId] = useState("");
    const [showImportForm, setShowImportForm] = useState(false);

    const handleImport = async () => {
        if (!importRepoId.trim()) return;

        setIsImporting(true);
        // TODO: Call backend API
        setTimeout(() => {
            setIsImporting(false);
            setShowImportForm(false);
            setImportRepoId("");
        }, 2000);
    };

    const handleActivate = (modelId: string) => {
        setModels((prev) =>
            prev.map((m) => ({ ...m, isActive: m.id === modelId }))
        );
    };

    const handleDelete = (modelId: string) => {
        if (confirm("Are you sure you want to delete this model?")) {
            setModels((prev) => prev.filter((m) => m.id !== modelId));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        LoRA Models
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Quản lý các voice model đã fine-tune
                    </p>
                </div>

                <button
                    onClick={() => setShowImportForm(true)}
                    className="btn btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    Import from HuggingFace
                </button>
            </div>

            {/* Import Form */}
            {showImportForm && (
                <div className="card p-4 border-[var(--accent)]">
                    <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                        <Download className="w-5 h-5 text-[var(--accent)]" />
                        <span className="font-medium">Import LoRA from HuggingFace</span>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={importRepoId}
                            onChange={(e) => setImportRepoId(e.target.value)}
                            placeholder="e.g., pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen"
                            className="input flex-1"
                        />
                        <button
                            onClick={handleImport}
                            disabled={isImporting || !importRepoId.trim()}
                            className="btn btn-primary"
                        >
                            {isImporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Import"
                            )}
                        </button>
                        <button
                            onClick={() => setShowImportForm(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Models List */}
            <div className="space-y-3">
                {models.map((model) => (
                    <div
                        key={model.id}
                        className={`card p-4 card-hover ${model.isActive ? "border-[var(--accent)]" : ""
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center ${model.isActive
                                        ? "bg-[var(--accent)]"
                                        : "bg-[var(--bg-tertiary)]"
                                    }`}
                            >
                                <Layers
                                    className={`w-7 h-7 ${model.isActive
                                            ? "text-white"
                                            : "text-[var(--text-secondary)]"
                                        }`}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        {model.name}
                                    </h3>
                                    {model.isActive && (
                                        <span className="badge badge-success">Active</span>
                                    )}
                                    <span className="badge badge-accent">
                                        {model.source === "huggingface" ? "HF" : "Local"}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {model.description}
                                </p>
                                {model.repoId && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                                        {model.repoId}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {!model.isActive && (
                                    <button
                                        onClick={() => handleActivate(model.id)}
                                        className="btn btn-secondary"
                                    >
                                        <Check className="w-4 h-4" />
                                        Activate
                                    </button>
                                )}
                                <button className="btn btn-ghost p-2">
                                    <Play className="w-4 h-4" />
                                </button>
                                {model.source === "huggingface" && (
                                    <a
                                        href={`https://huggingface.co/${model.repoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-ghost p-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => handleDelete(model.id)}
                                    className="btn btn-ghost p-2 text-[var(--text-muted)] hover:text-[var(--error)]"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {models.length === 0 && (
                    <div className="card p-12 text-center">
                        <Layers className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                            No Models Yet
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Import a LoRA model from HuggingFace to get started
                        </p>
                        <button
                            onClick={() => setShowImportForm(true)}
                            className="btn btn-primary"
                        >
                            <Plus className="w-4 h-4" />
                            Import Model
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * VieNeu TTS Studio - API Client
 * Frontend API client for communicating with FastAPI backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TTSGenerateRequest {
    text: string;
    voice_id?: string;
    streaming?: boolean;
}

interface TTSResponse {
    id: string;
    text: string;
    voice: string;
    audio_url: string;
    duration: number;
    created_at: string;
}

interface Voice {
    id: string;
    name: string;
    description: string;
    type: "preset" | "lora" | "custom";
}

interface LoraModel {
    id: string;
    name: string;
    description: string;
    source: string;
    repo_id?: string;
    is_active: boolean;
}

interface HistoryItem {
    id: string;
    text: string;
    voice: string;
    duration: number;
    created_at: string;
    audio_url: string;
}

interface TrainingStatus {
    job: {
        id: string;
        status: "idle" | "preparing" | "training" | "completed" | "error" | "stopped";
        progress: number;
        current_step: number;
        config: {
            base_model: string;
            max_steps: number;
            learning_rate: string;
            batch_size: number;
        };
        started_at?: string;
        completed_at?: string;
        error?: string;
    } | null;
    logs_count: number;
}

class APIClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE) {
        this.baseUrl = baseUrl;
    }

    private async fetch<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Health Check
    async health() {
        return this.fetch<{ status: string; gpu_available: boolean; model_loaded: boolean }>("/health");
    }

    // TTS
    async generateSpeech(request: TTSGenerateRequest): Promise<TTSResponse> {
        return this.fetch<TTSResponse>("/api/tts/generate", {
            method: "POST",
            body: JSON.stringify(request),
        });
    }

    async cloneVoice(text: string, refText: string, refAudio: File): Promise<TTSResponse> {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("ref_text", refText);
        formData.append("ref_audio", refAudio);

        const response = await fetch(`${this.baseUrl}/api/tts/clone`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail);
        }

        return response.json();
    }

    async getVoices(): Promise<{ voices: Voice[] }> {
        return this.fetch<{ voices: Voice[] }>("/api/tts/voices");
    }

    getAudioUrl(audioId: string): string {
        return `${this.baseUrl}/api/tts/audio/${audioId}`;
    }

    // Models
    async getModels(): Promise<LoraModel[]> {
        return this.fetch<LoraModel[]>("/api/models/");
    }

    async importModel(repoId: string): Promise<{ status: string; model: LoraModel }> {
        return this.fetch<{ status: string; model: LoraModel }>("/api/models/import", {
            method: "POST",
            body: JSON.stringify({ repo_id: repoId }),
        });
    }

    async activateModel(modelId: string): Promise<{ status: string }> {
        return this.fetch<{ status: string }>(`/api/models/${modelId}/activate`, {
            method: "POST",
        });
    }

    async deleteModel(modelId: string): Promise<{ status: string }> {
        return this.fetch<{ status: string }>(`/api/models/${modelId}`, {
            method: "DELETE",
        });
    }

    // Training
    async getTrainingStatus(): Promise<TrainingStatus> {
        return this.fetch<TrainingStatus>("/api/training/status");
    }

    async startTraining(
        config: { base_model: string; max_steps: number; learning_rate: string; batch_size: number },
        dataset: File,
        metadata: File
    ): Promise<{ status: string; job_id: string }> {
        const formData = new FormData();
        formData.append("base_model", config.base_model);
        formData.append("max_steps", config.max_steps.toString());
        formData.append("learning_rate", config.learning_rate);
        formData.append("batch_size", config.batch_size.toString());
        formData.append("dataset", dataset);
        formData.append("metadata", metadata);

        const response = await fetch(`${this.baseUrl}/api/training/start`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail);
        }

        return response.json();
    }

    async stopTraining(): Promise<{ status: string }> {
        return this.fetch<{ status: string }>("/api/training/stop", {
            method: "POST",
        });
    }

    async getTrainingLogs(offset = 0): Promise<{ logs: string[]; total: number }> {
        return this.fetch<{ logs: string[]; total: number }>(`/api/training/logs?offset=${offset}`);
    }

    // History
    async getHistory(limit = 50, offset = 0): Promise<HistoryItem[]> {
        return this.fetch<HistoryItem[]>(`/api/history/?limit=${limit}&offset=${offset}`);
    }

    async deleteHistoryItem(itemId: string): Promise<{ status: string }> {
        return this.fetch<{ status: string }>(`/api/history/${itemId}`, {
            method: "DELETE",
        });
    }

    async clearHistory(): Promise<{ status: string }> {
        return this.fetch<{ status: string }>("/api/history/", {
            method: "DELETE",
        });
    }
}

export const api = new APIClient();
export type { TTSResponse, Voice, LoraModel, HistoryItem, TrainingStatus };

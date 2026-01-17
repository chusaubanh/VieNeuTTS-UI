"use client";

import { useState } from "react";
import { Settings, Server, Palette, Bell, Save } from "lucide-react";

export default function SettingsPage() {
    const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState(true);
    const [autoPlay, setAutoPlay] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // TODO: Save settings
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Settings
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Cấu hình ứng dụng VieNeu TTS Studio
                </p>
            </div>

            {/* Backend Settings */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                    <Server className="w-5 h-5 text-[var(--accent)]" />
                    <span className="font-medium">Backend Server</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                            API URL
                        </label>
                        <input
                            type="text"
                            value={backendUrl}
                            onChange={(e) => setBackendUrl(e.target.value)}
                            className="input"
                            placeholder="http://localhost:8000"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            FastAPI backend server address
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                                Server Status
                            </span>
                        </div>
                        <span className="text-sm text-[var(--success)]">Connected</span>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                    <Palette className="w-5 h-5 text-[var(--accent)]" />
                    <span className="font-medium">Appearance</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                            Theme
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setTheme("dark")}
                                className={`flex-1 p-3 rounded-lg border transition-colors cursor-pointer ${theme === "dark"
                                        ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                                        : "border-[var(--border)] hover:border-[var(--border-hover)]"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#0A0A0F] border border-[var(--border)] mb-2" />
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Dark
                                </p>
                            </button>
                            <button
                                onClick={() => setTheme("light")}
                                className={`flex-1 p-3 rounded-lg border transition-colors cursor-pointer ${theme === "light"
                                        ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                                        : "border-[var(--border)] hover:border-[var(--border-hover)]"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 mb-2" />
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Light
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                    <Bell className="w-5 h-5 text-[var(--accent)]" />
                    <span className="font-medium">Preferences</span>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-sm text-[var(--text-primary)]">
                                Enable Notifications
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                                Notify when generation completes
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? "bg-[var(--accent)]" : "bg-[var(--bg-tertiary)]"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : ""
                                    }`}
                            />
                        </button>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-sm text-[var(--text-primary)]">
                                Auto-play Generated Audio
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                                Automatically play when generation finishes
                            </p>
                        </div>
                        <button
                            onClick={() => setAutoPlay(!autoPlay)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${autoPlay ? "bg-[var(--accent)]" : "bg-[var(--bg-tertiary)]"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${autoPlay ? "translate-x-5" : ""
                                    }`}
                            />
                        </button>
                    </label>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`btn ${saved ? "btn-secondary" : "btn-primary"}`}
                >
                    {saved ? (
                        <>
                            <span className="text-[var(--success)]">✓</span>
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

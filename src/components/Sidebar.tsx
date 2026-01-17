"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Mic,
    History,
    Database,
    Layers,
    Settings,
    Home,
} from "lucide-react";

const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/tts", label: "Text to Speech", icon: Mic },
    { href: "/training", label: "Training", icon: Database },
    { href: "/models", label: "LoRA Models", icon: Layers },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col z-50">
            {/* Logo */}
            <div className="h-[var(--header-height)] flex items-center gap-3 px-5 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        VieNeu TTS
                    </h1>
                    <p className="text-xs text-[var(--text-muted)]">Studio</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                        ? "bg-[var(--accent)] text-white shadow-md"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer - System Status */}
            <div className="p-4 border-t border-[var(--border)]">
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                            System Ready
                        </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                        GPU: GTX 2060 • 6GB
                    </p>
                </div>
            </div>
        </aside>
    );
}

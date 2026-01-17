"use client";

import { Search, User } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 left-[var(--sidebar-width)] right-0 h-[var(--header-height)] bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-6 z-40">
            {/* Search */}
            <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="input pl-11 py-2.5 text-sm rounded-xl"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* User */}
                <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border)]">
                        <User className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            Local User
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}

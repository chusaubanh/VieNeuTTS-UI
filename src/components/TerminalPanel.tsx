"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Terminal as TerminalIcon, X } from "lucide-react";

interface TerminalLine {
    type: "info" | "success" | "warning" | "error" | "command";
    text: string;
    timestamp?: string;
}

interface TerminalPanelProps {
    lines: TerminalLine[];
    title?: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function TerminalPanel({
    lines,
    title = "Terminal",
    isOpen = true,
    onToggle,
}: TerminalPanelProps) {
    const [isExpanded, setIsExpanded] = useState(isOpen);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        onToggle?.();
    };

    return (
        <div className="terminal">
            {/* Header */}
            <div className="terminal-header">
                <div className="flex items-center gap-3">
                    <div className="terminal-dots">
                        <div className="terminal-dot terminal-dot-red" />
                        <div className="terminal-dot terminal-dot-yellow" />
                        <div className="terminal-dot terminal-dot-green" />
                    </div>
                    <span className="terminal-title flex items-center gap-2">
                        <TerminalIcon className="w-3.5 h-3.5" />
                        {title}
                    </span>
                </div>
                <button
                    onClick={handleToggle}
                    className="p-1 hover:bg-[#3D3D3D] rounded transition-colors"
                >
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#9E9E9E]" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-[#9E9E9E]" />
                    )}
                </button>
            </div>

            {/* Body */}
            {isExpanded && (
                <div className="terminal-body">
                    {lines.length === 0 ? (
                        <div className="terminal-line text-[#6E6E6E]">
                            <span className="terminal-prompt">$</span> Waiting for commands...
                        </div>
                    ) : (
                        lines.map((line, index) => (
                            <div key={index} className={`terminal-line ${line.type}`}>
                                {line.timestamp && (
                                    <span className="text-[#6E6E6E] mr-2">[{line.timestamp}]</span>
                                )}
                                {line.type === "command" && (
                                    <span className="terminal-prompt mr-2">$</span>
                                )}
                                {line.text}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, RotateCcw, Download, Volume2 } from "lucide-react";

interface AudioPlayerProps {
    audioUrl: string | null;
    onDownload?: () => void;
}

export function AudioPlayer({ audioUrl, onDownload }: AudioPlayerProps) {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!waveformRef.current || !audioUrl) return;

        setIsLoading(true);
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#D1D1D1",
            progressColor: "#1A1A1A",
            cursorColor: "#1A1A1A",
            barWidth: 3,
            barGap: 2,
            barRadius: 3,
            height: 60,
            normalize: true,
        });

        wavesurfer.current.load(audioUrl);

        wavesurfer.current.on("ready", () => {
            setDuration(wavesurfer.current?.getDuration() || 0);
            setIsLoading(false);
        });

        wavesurfer.current.on("audioprocess", () => {
            setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
        });

        wavesurfer.current.on("play", () => setIsPlaying(true));
        wavesurfer.current.on("pause", () => setIsPlaying(false));
        wavesurfer.current.on("finish", () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        return () => {
            wavesurfer.current?.destroy();
        };
    }, [audioUrl]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const togglePlayPause = () => {
        wavesurfer.current?.playPause();
    };

    const restart = () => {
        wavesurfer.current?.seekTo(0);
        wavesurfer.current?.play();
    };

    if (!audioUrl) {
        return (
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-8 flex flex-col items-center justify-center">
                <Volume2 className="w-10 h-10 text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-muted)]">
                    No audio generated yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
            {/* Waveform */}
            <div className="mb-4">
                {isLoading ? (
                    <div className="h-[60px] flex items-center justify-center">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 h-8 bg-[var(--accent)] rounded animate-pulse"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div ref={waveformRef} />
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlayPause}
                        className="btn btn-primary p-3"
                        disabled={isLoading}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={restart}
                        className="btn btn-secondary p-3"
                        disabled={isLoading}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                <div className="text-sm text-[var(--text-muted)] font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {onDownload && (
                    <button onClick={onDownload} className="btn btn-secondary">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                )}
            </div>
        </div>
    );
}

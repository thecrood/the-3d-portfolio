"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Play, Pause, Square, Volume2, VolumeX, X, Sparkles, Music, Upload, ArrowUpRight } from "lucide-react";
import { MUSIC_DISCS } from "@/data/musicDiscs";
import { soundFX } from "@/utils/soundFX";

export default function JukeboxModal({ isOpen, onClose, currentDisc, isPlaying, onSelectDisc, onTogglePlay, onEject }) {
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(soundFX.isMuted);
  const [customUrl, setCustomUrl] = useState("");
  const [customError, setCustomError] = useState("");
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundFX.setVolume(val / 100);
  };

  const handleMuteToggle = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  // Real-time audio frequency visualizer canvas in neo-brutalist style
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const freqData = soundFX.getFrequencyData();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barCount = 24;
      const barWidth = Math.floor(canvas.width / barCount) - 3;
      const primaryColor = currentDisc?.color || "#10b981";

      for (let i = 0; i < barCount; i++) {
        const freqIndex = Math.min(freqData.length - 1, Math.floor(Math.pow(i / barCount, 1.3) * freqData.length));
        const rawVal = isPlaying && !soundFX.isMuted ? freqData[freqIndex] || 0 : 4;
        const normalized = Math.max(4, (rawVal / 255) * canvas.height * 0.88);

        const x = i * (barWidth + 3) + 2;
        const y = canvas.height - normalized - 2;

        // Solid bar with sharp black border (neo-brutalist)
        ctx.fillStyle = primaryColor;
        ctx.fillRect(x, y, barWidth, normalized);

        ctx.strokeStyle = "#090d16";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, barWidth, normalized);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, currentDisc]);

  const handleCustomPlay = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    try {
      soundFX.playMusicDisc("custom", customUrl.trim());
      onSelectDisc({
        id: "custom",
        title: "Custom Stream",
        artist: "Web Audio",
        color: "#f59e0b",
        mood: "Custom User Stream",
        badge: "CUSTOM DISC",
      });
      setCustomError("");
    } catch (err) {
      setCustomError("Could not load audio stream.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    soundFX.playMusicDisc("custom", url);
    onSelectDisc({
      id: "custom",
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      color: "#f59e0b",
      mood: "Custom Upload",
      badge: "USER RECORD",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 font-mono select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
          />

          {/* NEO-BRUTALIST MODAL CONTAINER */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border-4 border-slate-950 bg-[#fdfbf7] text-slate-950 shadow-[10px_10px_0px_0px_#090d16]"
          >
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b-4 border-slate-950 bg-amber-300 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-3 border-slate-950 bg-white shadow-[3px_3px_0px_0px_#090d16]">
                  <Disc3 className={`h-6 w-6 text-slate-950 ${isPlaying ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border-2 border-slate-950 bg-slate-950 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-amber-300 shadow-[2px_2px_0px_0px_#ffffff]">
                      SYSTEM // JUKEBOX_01
                    </span>
                    <span className="hidden sm:inline text-xs font-black text-slate-950">
                      AUDIO: UNCOMPRESSED
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-0.5">
                    Voxel Jukebox & Music Discs
                  </h2>
                </div>
              </div>

              {/* Tactile Close Button */}
              <button
                onClick={() => {
                  soundFX.playBlip(440);
                  onClose();
                }}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-3 border-slate-950 bg-rose-300 text-slate-950 font-black shadow-[4px_4px_0px_0px_#090d16] hover:bg-rose-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
                aria-label="Close Jukebox"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            {/* Turntable Deck */}
            <div className="border-b-4 border-slate-950 bg-amber-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Vinyl Record Turntable */}
                <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 items-center justify-center rounded-2xl border-3 border-slate-950 bg-white shadow-[5px_5px_0px_0px_#090d16]">
                  {/* Spinning Vinyl Record */}
                  <div
                    className={`relative flex h-24 w-24 sm:h-26 sm:w-26 items-center justify-center rounded-full border-3 border-slate-950 bg-slate-950 shadow-md ${
                      isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                    }`}
                  >
                    <div className="absolute inset-2 rounded-full border border-slate-800" />
                    <div className="absolute inset-4 rounded-full border border-slate-800" />

                    {/* Disc Center Label */}
                    <div
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-slate-950 shadow"
                      style={{ backgroundColor: currentDisc?.discColor || "#10b981" }}
                    >
                      <div className="h-3 w-3 rounded-full bg-slate-950" />
                    </div>
                  </div>
                </div>

                {/* Track Details & Controls */}
                <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                    <span className="rounded-lg border-2 border-slate-950 bg-white px-2.5 py-0.5 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                      {currentDisc?.badge || "READY TO INSERT"}
                    </span>

                    <span className="text-xs font-black">
                      {isPlaying ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-slate-950 bg-lime-300 px-2 py-0.5 text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                          <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
                          STATUS: PLAYING
                        </span>
                      ) : (
                        <span className="rounded-md border-2 border-slate-950 bg-slate-200 px-2 py-0.5 text-slate-700">
                          STATUS: IDLE
                        </span>
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                      {currentDisc?.title || "No Disc Inserted"}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 font-sans">
                      {currentDisc ? `${currentDisc.artist} · ${currentDisc.mood}` : "Select any disc below to start music"}
                    </p>
                  </div>

                  {/* Equalizer Spectrum Bar */}
                  <div className="h-10 w-full overflow-hidden rounded-xl border-3 border-slate-950 bg-white p-1 shadow-[3px_3px_0px_0px_#090d16]">
                    <canvas ref={canvasRef} width={360} height={32} className="h-full w-full" />
                  </div>

                  {/* Tactile Deck Buttons (Play, Eject, Volume) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onTogglePlay}
                        className="flex items-center gap-1.5 rounded-xl border-3 border-slate-950 bg-lime-300 px-4 py-2 text-xs font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-lime-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer uppercase"
                      >
                        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                        <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
                      </button>

                      <button
                        onClick={onEject}
                        className="flex items-center gap-1.5 rounded-xl border-3 border-slate-950 bg-rose-200 px-3.5 py-2 text-xs font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-rose-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer uppercase"
                      >
                        <Square className="h-3.5 w-3.5 fill-current" />
                        <span>EJECT</span>
                      </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-2 rounded-xl border-2 border-slate-950 bg-white px-3 py-1.5 shadow-[3px_3px_0px_0px_#090d16]">
                      <button onClick={handleMuteToggle} className="text-slate-950" aria-label="Mute toggle">
                        {isMuted ? <VolumeX className="h-4 w-4 text-red-600" /> : <Volume2 className="h-4 w-4 text-slate-950" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-2 w-20 sm:w-28 cursor-pointer appearance-none rounded-lg bg-slate-300 accent-slate-950"
                      />
                      <span className="text-[10px] font-black text-slate-950 w-6">{volume}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Music Discs Grid */}
            <div className="p-5 sm:p-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                  <Disc3 className="h-4 w-4" />
                  <span>COLLECTED MUSIC DISCS ({MUSIC_DISCS.length})</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-600">Click any disc to insert into turntable</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MUSIC_DISCS.map((disc) => {
                  const isCurrent = currentDisc?.id === disc.id;
                  return (
                    <div
                      key={disc.id}
                      onClick={() => onSelectDisc(disc)}
                      className={`group relative flex items-center gap-3.5 rounded-xl border-3 border-slate-950 p-3 transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-amber-200 shadow-[4px_4px_0px_0px_#090d16] translate-x-[2px] translate-y-[2px]"
                          : "bg-white shadow-[4px_4px_0px_0px_#090d16] hover:bg-amber-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16]"
                      }`}
                    >
                      {/* Vinyl Graphic */}
                      <div
                        className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-950 shadow-sm"
                        style={{ backgroundColor: "#0f172a" }}
                      >
                        <div
                          className="h-5 w-5 rounded-full border border-slate-950"
                          style={{ backgroundColor: disc.discColor }}
                        />
                        <div className="absolute h-1.5 w-1.5 rounded-full bg-white" />
                      </div>

                      {/* Disc Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-sm font-black text-slate-950 truncate">
                            {disc.title}
                          </h5>
                          <span className="rounded border border-slate-950 bg-white px-1.5 py-0.2 text-[10px] font-black">
                            {disc.bpm} BPM
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 truncate">{disc.artist} · {disc.album}</p>
                        <p className="text-[10px] text-slate-600 truncate mt-0.5 font-sans">{disc.mood}</p>
                      </div>

                      {/* Action Pill */}
                      <div className="flex-shrink-0">
                        {isCurrent && isPlaying ? (
                          <span className="rounded-lg border-2 border-slate-950 bg-lime-300 px-2 py-1 text-[10px] font-black text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                            PLAYING
                          </span>
                        ) : (
                          <span className="rounded-lg border-2 border-slate-950 bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-950 shadow-[2px_2px_0px_0px_#090d16] group-hover:bg-amber-300">
                            INSERT
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Stream Input */}
              <div className="mt-4 rounded-xl border-3 border-slate-950 bg-amber-50 p-4 shadow-[4px_4px_0px_0px_#090d16]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                    <Music className="h-3.5 w-3.5 text-amber-600" />
                    <span>PLAY CUSTOM AUDIO URL / MP3</span>
                  </span>
                  <label className="flex items-center gap-1 text-[11px] font-black text-slate-950 cursor-pointer rounded-lg border-2 border-slate-950 bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_#090d16] hover:bg-slate-100">
                    <Upload className="h-3 w-3" />
                    <span>UPLOAD MP3</span>
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <form onSubmit={handleCustomPlay} className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/soundtrack.mp3"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 rounded-xl border-2 border-slate-950 bg-white px-3 py-2 text-xs font-bold text-slate-950 shadow-[2px_2px_0px_0px_#090d16] focus:bg-yellow-50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl border-2 border-slate-950 bg-amber-300 px-4 py-2 text-xs font-black text-slate-950 shadow-[3px_3px_0px_0px_#090d16] hover:bg-amber-400 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#090d16] transition"
                  >
                    PLAY URL ↗
                  </button>
                </form>
                {customError && <p className="text-[10px] font-bold text-red-600 mt-1">{customError}</p>}
              </div>
            </div>

            {/* Footer Bar */}
            <div className="border-t-4 border-slate-950 bg-slate-100 px-6 py-3 text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>PRESS <kbd className="border border-slate-950 bg-white px-1.5 py-0.5 rounded text-slate-950">ESC</kbd> TO RETURN</span>
              <button onClick={onClose} className="font-black text-slate-950 hover:underline">
                [ DISMISS // ✕ ]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

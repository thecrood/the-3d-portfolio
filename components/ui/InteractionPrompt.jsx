"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Sparkles } from "lucide-react";

export default function InteractionPrompt({ station, isNearJukebox, onInteractStation, onInteractJukebox }) {
  const showPrompt = Boolean(station || isNearJukebox);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          className="fixed top-6 left-1/2 z-50 -translate-x-1/2 font-mono select-none"
        >
          {isNearJukebox && !station ? (
            <div className="rounded-xl border-3 border-slate-950 bg-amber-300 px-5 py-2.5 text-center shadow-[5px_5px_0px_0px_#090d16]">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-950 flex items-center justify-center gap-1.5">
                <Disc3 className="h-3.5 w-3.5 text-slate-950" />
                <span>SYSTEM // VOXEL_JUKEBOX</span>
              </div>
              <button
                type="button"
                onClick={onInteractJukebox}
                className="mt-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-slate-950 cursor-pointer hover:underline"
              >
                <kbd className="rounded border-2 border-slate-950 bg-white px-2 py-0.5 text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                  J
                </kbd>
                <span>USE JUKEBOX (MUSIC DISCS) ↗</span>
              </button>
            </div>
          ) : station ? (
            <div className="rounded-xl border-3 border-slate-950 bg-emerald-200 px-5 py-2.5 text-center shadow-[5px_5px_0px_0px_#090d16]">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-950 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 text-slate-950" />
                <span>{station.title.toUpperCase()}</span>
              </div>
              <button
                type="button"
                onClick={onInteractStation}
                className="mt-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-slate-950 cursor-pointer hover:underline"
              >
                <kbd className="rounded border-2 border-slate-950 bg-white px-2 py-0.5 text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                  E
                </kbd>
                <span>OPEN RELIC CHEST ↗</span>
              </button>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

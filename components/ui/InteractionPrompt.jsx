"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function InteractionPrompt({ station, onInteract }) {
  return (
    <AnimatePresence>
      {station && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed top-6 left-1/2 z-50 -translate-x-1/2 font-mono"
        >
          <div className="rounded-xl border border-amber-200/70 bg-black/70 px-4 py-2 text-center shadow-2xl backdrop-blur-md">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">{station.title}</div>
            <button type="button" onClick={onInteract} className="mt-1 text-sm font-extrabold text-white"><kbd className="rounded bg-white/20 px-1.5 py-0.5 text-lime-300">E</kbd> Open Chest</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

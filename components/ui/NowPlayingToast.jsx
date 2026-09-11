"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3 } from "lucide-react";

export default function NowPlayingToast({ currentDisc, isPlaying }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentDisc && isPlaying) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [currentDisc, isPlaying]);

  return (
    <AnimatePresence>
      {visible && currentDisc && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -25, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none font-mono select-none"
        >
          {/* NEO-BRUTALIST TOAST BANNER */}
          <div className="flex items-center gap-3 rounded-xl border-3 border-slate-950 bg-amber-200 px-4 py-2.5 shadow-[5px_5px_0px_0px_#090d16] text-slate-950">
            {/* Spinning Disc Badge */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 shadow-sm animate-[spin_3s_linear_infinite]"
              style={{ backgroundColor: currentDisc.discColor || "#10b981" }}
            >
              <Disc3 className="h-4 w-4 text-slate-950" />
            </div>

            {/* Banner text */}
            <div className="text-left min-w-0">
              <div className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-slate-950 min-w-0">
                <span className="flex-shrink-0">NOW PLAYING //</span>
                <span className="truncate max-w-[150px] sm:max-w-[280px]">{currentDisc.artist} - {currentDisc.title}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-700 truncate max-w-[220px] sm:max-w-[340px]">
                {currentDisc.mood}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

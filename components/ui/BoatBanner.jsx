"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function BoatBanner({ playerPosition }) {
  // Check if player is on or very near the boat (0, 40)
  const distance = playerPosition ? Math.hypot((playerPosition.x || 0) - 0, (playerPosition.z || 0) - 40) : 100;
  const isOnBoat = distance < 15;

  return (
    <AnimatePresence>
      {isOnBoat && (
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.92 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none font-mono"
        >
          {/* NEO-BRUTALIST VOYAGE BANNER */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border-3 border-slate-950 bg-sky-200 px-4 py-3 shadow-[5px_5px_0px_0px_#090d16] text-slate-950">
            {/* Anchor Badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-950 bg-white text-lg flex-shrink-0 shadow-[2px_2px_0px_0px_#090d16]">
              ⚓
            </div>

            {/* Banner Text — short labels only */}
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-950">
                VOYAGE_ACTIVE
              </div>
              <div className="text-xs font-black uppercase text-slate-950">
                Explore Island
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

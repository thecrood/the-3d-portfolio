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
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all duration-300
            bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.6)]
            hover:shadow-[0_0_32px_rgba(34,211,238,0.8)] hover:scale-105 cursor-default">
            
            {/* Boat Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-lg flex-shrink-0
              bg-cyan-500/40 border-2 border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              ⚓
            </div>

            {/* Boat Banner Text */}
            <div className="text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                ⛵ Voyage Started
              </div>
              <div className="text-sm font-semibold text-cyan-100">
                Explore the island
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

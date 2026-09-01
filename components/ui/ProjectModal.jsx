"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Send, Sparkles, BookOpen, Code2 } from "lucide-react";
import { soundFX } from "@/utils/soundFX";

export default function ProjectModal({ project, isOpen, onClose }) {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFX.playChestOpen();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      if (onClose) onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto font-mono">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFX.playBlip(440);
            onClose();
          }}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#1c1917]/70 border-2 border-white/20 p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-slate-100 custom-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={() => {
              soundFX.playBlip(440);
              onClose();
            }}
            className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-lime-500/30 text-white border border-white/20 hover:border-lime-400 backdrop-blur-sm transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {project ? (
            /* Project Details View */
            <div className="space-y-6 font-sans">
              <div className="flex items-center gap-2 text-xs font-mono text-lime-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>RELIC SCROLL // {project.id}</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {project.title}
                </h2>
                <p className="text-sm md:text-base text-yellow-300 font-semibold mt-1 font-mono drop-shadow-sm">
                  {project.tagline}
                </p>
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/15 font-mono text-xs text-yellow-300 backdrop-blur-sm">
                ⚡ ENCHANTED ATTRIBUTES: {project.metrics}
              </div>

              <p className="text-slate-100 leading-relaxed text-sm md:text-base font-normal drop-shadow-sm">
                {project.description}
              </p>

              <div>
                <h3 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider mb-3">
                  Architectural Innovations
                </h3>
                <ul className="space-y-2.5">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-100">
                      <span className="text-lime-400 font-bold font-mono">▸</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider mb-2.5">
                  Technology Components
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-black/50 border border-white/20 rounded-lg text-xs font-mono text-cyan-300 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/15 font-mono">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFX.playChestOpen()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 via-emerald-500 to-green-600 text-black font-extrabold text-sm hover:shadow-[0_0_25px_rgba(132,204,22,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live World</span>
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFX.playBlip(660)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Source Repository</span>
                </a>
              </div>
            </div>
          ) : (
            /* Transmission / Contact View */
            <div className="space-y-6 font-sans">
              <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>DIRECT PARCHMENT COMMUNICATION</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  Send a Carrier Message
                </h2>
                <p className="text-sm text-slate-200 mt-1 font-sans">
                  Have an ambitious 3D web project, high-performance web platform, or creative technical quest? Send a message directly to my inbox.
                </p>
              </div>

              {formSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 text-center space-y-3 backdrop-blur-md"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <div className="text-lg font-bold text-emerald-300 font-mono">
                    PARCHMENT LETTER DISPATCHED
                  </div>
                  <p className="text-sm text-slate-100 font-sans">
                    Thank you! Your message has been received. I will review and reply within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-200 uppercase mb-1.5 font-bold">
                      Adventurer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Explorer Sarah Chen"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 text-white text-sm outline-none backdrop-blur-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-200 uppercase mb-1.5 font-bold">
                      Carrier Frequency (Email Address)
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@studio.io"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 text-white text-sm outline-none backdrop-blur-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-200 uppercase mb-1.5 font-bold">
                      Quest Scope (Project Message)
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project vision, timeline, and architectural targets..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 text-white text-sm outline-none backdrop-blur-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-lime-500 via-emerald-500 to-green-600 text-black font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] transition-all duration-300 cursor-pointer font-mono"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Carrier Parchment</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

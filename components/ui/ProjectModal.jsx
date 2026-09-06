"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Send, Sparkles, BookOpen, Code2, Terminal, ArrowRight } from "lucide-react";
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
    }, 2400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 font-mono select-none pointer-events-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFX.playBlip(440);
            onClose();
          }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
        />

        {/* NEO-BRUTALIST RETRO MODAL WINDOW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border-4 border-slate-950 bg-[#fdfbf7] text-slate-950 shadow-[10px_10px_0px_0px_#090d16] custom-scrollbar"
        >
          {/* Header Banner */}
          <div className={`flex items-center justify-between border-b-4 border-slate-950 ${project ? "bg-purple-300" : "bg-emerald-300"} p-4 sm:p-5`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-xl shadow-[3px_3px_0px_0px_#090d16]">
                {project ? "🔮" : "✉️"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded border-2 border-slate-950 bg-slate-950 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-lime-300 shadow-[2px_2px_0px_0px_#ffffff]">
                    {project ? `RELIC // ${project.id.toUpperCase()}` : "CARRIER PIGEON // UPLINK"}
                  </span>
                  <span className="hidden sm:inline text-xs font-black text-slate-950">
                    CLEARANCE: AUTHORIZED
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-0.5">
                  {project ? project.title : "Send a Parchment Letter"}
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
              aria-label="Close modal"
            >
              <X className="h-5 w-5 stroke-[3]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 md:p-8">
            {project ? (
              /* Project Details View */
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm font-bold text-purple-900 mt-1">
                    {project.tagline}
                  </p>
                </div>

                {/* Neo-brutalist Attributes Callout */}
                <div className="rounded-xl border-3 border-slate-950 bg-yellow-200 p-4 shadow-[4px_4px_0px_0px_#090d16] font-mono text-xs font-black text-slate-950 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span>METRICS & TELEMETRY: {project.metrics}</span>
                </div>

                {/* Project Description */}
                <div className="rounded-xl border-3 border-slate-950 bg-white p-5 shadow-[4px_4px_0px_0px_#090d16]">
                  <h4 className="text-xs font-black uppercase text-slate-950 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <span>OVERVIEW & SPECS</span>
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium font-sans">
                    {project.description}
                  </p>
                </div>

                {/* Architectural Features */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-3 flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-purple-600" />
                    <span>ARCHITECTURAL INNOVATIONS</span>
                  </h4>
                  <div className="space-y-2 font-sans">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border-2 border-slate-950 bg-purple-50 p-3 shadow-[3px_3px_0px_0px_#090d16] flex items-start gap-2.5 text-xs sm:text-sm text-slate-900 font-medium"
                      >
                        <span className="font-mono font-black text-purple-600">0{idx + 1} //</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-2.5 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-purple-600" />
                    <span>SYSTEM DEPENDENCIES</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border-2 border-slate-950 bg-white px-3 py-1 text-xs font-black text-slate-950 shadow-[3px_3px_0px_0px_#090d16]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-3 border-t-3 border-slate-950">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border-3 border-slate-950 bg-emerald-300 px-6 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[5px_5px_0px_0px_#090d16] hover:bg-emerald-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer"
                  >
                    <span>LAUNCH PRODUCTION ↗</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border-3 border-slate-950 bg-white px-6 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-slate-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] transition-all cursor-pointer"
                  >
                    <span>SOURCE REPOSITORY ↗</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Contact Parchment Terminal */
              <div className="space-y-5">
                <div className="rounded-xl border-3 border-slate-950 bg-emerald-100 p-4 shadow-[4px_4px_0px_0px_#090d16]">
                  <h3 className="text-lg font-black text-slate-950">Direct Transmission to Rohit Chaudhary</h3>
                  <p className="text-xs text-slate-800 font-sans font-medium mt-1">
                    Reach out regarding Lead Software Engineer roles, Generative AI / Agentic AI consulting, or high-impact backend systems.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2.5 text-xs font-mono font-black text-slate-950">
                    <span className="rounded border border-slate-950 bg-white px-2 py-0.5 shadow-[1px_1px_0px_0px_#090d16]">
                      ✉️ thetuesday96@gmail.com
                    </span>
                    <span className="rounded border border-slate-950 bg-white px-2 py-0.5 shadow-[1px_1px_0px_0px_#090d16]">
                      📞 +91-8988449288
                    </span>
                  </div>
                </div>

                {formSent ? (
                  <div className="rounded-2xl border-4 border-slate-950 bg-lime-300 p-8 text-center shadow-[6px_6px_0px_0px_#090d16]">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-slate-950 mb-3 stroke-[2.5]" />
                    <h4 className="text-xl font-black text-slate-950 uppercase">PARCHMENT TRANSMITTED!</h4>
                    <p className="text-xs font-bold text-slate-900 mt-2 font-mono">
                      Your message has been sent to Rohit Chaudhary at thetuesday96@gmail.com.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-950 mb-1.5">
                        RECRUITER / SENDER NAME & ORGANIZATION
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Hiring Manager / Tech Lead / Studio"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border-3 border-slate-950 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[3px_3px_0px_0px_#090d16] focus:bg-yellow-50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-950 mb-1.5">
                        DISPATCH FREQUENCY (EMAIL)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@studio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border-3 border-slate-950 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[3px_3px_0px_0px_#090d16] focus:bg-yellow-50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-950 mb-1.5">
                        SCROLL MESSAGE // QUEST PROPOSAL
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="State your quest, contract scope, or technical challenge..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border-3 border-slate-950 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[3px_3px_0px_0px_#090d16] focus:bg-yellow-50 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-3 border-slate-950 bg-emerald-300 py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-[5px_5px_0px_0px_#090d16] hover:bg-emerald-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer uppercase"
                    >
                      <Send className="h-4 w-4 stroke-[2.5]" />
                      <span>DISPATCH PARCHMENT ↗</span>
                    </button>
                  </form>
                )}
              </div>
            )}
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
    </AnimatePresence>
  );
}

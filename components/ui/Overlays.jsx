"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useEffect } from "react";
import { soundFX } from "@/utils/soundFX";

export default function Overlays({ station, onClose, onOpenProject, onOpenContact }) {
  useEffect(() => {
    if (station) {
      soundFX.playSoothingTone();
    }
  }, [station]);

  return <AnimatePresence>{station && <>
    <motion.button aria-label="Close station panel" onClick={onClose} className="fixed inset-0 z-40 cursor-default" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
    <motion.aside initial={{ opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 18 }} transition={{ type: "spring", damping: 26, stiffness: 280 }} className="fixed inset-x-3 top-1/2 z-50 max-h-[90dvh] w-auto -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/1 p-6 text-white shadow-2xl sm:left-1/2 sm:w-[min(92vw,56rem)] sm:-translate-x-1/2 sm:p-8">
      <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X /></button>
      <p className="text-xs font-bold tracking-[.2em]" style={{ color: station.color }}>{station.badge}</p>
      <h2 className="mt-3 pr-10 text-3xl font-black">{station.title}</h2>
      <p className="mt-2 text-slate-300">{station.subtitle}</p>
      <div className="my-7 border-t border-white/10" />
      {station.id === 1 && <section><h3 className="text-xl font-bold">{PORTFOLIO_DATA.profile.name}</h3><p className="mt-3 leading-7 text-slate-300">{PORTFOLIO_DATA.profile.bio}</p><div className="mt-6 grid grid-cols-2 gap-3">{PORTFOLIO_DATA.profile.stats.map((item) => <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3"><b className="text-lg text-lime-300">{item.value}</b><p className="text-xs text-slate-400">{item.label}</p></div>)}</div></section>}
      {station.id === 2 && <section><h3 className="text-xl font-bold">Creative engineering</h3><div className="mt-4 space-y-3">{PORTFOLIO_DATA.skillCategories[0].skills.map((skill) => <div key={skill.name} className="rounded-xl border border-white/10 p-3"><div className="flex justify-between font-semibold"><span>{skill.name}</span><span style={{ color: station.color }}>{skill.level}%</span></div><p className="mt-1 text-sm text-slate-400">{skill.desc}</p></div>)}</div></section>}
      {station.id === 3 && <section><h3 className="text-xl font-bold">Guild history</h3><div className="mt-4 space-y-4">{PORTFOLIO_DATA.experiences.map((item) => <article key={item.company} className="border-l-2 pl-4" style={{ borderColor: station.color }}><b>{item.role}</b><p className="text-sm text-slate-400">{item.company} · {item.period}</p><p className="mt-2 text-sm text-slate-300">{item.description}</p></article>)}</div></section>}
      {station.id === 4 && <section><h3 className="text-xl font-bold">Crafted tool arsenal</h3>{PORTFOLIO_DATA.skillCategories.slice(1).map((group) => <div key={group.category} className="mt-5"><h4 className="font-semibold text-amber-300">{group.category}</h4><p className="mt-2 text-sm text-slate-300">{group.skills.map((skill) => skill.name).join(" · ")}</p></div>)}</section>}
      {station.id === 5 && <section><h3 className="text-xl font-bold">Flagship relics</h3><div className="mt-4 space-y-3">{PORTFOLIO_DATA.projects.map((project) => <button onClick={() => onOpenProject(project)} key={project.id} className="flex w-full items-center justify-between rounded-xl border border-white/10 p-4 text-left hover:border-pink-400/60"><span><b>{project.title}</b><small className="mt-1 block text-slate-400">{project.tagline}</small></span><ExternalLink className="h-4 w-4" /></button>)}</div><button onClick={onOpenContact} className="mt-6 rounded-xl bg-pink-500 px-5 py-3 font-bold text-black">Send a parchment</button></section>}
    </motion.aside>
  </>}</AnimatePresence>;
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ExternalLink, Sparkles, Terminal, Award, Mail, Phone, Cpu, FolderGit2, GraduationCap, Heart, FileText, Check, Copy } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { soundFX } from "@/utils/soundFX";

export default function Overlays({ station, onClose, onOpenProject, onOpenContact }) {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      soundFX.playBlip(700);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  useEffect(() => {
    if (station) {
      soundFX.playChestOpen();
    }
  }, [station]);

  if (!station) return null;

  // Neo-brutalist pastel themes per station
  const stationThemes = {
    1: {
      cardBg: "bg-[#fdfbf7]",
      bannerBg: "bg-emerald-300",
      accentBg: "bg-emerald-200",
      badgeBg: "bg-emerald-400",
      borderCol: "border-slate-950",
      tagText: "SYSTEM // 01 : BIO_DOSSIER",
    },
    2: {
      cardBg: "bg-[#fdfbf7]",
      bannerBg: "bg-sky-300",
      accentBg: "bg-sky-200",
      badgeBg: "bg-sky-400",
      borderCol: "border-slate-950",
      tagText: "SYSTEM // 02 : AGENTIC_AI_LAB",
    },
    3: {
      cardBg: "bg-[#fdfbf7]",
      bannerBg: "bg-purple-300",
      accentBg: "bg-purple-200",
      badgeBg: "bg-purple-400",
      borderCol: "border-slate-950",
      tagText: "SYSTEM // 03 : INDUSTRY_RECORD",
    },
    4: {
      cardBg: "bg-[#fdfbf7]",
      bannerBg: "bg-amber-300",
      accentBg: "bg-amber-200",
      badgeBg: "bg-amber-400",
      borderCol: "border-slate-950",
      tagText: "SYSTEM // 04 : TECH_TOOLKIT",
    },
    5: {
      cardBg: "bg-[#fdfbf7]",
      bannerBg: "bg-rose-300",
      accentBg: "bg-rose-200",
      badgeBg: "bg-rose-400",
      borderCol: "border-slate-950",
      tagText: "SYSTEM // 05 : PRODUCTION_SOLUTIONS",
    },
  };

  const theme = stationThemes[station.id] || stationThemes[1];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 font-mono select-none">
        {/* Backdrop overlay */}
        <motion.div
          aria-label="Close panel"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
        />

        {/* NEO-BRUTALIST RETRO POPUP CARD */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className={`relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-4 border-slate-950 ${theme.cardBg} text-slate-950 shadow-[10px_10px_0px_0px_#090d16] custom-scrollbar`}
        >
          {/* Header Banner Strip */}
          <div className={`flex items-center justify-between border-b-4 border-slate-950 ${theme.bannerBg} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-xl shadow-[3px_3px_0px_0px_#090d16]">
                {station.itemIcon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded border-2 border-slate-950 bg-slate-950 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-lime-300 shadow-[2px_2px_0px_0px_#ffffff]">
                    {theme.tagText}
                  </span>
                  <span className="hidden sm:inline text-xs font-black text-slate-950">
                    STATION {station.level} · CLEARANCE_LEVEL_5
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-0.5">
                  {station.title}
                </h2>
              </div>
            </div>

            {/* Tactile Close Button */}
            <button
              onClick={() => {
                soundFX.playBlip(540);
                onClose();
              }}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-3 border-slate-950 bg-rose-300 text-slate-950 font-black shadow-[4px_4px_0px_0px_#090d16] hover:bg-rose-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              aria-label="Close station popup"
            >
              <X className="h-5 w-5 stroke-[3]" />
            </button>
          </div>

          {/* Subtitle / Description bar */}
          <div className="border-b-2 border-slate-950 bg-amber-50 px-5 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-slate-950" />
              <span>{station.subtitle}</span>
            </span>
            <span className="hidden md:inline text-[11px] font-black uppercase bg-white px-2 py-0.5 border border-slate-950 rounded shadow-[1px_1px_0px_0px_#090d16]">
              STATUS: ONLINE
            </span>
          </div>

          {/* Main Station Content Area */}
          <div className="p-5 sm:p-7 md:p-8 space-y-6 font-sans">
            {/* ---------------------------------------------------- */}
            {/* STATION 1: ABOUT & PROFILE                           */}
            {/* ---------------------------------------------------- */}
            {station.id === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border-3 border-slate-950 bg-emerald-100 p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <div>
                    <div className="inline-block rounded border-2 border-slate-950 bg-yellow-300 px-2.5 py-0.5 text-xs font-black font-mono text-slate-950 uppercase shadow-[2px_2px_0px_0px_#090d16]">
                      {PORTFOLIO_DATA.profile.callsign}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                      {PORTFOLIO_DATA.profile.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 font-mono">
                      {PORTFOLIO_DATA.profile.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1 rounded-md border border-slate-950 bg-white/90 px-2 py-0.5 shadow-[1px_1px_0px_0px_#090d16]">
                        <Mail className="h-3.5 w-3.5 text-emerald-800" />
                        <a href={`mailto:${PORTFOLIO_DATA.profile.socials.email}`} className="hover:underline text-emerald-950 font-bold">
                          {PORTFOLIO_DATA.profile.socials.email}
                        </a>
                        <button
                          onClick={() => handleCopy(PORTFOLIO_DATA.profile.socials.email, "email")}
                          className="ml-1 text-[10px] font-black text-slate-600 hover:text-slate-950 px-1 hover:bg-emerald-200 rounded"
                          title="Copy Email"
                        >
                          {copiedField === "email" ? "✓" : <Copy className="h-3 w-3 inline" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1 rounded-md border border-slate-950 bg-white/90 px-2 py-0.5 shadow-[1px_1px_0px_0px_#090d16]">
                        <Phone className="h-3.5 w-3.5 text-emerald-800" />
                        <a href={`tel:${PORTFOLIO_DATA.profile.socials.phone}`} className="hover:underline text-emerald-950 font-bold">
                          {PORTFOLIO_DATA.profile.socials.phone}
                        </a>
                        <button
                          onClick={() => handleCopy(PORTFOLIO_DATA.profile.socials.phone, "phone")}
                          className="ml-1 text-[10px] font-black text-slate-600 hover:text-slate-950 px-1 hover:bg-emerald-200 rounded"
                          title="Copy Phone"
                        >
                          {copiedField === "phone" ? "✓" : <Copy className="h-3 w-3 inline" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-xs">
                    <span className="rounded-lg border-2 border-slate-950 bg-white px-3 py-1 font-black text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
                      {PORTFOLIO_DATA.profile.status}
                    </span>
                    <span className="text-[11px] text-slate-700 text-right">
                      {PORTFOLIO_DATA.profile.location}
                    </span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="rounded-xl border-3 border-slate-950 bg-white p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-950 mb-2 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-emerald-600" />
                    <span>PROFESSIONAL SUMMARY & EXPERTISE</span>
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-900 font-medium font-sans">
                    {PORTFOLIO_DATA.profile.bio}
                  </p>
                </div>

                {/* Stats Cards */}
                <div>
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-950 mb-3">
                    CORE BENCHMARKS & EXPERTISE
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    {PORTFOLIO_DATA.profile.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border-3 border-slate-950 bg-emerald-200 p-3.5 text-center shadow-[4px_4px_0px_0px_#090d16]"
                      >
                        <div className="text-xl sm:text-2xl font-black text-slate-950">
                          {stat.value}
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Personal Interests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Education Box */}
                  <div className="rounded-xl border-3 border-slate-950 bg-amber-100 p-4 shadow-[4px_4px_0px_0px_#090d16] font-mono">
                    <h4 className="text-xs font-black uppercase text-slate-950 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-amber-700" />
                      <span>EDUCATION & ACADEMICS</span>
                    </h4>
                    <p className="text-xs font-bold text-slate-950">
                      {PORTFOLIO_DATA.profile.education.degree}
                    </p>
                    <p className="text-[11px] text-slate-700 font-sans mt-0.5">
                      {PORTFOLIO_DATA.profile.education.institution} · {PORTFOLIO_DATA.profile.education.location}
                    </p>
                    <div className="mt-2 inline-block rounded border border-slate-950 bg-white px-2 py-0.5 text-[10px] font-black text-slate-950 shadow-[1px_1px_0px_0px_#090d16]">
                      {PORTFOLIO_DATA.profile.education.score} · Graduated {PORTFOLIO_DATA.profile.education.year}
                    </div>
                  </div>

                  {/* Personal Interests Box */}
                  <div className="rounded-xl border-3 border-slate-950 bg-sky-100 p-4 shadow-[4px_4px_0px_0px_#090d16] font-mono">
                    <h4 className="text-xs font-black uppercase text-slate-950 mb-1.5 flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-sky-700" />
                      <span>PERSONAL INTERESTS</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PORTFOLIO_DATA.profile.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="rounded border border-slate-950 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-950 shadow-[1px_1px_0px_0px_#090d16]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                  <button
                    onClick={() => {
                      soundFX.playChestOpen();
                      onOpenContact();
                    }}
                    className="flex items-center gap-2 rounded-xl border-3 border-slate-950 bg-emerald-300 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[5px_5px_0px_0px_#090d16] hover:bg-emerald-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer"
                  >
                    <Mail className="h-4 w-4 stroke-[2.5]" />
                    <span>CONTACT ROHIT ↗</span>
                  </button>

                  <a
                    href={PORTFOLIO_DATA.profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border-3 border-slate-950 bg-yellow-300 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] transition-all cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>RESUME (DRIVE) ↗</span>
                  </a>

                  <a
                    href={PORTFOLIO_DATA.profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border-3 border-slate-950 bg-sky-200 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-sky-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>LINKEDIN ↗</span>
                  </a>

                  <a
                    href={PORTFOLIO_DATA.profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border-3 border-slate-950 bg-white px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-slate-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] transition-all cursor-pointer"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>GITHUB ↗</span>
                  </a>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATION 2: GENERATIVE & AGENTIC AI SKILLS            */}
            {/* ---------------------------------------------------- */}
            {station.id === 2 && (
              <div className="space-y-6">
                <div className="rounded-xl border-3 border-slate-950 bg-sky-100 p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <div className="inline-block rounded border-2 border-slate-950 bg-sky-300 px-2.5 py-0.5 text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#090d16]">
                    AGENTIC AI & MULTI-AGENT ARCHITECTURE
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1.5">
                    Generative AI, AWS Bedrock & Vector Retrieval
                  </h3>
                  <p className="text-sm text-slate-800 mt-1 font-medium font-sans">
                    Specialized in designing scalable multi-agent systems, defining A2A communication protocols, tool calling, and high-performance vector retrieval pipelines.
                  </p>
                </div>

                <div className="space-y-3 font-mono">
                  {PORTFOLIO_DATA.skillCategories[0].skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-3 border-slate-950 bg-white p-4 shadow-[4px_4px_0px_0px_#090d16]"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm sm:text-base font-black text-slate-950">
                          {skill.name}
                        </span>
                        <span className="rounded border-2 border-slate-950 bg-sky-200 px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_#090d16]">
                          {skill.tag} · {skill.level}%
                        </span>
                      </div>

                      {/* Neo-brutalist solid progress bar */}
                      <div className="h-3.5 w-full rounded-md border-2 border-slate-950 bg-slate-100 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-sky-400 border-r-2 border-slate-950 transition-all duration-700"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs font-sans text-slate-700 font-medium">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATION 3: PROFESSIONAL EXPERIENCE TIMELINE          */}
            {/* ---------------------------------------------------- */}
            {station.id === 3 && (
              <div className="space-y-5">
                <div className="rounded-xl border-3 border-slate-950 bg-purple-100 p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <div className="inline-block rounded border-2 border-slate-950 bg-purple-300 px-2.5 py-0.5 text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#090d16]">
                    INDUSTRY SERVICE RECORDS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                    Professional Experience & Leadership
                  </h3>
                  <p className="text-sm text-slate-800 mt-1 font-medium font-sans">
                    4+ years building high-throughput production backends, multi-agent AI systems, and automated testing frameworks.
                  </p>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.experiences.map((exp, idx) => (
                    <article
                      key={idx}
                      className="rounded-xl border-3 border-slate-950 bg-purple-50 p-5 shadow-[5px_5px_0px_0px_#090d16] font-mono"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-slate-950">
                            {exp.role}
                          </h4>
                          <div className="text-xs font-bold text-purple-900">
                            {exp.company} · {exp.location}
                          </div>
                        </div>
                        <span className="rounded-md border-2 border-slate-950 bg-purple-300 px-2.5 py-1 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_#090d16] w-fit">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-sans text-slate-800 font-medium mb-3">
                        {exp.description}
                      </p>

                      <ul className="space-y-2 mb-4 font-sans">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-900 leading-relaxed">
                            <span className="text-purple-600 font-bold font-mono text-sm leading-none mt-0.5">▸</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Stack Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded border-2 border-slate-950 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-950 shadow-[2px_2px_0px_0px_#090d16]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATION 4: TECHNOLOGY TOOLKIT & MATRICES             */}
            {/* ---------------------------------------------------- */}
            {station.id === 4 && (
              <div className="space-y-5">
                <div className="rounded-xl border-3 border-slate-950 bg-amber-100 p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <div className="inline-block rounded border-2 border-slate-950 bg-amber-300 px-2.5 py-0.5 text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#090d16]">
                    SYSTEM DESIGN & TOOLKIT
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                    Complete Technology Stack Matrix
                  </h3>
                  <p className="text-sm text-slate-800 mt-1 font-medium font-sans">
                    Production tools mastered across Languages, Frameworks, Generative AI, Search, Databases, and Cloud DevOps.
                  </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 font-mono">
                  {PORTFOLIO_DATA.skillCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundFX.playBlip(620);
                        setSelectedSkillCategory(idx);
                      }}
                      className={`rounded-xl border-3 border-slate-950 px-4 py-2 text-xs font-black uppercase transition-all cursor-pointer ${selectedSkillCategory === idx
                          ? "bg-amber-300 shadow-[4px_4px_0px_0px_#090d16] translate-x-[2px] translate-y-[2px]"
                          : "bg-white shadow-[4px_4px_0px_0px_#090d16] hover:bg-amber-100 hover:translate-x-[2px] hover:translate-y-[2px]"
                        }`}
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  {(PORTFOLIO_DATA.skillCategories[selectedSkillCategory]?.skills || []).map((skill, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-3 border-slate-950 bg-white p-4 shadow-[4px_4px_0px_0px_#090d16]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-slate-950 text-sm">{skill.name}</span>
                        <span className="rounded border-2 border-slate-950 bg-amber-200 px-2 py-0.5 text-[10px] font-black">
                          {skill.tag} · {skill.level}%
                        </span>
                      </div>
                      <div className="h-3 w-full rounded border-2 border-slate-950 bg-slate-100 overflow-hidden my-1.5">
                        <div
                          className="h-full bg-amber-400 border-r-2 border-slate-950"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <p className="text-xs font-sans text-slate-700 font-medium">{skill.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Production Benchmarks & Accolades */}
                <div className="pt-3 border-t-2 border-slate-950">
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-950 mb-3 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span>PRODUCTION BENCHMARKS & ACHIEVEMENTS</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    {PORTFOLIO_DATA.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border-3 border-slate-950 bg-amber-200 p-3.5 shadow-[3px_3px_0px_0px_#090d16]"
                      >
                        <div className="text-xs font-black text-slate-950">{ach.title}</div>
                        <div className="text-[11px] text-slate-800 mt-1 font-sans font-medium">{ach.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATION 5: PRODUCTION SOLUTIONS & DIRECT TRANSMISSION */}
            {/* ---------------------------------------------------- */}
            {station.id === 5 && (
              <div className="space-y-6">
                <div className="rounded-xl border-3 border-slate-950 bg-rose-100 p-5 shadow-[5px_5px_0px_0px_#090d16]">
                  <div className="inline-block rounded border-2 border-slate-950 bg-rose-300 px-2.5 py-0.5 text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#090d16]">
                    FLAGSHIP PRODUCTION SOLUTIONS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                    Featured AI Systems & Architectural Relics
                  </h3>
                  <p className="text-sm text-slate-800 mt-1 font-medium font-sans">
                    Click on any solution card below to inspect full system architecture, performance metrics, and technological innovations.
                  </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  {PORTFOLIO_DATA.projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        soundFX.playChestOpen();
                        onOpenProject(proj);
                      }}
                      className="group flex flex-col justify-between rounded-xl border-3 border-slate-950 bg-white p-5 shadow-[5px_5px_0px_0px_#090d16] hover:bg-rose-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] transition-all cursor-pointer"
                    >
                      <div>
                        <div className="text-[10px] font-black uppercase text-rose-600 tracking-wider mb-1">
                          SYSTEM // {proj.id.toUpperCase()}
                        </div>
                        <h4 className="text-base font-black text-slate-950 group-hover:text-rose-600 transition">
                          {proj.title}
                        </h4>
                        <p className="text-xs font-sans text-slate-700 font-medium mt-2 line-clamp-3">
                          {proj.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t-2 border-slate-950 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-600">PRODUCTION</span>
                        <span className="flex items-center gap-1 text-xs font-black text-slate-950 group-hover:text-rose-600">
                          <span>INSPECT</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Contact Box */}
                <div className="rounded-xl border-3 border-slate-950 bg-rose-200 p-6 shadow-[6px_6px_0px_0px_#090d16] flex flex-col sm:flex-row items-center justify-between gap-5 font-mono">
                  <div>
                    <h4 className="text-lg font-black text-slate-950">
                      Open to Lead Software Engineer & AI Architect Opportunities
                    </h4>
                    <p className="text-xs text-slate-800 mt-1 font-sans font-medium">
                      Direct transmission channel open for high-impact backend & Generative AI engineering roles, consulting, or technical discussions.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={PORTFOLIO_DATA.profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 rounded-xl border-3 border-slate-950 bg-yellow-300 px-5 py-3.5 text-xs font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] transition-all cursor-pointer uppercase"
                    >
                      <FileText className="h-4 w-4" />
                      <span>RESUME (DRIVE) ↗</span>
                    </a>

                    <button
                      onClick={() => {
                        soundFX.playChestOpen();
                        onOpenContact();
                      }}
                      className="flex-shrink-0 rounded-xl border-3 border-slate-950 bg-slate-950 px-6 py-3.5 text-xs font-black text-lime-300 shadow-[4px_4px_0px_0px_#ffffff] hover:bg-slate-900 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer uppercase"
                    >
                      Parchement ↗
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="border-t-4 border-slate-950 bg-slate-100 px-6 py-3 text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
            <span>PRESS <kbd className="border border-slate-950 bg-white px-1.5 py-0.5 rounded text-slate-950">ESC</kbd> TO RETURN TO OVERWORLD</span>
            <button onClick={onClose} className="font-black text-slate-950 hover:underline">
              [ CLOSE // ✕ ]
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}

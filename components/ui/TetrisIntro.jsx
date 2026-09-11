"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundFX } from "@/utils/soundFX";

/* ============================================================================
   TETRIS INTRO
   On page load, voxel blocks fall from the TOP of the screen (classic Tetris)
   and stack into:
     1) the island explorer character — same palette as components/3d/Vehicle.jsx
     2) a PLAY / start button
   After everything lands the character idles (head bob, arm & leg swings,
   blinking eyes) and the PLAY button pulses. Clicking PLAY reveals the island.
   ============================================================================ */

/* Colours copied 1:1 from the island VoxelCharacter so it's the SAME character */
const PALETTE = {
  H: "#451a03", // brown hair
  S: "#d4a373", // skin tone
  W: "#ffffff", // eye white
  P: "#1d4ed8", // pupil blue
  C: "#0284c7", // cyan shirt
  B: "#1e3a8a", // blue jeans
  M: "#78350f", // pickaxe wooden handle
  D: "#00f0ff", // diamond pickaxe head
};

/* Front-view sprite of the island explorer: 10 cols × 14 rows */
const SPRITE = [
  "...HHHH...",
  "..HHHHHH..",
  ".HHSSSSHH.",
  ".HSWPWPSH.",
  ".HHSSSSHH.",
  "..CCCCCC..",
  "CCCCCCCCCC",
  "SSCCCCCCSS",
  "SSCCCCCCSS",
  "..CCCCCC..",
  "..BBBBBB..",
  "..BBBBBB..",
  "..BBBBBB..",
  "..BBBBBB..",
];

const CHAR_ROWS = SPRITE.length;

/* Diamond pickaxe drawn beside the character's right arm (3 cols × 4 rows) */
const PICKAXE_SPRITE = ["DD.", "MMD", ".MM", ".MM"];

/* Which animated body part a sprite cell belongs to (used for idle animation) */
function partOf(x, y) {
  if (y <= 4) return "head";
  if (y >= CHAR_ROWS - 4) return x <= 4 ? "leftLeg" : "rightLeg";
  if (y >= 6 && y <= 8) return x <= 1 ? "leftArm" : x >= 8 ? "rightArm" : "torso";
  return "torso";
}

/* Cascading delay so blocks fall top-to-bottom, left-to-right */
function fallDelay(x, y, stagger = 0.15, colWeight = 0.3) {
  const jitter = ((x * 31 + y * 17) % 7) * 0.016;
  return (y * 0.62 + x * colWeight) * stagger + jitter;
}

/* ---- Build every character block (body + pickaxe) ---- */
const charBlocks = [];
SPRITE.forEach((rowStr, y) => {
  [...rowStr].forEach((ch, x) => {
    if (ch === ".") return;
    charBlocks.push({
      x,
      y,
      color: PALETTE[ch],
      part: partOf(x, y),
      blink: ch === "P", // eye pupils blink
      delay: fallDelay(x, y),
    });
  });
});
PICKAXE_SPRITE.forEach((rowStr, r) => {
  [...rowStr].forEach((ch, c) => {
    if (ch === ".") return;
    charBlocks.push({
      x: 10 + c,
      y: 6 + r,
      color: PALETTE[ch],
      part: "rightArm",
      blink: false,
      delay: fallDelay(10 + c, 6 + r),
    });
  });
});
/* ---- Build the PLAY button blocks from a tiny 5×7 pixel font ---- */
const LETTERS = {
  E: ["PPPPP", "P....", "P....", "PPPP.", "P....", "P....", "PPPPP"],
  X: ["P...P", ".P.P.", "..P..", ".P.P.", "P...P", ".P.P.", "P...P"],
  P: ["PPPP.", "P..P.", "P..P.", "PPPP.", "P....", "P....", "P...."],
  L: ["P....", "P....", "P....", "P....", "P....", "P....", "PPPP."],
  O: ["PPPP.", "P..P.", "P..P.", "P..P.", "P..P.", "P..P.", "PPPP."],
  R: ["PPPP.", "P..P.", "P..P.", "PPPP.", "P.P..", "P..P.", "P...P"],
};
const PLAY_COLORS = ["#fbbf24", "#84cc16", "#fbbf24", "#84cc16", "#fbbf24", "#84cc16", "#fbbf24"]; // amber / lime
const PLAY_ROWS = 7;

const playBlocks = [];
let playCursor = 1; // leading empty column
["E", "X", "P", "L", "O", "R", "E"].forEach((letter, li) => {
  LETTERS[letter].forEach((rowStr, r) => {
    [...rowStr].forEach((ch, c) => {
      if (ch === ".") return;
      playBlocks.push({
        x: playCursor + c,
        y: r,
        color: PLAY_COLORS[li],
        part: "play",
        blink: false,
        delay: fallDelay(playCursor + c, r, 0.11, 0.05) + 0.3,
      });
    });
  });
  playCursor += 6; // letter width (5) + gap (1)
});

/* Center the letterforms inside the button: equal empty columns on both sides */
const PLAY_PAD = 1;
const MIN_X = Math.min(...playBlocks.map((b) => b.x));
const MAX_X = Math.max(...playBlocks.map((b) => b.x));
playBlocks.forEach((b) => {
  b.x = b.x - MIN_X + PLAY_PAD;
});
const PLAY_COLS = MAX_X - MIN_X + 1 + PLAY_PAD * 2;

/* When the slowest block has landed, the show is "ready" */
const MAX_CHAR_DELAY = Math.max(...charBlocks.map((b) => b.delay));
const LANDED_MS = Math.round((MAX_CHAR_DELAY + 0.7 + 0.5) * 1000);

/* Ambient tetromino ghosts raining in the background */
const GHOST_SHAPES = [
  { left: "7%", blocks: [[0, 0], [1, 0], [2, 0], [3, 0]], duration: 9, delay: 0 }, // I
  { left: "19%", blocks: [[0, 0], [1, 0], [0, 1], [1, 1]], duration: 12, delay: -5 }, // O
  { left: "30%", blocks: [[0, 1], [1, 1], [2, 1], [1, 0]], duration: 10.5, delay: -2 }, // T
  { left: "42%", blocks: [[0, 0], [0, 1], [1, 1], [0, 2]], duration: 11.5, delay: -7 }, // L
  { left: "55%", blocks: [[0, 1], [1, 1], [1, 0], [2, 0]], duration: 9.5, delay: -3 }, // S
  { left: "66%", blocks: [[1, 0], [2, 0], [1, 1], [0, 1]], duration: 12.5, delay: -8 }, // Z
  { left: "79%", blocks: [[0, 0], [1, 0], [1, 1], [2, 1]], duration: 10, delay: -1 }, // J
  { left: "90%", blocks: [[1, 0], [2, 0], [1, 1], [2, 1]], duration: 11, delay: -6 }, // O2
];

/* Renders a grid of falling blocks, grouped into animated body parts */
function FallBlocks({ blocks, cols, rows, cell, idle = false }) {
  const parts = new Map();
  blocks.forEach((b) => {
    if (!parts.has(b.part)) parts.set(b.part, []);
    parts.get(b.part).push(b);
  });

  const gridStyle = {
    position: "relative",
    width: `calc(var(--cell) * ${cols})`,
    height: `calc(var(--cell) * ${rows})`,
  };
  if (cell) gridStyle["--cell"] = cell;

  return (
    <div className={`pk-grid${idle ? " pk-idle" : ""}`} style={gridStyle}>
      {Array.from(parts.entries()).map(([part, list]) => {
        const minX = Math.min(...list.map((b) => b.x));
        const minY = Math.min(...list.map((b) => b.y));
        const maxX = Math.max(...list.map((b) => b.x));
        const maxY = Math.max(...list.map((b) => b.y));
        return (
          <div
            key={part}
            className={`pk-part pk-part-${part}`}
            style={{
              position: "absolute",
              left: `calc(var(--cell) * ${minX})`,
              top: `calc(var(--cell) * ${minY})`,
              width: `calc(var(--cell) * ${maxX - minX + 1})`,
              height: `calc(var(--cell) * ${maxY - minY + 1})`,
            }}
          >
            {list.map((b) => (
              <div
                key={`${b.x}:${b.y}`}
                className={`pk-block${b.blink ? " pk-blink" : ""}`}
                style={{
                  left: `calc(var(--cell) * ${b.x - minX})`,
                  top: `calc(var(--cell) * ${b.y - minY})`,
                  width: "var(--cell)",
                  height: "var(--cell)",
                  background: b.color,
                  "--fall-delay": `${b.delay}s`,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
export default function TetrisIntro({ onStart }) {
  const [landed, setLanded] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setLanded(true), LANDED_MS);
    return () => clearTimeout(t);
  }, []);

  const handlePlay = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    soundFX.playChestOpen(); // thud! (no-ops if audio is not ready yet)
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => onStart?.(), 620);
    return () => clearTimeout(t);
  }, [leaving, onStart]);

  // Enter / Space also start the adventure once the world is ready
  useEffect(() => {
    if (!landed || leaving) return;
    const onKey = (e) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        handlePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [landed, leaving, handlePlay]);

  return (
    <div
      className={`tetris-intro${leaving ? " is-leaving" : ""}`}
      aria-label="Portfolio intro — blocks fall into a PLAY button. Press play to explore the 3D island."
    >
      {/* Ambient tetromino ghosts raining in the background */}
      {GHOST_SHAPES.map((g, i) => (
        <div
          key={i}
          className="tetris-ghost"
          style={{
            left: g.left,
            width: "88px",
            height: "88px",
            animationDuration: `${g.duration}s`,
            animationDelay: `${g.delay}s`,
          }}
        >
          {g.blocks.map(([cx, cy]) => (
            <span
              key={`${cx}x${cy}`}
              className="ghost-cell"
              style={{ left: `${cx * 22}px`, top: `${cy * 22}px` }}
            />
          ))}
        </div>
      ))}

      <div className="flex h-full max-h-full flex-col items-center justify-center gap-3 px-4 py-4 sm:gap-5 sm:py-6 select-none overflow-hidden">
        {/* Flexible spacers keep the stack vertically centered when it fits, and
            scroll from the top instead of clipping when the screen is short. */}
        <div className="flex-1 basis-0 min-h-0" />

        {/* Brand */}
        <div className="text-center">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-950/80">
            ~ minecraft-style voxel adventure ~
          </p>
          <h1 className="font-mono text-2xl font-black leading-none text-slate-950 sm:text-4xl">
            THE 3D VOXEL PORTFOLIO<span className="tetris-cursor">▮</span>
          </h1>
        </div>

        {/* Explorer plaque */}
        <p className="rounded-md border border-slate-950 bg-white/85 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-[2px_2px_0px_0px_#090d16]">
          hey explorer // its rohit!
        </p>

        {/* The island character assembled from falling blocks */}
        <FallBlocks
          blocks={charBlocks}
          cols={13}
          rows={CHAR_ROWS}
          cell="max(12px, min(30px, calc((100vh - 470px) / 14), calc((100vw - 64px) / 13)))"
          idle={landed}
        />

        {/* PLAY / start button assembled from falling blocks */}
        <button
          type="button"
          aria-label="Start exploring the island"
          title="Press Explore to start the adventure"
          className={`play-button${landed ? " is-ready" : ""}`}
          style={{
            width: `calc(var(--cell) * ${PLAY_COLS})`,
            height: `calc(var(--cell) * ${PLAY_ROWS})`,
            "--cell": `clamp(min(12px, max(0px, calc((100vh - 560px) / ${PLAY_ROWS})), calc((100vw - 56px) / ${PLAY_COLS})), 6px, 12px)`,
          }}
          onClick={handlePlay}
        >
          <FallBlocks blocks={playBlocks} cols={PLAY_COLS} rows={PLAY_ROWS} />
          <span className="sr-only">Explore</span>
        </button>

        {/* Status line */}
        <p className="font-mono text-[10px] font-black uppercase tracking-widest sm:text-xs">
          {landed ? "■ world ready — press explore to enter" : "▣ assembling voxels…"}
        </p>
         <p className="hidden sm:block font-mono text-[10px] font-black uppercase tracking-widest sm:text-xs">
          {landed ? "or space key" : ""}
        </p>
        <div className="flex-1 basis-0 min-h-0" />
      </div>
    </div>
  );
}
"use client";

import { useEffect } from "react";

/**
 * three@0.184 deprecates THREE.Clock (warns from its constructor) but
 * @react-three/fiber@9.7.0 still instantiates one internally per Canvas.
 * There is no supported `clock` prop escape hatch that avoids it (a plain
 * object lacks internal methods R3F relies on). Until fiber upgrades to
 * THREE.Timer, swallow exactly this upstream warning so the console stays
 * clean. All other warnings/errors pass through untouched.
 */
export default function SuppressThreeClockWarning() {
  useEffect(() => {
    const isClockDeprecation = (args) =>
      args.some(
        (arg) =>
          typeof arg === "string" &&
          arg.includes("Clock") &&
          arg.includes("deprecated") &&
          arg.includes("Timer")
      );

    const origWarn = console.warn;
    console.warn = (...args) => {
      if (isClockDeprecation(args)) return;
      origWarn(...args);
    };

    return () => {
      console.warn = origWarn;
    };
  }, []);

  return null;
}

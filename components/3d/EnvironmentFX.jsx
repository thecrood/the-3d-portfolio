"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Stars field for night time
function StarField() {
  const starsRef = useRef();
  const positions = React.useMemo(() => {
    const pos = new Float32Array(1200 * 3);
    let seed = 9182;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 1200; i++) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = 160 + random() * 40;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)); // upper hemisphere only
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

// Voxel Sun Block
function VoxelSun() {
  const sunRef = useRef();
  useFrame(() => {
    const t = performance.now() * 0.001;
    // Orbits overhead on a wide arc
    const angle = (t * 0.018) % (Math.PI * 2);
    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(angle) * 120;
      sunRef.current.position.y = Math.sin(angle) * 120;
      sunRef.current.position.z = -40;
    }
  });

  return (
    <mesh ref={sunRef} position={[80, 80, -40]}>
      <boxGeometry args={[8, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fde68a" emissiveIntensity={2.5} />
    </mesh>
  );
}

export default function EnvironmentFX({ timeOfDay = 0.5 }) {
  const ambientRef = useRef();
  const sunLightRef = useRef();
  const skyRef = useRef();

  useFrame(() => {
    const t = performance.now() * 0.001;
    // Full cycle every 300 seconds (5 minutes)
    const cycle = ((t * 0.0033) % 1.0);

    // Sky colors: dawn(0) -> day(0.25) -> dusk(0.5) -> night(0.75) -> dawn(1)
    let skyColor, ambientIntensity, sunIntensity;

    if (cycle < 0.25) {
      // Dawn: orange/gold sky
      const p = cycle / 0.25;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color("#f97316"), new THREE.Color("#38bdf8"), p
      );
      ambientIntensity = THREE.MathUtils.lerp(0.3, 0.7, p);
      sunIntensity = THREE.MathUtils.lerp(0.6, 2.2, p);
    } else if (cycle < 0.5) {
      // Day: clear blue
      const p = (cycle - 0.25) / 0.25;
      skyColor = new THREE.Color("#38bdf8");
      ambientIntensity = 0.7;
      sunIntensity = 2.2;
    } else if (cycle < 0.75) {
      // Dusk: orange/purple
      const p = (cycle - 0.5) / 0.25;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color("#38bdf8"), new THREE.Color("#7c3aed"), p
      );
      ambientIntensity = THREE.MathUtils.lerp(0.7, 0.2, p);
      sunIntensity = THREE.MathUtils.lerp(2.2, 0.3, p);
    } else {
      // Night: deep navy
      const p = (cycle - 0.75) / 0.25;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color("#7c3aed"), new THREE.Color("#0c1445"), p
      );
      ambientIntensity = THREE.MathUtils.lerp(0.2, 0.12, p);
      sunIntensity = 0.15;
    }

    // Apply sky fog color
    if (skyRef.current) {
      skyRef.current.color.set(skyColor);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity;
      ambientRef.current.color.set(cycle > 0.5 ? "#c4b5fd" : "#f0f9ff");
    }
    if (sunLightRef.current) {
      // Rotate sun light
      const sunAngle = cycle * Math.PI * 2;
      sunLightRef.current.position.x = Math.cos(sunAngle) * 80;
      sunLightRef.current.position.y = Math.abs(Math.sin(sunAngle)) * 80 + 10;
      sunLightRef.current.position.z = -30;
      sunLightRef.current.intensity = sunIntensity;
      sunLightRef.current.color.set(cycle < 0.5 ? "#fef9c3" : "#f97316");
    }
  });

  return (
    <group>
      {/* Dynamic Sky Fog */}
      <fog ref={skyRef} attach="fog" args={["#38bdf8", 55, 175]} />

      {/* Ambient Light */}
      <ambientLight ref={ambientRef} intensity={0.7} color="#f0f9ff" />

      {/* Animated Sun Directional Light */}
      <directionalLight
        ref={sunLightRef}
        position={[80, 80, -30]}
        intensity={2.2}
        color="#fef9c3"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={1}
        shadow-camera-far={200}
      />

      {/* Hemisphere sky-to-ground bounce */}
      <hemisphereLight args={["#7dd3fc", "#22c55e", 0.5]} />

      {/* Voxel Sun mesh */}
      <VoxelSun />

      {/* Stars (visible at night via opacity, always in scene) */}
      <StarField />
    </group>
  );
}

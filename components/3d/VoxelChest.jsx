"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function VoxelChest({
  position = [0, 0, 0],
  isOpen = false,
  onClick,
  color = "#854d0e",
}) {
  const lidRef = useRef();
  const latchRef = useRef();
  const particlesRef = useRef();

  // Minecraft Chest Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.8,
    metalness: 0.1,
  });

  const ironTrimMat = new THREE.MeshStandardMaterial({
    color: "#27272a",
    roughness: 0.5,
    metalness: 0.7,
  });

  const latchMat = new THREE.MeshStandardMaterial({
    color: "#e4e4e7",
    roughness: 0.3,
    metalness: 0.85,
  });

  const xpOrbMat = new THREE.MeshStandardMaterial({
    color: "#84cc16",
    emissive: "#84cc16",
    emissiveIntensity: 3.0,
    roughness: 0.1,
  });

  useFrame((_, delta) => {
    // 1. Smoothly animate chest lid opening / closing
    const targetAngle = isOpen ? -Math.PI * 0.55 : 0;
    if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetAngle,
        delta * 9.0
      );
    }

    // 2. Rotate floating XP particles when chest is open
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 1.5;
      particlesRef.current.visible = isOpen;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* 1. Main Chest Base Box */}
      <group position={[0, 0.4, 0]}>
        <mesh material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
        </mesh>
        {/* Corner Iron Trim Bands */}
        <mesh position={[0, 0, 0]} material={ironTrimMat}>
          <boxGeometry args={[1.22, 0.12, 1.22]} />
        </mesh>
      </group>

      {/* 2. Opening Chest Lid on Rear Pivot Hinge */}
      <group ref={lidRef} position={[0, 0.8, 0.55]}>
        {/* Lid Body (Offset from pivot point) */}
        <mesh position={[0, 0.15, -0.55]} material={woodMat} castShadow>
          <boxGeometry args={[1.2, 0.32, 1.2]} />
        </mesh>

        {/* Lid Top Trim */}
        <mesh position={[0, 0.31, -0.55]} material={ironTrimMat}>
          <boxGeometry args={[1.22, 0.04, 1.22]} />
        </mesh>

        {/* Front Metal Lock Latch */}
        <mesh ref={latchRef} position={[0, 0.05, -1.17]} material={latchMat}>
          <boxGeometry args={[0.18, 0.22, 0.08]} />
        </mesh>
      </group>

      {/* 3. Floating Experience Orbs / Particles that burst on open */}
      <group ref={particlesRef} position={[0, 1.1, 0]} visible={false}>
        {[-0.4, 0, 0.4].map((x, i) =>
          [-0.4, 0.4].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, (i + j) * 0.15, z]}>
              <octahedronGeometry args={[0.08, 0]} />
              <primitive object={xpOrbMat} />
            </mesh>
          ))
        )}
      </group>

      {/* Glow Light inside Open Chest */}
      {isOpen && (
        <pointLight position={[0, 1.0, 0]} color="#facc15" intensity={4} distance={6} />
      )}
    </group>
  );
}

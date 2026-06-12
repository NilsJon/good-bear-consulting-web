"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  createParticleSystem,
  type ParticleSystem,
  type ParticleMode,
} from "./use-particle-system";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ParticleCanvasRef {
  burst: () => void;
  setMode: (mode: ParticleMode) => void;
}

interface ParticleCanvasProps {
  mode?: ParticleMode;
  className?: string;
}

export const ParticleCanvas = forwardRef<ParticleCanvasRef, ParticleCanvasProps>(
  function ParticleCanvas({ mode = "terminal", className = "" }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<ParticleSystem | null>(null);
    const reducedMotion = useReducedMotion();

    useImperativeHandle(ref, () => ({
      burst: () => systemRef.current?.burst(),
      setMode: (m: ParticleMode) => systemRef.current?.setMode(m),
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const system = createParticleSystem(canvas, mode, reducedMotion);
      systemRef.current = system;

      const handleResize = () => {
        system.resize(window.innerWidth, window.innerHeight);
      };

      handleResize();
      system.start();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        system.stop();
      };
    }, [mode, reducedMotion]);

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ zIndex: 0 }}
        role="presentation"
        aria-hidden="true"
      />
    );
  }
);

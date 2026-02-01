'use client';

import { useEffect, useRef } from "react";
import { Engine } from "../lib/Engine";

export default function Universe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new Engine(containerRef.current, { fps: 60 });
    engine.Start();

    return () => {
      containerRef.current?.removeChild(engine.renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

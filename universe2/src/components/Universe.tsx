'use client';

import { useEffect, useRef } from "react";
import { Engine } from "../lib/Engine.js";

export default function Universe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let engine = new Engine(containerRef.current, { fps: 60 });
    engine.Start();

    return () => {
      engine?.Dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
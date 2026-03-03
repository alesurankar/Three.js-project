# Three.js Universe Projects

This repository contains **two versions** of a 3D Universe project:

---

## Universe (vanilla JS)

- Location: `universe/`
- Simple 3D universe using plain JavaScript and Three.js.
- For detailed setup instructions, see [universe/README.md](./universe/README.md).

## Universe2 (Next.js)

- Location: `universe2/`
- React + Next.js version with modular scene management.
- Uses MongoDB to store entities.
- For detailed setup instructions, see [universe2/README.md](./universe2/README.md).

---

# Overview

A scalable Three.js-based system for managing and rendering multiple independent 3D scenes.
This project explores how to design frontend architectures that remain performant and maintainable as visual complexity grows.

## Key Ideas
- Modular scene management instead of a single monolithic scene
- Centralised rendering and lifecycle control
- Performance-aware design

## Features
- Multi-scene architecture (10+ scenes, designed for scalability)
- Modular rendering pipeline
- Scene lifecycle management (init → active → suspended → disposed)
- Experimental engine-like structure

## Tech Stack
- Next.js
- Three.js
- Express
- JavaScript
- WebGL

## Documentation
For a detailed explanation of the system design and architectural decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).
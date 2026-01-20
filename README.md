# Lens Calculator

A calculator for comparing lenses across different camera formats.

## What It Does

Photographers often wonder: "If I shoot 50mm f/1.4 on full frame, what's the equivalent on my APS-C camera?" or "What medium format lens gives me the same look as my 35mm f/2?"

This calculator answers those questions by computing:

- **Equivalent focal length** — same field of view across formats
- **Equivalent aperture** — same depth of field or background blur
- **Depth of field** — near/far limits of acceptable sharpness
- **Blur disc size** — how blurry the background will be

## Why It Exists

Crop factor calculators exist, but most only convert focal length. The relationship between sensor size, aperture, and background blur is often misunderstood. This tool makes it concrete: enter your setup, see exactly what you'd need on another format to get the same image.

## How I Built This

I built this with [Claude Code](https://claude.ai/claude-code) — 5 hours of upfront research and documentation, then about 2.5 hours of implementation. I've been getting questions about how I approach AI-assisted coding so it's production-robust rather than typical vibe coded junk, so I documented this project as an example.

See [`how-i-built-this.md`](./how-i-built-this.md) for the full process with chat logs and artifacts.

## Design

See [`design_docs/`](./design_docs/) for requirements, architecture, and technical decisions.

## Research

See [`research/`](./research/) for the underlying math and sources.

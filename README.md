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

## Design

See [`design_docs/`](./design_docs/) for requirements, architecture, and technical decisions.

## Research

See [`research/`](./research/) for the underlying math and sources.

---
title: What is a browser?
dek: A practical mental model of what a browser does.
domainTags: [web, fundamentals]
publishedAt: 2026-01-30
updatedAt: 2026-01-30
status: published
---

## Rendering pipeline
A browser turns code into pixels. It parses HTML, applies CSS rules, and runs JavaScript to update the DOM.

### Parse
The parser converts bytes into tokens, then nodes.

### Layout
Layout computes box sizes and positions for every element.

## The engine rooms
Modern browsers separate rendering, JavaScript, and networking into dedicated subsystems.

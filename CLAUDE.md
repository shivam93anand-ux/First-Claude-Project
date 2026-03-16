# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duck Hunt — a single-page browser game inspired by the classic NES Duck Hunt. The entire game lives in one self-contained HTML file (`duck-hunt.html`) with inline CSS and JavaScript. No build tools, no dependencies, no bundler.

## Running the Game

Open `duck-hunt.html` directly in a browser. No server required (though a local server works too):
```
# optional
npx serve .
```

## Architecture

**Single-file structure** — all markup, styles, and game logic are in `duck-hunt.html`:

- **Lines 7–220**: CSS — game layout, UI overlay, score bar, animations
- **Lines 262–1064**: JavaScript — game engine, all inline in a `<script>` tag

### Key JavaScript sections

| Section | Lines | Purpose |
|---------|-------|---------|
| Audio Engine | 267–349 | Web Audio API synthesized sound effects (shot, hit, miss, reload, round start) |
| Game State | 351–376 | Global state variables, constants (`AMMO_MAX = 6`) |
| Duck class | 380–553 | Duck spawning, movement (wobble sine wave), drawing (canvas 2D), hit detection |
| Particle class | 556–585 | Feather burst / muzzle flash particles |
| ScoreFloat class | 588–614 | Floating score text (unused — inline effect rendering used instead) |
| Background | 617–714 | Parallax night scene: sky gradient, stars, moon, hills, trees, bushes |
| Game logic | 778–948 | Round management, shooting, combo system (x2 at 3+, "ULTRA" at 5+), game over |
| Main loop | 951–1037 | `requestAnimationFrame` loop — spawn, update, draw, check round end |
| Event handlers | 1040–1060 | Mouse tracking, click-to-shoot, right-click prevention |

### Game mechanics

- **Rounds**: Each round spawns `10 + round * 1.5` ducks; speed scales with `2 + round * 0.4`
- **Ammo**: 6 shots per clip, auto-reload after 800ms when empty
- **Combo**: Consecutive hits multiply score (x2 at 3+ combo); resets on miss or duck escape
- **Lives**: 3 lives (tracked in state but life-loss on escape is not fully wired — potential TODO)
- **Persistence**: High score stored in `localStorage` key `dh_hs`

### Rendering

All graphics are procedural canvas 2D — no sprite sheets or image assets. Ducks are drawn from ellipses/arcs with per-duck random color palettes (5 variants). The dog laugh animation draws inline during the effects loop.

## Development Notes

- The `ScoreFloat` class (line 588) is defined but never instantiated; score floats are handled via the `effects` array instead.
- Lives decrement logic is incomplete — escaped ducks don't reduce lives, so the game currently runs indefinitely through rounds.
- The `dog` variable (line 374) is set to `null` in `startRound` but the dog effect uses the `effects` array, not this variable.

## Git Workflow

**Always commit and push as you work.** After every meaningful change (feature added, bug fixed, refactor done), commit with a clean, descriptive message and push to GitHub immediately. Do not wait until the end of a session — commit incrementally so we never lose progress. This is a hard requirement, not optional.

- Commit after each logical unit of work, not in bulk
- Write clear commit messages that explain *what* changed and *why*
- Push to `origin` after every commit
- Never leave uncommitted work at the end of a task

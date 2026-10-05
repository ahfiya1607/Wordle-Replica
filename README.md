# Wordle Replica

A faithful, modern, responsive web replica of the viral word puzzle game **Wordle**, built with React 19, TypeScript, and Tailwind CSS.

---

## 🌟 Key Features

- **Daily Wordle Mode**: Synchronized daily puzzle using the official Wordle epoch (`June 19, 2021`) and PRNG shuffle order identical to the original game logic.
- **Puzzle Archive & Practice Mode**: Jump to any past puzzle (`#0` to today) or practice with random puzzles using the built-in calendar archive (`?puzzle=N`).
- **Authentic Animations & Haptics**: Smooth tile flip reveals, shake on invalid input, pop on letter entry, and celebratory bounce animations on win.
- **Tactile Sound Effects**: Synthesized Web Audio key clacks, tile reveal chimes, error buzzes, and win fanfares (no heavy external audio files needed; toggleable in Settings).
- **Hard Mode**: Validates that all revealed green letters remain fixed in place and all yellow letters appear in subsequent guesses.
- **Dark Theme & High Contrast Mode**: Colorblind-accessible high contrast palette (orange and sky blue) and night-friendly dark theme.
- **Statistics & Guess Distribution**: Persistent record of games played, win percentage, current streak, max streak, and guess distribution bar graph.
- **Reliable Sharing**: Generates the iconic emoji grid with safe clipboard fallback for iframe and mobile environments.
- **Comprehensive Dictionary**: Bundles 2,309 curated answers and 14,855 valid 5-letter English words.

---

## 🛠️ Bugs Diagnosed & Solved From Original Code

When porting and upgrading the original Python Flask and vanilla JavaScript code snippet, the following critical issues were diagnosed and resolved:

1. **`FileNotFoundError` on Missing Text Files**
   - *Original issue*: Python script invoked `(DATA / "answers.txt").read_text()` and `(DATA / "allowed.txt")`, which crashed immediately when files were absent.
   - *Solution*: Embedded the complete 2,309 answer word list (shuffled using the identical Python `random.Random(2021).shuffle()` seed) and paired with 14,855 dictionary words in typed TypeScript modules.

2. **Jinja2 Template Interpolation Crash in Browser**
   - *Original issue*: `<script>window.TODAY = {{ today }};</script>` resulted in syntax errors outside of a Flask server rendering loop.
   - *Solution*: Computed day index using client-side timezone-aware epoch calculation (`2021-06-19`).

3. **Wordle #0 Inaccessibility Bug**
   - *Original issue*: `parseInt(search.get("puzzle")) || TODAY` meant passing `?puzzle=0` evaluated `0 || TODAY` to `TODAY` because `0` is falsy in JavaScript.
   - *Solution*: Replaced with `Number.isInteger(parsed) && parsed >= 0 ? parsed : today`.

4. **Permanent Keyboard Lock on Network Glitch**
   - *Original issue*: `busy = true` was set before `fetch('/api/guess')`, but if the network dropped or server returned an uncaught rejection, `busy` remained `true` forever.
   - *Solution*: Resilient state machine with guaranteed cleanup timers.

5. **Clipboard Permission Denial in Sandboxed Environments**
   - *Original issue*: `navigator.clipboard.writeText` threw `DOMException: Document is not focused` inside restricted browser iframes.
   - *Solution*: Dual-layer copy strategy using modern Clipboard API with fallback to `document.execCommand('copy')`.

6. **Hard Mode Incomplete Validation**
   - *Original issue*: Basic checks missed subtle repeated letter constraints or failed if previous guesses had repeated letters.
   - *Solution*: Full standard NYT Hard Mode validation engine.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/wordle-replica.git
cd wordle-replica

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📦 Pushing to Your GitHub Repository

To upload this project to your own GitHub account:

```bash
# 1. Create a new empty repository on github.com (e.g. wordle-replica)

# 2. Add your GitHub repository as the remote origin
git remote add origin https://github.com/YOUR_USERNAME/wordle-replica.git

# 3. Ensure your branch is named main
git branch -M main

# 4. Push all code to GitHub
git push -u origin main
```

---

## 📐 Architecture

- `src/App.tsx`: Main game loop, state management, modal routing, and event delegation.
- `src/components/Board.tsx`: 6x5 grid with CSS animations (flip, pop, shake, bounce).
- `src/components/Keyboard.tsx`: Touch & click-friendly on-screen QWERTY keyboard with live clue status.
- `src/components/Header.tsx`: Clean top navigation conforming to the frontend design specification.
- `src/components/modals/`:
  - `HelpModal.tsx`: Rules and illustrated examples.
  - `StatsModal.tsx`: Visual statistics, distribution chart, countdown, and share button.
  - `SettingsModal.tsx`: Hard mode, dark mode, high contrast mode, and sound effect toggles.
  - `ArchiveModal.tsx`: Past puzzle browser and random practice generator.
  - `GitHubModal.tsx`: In-app GitHub instructions and bugfix documentation.
- `src/utils/gameLogic.ts`: Scoring algorithm, date math, hard mode validation, and clipboard utilities.
- `src/utils/sound.ts`: Web Audio API synthesizer for keypress, flip, and victory sounds.
- `src/data/words.ts`: 2,309 PRNG-shuffled answers and 14,855 dictionary words.

---

## 📄 License
MIT License. Inspired by Josh Wardle's Wordle.

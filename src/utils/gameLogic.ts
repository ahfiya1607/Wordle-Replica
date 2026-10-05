import { ANSWERS, VALID_WORDS } from '../data/words';

export const EPOCH = new Date(2021, 5, 19); // Wordle #0 was June 19, 2021

export type TileStatus = 'correct' | 'present' | 'absent';

export interface GameSettings {
  hard: boolean;
  dark: boolean;
  contrast: boolean;
  sound: boolean;
}

export interface GameStats {
  played: number;
  won: number;
  streak: number;
  max: number;
  dist: number[];
  last: number;
}

export interface SavedPuzzleState {
  guesses: string[];
  results: TileStatus[][];
  status: 'playing' | 'won' | 'lost';
  answer: string | null;
}

export function getTodayPuzzleIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = today.getTime() - EPOCH.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

export function getAnswerForPuzzle(puzzleNumber: number): string {
  if (puzzleNumber < 0) return ANSWERS[0];
  return ANSWERS[puzzleNumber % ANSWERS.length];
}

export function isValidWord(word: string): boolean {
  if (!word || word.length !== 5) return false;
  return VALID_WORDS.has(word.toLowerCase());
}

/**
 * Two-pass Wordle scoring algorithm
 * Correctly accounts for repeated letters and priorities
 */
export function scoreGuess(guess: string, answer: string): TileStatus[] {
  const g = guess.toLowerCase();
  const a = answer.toLowerCase();
  const result: TileStatus[] = ['absent', 'absent', 'absent', 'absent', 'absent'];
  const remainingLetters: (string | null)[] = a.split('');

  // 1st pass: identify exact matches ('correct' / green)
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i] = 'correct';
      remainingLetters[i] = null;
    }
  }

  // 2nd pass: identify partial matches ('present' / yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'absent') {
      const idx = remainingLetters.indexOf(g[i]);
      if (idx !== -1) {
        result[i] = 'present';
        remainingLetters[idx] = null;
      }
    }
  }

  return result;
}

export function ordinal(n: number): string {
  const ords = ['1st', '2nd', '3rd', '4th', '5th'];
  return ords[n - 1] || `${n}th`;
}

/**
 * Checks if a guess violates Hard Mode constraints given past revealed clues
 */
export function checkHardModeError(
  guess: string,
  prevGuesses: string[],
  prevResults: TileStatus[][]
): string | null {
  const g = guess.toLowerCase();

  for (let r = 0; r < prevGuesses.length; r++) {
    const prevGuess = prevGuesses[r].toLowerCase();
    const prevResult = prevResults[r];

    // Must reuse exact position letters
    for (let i = 0; i < 5; i++) {
      if (prevResult[i] === 'correct' && g[i] !== prevGuess[i]) {
        return `${ordinal(i + 1)} letter must be ${prevGuess[i].toUpperCase()}`;
      }
    }

    // Must reuse present letters
    for (let i = 0; i < 5; i++) {
      if (prevResult[i] === 'present') {
        const requiredChar = prevGuess[i];
        if (!g.includes(requiredChar)) {
          return `Guess must contain ${requiredChar.toUpperCase()}`;
        }
      }
    }
  }

  return null;
}

export function getShareText(
  puzzle: number,
  guessesCount: number,
  isWon: boolean,
  isHardMode: boolean,
  results: TileStatus[][],
  isContrast: boolean,
  isDark: boolean
): string {
  const sq = {
    correct: isContrast ? '🟧' : '🟩',
    present: isContrast ? '🟦' : '🟨',
    absent: isDark ? '⬛' : '⬜',
  };

  const scoreLabel = isWon ? guessesCount.toString() : 'X';
  const header = `Wordle ${puzzle.toLocaleString()} ${scoreLabel}/6${isHardMode ? '*' : ''}\n\n`;
  const grid = results.map((row) => row.map((cell) => sq[cell]).join('')).join('\n');

  return header + grid;
}

/**
 * Safe clipboard copy with fallback to document.execCommand
 * ensuring functionality even within restricted iframe contexts
 */
export async function copyToClipboardSafe(text: string): Promise<boolean> {
  // Method 1: Modern navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to execCommand if rejected by browser iframe sandbox
    }
  }

  // Method 2: Legacy execCommand textarea injection
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

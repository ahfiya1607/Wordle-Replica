/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Toast, ToastMessage } from './components/Toast';
import { HelpModal } from './components/modals/HelpModal';
import { StatsModal } from './components/modals/StatsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ArchiveModal } from './components/modals/ArchiveModal';
import { GitHubModal } from './components/modals/GitHubModal';
import {
  getTodayPuzzleIndex,
  getAnswerForPuzzle,
  isValidWord,
  scoreGuess,
  checkHardModeError,
  TileStatus,
  GameSettings,
  GameStats,
  SavedPuzzleState,
} from './utils/gameLogic';
import { sounds } from './utils/sound';

const WIN_TOASTS = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'];

export default function App() {
  const todayPuzzleIndex = getTodayPuzzleIndex();

  // Determine initial puzzle number from URL query ?puzzle=N
  const [puzzle, setPuzzle] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('puzzle');
      if (param !== null) {
        const parsed = parseInt(param, 10);
        if (Number.isInteger(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    }
    return todayPuzzleIndex;
  });

  const isDaily = puzzle === todayPuzzleIndex;
  const currentAnswer = getAnswerForPuzzle(puzzle);

  // Game Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wordle_settings');
        if (stored) {
          return { hard: false, dark: false, contrast: false, sound: true, ...JSON.parse(stored) };
        }
      } catch {
        // fallback
      }
    }
    return { hard: false, dark: false, contrast: false, sound: true };
  });

  // Game Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wordle_stats');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // fallback
      }
    }
    return { played: 0, won: 0, streak: 0, max: 0, dist: [0, 0, 0, 0, 0, 0], last: -1 };
  });

  // Active Game State
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<TileStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyStatus, setKeyStatus] = useState<Record<string, TileStatus>>({});

  // Animation States
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [revealingCol, setRevealingCol] = useState<number>(0);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'help' | 'stats' | 'settings' | 'archive' | 'github' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Ref to prevent stale closures in async timeouts
  const guessesRef = useRef(guesses);
  guessesRef.current = guesses;
  const statusRef = useRef(status);
  statusRef.current = status;
  const isBusyRef = useRef(isBusy);
  isBusyRef.current = isBusy;

  // Sound manager sync
  useEffect(() => {
    sounds.enabled = settings.sound;
  }, [settings.sound]);

  // Synchronize theme classes on body
  useEffect(() => {
    document.body.classList.toggle('dark', settings.dark);
    document.body.classList.toggle('contrast', settings.contrast);
    try {
      localStorage.setItem('wordle_settings', JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  // Save Stats
  useEffect(() => {
    try {
      localStorage.setItem('wordle_stats', JSON.stringify(stats));
    } catch {
      // storage unavailable
    }
  }, [stats]);

  // Helper to show floating toast
  const showToast = useCallback((text: string, duration: number = 1800) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // Helper to load or restore puzzle state
  const loadPuzzleState = useCallback((pNum: number) => {
    try {
      const key = `wordle_state_${pNum}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: SavedPuzzleState = JSON.parse(saved);
        setGuesses(parsed.guesses || []);
        setResults(parsed.results || []);
        setStatus(parsed.status || 'playing');
        setCurrentGuess('');

        // Recalculate keyboard status
        const rank: Record<TileStatus, number> = { absent: 1, present: 2, correct: 3 };
        const newKeys: Record<string, TileStatus> = {};
        parsed.guesses.forEach((guessWord, rIdx) => {
          const res = parsed.results[rIdx];
          if (res) {
            for (let c = 0; c < 5; c++) {
              const ch = guessWord[c];
              const st = res[c];
              const currentRank = rank[newKeys[ch]] || 0;
              if (rank[st] > currentRank) {
                newKeys[ch] = st;
              }
            }
          }
        });
        setKeyStatus(newKeys);

        // If completed, open stats
        if (parsed.status !== 'playing') {
          setTimeout(() => setActiveModal('stats'), 500);
        }
        return;
      }
    } catch {
      // fallback
    }

    // Default clean state
    setGuesses([]);
    setResults([]);
    setStatus('playing');
    setCurrentGuess('');
    setKeyStatus({});
  }, []);

  // Initialize game on puzzle change
  useEffect(() => {
    loadPuzzleState(puzzle);
    // First time visitor gets help modal
    try {
      const seen = localStorage.getItem('wordle_seen_help');
      if (!seen) {
        localStorage.setItem('wordle_seen_help', 'true');
        setActiveModal('help');
      }
    } catch {
      // ignore
    }
  }, [puzzle, loadPuzzleState]);

  // Save current puzzle state
  const saveCurrentPuzzleState = useCallback(
    (newGuesses: string[], newResults: TileStatus[][], newStatus: 'playing' | 'won' | 'lost') => {
      try {
        const data: SavedPuzzleState = {
          guesses: newGuesses,
          results: newResults,
          status: newStatus,
          answer: newStatus !== 'playing' ? currentAnswer : null,
        };
        localStorage.setItem(`wordle_state_${puzzle}`, JSON.stringify(data));
      } catch {
        // ignore
      }
    },
    [puzzle, currentAnswer]
  );

  // Trigger row shake on input error
  const triggerShake = useCallback(() => {
    setIsShaking(true);
    sounds.playError();
    setTimeout(() => setIsShaking(false), 600);
  }, []);

  // Update virtual keyboard key status with priority ranking
  const updateKeyStatus = useCallback((word: string, rowResult: TileStatus[]) => {
    const rank: Record<TileStatus, number> = { absent: 1, present: 2, correct: 3 };
    setKeyStatus((prev) => {
      const next = { ...prev };
      for (let i = 0; i < 5; i++) {
        const ch = word[i];
        const st = rowResult[i];
        const currentRank = rank[next[ch]] || 0;
        if (rank[st] > currentRank) {
          next[ch] = st;
        }
      }
      return next;
    });
  }, []);

  // Submit current 5-letter guess
  const submitGuess = useCallback(() => {
    if (isBusyRef.current || statusRef.current !== 'playing') return;

    if (currentGuess.length < 5) {
      showToast('Not enough letters');
      triggerShake();
      return;
    }

    if (!isValidWord(currentGuess)) {
      showToast('Not in word list');
      triggerShake();
      return;
    }

    if (settings.hard) {
      const hardErr = checkHardModeError(currentGuess, guesses, results);
      if (hardErr) {
        showToast(hardErr, 2500);
        triggerShake();
        return;
      }
    }

    const rowIdx = guesses.length;
    const guessWord = currentGuess.toLowerCase();
    const result = scoreGuess(guessWord, currentAnswer);
    const isWon = result.every((s) => s === 'correct');
    const isLost = !isWon && rowIdx === 5;
    const nextStatus = isWon ? 'won' : isLost ? 'lost' : 'playing';

    // Lock keyboard during reveal animation
    setIsBusy(true);
    setRevealingRow(rowIdx);
    setRevealingCol(0);

    // Stagger reveal of each tile
    for (let c = 0; c < 5; c++) {
      setTimeout(() => {
        setRevealingCol(c);
        sounds.playFlip(c);
      }, c * 260);
    }

    // Animation completion
    setTimeout(() => {
      const updatedGuesses = [...guesses, guessWord];
      const updatedResults = [...results, result];

      setGuesses(updatedGuesses);
      setResults(updatedResults);
      setStatus(nextStatus);
      setCurrentGuess('');
      setRevealingRow(null);
      updateKeyStatus(guessWord, result);
      saveCurrentPuzzleState(updatedGuesses, updatedResults, nextStatus);

      if (isWon) {
        sounds.playWin();
        showToast(WIN_TOASTS[rowIdx] || 'Splendid', 2200);

        if (isDaily) {
          setStats((prev) => {
            const nextStreak = prev.last === puzzle - 1 ? prev.streak + 1 : 1;
            const newDist = [...prev.dist];
            newDist[rowIdx]++;
            return {
              played: prev.played + 1,
              won: prev.won + 1,
              streak: nextStreak,
              max: Math.max(prev.max, nextStreak),
              dist: newDist,
              last: puzzle,
            };
          });
        }

        setTimeout(() => {
          setIsBusy(false);
          setActiveModal('stats');
        }, 2200);
      } else if (isLost) {
        showToast(currentAnswer.toUpperCase(), 5000);

        if (isDaily) {
          setStats((prev) => ({
            ...prev,
            played: prev.played + 1,
            streak: 0,
            last: puzzle,
          }));
        }

        setTimeout(() => {
          setIsBusy(false);
          setActiveModal('stats');
        }, 2200);
      } else {
        setIsBusy(false);
      }
    }, 5 * 260 + 100);
  }, [
    currentGuess,
    guesses,
    results,
    currentAnswer,
    settings.hard,
    isDaily,
    puzzle,
    showToast,
    triggerShake,
    updateKeyStatus,
    saveCurrentPuzzleState,
  ]);

  // Handle single character / key input
  const handleKey = useCallback(
    (k: string) => {
      if (isBusyRef.current || statusRef.current !== 'playing' || activeModal !== null) {
        return;
      }

      const key = k.toLowerCase();

      if (key === 'enter') {
        submitGuess();
      } else if (key === 'backspace') {
        sounds.playKeypress();
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-z]$/.test(key)) {
        if (currentGuess.length < 5) {
          sounds.playKeypress();
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [currentGuess, activeModal, submitGuess]
  );

  // Physical Keyboard Listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (activeModal !== null) {
        if (e.key === 'Escape') {
          setActiveModal(null);
        }
        return;
      }
      handleKey(e.key);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, handleKey]);

  // Switch to a new puzzle
  const handleSelectPuzzle = (puzzleNum: number) => {
    const url = new URL(window.location.href);
    if (puzzleNum === todayPuzzleIndex) {
      url.searchParams.delete('puzzle');
    } else {
      url.searchParams.set('puzzle', String(puzzleNum));
    }
    window.history.pushState({}, '', url.toString());
    setPuzzle(puzzleNum);
  };

  // Play random past puzzle
  const handlePlayRandom = () => {
    const rand = Math.floor(Math.random() * (todayPuzzleIndex + 1));
    handleSelectPuzzle(rand);
  };

  // Check saved state for archive list
  const getPuzzleStatus = (pNum: number): SavedPuzzleState | null => {
    try {
      const data = localStorage.getItem(`wordle_state_${pNum}`);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  };

  // Setting update handler
  const handleUpdateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--fg)] select-none">
      <Toast toasts={toasts} />

      <Header
        puzzleNumber={puzzle}
        isDaily={isDaily}
        soundEnabled={settings.sound}
        onToggleSound={() => handleUpdateSetting('sound', !settings.sound)}
        onOpenHelp={() => setActiveModal('help')}
        onOpenStats={() => setActiveModal('stats')}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenArchive={() => setActiveModal('archive')}
        onOpenGitHub={() => setActiveModal('github')}
      />

      <Board
        guesses={guesses}
        results={results}
        currentGuess={currentGuess}
        isShaking={isShaking}
        revealingRow={revealingRow}
        revealingCol={revealingCol}
        isWon={status === 'won'}
      />

      <Keyboard
        keyStatus={keyStatus}
        onKeyPress={handleKey}
        disabled={status !== 'playing' || isBusy}
      />

      {/* Modals */}
      <HelpModal isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} />

      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
        stats={stats}
        puzzleNumber={puzzle}
        guessesCount={guesses.length}
        status={status}
        results={results}
        answer={currentAnswer}
        isHardMode={settings.hard}
        isContrast={settings.contrast}
        isDark={settings.dark}
        onPlayRandom={handlePlayRandom}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        canToggleHardMode={guesses.length === 0}
        onUpdateSetting={handleUpdateSetting}
        onShowToast={showToast}
      />

      <ArchiveModal
        isOpen={activeModal === 'archive'}
        onClose={() => setActiveModal(null)}
        currentPuzzle={puzzle}
        todayPuzzle={todayPuzzleIndex}
        onSelectPuzzle={handleSelectPuzzle}
        onPlayRandom={handlePlayRandom}
        getPuzzleStatus={getPuzzleStatus}
      />

      <GitHubModal
        isOpen={activeModal === 'github'}
        onClose={() => setActiveModal(null)}
        onShowToast={showToast}
      />
    </div>
  );
}

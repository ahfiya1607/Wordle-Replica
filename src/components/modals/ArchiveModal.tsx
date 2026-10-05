import React, { useState } from 'react';
import { X, Calendar, Shuffle, CheckCircle, Clock } from 'lucide-react';
import { SavedPuzzleState } from '../../utils/gameLogic';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPuzzle: number;
  todayPuzzle: number;
  onSelectPuzzle: (puzzleNum: number) => void;
  onPlayRandom: () => void;
  getPuzzleStatus: (puzzleNum: number) => SavedPuzzleState | null;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  currentPuzzle,
  todayPuzzle,
  onSelectPuzzle,
  onPlayRandom,
  getPuzzleStatus,
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customInput.trim(), 10);
    if (isNaN(num) || num < 0 || num > todayPuzzle) {
      setInputError(`Please enter a valid puzzle number between 0 and ${todayPuzzle}`);
      return;
    }
    setInputError('');
    onSelectPuzzle(num);
    onClose();
  };

  // Recent 12 puzzles for quick selection
  const recentPuzzles = Array.from({ length: Math.min(12, todayPuzzle + 1) }).map(
    (_, i) => todayPuzzle - i
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 bg-[var(--modal-overlay)] backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-title"
        className="relative w-full max-w-[500px] max-h-[85vh] overflow-y-auto bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-lg shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--border)]/40 transition-colors text-[var(--filled)] hover:text-[var(--fg)]"
          aria-label="Close archive"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="archive-title" className="text-center font-bold text-sm tracking-wider uppercase mb-5">
          Puzzle Archive
        </h2>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              onSelectPuzzle(todayPuzzle);
              onClose();
            }}
            className={`flex-1 py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wide border flex items-center justify-center gap-1.5 transition-colors ${
              currentPuzzle === todayPuzzle
                ? 'bg-[var(--correct)] text-white border-[var(--correct)]'
                : 'border-[var(--border)] hover:bg-[var(--border)]/30 text-[var(--fg)]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Today's Daily (#{todayPuzzle})
          </button>

          <button
            onClick={() => {
              onPlayRandom();
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wide border border-[var(--border)] hover:bg-[var(--border)]/30 text-[var(--fg)] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Random Past Puzzle
          </button>
        </div>

        {/* Jump to Specific Number */}
        <form onSubmit={handleCustomSubmit} className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--filled)] mb-2">
            Jump to Puzzle # (0 to {todayPuzzle})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={todayPuzzle}
              placeholder={`e.g. ${Math.floor(todayPuzzle / 2)}`}
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setInputError('');
              }}
              className="flex-1 px-3 py-2 text-sm rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--fg)] text-[var(--bg)] rounded font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Go
            </button>
          </div>
          {inputError && <p className="text-xs text-rose-500 font-medium mt-1.5">{inputError}</p>}
        </form>

        {/* Recent Puzzles Grid */}
        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--filled)] mb-3">
          Recent Puzzles
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {recentPuzzles.map((num) => {
            const saved = getPuzzleStatus(num);
            const isCurrent = num === currentPuzzle;
            let statusBadge = null;

            if (saved?.status === 'won') {
              statusBadge = <CheckCircle className="w-3.5 h-3.5 text-[var(--correct)] shrink-0" />;
            } else if (saved?.status === 'lost') {
              statusBadge = <span className="text-[10px] text-rose-500 font-bold uppercase">X</span>;
            } else if (saved?.status === 'playing' && saved.guesses.length > 0) {
              statusBadge = <span className="text-[10px] text-amber-500 font-bold uppercase">...</span>;
            }

            return (
              <button
                key={num}
                onClick={() => {
                  onSelectPuzzle(num);
                  onClose();
                }}
                className={`p-2.5 rounded border text-left flex items-center justify-between text-xs transition-colors ${
                  isCurrent
                    ? 'border-2 border-[var(--fg)] bg-[var(--border)]/20 font-bold'
                    : 'border-[var(--border)] hover:bg-[var(--border)]/20'
                }`}
              >
                <span className="font-mono">#{num}</span>
                {statusBadge}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

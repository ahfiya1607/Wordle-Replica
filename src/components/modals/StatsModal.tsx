import React, { useState, useEffect } from 'react';
import { X, Share2, Check, Sparkles, RefreshCw } from 'lucide-react';
import { GameStats, TileStatus, getShareText, copyToClipboardSafe } from '../../utils/gameLogic';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  puzzleNumber: number;
  guessesCount: number;
  status: 'playing' | 'won' | 'lost';
  results: TileStatus[][];
  answer: string | null;
  isHardMode: boolean;
  isContrast: boolean;
  isDark: boolean;
  onPlayRandom: () => void;
  onShowToast: (msg: string) => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  puzzleNumber,
  guessesCount,
  status,
  results,
  answer,
  isHardMode,
  isContrast,
  isDark,
  onPlayRandom,
  onShowToast,
}) => {
  const [countdown, setCountdown] = useState<string>('00:00:00');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffSecs = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
      const hours = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
      const seconds = String(diffSecs % 60).padStart(2, '0');
      setCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const isGameOver = status === 'won' || status === 'lost';
  const winPercent = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(1, ...stats.dist);
  const winningRowIndex = status === 'won' ? guessesCount - 1 : -1;

  const handleShare = async () => {
    const text = getShareText(
      puzzleNumber,
      guessesCount,
      status === 'won',
      isHardMode,
      results,
      isContrast,
      isDark
    );

    const success = await copyToClipboardSafe(text);
    if (success) {
      setCopied(true);
      onShowToast('Copied results to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } else {
      onShowToast('Share text ready');
    }
  };

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
        aria-labelledby="stats-title"
        className="relative w-full max-w-[500px] max-h-[88vh] overflow-y-auto bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-lg shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--border)]/40 transition-colors text-[var(--filled)] hover:text-[var(--fg)]"
          aria-label="Close statistics"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="stats-title" className="text-center font-bold text-sm tracking-wider uppercase mb-5">
          Statistics
        </h2>

        {/* 4 Stats Cards */}
        <div className="flex justify-center gap-3 sm:gap-6 mb-6">
          <div className="flex-1 max-w-[75px] text-center">
            <span className="block text-3xl sm:text-4xl font-light font-mono tabular-nums leading-tight">
              {stats.played}
            </span>
            <span className="text-[11px] sm:text-xs text-[var(--filled)] uppercase font-semibold">Played</span>
          </div>

          <div className="flex-1 max-w-[75px] text-center">
            <span className="block text-3xl sm:text-4xl font-light font-mono tabular-nums leading-tight">
              {winPercent}
            </span>
            <span className="text-[11px] sm:text-xs text-[var(--filled)] uppercase font-semibold">Win %</span>
          </div>

          <div className="flex-1 max-w-[75px] text-center">
            <span className="block text-3xl sm:text-4xl font-light font-mono tabular-nums leading-tight">
              {stats.streak}
            </span>
            <span className="text-[11px] sm:text-xs text-[var(--filled)] uppercase font-semibold">Current Streak</span>
          </div>

          <div className="flex-1 max-w-[75px] text-center">
            <span className="block text-3xl sm:text-4xl font-light font-mono tabular-nums leading-tight">
              {stats.max}
            </span>
            <span className="text-[11px] sm:text-xs text-[var(--filled)] uppercase font-semibold">Max Streak</span>
          </div>
        </div>

        {/* Guess Distribution */}
        <h3 className="font-bold text-sm uppercase tracking-wide mb-3">
          Guess Distribution
        </h3>

        <div className="space-y-1.5 mb-6 text-xs sm:text-sm font-bold">
          {stats.dist.map((count, idx) => {
            const isHighlighted = idx === winningRowIndex;
            const barWidthPercent = Math.max(7, Math.round((count / maxDist) * 100));

            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 text-right font-mono">{idx + 1}</span>
                <div className="flex-1 bg-[var(--border)]/20 rounded-xs overflow-hidden flex">
                  <div
                    style={{ width: `${barWidthPercent}%` }}
                    className={`px-2 py-0.5 text-right font-mono tabular-nums text-white text-xs transition-all duration-500 flex items-center justify-end ${
                      isHighlighted ? 'bg-[var(--correct)] font-bold' : 'bg-[var(--absent)]'
                    }`}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Banner if Lost */}
        {status === 'lost' && answer && (
          <div className="mb-5 p-3 rounded bg-[var(--border)]/30 text-center border border-[var(--border)]">
            <span className="text-xs uppercase tracking-wider text-[var(--filled)] font-bold block mb-1">
              The correct word was
            </span>
            <span className="text-xl sm:text-2xl font-serif font-black tracking-widest text-[var(--fg)] uppercase">
              {answer}
            </span>
          </div>
        )}

        {/* Bottom Section: Countdown & Share when game is over */}
        {isGameOver && (
          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="block text-xs uppercase font-bold tracking-wider text-[var(--filled)]">
                Next Wordle
              </span>
              <span className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold tracking-tight">
                {countdown}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded bg-[var(--correct)] text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 active:scale-98 transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onPlayRandom();
                }}
                className="p-3 rounded border border-[var(--border)] hover:bg-[var(--border)]/40 transition-colors text-[var(--fg)] flex items-center justify-center"
                title="Play a random past puzzle"
                aria-label="Play random puzzle"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

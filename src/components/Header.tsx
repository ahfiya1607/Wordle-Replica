import React from 'react';
import { HelpCircle, BarChart3, Settings, Calendar, Github, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  puzzleNumber: number;
  isDaily: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenArchive: () => void;
  onOpenGitHub: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  puzzleNumber,
  isDaily,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onOpenStats,
  onOpenSettings,
  onOpenArchive,
  onOpenGitHub,
}) => {
  return (
    <header className="w-full max-w-[540px] mx-auto flex items-center justify-between h-14 px-3 sm:px-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onOpenHelp}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
          aria-label="How to play"
          title="How to play"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenArchive}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors flex items-center gap-1 text-xs font-semibold"
          aria-label="Puzzle Archive"
          title="Play past or random puzzles"
        >
          <Calendar className="w-5 h-5" />
          <span className="hidden sm:inline">#{puzzleNumber}</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-[var(--fg)] leading-none select-none">
          WORDLE
        </h1>
        {!isDaily && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--filled)] -mt-0.5">
            Practice #{puzzleNumber}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onToggleSound}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button
          onClick={onOpenGitHub}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
          aria-label="GitHub Repository & Bugfixes"
          title="GitHub Repo & Fixes"
        >
          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenStats}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
          aria-label="Game Statistics"
          title="Statistics"
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded text-[var(--filled)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        aria-labelledby="help-title"
        className="relative w-full max-w-[500px] max-h-[85vh] overflow-y-auto bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-lg shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--border)]/40 transition-colors text-[var(--filled)] hover:text-[var(--fg)]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="help-title" className="text-center font-bold text-sm tracking-wider uppercase mb-4">
          How To Play
        </h2>

        <p className="text-base sm:text-lg mb-3 font-medium">Guess the Wordle in 6 tries.</p>

        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base leading-relaxed text-[var(--fg)]/90 mb-5">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was to the word.</li>
        </ul>

        <h3 className="font-bold text-sm uppercase tracking-wide mb-3 border-b border-[var(--border)] pb-1">
          Examples
        </h3>

        {/* Example 1 */}
        <div className="mb-4">
          <div className="flex gap-1.5 mb-2">
            <div className="w-10 h-10 border-2 border-[var(--correct)] bg-[var(--correct)] text-white font-bold flex items-center justify-center text-xl">
              W
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              E
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              A
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              R
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              Y
            </div>
          </div>
          <p className="text-sm">
            <span className="font-bold">W</span> is in the word and in the correct spot.
          </p>
        </div>

        {/* Example 2 */}
        <div className="mb-4">
          <div className="flex gap-1.5 mb-2">
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              P
            </div>
            <div className="w-10 h-10 border-2 border-[var(--present)] bg-[var(--present)] text-white font-bold flex items-center justify-center text-xl">
              I
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              L
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              L
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              S
            </div>
          </div>
          <p className="text-sm">
            <span className="font-bold">I</span> is in the word but in the wrong spot.
          </p>
        </div>

        {/* Example 3 */}
        <div className="mb-5">
          <div className="flex gap-1.5 mb-2">
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              V
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              A
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              G
            </div>
            <div className="w-10 h-10 border-2 border-[var(--absent)] bg-[var(--absent)] text-white font-bold flex items-center justify-center text-xl">
              U
            </div>
            <div className="w-10 h-10 border-2 border-[var(--border)] text-[var(--fg)] font-bold flex items-center justify-center text-xl">
              E
            </div>
          </div>
          <p className="text-sm">
            <span className="font-bold">U</span> is not in the word in any spot.
          </p>
        </div>

        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--filled)] leading-relaxed">
          A new puzzle is released every day at midnight! You can also play past archives or random practice puzzles using the calendar menu.
        </div>
      </div>
    </div>
  );
};

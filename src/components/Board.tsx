import React from 'react';
import { TileStatus } from '../utils/gameLogic';

interface BoardProps {
  guesses: string[];
  results: TileStatus[][];
  currentGuess: string;
  isShaking: boolean;
  revealingRow: number | null;
  revealingCol: number;
  isWon: boolean;
}

export const Board: React.FC<BoardProps> = ({
  guesses,
  results,
  currentGuess,
  isShaking,
  revealingRow,
  revealingCol,
  isWon,
}) => {
  const rows = Array.from({ length: 6 });

  return (
    <main className="flex-1 flex items-center justify-center py-2 px-2 min-h-0 select-none">
      <div
        id="board"
        className="grid grid-rows-6 gap-1.5 sm:gap-2 p-1 w-full max-w-[350px] aspect-[5/6] max-h-[calc(100dvh-270px)] mx-auto"
      >
        {rows.map((_, rowIndex) => {
          const isSubmitted = rowIndex < guesses.length;
          const isCurrent = rowIndex === guesses.length;
          const isWinningRow = isWon && rowIndex === guesses.length - 1;
          const shouldShake = isCurrent && isShaking;

          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${shouldShake ? 'animate-shake' : ''}`}
            >
              {Array.from({ length: 5 }).map((_, colIndex) => {
                let letter = '';
                let status: TileStatus | null = null;
                let isFilled = false;
                let isFlipping = false;
                let isRevealed = false;

                if (isSubmitted) {
                  letter = guesses[rowIndex][colIndex] || '';
                  status = results[rowIndex]?.[colIndex] || 'absent';
                  
                  if (revealingRow === rowIndex) {
                    isFlipping = colIndex <= revealingCol;
                    isRevealed = colIndex < revealingCol || (colIndex === revealingCol && true);
                  } else {
                    isRevealed = true;
                  }
                } else if (isCurrent) {
                  letter = currentGuess[colIndex] || '';
                  isFilled = Boolean(letter);
                }

                // Determine CSS classes for tile
                let tileClass = 'border-2 border-[var(--border)] text-[var(--fg)] bg-transparent';

                if (isFilled && !isSubmitted) {
                  tileClass = 'border-2 border-[var(--border-active)] text-[var(--fg)] animate-pop';
                }

                if (isSubmitted && isRevealed && status) {
                  if (status === 'correct') {
                    tileClass = 'bg-[var(--correct)] text-white border-[var(--correct)]';
                  } else if (status === 'present') {
                    tileClass = 'bg-[var(--present)] text-white border-[var(--present)]';
                  } else if (status === 'absent') {
                    tileClass = 'bg-[var(--absent)] text-white border-[var(--absent)]';
                  }
                }

                // Bounce animation on winning row
                const bounceDelay = isWinningRow ? `${colIndex * 120}ms` : undefined;

                return (
                  <div
                    key={colIndex}
                    style={{
                      animationDelay: bounceDelay,
                    }}
                    className={`aspect-square flex items-center justify-center font-bold text-2xl sm:text-3xl uppercase leading-none rounded-none transition-colors duration-250 select-none ${tileClass} ${
                      isWinningRow ? 'animate-bounce-win' : ''
                    } ${isFlipping ? 'scale-y-100' : ''}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  );
};

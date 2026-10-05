import React from 'react';
import { TileStatus } from '../utils/gameLogic';

interface KeyboardProps {
  keyStatus: Record<string, TileStatus>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
];

export const Keyboard: React.FC<KeyboardProps> = ({
  keyStatus,
  onKeyPress,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
    e.currentTarget.blur();
    if (!disabled) {
      onKeyPress(key);
    }
  };

  return (
    <div
      id="keyboard"
      className="w-full max-w-[500px] mx-auto px-1.5 sm:px-2 pb-3 select-none touch-manipulation"
      aria-label="Virtual Keyboard"
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 justify-center">
          {rowIndex === 1 && <div className="flex-[0.5]" aria-hidden="true" />}

          {row.map((key) => {
            const isSpecial = key === 'enter' || key === 'backspace';
            const status = keyStatus[key];

            let bgClass = 'bg-[var(--key)] text-[var(--keyfg)] hover:bg-[var(--key-hover)]';
            if (status === 'correct') {
              bgClass = 'bg-[var(--correct)] text-white';
            } else if (status === 'present') {
              bgClass = 'bg-[var(--present)] text-white';
            } else if (status === 'absent') {
              bgClass = 'bg-[var(--absent)] text-white';
            }

            return (
              <button
                key={key}
                type="button"
                onClick={(e) => handleClick(e, key)}
                aria-label={key === 'backspace' ? 'Backspace' : key.toUpperCase()}
                className={`h-14 sm:h-[58px] rounded font-bold text-xs sm:text-sm uppercase flex items-center justify-center transition-colors active:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] ${
                  isSpecial ? 'flex-[1.5] text-[11px] sm:text-xs' : 'flex-1'
                } ${bgClass}`}
              >
                {key === 'backspace' ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}

          {rowIndex === 1 && <div className="flex-[0.5]" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
};

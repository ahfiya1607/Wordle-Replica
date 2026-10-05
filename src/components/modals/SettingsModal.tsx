import React from 'react';
import { X } from 'lucide-react';
import { GameSettings } from '../../utils/gameLogic';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  canToggleHardMode: boolean;
  onUpdateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  canToggleHardMode,
  onUpdateSetting,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleHardModeChange = (checked: boolean) => {
    if (checked && !canToggleHardMode) {
      onShowToast('Hard mode can only be enabled at the start of a round');
      return;
    }
    onUpdateSetting('hard', checked);
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
        aria-labelledby="settings-title"
        className="relative w-full max-w-[500px] max-h-[85vh] overflow-y-auto bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-lg shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--border)]/40 transition-colors text-[var(--filled)] hover:text-[var(--fg)]"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="settings-title" className="text-center font-bold text-sm tracking-wider uppercase mb-5">
          Settings
        </h2>

        <div className="divide-y divide-[var(--border)] text-sm">
          {/* Hard Mode */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold">Hard Mode</div>
              <div className="text-xs text-[var(--filled)] mt-0.5">
                Any revealed hints must be used in subsequent guesses
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.hard}
                onChange={(e) => handleHardModeChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--correct)]"></div>
            </label>
          </div>

          {/* Dark Theme */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold">Dark Theme</div>
              <div className="text-xs text-[var(--filled)] mt-0.5">
                Switch between high-clarity dark and light palettes
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.dark}
                onChange={(e) => onUpdateSetting('dark', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--correct)]"></div>
            </label>
          </div>

          {/* High Contrast Mode */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold">High Contrast Mode</div>
              <div className="text-xs text-[var(--filled)] mt-0.5">
                High contrast orange and sky blue for improved color vision
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.contrast}
                onChange={(e) => onUpdateSetting('contrast', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--correct)]"></div>
            </label>
          </div>

          {/* Sound Effects */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold">Sound Effects</div>
              <div className="text-xs text-[var(--filled)] mt-0.5">
                Play click, flip, and win chimes using Web Audio
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => onUpdateSetting('sound', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--correct)]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-xs text-[var(--filled)] flex justify-between items-center">
          <span>Wordle Replica v1.0</span>
          <span>Original Game by Josh Wardle</span>
        </div>
      </div>
    </div>
  );
};

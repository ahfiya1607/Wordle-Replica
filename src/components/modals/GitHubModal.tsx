import React, { useState } from 'react';
import { X, Github, Check, Copy, Bug, GitBranch, Terminal } from 'lucide-react';
import { copyToClipboardSafe } from '../../utils/gameLogic';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const gitCommands = `# 1. Add your GitHub remote repository:
git remote add origin https://github.com/YOUR_USERNAME/wordle-replica.git

# 2. Rename branch to main (if not already):
git branch -M main

# 3. Push to your GitHub:
git push -u origin main`;

  const handleCopy = async () => {
    const success = await copyToClipboardSafe(gitCommands);
    if (success) {
      setCopied(true);
      onShowToast('Git commands copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
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
        aria-labelledby="github-title"
        className="relative w-full max-w-[540px] max-h-[85vh] overflow-y-auto bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-lg shadow-2xl p-6 sm:p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--border)]/40 transition-colors text-[var(--filled)] hover:text-[var(--fg)]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded bg-[var(--border)]/40 text-[var(--fg)]">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 id="github-title" className="font-bold text-base tracking-wide uppercase">
              GitHub & Bug Fixes
            </h2>
            <p className="text-xs text-[var(--filled)]">
              Replica audit, solved bugs & Git push instructions
            </p>
          </div>
        </div>

        {/* Solved Errors Section */}
        <div className="mb-6">
          <h3 className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[var(--filled)] mb-2.5">
            <Bug className="w-4 h-4 text-emerald-500" />
            Original Code Errors Diagnosed & Resolved
          </h3>
          <div className="space-y-2 text-xs leading-relaxed">
            <div className="p-2.5 rounded bg-[var(--border)]/20 border border-[var(--border)]">
              <span className="font-bold text-[var(--fg)] block mb-0.5">
                1. Missing Data Files & Server Dependency
              </span>
              <span className="text-[var(--filled)]">
                The Python code relied on <code className="bg-[var(--border)] px-1 rounded">answers.txt</code> and <code className="bg-[var(--border)] px-1 rounded">allowed.txt</code> causing FileNotFoundError. We extracted all 2,309 words, applied the exact <code className="bg-[var(--border)] px-1 rounded">random.Random(2021).shuffle()</code> order, and bundled 14,855 dictionary words.
              </span>
            </div>

            <div className="p-2.5 rounded bg-[var(--border)]/20 border border-[var(--border)]">
              <span className="font-bold text-[var(--fg)] block mb-0.5">
                2. Jinja2 Template Syntax Crash
              </span>
              <span className="text-[var(--filled)]">
                <code className="bg-[var(--border)] px-1 rounded">window.TODAY = {`{{ today }}`}</code> broke in browser JS. Replaced with pure date computation based on epoch <code className="bg-[var(--border)] px-1 rounded">2021-06-19</code>.
              </span>
            </div>

            <div className="p-2.5 rounded bg-[var(--border)]/20 border border-[var(--border)]">
              <span className="font-bold text-[var(--fg)] block mb-0.5">
                3. Wordle #0 Unplayable Bug
              </span>
              <span className="text-[var(--filled)]">
                <code className="bg-[var(--border)] px-1 rounded">parseInt(search.get("puzzle")) || TODAY</code> evaluated <code className="bg-[var(--border)] px-1 rounded">0 || TODAY</code> to <code className="bg-[var(--border)] px-1 rounded">TODAY</code> because 0 is falsy. Fixed with <code className="bg-[var(--border)] px-1 rounded">Number.isInteger</code>.
              </span>
            </div>

            <div className="p-2.5 rounded bg-[var(--border)]/20 border border-[var(--border)]">
              <span className="font-bold text-[var(--fg)] block mb-0.5">
                4. Permanent Keyboard Lock & Iframe Clipboard
              </span>
              <span className="text-[var(--filled)]">
                If fetch failed, <code className="bg-[var(--border)] px-1 rounded">busy = true</code> locked keys permanently. Also, modern clipboard permissions failed in sandboxed iframes without a fallback. Both are now bulletproof.
              </span>
            </div>
          </div>
        </div>

        {/* Git & GitHub Setup */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[var(--filled)]">
              <Terminal className="w-4 h-4 text-sky-500" />
              Add To Your GitHub
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-bold text-[var(--correct)] hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Commands'}
            </button>
          </div>

          <div className="relative mb-3">
            <pre className="p-3 rounded bg-[var(--border)]/30 border border-[var(--border)] text-[11px] font-mono leading-relaxed overflow-x-auto text-[var(--fg)]">
              {gitCommands}
            </pre>
          </div>

          {/* Download Project ZIP option */}
          <div className="p-3 rounded bg-[var(--border)]/20 border border-[var(--border)] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-[var(--fg)]">Need the offline source files?</div>
              <div className="text-[11px] text-[var(--filled)]">
                Download the complete code bundle as a ZIP archive.
              </div>
            </div>
            <a
              href="/wordle-replica.zip"
              download="wordle-replica.zip"
              className="px-3 py-1.5 rounded bg-[var(--correct)] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0"
            >
              Download .ZIP
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--filled)] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" /> Ready to commit & push
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[var(--fg)] text-[var(--bg)] font-bold uppercase tracking-wider text-[11px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

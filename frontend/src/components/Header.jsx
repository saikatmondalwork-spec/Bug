import { useState } from 'react'
import { Bug, RotateCcw, Terminal, HelpCircle } from 'lucide-react'

export default function Header({ aiHealth, onClearWorkspace }) {
  const [showHelp, setShowHelp] = useState(false)

  const isLive = aiHealth?.mode === 'live' || aiHealth?.geminiConfigured
  const statusLabel = isLive ? 'AI Ready (Live)' : 'AI Ready (Demo Fallback)'
  const statusTooltip = isLive
    ? 'Gemini 3.8 Flash engine connected and active'
    : 'Running in demo mode with pre-computed diagnoses'

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Bug className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#0b0f19]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 tracking-tight text-sm sm:text-base flex items-center gap-1.5">
                BugPilot <span className="text-indigo-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">AI</span>
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded">
                Workspace
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI-powered debugging assistant</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Shortcut hint */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-md">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Enter</kbd>
            <span>to analyze</span>
          </div>

          {/* AI Status Badge */}
          <div
            title={statusTooltip}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-900/80 border-slate-800 text-slate-300 cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs flex items-center gap-1">
              <span>{statusLabel}</span>
            </span>
          </div>

          {/* Quick Clear Workspace */}
          <button
            type="button"
            onClick={onClearWorkspace}
            title="Reset code, error message, and results"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Help popover toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              aria-label="How BugPilot works"
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {showHelp && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3.5 bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl z-50 text-xs text-slate-300 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    How BugPilot Works
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHelp(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
                <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed text-[11px]">
                  <li>Select your language: Python, JS, or C++.</li>
                  <li>Paste the runtime error or stack trace.</li>
                  <li>Provide your source code or choose an example.</li>
                  <li>Click <strong className="text-indigo-400">Analyze Bug</strong> to inspect root causes, explanation, and fixes.</li>
                  <li>Review the visual diff and click <strong className="text-emerald-400">Accept Changes</strong> to apply fixes directly.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

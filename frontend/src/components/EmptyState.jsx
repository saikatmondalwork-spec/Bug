import { CheckCircle2, Cpu } from 'lucide-react'

export default function EmptyState({ onSelectSample }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] py-12 px-4 sm:px-6 text-center">
      {/* Icon badge */}
      <div className="relative mb-5 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent border border-indigo-500/25 text-indigo-400 shadow-[0_0_24px_rgba(99,102,241,0.15)]">
        <Cpu className="w-7 h-7 text-indigo-400 animate-pulse" />
        <div className="absolute -inset-1 rounded-2xl bg-indigo-500/10 blur-sm -z-10" />
      </div>

      {/* Main Title & Description */}
      <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1.5 tracking-tight">
        Ready to Debug
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
        Paste your stack trace and code on the left to start an AI-powered root-cause diagnosis.
      </p>

      {/* Subtle capability indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-md mb-6">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0b0f19] border border-slate-800/80 text-left text-xs text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-[11px] font-medium">Root-cause diagnosis</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0b0f19] border border-slate-800/80 text-left text-xs text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[11px] font-medium">Detailed explanations</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0b0f19] border border-slate-800/80 text-left text-xs text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-medium">One-click diff & fix</span>
        </div>
      </div>

      {/* Quick sample prompt chip */}
      {onSelectSample && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-[11px] text-slate-400 font-mono">Quick test:</span>
          <button
            type="button"
            onClick={() => onSelectSample('py-index-error')}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer"
          >
            Python IndexError
          </button>
          <button
            type="button"
            onClick={() => onSelectSample('js-type-error')}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            JS TypeError
          </button>
          <button
            type="button"
            onClick={() => onSelectSample('cpp-out-of-bounds')}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 hover:border-sky-500/40 transition-colors cursor-pointer"
          >
            C++ Segfault
          </button>
        </div>
      )}
    </div>
  )
}

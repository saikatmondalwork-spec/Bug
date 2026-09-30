import { AlertCircle, X } from 'lucide-react'

const MAX_ERROR_LENGTH = 2000

export default function ErrorInput({ value, onChange }) {
  const lineCount = value ? value.split('\n').length : 0
  const charCount = value ? value.length : 0
  const isNearLimit = charCount > MAX_ERROR_LENGTH * 0.9

  return (
    <div className="space-y-1.5">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs">
        <label
          htmlFor="error-input"
          className="flex items-center gap-1.5 font-semibold text-slate-300 tracking-wide uppercase text-[11px]"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Error / Stack Trace</span>
        </label>
        
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          <span className={`font-mono text-[10px] ${
            isNearLimit ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}>
            {lineCount > 0 ? `${lineCount} ${lineCount === 1 ? 'line' : 'lines'} · ` : ''}
            {charCount}/{MAX_ERROR_LENGTH}
          </span>
        </div>
      </div>

      {/* Terminal-like error textarea */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#080c14] focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all shadow-inner">
        <div className="flex items-center justify-between px-3 py-1 bg-[#0d121f] border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="ml-1 text-slate-400 font-medium">stderr / console</span>
          </div>
          <span className="text-slate-400">plain / stacktrace</span>
        </div>

        <textarea
          id="error-input"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_ERROR_LENGTH))}
          placeholder="Paste your error message, exception, or stack trace here..."
          className="w-full h-28 sm:h-32 p-3 bg-transparent text-xs sm:text-[13px] font-mono text-rose-200/90 placeholder:text-slate-600 resize-y leading-relaxed focus:outline-none"
          spellCheck={false}
          aria-label="Error message or stack trace"
        />
      </div>
    </div>
  )
}

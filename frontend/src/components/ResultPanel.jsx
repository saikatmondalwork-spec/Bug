import { useState } from 'react'
import {
  AlertTriangle,
  Info,
  CheckCircle,
  FileCode,
  Copy,
  Check,
  Sparkles,
  GitCompare,
  Code2,
} from 'lucide-react'
import DiffViewer from './DiffViewer'

// Helper to render inline code like `var` and bold **term** cleanly
function FormattedText({ content }) {
  if (!content) return null

  // Split lines into paragraphs
  const paragraphs = content.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed text-slate-300">
      {paragraphs.map((p, pIdx) => {
        // Parse inline formatting: `code` and **bold**
        const parts = p.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        return (
          <p key={pIdx}>
            {parts.map((part, i) => {
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-amber-300 font-mono text-[12px] font-normal"
                  >
                    {part.slice(1, -1)}
                  </code>
                )
              }
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-semibold text-slate-100">
                    {part.slice(2, -2)}
                  </strong>
                )
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}

export default function ResultPanel({
  result,
  language,
  originalCode,
  changeStatus,
  onAcceptChanges,
  onRevertChanges,
  onApplyFixAgain,
  timestamp,
  apiMode,
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'diff'
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const { rootCause, explanation, suggestedFix, fixedCode } = result

  async function handleCopy() {
    if (!fixedCode) return
    try {
      await navigator.clipboard.writeText(fixedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }

  const fixedLines = fixedCode ? fixedCode.split('\n') : []

  return (
    <div className="space-y-4">
      {/* AI Analysis Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>AI Analysis</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Completed
              </span>
            </h2>
          </div>
        </div>

        {/* Metadata badges and View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {apiMode && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              apiMode === 'live'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
            }`}>
              {apiMode === 'live' ? 'LIVE GEMINI ANALYSIS' : 'DEMO FALLBACK ANALYSIS'}
            </span>
          )}

          {language && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              {language}
            </span>
          )}

          {timestamp && (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {timestamp}
            </span>
          )}

          {/* Toggle between Overview and Visual Diff */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[#080c14] border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Fix</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'diff'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-3 h-3" />
              <span>Diff</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'diff' ? (
        /* Visual Diff View */
        <div className="space-y-4">
          <DiffViewer
            originalCode={originalCode || ''}
            fixedCode={fixedCode || ''}
            changeStatus={changeStatus}
            onAcceptChanges={onAcceptChanges}
            onRevertChanges={onRevertChanges}
            onApplyFixAgain={onApplyFixAgain}
          />

          {/* Quick Summary under diff */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-[#0b0f19] text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Resolution</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {suggestedFix}
            </p>
          </div>
        </div>
      ) : (
        /* Standard Structured Analysis View */
        <div className="space-y-3.5">
          {/* 1. ROOT CAUSE (Red / Orange accent) */}
          <section
            className="rounded-lg p-3.5 border border-rose-500/25 bg-rose-950/15 shadow-sm"
            aria-label="Root Cause"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-3 h-3" />
              </span>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                Root Cause
              </h3>
            </div>
            <div className="text-xs sm:text-[13px] font-medium text-rose-100/90 leading-relaxed">
              <FormattedText content={rootCause} />
            </div>
          </section>

          {/* 2. EXPLANATION (Blue accent) */}
          <section
            className="rounded-lg p-3.5 border border-sky-500/25 bg-sky-950/15 shadow-sm"
            aria-label="Detailed Explanation"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Info className="w-3 h-3" />
              </span>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-sky-300">
                Explanation
              </h3>
            </div>
            <div className="text-slate-300 leading-relaxed">
              <FormattedText content={explanation} />
            </div>
          </section>

          {/* 3. SUGGESTED FIX (Green accent) */}
          <section
            className="rounded-lg p-3.5 border border-emerald-500/25 bg-emerald-950/15 shadow-sm"
            aria-label="Suggested Fix"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3" />
              </span>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                Suggested Fix
              </h3>
            </div>
            <div className="text-slate-300 leading-relaxed">
              <FormattedText content={suggestedFix} />
            </div>
          </section>

          {/* 4. FIXED CODE (IDE-style dark code block) */}
          {fixedCode && (
            <section
              className="rounded-lg border border-slate-800 bg-[#080c14] overflow-hidden shadow-inner"
              aria-label="Fixed Code"
            >
              {/* Header Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#0d121f] border-b border-slate-800 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <FileCode className="w-3 h-3" />
                  </span>
                  <span className="font-semibold text-slate-200 text-xs">
                    Corrected Code
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({fixedLines.length} {fixedLines.length === 1 ? 'line' : 'lines'})
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {changeStatus === 'pending' && (
                    <button
                      type="button"
                      onClick={onAcceptChanges}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow-sm shadow-emerald-500/20 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept Changes
                    </button>
                  )}

                  {changeStatus === 'accepted' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Changes Applied
                      </span>
                      <button
                        type="button"
                        onClick={onRevertChanges}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                      >
                        Revert
                      </button>
                    </div>
                  )}

                  {changeStatus === 'reverted' && (
                    <button
                      type="button"
                      onClick={onApplyFixAgain}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 rounded transition-colors cursor-pointer"
                    >
                      Apply Fix
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
                    aria-label="Copy fixed code to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code viewer with line numbers */}
              <div className="font-mono text-xs overflow-x-auto max-h-72 overflow-y-auto p-2 bg-[#080c14]">
                <table className="w-full border-collapse">
                  <tbody>
                    {fixedLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 leading-5">
                        <td className="w-8 pr-3 text-right select-none text-[11px] text-slate-400 font-mono align-top">
                          {idx + 1}
                        </td>
                        <td className="text-slate-200 whitespace-pre font-mono text-[12px] align-top">
                          {line || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

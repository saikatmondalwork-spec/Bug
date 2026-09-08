import { useState } from 'react'

export default function ResultPanel({
  result,
  changeStatus,
  onAcceptChanges,
  onRevertChanges,
  onApplyFixAgain,
}) {
  if (!result) return null

  const { rootCause, explanation, suggestedFix, fixedCode } = result

  return (
    <div className="space-y-4 h-full">
      <h2 className="text-base font-semibold text-gray-800">Debugging Result</h2>

      <ResultSection title="Root Cause" color="red">
        <p className="text-sm text-gray-700 leading-relaxed">{rootCause ?? '—'}</p>
      </ResultSection>

      <ResultSection title="Explanation" color="blue">
        <p className="text-sm text-gray-700 leading-relaxed">{explanation ?? '—'}</p>
      </ResultSection>

      <ResultSection title="Suggested Fix" color="green">
        <p className="text-sm text-gray-700 leading-relaxed">{suggestedFix ?? '—'}</p>
      </ResultSection>

      {fixedCode && (
        <ResultSection title="Fixed Code" color="purple">
          <CodeBlock
            code={fixedCode}
            changeStatus={changeStatus}
            onAcceptChanges={onAcceptChanges}
            onRevertChanges={onRevertChanges}
            onApplyFixAgain={onApplyFixAgain}
          />
        </ResultSection>
      )}
    </div>
  )
}

const COLOR_CLASSES = {
  red: 'border-red-400 bg-red-50',
  blue: 'border-blue-400 bg-blue-50',
  green: 'border-green-400 bg-green-50',
  purple: 'border-purple-400 bg-purple-50',
}

function ResultSection({ title, color, children }) {
  return (
    <div className={`border-l-4 rounded-r-lg p-3.5 ${COLOR_CLASSES[color]}`}>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        {title}
      </h3>
      {children}
    </div>
  )
}

function CodeBlock({
  code,
  changeStatus,
  onAcceptChanges,
  onRevertChanges,
  onApplyFixAgain,
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently fail
    }
  }

  return (
    <div className="relative mt-1">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          {changeStatus === 'pending' && (
            <button
              type="button"
              onClick={onAcceptChanges}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <span>✓</span> Accept Changes
            </button>
          )}
          {changeStatus === 'accepted' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-md">
              ✓ Changes Accepted
            </span>
          )}
          {changeStatus === 'reverted' && (
            <button
              type="button"
              onClick={onApplyFixAgain}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 rounded-md transition-colors cursor-pointer"
            >
              ✨ Apply to Editor
            </button>
          )}
          {changeStatus === 'accepted' && (
            <button
              type="button"
              onClick={onRevertChanges}
              className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
            >
              Revert
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer ml-auto"
          aria-label="Copy fixed code to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      <pre className="text-xs bg-white border border-purple-200 rounded p-3 overflow-x-auto whitespace-pre font-mono leading-relaxed max-h-72 overflow-y-auto">
        {code}
      </pre>
    </div>
  )
}

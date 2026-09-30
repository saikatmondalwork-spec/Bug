import { useState, useMemo } from 'react'
import { Check, Copy, GitCompare } from 'lucide-react'

// Simple robust LCS-based diff for lines
function computeDiff(oldStr = '', newStr = '') {
  const oldLines = oldStr.split('\n')
  const newLines = newStr.split('\n')

  const m = oldLines.length
  const n = newLines.length

  // Standard DP matrix for Longest Common Subsequence of lines
  // For safety against huge files, limit m, n <= 1000
  if (m > 1000 || n > 1000) {
    return [
      ...oldLines.map((l, i) => ({ type: 'del', oldNum: i + 1, newNum: null, text: l })),
      ...newLines.map((l, i) => ({ type: 'add', oldNum: null, newNum: i + 1, text: l })),
    ]
  }

  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (oldLines[i] === newLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  // Backtrack to build diff
  let i = m
  let j = n
  const result = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({
        type: 'equal',
        oldNum: i,
        newNum: j,
        text: oldLines[i - 1],
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: 'add',
        oldNum: null,
        newNum: j,
        text: newLines[j - 1],
      })
      j--
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: 'del',
        oldNum: i,
        newNum: null,
        text: oldLines[i - 1],
      })
      i--
    }
  }

  return result
}

export default function DiffViewer({
  originalCode = '',
  fixedCode = '',
  changeStatus,
  onAcceptChanges,
  onRevertChanges,
  onApplyFixAgain,
}) {
  const [copied, setCopied] = useState(false)

  const diffLines = useMemo(() => {
    return computeDiff(originalCode, fixedCode)
  }, [originalCode, fixedCode])

  const stats = useMemo(() => {
    let additions = 0
    let deletions = 0
    diffLines.forEach((line) => {
      if (line.type === 'add') additions++
      if (line.type === 'del') deletions++
    })
    return { additions, deletions }
  }, [diffLines])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fixedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#080c14] shadow-inner space-y-0">
      {/* Diff Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d121f] border-b border-slate-800 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Diff Comparison</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +{stats.additions}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              -{stats.deletions}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {changeStatus === 'pending' && (
            <button
              type="button"
              onClick={onAcceptChanges}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3" />
              Accept Changes
            </button>
          )}

          {changeStatus === 'accepted' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3" />
                Accepted
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
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors cursor-pointer"
            title="Copy fixed code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unified Diff Viewer */}
      <div className="font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto divide-y divide-slate-800/30">
        {diffLines.map((line, idx) => {
          const isDel = line.type === 'del'
          const isAdd = line.type === 'add'

          let rowBg = 'hover:bg-slate-900/40 text-slate-300'
          let sign = ' '
          let signColor = 'text-slate-400'

          if (isDel) {
            rowBg = 'bg-rose-950/25 text-rose-200 hover:bg-rose-950/40 border-l-2 border-l-rose-500'
            sign = '-'
            signColor = 'text-rose-400 font-bold'
          } else if (isAdd) {
            rowBg = 'bg-emerald-950/25 text-emerald-200 hover:bg-emerald-950/40 border-l-2 border-l-emerald-500'
            sign = '+'
            signColor = 'text-emerald-400 font-bold'
          }

          return (
            <div
              key={idx}
              className={`flex items-stretch font-mono text-[12px] leading-5 select-text transition-colors ${rowBg}`}
            >
              {/* Old line number */}
              <span className="w-10 shrink-0 text-right pr-2 py-0.5 select-none text-[11px] text-slate-400 font-mono">
                {line.oldNum ?? ''}
              </span>

              {/* New line number */}
              <span className="w-10 shrink-0 text-right pr-2 py-0.5 select-none text-[11px] text-slate-400 font-mono border-r border-slate-800">
                {line.newNum ?? ''}
              </span>

              {/* Diff sign (+ / -) */}
              <span className={`w-5 shrink-0 text-center py-0.5 select-none ${signColor}`}>
                {sign}
              </span>

              {/* Code line content */}
              <pre className="flex-1 py-0.5 pr-4 whitespace-pre font-mono overflow-visible">
                {line.text || ' '}
              </pre>
            </div>
          )
        })}
      </div>
    </div>
  )
}
